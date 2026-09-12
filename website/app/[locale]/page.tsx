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
    title: t.metaTitle,
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

  return <MainPage />;
}
