"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import {
  getArticleBySlug,
  getCategoryBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { Card, Badge, Button, Divider } from "@/components/ui/primitives";
import {
  CheckCircle,
  ListChecks,
  ShieldCheck,
  Ticket,
  ArrowLeft,
} from "@phosphor-icons/react";

export function SupportArticleView({
  locale,
  articleSlug,
}: {
  locale: SupportLocale;
  articleSlug: string;
}) {
  const isDe = locale === "de-de";
  const article = getArticleBySlug(articleSlug);
  if (!article) return null;

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
      <div className="flex flex-col gap-6 w-full max-w-[840px] mx-auto">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            href={`/${locale}`}
          >
            <ArrowLeft className="size-4" />
            <span>{isDe ? "Hilfe-Center" : "Help Center"}</span>
          </Button>
          {category && (
            <>
              <span className="text-muted-foreground">/</span>
              <Button
                variant="ghost"
                size="sm"
                href={`/${locale}/categories/${category.slug}`}
              >
                {category.title[locale]}
              </Button>
            </>
          )}
        </div>

        <Card variant="default" padding={6}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
              {category && (
                <Badge label={category.badge[locale]} variant="neutral" />
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {article.title[locale]}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {article.summary[locale]}
              </p>
            </div>

            <Divider />

            {/* Prerequisites */}
            <Card variant="muted" padding={4}>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  <ListChecks className="size-4 shrink-0" />
                  <span>{isDe ? "Voraussetzungen" : "Prerequisites"}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm text-foreground">
                  {article.prerequisites[locale].map((req, idx) => (
                    <span key={idx}>• {req}</span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Step-by-Step Instructions */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {isDe
                  ? "Schritt-für-Schritt-Anleitung"
                  : "Step-by-Step Instructions"}
              </h2>
              <div className="flex flex-col gap-2">
                {article.steps[locale].map((step, idx) => (
                  <Card key={idx} variant="muted" padding={3}>
                    <div className="flex items-start gap-3">
                      <Badge label={String(idx + 1)} variant="neutral" />
                      <span className="text-sm text-foreground leading-relaxed">
                        {step}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Verification Check */}
            <Card variant="muted" padding={4}>
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 shrink-0 mt-0.5 text-foreground" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-foreground">
                    {isDe ? "Erfolgskontrolle" : "Expected Result"}
                  </span>
                  <span className="text-sm text-foreground">
                    {article.verification[locale]}
                  </span>
                </div>
              </div>
            </Card>

            {/* Related Guides */}
            {article.relatedSlugs.length > 0 && (
              <div className="flex flex-col gap-3">
                <Divider />
                <span className="text-sm font-bold text-foreground">
                  {isDe ? "Weiterführende Artikel" : "Related Guides"}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {article.relatedSlugs.map((relSlug) => {
                    const rel = getArticleBySlug(relSlug);
                    if (!rel) return null;
                    return (
                      <a
                        key={relSlug}
                        href={`/${locale}/articles/${relSlug}`}
                        className="no-underline text-inherit block"
                      >
                        <Card variant="default" padding={3} className="hover:border-[var(--zk-border-strong)] transition-colors">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="size-4 shrink-0 text-foreground" />
                            <span className="text-sm font-semibold text-foreground">
                              {rel.title[locale]}
                            </span>
                          </div>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Support Ticket Escalation Banner */}
        <Card variant="muted" padding={6}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {isDe
                  ? "Frage noch nicht geklärt?"
                  : "Still need help with this topic?"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isDe
                  ? "Erstelle ein Support-Ticket zu diesem Thema — unser Team hilft dir direkt weiter."
                  : "Create a support ticket on this topic and our team will assist you directly."}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              href={`/${locale}/tickets?category=${category?.ticketCategory || "other"}&subject=${encodeURIComponent(article.title[locale])}`}
            >
              <Ticket className="size-4" />
              <span>
                {isDe
                  ? "Ticket zu diesem Thema öffnen"
                  : "Open Ticket on This Topic"}
              </span>
            </Button>
          </div>
        </Card>
      </div>
    </SupportShell>
  );
}
