"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SupportLocale } from "@/lib/knowledge-base";
import { Badge, Button, Divider } from "@/components/ui/primitives";
import { BookOpen, Ticket, Globe, ArrowSquareOut } from "@phosphor-icons/react";

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

  const isTicketsActive = Boolean(pathname?.includes("/tickets"));

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-foreground">
      {/* Header */}
      <header
        aria-label="Zackisch Support Navigation"
        className="sticky top-0 z-40 bg-surface border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 min-w-0">
            <a
              href={`/${locale}`}
              className="flex items-center gap-3 text-foreground no-underline"
            >
              <img
                src="https://zackisch.com/brand/logo/lockups/signet--transparent--standard.svg"
                alt="Zackisch"
                className="size-7 rounded shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-base tracking-tight">
                  Zackisch Support
                </span>
                <span className="text-xs text-muted-foreground">
                  support.zackisch.com
                </span>
              </div>
            </a>

            <Badge
              label={isDe ? "Hilfe & Support" : "Help & Support"}
              variant="neutral"
              className="hidden sm:inline-flex"
            />

            <nav className="flex flex-wrap items-center gap-1" aria-label="Support Areas">
              <a
                href={`/${locale}`}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold no-underline transition-colors ${
                  !isTicketsActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <BookOpen className="size-4 shrink-0" />
                <span>{isDe ? "Wissensdatenbank" : "Knowledge Base"}</span>
              </a>
              <a
                href={`/${locale}/tickets`}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold no-underline transition-colors ${
                  isTicketsActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <Ticket className="size-4 shrink-0" />
                <span>{isDe ? "Support-Tickets" : "Support Tickets"}</span>
              </a>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              href={alternatePath}
            >
              <Globe className="size-4" />
              <span>{isDe ? "DE → EN" : "EN → DE"}</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              href={`/${locale}/tickets`}
            >
              <Ticket className="size-4" />
              <span>{isDe ? "Ticket erstellen" : "Open Ticket"}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href="https://app.zackisch.com"
            >
              <span>Dashboard</span>
              <ArrowSquareOut className="size-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-6 w-full">{children}</div>

          <footer className="flex flex-col gap-4 pt-6">
            <Divider />
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm text-foreground">
                  Zackisch Support Center (support.zackisch.com)
                </span>
                <span className="text-sm text-muted-foreground">
                  {isDe
                    ? "Selbstbedienungs-Hilfe und direkter Ticket-Support für Gastronomiebetriebe."
                    : "Self-service knowledge base and direct ticket support for hospitality venues."}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  href={`https://zackisch.com/${locale}/legal-notice`}
                >
                  {isDe ? "Impressum" : "Legal Notice"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  href={`https://zackisch.com/${locale}/privacy-policy`}
                >
                  {isDe ? "Datenschutz" : "Privacy Policy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  href={`https://zackisch.com/${locale}/gtc`}
                >
                  {isDe ? "AGB" : "Terms"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  href={`https://zackisch.com/${locale}/data-processing`}
                >
                  {isDe ? "Auftragsverarbeitung (AVV)" : "Data Processing (DPA)"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  href={`https://zackisch.com/${locale}/accessibility`}
                >
                  {isDe ? "Barrierefreiheit" : "Accessibility"}
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
