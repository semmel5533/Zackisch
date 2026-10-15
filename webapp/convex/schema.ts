import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    ...authTables.users.validator.fields,
    region: v.optional(v.string()),
  }).index("email", ["email"]),

  // Regional business settings and expansion configuration
  regions: defineTable({
    code: v.string(), // "de", "at", "ch"
    name: v.string(), // "Deutschland", "Österreich", "Schweiz"
    currency: v.string(), // "EUR", "CHF"
    taxRates: v.array(v.number()), // e.g. [7, 19]
    platformFeePercent: v.number(), // default: 2 (2%)
    partnerCommissionPercent: v.number(), // default: 50 (50% of platform fee)
    status: v.union(v.literal("active"), v.literal("planned")),
    defaultLocale: v.string(), // "de"
    supportedLocales: v.array(v.string()), // ["de", "en"]
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  // Zackisch Internal Staff and Regional Admins
  adminUsers: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("regional_admin"), v.literal("staff")),
    regionId: v.string(), // e.g. "de"
    permissions: v.array(v.string()), // ["restaurants:read", "restaurants:write", "newsletter:read", "newsletter:write", "newsletter:send", "partners:read", "partners:write", "audit:read", "staff:manage"]
    isActive: v.boolean(),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_regionId", ["regionId"]),

  // Restaurants & Merchants
  organizations: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    logoStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    ownerId: v.string(), // references auth user ID
    stripeAccountId: v.optional(v.string()),
    stripeOnboardingComplete: v.optional(v.boolean()),
    isToGoEnabled: v.optional(v.boolean()),
    isToStayEnabled: v.optional(v.boolean()),
    legalName: v.optional(v.string()),
    taxId: v.optional(v.string()),
    currency: v.optional(v.string()),
    region: v.optional(v.string()), // "de", "at", "ch"
    partnerCode: v.optional(v.string()), // link to referring sales partner
    deletionRequested: v.optional(v.boolean()),
    tables: v.optional(v.array(v.string())),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_region", ["region"]),

  menuCategories: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    sortOrder: v.number(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_and_sortOrder", ["organizationId", "sortOrder"]),

  menuItems: defineTable({
    organizationId: v.id("organizations"),
    categoryId: v.id("menuCategories"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(), // in cents
    imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    available: v.boolean(),
    sortOrder: v.number(),
    taxRate: v.number(),
    customizations: v.string(), // JSON stringified CustomizationStep[]
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_and_available", ["organizationId", "available"])
    .index("by_categoryId", ["categoryId"]),

  orders: defineTable({
    organizationId: v.id("organizations"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(), // JSON stringified OrderItem[]
    total: v.number(), // in cents
    status: v.union(
      v.literal("in_progress"),
      v.literal("ready_for_pickup"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    completedAt: v.optional(v.number()),
    readyAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    email: v.string(),
    orderNumber: v.string(), // 3-digit rolling number e.g. "001"
    stripePaymentId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    zakkigFee: v.number(), // in cents
    zackischFee: v.optional(v.number()), // in cents (2% platform fee)
    stripeFee: v.number(), // in cents
    netAmount: v.number(), // in cents
    currency: v.string(),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_and_status", ["organizationId", "status"])
    .index("by_stripePaymentId", ["stripePaymentId"])
    .index("by_stripeSessionId", ["stripeSessionId"]),

  orderSessions: defineTable({
    organizationId: v.id("organizations"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_token", ["token"]),

  availabilitySessions: defineTable({
    organizationId: v.id("organizations"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_token", ["token"]),

  staffSessions: defineTable({
    organizationId: v.id("organizations"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_token", ["token"]),

  verificationCodes: defineTable({
    identifier: v.string(),
    code: v.string(),
    expires: v.number(),
    challenge: v.optional(v.string()),
  }).index("by_identifier", ["identifier"]),

  // Newsletter Subscribers (Double-Opt-In)
  newsletterSubscribers: defineTable({
    email: v.string(),
    regionId: v.string(), // "de"
    locale: v.string(), // "de" or "en"
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("unsubscribed")),
    doubleOptInToken: v.string(),
    tokenExpiresAt: v.number(),
    confirmedAt: v.optional(v.number()),
    unsubscribedAt: v.optional(v.number()),
    source: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email_and_region", ["email", "regionId"])
    .index("by_token", ["doubleOptInToken"])
    .index("by_regionId_and_status", ["regionId", "status"]),

  // Newsletter Campaigns (No-Code Visual Blocks + Master Template)
  newsletterCampaigns: defineTable({
    title: v.string(),
    subject: v.string(),
    regionId: v.string(),
    locale: v.string(),
    htmlContent: v.string(),
    textContent: v.string(),
    blocks: v.optional(v.string()), // JSON stringified block editor state
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
    .index("by_regionId", ["regionId"])
    .index("by_status", ["status"]),

  // Central Email Log of all backend-generated messages
  emailLogs: defineTable({
    recipient: v.string(),
    type: v.union(
      v.literal("otp"),
      v.literal("order_receipt"),
      v.literal("newsletter"),
      v.literal("partner_statement"),
      v.literal("staff_invite"),
      v.literal("test")
    ),
    subject: v.string(),
    status: v.union(v.literal("sent"), v.literal("failed"), v.literal("queued")),
    error: v.optional(v.string()),
    regionId: v.optional(v.string()),
    campaignId: v.optional(v.id("newsletterCampaigns")),
    timestamp: v.number(),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_recipient", ["recipient"])
    .index("by_regionId", ["regionId"])
    .index("by_type", ["type"]),

  // Sales Partners (50% of Zackisch platform fee = 1% GMV)
  partners: defineTable({
    code: v.string(), // referral code, e.g. "BERLIN01"
    name: v.string(),
    email: v.string(),
    regionId: v.string(),
    commissionRate: v.number(), // default 0.5 (50% of 2% platform fee)
    status: v.union(v.literal("active"), v.literal("inactive")),
    totalEarnedCents: v.number(),
    totalPaidCents: v.number(),
    iban: v.optional(v.string()),
    taxId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_regionId", ["regionId"])
    .index("by_email", ["email"]),

  // Partner Payouts and Ledger
  partnerPayouts: defineTable({
    partnerId: v.id("partners"),
    regionId: v.string(),
    amountCents: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("cancelled")),
    period: v.string(), // e.g. "2026-10"
    notes: v.optional(v.string()),
    reference: v.optional(v.string()),
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
  })
    .index("by_partnerId", ["partnerId"])
    .index("by_regionId", ["regionId"]),

  // Complete Audit Trail of team actions within their region
  auditLogs: defineTable({
    actorId: v.string(),
    actorRole: v.string(), // "regional_admin", "staff", "system"
    action: v.string(), // e.g. "restaurant.update", "staff.invite", "newsletter.send"
    entityType: v.string(), // "restaurant", "order", "staff", "newsletter", "partner", "settings"
    entityId: v.string(),
    regionId: v.string(),
    details: v.string(), // sanitized JSON string
    ipAddress: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_regionId_and_timestamp", ["regionId", "timestamp"])
    .index("by_entityType", ["entityType"])
    .index("by_actorId", ["actorId"]),
});
