/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { httpRouter } from "convex/server";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { uploadMerchantMedia } from "../convex/storage";
import type { Id } from "../convex/_generated/dataModel";

const http = httpRouter();
http.route({ path: "/merchant-media", method: "POST", handler: uploadMerchantMedia });
const modules = { ...import.meta.glob("../convex/**/*.ts"), "../convex/http.ts": async () => ({ default: http }) };
const png = Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1cAAAAASUVORK5CYII="), c => c.charCodeAt(0));
async function fixtures() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async ctx => {
    const owner = await ctx.db.insert("users", { email: "owner@example.test" });
    const foreignOwner = await ctx.db.insert("users", { email: "foreign@example.test" });
    const businessId = await ctx.db.insert("businesses", { name: "Owner restaurant", ownerId: owner });
    const foreignId = await ctx.db.insert("businesses", { name: "Foreign restaurant", ownerId: foreignOwner });
    for (const [token, code] of [["owner", owner], ["foreign", foreignOwner]]) {
      await ctx.db.insert("verificationCodes", { identifier: `session_${token}`, code, expires: Date.now() + 60_000 });
    }
    const categoryId = await ctx.db.insert("menuCategories", { businessId, name: "Menu", sortOrder: 0 });
    return { businessId, foreignId, owner, categoryId };
  });
  const upload = (sessionToken = "owner", body: BodyInit = png, headers: Record<string, string> = {}) => t.fetch("/merchant-media", {
    method: "POST", headers: { "Content-Type": "image/png", "X-Business-Id": ids.businessId, "X-Merchant-Session": sessionToken, ...headers }, body,
  });
  return { t, ...ids, upload };
}

describe("merchant media upload and ownership", () => {
  it("rejects anonymous/foreign uploads and mismatched image bytes", async () => {
    const { t, upload } = await fixtures();
    expect((await upload("")).status).toBe(403);
    expect((await upload("foreign")).status).toBe(403);
    expect((await upload("owner", "<script>bad</script>")).status).toBe(415);
    expect((await upload("owner", png, { "Content-Length": String(11 * 1024 * 1024) })).status).toBe(413);
    expect(await t.run(ctx => ctx.db.query("merchantMedia").collect())).toHaveLength(0);
  });
  it("registers actual uploaded bytes and prevents reuse by another restaurant", async () => {
    const { t, upload, businessId, foreignId, categoryId } = await fixtures();
    const response = await upload();
    expect(response.status).toBe(200);
    const { storageId } = await response.json() as { storageId: Id<"_storage"> };
    expect(await t.run(async ctx => [...new Uint8Array(await (await ctx.storage.get(storageId))!.arrayBuffer())])).toEqual([...png]);
    await expect(t.mutation(api.businesses.update, { id: foreignId, sessionToken: "foreign", logoStorageId: storageId })).rejects.toThrow("INVALID_MEDIA_OWNER");
    await t.mutation(api.businesses.update, { id: businessId, sessionToken: "owner", logoStorageId: storageId, bannerStorageId: storageId });
    const item = await t.mutation(api.menu.createItem, { businessId, categoryId, sessionToken: "owner", name: "Soup", price: 500, available: true, sortOrder: 0, taxRate: 7, customizations: "[]", imageStorageId: storageId });
    await t.mutation(api.businesses.update, { id: businessId, sessionToken: "owner", clearLogo: true, clearBanner: true });
    expect(await t.run(async ctx => Boolean(await ctx.storage.get(storageId)))).toBe(true);
    await t.mutation(api.menu.deleteItem, { id: item, sessionToken: "owner" });
    expect(await t.run(async ctx => Boolean(await ctx.storage.get(storageId)))).toBe(false);
  });
  it("accepts JWT identity and limits each business to 20 upload attempts per minute", async () => {
    const { t, businessId, owner, upload } = await fixtures();
    const response = await t.withIdentity({ subject: `${owner}|fixture` }).fetch("/merchant-media", {
      method: "POST", headers: { "Content-Type": "image/png", "X-Business-Id": businessId }, body: png,
    });
    expect(response.status).toBe(200);
    for (let i = 1; i < 20; i++) expect((await upload("owner", "bad")).status).toBe(415);
    expect((await upload()).status).toBe(429);
  });
});
