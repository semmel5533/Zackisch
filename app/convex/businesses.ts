import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { requireOwnedMedia, deleteUnusedMedia } from "./merchantMedia";
import { getMerchantUserId, requireOwner } from "./permissions";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const businessObjectValidator = v.object({
  _id: v.id("businesses"),
  _creationTime: v.number(),
  name: v.string(),
  address: v.optional(v.string()),
  logoStorageId: v.optional(v.union(v.id("_storage"), v.null())),
  logoUrl: v.union(v.string(), v.null()),
  bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
  bannerUrl: v.union(v.string(), v.null()),
  ownerId: v.string(),
  stripeAccountId: v.optional(v.string()),
  stripeOnboardingComplete: v.optional(v.boolean()),
  stripeChargesEnabled: v.optional(v.boolean()),
  stripePayoutsEnabled: v.optional(v.boolean()),
  stripeRequirementsStatus: v.optional(v.string()),
  stripeCurrentlyDue: v.optional(v.array(v.string())),
  stripePastDue: v.optional(v.array(v.string())),
  stripeDisabledReason: v.optional(v.string()),
  stripeFeeCollector: v.optional(v.string()),
  stripeLossCollector: v.optional(v.string()),
  stripeDashboardType: v.optional(v.string()),
  stripeConnectedAt: v.optional(v.number()),
  stripeLastSyncedAt: v.optional(v.number()),
  isToGoEnabled: v.optional(v.boolean()),
  isToStayEnabled: v.optional(v.boolean()),
  legalName: v.optional(v.string()),
  taxId: v.optional(v.string()),
  vatId: v.optional(v.string()),
  contactEmail: v.optional(v.string()),
  contactPhone: v.optional(v.string()),
  currency: v.optional(v.string()),
  region: v.optional(v.string()),
  partnerCode: v.optional(v.string()),
  deletionRequested: v.optional(v.boolean()),
  tables: v.optional(v.array(v.string())),
  isPaused: v.optional(v.boolean()),
  pauseReason: v.optional(v.string()),
  posWorkflowConfirmedAt: v.optional(v.number()),
  testOrderCompletedAt: v.optional(v.number()),
  setupDismissedAt: v.optional(v.number()),
  isUpsellingEnabled: v.optional(v.boolean()),
  isTippingEnabled: v.optional(v.boolean()),
  isPopularCategoryEnabled: v.optional(v.boolean()),
});

async function loadBusiness(ctx: QueryCtx, id: Id<"businesses">) {
  const business = await ctx.db.get(id);
  if (!business) return null;

  let logoUrl: string | null = null;
  if (business.logoStorageId) {
    logoUrl = await ctx.storage.getUrl(business.logoStorageId);
  }
  let bannerUrl: string | null = null;
  if (business.bannerStorageId) {
    bannerUrl = await ctx.storage.getUrl(business.bannerStorageId);
  }

  return {
    ...business,
    logoUrl,
    bannerUrl,
  };
}

export const get = query({
  args: { id: v.id("businesses"), sessionToken: v.optional(v.string()) },
  returns: v.union(v.null(), businessObjectValidator),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.id, args.sessionToken);
    return loadBusiness(ctx, args.id);
  },
});

export const getInternal = internalQuery({
  args: { id: v.id("businesses") },
  returns: v.union(v.null(), businessObjectValidator),
  handler: (ctx, args) => loadBusiness(ctx, args.id),
});

export const getForOwnerInternal = internalQuery({
  args: { id: v.id("businesses"), sessionToken: v.optional(v.string()) },
  returns: v.union(v.null(), businessObjectValidator),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.id, args.sessionToken);
    return loadBusiness(ctx, args.id);
  },
});

export const getByStripeAccountInternal = internalQuery({
  args: { stripeAccountId: v.string() },
  returns: v.union(v.null(), v.id("businesses")),
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_stripeAccountId", (q) =>
        q.eq("stripeAccountId", args.stripeAccountId)
      )
      .first();
    return business ? business._id : null;
  },
});

