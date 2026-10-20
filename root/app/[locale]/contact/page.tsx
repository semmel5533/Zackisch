import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES_CONTENT } from "@/lib/content/pages-data";
import { constructMetadata } from "@/lib/seo";
import { EXTERNAL_URLS, type Locale } from "@/lib/content/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") return {};
  const locale = rawLocale as Locale;
  const content = PAGES_CONTENT[locale].contact;

  return constructMetadata({
    title: content.metaTitle,
    description: content.metaDescription,
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "de-de" && rawLocale !== "de-en") notFound();
  const locale = rawLocale as Locale;
  const isDe = locale === "de-de";
  const content = PAGES_CONTENT[locale].contact;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-16 border-b border-[#E5E5E2]">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-xs text-[#646464]">
            <li>
              <Link href={`/${locale}`} className="hover:text-[#111111]">
                {isDe ? "Startseite" : "Home"}
              </Link>
            </li>
            <li>/</li>
            <li className="font-semibold text-[#111111]">{content.title}</li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E5E5E2] text-[#111111]">
            {content.hero.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111]">
            {content.hero.h1}
          </h1>
          <p className="text-base sm:text-lg text-[#52525B] leading-relaxed">
            {content.hero.lead}
          </p>
        </div>
      </section>

      {/* Main Content: Direct Contact Cards */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Direct Email Card */}
          <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold text-sm">
                @
              </div>
              <h2 className="text-xl font-bold text-[#111111]">
                {isDe ? "Direkter E-Mail-Kontakt" : "Direct Email"}
              </h2>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                {isDe
                  ? "Schreibe uns deine Fragen zu Zackisch, deinem Lokal oder einer möglichen Zusammenarbeit direkt."
                  : "Send your questions about Zackisch, your hospitality venue, or partnerships directly to the founder."}
              </p>
              <div className="pt-2 font-mono text-sm font-semibold text-[#111111]">
                selim@zackisch.com
              </div>
            </div>
            <a
              href={EXTERNAL_URLS.email}
              className="w-full text-center px-6 py-3 rounded-full bg-[#111111] text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm"
            >
              {isDe ? "E-Mail an Gründer schreiben" : "Email Founder"}
            </a>
          </div>

          {/* Support Knowledge Base Card */}
          <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E5E5E2] text-[#111111] flex items-center justify-center font-bold text-sm">
                ?
              </div>
              <h2 className="text-xl font-bold text-[#111111]">
                {isDe ? "Hilfe & Wissensportal" : "Help & Documentation"}
              </h2>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                {isDe
                  ? "Ausführliche Schritt-für-Schritt-Anleitungen zur Menü-Einrichtung, Tischaufstellern, Küchenansicht und Kassenintegration."
                  : "Comprehensive step-by-step guides for menu creation, QR table stands, staff tablet setup, and POS workflows."}
              </p>
              <div className="pt-2 font-mono text-sm font-semibold text-[#111111]">
                support.zackisch.com
              </div>
            </div>
            <a
              href={EXTERNAL_URLS.support}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-6 py-3 rounded-full border border-[#E5E5E2] bg-white text-[#111111] text-xs sm:text-sm font-semibold hover:bg-[#F7F7F8] transition-all"
            >
              {isDe ? "Hilfeportal öffnen ↗" : "Open Help Center ↗"}
            </a>
          </div>

          {/* Location & Legal Headquarter Card */}
          <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#E5E5E2] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E5E5E2] text-[#111111] flex items-center justify-center font-bold text-sm">
                📍
              </div>
              <h2 className="text-xl font-bold text-[#111111]">
                {isDe ? "Standort & Region" : "Location & Hub"}
              </h2>
              <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
                {isDe
                  ? "Entwickelt und betrieben in Mannheim, Baden-Württemberg. Betreuung und Rollouts im deutschsprachigen Raum."
                  : "Engineered and operated in Mannheim, Germany. Supporting hospitality operators across the DACH region."}
              </p>
              <div className="pt-2 text-xs sm:text-sm text-[#646464]">
                Mannheim · Baden-Württemberg · Deutschland
              </div>
            </div>
            <Link
              href={`/${locale}/about`}
              className="w-full text-center px-6 py-3 rounded-full border border-[#E5E5E2] bg-white text-[#111111] text-xs sm:text-sm font-semibold hover:bg-[#F7F7F8] transition-all"
            >
              {isDe ? "Über das Team lesen" : "Read About Us"}
            </Link>
          </div>
        </div>

        {/* Transparency Box (Master brief requirement: no fake forms) */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5E5E2] max-w-3xl space-y-2">
          <h3 className="font-bold text-sm text-[#111111]">
            {isDe ? "Hinweis zur Kontaktaufnahme" : "Note on Contact Channels"}
          </h3>
          <p className="text-xs text-[#52525B] leading-relaxed">
            {isDe
              ? "Wir verzichten auf der Marketingwebsite bewusst auf Scheinformulare, die Nachrichten ohne echte Authentifizierung oder Bestätigung annehmen. Jede Nachricht über selim@zackisch.com landet direkt im Posteingang des Gründers und wird persönlich beantwortet."
              : "We intentionally avoid marketing form scripts that claim to send messages without verified routing. Inquiries to selim@zackisch.com land directly in the founder's inbox for a personal response."}
          </p>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="w-full bg-[#FAF9F6] border-t border-[#E5E5E2] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-[#111111]">
              {isDe
                ? "Möchtest du Zackisch direkt ausprobieren?"
                : "Want to try Zackisch right now?"}
            </h4>
            <p className="text-xs sm:text-sm text-[#646464] mt-1">
              {isDe
                ? "Registriere deinen Betrieb kostenlos und erstelle dein erstes Menü."
                : "Sign up for free and configure your first digital menu."}
            </p>
          </div>
          <a
            href={EXTERNAL_URLS.signup}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-[#111111] text-white text-sm font-semibold hover:bg-black transition-all shadow-sm"
          >
            {isDe ? "Kostenlos registrieren" : "Sign up free"}
          </a>
        </div>
      </section>
    </div>
  );
}
