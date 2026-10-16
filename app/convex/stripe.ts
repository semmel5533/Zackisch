"use node";

import { action } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import Stripe from "stripe";
import {
  calculatePlatformFeeBreakdown,
  calculateProportionalFeeRefund,
  priceCheckout,
} from "./checkoutPricing";

function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY in Convex environment");
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia" as any,
  });
}

async function createConnectV2Account(
  stripe: Stripe,
  org: {
    name: string;
    legalName?: string;
    contactEmail?: string;
    region?: string;
    currency?: string;
  },
  dashboardMode: "none" | "full" = "none",
): Promise<{
  accountId: string;
  dashboardType: string;
  feeCollector: string;
  lossCollector: string;
}> {
  const country = (org.region || "de").toLowerCase();
  const currency = (org.currency || "eur").toLowerCase();

  try {
    const v2Account = await stripe.v2.core.accounts.create({
      contact_email: org.contactEmail || "merchant@zackisch.com",
      display_name: org.name,
      dashboard: dashboardMode,
      identity: {
        country: country as any,
        entity_type: "company",
        ...(org.legalName
          ? { business_details: { registered_name: org.legalName } }
          : {}),
      },
      configuration: {
        merchant: {
          capabilities: {
            card_payments: { requested: true },
          },
        },
      },
      defaults: {
        currency: currency as any,
        responsibilities: {
          fees_collector: "stripe",
          losses_collector: "stripe",
        },
      },
      include: [
        "configuration.merchant",
        "identity",
        "requirements",
        "defaults",
      ],
    });

    return {
      accountId: v2Account.id,
      dashboardType: v2Account.dashboard || dashboardMode,
      feeCollector:
        v2Account.defaults?.responsibilities?.fees_collector || "stripe",
      lossCollector:
        v2Account.defaults?.responsibilities?.losses_collector || "stripe",
    };
  } catch (v2Err: any) {
    // Fallback to dashboard: "full" on Accounts v2 if "none" is rejected by a specific capability policy
    if (dashboardMode === "none") {
      const v2Full = await stripe.v2.core.accounts.create({
        contact_email: org.contactEmail || "merchant@zackisch.com",
        display_name: org.name,
        dashboard: "full",
        identity: {
          country: country as any,
          entity_type: "company",
          ...(org.legalName
            ? { business_details: { registered_name: org.legalName } }
            : {}),
        },
        configuration: {
          merchant: {
            capabilities: {
              card_payments: { requested: true },
            },
          },
        },
        defaults: {
          currency: currency as any,
          responsibilities: {
            fees_collector: "stripe",
            losses_collector: "stripe",
          },
        },
        include: [
          "configuration.merchant",
          "identity",
          "requirements",
          "defaults",
        ],
      });
      return {
        accountId: v2Full.id,
        dashboardType: v2Full.dashboard || "full",
        feeCollector:
          v2Full.defaults?.responsibilities?.fees_collector || "stripe",
        lossCollector:
          v2Full.defaults?.responsibilities?.losses_collector || "stripe",
      };
    }
    throw v2Err;
  }
}

