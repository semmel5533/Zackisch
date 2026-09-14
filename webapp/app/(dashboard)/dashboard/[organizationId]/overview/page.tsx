import {
  getOrganization,
  getOrders,
  getStaffSessions,
  createStaffSession,
} from "@/lib/convex/database";
import { getUser } from "@/lib/convex/auth";
import { OverviewContent } from "@/components/dashboard/overview-content";
import { StaffSessionCard } from "@/components/dashboard/staff-session-card";
import { headers, cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.overview,
  };
}

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const [organization, orders, staffSessions] = await Promise.all([
    getOrganization(organizationId),
    getOrders(organizationId),
    getStaffSessions(organizationId),
  ]);

  if (!organization) return null;

  let staffToken = staffSessions[0]?.token;

  if (!staffToken) {
    const newSession = await createStaffSession(
      organizationId,
      organization.ownerId,
    );
    staffToken = newSession.token;
  }

  const headersList = await headers();
  const host = headersList.get("host") || "";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <OverviewContent
      organization={structuredClone(organization)}
      orders={structuredClone(orders)}
    >
      {staffToken && (
        <StaffSessionCard
          staffToken={staffToken}
          organizationId={organizationId}
          baseUrl={baseUrl}
        />
      )}
    </OverviewContent>
  );
}
