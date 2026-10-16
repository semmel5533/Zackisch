import { getOrders } from "@/lib/convex/database";
import { AllOrdersContent } from "@/components/dashboard/all-orders-content";
import { cookies } from "next/headers";
import { translations, Locale } from "@/lib/translations";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "de";
  const dict = translations[locale] || translations.de;
  return {
    title: dict.allOrders,
  };
}

export default async function AllOrdersPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const orders = await getOrders(organizationId);

  return (
    <AllOrdersContent
      orders={structuredClone(orders)}
      organizationId={organizationId}
    />
  );
}
