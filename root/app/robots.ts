import type { MetadataRoute } from "next";
import { websiteUrl } from "@/lib/content";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${websiteUrl}/sitemap.xml`,
  };
}
