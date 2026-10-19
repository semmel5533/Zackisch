/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function fixtures() {
  const t = convexTest(schema, modules);
  const data = await t.run(async ctx => {
    const owner = await ctx.db.insert("users", { email: "owner@example.test" });
    const stranger = await ctx.db.insert("users", { email: "stranger@example.test" });
    const businessId = await ctx.db.insert("businesses", { name: "Fixture restaurant", ownerId: owner });
    for (const [token, code, expires] of [
      ["owner", owner, Date.now() + 60_000],
      ["stranger", stranger, Date.now() + 60_000],
      ["expired", owner, 0],
    ] as const) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code, expires });
    }
    return { businessId, owner };
  });
  return { t, ...data };
}

describe("Stripe account management ownership", () => {
  it.each([undefined, "invalid", "stranger", "expired"])(
    "rejects unauthorized account operations before provider access (%s)", async sessionToken => {
      const { t, businessId } = await fixtures();
      const args = { businessId, sessionToken };
      const results = await Promise.all([
        t.action(api.stripe.createEmbeddedAccountSession, args),
        t.action(api.stripe.connectStripe, { ...args, origin: "https://app.example.test" }),
        t.action(api.stripe.getStripeAccountStatus, args),
        t.action(api.stripe.createStripeDashboardLink, { ...args, origin: "https://app.example.test" }),
        t.action(api.stripe.completeTestStripeOnboarding, args),
      ]);
      for (const result of results) expect(result.error).toContain("Unauthorized");
      expect(await t.run(ctx => ctx.db.get(businessId))).not.toHaveProperty("stripeAccountId");
    },
  );

  it("retains owner access through cookie credentials and Convex Auth", async () => {
    const { t, businessId, owner } = await fixtures();
    expect(await t.query(internal.businesses.getForOwnerInternal, {
      id: businessId, sessionToken: "owner",
    })).toMatchObject({ _id: businessId, ownerId: owner });
    expect(await t.withIdentity({ subject: `${owner}|fixture-session` })
      .query(internal.businesses.getForOwnerInternal, { id: businessId }))
      .toMatchObject({ _id: businessId, ownerId: owner });
    expect(await t.action(api.stripe.getStripeAccountStatus, { businessId, sessionToken: "owner" }))
      .toEqual({ isConnected: false, isOnboardingComplete: false });
  });
});
