import { getImagePreviewUrl } from "./convex/client";

/**
 * Returns a high-resolution, verified image URL for a menu item.
 * Supports uploaded Convex storage files, explicit URLs, and curated fallback photography.
 */
export function getMenuItemImageUrl(item?: {
  imageUrl?: string | null;
  imageId?: string | null;
  name?: string;
  categoryId?: string;
} | null): string | null {
  if (!item) return null;

  if (item.imageUrl && item.imageUrl.trim() !== "") {
    return item.imageUrl;
  }
  if (item.imageId && item.imageId.trim() !== "") {
    return getImagePreviewUrl(item.imageId);
  }

  const name = (item.name || "").toLowerCase();

  // Curated, verified local hospitality photography assets
  if (name.includes("margherita") || name.includes("diavola") || name.includes("pizza") || name.includes("wunsch")) {
    return "/pizza.webp";
  }
  if (name.includes("pasta") || name.includes("carbonara") || name.includes("penne") || name.includes("arrabbiata") || name.includes("spaghetti")) {
    return "/pasta.webp";
  }
  if (name.includes("limonade") || name.includes("pellegrino") || name.includes("getränk") || name.includes("drink") || name.includes("wasser") || name.includes("lemonade")) {
    return "/lemonade.webp";
  }
  if (name.includes("tiramisu") || name.includes("dessert") || name.includes("panna") || name.includes("süß")) {
    return "/tiramisu.webp";
  }
  if (name.includes("burrata") || name.includes("vorspeise") || name.includes("salat")) {
    return "/burrata.webp";
  }

  return null;
}
