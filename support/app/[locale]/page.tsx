import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SupportShell } from "@/components/SupportShell";
import { SupportSearch } from "@/components/SupportSearch";
import {
  SUPPORT_CATEGORIES,
  getFeaturedArticles,
  type SupportLocale,
} from "@/lib/knowledge-base";
import { BRAND_ASSETS } from "@zackisch/design-system";
import {
  ArrowRight,
  CheckCircle2,
  Receipt,
  Ticket,
  Sparkles,
} from "lucide-react";

export function generateStaticParams() {
  return [{ locale: "de-de" }, { locale: "de-en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de-de" && locale !== "de-en") {
    return {};
  }
  const isDe = locale === "de-de";

  const title = isDe
    ? "Zackisch Hilfe & Support — Wissensdatenbank & Anleitungen"
    : "Zackisch Help & Support — Knowledge Base & Guides";
  const description = isDe
    ? "Schritt-für-Schritt-Anleitungen zur einfachen Einrichtung, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
    : "Step-by-step guides for simple onboarding, single-entry POS recording, and Stripe Connect direct charges.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://support.zackisch.com/${locale}`,
      languages: {
        "de-DE": "https://support.zackisch.com/de-de",
        "en-DE": "https://support.zackisch.com/de-en",
        "x-default": "https://support.zackisch.com/de-de",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://support.zackisch.com/${locale}`,
      siteName: "Zackisch",
      images: [BRAND_ASSETS.ogImage],
      locale: isDe ? "de_DE" : "en_US",
      type: "website",
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

export default async function SupportHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") {
    notFound();
  }
  const locale: SupportLocale = rawLocale;
  const isDe = locale === "de-de";
  const featured = getFeaturedArticles();

  return (
    <SupportShell locale={locale}>
      {/* Hero & Search */}
      <section className="bg-[#192C25] text-white py-14 sm:py-20 border-b border-[#245740]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#245740] text-[#DCEFE5] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isDe
                ? "Selbstbedienungs-Hilfe für Gastronomen & Teams"
                : "Self-Service Help Center for Restaurants & Teams"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {isDe
              ? "Wie können wir deinem Betrieb heute helfen?"
              : "How can we help your restaurant today?"}
          </h1>
          <p className="text-sm sm:text-base text-[#DCEFE5]/90 max-w-2xl mx-auto">
            {isDe
              ? "Schritt-für-Schritt-Anleitungen zur einfachen Einrichtung, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
              : "Step-by-step guides for simple onboarding, single-entry POS recording, and Stripe Connect direct charges."}
          </p>

          <SupportSearch locale={locale} />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Critical POS & Fiscal Clarity Callout */}
        <section className="bg-[#DCEFE5]/60 border border-[#BFC8BE] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2B]">
              <Receipt className="w-4 h-4" />
              <span>
                {isDe
                  ? "Wichtiger Ablauf für deinen Kassen-Alltag (POS)"
                  : "Essential Daily POS Workflow"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#14231D]">
              {isDe
                ? "Deine bestehende Kasse bleibt: Jede bezahlte Bestellung einmalig erfassen"
                : "Your existing POS stays: Record every paid order once"}
            </h2>
            <p className="text-xs sm:text-sm text-[#495A52] leading-relaxed">
              {isDe
                ? "Zackisch stellt Gästen eine digitale Bestell- und Zahlungsbestätigung bereit (kein Kassenbeleg und keine Rechnung). Dein Team sieht auf dem Tablet sofort „Bereits mit Zackisch bezahlt“, erfasst die Bestellung genau einmal als unbare Online-Zahlung in der vorhandenen Kasse und tippt auf „In Kasse erfasst“."
                : "Zackisch provides guests with a digital Order and Payment Confirmation (neither a POS receipt nor an invoice). Your staff see 'Already paid with Zackisch' on the tablet, enter the order once as a non-cash online payment in your POS, and tap 'Recorded in POS'."}
            </p>
          </div>
          <Link
            href={`/${locale}/articles/pos-single-entry-workflow`}
            className="h-11 px-5 rounded-full bg-[#173C2B] text-white hover:bg-[#245740] text-xs font-semibold inline-flex items-center gap-2 shrink-0 transition-colors"
          >
            <span>{isDe ? "Kassen-Leitfaden lesen" : "Read POS Guide"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Categories Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#14231D]">
              {isDe ? "Themenbereiche" : "Browse by Category"}
            </h2>
            <span className="text-xs font-medium text-[#495A52]">
              {isDe ? "43 Schritt-für-Schritt-Anleitungen" : "43 Step-by-Step Guides"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUPPORT_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${locale}/categories/${cat.slug}`}
                className="bg-white rounded-3xl border border-[#DDD7CA] p-6 hover:border-[#245740] hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECE7DC] text-[#14231D]">
                      {cat.badge[locale]}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#245740]" />
                  </div>
                  <h3 className="text-base font-bold text-[#14231D]">
                    {cat.title[locale]}
                  </h3>
                  <p className="text-xs text-[#495A52] leading-relaxed">
                    {cat.description[locale]}
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#173C2B] inline-flex items-center gap-1">
                  {isDe ? "Alle Anleitungen ansehen" : "View all guides"} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Tutorials */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#14231D]">
            {isDe
              ? "Wichtigste Anleitungen für den Start"
              : "Most Important Guides to Get Started"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((art) => (
              <Link
                key={art.slug}
                href={`/${locale}/articles/${art.slug}`}
                className="bg-white rounded-2xl border border-[#DDD7CA] p-5 hover:border-[#245740] transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#245740]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isDe ? "Empfohlene Anleitung" : "Featured Guide"}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#14231D]">
                    {art.title[locale]}
                  </h3>
                  <p className="text-xs text-[#495A52] line-clamp-2">
                    {art.summary[locale]}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#245740] shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Direct Ticket Support CTA */}
        <section className="bg-white rounded-3xl border border-[#DDD7CA] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-[#14231D]">
              {isDe
                ? "Du hast eine individuelle Frage zu deinem Betrieb?"
                : "Need personalized help with your venue?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#495A52]">
              {isDe
                ? "Erstelle direkt ein Support-Ticket. Unser Team sieht deinen Kontext und antwortet dir direkt im Ticketverlauf."
                : "Open a support ticket directly. Our team reviews your context and replies right in your ticket thread."}
            </p>
          </div>
          <Link
            href={`/${locale}/tickets`}
            className="h-11 px-6 rounded-full bg-[#173C2B] text-white hover:bg-[#245740] text-xs font-semibold inline-flex items-center gap-2 shrink-0 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span>{isDe ? "Zum Ticket-Portal" : "Open Ticket Portal"}</span>
          </Link>
        </section>
      </div>
    </SupportShell>
  );
}
