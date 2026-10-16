import { afterEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import { platformFee } from "../lib/platform-fee";

const stripe = vi.hoisted(() => ({
  session: vi.fn().mockResolvedValue({ id: "cs_demo", client_secret: "demo" }),
  intent: vi.fn().mockResolvedValue({ id: "pi_demo", client_secret: "demo" }),
}));
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create: stripe.session } };
    paymentIntents = { create: stripe.intent };
  },
}));
const modules = import.meta.glob("../convex/**/*.ts");
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

async function setup(total: number) {
  const t = convexTest(schema, modules);
  const data = await t.run(async (ctx) => {
    const org = await ctx.db.insert("organizations", {
      name: "Demo",
      ownerId: "owner",
      stripeAccountId: "acct_capture",
      stripeOnboardingComplete: true,
      stripeChargesEnabled: true,
    });
    const category = await ctx.db.insert("menuCategories", {
      organizationId: org,
      name: "Food",
      sortOrder: 0,
    });
    const item = await ctx.db.insert("menuItems", {
      organizationId: org,
      categoryId: category,
      name: "Lunch",
      price: total,
      available: true,
      sortOrder: 0,
      taxRate: 19,
      customizations: "[]",
    });
    return { org, item };
  });
  return {
    t,
    args: {
      organizationId: data.org,
      type: "takeaway" as const,
      items: JSON.stringify([
        { menuItemId: data.item, quantity: 1, price: total },
      ]),
      total,
      email: "demo@example.com",
    },
  };
}

describe("two percent platform fee", () => {
  it.each([
    [1, 0],
    [24, 0],
    [25, 1],
    [1250, 25],
    [1299, 26],
    [1000000, 20000],
  ])("rounds %i cents to %i fee cents", (total, fee) => {
    expect(platformFee(total)).toBe(fee);
  });
  it("retains two percent through both Stripe Direct Charge payment entry points", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_local_fixture");
    const { t, args } = await setup(1299);
    expect(await t.action(api.stripe.createCheckoutSession, args)).toEqual({
      clientSecret: "demo",
      sessionId: "cs_demo",
      stripeAccountId: "acct_capture",
      applicationFeeCents: 26,
    });
    expect(
      stripe.session.mock.calls[0][0].payment_intent_data.application_fee_amount,
    ).toBe(26);
    expect(stripe.session.mock.calls[0][1]).toEqual({
      stripeAccount: "acct_capture",
    });
    expect(await t.action(api.stripe.createPaymentIntent, args)).toEqual({
      clientSecret: "demo",
      paymentIntentId: "pi_demo",
      stripeAccountId: "acct_capture",
      applicationFeeCents: 26,
      totalChargeCents: 1299,
    });
    expect(stripe.intent.mock.calls[0][0].application_fee_amount).toBe(26);
    expect(stripe.intent.mock.calls[0][1]).toEqual({
      stripeAccount: "acct_capture",
    });
  });
  it("stores rounded fees and keeps duplicate webhook deliveries idempotent", async () => {
    const { t, args } = await setup(1299);
    const input = {
      ...args,
      currency: "EUR",
      stripePaymentId: "pi_paid_fixture",
    };
    const id = await t.mutation(
      internal.orders.createPaidOrderFromWebhook,
      input,
    );
    const order = await t.run((ctx) => ctx.db.get(id));
    expect(order).toMatchObject({
      total: 1299,
      zakkigFee: 26,
      netAmount: 1273,
    });
    await t.run((ctx) => ctx.db.patch(id, { zakkigFee: 13, netAmount: 1286 }));
    expect(
      await t.mutation(internal.orders.createPaidOrderFromWebhook, input),
    ).toBe(id);
    expect(await t.run((ctx) => ctx.db.get(id))).toMatchObject({
      zakkigFee: 13,
      netAmount: 1286,
    });
  });
});
