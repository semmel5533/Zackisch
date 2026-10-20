import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { constructMetadata } from "../lib/seo";
import { PAGES_CONTENT } from "../lib/content/pages-data";
import { LEGAL_DOCS } from "../lib/content/legal-data";

describe("Routing & Proxy Behavior (Acceptance Test Matrix A)", () => {
  it("redirects GET / with de-DE accept-language to /de-de via 307", () => {
    const req = new NextRequest("https://zackisch.com/", {
      headers: { "accept-language": "de-DE,de;q=0.9,en;q=0.8" },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zackisch.com/de-de");
  });

  it("redirects GET / with en-US accept-language to /de-en via 307", () => {
    const req = new NextRequest("https://zackisch.com/", {
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zackisch.com/de-en");
  });

  it("redirects GET / without accept-language to /de-en as fallback", () => {
    const req = new NextRequest("https://zackisch.com/");
    const res = proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://zackisch.com/de-en");
  });

  it("passes through valid /de-de and /de-en paths without redirection", () => {
    const reqDe = new NextRequest("https://zackisch.com/de-de");
    const resDe = proxy(reqDe);
    expect(resDe.status).toBe(200);
    expect(resDe.headers.get("location")).toBeNull();

    const reqEn = new NextRequest("https://zackisch.com/de-en");
    const resEn = proxy(reqEn);
    expect(resEn.status).toBe(200);
    expect(resEn.headers.get("location")).toBeNull();
  });

  it("passes through unprefixed unknown routes like /nicht-existiert to render English root 404", () => {
    const req = new NextRequest("https://zackisch.com/nicht-existiert");
    const res = proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("bypasses static media and assets", () => {
    const reqFavicon = new NextRequest("https://zackisch.com/favicon.ico");
    expect(proxy(reqFavicon).status).toBe(200);

    const reqMedia = new NextRequest("https://zackisch.com/media/hero-hospitality.webp");
    expect(proxy(reqMedia).status).toBe(200);

    const reqBranding = new NextRequest("https://zackisch.com/branding/brand_mark.svg");
    expect(proxy(reqBranding).status).toBe(200);
  });
});

describe("SEO & Metadata (Acceptance Test Matrix F)", () => {
  it("enforces title suffix ' - Zackisch' and canonical URLs", () => {
    const meta = constructMetadata({
      title: "Preise & Gebühren",
      description: "Transparente 2% Zackisch Gebühr",
      path: "/pricing",
      locale: "de-de",
    });

    expect(meta.title).toBe("Preise & Gebühren - Zackisch");
    expect(meta.description).toBe("Transparente 2% Zackisch Gebühr");
    expect(meta.alternates?.canonical).toBe("https://zackisch.com/de-de/pricing");
    expect(meta.alternates?.languages?.["de-DE"]).toBe("https://zackisch.com/de-de/pricing");
    expect(meta.alternates?.languages?.["en-DE"]).toBe("https://zackisch.com/de-en/pricing");
    expect(meta.alternates?.languages?.["x-default"]).toBe("https://zackisch.com/de-de/pricing");
  });

  it("generates full sitemap with all valid routes in both locales and alternates", () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThanOrEqual(38); // 19 routes * 2 locales

    const deHome = entries.find((e) => e.url === "https://zackisch.com/de-de");
    expect(deHome).toBeDefined();
    expect(deHome?.priority).toBe(1.0);

    const enHome = entries.find((e) => e.url === "https://zackisch.com/de-en");
    expect(enHome).toBeDefined();
    expect(enHome?.priority).toBe(1.0);

    const legalNotice = entries.find((e) => e.url === "https://zackisch.com/de-de/legal-notice");
    expect(legalNotice).toBeDefined();
  });

  it("generates correct robots.txt directives pointing to sitemap.xml", () => {
    const r = robots();
    expect(r.sitemap).toBe("https://zackisch.com/sitemap.xml");
  });
});

describe("Content & Legal Integrity (Acceptance Test Matrix B & E)", () => {
  it("ensures all subpages exist in both de-de and de-en with consistent keys", () => {
    const deKeys = Object.keys(PAGES_CONTENT["de-de"]);
    const enKeys = Object.keys(PAGES_CONTENT["de-en"]);
    expect(deKeys).toEqual(enKeys);
    expect(deKeys).toContain("contact");
    expect(deKeys).toContain("pricing");
    expect(deKeys).toContain("calculator");
    expect(deKeys).toContain("smartMenu");
    expect(deKeys).toContain("staffDashboard");
  });

  it("ensures all legal documents exist in both de-de and de-en with required legal sections", () => {
    const deLegal = Object.keys(LEGAL_DOCS["de-de"]);
    const enLegal = Object.keys(LEGAL_DOCS["de-en"]);
    expect(deLegal).toEqual(enLegal);
    expect(deLegal).toContain("legal-notice");
    expect(deLegal).toContain("privacy");
    expect(deLegal).toContain("cookies");
    expect(deLegal).toContain("business-terms");
    expect(deLegal).toContain("guest-terms");
    expect(deLegal).toContain("payments");

    // Impressum contains § 5 DDG mandatory fields
    const impressum = LEGAL_DOCS["de-de"]["legal-notice"];
    expect(impressum.sections.some((s) => s.text.includes("Selim Eser"))).toBe(true);
    expect(impressum.sections.some((s) => s.text.includes("selim@zackisch.com"))).toBe(true);
  });
});
