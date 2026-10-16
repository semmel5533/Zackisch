import { redirect } from "next/navigation";
import { getUser } from "@/lib/convex/auth";
import { getBusiness } from "@/lib/convex/database";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { businessId } = await params;
  let business = null;

  if (businessId !== "new") {
    business = await getBusiness(businessId);

    if (!business) {
      redirect("/sign-in");
    }

    // Verify ownership
    if (business.ownerId !== user.$id && business.ownerId !== user._id) {
      redirect("/sign-in");
    }
  }

  return (
    <DashboardShell
      business={business ? structuredClone(business) : null}
      user={structuredClone(user)}
    >
      {children}
    </DashboardShell>
  );
}
