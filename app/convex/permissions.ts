import { getAuthUserId } from "@convex-dev/auth/server";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

export async function isOwner(
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
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
  const org = await ctx.db.get(organizationId);
  return !!userId && !!org && org.ownerId === userId;
}

export async function requireOwner(
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
  sessionToken?: string,
) {
  if (!(await isOwner(ctx, organizationId, sessionToken)))
    throw new Error("Unauthorized");
}

export async function verifyTerminal(
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
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
      session?.organizationId === organizationId &&
      (!session.expiresAt || Date.parse(session.expiresAt) > Date.now())
    )
      return true;
  }
  return false;
}
