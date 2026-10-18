/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");

async function fixtures() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async ctx => {
    const owner = await ctx.db.insert("users", { email: "owner@example.test" });
    const stranger = await ctx.db.insert("users", { email: "stranger@example.test" });
    const businessId = await ctx.db.insert("businesses", { name: "Fixture restaurant", ownerId: owner });
    for (const [token, userId, expires] of [
      ["owner", owner, Date.now() + 60_000],
      ["stranger", stranger, Date.now() + 60_000],
      ["expired", owner, 0],
    ] as const) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code: userId, expires });
    }
    return { owner, businessId };
  });
  return { t, ...ids };
}

describe("merchant media upload authorization", () => {
  it.each([undefined, "invalid", "stranger", "expired"])(
    "refuses upload URLs without current ownership (%s)", async sessionToken => {
      const { t, businessId } = await fixtures();
      await expect(t.mutation(api.storage.generateUploadUrl, { businessId, sessionToken }))
        .rejects.toThrow("Unauthorized");
    },
  );

  it("allows the owner's current cookie session", async () => {
    const { t, businessId } = await fixtures();
    const url = await t.mutation(api.storage.generateUploadUrl, { businessId, sessionToken: "owner" });
    expect(new URL(url).protocol).toBe("https:");
  });

  it("allows the owner's Convex Auth identity", async () => {
    const { t, businessId, owner } = await fixtures();
    const authenticated = t.withIdentity({ subject: `${owner}|fixture-session` });
    const url = await authenticated.mutation(api.storage.generateUploadUrl, { businessId });
    expect(new URL(url).protocol).toBe("https:");
  });
});
