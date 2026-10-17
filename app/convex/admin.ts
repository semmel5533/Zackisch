import { query, mutation, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
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
          "tickets:read",
          "tickets:write",
          "tickets:note",
          "newsletter:read",
          "newsletter:write",
          "newsletter:send",
          "partners:read",
          "partners:write",
          "audit:read",
          "staff:manage",
        ],
        isActive: true,
        password: "demo",
        createdAt: Date.now(),
      });
      adminCreated = true;
    } else {
      await ctx.db.patch(existingAdmin._id, {
        role: "regional_admin",
        regionId: "de",
        isActive: true,
        password: "demo",
        permissions: [
          "restaurants:read",
          "restaurants:write",
          "orders:read",
          "orders:write",
          "tickets:read",
          "tickets:write",
          "tickets:note",
          "newsletter:read",
          "newsletter:write",
          "newsletter:send",
          "partners:read",
          "partners:write",
          "audit:read",
          "staff:manage",
        ],
      });
      adminCreated = true;
    }

    return { adminCreated, regionsCreated };
  },
});

export const migrateUserEmailToZackisch = mutation({
  args: {},
  returns: v.object({
    usersUpdated: v.number(),
    accountsUpdated: v.number(),
  }),
  handler: async (ctx) => {
    let usersUpdated = 0;
    let accountsUpdated = 0;

    const oldUsers = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("email"), "selim@zakkig.com"),
          q.eq(q.field("email"), "selim@zakkig.de")
        )
      )
      .collect();

    for (const u of oldUsers) {
      await ctx.db.patch(u._id, { email: "selim@zackisch.com" });
      usersUpdated++;
    }

    const oldAccounts = await ctx.db
      .query("authAccounts")
      .filter((q) =>
        q.or(
          q.eq(q.field("providerAccountId"), "selim@zakkig.com"),
          q.eq(q.field("providerAccountId"), "selim@zakkig.de")
        )
      )
      .collect();

    for (const a of oldAccounts) {
      await ctx.db.patch(a._id, { providerAccountId: "selim@zackisch.com" });
      accountsUpdated++;
    }

    return { usersUpdated, accountsUpdated };
  },
});

export const cleanLegacyOrganizationDocs = internalMutation({
  args: {},
  returns: v.object({
    deletedCount: v.number(),
  }),
  handler: async (ctx) => {
    let deletedCount = 0;
    const tables = [
      "availabilitySessions",
      "orderSessions",
      "staffSessions",
      "menuCategories",
      "menuItems",
      "orders",
    ] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        if (!("businessId" in doc) || !(doc as { businessId?: string }).businessId) {
          await ctx.db.delete(doc._id);
          deletedCount++;
        }
      }
    }

    return { deletedCount };
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
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    if (!admin) return null;
    const { password: _password, ...safeAdmin } = admin;
    return safeAdmin;
  },
});

// Step 1 of Ops 2FA Login: Validate credentials and send OTP via Google Workspace SMTP
export const initiateAdminLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    locale: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
    email: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    if (!args.password || args.password.trim().length === 0) {
      return {
        success: false,
        error: "Bitte gib dein Passwort ein.",
      };
    }

    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      return {
        success: false,
        error: "Kein Zugang für diese Administrator-E-Mail-Adresse hinterlegt.",
      };
    }

    if (!admin.isActive) {
      return {
        success: false,
        error: "Dieser Account ist vorübergehend deaktiviert.",
      };
    }

    // Verify password: check if matches admin.password or default "demo"
    const expectedPassword = admin.password || "demo";
    if (args.password !== expectedPassword) {
      return {
        success: false,
        error: "Ungültiges Administrator-Passwort.",
      };
    }

    // Generate 6-digit cryptographic OTP
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const otp = (100000 + (buf[0] % 900000)).toString();

    // Store in verificationCodes
    const existingOps = await ctx.db
      .query("verificationCodes")
      .withIndex("by_identifier", (q) => q.eq("identifier", `ops_otp_${normalized}`))
      .first();

    if (existingOps) {
      await ctx.db.patch(existingOps._id, {
        code: otp,
        expires: Date.now() + 15 * 60 * 1000,
      });
    } else {
      await ctx.db.insert("verificationCodes", {
        identifier: `ops_otp_${normalized}`,
        code: otp,
        expires: Date.now() + 15 * 60 * 1000,
      });
    }


    // Send security code email via Google Workspace SMTP
    await ctx.scheduler.runAfter(0, internal.emails.sendEmailOtp, {
      to: admin.email,
      code: otp,
      locale: args.locale || "de",
      type: "ops_login",
    });

    return {
      success: true,
      email: admin.email,
    };
  },
});