export const getPublicRestaurant = query({
  args: { id: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("businesses"),
      name: v.string(),
      legalName: v.optional(v.string()),
      address: v.optional(v.string()),
      vatId: v.optional(v.string()),
      contactEmail: v.optional(v.string()),
      contactPhone: v.optional(v.string()),
      logoUrl: v.union(v.string(), v.null()),
      bannerUrl: v.union(v.string(), v.null()),
      isToGoEnabled: v.optional(v.boolean()),
      isToStayEnabled: v.optional(v.boolean()),
      isPaused: v.boolean(),
      canOrder: v.boolean(),
      currency: v.optional(v.string()),
      region: v.optional(v.string()),
      tables: v.optional(v.array(v.string())),
      isUpsellingEnabled: v.optional(v.boolean()),
      isTippingEnabled: v.optional(v.boolean()),
      isPopularCategoryEnabled: v.optional(v.boolean()),
    })
  ),
  handler: async (ctx, args) => {
    const id = ctx.db.normalizeId("businesses", args.id);
    if (!id) return null;
    const org = await ctx.db.get(id);
    if (!org) return null;
    let logoUrl: string | null = null;
    if (org.logoStorageId) {
      logoUrl = await ctx.storage.getUrl(org.logoStorageId);
    }
    let bannerUrl: string | null = null;
    if (org.bannerStorageId) {
      bannerUrl = await ctx.storage.getUrl(org.bannerStorageId);
    }
    return {
      _id: org._id,
      name: org.name,
      legalName: org.legalName || org.name,
      address: org.address,
      vatId: org.vatId,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      logoUrl,
      bannerUrl,
      isToGoEnabled: org.isToGoEnabled,
      isToStayEnabled: org.isToStayEnabled,
      isPaused: org.isPaused ?? false,
      canOrder: Boolean(!org.isPaused && !org.deletionRequested && org.stripeAccountId &&
        !org.stripeAccountId.startsWith("acct_test_") &&
        org.stripeOnboardingComplete && org.stripeChargesEnabled && org.stripePayoutsEnabled),
      currency: org.currency || "EUR",
      region: org.region || "de",
      tables: org.tables,
      isUpsellingEnabled: org.isUpsellingEnabled ?? true,
      isTippingEnabled: org.isTippingEnabled ?? true,
      isPopularCategoryEnabled: org.isPopularCategoryEnabled ?? true,
    };
  },
});

export const getByOwner = query({
  args: { ownerId: v.string(), sessionToken: v.optional(v.string()) },
  returns: v.union(v.null(), businessObjectValidator),
  handler: async (ctx, args) => {
    const userId = await getMerchantUserId(ctx, args.sessionToken);
    if (!userId || userId !== args.ownerId) throw new Error("Unauthorized");
    const business = await ctx.db.query("businesses")
      .withIndex("by_ownerId", q => q.eq("ownerId", userId)).first();
    return business ? loadBusiness(ctx, business._id) : null;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.string(),
    sessionToken: v.optional(v.string()),
    address: v.optional(v.string()),
    logoStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    legalName: v.optional(v.string()),
    taxId: v.optional(v.string()),
    vatId: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    currency: v.optional(v.string()),
    region: v.optional(v.string()),
    tables: v.optional(v.array(v.string())),
  },
  returns: v.id("businesses"),
  handler: async (ctx, args) => {
    const ownerId = await getMerchantUserId(ctx, args.sessionToken);
    if (!ownerId || ownerId !== args.ownerId) throw new Error("Unauthorized");
    if (args.logoStorageId || args.bannerStorageId) throw new Error("UPLOAD_MEDIA_AFTER_CREATION");
    const trimmedName = args.name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      throw new Error("Invalid business name");
    }
    if (args.address && args.address.length > 200) {
      throw new Error("Address too long");
    }
    if (args.tables) {
      if (args.tables.length > 100) {
        throw new Error("Too many tables");
      }
      for (const table of args.tables) {
        const trimmed = table.trim();
        if (trimmed.length < 1 || trimmed.length > 4) {
          throw new Error("Table name must be between 1 and 4 characters");
        }
      }
    }

    const businessId = await ctx.db.insert("businesses", {
      name: trimmedName,
      ownerId,
      address: args.address,
      logoStorageId: args.logoStorageId || undefined,
      bannerStorageId: args.bannerStorageId || undefined,
      stripeAccountId: undefined,
      stripeOnboardingComplete: false,
      stripeChargesEnabled: false,
      stripePayoutsEnabled: false,
      stripeRequirementsStatus: "unlinked",
      isToGoEnabled: false,
      isToStayEnabled: false,
      legalName: args.legalName,
      taxId: args.taxId,
      vatId: args.vatId,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      currency: args.currency ?? "EUR",
      region: args.region || "de",
      deletionRequested: false,
      isPaused: false,
      tables: args.tables ?? [],
    });

    return businessId;
  },
});

