"use server";

import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { headers } from "next/headers";
import Stripe from "stripe";

interface CreateCheckoutSessionParams {
  organizationId: string;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  items: any[];
  total: number;
  email: string;
}

export async function createCheckoutSessionAction(params: CreateCheckoutSessionParams) {
  if (!params.organizationId) {
    return { error: "Betriebs-ID fehlt." };
  }
  if (!params.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email.trim()) || params.email.length > 100) {
    return { error: "Ungültige E-Mail-Adresse." };
  }
  if (!params.total || params.total <= 0 || params.total > 1000000) {
    return { error: "Ungültiger Gesamtbetrag." };
  }
  if (params.tableNumber && params.tableNumber.length > 20) {
    return { error: "Die Tischnummer darf maximal 20 Zeichen lang sein." };
  }

  try {
    const reqHeaders = await headers();
    const host = reqHeaders.get("host") || "localhost:3000";
    const proto = reqHeaders.get("x-forwarded-proto") || "http";
    const origin = reqHeaders.get("origin") || `${proto}://${host}`;

    const res = await convexServer.action(api.stripe.createCheckoutSession, {
      organizationId: params.organizationId as Id<"organizations">,
      type: params.type,
      tableNumber: params.tableNumber,
      items: JSON.stringify(params.items),
      total: params.total,
      email: params.email,
      origin,
    });

    if (res.error) {
      return { error: res.error };
    }

    return {
      clientSecret: res.clientSecret,
      sessionId: res.sessionId,
      paymentIntentId: res.sessionId,
    };
  } catch (error: any) {
    console.error("createCheckoutSessionAction failed:", error);
    return { error: error.message || "Failed to create checkout session" };
  }
}

export const createPaymentIntentAction = createCheckoutSessionAction;

export async function getOrderBySessionAction(identifier: string) {
  if (!identifier) {
    return { error: "Keine Sitzungs-ID angegeben.", order: null };
  }

  try {
    const doc = await convexServer.query(api.orders.getOrderByPaymentIntent, {
      stripePaymentId: identifier,
    });

    if (doc) {
      return {
        order: {
          ...doc,
          $id: doc._id,
          $createdAt: new Date(doc._creationTime).toISOString(),
        },
      };
    }

    // Fallback: If webhook hasn't fired yet, verify with Stripe directly
    if (process.env.STRIPE_SECRET_KEY && identifier) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-07-29.dahlia" as any,
      });

      if (identifier.startsWith("cs_")) {
        const session = await stripe.checkout.sessions.retrieve(identifier);
        if (session && (session.status === "complete" || session.payment_status === "paid")) {
          const metadata = session.metadata || {};
          const organizationId = metadata.organizationId as any;

          if (organizationId) {
            const total = session.amount_total || parseInt(metadata.total || "0", 10);
            const currency = (session.currency || metadata.currency || "EUR").toUpperCase();
            const piId = typeof session.payment_intent === "string" ? session.payment_intent : undefined;

            const newOrderRes = await convexServer.mutation(api.orders.createOrder, {
              organizationId,
              tableNumber: metadata.tableNumber || undefined,
              type: (metadata.type as any) || "dine-in",
              items: metadata.items || "[]",
              total,
              email: metadata.email || session.customer_details?.email || session.customer_email || "",
              stripePaymentId: piId || session.id,
              stripeSessionId: session.id,
              zakkigFee: Math.round(total * 0.01),
              stripeFee: 0,
              netAmount: total - Math.round(total * 0.01),
              currency,
            });

            const created = await convexServer.query(api.orders.getOrder, { id: newOrderRes._id });
            if (created) {
              return {
                order: {
                  ...created,
                  $id: created._id,
                  $createdAt: new Date(created._creationTime).toISOString(),
                },
              };
            }
          }
        }
      } else if (identifier.startsWith("pi_")) {
        const paymentIntent = await stripe.paymentIntents.retrieve(identifier);
        if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
          const metadata = paymentIntent.metadata || {};
          const organizationId = metadata.organizationId as any;

          if (organizationId) {
            const total = parseInt(metadata.total || String(paymentIntent.amount), 10);
            const currency = metadata.currency || paymentIntent.currency.toUpperCase();

            const newOrderRes = await convexServer.mutation(api.orders.createOrder, {
              organizationId,
              tableNumber: metadata.tableNumber || undefined,
              type: (metadata.type as any) || "dine-in",
              items: metadata.items || "[]",
              total,
              email: metadata.email || "",
              stripePaymentId: paymentIntent.id,
              zakkigFee: Math.round(total * 0.01),
              stripeFee: 0,
              netAmount: total - Math.round(total * 0.01),
              currency,
            });

            const created = await convexServer.query(api.orders.getOrder, { id: newOrderRes._id });
            if (created) {
              return {
                order: {
                  ...created,
                  $id: created._id,
                  $createdAt: new Date(created._creationTime).toISOString(),
                },
              };
            }
          }
        }
      }
    }

    return { order: null };
  } catch (error: any) {
    console.error("getOrderBySessionAction failed:", error);
    return { error: error.message, order: null };
  }
}

export const getOrderByPaymentIntentAction = getOrderBySessionAction;
