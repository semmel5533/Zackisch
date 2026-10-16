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

describe("P0 Security Boundary Enforcements", () => {
  it("P0-01/P0-05: prevents unauthenticated access and cross-merchant access to support tickets", async () => {
    const t = convexTest(schema, modules);
    const { businessId, ticketId, sessionToken } = await t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", { name: "Merchant A", email: "merchanta@example.com" });
      const other = await ctx.db.insert("users", { name: "Merchant B", email: "merchantb@example.com" });
      const businessId = await ctx.db.insert("businesses", {
        name: "Cafe A",
        ownerId: owner,
        region: "de",
      });
      await ctx.db.insert("businesses", {
        name: "Cafe B",
        ownerId: other,
        region: "de",
      });

      const sessionToken = "valid_support_session_token_123";
      await ctx.db.insert("supportSessions", {
        token: sessionToken,
        userId: String(owner),
        businessId,
        businessName: "Cafe A",
        email: "merchanta@example.com",
        name: "Merchant A",
        regionId: "de",
        expiresAt: Date.now() + 86400000,
      });

      const ticketId = await ctx.db.insert("supportTickets", {
        ticketNumber: "ZCK-1001",
        businessId,
        businessName: "Cafe A",
        requesterUserId: String(owner),
        requesterEmail: "merchanta@example.com",
        requesterName: "Merchant A",
        regionId: "de",
        category: "pos_reconciliation",
        priority: "normal",
        status: "open",
        subject: "Secret merchant inquiry",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastMessageAt: Date.now(),
      });

      await ctx.db.insert("supportMessages", {
        ticketId,
        regionId: "de",
        authorType: "merchant",
        authorId: String(owner),
        authorName: "Merchant A",
        visibility: "public",
        body: "Hello support",
        createdAt: Date.now(),
      });

      await ctx.db.insert("supportMessages", {
        ticketId,
        regionId: "de",
        authorType: "staff",
        authorId: "staff@zackisch.com",
        authorName: "Internal Staff",
        visibility: "internal",
        body: "CONFIDENTIAL INTERNAL NOTE: Do not show merchant",
        createdAt: Date.now(),
      });

      return { businessId, ticketId, sessionToken };
    });

    // 1. Unauthenticated query returns empty array
    const unauthTickets = await t.query(api.support.getCustomerTickets, {});
    expect(unauthTickets).toEqual([]);

    // 2. Caller with valid sessionToken can see their ticket
    const authTickets = await t.query(api.support.getCustomerTickets, { sessionToken });
    expect(authTickets).toHaveLength(1);
    expect(authTickets[0].subject).toBe("Secret merchant inquiry");

    // 3. Forged sessionToken cannot read thread
    const forgedThread = await t.query(api.support.getCustomerTicketThread, {
      ticketId,
      sessionToken: "forged_invalid_token",
    });
    expect(forgedThread).toBeNull();

    // 4. Valid sessionToken gets thread and internal notes are STRIPPED
    const validThread = await t.query(api.support.getCustomerTicketThread, {
      ticketId,
      sessionToken,
    });
    expect(validThread).not.toBeNull();
    expect(validThread?.messages).toHaveLength(1);
    expect(validThread?.messages[0].body).toBe("Hello support");
    expect(validThread?.messages.some((m) => m.visibility === "internal")).toBe(false);

    // 5. Unauthenticated reply is rejected
    await expect(
      t.mutation(api.support.addCustomerReply, {
        ticketId,
        body: "Attempted unauthenticated reply",
      })
    ).rejects.toThrow("Authentifizierung erforderlich");
  });

  it("P0-02: requires verified team session token and enforces region boundary", async () => {
    const t = convexTest(schema, modules);
    const { ticketId, validTeamToken, wrongRegionToken } = await t.run(async (ctx) => {
      const admin = await ctx.db.insert("adminUsers", {
        email: "de_staff@zackisch.com",
        name: "DE Staff",
        role: "staff",
        regionId: "de",
        permissions: ["tickets:read", "tickets:write", "tickets:note"],
        isActive: true,
        createdAt: Date.now(),
      });

      const atAdmin = await ctx.db.insert("adminUsers", {
        email: "at_staff@zackisch.com",
        name: "AT Staff",
        role: "staff",
        regionId: "at",
        permissions: ["tickets:read", "tickets:write"],
        isActive: true,
        createdAt: Date.now(),
      });

      const validTeamToken = "ops_session_de_valid";
      await ctx.db.insert("verificationCodes", {
        identifier: validTeamToken,
        code: admin,
        expires: Date.now() + 86400000,
      });

      const wrongRegionToken = "ops_session_at_valid";
      await ctx.db.insert("verificationCodes", {
        identifier: wrongRegionToken,
        code: atAdmin,
        expires: Date.now() + 86400000,
      });

      const ticketId = await ctx.db.insert("supportTickets", {
        ticketNumber: "ZCK-2001",
        requesterEmail: "merchant@example.de",
        requesterName: "German Merchant",
        regionId: "de",
        category: "onboarding",
        priority: "normal",
        status: "open",
        subject: "Regional test",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastMessageAt: Date.now(),
      });

      return { ticketId, validTeamToken, wrongRegionToken };
    });

    // 1. Missing session token throws error
    await expect(
      t.query(api.support.getTeamTickets, {
        regionId: "de",
        adminEmail: "de_staff@zackisch.com",
      })
    ).rejects.toThrow("Authentifizierung erforderlich: Kein Team-Sitzungstoken angegeben.");

    // 2. Forged session token throws error
    await expect(
      t.query(api.support.getTeamTickets, {
        sessionToken: "completely_fake_token",
        regionId: "de",
      })
    ).rejects.toThrow("Sitzung ist abgelaufen oder ungültig.");

    // 3. Staff from Austria (AT) cannot access German (DE) tickets
    await expect(
      t.query(api.support.getTeamTickets, {
        sessionToken: wrongRegionToken,
        regionId: "de",
      })
    ).rejects.toThrow("Kein Zugriff auf Tickets außerhalb der zugewiesenen Region.");

    // 4. Authorized DE staff can read tickets
    const tickets = await t.query(api.support.getTeamTickets, {
      sessionToken: validTeamToken,
      regionId: "de",
    });
    expect(tickets).toHaveLength(1);
    expect(tickets[0].ticketNumber).toBe("ZCK-2001");
  });

  it("P0-03: setup readiness, fee statements and statement generation enforce owner checks", async () => {
    const t = convexTest(schema, modules);
    const { businessId } = await t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", { name: "Real Owner", email: "owner@cafe.de" });
      const businessId = await ctx.db.insert("businesses", {
        name: "My Bistro",
        ownerId: owner,
        vatId: "DE123456789",
        region: "de",
      });
      return { businessId };
    });

    // 1. Unauthenticated getSetupReadiness returns null
    const readiness = await t.query(api.setup.getSetupReadiness, { businessId });
    expect(readiness).toBeNull();

    // 2. Unauthenticated getFeeStatements returns empty array
    const statements = await t.query(api.setup.getFeeStatements, { businessId });
    expect(statements).toEqual([]);

    // 3. Unauthenticated generateMonthlyFeeStatement throws error
    await expect(
      t.mutation(api.setup.generateMonthlyFeeStatement, {
        businessId,
        period: "2026-10",
      })
    ).rejects.toThrow("Nicht berechtigt: Nur der Betriebsinhaber kann Gebührenabrechnungen erstellen.");
  });

  it("P0-06: recordOrderInPos and getPosReconciliationSummary reject unauthorized callers", async () => {
    const t = convexTest(schema, modules);
    const { businessId, orderId } = await t.run(async (ctx) => {
      const owner = await ctx.db.insert("users", { name: "Owner" });
      const businessId = await ctx.db.insert("businesses", {
        name: "Pizzeria",
        ownerId: owner,
        region: "de",
      });

      const orderId = await ctx.db.insert("orders", {
        businessId,
        type: "dine-in",
        items: JSON.stringify([{ name: "Pizza", price: 1000, quantity: 1 }]),
        total: 1000,
        status: "in_progress",
        paymentStatus: "paid",
        posRecordingStatus: "pending",
        createdAt: Date.now(),
        email: "guest@example.com",
        orderNumber: "ORD-001",
        zakkigFee: 20,
        stripeFee: 30,
        netAmount: 950,
        currency: "EUR",
      });

      return { businessId, orderId };
    });

    // 1. Unauthenticated POS record attempt is rejected
    await expect(
      t.mutation(api.orders.recordOrderInPos, {
        orderId,
      })
    ).rejects.toThrow("Nicht berechtigt, diese Kassen-Erfassung durchzuführen.");

    // 2. Unauthenticated POS reconciliation summary returns null
    const summary = await t.query(api.orders.getPosReconciliationSummary, {
      businessId,
    });
    expect(summary).toBeNull();
  });
});

