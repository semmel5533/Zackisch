"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import { SupportSearch } from "@/components/SupportSearch";
import {
  SUPPORT_CATEGORIES,
  getFeaturedArticles,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { Grid } from "@astryxdesign/core/Grid";
import { Card } from "@astryxdesign/core/Card";
import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Icon } from "@astryxdesign/core/Icon";
import {
  ArrowRight,
  CheckCircle,
  Receipt,
  Ticket,
  Sparkle,
} from "@phosphor-icons/react";

export function SupportHomeView({ locale }: { locale: SupportLocale }) {
  const isDe = locale === "de-de";
  const featured = getFeaturedArticles();

  return (
    <SupportShell locale={locale}>
      <VStack gap={8} width="100%">
        {/* Hero & Search Banner */}
        <Card variant="default" padding={6}>
          <VStack gap={4} align="center" width="100%">
            <Badge
              label={
                isDe
                  ? "Selbstbedienungs-Hilfe für Gastronomen & Teams"
                  : "Self-Service Help Center for Restaurants & Teams"
              }
              variant="neutral"
              icon={<Icon icon={Sparkle} size="sm" />}
            />
            <VStack gap={1} align="center">
              <Heading level={1}>
                {isDe
                  ? "Wie können wir deinem Betrieb heute helfen?"
                  : "How can we help your restaurant today?"}
              </Heading>
              <Text color="secondary">
                {isDe
                  ? "Schritt-für-Schritt-Anleitungen zur einfachen Einrichtung, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
                  : "Step-by-step guides for simple onboarding, single-entry POS recording, and Stripe Connect direct charges."}
              </Text>
            </VStack>

            <div style={{ width: "100%", maxWidth: 640 }}>
              <SupportSearch locale={locale} />
            </div>
          </VStack>
        </Card>

        {/* Critical POS & Fiscal Clarity Callout */}
        <Card variant="muted" padding={5}>
          <HStack justify="between" vAlign="center" gap={6} wrap="wrap">
            <VStack gap={1} style={{ maxWidth: 720 }}>
              <HStack gap={1} vAlign="center">
                <Icon icon={Receipt} size="sm" />
                <Text weight="bold">
                  {isDe
                    ? "Wichtiger Ablauf für deinen Kassen-Alltag (POS)"
                    : "Essential Daily POS Workflow"}
                </Text>
              </HStack>
              <Heading level={2}>
                {isDe
                  ? "Deine bestehende Kasse bleibt: Jede bezahlte Bestellung einmalig erfassen"
                  : "Your existing POS stays: Record every paid order once"}
              </Heading>
              <Text color="secondary">
                {isDe
                  ? "Zackisch stellt Gästen eine digitale Bestell- und Zahlungsbestätigung bereit (kein Kassenbeleg und keine Rechnung). Dein Team sieht auf dem Tablet sofort „Bereits mit Zackisch bezahlt“, erfasst die Bestellung genau einmal als unbare Online-Zahlung in der vorhandenen Kasse und tippt auf „In Kasse erfasst“."
                  : "Zackisch provides guests with a digital Order and Payment Confirmation (neither a POS receipt nor an invoice). Your staff see 'Already paid with Zackisch' on the tablet, enter the order once as a non-cash online payment in your POS, and tap 'Recorded in POS'."}
              </Text>
            </VStack>
            <Button
              label={isDe ? "Kassen-Leitfaden lesen" : "Read POS Guide"}
              variant="primary"
              size="md"
              href={`/${locale}/articles/pos-single-entry-workflow`}
              endContent={<Icon icon={ArrowRight} size="sm" />}
            />
          </HStack>
        </Card>

        {/* Categories Section */}
        <VStack gap={3} width="100%">
          <HStack justify="between" vAlign="center">
            <Heading level={2}>
              {isDe ? "Themenbereiche" : "Browse by Category"}
            </Heading>
            <Text color="secondary">
              {isDe
                ? "43 Schritt-für-Schritt-Anleitungen"
                : "43 Step-by-Step Guides"}
            </Text>
          </HStack>

          <Grid columns={{ minWidth: 280, max: 3 }} gap={4} width="100%">
            {SUPPORT_CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card variant="default" padding={5} height="100%">
                  <VStack gap={3} justify="between" height="100%">
                    <VStack gap={2}>
                      <HStack justify="between" vAlign="center">
                        <Badge label={cat.badge[locale]} variant="neutral" />
                        <Icon icon={ArrowRight} size="sm" />
                      </HStack>
                      <Heading level={3}>{cat.title[locale]}</Heading>
                      <Text color="secondary">{cat.description[locale]}</Text>
                    </VStack>
                    <Text weight="semibold">
                      {isDe ? "Alle Anleitungen ansehen →" : "View all guides →"}
                    </Text>
                  </VStack>
                </Card>
              </a>
            ))}
          </Grid>
        </VStack>

        {/* Featured Guides */}
        <VStack gap={3} width="100%">
          <Heading level={2}>
            {isDe
              ? "Wichtigste Anleitungen für den Start"
              : "Most Important Guides to Get Started"}
          </Heading>
          <Grid columns={{ minWidth: 320, max: 2 }} gap={4} width="100%">
            {featured.map((art) => (
              <a
                key={art.slug}
                href={`/${locale}/articles/${art.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card variant="default" padding={4} height="100%">
                  <HStack justify="between" vAlign="start" gap={3}>
                    <VStack gap={1}>
                      <HStack gap={1} vAlign="center">
                        <Icon icon={CheckCircle} size="sm" />
                        <Text weight="bold">
                          {isDe ? "Empfohlene Anleitung" : "Featured Guide"}
                        </Text>
                      </HStack>
                      <Heading level={3}>{art.title[locale]}</Heading>
                      <Text color="secondary">{art.summary[locale]}</Text>
                    </VStack>
                    <Icon icon={ArrowRight} size="sm" />
                  </HStack>
                </Card>
              </a>
            ))}
          </Grid>
        </VStack>

        {/* Direct Ticket Support CTA */}
        <Card variant="muted" padding={6}>
          <HStack justify="between" vAlign="center" gap={4} wrap="wrap">
            <VStack gap={1}>
              <Heading level={2}>
                {isDe
                  ? "Du hast eine individuelle Frage zu deinem Betrieb?"
                  : "Need personalized help with your venue?"}
              </Heading>
              <Text color="secondary">
                {isDe
                  ? "Erstelle direkt ein Support-Ticket. Unser Team sieht deinen Kontext und antwortet dir direkt im Ticketverlauf."
                  : "Open a support ticket directly. Our team reviews your context and replies right in your ticket thread."}
              </Text>
            </VStack>
            <Button
              label={isDe ? "Zum Ticket-Portal" : "Open Ticket Portal"}
              variant="primary"
              size="md"
              href={`/${locale}/tickets`}
              icon={<Icon icon={Ticket} size="sm" />}
            />
          </HStack>
        </Card>
      </VStack>
    </SupportShell>
  );
}
