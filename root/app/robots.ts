import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  // No public indexing until the legal/publication gate is approved.
  return { rules: { userAgent: "*", disallow: "/" } };
}
