/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";

const modules = import.meta.glob("../convex/**/*.ts");
const documentSlugs = ["gtc", "data-processing", "fee-model"];
async function fixture() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async (ctx) => {
    const owner = await ctx.db.insert("users", {});
    const stranger = await ctx.db.insert("users", {});
    const businessId = await ctx.db.insert("businesses", {
      ownerId: owner,
      name: "Test",
    });
    return { owner, stranger, businessId };
  });
  return {
    t,
    ...ids,
    actor: t.withIdentity({ subject: `${ids.owner}|session` }),
  };
}

describe("merchant legal acceptance", () => {
  it("refuses anonymous and foreign actors without writes", async () => {
    const { t, stranger, businessId } = await fixture();
    for (const actor of [
      t,
      t.withIdentity({ subject: `${stranger}|session` }),
    ]) {
      await expect(
        actor.mutation(api.setup.recordLegalAcceptance, {
          businessId,
          documentSlugs,
        }),
      ).rejects.toThrow();
    }
    expect(
      await t.run((ctx) => ctx.db.query("acceptanceEvents").collect()),
    ).toEqual([]);
  });
  it.each(["old", "future", ""])(
    "rejects forged version %s",
    async (documentVersion) => {
      const { t, actor, businessId } = await fixture();
      await expect(
        actor.mutation(api.setup.recordLegalAcceptance, {
          businessId,
          documentSlugs,
          documentVersion,
        }),
      ).rejects.toThrow("Dokumentversion");
      expect(
        await t.run((ctx) => ctx.db.query("acceptanceEvents").collect()),
      ).toEqual([]);
    },
  );
  it.each([
    { slugs: [] },
    { slugs: ["privacy-policy"] },
    { slugs: ["gtc", "invented"] },
  ])("rejects unsupported selection $slugs", async ({ slugs }) => {
    const { actor, businessId } = await fixture();
    await expect(
      actor.mutation(api.setup.recordLegalAcceptance, {
        businessId,
        documentSlugs: slugs,
      }),
    ).rejects.toThrow("Dokumentauswahl");
  });
  it.each(["previous-version", "previous-owner"])(
    "requires current owner/version and preserves %s history on retries",
    async (scenario) => {
      const { t, actor, businessId, owner, stranger } = await fixture();
      await t.run(async (ctx) => {
        for (const documentSlug of documentSlugs)
          await ctx.db.insert("acceptanceEvents", {
            businessId,
            userId: scenario === "previous-owner" ? stranger : owner,
            documentSlug,
            documentVersion:
              scenario === "previous-version" ? "old" : "2026-10-v1",
            acceptedAt: 1,
            context: "setup_wizard",
          });
      });
      const before = await actor.query(api.setup.getSetupReadiness, {
        businessId,
      });
      expect(before?.steps.find((s) => s.id === "contracts")?.completed).toBe(
        false,
      );
      expect(
        await actor.mutation(api.setup.recordLegalAcceptance, {
          businessId,
          documentSlugs,
        }),
      ).toEqual({ recordedCount: 3, version: "2026-10-v1" });
      expect(
        await actor.mutation(api.setup.recordLegalAcceptance, {
          businessId,
          documentSlugs,
        }),
      ).toEqual({ recordedCount: 0, version: "2026-10-v1" });
      expect(
        await t.run((ctx) => ctx.db.query("acceptanceEvents").collect()),
      ).toHaveLength(6);
      const after = await actor.query(api.setup.getSetupReadiness, {
        businessId,
      });
      expect(after?.steps.find((s) => s.id === "contracts")?.completed).toBe(
        true,
      );
    },
  );
});
