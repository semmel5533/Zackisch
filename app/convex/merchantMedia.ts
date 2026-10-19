import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export async function requireOwnedMedia(ctx: MutationCtx, businessId: Id<"businesses">, storageId: Id<"_storage">) {
  const media = await ctx.db.query("merchantMedia")
    .withIndex("by_storageId", q => q.eq("storageId", storageId)).unique();
  if (media?.businessId !== businessId || !(await ctx.db.system.get(storageId))) {
    throw new Error("INVALID_MEDIA_OWNER");
  }
}

/** Delete registered media only after its last reference in the owning business is removed. */
export async function deleteUnusedMedia(ctx: MutationCtx, businessId: Id<"businesses">, storageId: Id<"_storage"> | null | undefined) {
  if (!storageId) return;
  const media = await ctx.db.query("merchantMedia")
    .withIndex("by_storageId", q => q.eq("storageId", storageId)).unique();
  // Unregistered legacy files require a separately verified ownership migration.
  if (media?.businessId !== businessId) return;
  const business = await ctx.db.get(businessId);
  if (business?.logoStorageId === storageId || business?.bannerStorageId === storageId) return;
  const item = await ctx.db.query("menuItems")
    .withIndex("by_imageStorageId", q => q.eq("imageStorageId", storageId)).first();
  if (item) return;
  await ctx.storage.delete(storageId);
  await ctx.db.delete(media._id);
}
