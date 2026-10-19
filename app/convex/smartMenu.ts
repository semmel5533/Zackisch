import { query } from "./_generated/server";
import { v } from "convex/values";
import { dietaryLabelsValidator } from "./menuValidators";
import type { Id } from "./_generated/dataModel";

const menuItemResultValidator = v.object({
  _id: v.id("menuItems"),
  _creationTime: v.number(),
  businessId: v.id("businesses"),
  categoryId: v.id("menuCategories"),
  name: v.string(),
  description: v.optional(v.string()),
  price: v.number(),
  imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
  imageUrl: v.union(v.string(), v.null()),
  available: v.boolean(),
  sortOrder: v.number(),
  taxRate: v.number(),
  customizations: v.string(),
  dietaryLabels: v.optional(dietaryLabelsValidator),
  allergens: v.optional(v.array(v.string())),
  additives: v.optional(v.array(v.string())),
});

/**
 * Extracts normalized item IDs from an order's JSON items string.
 */
function extractItemIdsFromOrder(itemsJson: string): string[] {
  try {
    const parsed = JSON.parse(itemsJson);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item: any) => item.menuItemId || item.id)
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

/**
 * Extracts item quantities from an order's JSON items string.
 */
function extractItemQuantitiesFromOrder(itemsJson: string): Map<string, number> {
  const map = new Map<string, number>();
  try {
    const parsed = JSON.parse(itemsJson);
    if (!Array.isArray(parsed)) return map;
    for (const item of parsed) {
      const id = item.menuItemId || item.id;
      if (id) {
        const qty = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
        map.set(id, (map.get(id) || 0) + qty);
      }
    }
  } catch {
    // Ignore JSON errors in corrupt order items
  }
  return map;
}

/**
 * Returns automatically generated recommendations for items frequently ordered together
 * with the items currently in the cart, based strictly on verified restaurant order history.
 */
export const getSmartMenuRecommendations = query({
  args: {
    businessId: v.id("businesses"),
    currentCartItemIds: v.array(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(menuItemResultValidator),
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business || business.isUpsellingEnabled === false) {
      return [];
    }

    const limit = args.limit ?? 4;
    const cartSet = new Set(args.currentCartItemIds);

    // Retrieve verified (non-cancelled) orders for this business
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    // Calculate co-occurrence frequencies
    const coOccurrenceCounts = new Map<string, number>();
    const overallCounts = new Map<string, number>();

    for (const order of orders) {
      const itemIds = extractItemIdsFromOrder(order.items);
      const containsCartItem = itemIds.some((id) => cartSet.has(id));

      for (const id of itemIds) {
        overallCounts.set(id, (overallCounts.get(id) || 0) + 1);
        if (containsCartItem && !cartSet.has(id)) {
          coOccurrenceCounts.set(id, (coOccurrenceCounts.get(id) || 0) + 1);
        }
      }
    }

    // Sort candidate item IDs: co-occurrence first, then overall sales volume
    const candidateIds = Array.from(overallCounts.keys()).filter(
      (id) => !cartSet.has(id),
    );

    candidateIds.sort((a, b) => {
      const scoreA = (coOccurrenceCounts.get(a) || 0) * 3 + (overallCounts.get(a) || 0);
      const scoreB = (coOccurrenceCounts.get(b) || 0) * 3 + (overallCounts.get(b) || 0);
      return scoreB - scoreA;
    });

    const recommendations = [];
    for (const rawId of candidateIds) {
      if (recommendations.length >= limit) break;
      const normalizedId = ctx.db.normalizeId("menuItems", rawId);
      if (!normalizedId) continue;

      const item = await ctx.db.get(normalizedId);
      if (item && item.businessId === args.businessId && item.available) {
        let imageUrl: string | null = null;
        if (item.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(item.imageStorageId);
        }
        recommendations.push({
          ...item,
          imageUrl,
        });
      }
    }

    // If still under limit, backfill with available items from this business
    if (recommendations.length < limit) {
      const existingIds = new Set([
        ...args.currentCartItemIds,
        ...recommendations.map((r) => r._id),
      ]);
      const availableItems = await ctx.db
        .query("menuItems")
        .withIndex("by_businessId_and_available", (q) =>
          q.eq("businessId", args.businessId).eq("available", true),
        )
        .take(limit * 2);

      for (const item of availableItems) {
        if (recommendations.length >= limit) break;
        if (!existingIds.has(item._id)) {
          let imageUrl: string | null = null;
          if (item.imageStorageId) {
            imageUrl = await ctx.storage.getUrl(item.imageStorageId);
          }
          recommendations.push({
            ...item,
            imageUrl,
          });
          existingIds.add(item._id);
        }
      }
    }

    return recommendations;
  },
});

