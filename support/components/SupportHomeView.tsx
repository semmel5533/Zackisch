"use client";

import React from "react";
import { SupportShell } from "@/components/SupportShell";
import { SupportSearch } from "@/components/SupportSearch";
import {
  SUPPORT_CATEGORIES,
  getFeaturedArticles,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { Card, Badge, Button } from "@/components/ui/primitives";
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
      <div className="flex flex-col gap-8 w-full">
        {/* Hero & Search Banner */}
        <Card variant="default" padding={6}>
          <div className="flex flex-col items-center text-center gap-4 w-full">
            <Badge
              label={
                isDe
                  ? "Selbstbedienungs-Hilfe für Gastronomen & Teams"
                  : "Self-Service Help Center for Restaurants & Teams"
              }
              variant="neutral"
              icon={<Sparkle className="size-3.5" />}
            />
            <div className="flex flex-col items-center gap-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isDe
                  ? "Wie können wir deinem Betrieb heute helfen?"
                  : "How can we help your restaurant today?"}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isDe
                  ? "Schritt-für-Schritt-Anleitungen zur einfachen Einrichtung, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
                  : "Step-by-step guides for simple onboarding, single-entry POS recording, and Stripe Connect direct charges."}
              </p>
            </div>

            <div className="w-full max-w-[640px]">
              <SupportSearch locale={locale} />
            </div>
          </div>
        </Card>

        {/* Critical POS & Fiscal Clarity Callout */}
        <Card variant="muted" padding={5}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5 max-w-[720px]">
              <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <Receipt className="size-4 shrink-0" />
                <span>
                  {isDe
                    ? "Wichtiger Ablauf für deinen Kassen-Alltag (POS)"
                    : "Essential Daily POS Workflow"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {isDe
                  ? "Deine bestehende Kasse bleibt: Jede bezahlte Bestellung einmalig erfassen"
                  : "Your existing POS stays: Record every paid order once"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isDe
                  ? "Zackisch stellt Gästen eine digitale Bestell- und Zahlungsbestätigung bereit (kein Kassenbeleg und keine Rechnung). Dein Team sieht auf dem Tablet sofort „Bereits mit Zackisch bezahlt“, erfasst die Bestellung genau einmal als unbare Online-Zahlung in der vorhandenen Kasse und tippt auf „In Kasse erfasst“."
                  : "Zackisch provides guests with a digital Order and Payment Confirmation (neither a POS receipt nor an invoice). Your staff see 'Already paid with Zackisch' on the tablet, enter the order once as a non-cash online payment in your POS, and tap 'Recorded in POS'."}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              href={`/${locale}/articles/pos-single-entry-workflow`}
            >
              <span>{isDe ? "Kassen-Leitfaden lesen" : "Read POS Guide"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Card>

        {/* Categories Section */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {isDe ? "Themenbereiche" : "Browse by Category"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {isDe
                ? "43 Schritt-für-Schritt-Anleitungen"
                : "43 Step-by-Step Guides"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {SUPPORT_CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                className="no-underline text-inherit block h-full"
              >
                <Card variant="default" padding={5} className="h-full hover:border-[var(--zk-border-strong)] transition-colors">
                  <div className="flex flex-col justify-between gap-3 h-full">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge label={cat.badge[locale]} variant="neutral" />
                        <ArrowRight className="size-4 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        {cat.title[locale]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cat.description[locale]}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground pt-2">
                      {isDe ? "Alle Anleitungen ansehen →" : "View all guides →"}
                    </span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Featured Guides */}
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {isDe
              ? "Wichtigste Anleitungen für den Start"
              : "Most Important Guides to Get Started"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {featured.map((art) => (
              <a
                key={art.slug}
                href={`/${locale}/articles/${art.slug}`}
                className="no-underline text-inherit block h-full"
              >
                <Card variant="default" padding={4} className="h-full hover:border-[var(--zk-border-strong)] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <CheckCircle className="size-4 shrink-0" />
                        <span>
                          {isDe ? "Empfohlene Anleitung" : "Featured Guide"}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-foreground">
                        {art.title[locale]}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {art.summary[locale]}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground mt-1" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* Direct Ticket Support CTA */}
        <Card variant="muted" padding={6}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {isDe
                  ? "Du hast eine individuelle Frage zu deinem Betrieb?"
                  : "Need personalized help with your venue?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isDe
                  ? "Erstelle direkt ein Support-Ticket. Unser Team sieht deinen Kontext und antwortet dir direkt im Ticketverlauf."
                  : "Open a support ticket directly. Our team reviews your context and replies right in your ticket thread."}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              href={`/${locale}/tickets`}
            >
              <Ticket className="size-4" />
              <span>{isDe ? "Zum Ticket-Portal" : "Open Ticket Portal"}</span>
            </Button>
          </div>
        </Card>
      </div>
    </SupportShell>
  );
}
