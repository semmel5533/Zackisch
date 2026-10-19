/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function setupSmartMenuFixtures() {
  const t = convexTest(schema, modules);
  const data = await t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", { email: "owner@zackisch.test" });
    const businessId = await ctx.db.insert("businesses", {
      name: "Smart Burger",
      ownerId: owner,
      isUpsellingEnabled: true,
      isTippingEnabled: true,
      isPopularCategoryEnabled: true,
    });
    const categoryId = await ctx.db.insert("menuCategories", {
      businessId,
      name: "Speisen",
      sortOrder: 0,
    });

    // Insert session token for owner
    await ctx.db.insert("verificationCodes", {
      identifier: "session_owner",
      code: owner,
      expires: Date.now() + 60_000,
    });

    // Create 4 menu items
    const burgerId = await ctx.db.insert("menuItems", {
      businessId,
      categoryId,
      name: "Classic Cheeseburger",
      price: 1150, // 11.50 €
      available: true,
      sortOrder: 0,
      taxRate: 7,
      customizations: "[]",
    });

    const friesId = await ctx.db.insert("menuItems", {
      businessId,
      categoryId,
      name: "Crispy Fries",
      price: 450, // 4.50 €
      available: true,
      sortOrder: 1,
      taxRate: 7,
      customizations: "[]",
    });

    const sodaId = await ctx.db.insert("menuItems", {
      businessId,
      categoryId,
      name: "Club Mate",
      price: 350, // 3.50 €
      available: true,
      sortOrder: 2,
      taxRate: 19,
      customizations: "[]",
    });

    const saladId = await ctx.db.insert("menuItems", {
      businessId,
      categoryId,
      name: "Seasonal Salad",
      price: 900, // 9.00 €
      available: true,
      sortOrder: 3,
      taxRate: 7,
      customizations: "[]",
    });

    // Create verified orders
    // Order 1: Burger + Fries + Soda (completed)
    await ctx.db.insert("orders", {
      businessId,
      type: "dine-in",
      tableNumber: "12",
      items: JSON.stringify([
        { menuItemId: burgerId, name: "Classic Cheeseburger", price: 1150, quantity: 1 },
        { menuItemId: friesId, name: "Crispy Fries", price: 450, quantity: 1 },
        { menuItemId: sodaId, name: "Club Mate", price: 350, quantity: 1 },
      ]),
      total: 1950,
      status: "completed",
      email: "guest1@example.com",
      orderNumber: "Z-101",
      zakkigFee: 39,
      stripeFee: 30,
      netAmount: 1881,
      currency: "eur",
    });

    // Order 2: Burger + Fries (completed)
    await ctx.db.insert("orders", {
      businessId,
      type: "dine-in",
      tableNumber: "04",
      items: JSON.stringify([
        { menuItemId: burgerId, name: "Classic Cheeseburger", price: 1150, quantity: 1 },
        { menuItemId: friesId, name: "Crispy Fries", price: 450, quantity: 2 },
      ]),
      total: 2050,
      status: "completed",
      email: "guest2@example.com",
      orderNumber: "Z-102",
      zakkigFee: 41,
      stripeFee: 31,
      netAmount: 1978,
      currency: "eur",
    });

    // Order 3: Fries + Soda (in_progress)
    await ctx.db.insert("orders", {
      businessId,
      type: "takeaway",
      items: JSON.stringify([
        { menuItemId: friesId, name: "Crispy Fries", price: 450, quantity: 1 },
        { menuItemId: sodaId, name: "Club Mate", price: 350, quantity: 1 },
      ]),
      total: 800,
      status: "in_progress",
      email: "guest3@example.com",
      orderNumber: "Z-103",
      zakkigFee: 16,
      stripeFee: 12,
      netAmount: 772,
      currency: "eur",
    });

    // Order 4 (cancelled): Salad x 5 - must NOT count towards popularity rankings
    await ctx.db.insert("orders", {
      businessId,
      type: "dine-in",
      items: JSON.stringify([
        { menuItemId: saladId, name: "Seasonal Salad", price: 900, quantity: 5 },
      ]),
      total: 4500,
      status: "cancelled",
      email: "cancelled@example.com",
      orderNumber: "Z-999",
      zakkigFee: 0,
      stripeFee: 0,
      netAmount: 0,
      currency: "eur",
    });

    return {
      businessId,
      categoryId,
      burgerId,
      friesId,
      sodaId,
      saladId,
    };
  });

  return { t, ...data };
}

