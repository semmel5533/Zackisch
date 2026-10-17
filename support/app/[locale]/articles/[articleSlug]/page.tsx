import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportShell } from "@/components/SupportShell";
import { SupportSearch } from "@/components/SupportSearch";
import {
  SUPPORT_ARTICLES,
  getArticleBySlug,
  getCategoryBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { BRAND_ASSETS } from "@zackisch/design-system";
import {
  ArrowRight,
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

      {/* Top Search Banner (support.html .help-search) */}
      <section className="bg-[#171717] text-white py-10 sm:py-12 border-b border-[#252525]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#959595]">
              {isDe ? "Zackisch Hilfe" : "Zackisch Help"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              {isDe ? "Was möchtest du erledigen?" : "What do you want to achieve?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#C4C4C4] mt-1 max-w-xl">
              {isDe
                ? "Antworten zur Einrichtung, Zahlung und Arbeit mit deiner bestehenden Kasse."
                : "Answers for onboarding, payments, and working alongside your existing cash register."}
            </p>
          </div>
          <div className="pt-2">
            <SupportSearch locale={locale} />
          </div>
        </div>
      </section>

      {/* Three-Column Article Grid (support.html .articlegrid) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-1">
        {/* Left TOC Rail (support.html aside.toc) */}
        <aside className="hidden lg:block lg:col-span-2">
          <div className="sticky top-24 space-y-3">
            <b className="text-xs font-bold uppercase tracking-wider text-foreground block">
              {isDe ? "Auf dieser Seite" : "On this page"}
            </b>
            <nav className="flex flex-col space-y-2 text-xs font-medium text-muted-foreground">
              <a href="#voraussetzungen" className="hover:text-foreground transition-colors">
                {isDe ? "Voraussetzungen" : "Prerequisites"}
              </a>
              <a href="#anleitung" className="hover:text-foreground transition-colors">
                {isDe ? "Schritt-für-Schritt" : "Step-by-Step"}
              </a>
              <a href="#erfolgskontrolle" className="hover:text-foreground transition-colors">
                {isDe ? "Erfolgskontrolle" : "Verification"}
              </a>
              <a href="#support" className="hover:text-foreground transition-colors">
                {isDe ? "Weitere Hilfe" : "Further Help"}
              </a>
            </nav>
          </div>
        </aside>

        {/* Center Article Content (support.html article.article) */}
        <article className="lg:col-span-7 space-y-8 min-w-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                {isDe ? "Hilfe-Center" : "Help Center"}
              </Link>
              <span>/</span>
              {category && (
                <Link
                  href={`/${locale}/categories/${category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.title[locale]}
                </Link>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {article.title[locale]}
            </h1>
            <p className="text-base text-muted-foreground mt-2 leading-relaxed">
              {article.summary[locale]}
            </p>

            {/* Note (support.html .note) */}
            <div className="p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 mt-6 text-xs sm:text-sm leading-relaxed">
              <b>{isDe ? "Wichtig:" : "Important:"}</b>{" "}
              {isDe
                ? "Zackisch überträgt Bestellungen nicht automatisch in die Kasse. Du musst jede Bestellung nach deinen betrieblichen Verfahren erfassen."
                : "Zackisch does not automatically transmit orders to your cash register. You must record each order according to your operational procedures."}
            </div>
          </div>

          {/* Prerequisites */}
          <section id="voraussetzungen" className="scroll-mt-24 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-foreground" />
              <span>{isDe ? "Bevor du beginnst" : "Before you begin"}</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground bg-muted/30 border border-border rounded-xl p-4 sm:p-5">
              {article.prerequisites[locale].map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="font-bold text-foreground">•</span>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Step-by-Step Instructions */}
          <section id="anleitung" className="scroll-mt-24 space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {isDe ? "Schritt-für-Schritt-Anleitung" : "Step-by-Step Instructions"}
            </h2>
            <ol className="space-y-3">
              {article.steps[locale].map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-inter tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {/* Verification Check */}
          <section
            id="erfolgskontrolle"
            className="scroll-mt-24 bg-card border border-border rounded-xl p-5 flex items-start gap-3.5 shadow-2xs"
          >
            <ShieldCheck className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                {isDe ? "Erfolgskontrolle" : "Expected Result"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {article.verification[locale]}
              </p>
            </div>
          </section>

          {/* Escalation / Auth gate (support.html #support) */}
          <section
            id="support"
            className="scroll-mt-24 rounded-xl border border-border bg-card p-6 space-y-3 shadow-xs"
          >
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              {isDe ? "Kommst du nicht weiter?" : "Need further help?"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isDe
                ? "Die Anleitungen sind öffentlich. Für ein Ticket musst du dich mit deinem Zackisch-Betriebskonto anmelden."
                : "These guides are public. To open a ticket, please sign in with your Zackisch merchant account."}
            </p>
            <Link
              href={`/${locale}/tickets?category=${category?.ticketCategory || "other"}&subject=${encodeURIComponent(article.title[locale])}`}
              className="inline-flex min-h-[40px] items-center justify-center rounded-full bg-foreground px-5 text-xs sm:text-sm font-semibold text-background hover:bg-foreground/90 transition-colors gap-2"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{isDe ? "Mit Zackisch anmelden →" : "Sign in with Zackisch →"}</span>
            </Link>
          </section>
        </article>

        {/* Right Rail: Related Articles (support.html aside .pane) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-24 bg-card border border-border rounded-xl p-5 space-y-4 shadow-xs">
            <p className="text-[11px] font-semibold uppercase tracking-[.08em] text-muted-foreground">
              {isDe ? "Dazugehörig" : "Related"}
            </p>
            {article.relatedSlugs.length > 0 ? (
              <div className="divide-y divide-border/60">
                {article.relatedSlugs.map((relSlug) => {
                  const rel = getArticleBySlug(relSlug);
                  if (!rel) return null;
                  return (
                    <Link
                      key={relSlug}
                      href={`/${locale}/articles/${relSlug}`}
                      className="py-3 flex items-center justify-between gap-2 text-xs font-medium text-foreground hover:text-primary transition-colors group"
                    >
                      <span className="line-clamp-2">{rel.title[locale]}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {isDe ? "Keine weiteren Artikel." : "No related guides."}
              </p>
            )}
          </div>
        </aside>
      </main>
    </SupportShell>
  );
}
