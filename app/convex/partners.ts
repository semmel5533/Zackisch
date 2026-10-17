import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireOpsActor } from "./permissions";

// 1. List Partners in Region
export const listPartners = query({
  args: {
    regionId: v.string(),
    sessionToken: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("partners"),
      _creationTime: v.number(),
      code: v.string(),
      name: v.string(),
      email: v.string(),
      regionId: v.string(),
      commissionRate: v.number(),
      status: v.union(v.literal("active"), v.literal("inactive")),
      totalEarnedCents: v.number(),
      totalPaidCents: v.number(),
      iban: v.optional(v.string()),
      taxId: v.optional(v.string()),
      createdAt: v.number(),
      referredBusinessesCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    await requireOpsActor(
      ctx,
      { sessionToken: args.sessionToken },
      { regionId: args.regionId, requiredPermission: "partners:read" }
    );
    const partners = await ctx.db
      .query("partners")
      .withIndex("by_regionId", (q) => q.eq("regionId", args.regionId))
      .collect();

    const allBusinesses = await ctx.db.query("businesses").collect();

    return partners.map((p) => {
      const referredBusinesses = allBusinesses.filter((b) => b.partnerCode === p.code);
      return {
        _id: p._id,
        _creationTime: p._creationTime,
        code: p.code,
        name: p.name,
        email: p.email,
        regionId: p.regionId,
        commissionRate: p.commissionRate,
        status: p.status,
        totalEarnedCents: p.totalEarnedCents,
        totalPaidCents: p.totalPaidCents,
        iban: p.iban,
        taxId: p.taxId,
        createdAt: p.createdAt,
        referredBusinessesCount: referredBusinesses.length,
      };
    });
  },
});

// 2. Create Partner
export const createPartner = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    email: v.string(),
    regionId: v.string(),
    iban: v.optional(v.string()),
    taxId: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    sessionToken: v.optional(v.string()),
  },
  returns: v.id("partners"),
  handler: async (ctx, args) => {
    const actor = await requireOpsActor(
      ctx,
      { sessionToken: args.sessionToken },
      { regionId: args.regionId, requiredPermission: "partners:write" }
    );
    const code = args.code.toUpperCase().trim();
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (existing) {
      throw new Error(`Partner code ${code} is already taken.`);
    }

    const partnerId = await ctx.db.insert("partners", {
      code,
      name: args.name,
      email: args.email.toLowerCase().trim(),
      regionId: args.regionId,
      commissionRate: 0.5, // 50% of 2% Zackisch platform fee
      status: "active",
      totalEarnedCents: 0,
      totalPaidCents: 0,
      iban: args.iban,
      taxId: args.taxId,
      createdAt: Date.now(),
    });

    // Record audit event with verified actor identity
    await ctx.db.insert("auditLogs", {
      actorId: actor.email,
      actorRole: actor.role,
      action: "partner.create",
      entityType: "partner",
      entityId: partnerId,
      regionId: args.regionId,
      details: JSON.stringify({ code, name: args.name, email: args.email }),
      timestamp: Date.now(),
    });

    return partnerId;
  },
});

// 3. Record Payout
export const recordPayout = mutation({
  args: {
    partnerId: v.id("partners"),
    regionId: v.string(),
    amountCents: v.number(),
    period: v.string(),
    notes: v.optional(v.string()),
    reference: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    sessionToken: v.optional(v.string()),
  },
  returns: v.id("partnerPayouts"),
  handler: async (ctx, args) => {
    const actor = await requireOpsActor(
      ctx,
      { sessionToken: args.sessionToken },
      { regionId: args.regionId, requiredPermission: "partners:write" }
    );
    const partner = await ctx.db.get(args.partnerId);
    if (!partner) throw new Error("Partner not found");

    const payoutId = await ctx.db.insert("partnerPayouts", {
      partnerId: args.partnerId,
      regionId: args.regionId,
      amountCents: args.amountCents,
      status: "paid",
      period: args.period,
      notes: args.notes,
      reference: args.reference,
      createdAt: Date.now(),
      paidAt: Date.now(),
    });

    await ctx.db.patch(args.partnerId, {
      totalPaidCents: partner.totalPaidCents + args.amountCents,
    });

    // Record audit event with verified actor identity
    await ctx.db.insert("auditLogs", {
      actorId: actor.email,
      actorRole: actor.role,
      action: "partner.payout",
      entityType: "partner",
      entityId: args.partnerId,
      regionId: args.regionId,
      details: JSON.stringify({ amountCents: args.amountCents, period: args.period }),
      timestamp: Date.now(),
    });

    return payoutId;
  },
});

// 4. List Payouts
export const listPayouts = query({
  args: {
    regionId: v.string(),
    sessionToken: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id("partnerPayouts"),
      _creationTime: v.number(),
      partnerId: v.id("partners"),
      regionId: v.string(),
      amountCents: v.number(),
      status: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
      period: v.string(),
      notes: v.optional(v.string()),
      reference: v.optional(v.string()),
      createdAt: v.number(),
      paidAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    await requireOpsActor(
      ctx,
      { sessionToken: args.sessionToken },
      { regionId: args.regionId, requiredPermission: "partners:read" }
    );
    return await ctx.db
      .query("partnerPayouts")
      .withIndex("by_regionId", (q) => q.eq("regionId", args.regionId))
      .order("desc")
      .collect();
  },
});
