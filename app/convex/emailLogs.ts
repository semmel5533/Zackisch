import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const logEmailRecord = internalMutation({
  args: {
    recipient: v.string(),
    type: v.union(
      v.literal("otp"),
      v.literal("ops_otp"),
      v.literal("order_receipt"),
      v.literal("newsletter"),
      v.literal("partner_statement"),
      v.literal("staff_invite"),
      v.literal("support_ticket"),
      v.literal("test")
    ),
    subject: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("queued")),
    error: v.optional(v.string()),
    regionId: v.optional(v.string()),
    campaignId: v.optional(v.id("newsletterCampaigns")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

export const getConfirmedSubscribersForCampaign = internalQuery({
  args: { regionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_regionId_and_status", (q) =>
        q.eq("regionId", args.regionId).eq("status", "confirmed")
      )
      .collect();
  },
});

export const updateCampaignSentStats = internalMutation({
  args: {
    campaignId: v.id("newsletterCampaigns"),
    deliveredCount: v.number(),
    failedCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      status: "sent",
      sentAt: Date.now(),
      deliveredCount: args.deliveredCount,
      failedCount: args.failedCount,
    });
  },
});

// Query for Team Dashboard to list email logs
export const listEmailLogs = query({
  args: {
    regionId: v.optional(v.string()),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("emailLogs"),
      _creationTime: v.number(),
      recipient: v.string(),
      type: v.union(
        v.literal("otp"),
        v.literal("ops_otp"),
        v.literal("order_receipt"),
        v.literal("newsletter"),
        v.literal("partner_statement"),
        v.literal("staff_invite"),
        v.literal("support_ticket"),
        v.literal("test")
      ),
      subject: v.string(),
      status: v.union(v.literal("sent"), v.literal("failed"), v.literal("queued")),
      error: v.optional(v.string()),
      regionId: v.optional(v.string()),
      campaignId: v.optional(v.id("newsletterCampaigns")),
      timestamp: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const records = await ctx.db.query("emailLogs").order("desc").take(limit * 2);
    return records
      .filter((r) => {
        if (args.regionId && r.regionId && r.regionId !== args.regionId) return false;
        if (args.type && r.type !== args.type && !(args.type === "otp" && r.type === "ops_otp")) return false;
        return true;
      })
      .slice(0, limit);
  },
});
