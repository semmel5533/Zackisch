import type { Metadata } from "next";
import { BRAND_ASSETS } from "../tokens/brand";

export type SiteTarget = "root" | "app" | "support" | "internal";

export interface SiteMetadataOptions {
  site: SiteTarget;
  title: string;
  description: string;
  pathname?: string;
  locale?: string;
  indexable?: boolean;
}

export const SITE_ORIGINS: Record<SiteTarget, string> = {
  root: "https://zackisch.com",
  app: "https://app.zackisch.com",
  support: "https://support.zackisch.com",
  internal: "https://internal.zackisch.com",
};

/**
 * Standardized site metadata helper enforcing consistent branding,
 * canonical URLs, root-hosted brand assets and indexing posture.
 */
export function createSiteMetadata({
  site,
  title,
  description,
  pathname = "",
  locale = "de-de",
  indexable,
}: SiteMetadataOptions): Metadata {
  const origin = SITE_ORIGINS[site];
  const isPublicSite = site === "root" || site === "support";
  const shouldIndex = indexable !== undefined ? indexable : isPublicSite;
  const canonicalUrl = `${origin}${pathname.startsWith("/") ? pathname : pathname ? `/${pathname}` : ""}`;
  const isDe = locale.toLowerCase().startsWith("de");

  return {
    metadataBase: new URL(origin),
    title: {
      default: title,
      template: "%s | Zackisch",
    },
    description,
    icons: {
      icon: BRAND_ASSETS.brandMark512,
      apple: BRAND_ASSETS.appleTouchIcon,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zackisch",
      images: [BRAND_ASSETS.ogImage],
      locale: isDe ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [BRAND_ASSETS.ogImage],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
      },
    },
  };
}