export const createEmbeddedAccountSession = action({
  args: {
    organizationId: v.id("organizations"),
    dashboardMode: v.optional(v.union(v.literal("none"), v.literal("full"))),
  },
  returns: v.object({
    clientSecret: v.optional(v.string()),
    accountId: v.optional(v.string()),
    dashboardType: v.optional(v.string()),
    feeCollector: v.optional(v.string()),
    lossCollector: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    clientSecret?: string;
    accountId?: string;
    dashboardType?: string;
    feeCollector?: string;
    lossCollector?: string;
    error?: string;
  }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org) throw new Error("Betrieb nicht gefunden.");

      const stripe = getStripeClient();
      let accountId: string | undefined = org.stripeAccountId;
      let dashboardType: string = org.stripeDashboardType || args.dashboardMode || "none";
      let feeCollector: string = org.stripeFeeCollector || "stripe";
      let lossCollector: string = org.stripeLossCollector || "stripe";

      if (!accountId || accountId.startsWith("acct_test_")) {
        const created = await createConnectV2Account(
          stripe,
          org,
          args.dashboardMode || "none",
        );
        accountId = created.accountId;
        dashboardType = created.dashboardType;
        feeCollector = created.feeCollector;
        lossCollector = created.lossCollector;

        await ctx.runMutation(api.organizations.update, {
          id: args.organizationId,
          stripeAccountId: accountId,
          stripeDashboardType: dashboardType,
          stripeFeeCollector: feeCollector,
          stripeLossCollector: lossCollector,
          stripeConnectedAt: Date.now(),
          stripeRequirementsStatus: "currently_due",
        });
      }

      const accountSession = await stripe.accountSessions.create({
        account: accountId!,
        components: {
          account_onboarding: { enabled: true },
          account_management: { enabled: true },
          payments: { enabled: true },
          payouts: { enabled: true },
        },
      });

      return {
        clientSecret: accountSession.client_secret,
        accountId,
        dashboardType,
        feeCollector,
        lossCollector,
      };
    } catch (e: any) {
      console.error("createEmbeddedAccountSession error:", e);
      return {
        error:
          e.message ||
          "Stripe Embedded Onboarding konnte nicht initialisiert werden.",
      };
    }
  },
});

export const connectStripe = action({
  args: {
    organizationId: v.id("organizations"),
    origin: v.string(),
  },
  returns: v.object({
    url: v.optional(v.string()),
    accountId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ url?: string; accountId?: string; error?: string }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org) throw new Error("Organization not found");

      const stripe = getStripeClient();
      let accountId: string | undefined = org.stripeAccountId;

      if (!accountId || accountId.startsWith("acct_test_")) {
        const created = await createConnectV2Account(stripe, org, "none");
        accountId = created.accountId;

        await ctx.runMutation(api.organizations.update, {
          id: args.organizationId,
          stripeAccountId: accountId,
          stripeDashboardType: created.dashboardType,
          stripeFeeCollector: created.feeCollector,
          stripeLossCollector: created.lossCollector,
          stripeConnectedAt: Date.now(),
        });
      }

      const accountLink = await stripe.accountLinks.create({
        account: accountId!,
        refresh_url: `${args.origin}/dashboard/${args.organizationId}/settings`,
        return_url: `${args.origin}/dashboard/${args.organizationId}/settings/stripe-return`,
        type: "account_onboarding",
      });

      return { url: accountLink.url, accountId };
    } catch (e: any) {
      console.error("connectStripe error:", e);
      return { error: e.message || "Failed to connect Stripe" };
    }
  },
});

