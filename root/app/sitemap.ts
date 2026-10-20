import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zackisch.com";
  const locales = ["de-de", "de-en"];
  const paths = [
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

  const entries: MetadataRoute.Sitemap = [];

  for (const p of paths) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}${p}`,
        lastModified: new Date("2026-10-20T00:00:00.000Z"),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1.0 : p.startsWith("/product") || p === "/pricing" ? 0.9 : 0.7,
        alternates: {
          languages: {
            "de-DE": `${baseUrl}/de-de${p}`,
            "en-DE": `${baseUrl}/de-en${p}`,
            "x-default": `${baseUrl}/de-de${p}`,
          },
        },
      });
    }
  }

  return entries;
}
