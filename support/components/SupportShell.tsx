"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SupportLocale } from "@/lib/knowledge-base";
import { BookOpen, Ticket, ExternalLink } from "lucide-react";
import {
  resolveBrandAsset,
  RegionLanguageSelector,
  ToastProvider,
} from "@zackisch/design-system";

export function SupportShell({
  locale,
  children,
}: {
  locale: SupportLocale;
  children: ReactNode;
}) {
  const pathname = usePathname() || `/${locale}`;
  const router = useRouter();
  const isDe = locale === "de-de";

  const handleApplyLocale = ({
    languageCode,
  }: {
    regionCode: string;
    languageCode: string;
  }) => {
    const targetLocale: SupportLocale =
      languageCode === "en" || languageCode === "de-en" ? "de-en" : "de-de";
    document.cookie = `zackisch_locale=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      localStorage.setItem("zackisch_locale", targetLocale);
    } catch {
      /* Cookie remains authoritative when storage is unavailable. */
    }
    const nextPath = pathname.replace(/^\/(de-de|de-en)/, `/${targetLocale}`);
    router.push(nextPath.startsWith("/de-") ? nextPath : `/${targetLocale}`);
  };

  return (
    <ToastProvider locale={isDe ? "de" : "en"}>
      <div className="min-h-screen flex flex-col bg-(--zds-surface-page) text-(--zds-text-primary)">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-(--zds-border-subtle)">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href={`/${locale}`} className="flex items-center gap-2.5">
                <img
                  src={resolveBrandAsset("combinationMarkSvg", { site: "support" })}
                  alt="Zackisch"
                  className="h-7 w-auto"
                />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-(--zds-surface-muted) border border-(--zds-border-subtle) text-(--zds-text-primary)">
                  {isDe ? "Hilfe & Support" : "Help & Support"}
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                <Link
                  href={`/${locale}`}
                  className="px-3 py-2 rounded-full hover:bg-(--zds-surface-muted) text-(--zds-text-secondary) hover:text-(--zds-text-strong) transition-colors inline-flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-(--zds-text-primary)" />
                  <span>{isDe ? "Wissensdatenbank" : "Knowledge Base"}</span>
                </Link>
                <Link
                  href={`/${locale}/tickets`}
                  className="px-3 py-2 rounded-full hover:bg-(--zds-surface-muted) text-(--zds-text-secondary) hover:text-(--zds-text-strong) transition-colors inline-flex items-center gap-1.5"
                >
                  <Ticket className="w-4 h-4 text-(--zds-text-primary)" />
                  <span>{isDe ? "Support-Tickets" : "Support Tickets"}</span>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2.5">
              <RegionLanguageSelector
                showTrigger
                triggerVariant="compact"
                regionCode="de"
                languageCode={isDe ? "de" : "en"}
                onApply={handleApplyLocale}
              />
              <Link
                href={`/${locale}/tickets`}
                className="h-9 px-4 rounded-full bg-(--zds-action-primary) text-(--zds-action-primary-text) hover:bg-(--zds-action-primary-hover) text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{isDe ? "Ticket erstellen" : "Open Ticket"}</span>
              </Link>
              <a
                href="https://app.zackisch.com"
                className="hidden sm:inline-flex h-9 px-3.5 rounded-full border border-(--zds-border-subtle) bg-(--zds-surface-card) hover:bg-(--zds-surface-page) text-xs font-semibold text-(--zds-text-primary) items-center gap-1 transition-colors"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1">{children}</main>

        <footer className="bg-(--zds-surface-card) border-t border-(--zds-border-subtle) py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-(--zds-text-secondary)">
            <div className="space-y-1">
              <p className="font-semibold text-(--zds-text-strong) font-brand">
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
                className="hover:underline hover:text-(--zds-text-strong)"
              >
                {isDe ? "Impressum" : "Legal Notice"}
              </a>
              <a
                href={`https://zackisch.com/${locale}/privacy-policy`}
                className="hover:underline hover:text-(--zds-text-strong)"
              >
                {isDe ? "Datenschutz" : "Privacy Policy"}
              </a>
              <a
                href={`https://zackisch.com/${locale}/gtc`}
                className="hover:underline hover:text-(--zds-text-strong)"
              >
                {isDe ? "AGB" : "Terms"}
              </a>
              <a
                href={`https://zackisch.com/${locale}/data-processing`}
                className="hover:underline hover:text-(--zds-text-strong)"
              >
                {isDe ? "Auftragsverarbeitung (AVV)" : "Data Processing (DPA)"}
              </a>
              <a
                href={`https://zackisch.com/${locale}/accessibility`}
                className="hover:underline hover:text-(--zds-text-strong)"
              >
                {isDe ? "Barrierefreiheit" : "Accessibility"}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
