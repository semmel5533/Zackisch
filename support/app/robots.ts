import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/de-de/tickets",
          "/de-de/tickets/",
          "/de-en/tickets",
          "/de-en/tickets/",
          "/tickets",
          "/tickets/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://support.zackisch.com/sitemap.xml",
  };
}
