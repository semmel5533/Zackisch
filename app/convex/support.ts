import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const ticketCategoryValidator = v.union(
  v.literal("onboarding"),
  v.literal("qr_tables"),
  v.literal("orders_tablet"),
  v.literal("payments_payouts"),
  v.literal("account_legal"),
  v.literal("pos_reconciliation"),
  v.literal("other")
);

const ticketPriorityValidator = v.union(
  v.literal("low"),
  v.literal("normal"),
  v.literal("high"),
  v.literal("urgent")
);

const ticketStatusValidator = v.union(
  v.literal("open"),
  v.literal("in_progress"),
  v.literal("waiting_for_customer"),
  v.literal("resolved"),
  v.literal("closed")
);

const ticketObjectValidator = v.object({
  _id: v.id("supportTickets"),
  _creationTime: v.number(),
  ticketNumber: v.string(),
  businessId: v.optional(v.id("businesses")),
  businessName: v.optional(v.string()),
  requesterUserId: v.optional(v.string()),
  requesterEmail: v.string(),
  requesterName: v.string(),
  regionId: v.string(),
  category: ticketCategoryValidator,
  priority: ticketPriorityValidator,
  status: ticketStatusValidator,
  subject: v.string(),
  assignedToEmail: v.optional(v.string()),
  assignedToName: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
  lastMessageAt: v.number(),
});

const messageObjectValidator = v.object({
  _id: v.id("supportMessages"),
  _creationTime: v.number(),
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
});

async function requireTeamPermission(
  ctx: { db: any },
  adminEmail: string,
  regionId: string,
  requiredPermission: "tickets:read" | "tickets:write" | "tickets:note"
) {
  const cleanEmail = adminEmail.trim().toLowerCase();
  const admin = await ctx.db
    .query("adminUsers")
    .withIndex("by_email", (q: any) => q.eq("email", cleanEmail))
    .first();

  if (!admin || !admin.isActive) {
    throw new Error("Kein aktives Team-Dashboard-Konto.");
  }

  if (admin.regionId !== regionId) {
    throw new Error("Zugriff auf fremde Region verweigert.");
  }

  if (
    admin.role !== "regional_admin" &&
    !admin.permissions.includes(requiredPermission)
  ) {
    throw new Error(`Fehlende Berechtigung: ${requiredPermission}`);
  }

  return admin;
}

/**
 * Generates a short-lived (5-minute) single-use cross-subdomain token on app.zackisch.com
 * so an authenticated restaurant owner can open support.zackisch.com/de-de/tickets seamlessly.
 */
export const createCrossAppToken = mutation({
  args: {
    businessId: v.optional(v.id("businesses")),
  },
  returns: v.object({
    token: v.string(),
    expiresAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Nicht authentifiziert.");
    }

    const user: any = await ctx.db.get(userId);
    const email = (user?.email || "merchant@zackisch.com").toLowerCase();
    let org: any = null;

    if (args.businessId) {
      const candidate = await ctx.db.get(args.businessId);
      if (candidate && candidate.ownerId === userId) {
        org = candidate;
      }
    }
    if (!org) {
      org = await ctx.db
        .query("businesses")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
        .first();
    }

    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      ""
    );
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await ctx.db.insert("supportCrossAppTokens", {
      token,
      userId: String(userId),
      email,
      name: org?.name || user?.name || email,
      businessId: org?._id,
      businessName: org?.name,
      regionId: org?.region || "de",
      expiresAt,
    });

    return { token, expiresAt };
  },
});

export const exchangeCrossAppToken = mutation({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      userId: v.string(),
      email: v.string(),
      name: v.string(),
      businessId: v.optional(v.id("businesses")),
      businessName: v.optional(v.string()),
      regionId: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("supportCrossAppTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token.trim()))
      .first();

    if (!row) return null;
    await ctx.db.delete(row._id);

    if (Date.now() > row.expiresAt) {
      return null;
    }

    return {
      userId: row.userId,
      email: row.email,
      name: row.name,
      businessId: row.businessId,
      businessName: row.businessName,
      regionId: row.regionId,
    };
  },
});

