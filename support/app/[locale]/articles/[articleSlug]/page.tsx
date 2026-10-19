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
        url: "/combination_mark.svg",
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
        <div className="flex items-center gap-2 text-xs font-semibold text-[#495A52]">
          <Link href={`/${locale}`} className="hover:text-[#14231D]">
            {isDe ? "Hilfe-Center" : "Help Center"}
          </Link>
          <span>/</span>
          {category && (
            <Link
              href={`/${locale}/categories/${category.slug}`}
              className="hover:text-[#14231D]"
            >
              {category.title[locale]}
            </Link>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-10 space-y-8 shadow-xs">
          <header className="space-y-3 border-b border-[#DDD7CA] pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#14231D] leading-tight">
              {article.title[locale]}
            </h1>
            <p className="text-sm text-[#495A52] leading-relaxed">
              {article.summary[locale]}
            </p>
          </header>

          {/* Prerequisites */}
          <section className="bg-[#F7F5EF] rounded-2xl p-5 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173C2B] flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              <span>{isDe ? "Voraussetzungen" : "Prerequisites"}</span>
            </h2>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#14231D]">
              {article.prerequisites[locale].map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#245740] font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Step-by-Step Instructions */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-[#14231D]">
              {isDe
                ? "Schritt-für-Schritt-Anleitung"
                : "Step-by-Step Instructions"}
            </h2>
            <ol className="space-y-3">
              {article.steps[locale].map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DDD7CA]/80 bg-white"
                >
                  <span className="w-6 h-6 rounded-full bg-[#173C2B] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-num">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[#14231D] leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Verification Check */}
          <section className="bg-[#DCEFE5]/70 border border-[#BFC8BE] rounded-2xl p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#173C2B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#173C2B]">
                {isDe ? "Erfolgskontrolle" : "Expected Result"}
              </h3>
              <p className="text-xs sm:text-sm text-[#14231D]">
                {article.verification[locale]}
              </p>
            </div>
          </section>

          {/* Related Articles */}
          {article.relatedSlugs.length > 0 && (
            <section className="pt-4 border-t border-[#DDD7CA] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#495A52]">
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
                      className="p-3 rounded-xl border border-[#DDD7CA] hover:border-[#245740] text-xs font-semibold text-[#14231D] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#245740] shrink-0" />
                      <span className="truncate">{rel.title[locale]}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Escalation to Support Ticket */}
        <div className="bg-white rounded-3xl border border-[#DDD7CA] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#14231D]">
              {isDe
                ? "Frage noch nicht geklärt?"
                : "Still need help with this topic?"}
            </h3>
            <p className="text-xs text-[#495A52]">
              {isDe
                ? "Erstelle ein Support-Ticket zu diesem Thema — unser Team hilft dir direkt weiter."
                : "Create a support ticket on this topic and our team will assist you directly."}
            </p>
          </div>
          <Link
            href={`/${locale}/tickets?category=${category?.ticketCategory || "other"}&subject=${encodeURIComponent(article.title[locale])}`}
            className="h-10 px-5 rounded-full bg-[#173C2B] text-white hover:bg-[#245740] text-xs font-semibold inline-flex items-center gap-2 shrink-0"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isDe ? "Ticket zu diesem Thema öffnen" : "Open Ticket on This Topic"}</span>
          </Link>
        </div>
      </article>
    </SupportShell>
  );
}
