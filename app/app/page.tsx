import { redirect } from "next/navigation";
import { getUser } from "@/lib/convex/auth";
import { getBusinessByOwner } from "@/lib/convex/database";

export default async function HomePage() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const business = await getBusinessByOwner(user.$id);
  if (business) {
    redirect(`/dashboard/${business.$id}/overview`);
  }

  redirect("/sign-in");
}
