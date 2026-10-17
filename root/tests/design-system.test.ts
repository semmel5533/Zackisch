import { describe, it, expect } from "vitest";
import {
  BRAND_ASSETS,
  MEDIA_ASSETS,
  getBrandAssetOrigin,
  resolveBrandAsset,
  resolveMediaAsset,
  getDefaultToastDuration,
  getRegionLanguageLabels,
  DEFAULT_REGIONS,
  DACH_REGIONS,
  DEFAULT_LANGUAGES,
  SEMANTIC_TOKENS,
  LAYOUT_TOKENS,
} from "@zackisch/design-system";

describe("@zackisch/design-system enterprise contract", () => {
  it("resolves local relative paths when site is root so zackisch.com never breaks on undeployed assets", () => {
    expect(getBrandAssetOrigin({ site: "root", env: "development" })).toBe("");
    expect(getBrandAssetOrigin({ site: "root", env: "production" })).toBe("");
    expect(resolveBrandAsset("combinationMarkSvg", { site: "root" })).toBe("/combination_mark.svg");
    expect(resolveMediaAsset("heroHospitality", { site: "root" })).toBe("/media/hero-hospitality.webp");
  });

  it("resolves localhost:3000 in development and zackisch.com in production for app, support, and internal", () => {
    expect(resolveBrandAsset("combinationMarkSvg", { site: "app", env: "development" })).toBe(
      "http://localhost:3000/combination_mark.svg"
    );
    expect(resolveBrandAsset("combinationMarkSvg", { site: "support", env: "production" })).toBe(
      "https://zackisch.com/combination_mark.svg"
    );
    expect(
      resolveMediaAsset("posCounter", {
        site: "internal",
        origin: "https://cdn-preview.zackisch.com/",
      })
    ).toBe("https://cdn-preview.zackisch.com/media/pos-counter.webp");
  });

  it("keeps canonical https://zackisch.com URLs in BRAND_ASSETS and MEDIA_ASSETS for OpenGraph metadata", () => {
    expect(BRAND_ASSETS.ogImage).toBe("https://zackisch.com/og_image.png");
    expect(MEDIA_ASSETS.heroHospitality).toBe("https://zackisch.com/media/hero-hospitality.webp");
  });

  it("enforces persistent duration (0ms) for error and warning toasts and 5000ms for info/success/neutral", () => {
    expect(getDefaultToastDuration("error")).toBe(0);
    expect(getDefaultToastDuration("warning")).toBe(0);
    expect(getDefaultToastDuration("success")).toBe(5000);
    expect(getDefaultToastDuration("info")).toBe(5000);
    expect(getDefaultToastDuration("neutral")).toBe(5000);
  });

  it("separates operating region from display language in RegionLanguageSelector defaults and labels", () => {
    expect(DEFAULT_REGIONS).toEqual([
      { code: "de", nativeName: "Deutschland", status: "active" },
    ]);
    expect(DACH_REGIONS.find((r) => r.code === "de")?.status).toBe("active");
    expect(DACH_REGIONS.find((r) => r.code === "at")?.status).toBe("planned");
    expect(DACH_REGIONS.find((r) => r.code === "ch")?.status).toBe("planned");
    expect(DEFAULT_LANGUAGES).toHaveLength(2);

    const deLabels = getRegionLanguageLabels("de-de");
    const enLabels = getRegionLanguageLabels("de-en");
    expect(deLabels.regionLegend).toBe("Geschäftsregion");
    expect(deLabels.languageLegend).toBe("Anzeigesprache");
    expect(enLabels.regionLegend).toBe("Operating Region");
    expect(enLabels.languageLegend).toBe("Display Language");
  });

  it("exposes monochrome semantic tokens and WCAG 2.2 minimum 44px touch target", () => {
    expect(SEMANTIC_TOKENS.action.primaryBg).toBe("#161616");
    expect(SEMANTIC_TOKENS.action.focusRing).toBe("#2359CE");
    expect(LAYOUT_TOKENS.touchTargetMin).toBe("44px");
    expect(LAYOUT_TOKENS.touchTargetComfort).toBe("48px");
  });
});
