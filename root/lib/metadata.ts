import type { Metadata } from "next";
import { content, websiteUrl, type Locale } from "./content";
export function pageMetadata(
  locale: Locale,
  slug = "",
  title?: string,
  description?: string,
): Metadata {
  const suffix = slug ? `/${slug}` : "";
  const canonical = `${websiteUrl}/${locale}${suffix}`;
  const image = {
    url: `${websiteUrl}/brand/logo/social/wordmark--og--citron--1200x630.png`,
    width: 1200,
    height: 630,
    alt: locale === "de-de" ? "Zackisch: QR-Bestellung und Bezahlen für die Gastronomie" : "Zackisch: QR ordering and payments for hospitality",
  };
  return {
    title: `${title ?? content[locale].title.replace(/ [–—|] Zackisch$/, "")} | Zackisch`,
    description: description ?? content[locale].description,
    alternates: {
      canonical,
      languages: {
        "de-DE": `${websiteUrl}/de-de${suffix}`,
        "en-DE": `${websiteUrl}/de-en${suffix}`,
        "x-default": `${websiteUrl}/de-de${suffix}`,
      },
    },
    openGraph: {
      title: `${title ?? content[locale].title.replace(/ [–—|] Zackisch$/, "")} | Zackisch`,
      description: description ?? content[locale].description,
      url: canonical,
      siteName: "Zackisch",
      locale: locale === "de-de" ? "de_DE" : "en_DE",
      type: "website",
      alternateLocale: locale === "de-de" ? "en_DE" : "de_DE",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title ?? content[locale].title.replace(/ [–—|] Zackisch$/, "")} | Zackisch`,
      description: description ?? content[locale].description,
      images: [image],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}
