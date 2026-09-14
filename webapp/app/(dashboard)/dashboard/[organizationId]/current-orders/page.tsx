import { getOrders, getOrganization } from "@/lib/convex/database";
import { CurrentOrdersContent } from "@/components/dashboard/current-orders-content";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.currentOrders,
  };
}

export default async function CurrentOrdersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const [orders, organization] = await Promise.all([
    getOrders(organizationId),
    getOrganization(organizationId),
  ]);

  if (!organization) return null;

  return (
    <CurrentOrdersContent
      orders={structuredClone(orders)}
      organizationId={organizationId}
    />
  );
}
