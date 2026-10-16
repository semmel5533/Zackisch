import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportShell } from "@/components/SupportShell";
import {
  SUPPORT_CATEGORIES,
  getCategoryBySlug,
  getArticlesByCategory,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { BRAND_ASSETS } from "@zackisch/design-system";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

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
  const locale: SupportLocale = rawLocale;
  const isDe = locale === "de-de";

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(categorySlug);

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isDe ? "Hilfe-Center" : "Help Center",
        item: `https://support.zackisch.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title[locale],
        item: `https://support.zackisch.com/${locale}/categories/${category.slug}`,
      },
    ],
  };

  return (
    <SupportShell locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#495A52] hover:text-[#14231D]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isDe ? "Alle Themenbereiche" : "All Categories"}</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245740]">
            <BookOpen className="w-4 h-4" />
            <span>{category.badge[locale]}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#14231D]">
            {category.title[locale]}
          </h1>
          <p className="text-sm text-[#495A52]">{category.description[locale]}</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#DDD7CA] divide-y divide-[#DDD7CA] overflow-hidden shadow-xs">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/${locale}/articles/${art.slug}`}
              className="p-6 flex items-start justify-between gap-4 hover:bg-[#F7F5EF]/60 transition-colors block"
            >
              <div className="space-y-1.5 max-w-2xl">
                <h2 className="text-base font-bold text-[#14231D]">
                  {art.title[locale]}
                </h2>
                <p className="text-xs text-[#495A52] leading-relaxed">
                  {art.summary[locale]}
                </p>
                <div className="text-[11px] text-[#245740] font-semibold pt-1">
                  {art.steps[locale].length}{" "}
                  {isDe ? "Schritte zur Umsetzung" : "Implementation Steps"}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#245740] shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </SupportShell>
  );
}
