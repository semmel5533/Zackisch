import { ConvexHttpClient } from "convex/browser";
import { convexServer } from "./server";
import { api } from "@/convex/_generated/api";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/constants";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      const user = await convexServer.query(api.authQueries.getUserBySession, {
        sessionToken,
      });
      if (user) {
        return {
          ...user,
          $id: user._id,
          $createdAt: new Date(user._creationTime).toISOString(),
        };
      }
    }

    // Fallback to Convex Auth Nextjs JWT token
    const token = await convexAuthNextjsToken();
    if (token) {
      const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      client.setAuth(token);
      const user = await client.query(api.users.currentUser, {});
      if (user) {
        return {
          ...user,
          $id: user._id,
          $createdAt: new Date(user._creationTime).toISOString(),
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAuthenticatedConvexClient() {
  const token = await convexAuthNextjsToken();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  if (token) {
    client.setAuth(token);
  }
  return client;
}

export async function requireOwner(organizationId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Nicht authentifiziert.");
  }

  const org = await convexServer.query(api.organizations.get, {
    id: organizationId as any,
  });

  if (!org) {
    throw new Error("Betrieb nicht gefunden.");
  }

  const ownerId = String(org.ownerId);
  const userId = String(user._id || user.$id);

  if (ownerId !== userId) {
    throw new Error(
      "Nicht autorisiert: Du bist nicht der Inhaber dieses Betriebs.",
    );
  }

  return { user, org };
}

export async function getOwnerCredentials() {
  return { sessionToken: (await cookies()).get(SESSION_COOKIE_NAME)?.value };
}

async function requireTerminalOrOwner(
  organizationId: string,
  type: "orders" | "availability",
) {
  const user = await getUser();
  if (user) {
    const org = await convexServer.query(api.organizations.get, {
      id: organizationId as any,
    });
    if (org?.ownerId === user._id) return { type: "owner" as const, user, org };
  }
  const cookieStore = await cookies();
  for (const name of [
    `staff_session_${organizationId}`,
    `${type === "orders" ? "order" : "availability"}_session_${organizationId}`,
  ]) {
    const token = cookieStore.get(name)?.value;
    if (
      token &&
      (await convexServer.query(api.sessions.verifyTerminalSession, {
        organizationId: organizationId as any,
        token,
        type,
      }))
    ) {
      return { type: "staff" as const };
    }
  }
  throw new Error("Nicht autorisiert: Keine gültige Personal-Sitzung.");
}

export async function requireKitchenOrOwner(organizationId: string) {
  return requireTerminalOrOwner(organizationId, "orders");
}

export async function requireStaffOrOwner(organizationId: string) {
  return requireTerminalOrOwner(organizationId, "availability");
}
