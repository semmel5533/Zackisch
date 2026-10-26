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
  return {
    title: title ? `${title} – Zackisch` : content[locale].title,
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
      title: title ?? content[locale].title,
      description: description ?? content[locale].description,
      url: canonical,
      siteName: "Zackisch",
      locale: locale === "de-de" ? "de_DE" : "en_DE",
      type: "website",
    },
    // Legal notices and public release remain subject to the owner's approval.
    robots: { index: false, follow: true },
  };
}
