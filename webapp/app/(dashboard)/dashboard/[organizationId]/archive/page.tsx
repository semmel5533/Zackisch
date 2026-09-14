import { redirect } from "next/navigation";

export default async function ArchiveRedirectPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  redirect(`/dashboard/${organizationId}/all-orders`);
}
