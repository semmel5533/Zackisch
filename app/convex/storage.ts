import { query, internalMutation, httpAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireOwner } from "./permissions";

export const deleteFile = internalMutation({
  args: { storageId: v.id("_storage") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId);
    return null;
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

export const authorizeMediaUploadInternal = internalMutation({
  args: { businessId: v.id("businesses"), sessionToken: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.businessId, args.sessionToken);
    const now = Date.now();
    const limit = await ctx.db.query("mediaUploadLimits")
      .withIndex("by_businessId", q => q.eq("businessId", args.businessId)).unique();
    if (limit && now - limit.windowStart < 60_000) {
      if (limit.count >= 20) throw new Error("UPLOAD_RATE_LIMIT");
      await ctx.db.patch(limit._id, { count: limit.count + 1 });
    } else if (limit) {
      await ctx.db.patch(limit._id, { windowStart: now, count: 1 });
    } else {
      await ctx.db.insert("mediaUploadLimits", { businessId: args.businessId, windowStart: now, count: 1 });
    }
    return null;
  },
});

export const registerMediaInternal = internalMutation({
  args: { businessId: v.id("businesses"), storageId: v.id("_storage"), sessionToken: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.businessId, args.sessionToken);
    const existing = await ctx.db.query("merchantMedia")
      .withIndex("by_storageId", q => q.eq("storageId", args.storageId)).unique();
    if (existing) throw new Error("MEDIA_ALREADY_REGISTERED");
    const file = await ctx.db.system.get(args.storageId);
    if (!file || file.size > MAX_MEDIA_BYTES || (file.contentType !== undefined && !["image/jpeg", "image/png"].includes(file.contentType))) {
      throw new Error("INVALID_MEDIA");
    }
    await ctx.db.insert("merchantMedia", { businessId: args.businessId, storageId: args.storageId });
    return null;
  },
});

/** Server-to-server upload: no cookie authentication or cross-origin browser access. */
export const uploadMerchantMedia = httpAction(async (ctx, request) => {
  const reply = (status: number, error: string) => Response.json({ error }, {
    status, headers: { "Cache-Control": "no-store" },
  });
  const businessId = request.headers.get("X-Business-Id") as Id<"businesses"> | null;
  const sessionToken = request.headers.get("X-Merchant-Session") || undefined;
  if (!businessId) return reply(400, "INVALID_BUSINESS");
  const contentType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "image/png" && contentType !== "image/jpeg") return reply(415, "INVALID_IMAGE_TYPE");
  const length = Number(request.headers.get("Content-Length"));
  if (length > MAX_MEDIA_BYTES) return reply(413, "IMAGE_TOO_LARGE");
  try {
    await ctx.runMutation(internal.storage.authorizeMediaUploadInternal, { businessId, sessionToken });
  } catch (error) {
    return reply(error instanceof Error && error.message.includes("UPLOAD_RATE_LIMIT") ? 429 : 403, "UPLOAD_DENIED");
  }
  if (!request.body) return reply(400, "EMPTY_IMAGE");
  const reader = request.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_MEDIA_BYTES) {
        await reader.cancel();
        return reply(413, "IMAGE_TOO_LARGE");
      }
      chunks.push(new Uint8Array(next.value));
    }
  } catch {
    return reply(400, "INVALID_IMAGE_BODY");
  } finally {
    reader.releaseLock();
  }
  const blob = new Blob(chunks, { type: contentType });
  const prefix = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
  const isPng = [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => prefix[i] === byte);
  const isJpeg = prefix[0] === 255 && prefix[1] === 216 && prefix[2] === 255;
  if ((contentType === "image/png" && !isPng) || (contentType === "image/jpeg" && !isJpeg)) {
    return reply(415, "IMAGE_SIGNATURE_MISMATCH");
  }
  const storageId = await ctx.storage.store(blob);
  try {
    await ctx.runMutation(internal.storage.registerMediaInternal, { businessId, storageId, sessionToken });
  } catch {
    await ctx.storage.delete(storageId);
    return reply(403, "UPLOAD_DENIED");
  }
  return Response.json({ storageId }, { headers: { "Cache-Control": "no-store" } });
});
