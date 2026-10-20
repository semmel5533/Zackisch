import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:3000";

describe("Strict Technical Compliance (Acceptance Matrix C, D, G)", () => {
  it("contains ZERO convex dependencies or imports in root bundle", () => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
    );
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    expect(deps["convex"]).toBeUndefined();
    expect(deps["@convex-dev/react"]).toBeUndefined();
  });

  it("contains ZERO stripe runtime SDK dependencies in root bundle", () => {
    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")
    );
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
    expect(deps["@stripe/stripe-js"]).toBeUndefined();
    expect(deps["stripe"]).toBeUndefined();
  });

  it("verifies that all media files declared in MEDIA_LICENSES exist on disk", () => {
    const publicMediaDir = path.resolve(__dirname, "../public/media");
    const requiredImages = [
      "hero-hospitality.webp",
      "guest-phone-table.webp",
      "staff-service.webp",
      "restaurant-interior.webp",
      "pos-counter.webp",
      "food-coffee.webp",
      "food-plated.webp",
    ];

    for (const img of requiredImages) {
      expect(fs.existsSync(path.join(publicMediaDir, img))).toBe(true);
    }

    const brandingDir = path.resolve(__dirname, "../public/branding");
    expect(fs.existsSync(path.join(brandingDir, "brand_mark.svg"))).toBe(true);
    expect(fs.existsSync(path.join(brandingDir, "combination_mark.svg"))).toBe(true);
    expect(fs.existsSync(path.join(brandingDir, "word_mark.svg"))).toBe(true);

    const founderDir = path.resolve(__dirname, "../public/founder");
    expect(fs.existsSync(path.join(founderDir, "selim_full.png"))).toBe(true);
  });
});

describe("Live Server HTTP Route Integrity (All 18 bilingual pages)", () => {
  const routes = [
    "",
    "/product",
    "/product/smart-menu",
    "/product/staff-dashboard",
    "/solutions/restaurants-bars",
    "/solutions/cafes-bakeries",
    "/solutions/quick-service",
    "/solutions/pickup",
    "/pricing",
    "/potential-calculator",
    "/research",
    "/about",
    "/contact",
    "/legal-notice",
    "/privacy",
    "/cookies",
    "/legal/business-terms",
    "/legal/guest-terms",
    "/legal/payments",
  ];

  for (const r of routes) {
    it(`renders /de-de${r} with 200 and title ending in ' - Zackisch'`, async () => {
      const res = await fetch(`${BASE_URL}/de-de${r}`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain("<title>");
      expect(text).toContain(" - Zackisch</title>");
    });

    it(`renders /de-en${r} with 200 and title ending in ' - Zackisch'`, async () => {
      const res = await fetch(`${BASE_URL}/de-en${r}`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain("<title>");
      expect(text).toContain(" - Zackisch</title>");
    });
  }
});
