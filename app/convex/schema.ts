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
    permissions: v.array(v.string()), // ["restaurants:read", "restaurants:write", "orders:read", "orders:write", "tickets:read", "tickets:write", "tickets:note", "newsletter:read", "newsletter:write", "newsletter:send", "partners:read", "partners:write", "audit:read", "staff:manage"]
    isActive: v.boolean(),
    password: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_regionId", ["regionId"]),

  // Restaurants & Merchants
  businesses: defineTable({
    name: v.string(),
    address: v.optional(v.string()),
    logoStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    ownerId: v.string(), // references auth user ID
    stripeAccountId: v.optional(v.string()),
    stripeOnboardingComplete: v.optional(v.boolean()),
    stripeChargesEnabled: v.optional(v.boolean()),
    stripePayoutsEnabled: v.optional(v.boolean()),
    stripeRequirementsStatus: v.optional(v.string()), // "active" | "currently_due" | "past_due" | "restricted" | "unlinked"
    stripeCurrentlyDue: v.optional(v.array(v.string())),
    stripePastDue: v.optional(v.array(v.string())),
    stripeDisabledReason: v.optional(v.string()),
    stripeFeeCollector: v.optional(v.string()), // "stripe"
    stripeLossCollector: v.optional(v.string()), // "stripe"
    stripeDashboardType: v.optional(v.string()), // "none" | "full"
    stripeConnectedAt: v.optional(v.number()),
    stripeLastSyncedAt: v.optional(v.number()),
    isToGoEnabled: v.optional(v.boolean()),
    isToStayEnabled: v.optional(v.boolean()),
    legalName: v.optional(v.string()),
    taxId: v.optional(v.string()),
    vatId: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    contactPhone: v.optional(v.string()),
    currency: v.optional(v.string()),
    region: v.optional(v.string()), // "de", "at", "ch"
    partnerCode: v.optional(v.string()), // link to referring sales partner
    deletionRequested: v.optional(v.boolean()),
    tables: v.optional(v.array(v.string())),
    isPaused: v.optional(v.boolean()),
    pauseReason: v.optional(v.string()),
    posWorkflowConfirmedAt: v.optional(v.number()),
    testOrderCompletedAt: v.optional(v.number()),
    setupDismissedAt: v.optional(v.number()),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_region", ["region"])
    .index("by_stripeAccountId", ["stripeAccountId"]),

  menuCategories: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    sortOrder: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_and_sortOrder", ["businessId", "sortOrder"]),

  menuItems: defineTable({
    businessId: v.id("businesses"),
    categoryId: v.id("menuCategories"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(), // in cents
    imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    available: v.boolean(),
    sortOrder: v.number(),
    taxRate: v.number(),
    customizations: v.string(), // JSON stringified CustomizationStep[]
    allergens: v.optional(v.array(v.string())),
    additives: v.optional(v.array(v.string())),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_and_available", ["businessId", "available"])
    .index("by_categoryId", ["categoryId"]),

  orders: defineTable({
    businessId: v.id("businesses"),
    tableNumber: v.optional(v.string()),
    type: v.union(v.literal("dine-in"), v.literal("takeaway")),
    items: v.string(), // JSON stringified OrderItem[]
    total: v.number(), // in cents (captured gross including tips)
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
    connectedAccountId: v.optional(v.string()),
    paymentStatus: v.optional(
      v.union(
        v.literal("paid"),
        v.literal("partially_refunded"),
        v.literal("refunded"),
        v.literal("disputed"),
        v.literal("failed")
      )
    ),
    eligibleSubtotalCents: v.optional(v.number()), // gross goods/services excluding tips
    tipCents: v.optional(v.number()), // voluntary tip (0% Zackisch fee)
    discountCents: v.optional(v.number()),
    tax7NetCents: v.optional(v.number()),
    tax7VatCents: v.optional(v.number()),
    tax19NetCents: v.optional(v.number()),
    tax19VatCents: v.optional(v.number()),
    zakkigFee: v.number(), // in cents (legacy alias kept equal to platformFeeGrossCents)
    zackischFee: v.optional(v.number()), // in cents (2% platform fee gross, VAT-inclusive)
    platformFeeGrossCents: v.optional(v.number()),
    platformFeeNetCents: v.optional(v.number()),
    platformFeeVatCents: v.optional(v.number()),
    platformFeeVatRate: v.optional(v.number()),
    stripeFee: v.number(), // in cents (estimated or actual from balance_transaction)
    netAmount: v.number(), // in cents
    refundedAmountCents: v.optional(v.number()),
    refundedPlatformFeeCents: v.optional(v.number()),
    disputeStatus: v.optional(v.string()),
    disputeId: v.optional(v.string()),
    posRecordingStatus: v.optional(
      v.union(v.literal("pending"), v.literal("recorded"))
    ),
    posRecordedAt: v.optional(v.number()),
    posRecordedBy: v.optional(v.string()),
    posReference: v.optional(v.string()),
    confirmationToken: v.optional(v.string()),
    isTestOrder: v.optional(v.boolean()),
    sellerSnapshot: v.optional(v.string()),
    currency: v.string(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_and_status", ["businessId", "status"])
    .index("by_businessId_and_posStatus", [
      "businessId",
      "posRecordingStatus",
    ])
    .index("by_stripePaymentId", ["stripePaymentId"])
    .index("by_stripeSessionId", ["stripeSessionId"])
    .index("by_confirmationToken", ["confirmationToken"]),

  orderSessions: defineTable({
    businessId: v.id("businesses"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_businessId", ["businessId"])
    .index("by_token", ["token"]),

  availabilitySessions: defineTable({
    businessId: v.id("businesses"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_businessId", ["businessId"])
    .index("by_token", ["token"]),

  staffSessions: defineTable({
    businessId: v.id("businesses"),
    token: v.string(),
    expiresAt: v.optional(v.string()),
  })
    .index("by_businessId", ["businessId"])
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
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("unsubscribed")
    ),
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
      v.literal("ops_otp"),
      v.literal("order_receipt"),
      v.literal("newsletter"),
      v.literal("partner_statement"),
      v.literal("staff_invite"),
      v.literal("support_ticket"),
      v.literal("test")
    ),
    subject: v.string(),
    status: v.union(
      v.literal("sent"),
      v.literal("failed"),
      v.literal("queued")
    ),
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
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("cancelled")
    ),
    period: v.string(), // e.g. "2026-10"
    notes: v.optional(v.string()),
    reference: v.optional(v.string()),
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
  })
    .index("by_partnerId", ["partnerId"])
    .index("by_regionId", ["regionId"]),

  // Versioned Legal Documents Registry
  legalDocuments: defineTable({
    slug: v.string(), // "gtc", "privacy-policy", "data-processing", "legal-notice", "accessibility"
    locale: v.string(), // "de-de", "de-en"
    version: v.string(), // e.g. "2026-10-v1"
    title: v.string(),
    effectiveDate: v.string(),
    contentHash: v.string(),
    isActive: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_slug_and_locale", ["slug", "locale"])
    .index("by_isActive", ["isActive"]),

  // Immutable B2B Contract & Legal Acceptance Log
  acceptanceEvents: defineTable({
    businessId: v.id("businesses"),
    userId: v.string(),
    documentSlug: v.string(), // "gtc", "data-processing", "pos-workflow", "fee-model"
    documentVersion: v.string(),
    acceptedAt: v.number(),
    ipHash: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    context: v.string(), // "setup_wizard", "settings", "onboarding"
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_and_slug", ["businessId", "documentSlug"]),

  // Monthly B2B Fee Statements & EN 16931 E-Invoices
  merchantFeeStatements: defineTable({
    businessId: v.id("businesses"),
    regionId: v.string(),
    period: v.string(), // e.g. "2026-10"
    statementNumber: v.string(), // e.g. "ZCK-202610-0001"
    eligibleTurnoverCents: v.number(),
    tipTurnoverCents: v.number(),
    refundedTurnoverCents: v.number(),
    platformFeeGrossCents: v.number(),
    platformFeeNetCents: v.number(),
    platformFeeVatCents: v.number(),
    platformFeeVatRate: v.number(),
    stripeFeesReportedCents: v.number(),
    orderCount: v.number(),
    xmlContent: v.string(), // EN 16931 / XRechnung XML
    status: v.union(v.literal("issued"), v.literal("corrected")),
    createdAt: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_businessId_and_period", ["businessId", "period"])
    .index("by_regionId", ["regionId"]),

  // Support Tickets (shared across support.zackisch.com, app.zackisch.com, internal.zackisch.com)
  supportTickets: defineTable({
    ticketNumber: v.string(), // e.g. "ZCK-1001"
    businessId: v.optional(v.id("businesses")),
    businessName: v.optional(v.string()),
    requesterUserId: v.optional(v.string()),
    requesterEmail: v.string(),
    requesterName: v.string(),
    regionId: v.string(), // "de"
    category: v.union(
      v.literal("onboarding"),
      v.literal("qr_tables"),
      v.literal("orders_tablet"),
      v.literal("payments_payouts"),
      v.literal("account_legal"),
      v.literal("pos_reconciliation"),
      v.literal("other")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("normal"),
      v.literal("high"),
      v.literal("urgent")
    ),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("waiting_for_customer"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    subject: v.string(),
    assignedToEmail: v.optional(v.string()),
    assignedToName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.number(),
  })
    .index("by_regionId_and_updatedAt", ["regionId", "updatedAt"])
    .index("by_regionId_and_status", ["regionId", "status"])
    .index("by_businessId", ["businessId"])
    .index("by_requesterEmail", ["requesterEmail"])
    .index("by_ticketNumber", ["ticketNumber"]),

  // Support Ticket Messages (public replies vs internal staff notes)
  supportMessages: defineTable({
    ticketId: v.id("supportTickets"),
    regionId: v.string(),
    authorType: v.union(
      v.literal("merchant"),
      v.literal("staff"),
      v.literal("system")
    ),
    authorId: v.string(),
    authorName: v.string(),
    visibility: v.union(v.literal("public"), v.literal("internal")),
    body: v.string(),
    attachmentStorageId: v.optional(v.id("_storage")),
    attachmentName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_ticketId", ["ticketId"]),

  // Short-lived cross-subdomain auth handoff tokens (app.zackisch.com -> support.zackisch.com)
  supportCrossAppTokens: defineTable({
    token: v.string(),
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    businessId: v.optional(v.id("businesses")),
    businessName: v.optional(v.string()),
    regionId: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  // Authenticated Support Sessions (issued upon cross-subdomain handoff or direct merchant auth)
  supportSessions: defineTable({
    token: v.string(),
    userId: v.string(),
    businessId: v.optional(v.id("businesses")),
    businessName: v.optional(v.string()),
    email: v.string(),
    name: v.string(),
    regionId: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  // Complete Audit Trail of team and merchant compliance actions within their region
  auditLogs: defineTable({
    actorId: v.string(),
    actorRole: v.string(), // "regional_admin", "staff", "merchant", "system"
    action: v.string(), // e.g. "restaurant.update", "order.pos_recorded", "ticket.internal_note"
    entityType: v.string(), // "restaurant", "order", "staff", "newsletter", "partner", "settings", "ticket"
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