// Step 2 of Ops 2FA Login: Verify 6-digit OTP, establish session and audit log
export const completeAdminLoginWithOtp = mutation({
  args: {
    email: v.string(),
    otp: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
    admin: v.optional(
      v.object({
        _id: v.id("adminUsers"),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("regional_admin"), v.literal("staff")),
        regionId: v.string(),
        permissions: v.array(v.string()),
        sessionToken: v.string(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    const cleanOtp = args.otp.replace(/\D/g, "").trim();

    if (cleanOtp.length !== 6) {
      return {
        success: false,
        error: "Der Bestätigungscode muss genau 6 Ziffern lang sein.",
      };
    }

    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      return {
        success: false,
        error: "Kein Zugang für diese Administrator-E-Mail-Adresse hinterlegt.",
      };
    }

    if (!admin.isActive) {
      return {
        success: false,
        error: "Dieser Account ist vorübergehend deaktiviert.",
      };
    }

    // Verify OTP record
    const codeRecord = await ctx.db
      .query("verificationCodes")
      .withIndex("by_identifier", (q) => q.eq("identifier", `ops_otp_${normalized}`))
      .first();

    if (!codeRecord || codeRecord.code !== cleanOtp || Date.now() > codeRecord.expires) {
      return {
        success: false,
        error: "Ungültiger oder abgelaufener 6-stelliger Bestätigungscode. Bitte fordere bei Bedarf einen neuen Code an.",
      };
    }

    // Delete verified OTP record
    await ctx.db.delete(codeRecord._id);

    // Create secure 30-day session token
    const sessionToken = `ops_session_${crypto.randomUUID()}`;
    await ctx.db.insert("verificationCodes", {
      identifier: sessionToken,
      code: admin._id,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.patch(admin._id, {
      lastLoginAt: Date.now(),
    });

    // Record in immutable audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin.email,
      actorRole: admin.role,
      action: "ops.login",
      entityType: "adminUsers",
      entityId: admin._id,
      regionId: admin.regionId,
      details: JSON.stringify({ email: admin.email, method: "password_plus_otp_2fa", timestamp: Date.now() }),
      timestamp: Date.now(),
    });

    return {
      success: true,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        regionId: admin.regionId,
        permissions: admin.permissions,
        sessionToken,
      },
    };
  },
});

// Resend OTP for Ops Login
export const resendAdminOtp = mutation({
  args: {
    email: v.string(),
    locale: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin || !admin.isActive) {
      return {
        success: false,
        error: "Kein aktiver Administrator-Account für diese E-Mail-Adresse gefunden.",
      };
    }

    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const otp = (100000 + (buf[0] % 900000)).toString();

    const existingOps = await ctx.db
      .query("verificationCodes")
      .withIndex("by_identifier", (q) => q.eq("identifier", `ops_otp_${normalized}`))
      .first();

    if (existingOps) {
      await ctx.db.patch(existingOps._id, {
        code: otp,
        expires: Date.now() + 15 * 60 * 1000,
      });
    } else {
      await ctx.db.insert("verificationCodes", {
        identifier: `ops_otp_${normalized}`,
        code: otp,
        expires: Date.now() + 15 * 60 * 1000,
      });
    }

    await ctx.scheduler.runAfter(0, internal.emails.sendEmailOtp, {
      to: admin.email,
      code: otp,
      locale: args.locale || "de",
      type: "ops_login",
    });

    return { success: true };
  },
});

