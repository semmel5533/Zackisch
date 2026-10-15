import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainPage } from "@/components/MainPage";
import { translations } from "@/lib/translations";
import { ALL_LOCALES, parseLocale } from "@/lib/regions";

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
      images: ["/og_image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
      images: ["/og_image.png"],
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
        "logo": "https://zackisch.com/combination_mark.svg",
        "sameAs": ["https://launchtomars.de/startup/zakkig/"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://zackisch.com/#application",
        "name": "Zackisch",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All (Web-based)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": lang === "de"
            ? "Kostenlose Registrierung, 2 % Gebühr pro Bestellung zzgl. Zahlungsanbietergebühren."
            : "Free registration, 2% fee per order plus payment provider fees.",
        },
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
