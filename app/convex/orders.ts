import { getAuthUserId } from "@convex-dev/auth/server";
import {
  calculateItemTaxBreakdown,
  calculatePlatformFeeBreakdown,
  calculateProportionalFeeRefund,
} from "./checkoutPricing";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

const orderObjectValidator = v.object({
  _id: v.id("orders"),
  _creationTime: v.number(),
  businessId: v.id("businesses"),
  tableNumber: v.optional(v.string()),
  type: v.union(v.literal("dine-in"), v.literal("takeaway")),
  items: v.string(),
  total: v.number(),
  status: v.union(
    v.literal("in_progress"),
    v.literal("ready_for_pickup"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  completedAt: v.optional(v.number()),
  readyAt: v.optional(v.number()),
  createdAt: v.optional(v.number()),
  email: v.string(),
  orderNumber: v.string(),
  stripePaymentId: v.optional(v.string()),
  stripeSessionId: v.optional(v.string()),
  connectedAccountId: v.optional(v.string()),
  paymentStatus: v.optional(
    v.union(
      v.literal("paid"),
      v.literal("partially_refunded"),
      v.literal("refunded"),
      v.literal("disputed"),
      v.literal("failed")
    )
  ),
  eligibleSubtotalCents: v.optional(v.number()),
  tipCents: v.optional(v.number()),
  discountCents: v.optional(v.number()),
  tax7NetCents: v.optional(v.number()),
  tax7VatCents: v.optional(v.number()),
  tax19NetCents: v.optional(v.number()),
  tax19VatCents: v.optional(v.number()),
  zakkigFee: v.number(),
  zackischFee: v.optional(v.number()),
  platformFeeGrossCents: v.optional(v.number()),
  platformFeeNetCents: v.optional(v.number()),
  platformFeeVatCents: v.optional(v.number()),
  platformFeeVatRate: v.optional(v.number()),
  stripeFee: v.number(),
  netAmount: v.number(),
  refundedAmountCents: v.optional(v.number()),
  refundedPlatformFeeCents: v.optional(v.number()),
  disputeStatus: v.optional(v.string()),
  disputeId: v.optional(v.string()),
  posRecordingStatus: v.optional(
    v.union(v.literal("pending"), v.literal("recorded"))
  ),
  posRecordedAt: v.optional(v.number()),
  posRecordedBy: v.optional(v.string()),
  posReference: v.optional(v.string()),
  confirmationToken: v.optional(v.string()),
  isTestOrder: v.optional(v.boolean()),
  sellerSnapshot: v.optional(v.string()),
  currency: v.string(),
});

async function verifyBusinessOrSessionAccess(
  ctx: { db: any; auth: any },
  businessId: any,
  sessionToken?: string
): Promise<{ authorized: boolean; actorLabel: string }> {
  const userId = await getAuthUserId(ctx as any);
  if (userId) {
    const business = await ctx.db.get(businessId);
    if (business && business.ownerId === userId) {
      return { authorized: true, actorLabel: `owner:${userId}` };
    }
  }
  if (sessionToken) {
    const staffSession = await ctx.db
      .query("staffSessions")
      .withIndex("by_token", (q: any) => q.eq("token", sessionToken))
      .first();
    if (staffSession && staffSession.businessId === businessId) {
      return { authorized: true, actorLabel: "staff_tablet" };
    }
    const orderSession = await ctx.db
      .query("orderSessions")
      .withIndex("by_token", (q: any) => q.eq("token", sessionToken))
      .first();
    if (orderSession && orderSession.businessId === businessId) {
      return { authorized: true, actorLabel: "order_terminal" };
    }
  }
  return { authorized: false, actorLabel: "anonymous" };
}

export const getLiveOrders = query({
  args: {
    businessId: v.id("businesses"),
    sessionToken: v.optional(v.string()),
  },
  returns: v.array(orderObjectValidator),
  handler: async (ctx, args) => {
    const inProgress = await ctx.db
      .query("orders")
      .withIndex("by_businessId_and_status", (q) =>
        q.eq("businessId", args.businessId).eq("status", "in_progress")
      )
      .order("desc")
      .collect();

    const readyForPickup = await ctx.db
      .query("orders")
      .withIndex("by_businessId_and_status", (q) =>
        q
          .eq("businessId", args.businessId)
          .eq("status", "ready_for_pickup")
      )
      .order("desc")
      .collect();

    return [...inProgress, ...readyForPickup];
  },
});

export const getOrders = query({
  args: {
    businessId: v.id("businesses"),
    status: v.optional(
      v.union(
        v.literal("in_progress"),
        v.literal("ready_for_pickup"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    sessionToken: v.optional(v.string()),
  },
  returns: v.array(orderObjectValidator),
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_businessId_and_status", (q) =>
          q.eq("businessId", args.businessId).eq("status", args.status!)
        )
        .order("desc")
        .take(100);
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .order("desc")
      .take(100);
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  returns: v.union(v.null(), orderObjectValidator),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;
    return {
      ...order,
      zakkigFee: 0,
      zackischFee: 0,
      platformFeeGrossCents: 0,
      platformFeeNetCents: 0,
      platformFeeVatCents: 0,
      stripeFee: 0,
      netAmount: 0,
    };
  },
});

export const getGuestOrderTracker = query({
  args: { id: v.id("orders"), businessId: v.id("businesses") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("orders"),
      orderNumber: v.string(),
      status: v.union(
        v.literal("in_progress"),
        v.literal("ready_for_pickup"),
        v.literal("completed"),
        v.literal("cancelled")
      ),
      paymentStatus: v.optional(
        v.union(
          v.literal("paid"),
          v.literal("partially_refunded"),
          v.literal("refunded"),
          v.literal("disputed"),
          v.literal("failed")
        )
      ),
      type: v.union(v.literal("dine-in"), v.literal("takeaway")),
      tableNumber: v.optional(v.string()),
      items: v.string(),
      total: v.number(),
      eligibleSubtotalCents: v.optional(v.number()),
      tipCents: v.optional(v.number()),
      refundedAmountCents: v.optional(v.number()),
      currency: v.string(),
      createdAt: v.optional(v.number()),
      readyAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
      sellerSnapshot: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order || order.businessId !== args.businessId) return null;
    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus ?? "paid",
      type: order.type,
      tableNumber: order.tableNumber,
      items: order.items,
      total: order.total,
      eligibleSubtotalCents: order.eligibleSubtotalCents,
      tipCents: order.tipCents,
      refundedAmountCents: order.refundedAmountCents,
      currency: order.currency,
      createdAt: order.createdAt,
      readyAt: order.readyAt,
      completedAt: order.completedAt,
      sellerSnapshot: order.sellerSnapshot,
    };
  },
});

export const getOrderByPaymentIntent = query({
  args: { stripePaymentId: v.string() },
  returns: v.union(v.null(), orderObjectValidator),
  handler: async (ctx, args) => {
    let order = await ctx.db
      .query("orders")
      .withIndex("by_stripePaymentId", (q) =>
        q.eq("stripePaymentId", args.stripePaymentId)
      )
      .first();

    if (!order) {
      order = await ctx.db
        .query("orders")
        .withIndex("by_stripeSessionId", (q) =>
          q.eq("stripeSessionId", args.stripePaymentId)
        )
        .first();
    }

    if (!order) return null;
    return {
      ...order,
      zakkigFee: 0,
      zackischFee: 0,
      platformFeeGrossCents: 0,
      platformFeeNetCents: 0,
      platformFeeVatCents: 0,
      stripeFee: 0,
      netAmount: 0,
    };
  },
});

export const getOrderBySession = getOrderByPaymentIntent;

function computeNextOrderNumber(recentOrders: Array<{ orderNumber: string }>): string {
  let maxNum = 0;
  if (recentOrders.length > 0) {
    const latest = recentOrders[0];
    const latestParsed = parseInt(latest.orderNumber, 10);
    const isRollover =
      latestParsed < 100 &&
      recentOrders.some((o) => parseInt(o.orderNumber, 10) > 900);

    if (isRollover) {
      maxNum = latestParsed;
    } else {
      for (const ord of recentOrders) {
        const parsed = parseInt(ord.orderNumber, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 999) {
          if (parsed > maxNum) {
            maxNum = parsed;
          }
        }
      }
    }
  }

  const nextNum = maxNum >= 999 ? 1 : maxNum + 1;
  return String(nextNum).padStart(3, "0");
}

export const createOrder = mutation({
  args: {
    businessId: v.id("businesses"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(),
    total: v.number(),
    tipCents: v.optional(v.number()),
    discountCents: v.optional(v.number()),
    email: v.string(),
    stripePaymentId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    zakkigFee: v.number(),
    stripeFee: v.number(),
    netAmount: v.number(),
    currency: v.optional(v.string()),
  },
  returns: v.object({
    _id: v.id("orders"),
    orderNumber: v.string(),
  }),
  handler: async (ctx, args) => {
    if (args.tableNumber && args.tableNumber.trim().length > 4) {
      throw new Error("Table number must not exceed 4 characters");
    }

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    if (business.isPaused) {
      throw new Error("Bestellannahme für diesen Betrieb ist derzeit pausiert.");
    }

    const recentOrders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .order("desc")
      .take(20);

    const orderNumber = computeNextOrderNumber(recentOrders);
    const tipCents = args.tipCents ?? 0;
    const discountCents = args.discountCents ?? 0;
    const grossGoodsCents = Math.max(0, args.total - tipCents + discountCents);

    const feeBreakdown = calculatePlatformFeeBreakdown(grossGoodsCents, {
      tipCents,
      discountCents,
    });

    let parsedItems: any[] = [];
    try {
      parsedItems = JSON.parse(args.items);
    } catch {
      parsedItems = [];
    }
    const taxBreakdown = calculateItemTaxBreakdown(parsedItems);

    const sellerSnapshot = JSON.stringify({
      name: business.name,
      legalName: business.legalName || business.name,
      address: business.address || "",
      taxId: business.taxId || business.vatId || "",
    });

    const orderId = await ctx.db.insert("orders", {
      businessId: args.businessId,
      tableNumber: args.tableNumber,
      type: args.type,
      items: args.items,
      total: args.total,
      status: "in_progress",
      paymentStatus: "paid",
      posRecordingStatus: "pending",
      createdAt: Date.now(),
      email: args.email,
      orderNumber,
      stripePaymentId: args.stripePaymentId,
      stripeSessionId: args.stripeSessionId,
      connectedAccountId: business.stripeAccountId,
      eligibleSubtotalCents: feeBreakdown.eligibleSubtotalCents,
      tipCents: feeBreakdown.tipCents,
      discountCents: feeBreakdown.discountCents,
      tax7NetCents: taxBreakdown.tax7NetCents,
      tax7VatCents: taxBreakdown.tax7VatCents,
      tax19NetCents: taxBreakdown.tax19NetCents,
      tax19VatCents: taxBreakdown.tax19VatCents,
      zakkigFee: feeBreakdown.platformFeeGrossCents,
      zackischFee: feeBreakdown.platformFeeGrossCents,
      platformFeeGrossCents: feeBreakdown.platformFeeGrossCents,
      platformFeeNetCents: feeBreakdown.platformFeeNetCents,
      platformFeeVatCents: feeBreakdown.platformFeeVatCents,
      platformFeeVatRate: feeBreakdown.platformFeeVatRate,
      stripeFee: args.stripeFee,
      netAmount: args.total - feeBreakdown.platformFeeGrossCents - args.stripeFee,
      refundedAmountCents: 0,
      refundedPlatformFeeCents: 0,
      sellerSnapshot,
      currency: args.currency ?? business.currency ?? "EUR",
    });

    return {
      _id: orderId,
      orderNumber,
    };
  },
});

export const createPaidOrderFromWebhook = internalMutation({
  args: {
    businessId: v.id("businesses"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(),
    total: v.number(),
    tipCents: v.optional(v.number()),
    discountCents: v.optional(v.number()),
    stripeFeeCents: v.optional(v.number()),
    connectedAccountId: v.optional(v.string()),
    email: v.string(),
    stripePaymentId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    currency: v.string(),
  },
  returns: v.id("orders"),
  handler: async (ctx, args) => {
    // Prevent duplicate orders for the same payment intent or session
    if (args.stripePaymentId) {
      const existingByPi = await ctx.db
        .query("orders")
        .withIndex("by_stripePaymentId", (q) =>
          q.eq("stripePaymentId", args.stripePaymentId)
        )
        .first();
      if (existingByPi) {
        return existingByPi._id;
      }
    }

    if (args.stripeSessionId) {
      const existingBySession = await ctx.db
        .query("orders")
        .withIndex("by_stripeSessionId", (q) =>
          q.eq("stripeSessionId", args.stripeSessionId)
        )
        .first();
      if (existingBySession) {
        return existingBySession._id;
      }
    }

    const business = await ctx.db.get(args.businessId);
    const recentOrders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .order("desc")
      .take(20);

    const orderNumber = computeNextOrderNumber(recentOrders);

    const tipCents = args.tipCents ?? 0;
    const discountCents = args.discountCents ?? 0;
    const grossGoodsCents = Math.max(0, args.total - tipCents + discountCents);
    const feeBreakdown = calculatePlatformFeeBreakdown(grossGoodsCents, {
      tipCents,
      discountCents,
    });

    let parsedItems: any[] = [];
    try {
      parsedItems = JSON.parse(args.items);
    } catch {
      parsedItems = [];
    }
    const taxBreakdown = calculateItemTaxBreakdown(parsedItems);

    const stripeFee = args.stripeFeeCents ?? 0;
    const zakkigFee = feeBreakdown.platformFeeGrossCents;
    const netAmount = args.total - zakkigFee - stripeFee;

    const sellerSnapshot = business
      ? JSON.stringify({
          name: business.name,
          legalName: business.legalName || business.name,
          address: business.address || "",
          taxId: business.taxId || business.vatId || "",
        })
      : undefined;

    return await ctx.db.insert("orders", {
      businessId: args.businessId,
      tableNumber: args.tableNumber
        ? args.tableNumber.trim().slice(0, 4)
        : undefined,
      type: args.type,
      items: args.items,
      total: args.total,
      status: "in_progress",
      paymentStatus: "paid",
      posRecordingStatus: "pending",
      createdAt: Date.now(),
      email: args.email,
      orderNumber,
      stripePaymentId: args.stripePaymentId,
      stripeSessionId: args.stripeSessionId,
      connectedAccountId: args.connectedAccountId ?? business?.stripeAccountId,
      eligibleSubtotalCents: feeBreakdown.eligibleSubtotalCents,
      tipCents: feeBreakdown.tipCents,
      discountCents: feeBreakdown.discountCents,
      tax7NetCents: taxBreakdown.tax7NetCents,
      tax7VatCents: taxBreakdown.tax7VatCents,
      tax19NetCents: taxBreakdown.tax19NetCents,
      tax19VatCents: taxBreakdown.tax19VatCents,
      zakkigFee,
      zackischFee: zakkigFee,
      platformFeeGrossCents: feeBreakdown.platformFeeGrossCents,
      platformFeeNetCents: feeBreakdown.platformFeeNetCents,
      platformFeeVatCents: feeBreakdown.platformFeeVatCents,
      platformFeeVatRate: feeBreakdown.platformFeeVatRate,
      stripeFee,
      netAmount,
      refundedAmountCents: 0,
      refundedPlatformFeeCents: 0,
      sellerSnapshot,
      currency: args.currency,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("in_progress"),
      v.literal("ready_for_pickup"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    sessionToken: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    // Defense-in-depth: Completed orders can NEVER be cancelled
    if (args.status === "cancelled" && order.status === "completed") {
      throw new Error(
        "Abgeschlossene Bestellungen können nicht mehr storniert werden."
      );
    }

    const patchData: {
      status: "in_progress" | "ready_for_pickup" | "completed" | "cancelled";
      completedAt?: number;
      readyAt?: number;
    } = { status: args.status };
    if (args.status === "ready_for_pickup") {
      patchData.readyAt = Date.now();
    }
    if (args.status === "completed") {
      patchData.completedAt = Date.now();
    }
    await ctx.db.patch(args.id, patchData);
    return null;
  },
});

/**
 * Records that a paid Zackisch order has been entered exactly once into the merchant's existing POS.
 * Prevents duplicate POS booking unless reference update is explicitly requested.
 */
export const recordOrderInPos = mutation({
  args: {
    orderId: v.id("orders"),
    posReference: v.optional(v.string()),
    recordedByLabel: v.optional(v.string()),
    sessionToken: v.optional(v.string()),
    allowUpdateReference: v.optional(v.boolean()),
  },
  returns: v.object({
    success: v.boolean(),
    alreadyRecorded: v.boolean(),
    posRecordedAt: v.number(),
    posRecordedBy: v.string(),
    posReference: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) {
      throw new Error("Bestellung nicht gefunden.");
    }

    const access = await verifyBusinessOrSessionAccess(
      ctx,
      order.businessId,
      args.sessionToken
    );
    if (!access.authorized) {
      throw new Error("Nicht berechtigt, diese Kassen-Erfassung durchzuführen.");
    }
    const actor =
      args.recordedByLabel?.trim() || access.actorLabel;

    if (order.posRecordingStatus === "recorded" && !args.allowUpdateReference) {
      return {
        success: true,
        alreadyRecorded: true,
        posRecordedAt: order.posRecordedAt ?? Date.now(),
        posRecordedBy: order.posRecordedBy ?? actor,
        posReference: order.posReference,
      };
    }

    const now = order.posRecordedAt ?? Date.now();
    const cleanRef = args.posReference?.trim().slice(0, 64) || order.posReference;

    await ctx.db.patch(args.orderId, {
      posRecordingStatus: "recorded",
      posRecordedAt: now,
      posRecordedBy: actor,
      posReference: cleanRef,
    });

    const business = await ctx.db.get(order.businessId);
    await ctx.db.insert("auditLogs", {
      actorId: actor,
      actorRole: "merchant",
      action: "order.pos_recorded",
      entityType: "order",
      entityId: String(order._id),
      regionId: business?.region || "de",
      details: JSON.stringify({
        orderNumber: order.orderNumber,
        total: order.total,
        posReference: cleanRef ?? null,
      }),
      timestamp: Date.now(),
    });

    return {
      success: true,
      alreadyRecorded: false,
      posRecordedAt: now,
      posRecordedBy: actor,
      posReference: cleanRef,
    };
  },
});

export const getPosReconciliationSummary = query({
  args: {
    businessId: v.id("businesses"),
    sessionToken: v.optional(v.string()),
  },
  returns: v.union(
    v.null(),
    v.object({
      unrecordedCount: v.number(),
      recordedCount: v.number(),
      unrecordedOrders: v.array(orderObjectValidator),
      totals: v.object({
        grossTotalCents: v.number(),
        eligibleSubtotalCents: v.number(),
        tipCents: v.number(),
        refundedAmountCents: v.number(),
        platformFeeGrossCents: v.number(),
        platformFeeNetCents: v.number(),
        platformFeeVatCents: v.number(),
        tax7NetCents: v.number(),
        tax7VatCents: v.number(),
        tax19NetCents: v.number(),
        tax19VatCents: v.number(),
      }),
    })
  ),
  handler: async (ctx, args) => {
    const access = await verifyBusinessOrSessionAccess(
      ctx,
      args.businessId,
      args.sessionToken
    );
    if (!access.authorized) {
      return null;
    }

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .order("desc")
      .take(250);

    const activePaidOrders = orders.filter(
      (o) => o.status !== "cancelled" && !o.isTestOrder
    );

    const unrecordedOrders = activePaidOrders.filter(
      (o) => o.posRecordingStatus !== "recorded"
    );
    const recordedOrders = activePaidOrders.filter(
      (o) => o.posRecordingStatus === "recorded"
    );

    const totals = activePaidOrders.reduce(
      (acc, o) => {
        const gross = o.total;
        const tip = o.tipCents ?? 0;
        const eligible = o.eligibleSubtotalCents ?? Math.max(0, gross - tip);
        const refunded = o.refundedAmountCents ?? 0;
        const feeGross =
          (o.platformFeeGrossCents ?? o.zackischFee ?? o.zakkigFee) -
          (o.refundedPlatformFeeCents ?? 0);
        const feeNet =
          o.platformFeeNetCents ?? Math.round(Math.max(0, feeGross) / 1.19);
        const feeVat = Math.max(0, feeGross) - feeNet;

        acc.grossTotalCents += gross;
        acc.eligibleSubtotalCents += eligible;
        acc.tipCents += tip;
        acc.refundedAmountCents += refunded;
        acc.platformFeeGrossCents += Math.max(0, feeGross);
        acc.platformFeeNetCents += Math.max(0, feeNet);
        acc.platformFeeVatCents += Math.max(0, feeVat);
        acc.tax7NetCents += o.tax7NetCents ?? 0;
        acc.tax7VatCents += o.tax7VatCents ?? 0;
        acc.tax19NetCents += o.tax19NetCents ?? 0;
        acc.tax19VatCents += o.tax19VatCents ?? 0;
        return acc;
      },
      {
        grossTotalCents: 0,
        eligibleSubtotalCents: 0,
        tipCents: 0,
        refundedAmountCents: 0,
        platformFeeGrossCents: 0,
        platformFeeNetCents: 0,
        platformFeeVatCents: 0,
        tax7NetCents: 0,
        tax7VatCents: 0,
        tax19NetCents: 0,
        tax19VatCents: 0,
      }
    );

    return {
      unrecordedCount: unrecordedOrders.length,
      recordedCount: recordedOrders.length,
      unrecordedOrders: unrecordedOrders.slice(0, 50),
      totals,
    };
  },
});

export const createControlledTestOrder = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  returns: v.object({
    orderId: v.id("orders"),
    orderNumber: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Nicht authentifiziert.");
    }
    const business = await ctx.db.get(args.businessId);
    if (!business || business.ownerId !== userId) {
      throw new Error("Keine Berechtigung für diesen Betrieb.");
    }

    const sampleItems = JSON.stringify([
      {
        menuItemId: "test-item-1",
        name: "Testbestellung (Setup-Prüfung)",
        price: 1000,
        quantity: 1,
        taxRate: 7,
        customizations: [],
      },
    ]);

    const feeBreakdown = calculatePlatformFeeBreakdown(1000, { tipCents: 0 });
    const orderNumber = "T01";

    const orderId = await ctx.db.insert("orders", {
      businessId: args.businessId,
      tableNumber: business.tables?.[0] || "1",
      type: business.isToStayEnabled !== false ? "dine-in" : "takeaway",
      items: sampleItems,
      total: 1000,
      status: "in_progress",
      paymentStatus: "paid",
      posRecordingStatus: "pending",
      createdAt: Date.now(),
      email: business.contactEmail || "test@zackisch.com",
      orderNumber,
      eligibleSubtotalCents: 1000,
      tipCents: 0,
      discountCents: 0,
      tax7NetCents: 935,
      tax7VatCents: 65,
      tax19NetCents: 0,
      tax19VatCents: 0,
      zakkigFee: feeBreakdown.platformFeeGrossCents,
      zackischFee: feeBreakdown.platformFeeGrossCents,
      platformFeeGrossCents: feeBreakdown.platformFeeGrossCents,
      platformFeeNetCents: feeBreakdown.platformFeeNetCents,
      platformFeeVatCents: feeBreakdown.platformFeeVatCents,
      platformFeeVatRate: feeBreakdown.platformFeeVatRate,
      stripeFee: 0,
      netAmount: 980,
      refundedAmountCents: 0,
      refundedPlatformFeeCents: 0,
      isTestOrder: true,
      currency: business.currency || "EUR",
    });

    await ctx.db.patch(args.businessId, {
      testOrderCompletedAt: Date.now(),
    });

    return { orderId, orderNumber };
  },
});

export const applyRefundUpdateInternal = internalMutation({
  args: {
    stripePaymentId: v.string(),
    refundAmountCents: v.number(),
    cumulativeRefundedCents: v.optional(v.number()),
  },
  returns: v.union(
    v.null(),
    v.object({
      orderId: v.id("orders"),
      refundFeeCents: v.number(),
      isFullRefund: v.boolean(),
    })
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripePaymentId", (q) =>
        q.eq("stripePaymentId", args.stripePaymentId)
      )
      .first();
    if (!order) return null;

    const alreadyRefunded = order.refundedAmountCents ?? 0;
    const alreadyRefundedFee = order.refundedPlatformFeeCents ?? 0;
    const incrementalRefund =
      args.cumulativeRefundedCents !== undefined
        ? Math.max(0, args.cumulativeRefundedCents - alreadyRefunded)
        : args.refundAmountCents;

    if (incrementalRefund <= 0) {
      return {
        orderId: order._id,
        refundFeeCents: 0,
        isFullRefund: alreadyRefunded >= order.total,
      };
    }

    const originalEligible =
      order.eligibleSubtotalCents ??
      Math.max(0, order.total - (order.tipCents ?? 0));
    const originalFee =
      order.platformFeeGrossCents ?? order.zackischFee ?? order.zakkigFee;

    const calc = calculateProportionalFeeRefund({
      originalEligibleSubtotalCents: originalEligible,
      originalPlatformFeeCents: originalFee,
      refundAmountCents: incrementalRefund,
      alreadyRefundedAmountCents: alreadyRefunded,
      alreadyRefundedFeeCents: alreadyRefundedFee,
      tipCents: order.tipCents ?? 0,
    });

    const remainingGross = Math.max(
      0,
      order.total - calc.newTotalRefundedAmountCents
    );
    const remainingFee = Math.max(
      0,
      originalFee - calc.newTotalRefundedFeeCents
    );

    await ctx.db.patch(order._id, {
      paymentStatus: calc.isFullRefund ? "refunded" : "partially_refunded",
      refundedAmountCents: calc.newTotalRefundedAmountCents,
      refundedPlatformFeeCents: calc.newTotalRefundedFeeCents,
      netAmount: Math.max(0, remainingGross - remainingFee - order.stripeFee),
    });

    return {
      orderId: order._id,
      refundFeeCents: calc.refundFeeCents,
      isFullRefund: calc.isFullRefund,
    };
  },
});

export const applyDisputeUpdateInternal = internalMutation({
  args: {
    stripePaymentId: v.string(),
    disputeId: v.string(),
    disputeStatus: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripePaymentId", (q) =>
        q.eq("stripePaymentId", args.stripePaymentId)
      )
      .first();
    if (!order) return null;

    await ctx.db.patch(order._id, {
      paymentStatus: "disputed",
      disputeId: args.disputeId,
      disputeStatus: args.disputeStatus,
    });

    const business = await ctx.db.get(order.businessId);
    await ctx.db.insert("auditLogs", {
      actorId: "stripe_webhook",
      actorRole: "system",
      action: "order.dispute_updated",
      entityType: "order",
      entityId: String(order._id),
      regionId: business?.region || "de",
      details: JSON.stringify({
        disputeId: args.disputeId,
        disputeStatus: args.disputeStatus,
        orderNumber: order.orderNumber,
      }),
      timestamp: Date.now(),
    });
    return null;
  },
});

export const patchOrderItems = internalMutation({
  args: {
    id: v.id("orders"),
    items: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { items: args.items });
    return null;
  },
});

export const patchOrder = internalMutation({
  args: {
    id: v.id("orders"),
    orderNumber: v.optional(v.string()),
    items: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("in_progress"),
        v.literal("ready_for_pickup"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    completedAt: v.optional(v.number()),
    readyAt: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const patch: any = {};
    if (args.orderNumber !== undefined) patch.orderNumber = args.orderNumber;
    if (args.items !== undefined) patch.items = args.items;
    if (args.status !== undefined) {
      patch.status = args.status;
      if (args.status === "ready_for_pickup" && args.readyAt === undefined) {
        patch.readyAt = Date.now();
      }
    }
    if (args.completedAt !== undefined) patch.completedAt = args.completedAt;
    if (args.readyAt !== undefined) patch.readyAt = args.readyAt;
    await ctx.db.patch(args.id, patch);
    return null;
  },
});
