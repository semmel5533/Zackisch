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
