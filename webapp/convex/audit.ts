import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to sanitize details and redact any sensitive data (OTPs, passwords, tokens, full cards)
export function sanitizeAuditDetails(details: Record<string, any>): string {
  const SENSITIVE_KEYS = [
    "password",
    "passwordHash",
    "token",
    "otp",
    "code",
    "secret",
    "cardNumber",
    "cvc",
    "appPassword",
  ];

  function redact(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map(redact);
    }

    const cleaned: Record<string, any> = {};
    for (const [k, val] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.some((s) => k.toLowerCase().includes(s.toLowerCase()))) {
        cleaned[k] = "[REDACTED]";
      } else if (typeof val === "object") {
        cleaned[k] = redact(val);
      } else {
        cleaned[k] = val;
      }
    }
    return cleaned;
  }

  return JSON.stringify(redact(details));
}

// Internal mutation used across backend workflows
export const logInternal = internalMutation({
  args: {
    actorId: v.string(),
    actorRole: v.string(),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    regionId: v.string(),
    details: v.string(),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Mutation callable by authenticated operations
export const recordAction = mutation({
  args: {
    actorId: v.string(),
    actorRole: v.string(),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    regionId: v.string(),
    details: v.string(),
    ipAddress: v.optional(v.string()),
  },
  returns: v.id("auditLogs"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("auditLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Query for regional admins / authorized staff to view audit trail
export const getAuditLogs = query({
  args: {
    regionId: v.string(),
    entityType: v.optional(v.string()),
    actorId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  returns: v.array(
    v.object({
      _id: v.id("auditLogs"),
      _creationTime: v.number(),
      actorId: v.string(),
      actorRole: v.string(),
      action: v.string(),
      entityType: v.string(),
      entityId: v.string(),
      regionId: v.string(),
      details: v.string(),
      ipAddress: v.optional(v.string()),
      timestamp: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    const records = await ctx.db
      .query("auditLogs")
      .withIndex("by_regionId_and_timestamp", (q) => q.eq("regionId", args.regionId))
      .order("desc")
      .take(limit * 2);

    return records
      .filter((r) => {
        if (args.entityType && r.entityType !== args.entityType) return false;
        if (args.actorId && r.actorId !== args.actorId) return false;
        return true;
      })
      .slice(0, limit);
  },
});
