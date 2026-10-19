/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
const modules = import.meta.glob("../convex/**/*.ts");
async function fixtures() {
  const t = convexTest(schema, modules);
  const data = await t.run(async ctx => {
    const owner = await ctx.db.insert("users", { email: "owner@example.test" });
    const stranger = await ctx.db.insert("users", { email: "stranger@example.test" });
    const businessId = await ctx.db.insert("businesses", { name: "Restaurant", ownerId: owner });
    const categoryId = await ctx.db.insert("menuCategories", { businessId, name: "Lunch", sortOrder: 0 });
    for (const [token, code] of [["owner", owner], ["stranger", stranger]]) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code, expires: Date.now() + 60_000 });
    }
    await ctx.db.insert("staffSessions", { businessId, token: "staff" });
    return { businessId, categoryId };
  });
  return { t, ...data, item: { ...data, name: "Soup", price: 500, available: true, sortOrder: 0, taxRate: 7, customizations: "[]" } };
}

describe("merchant-entered dietary labels", () => {
  it("persists, deduplicates, exposes and clears optional labels", async () => {
    const { t, item, businessId } = await fixtures();
    const id = await t.mutation(api.menu.createItem, { ...item, sessionToken: "owner", dietaryLabels: ["vegan", "halal", "vegan"] });
    expect(await t.query(api.menu.getItem, { id })).toMatchObject({ dietaryLabels: ["vegan", "halal"] });
    expect(await t.query(api.menu.getAvailableItems, { businessId })).toEqual(expect.arrayContaining([expect.objectContaining({ _id: id, dietaryLabels: ["vegan", "halal"] })]));
    await t.mutation(api.menu.updateItem, { id, sessionToken: "owner", dietaryLabels: [] });
    expect(await t.query(api.menu.getItem, { id })).toMatchObject({ dietaryLabels: [] });
  });
  it("does not grant label editing to guests, foreign owners or terminals", async () => {
    const { t, item } = await fixtures();
    const id = await t.mutation(api.menu.createItem, { ...item, sessionToken: "owner" });
    for (const credentials of [{}, { sessionToken: "stranger" }, { terminalToken: "staff" }]) {
      await expect(t.mutation(api.menu.updateItem, { id, ...credentials, dietaryLabels: ["halal"] })).rejects.toThrow("Unauthorized");
    }
    await t.mutation(api.menu.updateItem, { id, terminalToken: "staff", available: false });
    expect(await t.query(api.menu.getItem, { id })).toMatchObject({ available: false, dietaryLabels: [] });
  });
  it("rejects unknown and excessive labels without changing the item", async () => {
    const { t, item } = await fixtures();
    const id = await t.mutation(api.menu.createItem, { ...item, sessionToken: "owner", dietaryLabels: ["vegetarian"] });
    await expect(t.mutation(api.menu.updateItem, { id, sessionToken: "owner", dietaryLabels: ["certified"] as never })).rejects.toThrow();
    await expect(t.mutation(api.menu.updateItem, { id, sessionToken: "owner", dietaryLabels: ["vegan", "vegan", "vegan", "vegan"] })).rejects.toThrow("INVALID_DIETARY_LABELS");
    expect(await t.query(api.menu.getItem, { id })).toMatchObject({ dietaryLabels: ["vegetarian"] });
  });
});
