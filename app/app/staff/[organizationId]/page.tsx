import {
  getOrders,
  getOrganization,
  getMenuCategories,
  getMenuItems,
} from "@/lib/convex/database";
import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { getUser } from "@/lib/convex/auth";
import { StaffTerminalShell } from "@/components/staff/staff-terminal-shell";
import { cookies } from "next/headers";
import { LocalizedText } from "@/components/ui/localized-text";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.staffSession,
  };
}

export default async function StaffTerminalPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<{ token?: string; tab?: string }>;
}) {
  const [{ organizationId }, { token, tab }] = await Promise.all([
    params,
    searchParams,
  ]);
  const cookieStore = await cookies();
  const cookieName = `staff_session_${organizationId}`;
  const cookieToken =
    cookieStore.get(cookieName)?.value ||
    cookieStore.get(`order_session_${organizationId}`)?.value ||
    cookieStore.get(`availability_session_${organizationId}`)?.value;

  const [organization, user] = await Promise.all([
    getOrganization(organizationId),
    getUser(),
  ]);

  if (!organization) {
    return (
      <div className="p-8 text-center">
        <LocalizedText tKey="orgNotFound" />
      </div>
    );
  }

  // Allow if owner is logged in
  const isOwner = Boolean(
    user &&
    (user._id === organization.ownerId || user.$id === organization.ownerId),
  );

  // Verification via query token or persistent session cookie
  const tokenToVerify = token || cookieToken;
  const isStaffSessionValid = tokenToVerify
    ? await convexServer.query(api.sessions.verifyTerminalSession, {
        organizationId: organizationId as any,
        token: tokenToVerify,
        type: "staff",
      })
    : false;
  const isValidSession = isOwner || isStaffSessionValid;

  if (!isValidSession) {
    if (!tokenToVerify && !isOwner) {
      return (
        <LocalizedText
          tKey="noToken"
          className="p-8 text-center text-destructive font-bold"
          as="div"
        />
      );
    }

    return (
      <LocalizedText
        tKey="invalidToken"
        className="p-8 text-center text-destructive font-bold"
        as="div"
      />
    );
  }

  const [initialOrders, categories, items] = await Promise.all([
    getOrders(organizationId),
    getMenuCategories(organizationId),
    getMenuItems(organizationId),
  ]);

  const validTab: "current-orders" | "all-orders" | "availability" =
    tab === "all-orders" || tab === "availability" ? tab : "current-orders";

  return (
    <StaffTerminalShell
      organization={structuredClone(organization)}
      initialOrders={structuredClone(initialOrders)}
      categories={structuredClone(categories)}
      items={structuredClone(items)}
      initialTab={validTab}
      token={tokenToVerify}
    />
  );
}