export const update = mutation({
  args: {
    id: v.id("businesses"),
    sessionToken: v.optional(v.string()),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    logoStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    clearLogo: v.optional(v.boolean()),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    clearBanner: v.optional(v.boolean()),
    isToGoEnabled: v.optional(v.boolean()),
    isToStayEnabled: v.optional(v.boolean()),
    legalName: v.optional(v.string()),
    taxId: v.optional(v.string()),
    vatId: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    tables: v.optional(v.array(v.string())),
    isPaused: v.optional(v.boolean()),
    pauseReason: v.optional(v.string()),
    isUpsellingEnabled: v.optional(v.boolean()),
    isTippingEnabled: v.optional(v.boolean()),
    isPopularCategoryEnabled: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.id, args.sessionToken);
    const { id, sessionToken: _sessionToken, clearLogo, clearBanner, ...patchData } = args;
    if (patchData.name !== undefined) {
      const trimmedName = patchData.name.trim();
      if (trimmedName.length === 0 || trimmedName.length > 100) {
        throw new Error("Invalid business name");
      }
      patchData.name = trimmedName;
    }
    for (const field of ["legalName", "taxId", "vatId"] as const) {
      if (patchData[field] !== undefined) {
        const value = patchData[field]!.trim();
        if (value.length > (field === "legalName" ? 200 : 40)) {
          throw new Error("Invalid seller identity");
        }
        patchData[field] = value;
      }
    }
    if (patchData.address !== undefined && patchData.address.length > 200) {
      throw new Error("Address too long");
    }
    if (patchData.tables !== undefined) {
      if (patchData.tables.length > 100) {
        throw new Error("Too many tables");
      }
      for (const table of patchData.tables) {
        const trimmed = table.trim();
        if (trimmed.length < 1 || trimmed.length > 4) {
          throw new Error("Table name must be between 1 and 4 characters");
        }
      }
    }
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Business not found");

    for (const field of ["logoStorageId", "bannerStorageId"] as const) {
      if (patchData[field] && patchData[field] !== existing[field]) {
        await requireOwnedMedia(ctx, id, patchData[field]);
      }
    }
    if (clearLogo || patchData.logoStorageId === null) patchData.logoStorageId = undefined;
    if (clearBanner || patchData.bannerStorageId === null) patchData.bannerStorageId = undefined;

    await ctx.db.patch(id, patchData);
    await deleteUnusedMedia(ctx, id, existing.logoStorageId);
    await deleteUnusedMedia(ctx, id, existing.bannerStorageId);
    return null;
  },
});

