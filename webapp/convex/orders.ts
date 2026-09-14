import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const getLiveOrders = query({
  args: { organizationId: v.id("organizations") },
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
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
      createdAt: v.optional(v.number()),
      email: v.string(),
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      stripeSessionId: v.optional(v.string()),
      zakkigFee: v.number(),
      stripeFee: v.number(),
      netAmount: v.number(),
      currency: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const inProgress = await ctx.db
      .query("orders")
      .withIndex("by_organizationId_and_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "in_progress")
      )
      .order("desc")
      .collect();

    const readyForPickup = await ctx.db
      .query("orders")
      .withIndex("by_organizationId_and_status", (q) =>
        q.eq("organizationId", args.organizationId).eq("status", "ready_for_pickup")
      )
      .order("desc")
      .collect();

    return [...inProgress, ...readyForPickup];
  },
});

export const getOrders = query({
  args: {
    organizationId: v.id("organizations"),
    status: v.optional(
      v.union(
        v.literal("in_progress"),
        v.literal("ready_for_pickup"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
  },
  returns: v.array(
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
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
      createdAt: v.optional(v.number()),
      email: v.string(),
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      stripeSessionId: v.optional(v.string()),
      zakkigFee: v.number(),
      stripeFee: v.number(),
      netAmount: v.number(),
      currency: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_organizationId_and_status", (q) =>
          q.eq("organizationId", args.organizationId).eq("status", args.status!)
        )
        .order("desc")
        .take(100);
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(100);
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
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
      createdAt: v.optional(v.number()),
      email: v.string(),
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      stripeSessionId: v.optional(v.string()),
      zakkigFee: v.number(),
      stripeFee: v.number(),
      netAmount: v.number(),
      currency: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;
    return {
      ...order,
      zakkigFee: 0,
      stripeFee: 0,
      netAmount: 0,
    };
  },
});

export const getOrderByPaymentIntent = query({
  args: { stripePaymentId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("orders"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
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
      createdAt: v.optional(v.number()),
      email: v.string(),
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      stripeSessionId: v.optional(v.string()),
      zakkigFee: v.number(),
      stripeFee: v.number(),
      netAmount: v.number(),
      currency: v.string(),
    })
  ),
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
      stripeFee: 0,
      netAmount: 0,
    };
  },
});

export const getOrderBySession = getOrderByPaymentIntent;

export const createOrder = mutation({
  args: {
    organizationId: v.id("organizations"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(),
    total: v.number(),
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

    // 1. Rolling 3-digit order number (001 - 999) calculated atomically in transaction
    const recentOrders = await ctx.db
      .query("orders")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(20);

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
    const orderNumber = String(nextNum).padStart(3, "0");

    const orderId = await ctx.db.insert("orders", {
      organizationId: args.organizationId,
      tableNumber: args.tableNumber,
      type: args.type,
      items: args.items,
      total: args.total,
      status: "in_progress",
      createdAt: Date.now(),
      email: args.email,
      orderNumber,
      stripePaymentId: args.stripePaymentId,
      stripeSessionId: args.stripeSessionId,
      zakkigFee: args.zakkigFee,
      stripeFee: args.stripeFee,
      netAmount: args.netAmount,
      currency: args.currency ?? "EUR",
    });

    return {
      _id: orderId,
      orderNumber,
    };
  },
});

export const createPaidOrderFromWebhook = internalMutation({
  args: {
    organizationId: v.id("organizations"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(),
    total: v.number(),
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

    const recentOrders = await ctx.db
      .query("orders")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .order("desc")
      .take(20);

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
    const orderNumber = String(nextNum).padStart(3, "0");

    const zakkigFee = Math.round(args.total * 0.01);
    const stripeFee = 0; // Stripe deducts directly from merchant
    const netAmount = args.total - zakkigFee;

    return await ctx.db.insert("orders", {
      organizationId: args.organizationId,
      tableNumber: args.tableNumber ? args.tableNumber.trim().slice(0, 4) : undefined,
      type: args.type,
      items: args.items,
      total: args.total,
      status: "in_progress",
      email: args.email,
      orderNumber,
      stripePaymentId: args.stripePaymentId,
      stripeSessionId: args.stripeSessionId,
      zakkigFee,
      stripeFee,
      netAmount,
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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    // Defense-in-depth: Completed orders can NEVER be cancelled
    if (args.status === "cancelled" && order.status === "completed") {
      throw new Error("Abgeschlossene Bestellungen können nicht mehr storniert werden.");
    }

    const patchData: {
      status: "in_progress" | "ready_for_pickup" | "completed" | "cancelled";
      completedAt?: number;
    } = { status: args.status };
    if (args.status === "completed") {
      patchData.completedAt = Date.now();
    }
    await ctx.db.patch(args.id, patchData);
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
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const patch: any = {};
    if (args.orderNumber !== undefined) patch.orderNumber = args.orderNumber;
    if (args.items !== undefined) patch.items = args.items;
    if (args.status !== undefined) patch.status = args.status;
    if (args.completedAt !== undefined) patch.completedAt = args.completedAt;
    await ctx.db.patch(args.id, patch);
    return null;
  },
});