describe("Intelligent Smart Menu System", () => {
  it("recommends items frequently ordered together based on cart contents", async () => {
    const { t, businessId, burgerId, friesId, sodaId } = await setupSmartMenuFixtures();

    // With burger in cart, recommendations should prioritize fries (co-occurred in Order 1 & 2)
    const recommendations = await t.query(api.smartMenu.getSmartMenuRecommendations, {
      businessId,
      currentCartItemIds: [burgerId],
      limit: 2,
    });

    expect(recommendations.length).toBeGreaterThanOrEqual(1);
    expect(recommendations[0]._id).toBe(friesId);
    expect(recommendations.map((r: any) => r._id)).not.toContain(burgerId);
  });

  it("suggests popular small add-on items under price boundary before checkout", async () => {
    const { t, businessId, burgerId, friesId, sodaId, saladId } = await setupSmartMenuFixtures();

    const addons = await t.query(api.smartMenu.getCheckoutAddons, {
      businessId,
      currentCartItemIds: [burgerId],
      maxPriceCents: 500, // max 5.00 €
      limit: 3,
    });

    // Crispy Fries (4.50€) and Club Mate (3.50€) are under 5.00€; Salad (9.00€) is not
    const addonIds = addons.map((a: any) => a._id);
    expect(addonIds).toContain(friesId);
    expect(addonIds).toContain(sodaId);
    expect(addonIds).not.toContain(saladId);
    expect(addonIds).not.toContain(burgerId);
  });

  it("generates virtual Beliebteste category from verified non-cancelled orders", async () => {
    const { t, businessId, burgerId, friesId, sodaId, saladId } = await setupSmartMenuFixtures();

    const popular = await t.query(api.smartMenu.getPopularItems, {
      businessId,
      limit: 5,
    });

    const popularIds = popular.map((p: any) => p._id);
    // Fries (4 total sold across orders 1, 2, 3) must rank first
    expect(popularIds[0]).toBe(friesId);
    // Salad from cancelled order should not be included
    expect(popularIds).not.toContain(saladId);
  });

  it("respects business feature toggles and disables upselling or popular category when turned off", async () => {
    const { t, businessId, burgerId } = await setupSmartMenuFixtures();

    // Disable upselling and popular category
    await t.mutation(api.businesses.update, {
      id: businessId,
      sessionToken: "owner",
      isUpsellingEnabled: false,
      isPopularCategoryEnabled: false,
      isTippingEnabled: false,
    });

    const recommendations = await t.query(api.smartMenu.getSmartMenuRecommendations, {
      businessId,
      currentCartItemIds: [burgerId],
    });
    expect(recommendations).toEqual([]);

    const addons = await t.query(api.smartMenu.getCheckoutAddons, {
      businessId,
      currentCartItemIds: [burgerId],
    });
    expect(addons).toEqual([]);

    const popular = await t.query(api.smartMenu.getPopularItems, {
      businessId,
    });
    expect(popular).toEqual([]);

    // Check public restaurant reflects disabled toggles
    const publicRestaurant = await t.query(api.businesses.getPublicRestaurant, {
      id: businessId,
    });
    expect(publicRestaurant?.isUpsellingEnabled).toBe(false);
    expect(publicRestaurant?.isPopularCategoryEnabled).toBe(false);
    expect(publicRestaurant?.isTippingEnabled).toBe(false);
  });
});
