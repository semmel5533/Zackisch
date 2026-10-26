import { getImagePreviewUrl } from "./convex/client";

/**
 * Returns the merchant-provided image reference for a menu item.
 * Without a merchant image, render a text-only row rather than inventing a dish photo.
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

  return null;
}