/**
 * Returns optional small addition items before checkout (drinks, sides, desserts, sauces)
 * filtered by price threshold and verified popularity.
 */
export const getCheckoutAddons = query({
  args: {
    businessId: v.id("businesses"),
    currentCartItemIds: v.array(v.string()),
    maxPriceCents: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  returns: v.array(menuItemResultValidator),
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business || business.isUpsellingEnabled === false) {
      return [];
    }

    const maxPrice = args.maxPriceCents ?? 600; // default max 6.00 €
    const limit = args.limit ?? 3;
    const cartSet = new Set(args.currentCartItemIds);

    // Get verified orders to rank add-ons by popularity
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    const salesCounts = new Map<string, number>();
    for (const order of orders) {
      const quantities = extractItemQuantitiesFromOrder(order.items);
      for (const [id, qty] of quantities) {
        salesCounts.set(id, (salesCounts.get(id) || 0) + qty);
      }
    }

    // Get available items within price boundary
    const availableItems = await ctx.db
      .query("menuItems")
      .withIndex("by_businessId_and_available", (q) =>
        q.eq("businessId", args.businessId).eq("available", true),
      )
      .collect();

    const candidates = availableItems.filter(
      (item) => item.price <= maxPrice && !cartSet.has(item._id),
    );

    // Sort by sales count descending, then price ascending
    candidates.sort((a, b) => {
      const salesA = salesCounts.get(a._id) || 0;
      const salesB = salesCounts.get(b._id) || 0;
      if (salesB !== salesA) return salesB - salesA;
      return a.price - b.price;
    });

    const results = [];
    for (const item of candidates.slice(0, limit)) {
      let imageUrl: string | null = null;
      if (item.imageStorageId) {
        imageUrl = await ctx.storage.getUrl(item.imageStorageId);
      }
      results.push({
        ...item,
        imageUrl,
      });
    }

    return results;
  },
});

/**
 * Automatically computes the virtual "Beliebteste" (Most Popular) category
 * based on verified restaurant sales counts.
 */
export const getPopularItems = query({
  args: {
    businessId: v.id("businesses"),
    limit: v.optional(v.number()),
  },
  returns: v.array(menuItemResultValidator),
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business || business.isPopularCategoryEnabled === false) {
      return [];
    }

    const limit = args.limit ?? 8;

    // Count sales across all verified non-cancelled orders for this business
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    const salesCounts = new Map<string, number>();
    for (const order of orders) {
      const quantities = extractItemQuantitiesFromOrder(order.items);
      for (const [id, qty] of quantities) {
        salesCounts.set(id, (salesCounts.get(id) || 0) + qty);
      }
    }

    if (salesCounts.size === 0) {
      return [];
    }

    // Sort item IDs by verified sales volume
    const sortedIds = Array.from(salesCounts.entries())
      .filter(([, qty]) => qty > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const popularItems = [];
    for (const rawId of sortedIds) {
      if (popularItems.length >= limit) break;
      const normalizedId = ctx.db.normalizeId("menuItems", rawId);
      if (!normalizedId) continue;

      const item = await ctx.db.get(normalizedId);
      if (item && item.businessId === args.businessId && item.available) {
        let imageUrl: string | null = null;
        if (item.imageStorageId) {
          imageUrl = await ctx.storage.getUrl(item.imageStorageId);
        }
        popularItems.push({
          ...item,
          imageUrl,
        });
      }
    }

    return popularItems;
  },
});
