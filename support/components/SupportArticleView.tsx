"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import {
  getArticleBySlug,
  getCategoryBySlug,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Divider } from "@astryxdesign/core/Divider";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
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
      <VStack gap={6} width="100%" style={{ maxWidth: 840, margin: "0 auto" }}>
        <HStack gap={2} vAlign="center">
          <Button
            label={isDe ? "Hilfe-Center" : "Help Center"}
            variant="ghost"
            size="sm"
            href={`/${locale}`}
            icon={<Icon icon={ArrowLeft} size="sm" />}
          />
          {category && (
            <>
              <Text color="secondary">/</Text>
              <Button
                label={category.title[locale]}
                variant="ghost"
                size="sm"
                href={`/${locale}/categories/${category.slug}`}
              />
            </>
          )}
        </HStack>

        <Card variant="default" padding={6}>
          <VStack gap={6}>
            <VStack gap={2}>
              {category && (
                <Badge label={category.badge[locale]} variant="neutral" />
              )}
              <Heading level={1}>{article.title[locale]}</Heading>
              <Text color="secondary">{article.summary[locale]}</Text>
            </VStack>

            <Divider />

            {/* Prerequisites */}
            <Card variant="muted" padding={4}>
              <VStack gap={2}>
                <HStack gap={1} vAlign="center">
                  <Icon icon={ListChecks} size="sm" />
                  <Text weight="bold">
                    {isDe ? "Voraussetzungen" : "Prerequisites"}
                  </Text>
                </HStack>
                <VStack gap={1}>
                  {article.prerequisites[locale].map((req, idx) => (
                    <Text key={idx}>• {req}</Text>
                  ))}
                </VStack>
              </VStack>
            </Card>

            {/* Step-by-Step Instructions */}
            <VStack gap={3}>
              <Heading level={2}>
                {isDe
                  ? "Schritt-für-Schritt-Anleitung"
                  : "Step-by-Step Instructions"}
              </Heading>
              <VStack gap={2}>
                {article.steps[locale].map((step, idx) => (
                  <Card key={idx} variant="muted" padding={3}>
                    <HStack gap={3} vAlign="start">
                      <Badge label={String(idx + 1)} variant="neutral" />
                      <Text>{step}</Text>
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </VStack>

            {/* Verification Check */}
            <Card variant="muted" padding={4}>
              <HStack gap={3} vAlign="start">
                <Icon icon={ShieldCheck} size="md" />
                <VStack gap={1}>
                  <Text weight="bold">
                    {isDe ? "Erfolgskontrolle" : "Expected Result"}
                  </Text>
                  <Text>{article.verification[locale]}</Text>
                </VStack>
              </HStack>
            </Card>

            {/* Related Guides */}
            {article.relatedSlugs.length > 0 && (
              <VStack gap={3}>
                <Divider />
                <Text weight="bold">
                  {isDe ? "Weiterführende Artikel" : "Related Guides"}
                </Text>
                <Grid columns={{ minWidth: 260, max: 2 }} gap={2}>
                  {article.relatedSlugs.map((relSlug) => {
                    const rel = getArticleBySlug(relSlug);
                    if (!rel) return null;
                    return (
                      <a
                        key={relSlug}
                        href={`/${locale}/articles/${relSlug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Card variant="default" padding={3}>
                          <HStack gap={2} vAlign="center">
                            <Icon icon={CheckCircle} size="sm" />
                            <Text weight="semibold">{rel.title[locale]}</Text>
                          </HStack>
                        </Card>
                      </a>
                    );
                  })}
                </Grid>
              </VStack>
            )}
          </VStack>
        </Card>

        {/* Support Ticket Escalation Banner */}
        <Card variant="muted" padding={6}>
          <HStack justify="between" vAlign="center" gap={4} wrap="wrap">
            <VStack gap={1}>
              <Heading level={3}>
                {isDe
                  ? "Frage noch nicht geklärt?"
                  : "Still need help with this topic?"}
              </Heading>
              <Text color="secondary">
                {isDe
                  ? "Erstelle ein Support-Ticket zu diesem Thema — unser Team hilft dir direkt weiter."
                  : "Create a support ticket on this topic and our team will assist you directly."}
              </Text>
            </VStack>
            <Button
              label={
                isDe
                  ? "Ticket zu diesem Thema öffnen"
                  : "Open Ticket on This Topic"
              }
              variant="primary"
              size="md"
              href={`/${locale}/tickets?category=${category?.ticketCategory || "other"}&subject=${encodeURIComponent(article.title[locale])}`}
              icon={<Icon icon={Ticket} size="sm" />}
            />
          </HStack>
        </Card>
      </VStack>
    </SupportShell>
  );
}
