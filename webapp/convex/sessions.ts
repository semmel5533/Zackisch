import { query, mutation } from "./_generated/server";
import { requireOwner, verifyTerminal } from "./permissions";
import { v } from "convex/values";

export const getOrderSessions = query({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.array(
    v.object({
      _id: v.id("orderSessions"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
      token: v.string(),
      expiresAt: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    return await ctx.db
      .query("orderSessions")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .order("desc")
      .take(10);
  },
});

export const createOrderSession = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    _id: v.id("orderSessions"),
    token: v.string(),
  }),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    const token = crypto.randomUUID();
    const id = await ctx.db.insert("orderSessions", {
      organizationId: args.organizationId,
      token,
    });
    return { _id: id, token };
  },
});

export const deleteOrderSession = mutation({
  args: { sessionToken: v.optional(v.string()), id: v.id("orderSessions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(
      ctx,
      (await ctx.db.get(args.id))!.organizationId,
      args.sessionToken,
    );
    await ctx.db.delete(args.id);
    return null;
  },
});

export const getAvailabilitySessions = query({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.array(
    v.object({
      _id: v.id("availabilitySessions"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
      token: v.string(),
      expiresAt: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    return await ctx.db
      .query("availabilitySessions")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .order("desc")
      .take(10);
  },
});

export const createAvailabilitySession = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    _id: v.id("availabilitySessions"),
    token: v.string(),
  }),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    const token = crypto.randomUUID();
    const id = await ctx.db.insert("availabilitySessions", {
      organizationId: args.organizationId,
      token,
    });
    return { _id: id, token };
  },
});

export const deleteAvailabilitySession = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    id: v.id("availabilitySessions"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(
      ctx,
      (await ctx.db.get(args.id))!.organizationId,
      args.sessionToken,
    );
    await ctx.db.delete(args.id);
    return null;
  },
});

export const getStaffSessions = query({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.array(
    v.object({
      _id: v.id("staffSessions"),
      _creationTime: v.number(),
      organizationId: v.id("organizations"),
      token: v.string(),
      expiresAt: v.optional(v.string()),
    }),
  ),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    return await ctx.db
      .query("staffSessions")
      .withIndex("by_organizationId", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .order("desc")
      .take(10);
  },
});

export const createStaffSession = mutation({
  args: {
    sessionToken: v.optional(v.string()),
    organizationId: v.id("organizations"),
  },
  returns: v.object({
    _id: v.id("staffSessions"),
    token: v.string(),
  }),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.organizationId, args.sessionToken);
    const token = crypto.randomUUID();
    const id = await ctx.db.insert("staffSessions", {
      organizationId: args.organizationId,
      token,
    });
    return { _id: id, token };
  },
});

export const deleteStaffSession = mutation({
  args: { sessionToken: v.optional(v.string()), id: v.id("staffSessions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(
      ctx,
      (await ctx.db.get(args.id))!.organizationId,
      args.sessionToken,
    );
    await ctx.db.delete(args.id);
    return null;
  },
});

export const verifyTerminalSession = query({
  args: {
    organizationId: v.id("organizations"),
    token: v.string(),
    type: v.union(
      v.literal("orders"),
      v.literal("availability"),
      v.literal("staff"),
    ),
  },
  returns: v.boolean(),
  handler: async (ctx, args) =>
    verifyTerminal(ctx, args.organizationId, args.token, args.type),
});
