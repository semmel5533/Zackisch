import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

function generateCryptoToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// 1. Double Opt-In Subscription (Website & Webapp)
export const subscribe = mutation({
  args: {
    email: v.string(),
    regionId: v.optional(v.string()),
    locale: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    status: v.string(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase().trim();
    if (!email.includes("@") || !email.includes(".")) {
      return { success: false, status: "invalid_email", message: "Ungültige E-Mail-Adresse" };
    }

    const regionId = args.regionId || "de";
    const locale = args.locale || "de";
    const source = args.source || "website";

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email_and_region", (q) => q.eq("email", email).eq("regionId", regionId))
      .first();

    if (existing && existing.status === "confirmed") {
      return {
        success: true,
        status: "already_confirmed",
        message: locale === "en" ? "You are already subscribed!" : "Du bist bereits angemeldet!",
      };
    }

    const token = generateCryptoToken();
    const tokenExpiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48 hours

    if (existing) {
      await ctx.db.patch(existing._id, {
        doubleOptInToken: token,
        tokenExpiresAt,
        locale,
        status: "pending",
      });
    } else {
      await ctx.db.insert("newsletterSubscribers", {
        email,
        regionId,
        locale,
        status: "pending",
        doubleOptInToken: token,
        tokenExpiresAt,
        source,
        createdAt: Date.now(),
      });
    }

    // Schedule confirmation email
    await ctx.scheduler.runAfter(0, internal.emails.sendNewsletterConfirmationEmail, {
      to: email,
      token,
      locale,
      regionId,
    });

    return {
      success: true,
      status: "pending",
      message:
        locale === "en"
          ? "Please check your inbox to confirm your subscription."
          : "Bitte überprüfe deinen Posteingang, um die Anmeldung zu bestätigen.",
    };
  },
});

// 2. Confirm Subscription via Double Opt-In Token
export const confirmSubscription = mutation({
  args: { token: v.string() },
  returns: v.object({
    success: v.boolean(),
    locale: v.string(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_token", (q) => q.eq("doubleOptInToken", args.token))
      .first();

    if (!subscriber) {
      return { success: false, locale: "de", error: "Token not found" };
    }

    if (Date.now() > subscriber.tokenExpiresAt) {
      return { success: false, locale: subscriber.locale, error: "Token expired" };
    }

    await ctx.db.patch(subscriber._id, {
      status: "confirmed",
      confirmedAt: Date.now(),
    });

    return { success: true, locale: subscriber.locale };
  },
});

// 3. Unsubscribe (RFC 8058 One-Click or Web Form)
export const unsubscribe = mutation({
  args: {
    token: v.optional(v.string()),
    email: v.optional(v.string()),
    regionId: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    let subscriber = null;

    if (args.token) {
      const token = args.token;
      subscriber = await ctx.db
        .query("newsletterSubscribers")
        .withIndex("by_token", (q) => q.eq("doubleOptInToken", token))
        .first();
    }

    if (!subscriber && args.email) {
      const email = args.email.toLowerCase().trim();
      const regionId = args.regionId || "de";
      subscriber = await ctx.db
        .query("newsletterSubscribers")
        .withIndex("by_email_and_region", (q) => q.eq("email", email).eq("regionId", regionId))
        .first();
    }

    if (!subscriber) {
      return { success: false, message: "Abonnent nicht gefunden." };
    }

    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
      unsubscribedAt: Date.now(),
    });

    return { success: true, message: "Erfolgreich abgemeldet." };
  },
});

// 4. List Subscribers for Adminapp
export const listSubscribers = query({
  args: {
    regionId: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed"))),
  },
  returns: v.array(
    v.object({
      _id: v.id("newsletterSubscribers"),
      _creationTime: v.number(),
      email: v.string(),
      regionId: v.string(),
      locale: v.string(),
      status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
      createdAt: v.number(),
      confirmedAt: v.optional(v.number()),
      unsubscribedAt: v.optional(v.number()),
      source: v.optional(v.string()),
    })
  ),
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_regionId_and_status", (q) =>
        args.status ? q.eq("regionId", args.regionId).eq("status", args.status) : q.eq("regionId", args.regionId)
      );

    const subscribers = await query.collect();
    return subscribers.map((s) => ({
      _id: s._id,
      _creationTime: s._creationTime,
      email: s.email,
      regionId: s.regionId,
      locale: s.locale,
      status: s.status,
      createdAt: s.createdAt,
      confirmedAt: s.confirmedAt,
      unsubscribedAt: s.unsubscribedAt,
      source: s.source,
    }));
  },
});

