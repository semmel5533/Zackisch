import type { Metadata } from "next";
import { content, websiteUrl, type Locale } from "./content";

const MAX_SOCIAL_DESCRIPTION_LENGTH = 120;

export function toSocialDescription(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_SOCIAL_DESCRIPTION_LENGTH) return normalized;
  const firstSentence = normalized.match(/^[^.!?]+[.!?]/)?.[0]?.trim();
  if (
    firstSentence &&
    firstSentence.length <= MAX_SOCIAL_DESCRIPTION_LENGTH
  ) {
    return firstSentence;
  }
  const truncated = normalized
    .slice(0, MAX_SOCIAL_DESCRIPTION_LENGTH - 1)
    .replace(/\s+\S*$/, "")
    .replace(/[,;:\s]+$/, "");
  return `${truncated}…`;
}

export function pageMetadata(
  locale: Locale,
  slug = "",
  title?: string,
  description?: string,
): Metadata {
  const suffix = slug ? `/${slug}` : "";
  const canonical = `${websiteUrl}/${locale}${suffix}`;
  const fullTitle = `${title ?? content[locale].title.replace(/ [–—|] Zackisch$/, "")} | Zackisch`;
  const fullDescription = description ?? content[locale].description;
  const socialDescription = toSocialDescription(fullDescription);
  const image = {
    url: `${websiteUrl}/brand/logo/social/wordmark--og--citron--1200x630.png`,
    width: 1200,
    height: 630,
    alt:
      locale === "de-de"
        ? "Zackisch: QR-Bestellung und Bezahlen für die Gastronomie"
        : "Zackisch: QR ordering and payments for hospitality",
  };
  return {
    title: fullTitle,
    description: fullDescription,
    alternates: {
      canonical,
      languages: {
        "de-DE": `${websiteUrl}/de-de${suffix}`,
        "en-DE": `${websiteUrl}/de-en${suffix}`,
        "x-default": `${websiteUrl}/de-de${suffix}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: socialDescription,
      url: canonical,
      siteName: "Zackisch",
      locale: locale === "de-de" ? "de_DE" : "en_DE",
      type: "website",
      alternateLocale: locale === "de-de" ? "en_DE" : "de_DE",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: socialDescription,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
