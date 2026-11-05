import { cookies } from "next/headers";
import { translations } from "@/lib/translations";
import { CheckoutEntry } from "@/components/guest/checkout-entry";
export async function generateMetadata() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value === "en" ? "en" : "de";
  return { title: translations[locale].checkout };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ table?: string | string[] }>;
}) {
  const [{ businessId }, { table }] = await Promise.all([params, searchParams]);
  return <CheckoutEntry businessId={businessId} type="dine-in" table={table} />;
}
