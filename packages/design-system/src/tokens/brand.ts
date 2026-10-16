/**
 * Canonical Zackisch Brand Assets
 * Single authoritative source hosted on https://zackisch.com
 * Per project specification: All applications use exact absolute HTTPS URLs
 * and must not duplicate binaries locally.
 */
export const BRAND_ASSETS = {
  canonicalOrigin: "https://zackisch.com",
  brandMarkSvg: "https://zackisch.com/brand_mark.svg",
  brandMarkPng: "https://zackisch.com/brand_mark.png",
  brandMark192: "https://zackisch.com/brand_mark_192.png",
  brandMark512: "https://zackisch.com/brand_mark_512.png",
  brandMark32: "https://zackisch.com/brand_mark_32.png",
  combinationMarkSvg: "https://zackisch.com/combination_mark.svg",
  combinationMarkPng: "https://zackisch.com/combination_mark.png",
  combinationMarkQr: "https://zackisch.com/combination_mark_qr.png",
  wordMarkSvg: "https://zackisch.com/word_mark.svg",
  ogImage: "https://zackisch.com/og_image.png",
  appleTouchIcon: "https://zackisch.com/apple-touch-icon.png",
  favicon: "https://zackisch.com/brand_mark_512.png",
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSETS;

/**
 * Centrally hosted authentic hospitality and documentary photography
 * Sourced from free commercial sources (Pexels) with verified license,
 * EXIF stripped, optimized as WebP/JPEG, and documented in register.csv.
 */
export const MEDIA_ASSETS = {
  heroHospitality: "https://zackisch.com/media/hero-hospitality.webp",
  heroHospitalityJpg: "https://zackisch.com/media/hero-hospitality.jpg",
  posCounter: "https://zackisch.com/media/pos-counter.webp",
  posCounterJpg: "https://zackisch.com/media/pos-counter.jpg",
  staffService: "https://zackisch.com/media/staff-service.webp",
  staffServiceJpg: "https://zackisch.com/media/staff-service.jpg",
  guestOrder: "https://zackisch.com/media/guest-order.webp",
  guestOrderJpg: "https://zackisch.com/media/guest-order.jpg",
  guestPhoneTable: "https://zackisch.com/media/guest-phone-table.webp",
  guestPhoneTableJpg: "https://zackisch.com/media/guest-phone-table.jpg",
  restaurantInterior: "https://zackisch.com/media/restaurant-interior.webp",
  restaurantInteriorJpg: "https://zackisch.com/media/restaurant-interior.jpg",
  foodPlated: "https://zackisch.com/media/food-plated.webp",
  foodPlatedJpg: "https://zackisch.com/media/food-plated.jpg",
  foodCoffee: "https://zackisch.com/media/food-coffee.webp",
  foodCoffeeJpg: "https://zackisch.com/media/food-coffee.jpg",
} as const;

export type MediaAssetKey = keyof typeof MEDIA_ASSETS;
