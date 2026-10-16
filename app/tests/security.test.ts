import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { priceCheckout } from "../convex/checkoutPricing";

const modules = import.meta.glob("../convex/**/*.ts");

async function setup() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", { name: "Owner" });
    const other = await ctx.db.insert("users", { name: "Other" });
    const businessId = await ctx.db.insert("businesses", {
      name: "Cafe",
      ownerId: owner,
    });
    const otherBusiness = await ctx.db.insert("businesses", {
      name: "Other cafe",
      ownerId: other,
    });
    const categoryId = await ctx.db.insert("menuCategories", {
      businessId,
      name: "Food",
      sortOrder: 0,
    });
    const otherCategory = await ctx.db.insert("menuCategories", {
      businessId: otherBusiness,
      name: "Other",
      sortOrder: 0,
    });
    const itemId = await ctx.db.insert("menuItems", {
      businessId,
      categoryId,
      name: "Cake",
      price: 500,
      available: true,
      sortOrder: 0,
      taxRate: 19,
      customizations: "[]",
    });
    await ctx.db.insert("verificationCodes", {
      identifier: "session_owner",
      code: owner,
      expires: Date.now() + 60000,
    });
    await ctx.db.insert("verificationCodes", {
      identifier: "session_other",
      code: other,
      expires: Date.now() + 60000,
    });
    await ctx.db.insert("verificationCodes", {
      identifier: "session_expired",
      code: owner,
      expires: Date.now() - 1,
    });
    await ctx.db.insert("staffSessions", { businessId, token: "staff" });
    await ctx.db.insert("staffSessions", {
      businessId,
      token: "expired-staff",
      expiresAt: new Date(Date.now() - 1).toISOString(),
    });
    return { businessId, otherBusiness, categoryId, otherCategory, itemId };
  });
  return { t, ...ids };
}

describe("tenant permissions at the public backend boundary", () => {
  it.each([undefined, "other", "expired"])(
    "rejects category creation with session %s",
    async (sessionToken) => {
      const { t, businessId } = await setup();
      await expect(
        t.mutation(api.menu.createCategory, {
          businessId,
          name: "New",
          sortOrder: 0,
          sessionToken,
        }),
      ).rejects.toThrow("Unauthorized");
    },
  );
  it("allows the owner and prevents moving items to a foreign category", async () => {
    const { t, businessId, itemId, otherCategory } = await setup();
    await expect(
      t.mutation(api.menu.createCategory, {
        businessId,
        name: "New",
        sortOrder: 0,
        sessionToken: "owner",
      }),
    ).resolves.toBeTruthy();
    await expect(
      t.mutation(api.menu.updateItem, {
        id: itemId,
        categoryId: otherCategory,
        sessionToken: "owner",
      }),
    ).rejects.toThrow("Invalid category");
  });
  it("restricts staff to availability changes", async () => {
    const { t, itemId } = await setup();
    await expect(
      t.mutation(api.menu.updateItem, {
        id: itemId,
        available: false,
        terminalToken: "staff",
      }),
    ).resolves.toBeNull();
    await expect(
      t.mutation(api.menu.updateItem, {
        id: itemId,
        price: 1,
        terminalToken: "staff",
      }),
    ).rejects.toThrow("Unauthorized");
    await expect(
      t.mutation(api.menu.updateItem, {
        id: itemId,
        available: true,
        terminalToken: "expired-staff",
      }),
    ).rejects.toThrow("Unauthorized");
  });
  it("does not disclose pairing tokens and enforces expiration and tenant scope", async () => {
    const { t, businessId, otherBusiness } = await setup();
    await expect(
      t.query(api.sessions.getStaffSessions, { businessId }),
    ).rejects.toThrow("Unauthorized");
    await expect(
      t.query(api.sessions.getStaffSessions, {
        businessId,
        sessionToken: "other",
      }),
    ).rejects.toThrow("Unauthorized");
    expect(
      await t.query(api.sessions.getStaffSessions, {
        businessId,
        sessionToken: "owner",
      }),
    ).toHaveLength(2);
    expect(
      await t.query(api.sessions.verifyTerminalSession, {
        businessId,
        token: "staff",
        type: "staff",
      }),
    ).toBe(true);
    expect(
      await t.query(api.sessions.verifyTerminalSession, {
        businessId: otherBusiness,
        token: "staff",
        type: "staff",
      }),
    ).toBe(false);
    expect(
      await t.query(api.sessions.verifyTerminalSession, {
        businessId,
        token: "expired-staff",
        type: "staff",
      }),
    ).toBe(false);
  });
});

const menu = [
  {
    _id: "cake",
    name: "Cake",
    price: 500,
    available: true,
    customizations: JSON.stringify([
      {
        name: "Topping",
        minSelections: 1,
        maxSelections: 2,
        includedCount: 1,
        options: [
          { name: "Cream", extraPrice: 100, available: true },
          { name: "Fruit", extraPrice: 200, available: true },
          { name: "Nuts", extraPrice: 100, available: false },
        ],
      },
    ]),
  },
];
const item = {
  menuItemId: "cake",
  name: "forged name",
  price: 700,
  quantity: 2,
  customizations: [
    { stepName: "Topping", optionName: "Cream", extraPrice: 0 },
    { stepName: "Topping", optionName: "Fruit", extraPrice: 0 },
  ],
};

describe("canonical checkout pricing", () => {
  it("uses stored names and option prices and includes the cheapest free choice", () => {
    const [priced] = priceCheckout(JSON.stringify([item]), menu, 1400);
    expect(priced.name).toBe("Cake");
    expect(priced.customizations?.map((choice) => choice.extraPrice)).toEqual([
      0, 200,
    ]);
  });
  it.each([
    { ...item, menuItemId: "unknown" },
    { ...item, menuItemId: undefined },
    { ...item, price: 500 },
    { ...item, quantity: 1.5 },
    { ...item, customizations: [] },
    {
      ...item,
      customizations: [item.customizations[0], item.customizations[0]],
    },
    { ...item, customizations: [{ stepName: "Topping", optionName: "Nuts" }] },
    { ...item, customizations: [{ stepName: "Unknown", optionName: "Cream" }] },
  ])("rejects an invalid cart %#", (invalid) => {
    expect(() =>
      priceCheckout(JSON.stringify([invalid]), menu, 1400),
    ).toThrow();
  });
  it("rejects unavailable items and incorrect totals", () => {
    expect(() =>
      priceCheckout(
        JSON.stringify([item]),
        [{ ...menu[0], available: false }],
        1400,
      ),
    ).toThrow();
    expect(() => priceCheckout(JSON.stringify([item]), menu, 1399)).toThrow();
  });
});
