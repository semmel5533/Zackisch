import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

export async function isOwner(
  ctx: QueryCtx,
  businessId: Id<"businesses">,
  sessionToken?: string,
) {
  let userId = await getAuthUserId(ctx);
  if (sessionToken) {
    const session = await ctx.db
      .query("verificationCodes")
      .withIndex("by_identifier", (q) =>
        q.eq("identifier", `session_${sessionToken}`),
      )
      .first();
    if (session && session.expires > Date.now()) {
      const user = await ctx.db.get(session.code as Id<"users">);
      if (user) userId = user._id;
    }
  }
  const business = await ctx.db.get(businessId);
  return !!userId && !!business && business.ownerId === userId;
}

export async function requireOwner(
  ctx: QueryCtx,
  businessId: Id<"businesses">,
  sessionToken?: string,
) {
  if (!(await isOwner(ctx, businessId, sessionToken)))
    throw new Error("Unauthorized");
}

export async function verifyTerminal(
  ctx: QueryCtx,
  businessId: Id<"businesses">,
  token: string,
  type: "orders" | "availability" | "staff",
) {
  const tables =
    type === "orders"
      ? (["orderSessions", "staffSessions"] as const)
      : type === "availability"
        ? (["availabilitySessions", "staffSessions"] as const)
        : (["staffSessions", "orderSessions", "availabilitySessions"] as const);
  for (const table of tables) {
    const session = await ctx.db
      .query(table)
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (
      session?.businessId === businessId &&
      (!session.expiresAt || Date.parse(session.expiresAt) > Date.now())
    )
      return true;
  }
  return false;
}

export async function requireOpsActor(
  ctx: { db: any },
  credentials: {
    sessionToken?: string;
  },
  options: {
    regionId?: string;
    requiredPermission?: string;
  } = {}
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

  if (options.regionId && admin.regionId.toLowerCase() !== options.regionId.toLowerCase()) {
    throw new Error("Kein Zugriff auf Daten außerhalb der zugewiesenen Region.");
  }

  if (options.requiredPermission && admin.role !== "regional_admin") {
    if (!admin.permissions || !admin.permissions.includes(options.requiredPermission)) {
      throw new Error(`Berechtigung '${options.requiredPermission}' fehlt.`);
    }
  }

  return admin;
}