export const bindStripeAccountInternal = internalMutation({
  args: {
    id: v.id("businesses"),
    stripeAccountId: v.string(),
    stripeDashboardType: v.string(),
    stripeFeeCollector: v.string(),
    stripeLossCollector: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Business not found");
    if (existing.stripeAccountId && existing.stripeAccountId !== args.stripeAccountId) {
      throw new Error("Stripe account already bound");
    }
    const { id, ...account } = args;
    await ctx.db.patch(id, {
      ...account,
      stripeConnectedAt: existing.stripeConnectedAt ?? Date.now(),
    });
    return null;
  },
});

export const syncStripeAccountStatusInternal = internalMutation({
  args: {
    businessId: v.id("businesses"),
    stripeAccountId: v.string(),
    stripeOnboardingComplete: v.boolean(),
    stripeChargesEnabled: v.boolean(),
    stripePayoutsEnabled: v.boolean(),
    stripeRequirementsStatus: v.string(),
    stripeCurrentlyDue: v.array(v.string()),
    stripePastDue: v.array(v.string()),
    stripeDisabledReason: v.optional(v.string()),
    stripeFeeCollector: v.string(),
    stripeLossCollector: v.string(),
    stripeDashboardType: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.businessId);
    if (!existing) return null;
    if (existing.stripeAccountId !== args.stripeAccountId) {
      throw new Error("Stripe account binding mismatch");
    }

    const shouldPauseForRestriction =
      existing.stripeOnboardingComplete && !args.stripeChargesEnabled;

    await ctx.db.patch(args.businessId, {
      stripeAccountId: args.stripeAccountId,
      stripeOnboardingComplete: args.stripeOnboardingComplete,
      stripeChargesEnabled: args.stripeChargesEnabled,
      stripePayoutsEnabled: args.stripePayoutsEnabled,
      stripeRequirementsStatus: args.stripeRequirementsStatus,
      stripeCurrentlyDue: args.stripeCurrentlyDue,
      stripePastDue: args.stripePastDue,
      stripeDisabledReason: args.stripeDisabledReason,
      stripeFeeCollector: args.stripeFeeCollector,
      stripeLossCollector: args.stripeLossCollector,
      stripeDashboardType: args.stripeDashboardType,
      stripeLastSyncedAt: Date.now(),
      ...(shouldPauseForRestriction
        ? {
            isPaused: true,
            pauseReason:
              args.stripeDisabledReason ||
              "Stripe-Auszahlungs- oder Zahlungsberechtigung eingeschränkt (KYC/Nachweise erforderlich).",
          }
        : {}),
    });
    return null;
  },
});

export const cascadeDelete = internalMutation({
  args: { businessId: v.id("businesses") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    if (business.logoStorageId) {
      await ctx.storage.delete(business.logoStorageId);
    }
    if (business.bannerStorageId) {
      await ctx.storage.delete(business.bannerStorageId);
    }

    // Delete categories
    const categories = await ctx.db
      .query("menuCategories")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const cat of categories) {
      await ctx.db.delete(cat._id);
    }

    // Delete items & their images
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const item of items) {
      if (item.imageStorageId) {
        await ctx.storage.delete(item.imageStorageId);
      }
      await ctx.db.delete(item._id);
    }

    // Preserve statutory order accounting data for §147 AO / GoBD retention by anonymizing guest email if orders exist
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const order of orders) {
      await ctx.db.patch(order._id, {
        email: "anonymized-retention@zackisch.com",
      });
    }

    // Delete order sessions
    const orderSessions = await ctx.db
      .query("orderSessions")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const s of orderSessions) {
      await ctx.db.delete(s._id);
    }

    // Delete availability sessions
    const availSessions = await ctx.db
      .query("availabilitySessions")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const s of availSessions) {
      await ctx.db.delete(s._id);
    }

    // Delete staff sessions
    const staffSessions = await ctx.db
      .query("staffSessions")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();
    for (const s of staffSessions) {
      await ctx.db.delete(s._id);
    }

    // Delete the business itself
    await ctx.db.delete(args.businessId);
    return null;
  },
});