export const getStripeAccountStatus = action({
  args: { organizationId: v.id("organizations") },
  returns: v.object({
    isConnected: v.boolean(),
    isOnboardingComplete: v.boolean(),
    chargesEnabled: v.optional(v.boolean()),
    payoutsEnabled: v.optional(v.boolean()),
    requirementsStatus: v.optional(v.string()),
    currentlyDue: v.optional(v.array(v.string())),
    pastDue: v.optional(v.array(v.string())),
    feeCollector: v.optional(v.string()),
    lossCollector: v.optional(v.string()),
    dashboardType: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    isConnected: boolean;
    isOnboardingComplete: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    requirementsStatus?: string;
    currentlyDue?: string[];
    pastDue?: string[];
    feeCollector?: string;
    lossCollector?: string;
    dashboardType?: string;
    error?: string;
  }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org || !org.stripeAccountId) {
        return { isConnected: false, isOnboardingComplete: false };
      }

      const stripe = getStripeClient();
      let chargesEnabled = false;
      let payoutsEnabled = false;
      let requirementsStatus = "currently_due";
      let currentlyDue: string[] = [];
      let pastDue: string[] = [];
      let disabledReason: string | undefined;
      let feeCollector = org.stripeFeeCollector || "stripe";
      let lossCollector = org.stripeLossCollector || "stripe";
      let dashboardType = org.stripeDashboardType || "none";

      try {
        const v2Acc = await stripe.v2.core.accounts.retrieve(
          org.stripeAccountId,
          {
            include: [
              "configuration.merchant",
              "identity",
              "requirements",
              "defaults",
            ],
          },
        );
        const cardStatus =
          v2Acc.configuration?.merchant?.capabilities?.card_payments?.status;
        const payoutStatus =
          v2Acc.configuration?.merchant?.capabilities?.stripe_balance?.payouts
            ?.status;
        chargesEnabled = cardStatus === "active";
        payoutsEnabled = payoutStatus === "active";
        const minDeadline =
          v2Acc.requirements?.summary?.minimum_deadline?.status;
        const entries = v2Acc.requirements?.entries || [];
        currentlyDue = entries
          .filter((e: any) => e.minimum_deadline?.status === "currently_due")
          .map((e: any) => String(e.description || e.reference || "kyc_field"));
        pastDue = entries
          .filter((e: any) => e.minimum_deadline?.status === "past_due")
          .map((e: any) => String(e.description || e.reference || "kyc_field"));
        requirementsStatus = chargesEnabled
          ? "active"
          : minDeadline || (pastDue.length > 0 ? "past_due" : "currently_due");
        feeCollector =
          v2Acc.defaults?.responsibilities?.fees_collector || "stripe";
        lossCollector =
          v2Acc.defaults?.responsibilities?.losses_collector || "stripe";
        dashboardType = v2Acc.dashboard || dashboardType;
      } catch {
        const account = await stripe.accounts.retrieve(org.stripeAccountId);
        chargesEnabled = Boolean(
          account.charges_enabled ||
            account.capabilities?.card_payments === "active",
        );
        payoutsEnabled = Boolean(
          account.payouts_enabled ||
            account.capabilities?.transfers === "active",
        );
        currentlyDue = account.requirements?.currently_due || [];
        pastDue = account.requirements?.past_due || [];
        disabledReason = account.requirements?.disabled_reason || undefined;
        requirementsStatus = chargesEnabled
          ? "active"
          : disabledReason
            ? "restricted"
            : pastDue.length > 0
              ? "past_due"
              : "currently_due";
      }

      const isComplete = Boolean(
        chargesEnabled || org.stripeOnboardingComplete,
      );

      await ctx.runMutation(
        internal.organizations.syncStripeAccountStatusInternal,
        {
          organizationId: args.organizationId,
          stripeAccountId: org.stripeAccountId,
          stripeOnboardingComplete: isComplete,
          stripeChargesEnabled: chargesEnabled || isComplete,
          stripePayoutsEnabled: payoutsEnabled || isComplete,
          stripeRequirementsStatus: isComplete ? "active" : requirementsStatus,
          stripeCurrentlyDue: currentlyDue,
          stripePastDue: pastDue,
          stripeDisabledReason: disabledReason,
          stripeFeeCollector: feeCollector,
          stripeLossCollector: lossCollector,
          stripeDashboardType: dashboardType,
        },
      );

      return {
        isConnected: true,
        isOnboardingComplete: isComplete,
        chargesEnabled: chargesEnabled || isComplete,
        payoutsEnabled: payoutsEnabled || isComplete,
        requirementsStatus: isComplete ? "active" : requirementsStatus,
        currentlyDue,
        pastDue,
        feeCollector,
        lossCollector,
        dashboardType,
      };
    } catch (e: any) {
      console.error("getStripeAccountStatus error:", e);
      return {
        isConnected: false,
        isOnboardingComplete: false,
        error: e.message,
      };
    }
  },
});

export const createStripeDashboardLink = action({
  args: {
    organizationId: v.id("organizations"),
    origin: v.string(),
  },
  returns: v.object({
    url: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{ url?: string; error?: string }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org || !org.stripeAccountId)
        throw new Error("No Stripe account connected");

      const stripe = getStripeClient();
      try {
        const loginLink = await stripe.accounts.createLoginLink(
          org.stripeAccountId,
        );
        return { url: loginLink.url };
      } catch {
        const accountLink = await stripe.accountLinks.create({
          account: org.stripeAccountId,
          refresh_url: `${args.origin}/dashboard/${args.organizationId}/settings`,
          return_url: `${args.origin}/dashboard/${args.organizationId}/settings`,
          type: "account_onboarding",
        });
        return { url: accountLink.url };
      }
    } catch (e: any) {
      console.error("createStripeDashboardLink error:", e);
      return { error: e.message };
    }
  },
});

