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

export async function requireOwner(businessId: string) {
  const user = await getUser();
  if (!user) {
    throw new Error("Nicht authentifiziert.");
  }

  const business = await (await getAuthenticatedConvexClient()).query(api.businesses.get, {
    id: businessId as any,
    ...(await getOwnerCredentials()),
  });

  if (!business) {
    throw new Error("Betrieb nicht gefunden.");
  }

  const ownerId = String(business.ownerId);
  const userId = String(user._id || user.$id);

  if (ownerId !== userId) {
    throw new Error(
      "Nicht autorisiert: Du bist nicht der Inhaber dieses Betriebs.",
    );
  }

  return { user, business, org: business };
}

export async function getOwnerCredentials() {
  return { sessionToken: (await cookies()).get(SESSION_COOKIE_NAME)?.value };
}

async function requireTerminalOrOwner(
  businessId: string,
  type: "orders" | "availability",
) {
  const user = await getUser();
  if (user) {
    try {
      const business = await (await getAuthenticatedConvexClient()).query(api.businesses.get, {
        id: businessId as any,
        ...(await getOwnerCredentials()),
      });
      if (business) return { type: "owner" as const, user, business, org: business };
    } catch {
      // An authenticated non-owner may still hold a separately scoped terminal session.
    }
  }
  const cookieStore = await cookies();
  for (const name of [
    `staff_session_${businessId}`,
    `${type === "orders" ? "order" : "availability"}_session_${businessId}`,
  ]) {
    const token = cookieStore.get(name)?.value;
    if (
      token &&
      (await convexServer.query(api.sessions.verifyTerminalSession, {
        businessId: businessId as any,
        token,
        type,
      }))
    ) {
      return { type: "staff" as const };
    }
  }
  throw new Error("Nicht autorisiert: Keine gültige Personal-Sitzung.");
}

export async function requireKitchenOrOwner(businessId: string) {
  return requireTerminalOrOwner(businessId, "orders");
}

export async function requireStaffOrOwner(businessId: string) {
  return requireTerminalOrOwner(businessId, "availability");
}
