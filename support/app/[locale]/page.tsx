"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SupportShell } from "@/components/SupportShell";
import {
  SUPPORT_CATEGORIES,
  getFeaturedArticles,
  searchArticles,
  type SupportLocale,
} from "@/lib/knowledge-base";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Receipt,
  Ticket,
  Sparkles,
} from "lucide-react";

export default function SupportHomePage() {
  const params = useParams();
  const locale: SupportLocale =
    params?.locale === "de-en" ? "de-en" : "de-de";
  const isDe = locale === "de-de";

  const [query, setQuery] = useState("");
  const featured = getFeaturedArticles();
  const searchResults = query.trim() ? searchArticles(locale, query) : [];

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
              ? "Schritt-für-Schritt-Anleitungen zur Einrichtung in 15 Minuten, zur einmaligen Kassenerfassung (POS) und zu Stripe Connect Direktzahlungen."
              : "Step-by-step guides for 15-minute setup, single-entry POS recording, and Stripe Connect direct charges."}
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-[#495A52] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                isDe
                  ? "Suche nach Kasse, POS, TSE, Stripe, Trinkgeld, QR-Druck, Tablet..."
                  : "Search for POS, receipt, Stripe, tips, QR printing, tablet..."
              }
              className="w-full h-13 pl-12 pr-4 rounded-full bg-white text-[#14231D] placeholder:text-[#6C7B73] text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#DCEFE5]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#DCEFE5]">
            <span>{isDe ? "Häufig gesucht:" : "Popular searches:"}</span>
            {["Kasse erfassen", "Kein Kassenbeleg", "2 % Provision", "QR Ruhezone", "Tablet koppeln"].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3 py-1 rounded-full bg-[#245740]/80 hover:bg-[#245740] transition-colors cursor-pointer"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Live Search Results */}
        {query.trim() !== "" && (
          <section className="bg-white rounded-3xl border border-[#DDD7CA] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {isDe
                  ? `Suchergebnisse für „${query}“ (${searchResults.length})`
                  : `Search results for "${query}" (${searchResults.length})`}
              </h2>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-semibold text-[#173C2B] hover:underline"
              >
                {isDe ? "Suche zurücksetzen" : "Clear search"}
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-[#495A52]">
                  {isDe
                    ? "Kein passender Artikel gefunden. Unser Team hilft dir gerne direkt per Support-Ticket weiter."
                    : "No matching article found. Our team is happy to help you via a support ticket."}
                </p>
                <Link
                  href={`/${locale}/tickets`}
                  className="inline-flex h-10 px-5 rounded-full bg-[#173C2B] text-white text-xs font-semibold items-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isDe ? "Support-Ticket erstellen" : "Create Support Ticket"}</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#DDD7CA]">
                {searchResults.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${locale}/articles/${article.slug}`}
                    className="py-4 flex items-start justify-between gap-4 hover:bg-[#F7F5EF]/60 px-3 rounded-2xl transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-[#14231D]">
                        {article.title[locale]}
                      </h3>
                      <p className="text-xs text-[#495A52]">
                        {article.summary[locale]}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#245740] shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

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
            <h2 className="text-xl font-bold">
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
          <h2 className="text-xl font-bold">
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
            <h2 className="text-lg font-bold">
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