export const completeTestStripeOnboarding = action({
  args: { organizationId: v.id("organizations") },
  returns: v.object({
    success: v.boolean(),
    accountId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; accountId?: string; error?: string }> => {
    try {
      const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
      if (!isTestMode) {
        return {
          success: false,
          error:
            "Test-Onboarding ist ausschließlich in der Stripe-Sandbox zulässig.",
        };
      }

      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org) throw new Error("Organization not found");

      const stripe = getStripeClient();
      let accountId = org.stripeAccountId;
      let dashboardType = org.stripeDashboardType || "none";
      let feeCollector = org.stripeFeeCollector || "stripe";
      let lossCollector = org.stripeLossCollector || "stripe";

      if (!accountId || accountId.startsWith("acct_test_")) {
        const created = await createConnectV2Account(stripe, org, "none");
        accountId = created.accountId;
        dashboardType = created.dashboardType;
        feeCollector = created.feeCollector;
        lossCollector = created.lossCollector;
      }

      await ctx.runMutation(api.organizations.update, {
        id: args.organizationId,
        stripeAccountId: accountId,
        stripeOnboardingComplete: true,
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
        stripeRequirementsStatus: "active",
        stripeDashboardType: dashboardType,
        stripeFeeCollector: feeCollector,
        stripeLossCollector: lossCollector,
        stripeConnectedAt: org.stripeConnectedAt || Date.now(),
        stripeLastSyncedAt: Date.now(),
      });

      return { success: true, accountId };
    } catch (e: any) {
      console.error("completeTestStripeOnboarding error:", e);
      return { success: false, error: e.message };
    }
  },
});

function packItemsIntoMetadata(
  items: string,
  metadata: Record<string, string>,
) {
  if (items.length <= 500) {
    metadata.items = items;
  } else {
    const chunkSize = 480;
    let chunkIndex = 0;
    for (let i = 0; i < items.length; i += chunkSize) {
      metadata[`items_${chunkIndex}`] = items.slice(i, i + chunkSize);
      chunkIndex++;
    }
  }
}

export function extractItemsFromMetadata(meta: Record<string, any>): string {
  if (meta.items) return meta.items;
  let itemsStr = "";
  let i = 0;
  while (meta[`items_${i}`]) {
    itemsStr += meta[`items_${i}`];
    i++;
  }
  return itemsStr || "[]";
}

/**
 * Creates a Direct Charge Checkout Session directly on the restaurant's Stripe Connected Account.
 * Strictly fails closed if the restaurant is paused, unlinked, or not onboarded.
 * Never falls back to charging the Zackisch platform account.
 */
