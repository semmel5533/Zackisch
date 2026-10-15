import { httpRouter } from "convex/server";
import { components, internal } from "./_generated/api";
import { registerRoutes } from "@convex-dev/stripe";
import { auth } from "./auth";
import type Stripe from "stripe";

const http = httpRouter();

auth.addHttpRoutes(http);

function extractItemsFromMetadata(meta: Record<string, any>): string {
  if (meta.items) return meta.items;
  let itemsStr = "";
  let i = 0;
  while (meta[`items_${i}`]) {
    itemsStr += meta[`items_${i}`];
    i++;
  }
  return itemsStr || "[]";
}

registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "checkout.session.completed": async (
      ctx,
      event: Stripe.CheckoutSessionCompletedEvent,
    ) => {
      const session = event.data.object;
      if (session.payment_status !== "paid") return;
      const metadata = session.metadata || {};
      const organizationId = metadata.organizationId as any;
      if (organizationId) {
        const total =
          session.amount_total || parseInt(metadata.total || "0", 10);
        const currency = (
          session.currency ||
          metadata.currency ||
          "EUR"
        ).toUpperCase();
        const items = extractItemsFromMetadata(metadata);
        const piId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined;

        await ctx.runMutation(internal.orders.createPaidOrderFromWebhook, {
          organizationId,
          tableNumber: metadata.tableNumber || undefined,
          type: (metadata.type as any) || "takeaway",
          items,
          total,
          email:
            metadata.email ||
            session.customer_details?.email ||
            session.customer_email ||
            "",
          stripePaymentId: piId || session.id,
          stripeSessionId: session.id,
          currency,
        });
      }
    },
    "payment_intent.succeeded": async (
      ctx,
      event: Stripe.PaymentIntentSucceededEvent,
    ) => {
      const paymentIntent = event.data.object;
      const metadata = paymentIntent.metadata || {};
      const organizationId = metadata.organizationId as any;
      if (organizationId) {
        const total = parseInt(
          metadata.total || String(paymentIntent.amount),
          10,
        );
        const currency =
          metadata.currency || paymentIntent.currency.toUpperCase();
        const items = extractItemsFromMetadata(metadata);

        await ctx.runMutation(internal.orders.createPaidOrderFromWebhook, {
          organizationId,
          tableNumber: metadata.tableNumber || undefined,
          type: (metadata.type as any) || "dine-in",
          items,
          total,
          email: metadata.email || "",
          stripePaymentId: paymentIntent.id,
          currency,
        });
      }
    },
  },
});

import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// CORS Preflights
http.route({
  path: "/api/newsletter/subscribe",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

http.route({
  path: "/api/newsletter/confirm",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

http.route({
  path: "/api/newsletter/unsubscribe",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

// 1. Subscribe endpoint (called from marketing website / footer form)
http.route({
  path: "/api/newsletter/subscribe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const res = await ctx.runMutation(api.newsletter.subscribe, {
        email: body.email || "",
        regionId: body.regionId || "de",
        locale: body.locale || "de",
        source: body.source || "website",
      });
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

// 2. Double-Opt-In Confirm endpoint
http.route({
  path: "/api/newsletter/confirm",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const token = body.token || "";
      const res = await ctx.runMutation(api.newsletter.confirmSubscription, { token });
      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

// 3. Unsubscribe endpoint (RFC 8058 One-Click + Web Client)
http.route({
  path: "/api/newsletter/unsubscribe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const url = new URL(request.url);
      let token = url.searchParams.get("token") || "";
      let email = url.searchParams.get("email") || "";
      let regionId = url.searchParams.get("regionId") || "de";

      const contentType = request.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const body = await request.json().catch(() => ({}));
        if (body.token) token = body.token;
        if (body.email) email = body.email;
        if (body.regionId) regionId = body.regionId;
      }

      const res = await ctx.runMutation(api.newsletter.unsubscribe, {
        token: token || undefined,
        email: email || undefined,
        regionId,
      });

      return new Response(JSON.stringify(res), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ success: false, message: err.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }),
});

// 4. Fallback GET handler for direct link unsubscriptions
http.route({
  path: "/api/newsletter/unsubscribe",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token") || "";
    if (token) {
      await ctx.runMutation(api.newsletter.unsubscribe, { token });
    }
    return new Response(
      `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Zackisch Newsletter</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #fafafa;">
  <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center; max-width: 400px;">
    <h2 style="margin: 0 0 12px; font-size: 20px;">Erfolgreich abgemeldet</h2>
    <p style="color: #666; font-size: 14px; margin: 0 0 24px; line-height: 1.5;">Du erhältst ab sofort keine weiteren Marketing-Nachrichten mehr von Zackisch.</p>
    <a href="https://zackisch.com" style="display: inline-block; padding: 10px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 9999px; font-size: 14px; font-weight: 600;">Zurück zur Startseite</a>
  </div>
</body>
</html>`,
      {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }),
});

export default http;
