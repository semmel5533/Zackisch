/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function fixtures() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async ctx => {
    const owner = await ctx.db.insert("users", { email: "owner@example.test" });
    const stranger = await ctx.db.insert("users", { email: "stranger@example.test" });
    const businessId = await ctx.db.insert("businesses", { name: "Fixture restaurant", ownerId: owner, region: "de", currency: "EUR" });
    for (const [token, code] of [["owner", owner], ["stranger", stranger]] as const) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code, expires: Date.now() + 60_000 });
    }
    return { owner, businessId };
  });
  return { t, ...ids };
}

describe("business profile and payment write boundaries", () => {
  it.each([undefined, "invalid", "stranger"])("rejects unauthorized profile writes (%s)", async sessionToken => {
    const { t, businessId } = await fixtures();
    await expect(t.mutation(api.businesses.update, { id: businessId, sessionToken, name: "Changed" }))
      .rejects.toThrow("Unauthorized");
    expect((await t.run(ctx => ctx.db.get(businessId)))?.name).toBe("Fixture restaurant");
  });

  it("persists separate tax identifiers and ordinary owner profile changes", async () => {
    const { t, businessId, owner } = await fixtures();
    await t.mutation(api.businesses.update, {
      id: businessId, sessionToken: "owner", legalName: " Fixture GmbH ",
      taxId: "12/345/67890", vatId: "DE123456789", tables: ["1", "2"], isToGoEnabled: true,
    });
    expect(await t.run(ctx => ctx.db.get(businessId))).toMatchObject({
      legalName: "Fixture GmbH", taxId: "12/345/67890", vatId: "DE123456789", tables: ["1", "2"], isToGoEnabled: true,
    });
    await t.withIdentity({ subject: `${owner}|fixture-session` }).mutation(api.businesses.update, { id: businessId, name: "Renamed" });
    expect((await t.run(ctx => ctx.db.get(businessId)))?.name).toBe("Renamed");
  });

  it.each([
    ["stripeAccountId", "acct_foreign"], ["stripeOnboardingComplete", true],
    ["stripeChargesEnabled", true], ["stripePayoutsEnabled", true],
    ["region", "at"], ["currency", "USD"], ["deletionRequested", true],
    ["testOrderCompletedAt", 1], ["posWorkflowConfirmedAt", 1],
  ])("rejects server-managed field %s even for an owner", async (field, value) => {
    const { t, businessId } = await fixtures();
    await expect(t.mutation(api.businesses.update, {
      id: businessId, sessionToken: "owner", [field as string]: value,
    } as never)).rejects.toThrow(/Unexpected field/);
    expect(await t.run(ctx => ctx.db.get(businessId))).toMatchObject({ region: "de", currency: "EUR" });
  });

  it("binds an account internally without manufacturing readiness and prevents replacement", async () => {
    const { t, businessId } = await fixtures();
    const args = { id: businessId, stripeAccountId: "acct_fixture", stripeDashboardType: "full", stripeFeeCollector: "stripe", stripeLossCollector: "stripe" };
    await t.mutation(internal.businesses.bindStripeAccountInternal, args);
    const business = await t.run(ctx => ctx.db.get(businessId));
    expect(business).toMatchObject({ stripeAccountId: "acct_fixture" });
    expect(business).not.toHaveProperty("stripeChargesEnabled");
    expect(business).not.toHaveProperty("stripeOnboardingComplete");
    await expect(t.mutation(internal.businesses.bindStripeAccountInternal, { ...args, stripeAccountId: "acct_replacement" }))
      .rejects.toThrow("Stripe account already bound");
    expect((await t.run(ctx => ctx.db.get(businessId)))?.stripeAccountId).toBe("acct_fixture");
  });
});