export const createTicket = mutation({
  args: {
    businessId: v.optional(v.id("businesses")),
    requesterEmail: v.string(),
    requesterName: v.string(),
    category: ticketCategoryValidator,
    priority: v.optional(ticketPriorityValidator),
    subject: v.string(),
    body: v.string(),
  },
  returns: v.object({
    ticketId: v.id("supportTickets"),
    ticketNumber: v.string(),
  }),
  handler: async (ctx, args) => {
    const cleanEmail = args.requesterEmail.trim().toLowerCase();
    const cleanName = args.requesterName.trim();
    const cleanSubject = args.subject.trim();
    const cleanBody = args.body.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Bitte gib eine gültige E-Mail-Adresse an.");
    }
    if (cleanSubject.length < 3 || cleanSubject.length > 160) {
      throw new Error("Betreff muss zwischen 3 und 160 Zeichen lang sein.");
    }
    if (cleanBody.length < 5 || cleanBody.length > 5000) {
      throw new Error("Nachricht muss zwischen 5 und 5000 Zeichen lang sein.");
    }

    const userId = await getAuthUserId(ctx);
    let org: any = null;
    if (args.businessId) {
      org = await ctx.db.get(args.businessId);
    } else if (userId) {
      org = await ctx.db
        .query("businesses")
        .withIndex("by_ownerId", (q) => q.eq("ownerId", userId))
        .first();
    }

    const regionId = org?.region || "de";
    const recentTickets = await ctx.db
      .query("supportTickets")
      .withIndex("by_regionId_and_updatedAt", (q) => q.eq("regionId", regionId))
      .order("desc")
      .take(1);

    let nextNumber = 1001;
    if (recentTickets.length > 0) {
      const m = recentTickets[0].ticketNumber.match(/(\d+)$/);
      if (m) {
        nextNumber = parseInt(m[1], 10) + 1;
      }
    }
    const ticketNumber = `ZCK-${nextNumber}`;
    const now = Date.now();

    const ticketId = await ctx.db.insert("supportTickets", {
      ticketNumber,
      businessId: org?._id,
      businessName: org?.name,
      requesterUserId: userId ? String(userId) : undefined,
      requesterEmail: cleanEmail,
      requesterName: cleanName || org?.name || cleanEmail,
      regionId,
      category: args.category,
      priority: args.priority || "normal",
      status: "open",
      subject: cleanSubject,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    });

    await ctx.db.insert("supportMessages", {
      ticketId,
      regionId,
      authorType: "merchant",
      authorId: userId ? String(userId) : cleanEmail,
      authorName: cleanName || org?.name || cleanEmail,
      visibility: "public",
      body: cleanBody,
      createdAt: now,
    });

    await ctx.db.insert("emailLogs", {
      recipient: cleanEmail,
      type: "support_ticket",
      subject: `[${ticketNumber}] Support-Anfrage eingegangen: ${cleanSubject}`,
      status: "sent",
      regionId,
      timestamp: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: userId ? String(userId) : cleanEmail,
      actorRole: "merchant",
      action: "ticket.created",
      entityType: "ticket",
      entityId: String(ticketId),
      regionId,
      details: JSON.stringify({
        ticketNumber,
        category: args.category,
        subject: cleanSubject,
      }),
      timestamp: now,
    });

    return { ticketId, ticketNumber };
  },
});

export const getCustomerTickets = query({
  args: {
    requesterEmail: v.optional(v.string()),
    businessId: v.optional(v.id("businesses")),
  },
  returns: v.array(ticketObjectValidator),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    let email = args.requesterEmail?.trim().toLowerCase();

    if (userId && !email) {
      const user: any = await ctx.db.get(userId);
      email = user?.email?.toLowerCase();
    }

    if (args.businessId) {
      const byOrg = await ctx.db
        .query("supportTickets")
        .withIndex("by_businessId", (q) =>
          q.eq("businessId", args.businessId)
        )
        .order("desc")
        .collect();
      if (byOrg.length > 0) return byOrg;
    }

    if (!email) return [];

    return await ctx.db
      .query("supportTickets")
      .withIndex("by_requesterEmail", (q) => q.eq("requesterEmail", email!))
      .order("desc")
      .collect();
  },
});

/**
 * Customer-facing ticket thread query.
 * SECURITY INVARIANT: Strictly filters out all `visibility === "internal"` staff notes
 * so internal notes are never transmitted to customer browsers.
 */
