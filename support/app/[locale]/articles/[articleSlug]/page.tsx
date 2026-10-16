import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportShell } from "@/components/SupportShell";
import {
  SUPPORT_ARTICLES,
  getArticleBySlug,
  getCategoryBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { BRAND_ASSETS } from "@zackisch/design-system";
import {
  CheckCircle2,
  ListChecks,
  ShieldCheck,
  Ticket,
} from "lucide-react";

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
      images: [BRAND_ASSETS.ogImage],
      locale: isDe ? "de_DE" : "en_US",
      type: "article",
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; articleSlug: string }>;
}) {
  const { locale: rawLocale, articleSlug } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const locale: SupportLocale = rawLocale;
  const isDe = locale === "de-de";

  const article = getArticleBySlug(articleSlug);
  if (!article) {
    notFound();
  }
  const category = getCategoryBySlug(article.categorySlug);

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
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.title[locale],
              item: `https://support.zackisch.com/${locale}/categories/${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: article.title[locale],
              item: `https://support.zackisch.com/${locale}/articles/${article.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: article.title[locale],
              item: `https://support.zackisch.com/${locale}/articles/${article.slug}`,
            },
          ]),
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title[locale],
    description: article.summary[locale],
    mainEntityOfPage: `https://support.zackisch.com/${locale}/articles/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Zackisch",
      url: "https://zackisch.com",
      logo: {
        "@type": "ImageObject",
        url: BRAND_ASSETS.combinationMarkSvg,
      },
    },
  };

  return (
    <SupportShell locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#525252]">
          <Link href={`/${locale}`} className="hover:text-[#0A0A0A]">
            {isDe ? "Hilfe-Center" : "Help Center"}
          </Link>
          <span>/</span>
          {category && (
            <Link
              href={`/${locale}/categories/${category.slug}`}
              className="hover:text-[#0A0A0A]"
            >
              {category.title[locale]}
            </Link>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 sm:p-10 space-y-8 shadow-xs">
          <header className="space-y-3 border-b border-[#E0E0E0] pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] font-brand leading-tight">
              {article.title[locale]}
            </h1>
            <p className="text-sm text-[#525252] leading-relaxed">
              {article.summary[locale]}
            </p>
          </header>

          {/* Prerequisites */}
          <section className="bg-[#F7F7F7] rounded-xl border border-[#E0E0E0] p-5 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#161616]" />
              <span>{isDe ? "Voraussetzungen" : "Prerequisites"}</span>
            </h2>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#383838]">
              {article.prerequisites[locale].map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#161616] font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Step-by-Step Instructions */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-[#0A0A0A] font-brand">
              {isDe
                ? "Schritt-für-Schritt-Anleitung"
                : "Step-by-Step Instructions"}
            </h2>
            <ol className="space-y-3">
              {article.steps[locale].map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#E0E0E0] bg-white"
                >
                  <span className="w-6 h-6 rounded-full bg-[#161616] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-num">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[#383838] leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Verification Check */}
          <section className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-xl p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#161616] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#161616]">
                {isDe ? "Erfolgskontrolle" : "Expected Result"}
              </h3>
              <p className="text-xs sm:text-sm text-[#383838]">
                {article.verification[locale]}
              </p>
            </div>
          </section>

          {/* Related Articles */}
          {article.relatedSlugs.length > 0 && (
            <section className="pt-4 border-t border-[#E0E0E0] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#525252]">
                {isDe ? "Weiterführende Artikel" : "Related Guides"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {article.relatedSlugs.map((relSlug) => {
                  const rel = getArticleBySlug(relSlug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={relSlug}
                      href={`/${locale}/articles/${relSlug}`}
                      className="p-3 rounded-xl border border-[#E0E0E0] hover:border-[#161616] text-xs font-semibold text-[#161616] flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#161616] shrink-0" />
                      <span className="truncate">{rel.title[locale]}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Escalation to Support Ticket */}
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#0A0A0A] font-brand">
              {isDe
                ? "Frage noch nicht geklärt?"
                : "Still need help with this topic?"}
            </h3>
            <p className="text-xs text-[#525252]">
              {isDe
                ? "Erstelle ein Support-Ticket zu diesem Thema — unser Team hilft dir direkt weiter."
                : "Create a support ticket on this topic and our team will assist you directly."}
            </p>
          </div>
          <Link
            href={`/${locale}/tickets?category=${category?.ticketCategory || "other"}&subject=${encodeURIComponent(article.title[locale])}`}
            className="h-10 px-5 rounded-full bg-[#161616] text-white hover:bg-[#252525] text-xs font-semibold inline-flex items-center gap-2 shrink-0 transition-colors"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isDe ? "Ticket zu diesem Thema öffnen" : "Open Ticket on This Topic"}</span>
          </Link>
        </div>
      </article>
    </SupportShell>
  );
}
