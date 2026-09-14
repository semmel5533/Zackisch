import {
  getOrders,
  getOrganization,
  getStaffSessions,
  getOrderSessions,
  getAvailabilitySessions,
  getMenuCategories,
  getMenuItems,
} from "@/lib/convex/database";
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
    title: dict.staffTerminal || "Personal-Terminal",
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

  const [
    organization,
    sessions,
    legacyOrderSessions,
    legacyAvailSessions,
    initialOrders,
    categories,
    items,
    user,
  ] = await Promise.all([
    getOrganization(organizationId),
    getStaffSessions(organizationId),
    getOrderSessions(organizationId),
    getAvailabilitySessions(organizationId),
    getOrders(organizationId),
    getMenuCategories(organizationId),
    getMenuItems(organizationId),
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
  const isStaffSessionValid = Boolean(
    tokenToVerify && sessions.some((s) => s.token === tokenToVerify),
  );
  const isLegacyOrderValid = Boolean(
    tokenToVerify && legacyOrderSessions.some((s) => s.token === tokenToVerify),
  );
  const isLegacyAvailValid = Boolean(
    tokenToVerify && legacyAvailSessions.some((s) => s.token === tokenToVerify),
  );

  const isValidSession =
    isOwner ||
    isStaffSessionValid ||
    isLegacyOrderValid ||
    isLegacyAvailValid;

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

  // Persist session token into cookie if passed in URL
  if (token && (isStaffSessionValid || isLegacyOrderValid || isLegacyAvailValid)) {
    try {
      cookieStore.set(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 365 * 24 * 60 * 60, // 1 year permanent terminal pairing
      });
    } catch {
      // Ignore in read-only cookie contexts
    }
  }

  const validTab: "current-orders" | "all-orders" | "availability" =
    tab === "all-orders" || tab === "availability"
      ? tab
      : "current-orders";

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
