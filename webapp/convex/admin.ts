import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Seed the initial regional admin and default regions if not present
export const seedInitialAdminAndRegions = mutation({
  args: {},
  returns: v.object({
    adminCreated: v.boolean(),
    regionsCreated: v.number(),
  }),
  handler: async (ctx) => {
    let adminCreated = false;
    let regionsCreated = 0;

    // 1. Seed Germany, Austria, Switzerland
    const existingDe = await ctx.db
      .query("regions")
      .withIndex("by_code", (q) => q.eq("code", "de"))
      .first();

    if (!existingDe) {
      await ctx.db.insert("regions", {
        code: "de",
        name: "Deutschland",
        currency: "EUR",
        taxRates: [7, 19],
        platformFeePercent: 2,
        partnerCommissionPercent: 50,
        status: "active",
        defaultLocale: "de",
        supportedLocales: ["de", "en"],
        createdAt: Date.now(),
      });
      regionsCreated++;
    }

    const existingAt = await ctx.db
      .query("regions")
      .withIndex("by_code", (q) => q.eq("code", "at"))
      .first();

    if (!existingAt) {
      await ctx.db.insert("regions", {
        code: "at",
        name: "Österreich",
        currency: "EUR",
        taxRates: [10, 20],
        platformFeePercent: 2,
        partnerCommissionPercent: 50,
        status: "planned",
        defaultLocale: "de",
        supportedLocales: ["de", "en"],
        createdAt: Date.now(),
      });
      regionsCreated++;
    }

    const existingCh = await ctx.db
      .query("regions")
      .withIndex("by_code", (q) => q.eq("code", "ch"))
      .first();

    if (!existingCh) {
      await ctx.db.insert("regions", {
        code: "ch",
        name: "Schweiz",
        currency: "CHF",
        taxRates: [2.6, 8.1],
        platformFeePercent: 2,
        partnerCommissionPercent: 50,
        status: "planned",
        defaultLocale: "de",
        supportedLocales: ["de", "en"],
        createdAt: Date.now(),
      });
      regionsCreated++;
    }

    // 2. Seed Initial Regional Admin
    const existingAdmin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", "selim@zackisch.com"))
      .first();

    if (!existingAdmin) {
      await ctx.db.insert("adminUsers", {
        email: "selim@zackisch.com",
        name: "Selim Eser",
        role: "regional_admin",
        regionId: "de",
        permissions: [
          "restaurants:read",
          "restaurants:write",
          "orders:read",
          "orders:write",
          "newsletter:read",
          "newsletter:write",
          "newsletter:send",
          "partners:read",
          "partners:write",
          "audit:read",
          "staff:manage",
        ],
        isActive: true,
        createdAt: Date.now(),
      });
      adminCreated = true;
    }

    return { adminCreated, regionsCreated };
  },
});

// Get admin user profile by email
export const getAdminByEmail = query({
  args: { email: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("adminUsers"),
      _creationTime: v.number(),
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal("regional_admin"), v.literal("staff")),
      regionId: v.string(),
      permissions: v.array(v.string()),
      isActive: v.boolean(),
      createdAt: v.number(),
      lastLoginAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
  },
});

// List all regions
export const listRegions = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("regions"),
      _creationTime: v.number(),
      code: v.string(),
      name: v.string(),
      currency: v.string(),
      taxRates: v.array(v.number()),
      platformFeePercent: v.number(),
      partnerCommissionPercent: v.number(),
      status: v.union(v.literal("active"), v.literal("planned")),
      defaultLocale: v.string(),
      supportedLocales: v.array(v.string()),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx) => {
    return await ctx.db.query("regions").collect();
  },
});

// Regional Overview Metrics for Dashboard
export const getRegionalOverview = query({
  args: { regionId: v.string() },
  returns: v.object({
    totalRestaurants: v.number(),
    activeRestaurants: v.number(),
    totalOrders: v.number(),
    gmvCents: v.number(),
    platformFeeCents: v.number(),
    partnerCommissionCents: v.number(),
    subscriberCount: v.number(),
  }),
  handler: async (ctx, args) => {
    // 1. Restaurants in region
    const allOrgs = await ctx.db.query("organizations").collect();
    const regionOrgs = allOrgs.filter(
      (org) => (org.region || "de").toLowerCase() === args.regionId.toLowerCase()
    );
    const orgIds = new Set(regionOrgs.map((o) => o._id));

    const totalRestaurants = regionOrgs.length;
    const activeRestaurants = regionOrgs.filter((o) => o.stripeOnboardingComplete).length;

    // 2. Orders for these restaurants
    const allOrders = await ctx.db.query("orders").collect();
    const regionOrders = allOrders.filter((ord) => orgIds.has(ord.organizationId));

    let gmvCents = 0;
    let platformFeeCents = 0;

    for (const ord of regionOrders) {
      if (ord.status !== "cancelled") {
        gmvCents += ord.total;
        platformFeeCents += ord.zackischFee ?? ord.zakkigFee ?? Math.round(ord.total * 0.02);
      }
    }

    // 50% of Zackisch platform fee = partner commission
    const partnerCommissionCents = Math.round(platformFeeCents * 0.5);

    // 3. Newsletter subscribers in region
    const subscribers = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_regionId_and_status", (q) =>
        q.eq("regionId", args.regionId).eq("status", "confirmed")
      )
      .collect();

    return {
      totalRestaurants,
      activeRestaurants,
      totalOrders: regionOrders.length,
      gmvCents,
      platformFeeCents,
      partnerCommissionCents,
      subscriberCount: subscribers.length,
    };
  },
});

