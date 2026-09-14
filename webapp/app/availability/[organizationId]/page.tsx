import { redirect } from "next/navigation";

export default async function AvailabilityPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ organizationId }, { token }] = await Promise.all([
    params,
    searchParams,
  ]);
  redirect(
    `/staff/${organizationId}?tab=availability${token ? `&token=${encodeURIComponent(token)}` : ""}`,
  );
}

