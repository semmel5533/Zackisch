import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainPage } from "@/components/MainPage";
import { translations } from "@/lib/translations";
import { ALL_LOCALES, parseLocale } from "@/lib/regions";
import { BRAND_ASSETS } from "@zackisch/design-system";

export function generateStaticParams() {
  return ALL_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!ALL_LOCALES.includes(locale)) {
    return {};
  }

  const { lang } = parseLocale(locale);
  const t = translations[lang];
  const canonicalUrl = `https://zackisch.com/${locale}`;

  return {
    title: {
      absolute: t.metaTitle,
    },
    description: t.metaDescription,
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: canonicalUrl,
      locale: lang === "de" ? "de_DE" : "en_US",
      siteName: "Zackisch",
      type: "website",
      images: [BRAND_ASSETS.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
      images: [BRAND_ASSETS.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "de-DE": "https://zackisch.com/de-de",
        "en-DE": "https://zackisch.com/de-en",
        "x-default": "https://zackisch.com/de-de",
      },
    },
    other: {
      "geo.region": "DE",
      "geo.placename": "Deutschland",
      "geo.position": "51.1657;10.4515",
      "ICBM": "51.1657, 10.4515",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!ALL_LOCALES.includes(locale)) {
    notFound();
  }

  const { lang } = parseLocale(locale);
  const t = translations[lang];
  const canonicalUrl = `https://zackisch.com/${locale}`;

  const faqKeys = [
    "faqApp",
    "faqDevices",
    "faqPickup",
    "faqMenu",
    "faqUnavailable",
    "faqOptions",
    "faqPayment",
    "faqTips",
    "faqStart",
    "faqPos",
    "faqPayout",
    "faqContract",
    "faqCosts",
  ] as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://zackisch.com/#organization",
        "name": "Zackisch",
        "url": "https://zackisch.com",
        "logo": BRAND_ASSETS.combinationMarkSvg,
        "sameAs": ["https://launchtomars.de"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://zackisch.com/#application",
        "name": "Zackisch",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All (Web-based)",
        "description": t.metaDescription,
      },
      {
        "@type": "WebSite",
        "@id": "https://zackisch.com/#website",
        "url": "https://zackisch.com",
        "name": "Zackisch",
        "publisher": {
          "@id": "https://zackisch.com/#organization",
        },
        "inLanguage": lang === "de" ? "de-DE" : "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": faqKeys.map((key) => ({
          "@type": "Question",
          "name": t[key],
          "acceptedAnswer": {
            "@type": "Answer",
            "text": t[`${key}Answer` as keyof typeof t],
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MainPage />
    </>
  );
}
