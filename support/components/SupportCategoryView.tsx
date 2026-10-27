"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { Card, Badge, Button } from "@/components/ui/primitives";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from "@phosphor-icons/react";

export function SupportCategoryView({
  locale,
  categorySlug,
}: {
  locale: SupportLocale;
  categorySlug: string;
}) {
  const isDe = locale === "de-de";
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;

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
      <div className="flex flex-col gap-6 w-full max-w-[840px] mx-auto">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            href={`/${locale}`}
          >
            <ArrowLeft className="size-4" />
            <span>{isDe ? "Alle Themenbereiche" : "All Categories"}</span>
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge
              label={category.badge[locale]}
              variant="neutral"
              icon={<BookOpen className="size-3.5" />}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {category.title[locale]}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {category.description[locale]}
          </p>
        </div>

        <Card variant="default" padding={0} className="overflow-hidden">
          <div className="flex flex-col divide-y divide-border">
            {articles.map((art) => (
              <a
                key={art.slug}
                href={`/${locale}/articles/${art.slug}`}
                className="block px-6 py-5 no-underline text-inherit hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 max-w-[680px]">
                    <h3 className="text-base font-bold text-foreground">
                      {art.title[locale]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {art.summary[locale]}
                    </p>
                    <span className="text-xs font-semibold text-foreground pt-1">
                      {art.steps[locale].length}{" "}
                      {isDe ? "Schritte zur Umsetzung" : "Implementation Steps"}
                    </span>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground mt-1" />
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </SupportShell>
  );
}