// Authenticate Admin and create secure session
export const loginAdmin = mutation({
  args: {
    email: v.string(),
    password: v.optional(v.string()),
    otp: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
    admin: v.optional(
      v.object({
        _id: v.id("adminUsers"),
        email: v.string(),
        name: v.string(),
        role: v.union(v.literal("regional_admin"), v.literal("staff")),
        regionId: v.string(),
        permissions: v.array(v.string()),
        sessionToken: v.string(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();

    if (!admin) {
      return {
        success: false,
        error: "Kein Administrations-Zugang für diese E-Mail-Adresse hinterlegt.",
      };
    }

    if (!admin.isActive) {
      return {
        success: false,
        error: "Dieser Account ist vorübergehend deaktiviert.",
      };
    }

    // Verify password if provided
    const expectedPassword = admin.password || "demo";
    if (args.password && args.password !== expectedPassword) {
      return {
        success: false,
        error: "Ungültiges Administrator-Passwort.",
      };
    }

    // Verify OTP if OTP provided
    if (args.otp) {
      const codeRecord = await ctx.db
        .query("verificationCodes")
        .withIndex("by_identifier", (q) => q.eq("identifier", `admin_otp_${normalized}`))
        .first();

      if (!codeRecord || codeRecord.code !== args.otp || Date.now() > codeRecord.expires) {
        return {
          success: false,
          error: "Ungültiger oder abgelaufener Einmalcode.",
        };
      }
      await ctx.db.delete(codeRecord._id);
    }

    // Generate secure session token
    const sessionToken = `admin_session_${crypto.randomUUID()}`;
    await ctx.db.insert("verificationCodes", {
      identifier: sessionToken,
      code: admin._id,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    await ctx.db.patch(admin._id, {
      lastLoginAt: Date.now(),
    });

    // Record in audit log
    await ctx.db.insert("auditLogs", {
      actorId: admin.email,
      actorRole: admin.role,
      action: "admin.login",
      entityType: "adminUsers",
      entityId: admin._id,
      regionId: admin.regionId,
      details: JSON.stringify({ email: admin.email, timestamp: Date.now() }),
      timestamp: Date.now(),
    });

    return {
      success: true,
      admin: {
        _id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        regionId: admin.regionId,
        permissions: admin.permissions,
        sessionToken,
      },
    };
  },
});

// Verify session token
export const verifyAdminSession = query({
  args: {
    sessionToken: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("adminUsers"),
      email: v.string(),
      name: v.string(),
      role: v.union(v.literal("regional_admin"), v.literal("staff")),
      regionId: v.string(),
      permissions: v.array(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    if (!args.sessionToken) return null;
    const session = await ctx.db
      .query("verificationCodes")
      .withIndex("by_identifier", (q) => q.eq("identifier", args.sessionToken))
      .first();

    if (!session || Date.now() > session.expires) return null;
    const admin = (await ctx.db.get(session.code as Id<"adminUsers">)) as (Doc<"adminUsers"> | null);
    if (!admin || !admin.isActive) return null;
    return {
      _id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      regionId: admin.regionId,
      permissions: admin.permissions,
    };
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
    totalBusinesses: v.number(),
    activeBusinesses: v.number(),
    totalOrders: v.number(),
    gmvCents: v.number(),
    platformFeeCents: v.number(),
    partnerCommissionCents: v.number(),
    subscriberCount: v.number(),
  }),
  handler: async (ctx, args) => {
    // 1. Businesses in region (Restaurants, Cafés, Imbisse, Bars, etc.)
    const allBusinesses = await ctx.db.query("businesses").collect();
    const regionBusinesses = allBusinesses.filter(
      (biz) => (biz.region || "de").toLowerCase() === args.regionId.toLowerCase()
    );
    const businessIds = new Set(regionBusinesses.map((b) => b._id));

    const totalBusinesses = regionBusinesses.length;
    const activeBusinesses = regionBusinesses.filter((b) => b.stripeOnboardingComplete).length;

    // 2. Orders for these businesses
    const allOrders = await ctx.db.query("orders").collect();
    const regionOrders = allOrders.filter((ord) => businessIds.has(ord.businessId));

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
      totalBusinesses,
      activeBusinesses,
      totalOrders: regionOrders.length,
      gmvCents,
      platformFeeCents,
      partnerCommissionCents,
      subscriberCount: subscribers.length,
    };
  },
});

// List regional businesses with details (Restaurants, Cafés, Imbisse, Bars, etc.)
export const listRegionalBusinesses = query({
  args: { regionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("businesses"),
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
    const allBusinesses = await ctx.db.query("businesses").collect();
    return allBusinesses
      .filter((biz) => (biz.region || "de").toLowerCase() === args.regionId.toLowerCase())
      .map((biz) => ({
        _id: biz._id,
        _creationTime: biz._creationTime,
        name: biz.name,
        address: biz.address,
        ownerId: biz.ownerId,
        stripeAccountId: biz.stripeAccountId,
        stripeOnboardingComplete: biz.stripeOnboardingComplete,
        isToGoEnabled: biz.isToGoEnabled,
        isToStayEnabled: biz.isToStayEnabled,
        legalName: biz.legalName,
        taxId: biz.taxId,
        currency: biz.currency,
        region: biz.region,
        partnerCode: biz.partnerCode,
        tablesCount: biz.tables?.length || 0,
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
      orderNumber: v.string(),
      stripePaymentId: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      zackischFee: v.number(),
      currency: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const allBusinesses = await ctx.db.query("businesses").collect();
    const regionBusinessIds = new Set(
      allBusinesses
        .filter((biz) => (biz.region || "de").toLowerCase() === args.regionId.toLowerCase())
        .map((biz) => biz._id)
    );

    const allOrders = await ctx.db.query("orders").order("desc").take(limit * 2);
    return allOrders
      .filter((o) => regionBusinessIds.has(o.businessId))
      .slice(0, limit)
      .map((o) => ({
        _id: o._id,
        _creationTime: o._creationTime,
        businessId: o.businessId,
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
    const staff = await ctx.db
      .query("adminUsers")
      .withIndex("by_regionId", (q) => q.eq("regionId", args.regionId))
      .collect();
    return staff.map(({ password: _password, ...member }) => member);
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

// Update or set admin password
export const setAdminPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const normalized = args.email.toLowerCase().trim();
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", normalized))
      .first();
    if (!admin) return false;
    await ctx.db.patch(admin._id, { password: args.password });
    return true;
  },
});

