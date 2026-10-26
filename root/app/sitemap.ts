import type { MetadataRoute } from "next";
import { locales, pageSlugs, websiteUrl } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...pageSlugs].flatMap((slug) =>
    locales.map((locale) => {
      const suffix = slug ? `/${slug}` : "";
      return {
        url: `${websiteUrl}/${locale}${suffix}`,
        alternates: {
          languages: {
            "de-DE": `${websiteUrl}/de-de${suffix}`,
            "en-DE": `${websiteUrl}/de-en${suffix}`,
          },
        },
      };
    }),
  );
}
