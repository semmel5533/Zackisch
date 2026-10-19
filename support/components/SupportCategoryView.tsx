"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import {
  getCategoryBySlug,
  getArticlesByCategory,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
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
      <VStack gap={6} width="100%" style={{ maxWidth: 840, margin: "0 auto" }}>
        <HStack>
          <Button
            label={isDe ? "Alle Themenbereiche" : "All Categories"}
            variant="ghost"
            size="sm"
            href={`/${locale}`}
            icon={<Icon icon={ArrowLeft} size="sm" />}
          />
        </HStack>

        <VStack gap={2}>
          <HStack gap={2} vAlign="center">
            <Badge
              label={category.badge[locale]}
              variant="neutral"
              icon={<Icon icon={BookOpen} size="sm" />}
            />
          </HStack>
          <Heading level={1}>{category.title[locale]}</Heading>
          <Text color="secondary">{category.description[locale]}</Text>
        </VStack>

        <Card variant="default" padding={0}>
          <VStack gap={0}>
            {articles.map((art) => (
              <a
                key={art.slug}
                href={`/${locale}/articles/${art.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  padding: "20px 24px",
                  borderBottom: "1px solid var(--color-border, #E4E4E7)",
                }}
              >
                <HStack justify="between" vAlign="start" gap={4}>
                  <VStack gap={1} style={{ maxWidth: 680 }}>
                    <Heading level={3}>{art.title[locale]}</Heading>
                    <Text color="secondary">{art.summary[locale]}</Text>
                    <Text weight="semibold">
                      {art.steps[locale].length}{" "}
                      {isDe ? "Schritte zur Umsetzung" : "Implementation Steps"}
                    </Text>
                  </VStack>
                  <Icon icon={ArrowRight} size="sm" />
                </HStack>
              </a>
            ))}
          </VStack>
        </Card>
      </VStack>
    </SupportShell>
  );
}
