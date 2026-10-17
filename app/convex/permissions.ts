import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

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

export type OpsPermission =
  | "restaurants:read"
  | "restaurants:write"
  | "orders:read"
  | "orders:write"
  | "tickets:read"
  | "tickets:write"
  | "tickets:note"
  | "newsletter:read"
  | "newsletter:write"
  | "newsletter:send"
  | "partners:read"
  | "partners:write"
  | "audit:read"
  | "staff:read"
  | "staff:manage"
  | "emails:read";

export async function requireOpsActor(
  ctx: { db: any },
  sessionToken: string | undefined,
  requiredPermission?: OpsPermission | string,
  targetRegion?: string
) {
  const token = sessionToken?.trim();
  if (!token) {
    throw new Error("UNAUTHORIZED: Administrator-Session-Token ist erforderlich.");
  }

  const session = await ctx.db
    .query("verificationCodes")
    .withIndex("by_identifier", (q: any) => q.eq("identifier", token))
    .first();

  if (!session || Date.now() > session.expires) {
    throw new Error("UNAUTHORIZED: Ungültiges oder abgelaufenes Administrator-Session-Token.");
  }

  const admin = await ctx.db.get(session.code as Id<"adminUsers">);
  if (!admin || !admin.isActive) {
    throw new Error("UNAUTHORIZED: Administrator-Account existiert nicht oder ist deaktiviert.");
  }

  // Region enforcement:
  // A regional_admin is strictly bound to their assigned regionId.
  if (targetRegion && admin.role === "regional_admin") {
    if (admin.regionId.toLowerCase() !== targetRegion.toLowerCase()) {
      throw new Error(
        `FORBIDDEN: Regionaler Administrator von '${admin.regionId}' hat keinen Zugriff auf Region '${targetRegion}'.`
      );
    }
  }

  // Permission enforcement
  if (requiredPermission) {
    if (!admin.permissions || !admin.permissions.includes(requiredPermission)) {
      throw new Error(`FORBIDDEN: Fehlende Berechtigung '${requiredPermission}'.`);
    }
  }

  return admin;
}
