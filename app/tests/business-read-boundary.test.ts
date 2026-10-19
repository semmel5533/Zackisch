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
    const businessId = await ctx.db.insert("businesses", {
      name: "Fixture restaurant", ownerId: owner, legalName: "Fixture GmbH", taxId: "12/345/67890",
      vatId: "DE123456789", stripeAccountId: "acct_fixture", stripeOnboardingComplete: true,
      stripeChargesEnabled: true, stripePayoutsEnabled: true, stripeCurrentlyDue: ["private_requirement"],
      pauseReason: "private administrative reason", isToGoEnabled: true,
    });
    for (const [token, code] of [["owner", owner], ["stranger", stranger]] as const) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code, expires: Date.now() + 60_000 });
    }
    await ctx.db.insert("staffSessions", { businessId, token: "terminal_fixture" });
    return { owner, stranger, businessId };
  });
  return { t, ...data };
}

describe("private business reads and public restaurant projection", () => {
  it("returns no restaurant for a malformed public URL identifier", async () => {
    const { t } = await fixtures();
    expect(await t.query(api.businesses.getPublicRestaurant, { id: "not-a-business-id" })).toBeNull();
  });
  it.each([undefined, "stranger", "terminal_fixture"])("denies private reads for %s", async sessionToken => {
    const { t, businessId, owner } = await fixtures();
    await expect(t.query(api.businesses.get, { id: businessId, sessionToken })).rejects.toThrow("Unauthorized");
    await expect(t.query(api.businesses.getByOwner, { ownerId: owner, sessionToken })).rejects.toThrow("Unauthorized");
  });

  it("preserves both owner identity transports and internal payment reads", async () => {
    const { t, businessId, owner } = await fixtures();
    expect(await t.query(api.businesses.get, { id: businessId, sessionToken: "owner" })).toMatchObject({ ownerId: owner, stripeAccountId: "acct_fixture" });
    expect(await t.withIdentity({ subject: `${owner}|fixture-session` }).query(api.businesses.getByOwner, { ownerId: owner })).toMatchObject({ _id: businessId });
    expect(await t.query(internal.businesses.getInternal, { id: businessId })).toMatchObject({ stripeAccountId: "acct_fixture" });
  });

  it("exposes only public fields and derives availability without provider details", async () => {
    const { t, businessId } = await fixtures();
    const restaurant = await t.query(api.businesses.getPublicRestaurant, { id: businessId });
    expect(restaurant).toMatchObject({ name: "Fixture restaurant", vatId: "DE123456789", canOrder: true, isPaused: false });
    for (const field of ["ownerId", "taxId", "stripeAccountId", "stripeOnboardingComplete", "stripeChargesEnabled", "stripeCurrentlyDue", "pauseReason", "_creationTime"])
      expect(restaurant).not.toHaveProperty(field);
    expect(await t.query(api.sessions.verifyTerminalSession, { businessId, token: "terminal_fixture", type: "staff" })).toBe(true);
    await t.run(ctx => ctx.db.patch(businessId, { isPaused: true }));
    expect(await t.query(api.businesses.getPublicRestaurant, { id: businessId })).toMatchObject({ canOrder: false, isPaused: true });
  });

  it("refuses creation on behalf of another user", async () => {
    const { t, owner } = await fixtures();
    await expect(t.mutation(api.businesses.create, { name: "Impersonation", ownerId: owner, sessionToken: "stranger" }))
      .rejects.toThrow("Unauthorized");
    const id = await t.mutation(api.businesses.create, { name: "Owner's second restaurant", ownerId: owner, sessionToken: "owner" });
    expect(await t.query(api.businesses.get, { id, sessionToken: "owner" })).toMatchObject({ ownerId: owner });
  });
});