export const getCustomerTicketThread = query({
  args: {
    ticketId: v.id("supportTickets"),
    requesterEmail: v.optional(v.string()),
  },
  returns: v.union(
    v.null(),
    v.object({
      ticket: ticketObjectValidator,
      messages: v.array(messageObjectValidator),
    })
  ),
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) return null;

    const userId = await getAuthUserId(ctx);
    const cleanEmail = args.requesterEmail?.trim().toLowerCase();

    let authorized = false;
    if (userId && ticket.requesterUserId === String(userId)) {
      authorized = true;
    } else if (userId && ticket.businessId) {
      const org = await ctx.db.get(ticket.businessId);
      if (org && org.ownerId === userId) {
        authorized = true;
      }
    } else if (cleanEmail && ticket.requesterEmail === cleanEmail) {
      authorized = true;
    }

    if (!authorized) {
      return null;
    }

    const allMessages = await ctx.db
      .query("supportMessages")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .order("asc")
      .collect();

    // Strictly strip internal staff notes
    const publicMessages = allMessages.filter(
      (m) => m.visibility === "public"
    );

    return {
      ticket,
      messages: publicMessages,
    };
  },
});

export const addCustomerReply = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    requesterEmail: v.string(),
    requesterName: v.optional(v.string()),
    body: v.string(),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket nicht gefunden.");

    const cleanEmail = args.requesterEmail.trim().toLowerCase();
    const userId = await getAuthUserId(ctx);

    const isOwnerMatch =
      (userId && ticket.requesterUserId === String(userId)) ||
      ticket.requesterEmail === cleanEmail;
    if (!isOwnerMatch) {
      throw new Error("Keine Berechtigung für dieses Support-Ticket.");
    }

    const cleanBody = args.body.trim();
    if (cleanBody.length < 2 || cleanBody.length > 5000) {
      throw new Error("Antwort muss zwischen 2 und 5000 Zeichen lang sein.");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      regionId: ticket.regionId,
      authorType: "merchant",
      authorId: userId ? String(userId) : cleanEmail,
      authorName: args.requesterName?.trim() || ticket.requesterName,
      visibility: "public",
      body: cleanBody,
      createdAt: now,
    });

    await ctx.db.patch(args.ticketId, {
      status: ticket.status === "closed" ? "open" : "open",
      updatedAt: now,
      lastMessageAt: now,
    });

    return messageId;
  },
});

// ============================================================================
// Team Dashboard (internal.zackisch.com) Support Ticket Queries & Mutations
// ============================================================================

export const getTeamTickets = query({
  args: {
    adminEmail: v.string(),
    regionId: v.string(),
    status: v.optional(ticketStatusValidator),
  },
  returns: v.array(ticketObjectValidator),
  handler: async (ctx, args) => {
    await requireTeamPermission(
      ctx,
      args.adminEmail,
      args.regionId,
      "tickets:read"
    );

    if (args.status) {
      return await ctx.db
        .query("supportTickets")
        .withIndex("by_regionId_and_status", (q) =>
          q.eq("regionId", args.regionId).eq("status", args.status!)
        )
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("supportTickets")
      .withIndex("by_regionId_and_updatedAt", (q) =>
        q.eq("regionId", args.regionId)
      )
      .order("desc")
      .collect();
  },
});

export const getTeamTicketThread = query({
  args: {
    adminEmail: v.string(),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
  },
  returns: v.union(
    v.null(),
    v.object({
      ticket: ticketObjectValidator,
      messages: v.array(messageObjectValidator),
    })
  ),
  handler: async (ctx, args) => {
    await requireTeamPermission(
      ctx,
      args.adminEmail,
      args.regionId,
      "tickets:read"
    );

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.regionId !== args.regionId) {
      return null;
    }

    const messages = await ctx.db
      .query("supportMessages")
      .withIndex("by_ticketId", (q) => q.eq("ticketId", args.ticketId))
      .order("asc")
      .collect();

    return { ticket, messages };
  },
});

