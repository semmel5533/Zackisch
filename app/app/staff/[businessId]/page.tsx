import {
  getOrders,
  getBusiness,
  getPublicRestaurant,
  getMenuCategories,
  getMenuItems,
} from "@/lib/convex/database";
import { convexServer } from "@/lib/convex/server";
import { api } from "@/convex/_generated/api";
import { StaffTerminalShell } from "@/components/staff/staff-terminal-shell";
import { cookies } from "next/headers";
import { LocalizedText } from "@/components/common/localized-text";
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
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ token?: string; tab?: string }>;
}) {
  const [{ businessId }, { token, tab }] = await Promise.all([
    params,
    searchParams,
  ]);
  const cookieStore = await cookies();
  const cookieName = `staff_session_${businessId}`;
  const cookieToken =
    cookieStore.get(cookieName)?.value ||
    cookieStore.get(`order_session_${businessId}`)?.value ||
    cookieStore.get(`availability_session_${businessId}`)?.value;

  const [business, ownerBusiness] = await Promise.all([
    getPublicRestaurant(businessId),
    getBusiness(businessId),
  ]);

  if (!business) {
    return (
      <div className="p-8 text-center">
        <LocalizedText tKey="businessNotFound" />
      </div>
    );
  }

  // Allow if owner is logged in
  const isOwner = Boolean(ownerBusiness);

  // Verification via query token or persistent session cookie
  const tokenToVerify = token || cookieToken;
  const isStaffSessionValid = tokenToVerify
    ? await convexServer.query(api.sessions.verifyTerminalSession, {
        businessId: businessId as any,
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
    getOrders(businessId),
    getMenuCategories(businessId),
    getMenuItems(businessId),
  ]);

  const validTab: "current-orders" | "all-orders" | "availability" =
    tab === "all-orders" || tab === "availability" ? tab : "current-orders";

  return (
    <StaffTerminalShell
      business={structuredClone(business)}
      initialOrders={structuredClone(initialOrders)}
      categories={structuredClone(categories)}
      items={structuredClone(items)}
      initialTab={validTab}
      token={tokenToVerify}
    />
  );
}
