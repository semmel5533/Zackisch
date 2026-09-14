import { redirect } from "next/navigation";

export default async function LiveOrdersRedirectPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  redirect(`/dashboard/${organizationId}/current-orders`);
}
