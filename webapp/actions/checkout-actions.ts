"use server";

import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { headers } from "next/headers";

interface CreateCheckoutSessionParams {
  organizationId: string;
  type: "dine-in" | "takeaway";
  tableNumber?: string;
  items: any[];
  total: number;
  email?: string;
}

export async function createCheckoutSessionAction(params: CreateCheckoutSessionParams) {
  if (!params.organizationId) {
    return { error: "Betriebs-ID fehlt." };
  }
  const cleanEmail = params.email?.trim() || "";
  if (cleanEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 100)) {
    return { error: "Ungültige E-Mail-Adresse." };
  }
  if (!params.total || params.total <= 0 || params.total > 1000000) {
    return { error: "Ungültiger Gesamtbetrag." };
  }
  if (params.tableNumber && params.tableNumber.length > 4) {
    return { error: "Die Tischnummer darf maximal 4 Zeichen lang sein." };
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
      email: cleanEmail || undefined,
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

    // Fallback: If webhook hasn't fired yet, verify with Stripe directly via Convex Action
    const orderId = await convexServer.action(api.stripe.verifyPaymentAndCreateOrder, {
      sessionId: identifier.startsWith("cs_") ? identifier : undefined,
      paymentIntentId: identifier.startsWith("pi_") ? identifier : undefined,
    });

    if (orderId) {
      const created = await convexServer.query(api.orders.getOrder, { id: orderId });
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

    return { order: null };
  } catch (error: any) {
    console.error("getOrderBySessionAction failed:", error);
    return { error: error.message, order: null };
  }
}

export const getOrderByPaymentIntentAction = getOrderBySessionAction;