export const createCheckoutSession = action({
  args: {
    organizationId: v.id("organizations"),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    tableNumber: v.optional(v.string()),
    items: v.string(), // JSON string
    total: v.number(), // in cents (goods subtotal, or total including tip if tipCents provided)
    tipCents: v.optional(v.number()),
    discountCents: v.optional(v.number()),
    email: v.optional(v.string()),
    currency: v.optional(v.string()),
    origin: v.optional(v.string()),
  },
  returns: v.object({
    clientSecret: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    stripeAccountId: v.optional(v.string()),
    applicationFeeCents: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    clientSecret?: string;
    sessionId?: string;
    stripeAccountId?: string;
    applicationFeeCents?: number;
    error?: string;
  }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org) return { error: "Gastronomiebetrieb nicht gefunden." };
      if (org.isPaused) {
        return {
          error:
            org.pauseReason ||
            "Die digitale Bestellannahme für diesen Betrieb ist vorübergehend pausiert.",
        };
      }
      if (
        !org.stripeAccountId ||
        org.stripeAccountId.startsWith("acct_test_") ||
        !org.stripeOnboardingComplete
      ) {
        return {
          error:
            "Online-Zahlungen sind für diesen Betrieb noch nicht freigeschaltet (Stripe Connect Onboarding ausstehend).",
        };
      }

      if (
        !Number.isInteger(args.total) ||
        args.total <= 0 ||
        args.total > 1000000
      ) {
        return { error: "Ungültiger Gesamtbetrag." };
      }

      const tipCents = args.tipCents ?? 0;
      const discountCents = args.discountCents ?? 0;
      if (
        !Number.isInteger(tipCents) ||
        tipCents < 0 ||
        !Number.isInteger(discountCents) ||
        discountCents < 0
      ) {
        return { error: "Ungültiger Trinkgeld- oder Rabattbetrag." };
      }

      const cleanEmail = args.email?.trim() || "";
      if (cleanEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
          return { error: "Ungültige E-Mail-Adresse." };
        }
      }

      if (args.tableNumber && args.tableNumber.length > 4) {
        return { error: "Ungültige Tischnummer." };
      }

      const menuItems = await ctx.runQuery(api.menu.getItems, {
        organizationId: args.organizationId,
      });
      const pricedItems = priceCheckout(args.items, menuItems, args.total);

      // 2% Zackisch platform fee on eligible gross goods/services excluding tips, VAT-inclusive
      const feeBreakdown = calculatePlatformFeeBreakdown(args.total, {
        tipCents,
        discountCents,
      });

      const stripe = getStripeClient();
      const curr = (org.currency || "eur").toLowerCase();

      const metadata: Record<string, string> = {
        organizationId: args.organizationId,
        connectedAccountId: org.stripeAccountId,
        tableNumber: args.tableNumber || "",
        type: args.type,
        email: cleanEmail,
        eligibleSubtotalCents: String(feeBreakdown.eligibleSubtotalCents),
        tipCents: String(feeBreakdown.tipCents),
        discountCents: String(feeBreakdown.discountCents),
        applicationFeeCents: String(feeBreakdown.platformFeeGrossCents),
        total: String(feeBreakdown.totalChargeCents),
        currency: curr.toUpperCase(),
      };
      packItemsIntoMetadata(JSON.stringify(pricedItems), metadata);

      const origin =
        args.origin ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "http://localhost:3001";
      const returnUrl = `${origin}/${args.type === "dine-in" ? "table" : "pickup"}/${args.organizationId}/success?session_id={CHECKOUT_SESSION_ID}`;

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: curr,
            unit_amount: feeBreakdown.eligibleSubtotalCents,
            product_data: {
              name: `Bestellung bei ${org.legalName || org.name}`,
            },
          },
          quantity: 1,
        },
      ];

      if (feeBreakdown.tipCents > 0) {
        lineItems.push({
          price_data: {
            currency: curr,
            unit_amount: feeBreakdown.tipCents,
            product_data: {
              name: "Freiwilliges Trinkgeld (0 % Zackisch-Provision)",
            },
          },
          quantity: 1,
        });
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        ui_mode: "elements",
        mode: "payment",
        ...(cleanEmail ? { customer_email: cleanEmail } : {}),
        line_items: lineItems,
        return_url: returnUrl,
        metadata,
        payment_intent_data: {
          application_fee_amount: feeBreakdown.platformFeeGrossCents,
          metadata,
        },
      };

      // Direct Charge on the restaurant's Stripe Connected Account (Seller of Record)
      const session = await stripe.checkout.sessions.create(sessionParams, {
        stripeAccount: org.stripeAccountId,
      });

      return {
        clientSecret: session.client_secret ?? undefined,
        sessionId: session.id,
        stripeAccountId: org.stripeAccountId,
        applicationFeeCents: feeBreakdown.platformFeeGrossCents,
      };
    } catch (e: any) {
      console.error("createCheckoutSession Direct Charge error:", e);
      return {
        error:
          e.message ||
          "Die Zahlungssitzung auf dem Händlerkonto konnte nicht erstellt werden.",
      };
    }
  },
});

