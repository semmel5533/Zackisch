import { CheckoutEntry } from "@/components/guest/checkout-entry";
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
