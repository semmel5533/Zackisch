import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { requireOwner } from "./permissions";

export const generateUploadUrl = mutation({
  args: {
    businessId: v.id("businesses"),
    sessionToken: v.optional(v.string()),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.businessId, args.sessionToken);
    return await ctx.storage.generateUploadUrl();
  },
});

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