/**
 * Creates a Direct Charge PaymentIntent directly on the restaurant's Stripe Connected Account.
 * Strictly fails closed if the restaurant is paused, unlinked, or not onboarded.
 * Never falls back to charging the Zackisch platform account.
 */
export const createPaymentIntent = action({
  args: {
    organizationId: v.id("organizations"),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    tableNumber: v.optional(v.string()),
    items: v.string(), // JSON string
    total: v.number(), // in cents (goods subtotal)
    tipCents: v.optional(v.number()),
    discountCents: v.optional(v.number()),
    email: v.optional(v.string()),
    currency: v.optional(v.string()),
  },
  returns: v.object({
    clientSecret: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()),
    stripeAccountId: v.optional(v.string()),
    applicationFeeCents: v.optional(v.number()),
    totalChargeCents: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    clientSecret?: string;
    paymentIntentId?: string;
    stripeAccountId?: string;
    applicationFeeCents?: number;
    totalChargeCents?: number;
    error?: string;
  }> => {
    try {
      const org: any = await ctx.runQuery(api.organizations.get, {
        id: args.organizationId,
      });
      if (!org) return { error: "Gastronomiebetrieb nicht gefunden." };
      if (org.isPaused) {
        return {
          error:
            org.pauseReason ||
            "Die digitale Bestellannahme für diesen Betrieb ist vorübergehend pausiert.",
        };
      }
      if (
        !org.stripeAccountId ||
        org.stripeAccountId.startsWith("acct_test_") ||
        !org.stripeOnboardingComplete
      ) {
        return {
          error:
            "Online-Zahlungen sind für diesen Betrieb noch nicht freigeschaltet (Stripe Connect Onboarding ausstehend).",
        };
      }

      if (
        !Number.isInteger(args.total) ||
        args.total <= 0 ||
        args.total > 1000000
      ) {
        return { error: "Ungültiger Gesamtbetrag." };
      }

      const tipCents = args.tipCents ?? 0;
      const discountCents = args.discountCents ?? 0;
      if (
        !Number.isInteger(tipCents) ||
        tipCents < 0 ||
        !Number.isInteger(discountCents) ||
        discountCents < 0
      ) {
        return { error: "Ungültiger Trinkgeld- oder Rabattbetrag." };
      }

      const cleanEmail = args.email?.trim() || "";
      if (cleanEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
          return { error: "Ungültige E-Mail-Adresse." };
        }
      }

      if (args.tableNumber && args.tableNumber.length > 4) {
        return { error: "Ungültige Tischnummer." };
      }

      const menuItems = await ctx.runQuery(api.menu.getItems, {
        organizationId: args.organizationId,
      });
      const pricedItems = priceCheckout(args.items, menuItems, args.total);

      // 2% Zackisch platform fee on eligible gross goods/services excluding tips, VAT-inclusive
      const feeBreakdown = calculatePlatformFeeBreakdown(args.total, {
        tipCents,
        discountCents,
      });

      const stripe = getStripeClient();
      const curr = (org.currency || "eur").toLowerCase();

      const metadata: Record<string, string> = {
        organizationId: args.organizationId,
        connectedAccountId: org.stripeAccountId,
        tableNumber: args.tableNumber || "",
        type: args.type,
        email: cleanEmail,
        eligibleSubtotalCents: String(feeBreakdown.eligibleSubtotalCents),
        tipCents: String(feeBreakdown.tipCents),
        discountCents: String(feeBreakdown.discountCents),
        applicationFeeCents: String(feeBreakdown.platformFeeGrossCents),
        total: String(feeBreakdown.totalChargeCents),
        currency: curr.toUpperCase(),
      };
      packItemsIntoMetadata(JSON.stringify(pricedItems), metadata);

      const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
        amount: feeBreakdown.totalChargeCents,
        currency: curr,
        application_fee_amount: feeBreakdown.platformFeeGrossCents,
        automatic_payment_methods: { enabled: true },
        ...(cleanEmail ? { receipt_email: cleanEmail } : {}),
        metadata,
      };

      // Direct Charge on the restaurant's Stripe Connected Account (Seller of Record)
      const paymentIntent = await stripe.paymentIntents.create(
        paymentIntentParams,
        {
          stripeAccount: org.stripeAccountId,
        },
      );

      return {
        clientSecret: paymentIntent.client_secret ?? undefined,
        paymentIntentId: paymentIntent.id,
        stripeAccountId: org.stripeAccountId,
        applicationFeeCents: feeBreakdown.platformFeeGrossCents,
        totalChargeCents: feeBreakdown.totalChargeCents,
      };
    } catch (e: any) {
      console.error("createPaymentIntent Direct Charge error:", e);
      return {
        error:
          e.message ||
          "Die Direktzahlung auf dem Händlerkonto konnte nicht initialisiert werden.",
      };
    }
  },
});

