import { notFound } from "next/navigation";
import { getPublicRestaurant } from "@/lib/convex/database";
import { GuestCheckout } from "./guest-checkout";
export async function CheckoutEntry({
  businessId,
  type,
  table,
}: {
  businessId: string;
  type: "dine-in" | "takeaway";
  table?: string | string[];
}) {
  const business = await getPublicRestaurant(businessId);
  if (!business) notFound();
  const modeEnabled =
    type === "dine-in"
      ? business.isToStayEnabled !== false
      : business.isToGoEnabled !== false;
  return (
    <GuestCheckout
      business={{ ...business, canOrder: business.canOrder && modeEnabled }}
      type={type}
      tableNumber={
        type === "dine-in" && typeof table === "string"
          ? table.trim().slice(0, 4)
          : undefined
      }
    />
  );
}