export const addTeamPublicReply = mutation({
  args: {
    adminEmail: v.string(),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
    body: v.string(),
    nextStatus: v.optional(ticketStatusValidator),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const admin = await requireTeamPermission(
      ctx,
      args.adminEmail,
      args.regionId,
      "tickets:write"
    );

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.regionId !== args.regionId) {
      throw new Error("Ticket in dieser Region nicht gefunden.");
    }

    const cleanBody = args.body.trim();
    if (cleanBody.length < 2 || cleanBody.length > 5000) {
      throw new Error("Antwort muss zwischen 2 und 5000 Zeichen lang sein.");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      regionId: args.regionId,
      authorType: "staff",
      authorId: admin.email,
      authorName: admin.name,
      visibility: "public",
      body: cleanBody,
      createdAt: now,
    });

    const newStatus = args.nextStatus || "waiting_for_customer";
    await ctx.db.patch(args.ticketId, {
      status: newStatus,
      updatedAt: now,
      lastMessageAt: now,
      assignedToEmail: ticket.assignedToEmail || admin.email,
      assignedToName: ticket.assignedToName || admin.name,
    });

    await ctx.db.insert("emailLogs", {
      recipient: ticket.requesterEmail,
      type: "support_ticket",
      subject: `Re: [${ticket.ticketNumber}] ${ticket.subject}`,
      status: "sent",
      regionId: args.regionId,
      timestamp: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin.email,
      actorRole: admin.role,
      action: "ticket.public_reply",
      entityType: "ticket",
      entityId: String(args.ticketId),
      regionId: args.regionId,
      details: JSON.stringify({
        ticketNumber: ticket.ticketNumber,
        newStatus,
      }),
      timestamp: now,
    });

    return messageId;
  },
});

/**
 * Dedicated mutation for internal staff notes (`visibility: "internal"`).
 * Requires `tickets:note` (or `regional_admin`) and never exposes content to customers.
 */
export const addTeamInternalNote = mutation({
  args: {
    adminEmail: v.string(),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
    body: v.string(),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const admin = await requireTeamPermission(
      ctx,
      args.adminEmail,
      args.regionId,
      "tickets:note"
    );

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.regionId !== args.regionId) {
      throw new Error("Ticket in dieser Region nicht gefunden.");
    }

    const cleanBody = args.body.trim();
    if (cleanBody.length < 2 || cleanBody.length > 5000) {
      throw new Error("Interne Notiz muss zwischen 2 und 5000 Zeichen lang sein.");
    }

    const now = Date.now();
    const messageId = await ctx.db.insert("supportMessages", {
      ticketId: args.ticketId,
      regionId: args.regionId,
      authorType: "staff",
      authorId: admin.email,
      authorName: admin.name,
      visibility: "internal",
      body: cleanBody,
      createdAt: now,
    });

    await ctx.db.patch(args.ticketId, {
      updatedAt: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: admin.email,
      actorRole: admin.role,
      action: "ticket.internal_note",
      entityType: "ticket",
      entityId: String(args.ticketId),
      regionId: args.regionId,
      details: JSON.stringify({
        ticketNumber: ticket.ticketNumber,
      }),
      timestamp: now,
    });

    return messageId;
  },
});

export const updateTicketStatusAndAssignee = mutation({
  args: {
    adminEmail: v.string(),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
    status: v.optional(ticketStatusValidator),
    priority: v.optional(ticketPriorityValidator),
    assignedToEmail: v.optional(v.string()),
    assignedToName: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const admin = await requireTeamPermission(
      ctx,
      args.adminEmail,
      args.regionId,
      "tickets:write"
    );

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket || ticket.regionId !== args.regionId) {
      throw new Error("Ticket in dieser Region nicht gefunden.");
    }

    const patch: any = { updatedAt: Date.now() };
    if (args.status !== undefined) patch.status = args.status;
    if (args.priority !== undefined) patch.priority = args.priority;
    if (args.assignedToEmail !== undefined) {
      patch.assignedToEmail = args.assignedToEmail || undefined;
    }
    if (args.assignedToName !== undefined) {
      patch.assignedToName = args.assignedToName || undefined;
    }

    await ctx.db.patch(args.ticketId, patch);

    await ctx.db.insert("auditLogs", {
      actorId: admin.email,
      actorRole: admin.role,
      action: "ticket.status_updated",
      entityType: "ticket",
      entityId: String(args.ticketId),
      regionId: args.regionId,
      details: JSON.stringify({
        ticketNumber: ticket.ticketNumber,
        status: args.status ?? ticket.status,
        priority: args.priority ?? ticket.priority,
        assignedToEmail: args.assignedToEmail ?? ticket.assignedToEmail,
      }),
      timestamp: Date.now(),
    });

    return null;
  },
});
