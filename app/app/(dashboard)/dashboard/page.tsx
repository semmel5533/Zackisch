import { redirect } from "next/navigation";
import { getUser } from "@/lib/convex/auth";
import { getBusinessByOwner } from "@/lib/convex/database";

export default async function DashboardRootPage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userId = user.$id ?? user._id;
  const business = await getBusinessByOwner(userId);

  if (business) {
    redirect(`/dashboard/${business.$id}/overview`);
  }

  redirect("/dashboard/new/overview");
}
