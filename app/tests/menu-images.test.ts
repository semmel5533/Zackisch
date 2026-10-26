import { describe, expect, it } from "vitest";
import { getMenuItemImageUrl } from "../lib/menu-images";

describe("merchant-owned menu imagery", () => {
  it.each(["Pizza Margherita", "Pasta", "Wasser", "Tiramisu", "Burrata"])(
    "does not invent an image for %s",
    (name) => {
      expect(getMenuItemImageUrl({ name })).toBeNull();
    },
  );
  it("preserves the merchant image instead of substituting stock", () => {
    expect(
      getMenuItemImageUrl({
        name: "Pizza",
        imageUrl: "https://example.test/actual-dish.webp",
        imageId: "file",
      }),
    ).toBe("https://example.test/actual-dish.webp");
  });
  it("resolves uploaded file references", () => {
    expect(getMenuItemImageUrl({ imageId: "uploaded-file" })).toBe(
      "/api/storage/uploaded-file",
    );
  });
  it("handles missing or empty media", () => {
    expect(getMenuItemImageUrl(null)).toBeNull();
    expect(getMenuItemImageUrl({ imageUrl: "  ", imageId: "" })).toBeNull();
  });
});
