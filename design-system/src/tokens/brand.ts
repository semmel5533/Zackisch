/**
 * Canonical Zackisch Brand Assets
 * Single authoritative source hosted on https://zackisch.com
 *
 * Resolution rules:
 * - On `root` (zackisch.com itself), assets resolve to local root paths (`/brand_mark.svg`, `/media/...`)
 *   so local dev and preview builds never fail when zackisch.com has not yet deployed a new asset.
 * - On `app`, `support`, and `internal`, assets resolve via `NEXT_PUBLIC_BRAND_ASSET_ORIGIN` if set,
 *   or `http://localhost:3000` in development (`NODE_ENV === "development"`),
 *   or `https://zackisch.com` in production.
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

export type BrandAssetKey = Exclude<keyof typeof BRAND_ASSETS, "canonicalOrigin">;

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

export type ZackischSiteId = "root" | "app" | "support" | "internal";

export interface AssetResolveOptions {
  /** Which application is requesting the asset. `root` resolves to local `/...` paths. */
  site?: ZackischSiteId;
  /** Optional explicit origin override (e.g. `http://localhost:3000` or `https://zackisch.com`). */
  origin?: string;
  /** Optional environment override (`development` | `production` | `test`). */
  env?: string;
}

function readEnvVar(name: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[name];
}

/**
 * Returns the base origin prefix for brand and media assets.
 * Returns `""` when `site === "root"` so root uses relative `/...` paths.
 */
export function getBrandAssetOrigin(options?: AssetResolveOptions): string {
  if (options?.site === "root") {
    return "";
  }
  const explicitOrigin =
    options?.origin ?? readEnvVar("NEXT_PUBLIC_BRAND_ASSET_ORIGIN");
  if (explicitOrigin && explicitOrigin.trim().length > 0) {
    return explicitOrigin.trim().replace(/\/+$/, "");
  }
  const env = options?.env ?? readEnvVar("NODE_ENV") ?? "production";
  if (env === "development") {
    return "http://localhost:3000";
  }
  return BRAND_ASSETS.canonicalOrigin;
}

function toRelativeAssetPath(canonicalUrl: string): string {
  return canonicalUrl.replace(/^https:\/\/zackisch\.com/, "");
}

/**
 * Resolves a canonical Zackisch brand asset URL for the current application and environment.
 */
export function resolveBrandAsset(
  key: BrandAssetKey,
  options?: AssetResolveOptions
): string {
  const path = toRelativeAssetPath(BRAND_ASSETS[key]);
  const origin = getBrandAssetOrigin(options);
  return `${origin}${path}`;
}

/**
 * Resolves a canonical Zackisch photography media asset URL for the current application and environment.
 */
export function resolveMediaAsset(
  key: MediaAssetKey,
  options?: AssetResolveOptions
): string {
  const path = toRelativeAssetPath(MEDIA_ASSETS[key]);
  const origin = getBrandAssetOrigin(options);
  return `${origin}${path}`;
}
