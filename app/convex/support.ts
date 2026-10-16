import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
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
  credentials: {
    sessionToken?: string;
    adminEmail?: string;
    actorEmail?: string;
  },
  regionId: string,
  requiredPermission: "tickets:read" | "tickets:write" | "tickets:note"
): Promise<Doc<"adminUsers">> {
  const token = credentials.sessionToken?.trim();
  if (!token) {
    throw new Error("Authentifizierung erforderlich: Kein Team-Sitzungstoken angegeben.");
  }

  const session = await ctx.db
    .query("verificationCodes")
    .withIndex("by_identifier", (q: any) => q.eq("identifier", token))
    .first();

  if (!session || Date.now() > session.expires) {
    throw new Error("Sitzung ist abgelaufen oder ungültig. Bitte erneut anmelden.");
  }

  const admin = (await ctx.db.get(session.code as Id<"adminUsers">)) as (Doc<"adminUsers"> | null);
  if (!admin || !admin.isActive) {
    throw new Error("Kein aktives Team-Dashboard-Konto.");
  }

  if (admin.role !== "regional_admin") {
    if (admin.regionId !== regionId) {
      throw new Error("Kein Zugriff auf Tickets außerhalb der zugewiesenen Region.");
    }
    if (!admin.permissions.includes(requiredPermission)) {
      throw new Error(`Berechtigung '${requiredPermission}' fehlt.`);
    }
  }

  return admin;
}

async function getVerifiedCustomerIdentity(
  ctx: { db: any; auth: any },
  sessionToken?: string
): Promise<{
  userId?: string;
  email: string;
  name?: string;
  businessId?: Id<"businesses">;
  businessName?: string;
  regionId: string;
} | null> {
  const userId = await getAuthUserId(ctx as any);
  if (userId) {
    const user: any = await ctx.db.get(userId);
    if (user) {
      const email = (user.email || "").toLowerCase();
      const org = await ctx.db
        .query("businesses")
        .withIndex("by_ownerId", (q: any) => q.eq("ownerId", userId))
        .first();
      return {
        userId: String(userId),
        email,
        name: user.name || org?.name,
        businessId: org?._id,
        businessName: org?.name,
        regionId: org?.region || "de",
      };
    }
  }

  if (sessionToken && sessionToken.trim().length > 0) {
    const session = await ctx.db
      .query("supportSessions")
      .withIndex("by_token", (q: any) => q.eq("token", sessionToken.trim()))
      .first();
    if (session && Date.now() <= session.expiresAt) {
      return {
        userId: session.userId,
        email: session.email.toLowerCase(),
        name: session.name,
        businessId: session.businessId,
        businessName: session.businessName,
        regionId: session.regionId,
      };
    }
  }

  return null;
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
      sessionToken: v.string(),
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

    const sessionBytes = new Uint8Array(24);
    crypto.getRandomValues(sessionBytes);
    const sessionToken = Array.from(sessionBytes, (b) =>
      b.toString(16).padStart(2, "0")
    ).join("");
    const sessionExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

    await ctx.db.insert("supportSessions", {
      token: sessionToken,
      userId: row.userId,
      businessId: row.businessId,
      businessName: row.businessName,
      email: row.email,
      name: row.name,
      regionId: row.regionId,
      expiresAt: sessionExpiresAt,
    });

    return {
      sessionToken,
      userId: row.userId,
      email: row.email,
      name: row.name,
      businessId: row.businessId,
      businessName: row.businessName,
      regionId: row.regionId,
    };
  },
});

