/// <reference types="vite/client" />
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }));
vi.mock("stripe", () => ({ default: class {
  v2 = { core: { accounts: { retrieve } } };
} }));
const modules = import.meta.glob("../convex/**/*.ts");

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_local_fixture_only");
  retrieve.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("provider-derived Stripe readiness", () => {
  it.each([
    ["inactive", "inactive", "stripe", false],
    ["active", "inactive", "stripe", false],
    ["inactive", "active", "stripe", false],
    ["active", "active", "application", false],
    ["active", "active", "stripe", true],
  ] as const)("preserves independent capabilities %s / %s with fee collector %s", async (card, payout, collector, ready) => {
    retrieve.mockResolvedValue({
      configuration: { merchant: { capabilities: { card_payments: { status: card }, stripe_balance: { payouts: { status: payout } } } } },
      defaults: { responsibilities: { fees_collector: collector, losses_collector: "stripe" } },
      requirements: { entries: [] }, dashboard: "full",
    });
    const t = convexTest(schema, modules);
    const businessId = await t.run(async ctx => {
      const owner = await ctx.db.insert("users", { email: "owner@example.test" });
      await ctx.db.insert("verificationCodes", { identifier: "session_owner", code: owner, expires: Date.now() + 60_000 });
      return ctx.db.insert("businesses", {
        name: "Fixture restaurant", ownerId: owner, stripeAccountId: "acct_fixture",
        stripeOnboardingComplete: true, stripeChargesEnabled: true, stripePayoutsEnabled: true,
      });
    });
    const result = await t.action(api.stripe.getStripeAccountStatus, { businessId, sessionToken: "owner" });
    expect(result.error).toBeUndefined();
    expect(result.isOnboardingComplete).toBe(ready);
    expect(result.chargesEnabled).toBe(card === "active");
    expect(result.payoutsEnabled).toBe(payout === "active");
    const business = await t.run(ctx => ctx.db.get(businessId));
    expect(business).toMatchObject({
      stripeOnboardingComplete: ready,
      stripeChargesEnabled: card === "active",
      stripePayoutsEnabled: payout === "active",
    });
    const readiness = await t.withIdentity({ subject: `${business!.ownerId}|fixture-session` })
      .query(api.setup.getSetupReadiness, { businessId });
    expect(readiness?.steps.find(step => step.id === "stripe_connect")?.completed).toBe(ready);
    expect(retrieve).toHaveBeenCalledWith("acct_fixture", expect.any(Object));
  });
});