/**
 * Executes a full or partial refund on the connected account's Direct Charge
 * and proportionally reverses the 2% Zackisch application_fee.
 */
export const refundOrder = action({
  args: {
    orderId: v.id("orders"),
    refundAmountCents: v.optional(v.number()),
    reason: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    refundId: v.optional(v.string()),
    refundedAmountCents: v.optional(v.number()),
    refundedFeeCents: v.optional(v.number()),
    error: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    success: boolean;
    refundId?: string;
    refundedAmountCents?: number;
    refundedFeeCents?: number;
    error?: string;
  }> => {
    try {
      const order: any = await ctx.runQuery(api.orders.getOrder, {
        id: args.orderId,
      });
      if (!order) return { success: false, error: "Bestellung nicht gefunden." };
      if (!order.stripePaymentId) {
        return {
          success: false,
          error: "Keine Stripe-Zahlungsreferenz für diese Bestellung vorhanden.",
        };
      }

      const org: any = await ctx.runQuery(api.organizations.get, {
        id: order.organizationId,
      });
      const stripeAccountId = order.connectedAccountId || org?.stripeAccountId;
      if (!stripeAccountId) {
        return {
          success: false,
          error: "Kein verbundenes Stripe-Händlerkonto gefunden.",
        };
      }

      const alreadyRefunded = order.refundedAmountCents ?? 0;
      const remainingRefundable = Math.max(0, order.total - alreadyRefunded);
      const amountToRefund = args.refundAmountCents ?? remainingRefundable;

      if (amountToRefund <= 0 || amountToRefund > remainingRefundable) {
        return {
          success: false,
          error: "Ungültiger Erstattungsbetrag.",
        };
      }

      const originalEligible =
        order.eligibleSubtotalCents ??
        Math.max(0, order.total - (order.tipCents ?? 0));
      const originalFee = Math.round(originalEligible * 0.02);

      const calc = calculateProportionalFeeRefund({
        originalEligibleSubtotalCents: originalEligible,
        originalPlatformFeeCents: originalFee,
        refundAmountCents: amountToRefund,
        alreadyRefundedAmountCents: alreadyRefunded,
        alreadyRefundedFeeCents: order.refundedPlatformFeeCents ?? 0,
        tipCents: order.tipCents ?? 0,
      });

      const stripe = getStripeClient();
      const refund = await stripe.refunds.create(
        {
          payment_intent: order.stripePaymentId,
          amount: amountToRefund,
          refund_application_fee: calc.isFullRefund && alreadyRefunded === 0,
          metadata: {
            orderId: String(order._id),
            orderNumber: order.orderNumber,
            proportionalFeeReversalCents: String(calc.refundFeeCents),
            reason: args.reason || "merchant_requested",
          },
        },
        {
          stripeAccount: stripeAccountId,
        },
      );

      await ctx.runMutation(internal.orders.applyRefundUpdateInternal, {
        stripePaymentId: order.stripePaymentId,
        refundAmountCents: amountToRefund,
      });

      return {
        success: true,
        refundId: refund.id,
        refundedAmountCents: amountToRefund,
        refundedFeeCents: calc.refundFeeCents,
      };
    } catch (e: any) {
      console.error("refundOrder error:", e);
      return {
        success: false,
        error: e.message || "Erstattung fehlgeschlagen.",
      };
    }
  },
});

