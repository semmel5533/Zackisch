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
  const canonicalUrl = `https://www.zakkig.com/${locale}`;

  return {
    title: {
      absolute: t.metaTitle,
    },
    description: t.metaDescription,
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      locale: lang === "de" ? "de_DE" : "en_US",
      siteName: "zakkig",
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
        "de-DE": "https://www.zakkig.com/de-de",
        "en-DE": "https://www.zakkig.com/de-en",
        "x-default": "https://www.zakkig.com/de-de",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.zakkig.com/#organization",
        "name": "zakkig",
        "url": "https://www.zakkig.com",
        "logo": "https://www.zakkig.com/icon.svg",
        "sameAs": ["https://launchtomars.de/startup/zakkig/"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.zakkig.com/#application",
        "name": "zakkig",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All (Web-based)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
        },
        "description": t.metaDescription,
      },
      {
        "@type": "WebSite",
        "@id": "https://www.zakkig.com/#website",
        "url": "https://www.zakkig.com",
        "name": "zakkig",
        "publisher": {
          "@id": "https://www.zakkig.com/#organization",
        },
        "inLanguage": lang === "de" ? "de-DE" : "en-US",
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
