import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  SUPPORT_CATEGORIES,
  getCategoryBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { SupportCategoryView } from "@/components/SupportCategoryView";

export function generateStaticParams() {
  const locales = ["de-de", "de-en"];
  const params: { locale: string; categorySlug: string }[] = [];
  for (const locale of locales) {
    for (const cat of SUPPORT_CATEGORIES) {
      params.push({ locale, categorySlug: cat.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}): Promise<Metadata> {
  const { locale, categorySlug } = await params;
  if (locale !== "de-de" && locale !== "de-en") {
    return {};
  }
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    return {};
  }
  const isDe = locale === "de-de";
  const title = `${category.title[locale]} — ${
    isDe ? "Zackisch Hilfe & Support" : "Zackisch Help & Support"
  }`;
  const description = category.description[locale];
  const canonicalUrl = `https://support.zackisch.com/${locale}/categories/${categorySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "de-DE": `https://support.zackisch.com/de-de/categories/${categorySlug}`,
        "en-DE": `https://support.zackisch.com/de-en/categories/${categorySlug}`,
        "x-default": `https://support.zackisch.com/de-de/categories/${categorySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zackisch",
      images: ["/og_image.png"],
      locale: isDe ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og_image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categorySlug: string }>;
}) {
  const { locale: rawLocale, categorySlug } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }
  const locale: SupportLocale = rawLocale;

  return <SupportCategoryView locale={locale} categorySlug={categorySlug} />;
}