// 5. Campaigns Management for Adminapp
export const listCampaigns = query({
  args: { regionId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("newsletterCampaigns"),
      _creationTime: v.number(),
      title: v.string(),
      subject: v.string(),
      regionId: v.string(),
      locale: v.string(),
      htmlContent: v.string(),
      textContent: v.string(),
      blocks: v.optional(v.string()),
      status: v.union(
        v.literal("draft"),
        v.literal("scheduled"),
        v.literal("sending"),
        v.literal("sent"),
        v.literal("cancelled")
      ),
      scheduledAt: v.optional(v.number()),
      sentAt: v.optional(v.number()),
      recipientCount: v.optional(v.number()),
      deliveredCount: v.optional(v.number()),
      failedCount: v.optional(v.number()),
      createdBy: v.string(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsletterCampaigns")
      .withIndex("by_regionId", (q) => q.eq("regionId", args.regionId))
      .order("desc")
      .collect();
  },
});

export const createCampaign = mutation({
  args: {
    title: v.string(),
    subject: v.string(),
    regionId: v.string(),
    locale: v.string(),
    htmlContent: v.string(),
    textContent: v.string(),
    blocks: v.optional(v.string()),
    createdBy: v.string(),
  },
  returns: v.id("newsletterCampaigns"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const campaignId = await ctx.db.insert("newsletterCampaigns", {
      ...args,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    // Record audit event
    await ctx.db.insert("auditLogs", {
      actorId: args.createdBy,
      actorRole: "staff",
      action: "newsletter.create",
      entityType: "newsletter",
      entityId: campaignId,
      regionId: args.regionId,
      details: JSON.stringify({ title: args.title, subject: args.subject }),
      timestamp: now,
    });

    return campaignId;
  },
});

export const updateCampaign = mutation({
  args: {
    campaignId: v.id("newsletterCampaigns"),
    title: v.string(),
    subject: v.string(),
    locale: v.string(),
    htmlContent: v.string(),
    textContent: v.string(),
    blocks: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("scheduled"),
        v.literal("sending"),
        v.literal("sent"),
        v.literal("cancelled")
      )
    ),
    scheduledAt: v.optional(v.number()),
    actorEmail: v.string(),
    regionId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.campaignId);
    if (!existing) throw new Error("Campaign not found");

    const patch: any = {
      title: args.title,
      subject: args.subject,
      locale: args.locale,
      htmlContent: args.htmlContent,
      textContent: args.textContent,
      updatedAt: Date.now(),
    };
    if (args.blocks !== undefined) patch.blocks = args.blocks;
    if (args.status !== undefined) patch.status = args.status;
    if (args.scheduledAt !== undefined) patch.scheduledAt = args.scheduledAt;

    await ctx.db.patch(args.campaignId, patch);

    // Record audit event
    await ctx.db.insert("auditLogs", {
      actorId: args.actorEmail,
      actorRole: "staff",
      action: "newsletter.update",
      entityType: "newsletter",
      entityId: args.campaignId,
      regionId: args.regionId,
      details: JSON.stringify({ title: args.title, status: args.status || existing.status }),
      timestamp: Date.now(),
    });

    return null;
  },
});