// List regional restaurants with details
export const listRegionalRestaurants = query({
  args: { regionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("organizations"),
      _creationTime: v.number(),
      name: v.string(),
      address: v.optional(v.string()),
      ownerId: v.string(),
      stripeAccountId: v.optional(v.string()),
      stripeOnboardingComplete: v.optional(v.boolean()),
      isToGoEnabled: v.optional(v.boolean()),
      isToStayEnabled: v.optional(v.boolean()),
      legalName: v.optional(v.string()),
      taxId: v.optional(v.string()),
      currency: v.optional(v.string()),
      region: v.optional(v.string()),
      partnerCode: v.optional(v.string()),
      tablesCount: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const allOrgs = await ctx.db.query("organizations").collect();
    return allOrgs
      .filter((org) => (org.region || "de").toLowerCase() === args.regionId.toLowerCase())
      .map((org) => ({
        _id: org._id,
        _creationTime: org._creationTime,
        name: org.name,
        address: org.address,
        ownerId: org.ownerId,
        stripeAccountId: org.stripeAccountId,
        stripeOnboardingComplete: org.stripeOnboardingComplete,
        isToGoEnabled: org.isToGoEnabled,
        isToStayEnabled: org.isToStayEnabled,
        legalName: org.legalName,
        taxId: org.taxId,
        currency: org.currency,
        region: org.region,
        partnerCode: org.partnerCode,
        tablesCount: org.tables?.length || 0,
      }));
  },
});

// List regional orders
export const listRegionalOrders = query({
  args: {
    regionId: v.string(),
    limit: v.optional(v.number()),
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
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      zackischFee: v.number(),
      currency: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const allOrgs = await ctx.db.query("organizations").collect();
    const regionOrgIds = new Set(
      allOrgs
        .filter((org) => (org.region || "de").toLowerCase() === args.regionId.toLowerCase())
        .map((org) => org._id)
    );

    const allOrders = await ctx.db.query("orders").order("desc").take(limit * 2);
    return allOrders
      .filter((o) => regionOrgIds.has(o.organizationId))
      .slice(0, limit)
      .map((o) => ({
        _id: o._id,
        _creationTime: o._creationTime,
        organizationId: o.organizationId,
        tableNumber: o.tableNumber,
        type: o.type,
        items: o.items,
        total: o.total,
        status: o.status,
        orderNumber: o.orderNumber,
        stripePaymentId: o.stripePaymentId,
        createdAt: o.createdAt,
        zackischFee: o.zackischFee ?? o.zakkigFee ?? Math.round(o.total * 0.02),
        currency: o.currency,
      }));
  },
});

// List regional staff members
export const listStaff = query({
  args: { regionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("adminUsers"),
      _creationTime: v.number(),
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal("regional_admin"), v.literal("staff")),
      regionId: v.string(),
      permissions: v.array(v.string()),
      isActive: v.boolean(),
      createdAt: v.number(),
      lastLoginAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_regionId", (q) => q.eq("regionId", args.regionId))
      .collect();
  },
});

// Invite or add staff member
export const inviteStaff = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("regional_admin"), v.literal("staff")),
    regionId: v.string(),
    permissions: v.array(v.string()),
    actorEmail: v.string(),
  },
  returns: v.id("adminUsers"),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (existing) {
      throw new Error(`Staff member with email ${normalized} already exists.`);
    }

    const staffId = await ctx.db.insert("adminUsers", {
      email: normalized,
      name: args.name,
      role: args.role,
      regionId: args.regionId,
      permissions: args.permissions,
      isActive: true,
      createdAt: Date.now(),
    });

    // Record audit event
    await ctx.db.insert("auditLogs", {
      actorId: args.actorEmail,
      actorRole: "regional_admin",
      action: "staff.invite",
      entityType: "staff",
      entityId: staffId,
      regionId: args.regionId,
      details: JSON.stringify({ email: normalized, role: args.role, permissions: args.permissions }),
      timestamp: Date.now(),
    });

    return staffId;
  },
});

// Update staff status (activate / deactivate)
export const updateStaffStatus = mutation({
  args: {
    staffId: v.id("adminUsers"),
    isActive: v.boolean(),
    actorEmail: v.string(),
    regionId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const staff = await ctx.db.get(args.staffId);
    if (!staff) throw new Error("Staff member not found");

    await ctx.db.patch(args.staffId, { isActive: args.isActive });

    // Record audit event
    await ctx.db.insert("auditLogs", {
      actorId: args.actorEmail,
      actorRole: "regional_admin",
      action: args.isActive ? "staff.activate" : "staff.deactivate",
      entityType: "staff",
      entityId: args.staffId,
      regionId: args.regionId,
      details: JSON.stringify({ email: staff.email, isActive: args.isActive }),
      timestamp: Date.now(),
    });

    return null;
  },
});
