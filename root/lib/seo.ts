import type { Metadata } from "next";
import type { Locale } from "./content/site-data";

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string; // e.g. "/pricing" or "" for home
  locale: Locale;
  noindex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path,
  locale,
  noindex = false,
}: PageSeoConfig): Metadata {
  const baseUrl = "https://zackisch.com";
  const canonicalUrl = `${baseUrl}/${locale}${path}`;
  const isDe = locale === "de-de";

  // Ensure title ends with " - Zackisch"
  const formattedTitle = title.endsWith(" - Zackisch") ? title : `${title} - Zackisch`;

  return {
    title: formattedTitle,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "de-DE": `${baseUrl}/de-de${path}`,
        "en-DE": `${baseUrl}/de-en${path}`,
        "x-default": `${baseUrl}/de-de${path}`,
      },
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: canonicalUrl,
      siteName: "Zackisch",
      images: [
        {
          url: "/derived/og-default.png",
          width: 1200,
          height: 630,
          alt: "Zackisch — Digitales Bestellsystem Gastronomie",
        },
      ],
      locale: isDe ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: ["/derived/og-default.png"],
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
      },
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zackisch",
    url: "https://zackisch.com",
    logo: "https://zackisch.com/branding/combination_mark.svg",
    founder: {
      "@type": "Person",
      name: "Selim Eser",
      jobTitle: "Founder & Software Engineer",
      affiliation: {
        "@type": "EducationalOrganization",
        name: "Hochschule Mannheim",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mannheim",
      addressRegion: "Baden-Württemberg",
      addressCountry: "DE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "selim@zackisch.com",
      contactType: "customer support",
      availableLanguage: ["German", "English"],
    },
  };
}

export function generateSoftwareApplicationJsonLd(locale: Locale) {
  const isDe = locale === "de-de";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Zackisch",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser (iOS, Android, macOS, Windows)",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "EUR",
      description: isDe
        ? "Keine Grundgebühr. 2 % Plattformgebühr pro erfolgreich bezahlter Bestellung zzgl. Zahlungsabwicklung."
        : "No monthly base fee. 2% platform fee per successfully captured order plus payment processing.",
    },
  };
}
