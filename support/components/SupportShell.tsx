"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SupportLocale } from "@/lib/knowledge-base";
import { BookOpen, Ticket, ExternalLink, Globe } from "lucide-react";
import { BRAND_ASSETS } from "@zackisch/design-system";

export function SupportShell({
  locale,
  children,
}: {
  locale: SupportLocale;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isDe = locale === "de-de";
  const alternateLocale: SupportLocale = isDe ? "de-en" : "de-de";
  const alternatePath = pathname
    ? pathname.replace(/^\/(de-de|de-en)/, `/${alternateLocale}`)
    : `/${alternateLocale}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#14231D]">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#DDD7CA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <img
                src={BRAND_ASSETS.combinationMarkSvg}
                alt="Zackisch"
                className="h-7 w-auto"
              />
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DCEFE5] text-[#173C2B]">
                {isDe ? "Hilfe & Support" : "Help & Support"}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href={`/${locale}`}
                className="px-3 py-2 rounded-full hover:bg-[#ECE7DC] transition-colors inline-flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-[#245740]" />
                <span>{isDe ? "Wissensdatenbank" : "Knowledge Base"}</span>
              </Link>
              <Link
                href={`/${locale}/tickets`}
                className="px-3 py-2 rounded-full hover:bg-[#ECE7DC] transition-colors inline-flex items-center gap-1.5"
              >
                <Ticket className="w-4 h-4 text-[#245740]" />
                <span>{isDe ? "Support-Tickets" : "Support Tickets"}</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={alternatePath}
              className="h-9 px-3 rounded-full border border-[#DDD7CA] bg-white hover:bg-[#F7F5EF] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#495A52]" />
              <span>{isDe ? "DE → EN" : "EN → DE"}</span>
            </Link>
            <Link
              href={`/${locale}/tickets`}
              className="h-9 px-4 rounded-full bg-[#173C2B] text-white hover:bg-[#245740] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{isDe ? "Ticket erstellen" : "Open Ticket"}</span>
            </Link>
            <a
              href="https://app.zackisch.com"
              className="hidden sm:inline-flex h-9 px-3.5 rounded-full border border-[#DDD7CA] bg-white hover:bg-[#F7F5EF] text-xs font-semibold items-center gap-1 transition-colors"
            >
              <span>Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-[#DDD7CA] py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#495A52]">
          <div className="space-y-1">
            <p className="font-semibold text-[#14231D]">
              Zackisch Support Center (support.zackisch.com)
            </p>
            <p>
              {isDe
                ? "Selbstbedienungs-Hilfe und direkter Ticket-Support für Gastronomiebetriebe."
                : "Self-service knowledge base and direct ticket support for hospitality venues."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`https://zackisch.com/${locale}/legal-notice`}
              className="hover:underline"
            >
              {isDe ? "Impressum" : "Legal Notice"}
            </a>
            <a
              href={`https://zackisch.com/${locale}/privacy-policy`}
              className="hover:underline"
            >
              {isDe ? "Datenschutz" : "Privacy Policy"}
            </a>
            <a
              href={`https://zackisch.com/${locale}/gtc`}
              className="hover:underline"
            >
              {isDe ? "AGB" : "Terms"}
            </a>
            <a
              href={`https://zackisch.com/${locale}/data-processing`}
              className="hover:underline"
            >
              {isDe ? "Auftragsverarbeitung (AVV)" : "Data Processing (DPA)"}
            </a>
            <a
              href={`https://zackisch.com/${locale}/accessibility`}
              className="hover:underline"
            >
              {isDe ? "Barrierefreiheit" : "Accessibility"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
