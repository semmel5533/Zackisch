import type { MetadataRoute } from "next";
import { SUPPORT_ARTICLES, SUPPORT_CATEGORIES } from "../lib/knowledge-base";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://support.zackisch.com";
  const locales = ["de-de", "de-en"];
  const entries: MetadataRoute.Sitemap = [];

  // 1. Homepage per locale
  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      changeFrequency: "weekly",
      priority: 1.0,
    });
  }

  // 2. Categories per locale
  for (const locale of locales) {
    for (const cat of SUPPORT_CATEGORIES) {
      entries.push({
        url: `${baseUrl}/${locale}/categories/${cat.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // 3. Articles per locale
  for (const locale of locales) {
    for (const art of SUPPORT_ARTICLES) {
      entries.push({
        url: `${baseUrl}/${locale}/articles/${art.slug}`,
        changeFrequency: "monthly",
        priority: art.featured ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
