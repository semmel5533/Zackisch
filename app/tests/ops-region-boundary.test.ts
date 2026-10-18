/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { seedInitialAdminAndRegions, migrateUserEmailToZackisch } from "../convex/admin";

const modules = import.meta.glob("../convex/**/*.ts");

async function fixtures(role: "staff" | "regional_admin" = "staff") {
  const t = convexTest(schema, modules);
  const data = await t.run(async (ctx) => {
    const actor = await ctx.db.insert("adminUsers", {
      name: "German operator", email: "operator@example.test", role,
      regionId: "de", permissions: ["staff:read", "staff:manage", "orders:read"],
      isActive: true, createdAt: Date.now(),
    });
    const foreign = await ctx.db.insert("adminUsers", {
      name: "Austrian operator", email: "foreign@example.test", role: "staff",
      regionId: "at", permissions: [], isActive: true, createdAt: Date.now(),
    });
    const local = await ctx.db.insert("adminUsers", {
      name: "German colleague", email: "local@example.test", role: "staff",
      regionId: "de", permissions: [], isActive: true, createdAt: Date.now(),
    });
    const token = "ops_session_region_fixture";
    await ctx.db.insert("verificationCodes", {
      identifier: token, code: actor, expires: Date.now() + 60_000,
    });
    return { actor, foreign, local, token };
  });
  return { t, ...data };
}

describe("operations resource region boundaries", () => {
  for (const role of ["staff", "regional_admin"] as const) {
    it(`${role}: refuses cross-region reads despite matching permission`, async () => {
      const { t, token } = await fixtures(role);
      await expect(t.query(api.admin.listStaff, { regionId: "at", sessionToken: token }))
        .rejects.toThrow(/FORBIDDEN/);
      await expect(t.query(api.admin.listRegionalOrders, { regionId: "at", sessionToken: token }))
        .rejects.toThrow(/FORBIDDEN/);
      const members = await t.query(api.admin.listStaff, { regionId: "de", sessionToken: token });
      expect(members.map(member => member.email).sort()).toEqual([
        "local@example.test", "operator@example.test",
      ]);
    });

    it(`${role}: refuses a foreign staff ID hidden behind an allowed region argument`, async () => {
      const { t, token, foreign } = await fixtures(role);
      await expect(t.mutation(api.admin.updateStaffStatus, {
        regionId: "de", sessionToken: token, staffId: foreign, isActive: false,
      })).rejects.toThrow(/FORBIDDEN/);
      expect((await t.run(ctx => ctx.db.get(foreign)))?.isActive).toBe(true);
      expect(await t.run(ctx => ctx.db.query("auditLogs").collect())).toEqual([]);
    });
  }

  it("enforces region on an email lookup without a region argument", async () => {
    const { t, token } = await fixtures();
    await expect(t.query(api.admin.getAdminByEmail, {
      email: "foreign@example.test", sessionToken: token,
    })).rejects.toThrow(/FORBIDDEN/);
    expect(await t.query(api.admin.getAdminByEmail, {
      email: "local@example.test", sessionToken: token,
    })).toMatchObject({ regionId: "de", email: "local@example.test" });
  });

  it("preserves authorized local status changes and their audit record", async () => {
    const { t, token, local } = await fixtures();
    await t.mutation(api.admin.updateStaffStatus, {
      regionId: "de", sessionToken: token, staffId: local, isActive: false,
    });
    expect((await t.run(ctx => ctx.db.get(local)))?.isActive).toBe(false);
    expect(await t.run(ctx => ctx.db.query("auditLogs").collect())).toEqual([
      expect.objectContaining({ actorId: "operator@example.test", entityId: local, regionId: "de", action: "staff.deactivate" }),
    ]);
  });

  it("rejects an empty requested region", async () => {
    const { t, token } = await fixtures();
    await expect(t.query(api.admin.listStaff, { regionId: "", sessionToken: token }))
      .rejects.toThrow(/FORBIDDEN/);
  });

  it.each([0, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects expired or non-finite session expiry %s",
    async (expires) => {
      const { t, token } = await fixtures();
      await t.run(async (ctx) => {
        const session = await ctx.db.query("verificationCodes")
          .withIndex("by_identifier", q => q.eq("identifier", token)).unique();
        await ctx.db.patch(session!._id, { expires });
      });
      await expect(t.query(api.admin.listStaff, { regionId: "de", sessionToken: token }))
        .rejects.toThrow(/UNAUTHORIZED/);
    },
  );

  it("keeps privileged bootstrap and account migration outside the public API", () => {
    expect(seedInitialAdminAndRegions.isInternal).toBe(true);
    expect(migrateUserEmailToZackisch.isInternal).toBe(true);
  });
});