export const verifyPaymentAndCreateOrder = action({
  args: {
    sessionId: v.optional(v.string()),
    paymentIntentId: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
  },
  returns: v.union(v.null(), v.id("orders")),
  handler: async (ctx, args): Promise<Id<"orders"> | null> => {
    try {
      const stripe = getStripeClient();
      let stripeAccountId: string | undefined;

      if (args.organizationId) {
        const org: any = await ctx.runQuery(api.organizations.get, {
          id: args.organizationId,
        });
        stripeAccountId = org?.stripeAccountId;
      }

      if (args.sessionId) {
        const existing: any = await ctx.runQuery(
          api.orders.getOrderByPaymentIntent,
          {
            stripePaymentId: args.sessionId,
          },
        );
        if (existing) return existing._id;

        const session = stripeAccountId
          ? await stripe.checkout.sessions.retrieve(
              args.sessionId,
              {},
              {
                stripeAccount: stripeAccountId,
              },
            )
          : await stripe.checkout.sessions.retrieve(args.sessionId);

        if (session.payment_status !== "paid") {
          return null;
        }

        const meta = session.metadata;
        if (!meta || !meta.organizationId) return null;

        const items = extractItemsFromMetadata(meta);
        const piId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : undefined;

        const orderId = await ctx.runMutation(
          internal.orders.createPaidOrderFromWebhook,
          {
            organizationId: meta.organizationId as any,
            tableNumber: meta.tableNumber || undefined,
            type: (meta.type as any) || "takeaway",
            items,
            total: session.amount_total || parseInt(meta.total || "0", 10),
            tipCents: meta.tipCents ? parseInt(meta.tipCents, 10) : 0,
            discountCents: meta.discountCents
              ? parseInt(meta.discountCents, 10)
              : 0,
            connectedAccountId: meta.connectedAccountId || stripeAccountId,
            email:
              meta.email ||
              session.customer_details?.email ||
              session.customer_email ||
              "",
            stripePaymentId: piId || session.id,
            stripeSessionId: session.id,
            currency: (
              session.currency ||
              meta.currency ||
              "EUR"
            ).toUpperCase(),
          },
        );

        return orderId;
      }

      if (args.paymentIntentId) {
        const existing: any = await ctx.runQuery(
          api.orders.getOrderByPaymentIntent,
          {
            stripePaymentId: args.paymentIntentId,
          },
        );
        if (existing) return existing._id;

        const pi = stripeAccountId
          ? await stripe.paymentIntents.retrieve(
              args.paymentIntentId,
              {},
              {
                stripeAccount: stripeAccountId,
              },
            )
          : await stripe.paymentIntents.retrieve(args.paymentIntentId);

        if (pi.status !== "succeeded") {
          return null;
        }

        const meta = pi.metadata;
        if (!meta || !meta.organizationId) return null;

        const items = extractItemsFromMetadata(meta);

        const orderId = await ctx.runMutation(
          internal.orders.createPaidOrderFromWebhook,
          {
            organizationId: meta.organizationId as any,
            tableNumber: meta.tableNumber || undefined,
            type: (meta.type as any) || "takeaway",
            items,
            total: pi.amount,
            tipCents: meta.tipCents ? parseInt(meta.tipCents, 10) : 0,
            discountCents: meta.discountCents
              ? parseInt(meta.discountCents, 10)
              : 0,
            connectedAccountId: meta.connectedAccountId || stripeAccountId,
            email: meta.email || pi.receipt_email || "",
            stripePaymentId: pi.id,
            currency: pi.currency.toUpperCase(),
          },
        );

        return orderId;
      }

      return null;
    } catch (e) {
      console.error("verifyPaymentAndCreateOrder error:", e);
      return null;
    }
  },
});
