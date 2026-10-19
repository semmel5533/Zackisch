import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  SUPPORT_ARTICLES,
  getArticleBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { SupportArticleView } from "@/components/SupportArticleView";

export function generateStaticParams() {
  const locales = ["de-de", "de-en"];
  const params: { locale: string; articleSlug: string }[] = [];
  for (const locale of locales) {
    for (const art of SUPPORT_ARTICLES) {
      params.push({ locale, articleSlug: art.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; articleSlug: string }>;
}): Promise<Metadata> {
  const { locale, articleSlug } = await params;
  if (locale !== "de-de" && locale !== "de-en") {
    return {};
  }
  const article = getArticleBySlug(articleSlug);
  if (!article) {
    return {};
  }
  const isDe = locale === "de-de";
  const title = `${article.title[locale]} — ${
    isDe ? "Zackisch Hilfe & Support" : "Zackisch Help & Support"
  }`;
  const description = article.summary[locale];
  const canonicalUrl = `https://support.zackisch.com/${locale}/articles/${articleSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "de-DE": `https://support.zackisch.com/de-de/articles/${articleSlug}`,
        "en-DE": `https://support.zackisch.com/de-en/articles/${articleSlug}`,
        "x-default": `https://support.zackisch.com/de-de/articles/${articleSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Zackisch",
      images: ["/og_image.png"],
      locale: isDe ? "de_DE" : "en_US",
      type: "article",
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; articleSlug: string }>;
}) {
  const { locale: rawLocale, articleSlug } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const article = getArticleBySlug(articleSlug);
  if (!article) {
    notFound();
  }
  const locale: SupportLocale = rawLocale;

  return <SupportArticleView locale={locale} articleSlug={articleSlug} />;
}