export const verifySupportSession = query({
  args: {
    sessionToken: v.string(),
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
    if (!args.sessionToken || args.sessionToken.trim().length === 0) return null;
    const session = await ctx.db
      .query("supportSessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken.trim()))
      .first();
    if (!session || Date.now() > session.expiresAt) {
      return null;
    }
    return {
      userId: session.userId,
      email: session.email,
      name: session.name,
      businessId: session.businessId,
      businessName: session.businessName,
      regionId: session.regionId,
    };
  },
});

export const createTicket = mutation({
  args: {
    sessionToken: v.optional(v.string()),
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

    const identity = await getVerifiedCustomerIdentity(ctx, args.sessionToken);

    let verifiedEmail = cleanEmail;
    let verifiedName = cleanName;
    let boundBusinessId = undefined;
    let boundBusinessName = undefined;
    let regionId = "de";
    let requesterUserId = undefined;

    if (identity) {
      verifiedEmail = identity.email;
      verifiedName = identity.name || cleanName;
      boundBusinessId = identity.businessId;
      boundBusinessName = identity.businessName;
      regionId = identity.regionId || "de";
      requesterUserId = identity.userId;
    }

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
      businessId: boundBusinessId,
      businessName: boundBusinessName,
      requesterUserId,
      requesterEmail: verifiedEmail,
      requesterName: verifiedName || verifiedEmail,
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
      authorId: requesterUserId || verifiedEmail,
      authorName: verifiedName || verifiedEmail,
      visibility: "public",
      body: cleanBody,
      createdAt: now,
    });

    await ctx.db.insert("emailLogs", {
      recipient: verifiedEmail,
      type: "support_ticket",
      subject: `[${ticketNumber}] Support-Anfrage eingegangen: ${cleanSubject}`,
      status: "sent",
      regionId,
      timestamp: now,
    });

    await ctx.db.insert("auditLogs", {
      actorId: requesterUserId || verifiedEmail,
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
    sessionToken: v.optional(v.string()),
    requesterEmail: v.optional(v.string()),
    businessId: v.optional(v.id("businesses")),
  },
  returns: v.array(ticketObjectValidator),
  handler: async (ctx, args) => {
    const identity = await getVerifiedCustomerIdentity(ctx, args.sessionToken);
    if (!identity) {
      return [];
    }

    if (identity.businessId) {
      const byOrg = await ctx.db
        .query("supportTickets")
        .withIndex("by_businessId", (q) =>
          q.eq("businessId", identity.businessId!)
        )
        .order("desc")
        .collect();
      if (byOrg.length > 0) return byOrg;
    }

    return await ctx.db
      .query("supportTickets")
      .withIndex("by_requesterEmail", (q) => q.eq("requesterEmail", identity.email))
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
    sessionToken: v.optional(v.string()),
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
    const identity = await getVerifiedCustomerIdentity(ctx, args.sessionToken);
    if (!identity) {
      return null;
    }

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) return null;

    let authorized = false;
    if (identity.userId && ticket.requesterUserId === identity.userId) {
      authorized = true;
    } else if (identity.businessId && ticket.businessId === identity.businessId) {
      authorized = true;
    } else if (ticket.requesterEmail.toLowerCase() === identity.email.toLowerCase()) {
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
    sessionToken: v.optional(v.string()),
    requesterEmail: v.optional(v.string()),
    requesterName: v.optional(v.string()),
    body: v.string(),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const identity = await getVerifiedCustomerIdentity(ctx, args.sessionToken);
    if (!identity) {
      throw new Error("Authentifizierung erforderlich, um auf dieses Support-Ticket zu antworten.");
    }

    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) throw new Error("Ticket nicht gefunden.");

    let authorized = false;
    if (identity.userId && ticket.requesterUserId === identity.userId) {
      authorized = true;
    } else if (identity.businessId && ticket.businessId === identity.businessId) {
      authorized = true;
    } else if (ticket.requesterEmail.toLowerCase() === identity.email.toLowerCase()) {
      authorized = true;
    }

    if (!authorized) {
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
      authorId: identity.userId || identity.email,
      authorName: identity.name || args.requesterName?.trim() || ticket.requesterName,
      visibility: "public",
      body: cleanBody,
      createdAt: now,
    });

    await ctx.db.patch(args.ticketId, {
      status: "open",
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
    sessionToken: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    regionId: v.string(),
    status: v.optional(ticketStatusValidator),
  },
  returns: v.array(ticketObjectValidator),
  handler: async (ctx, args) => {
    await requireTeamPermission(
      ctx,
      {
        sessionToken: args.sessionToken,
        adminEmail: args.adminEmail,
        actorEmail: args.actorEmail,
      },
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
    sessionToken: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
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
      {
        sessionToken: args.sessionToken,
        adminEmail: args.adminEmail,
        actorEmail: args.actorEmail,
      },
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
    sessionToken: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
    body: v.string(),
    nextStatus: v.optional(ticketStatusValidator),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const admin = await requireTeamPermission(
      ctx,
      {
        sessionToken: args.sessionToken,
        adminEmail: args.adminEmail,
        actorEmail: args.actorEmail,
      },
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
    sessionToken: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
    regionId: v.string(),
    ticketId: v.id("supportTickets"),
    body: v.string(),
  },
  returns: v.id("supportMessages"),
  handler: async (ctx, args) => {
    const admin = await requireTeamPermission(
      ctx,
      {
        sessionToken: args.sessionToken,
        adminEmail: args.adminEmail,
        actorEmail: args.actorEmail,
      },
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
    sessionToken: v.optional(v.string()),
    adminEmail: v.optional(v.string()),
    actorEmail: v.optional(v.string()),
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
      {
        sessionToken: args.sessionToken,
        adminEmail: args.adminEmail,
        actorEmail: args.actorEmail,
      },
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

// Backward-compatible named aliases matching internal app tickets page contract
export const listTicketsForTeam = getTeamTickets;
export const getTicketForTeam = getTeamTicketThread;
