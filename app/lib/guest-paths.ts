export function guestMenuPath(
  businessId: string,
  type: "dine-in" | "takeaway",
  tableNumber?: string,
) {
  const path = `/${type === "dine-in" ? "table" : "pickup"}/${encodeURIComponent(businessId)}`;
  return type === "dine-in" && tableNumber
    ? `${path}?${new URLSearchParams({ table: tableNumber })}`
    : path;
}
export function guestCheckoutPath(
  businessId: string,
  type: "dine-in" | "takeaway",
  tableNumber?: string,
) {
  const path = guestMenuPath(businessId, type, tableNumber);
  const [base, query] = path.split("?");
  return `${base}/checkout${query ? `?${query}` : ""}`;
}
