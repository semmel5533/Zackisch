"use client";

import React from "react";
import { Coins, Globe, EnvelopeSimple } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { Card, Badge, StatusDot } from "@/components/ui/primitives";

export default function SettingsPage() {
  const { currentRegion, regions } = useAdmin();

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--zk-text)]">
          Regionale Einstellungen & Parameter
        </h1>
        <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
          Konfiguration für Region {currentRegion.toUpperCase()} und Überblick über Expansionsmärkte.
        </p>
      </div>

      {/* Pricing & Business Policy Section */}
      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Gebührenmodell & Richtlinien
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="md" variant="muted">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  Grundgebühr
                </span>
                <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
                  0,00 €
                </div>
                <span className="text-xs text-[var(--zk-text-secondary)]">
                  Keine monatliche Fixgebühr für Betriebe
                </span>
              </div>
            </Card>

            <Card padding="md" variant="muted">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  Einrichtungsgebühr
                </span>
                <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
                  0,00 €
                </div>
                <span className="text-xs text-[var(--zk-text-secondary)]">
                  Kostenlose Registrierung und Bereitstellung
                </span>
              </div>
            </Card>

            <Card padding="md" variant="muted">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  Zackisch Plattformgebühr
                </span>
                <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
                  2,0 %
                </div>
                <span className="text-xs text-[var(--zk-text-secondary)]">
                  Nur bei tatsächlich erfolgter Bestellung
                </span>
              </div>
            </Card>
          </div>

          <Card padding="md" variant="muted">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold text-[var(--zk-text)]">
                  Partner-Provisionsanspruch
                </div>
                <div className="text-xs text-[var(--zk-text-secondary)]">
                  50 % der Zackisch-Plattformgebühr (entspricht rechnerisch 1 % der Umsatzbasis)
                </div>
              </div>
              <Badge variant="success">50 %</Badge>
            </div>
          </Card>
        </div>
      </Card>

      {/* Supported Regions */}
      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Geschäftsregionen
            </h2>
          </div>

          <div className="divide-y divide-[var(--zk-border)]">
            {(regions || []).map((r: any) => (
              <div
                key={r.code}
                className="py-3 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <StatusDot
                    variant={r.status === "active" ? "success" : "neutral"}
                    label={r.status === "active" ? "Aktiv" : "In Vorbereitung"}
                  />
                  <div>
                    <div className="text-sm font-semibold text-[var(--zk-text)]">
                      {r.name} ({r.code.toUpperCase()})
                    </div>
                    <div className="text-xs text-[var(--zk-text-secondary)]">
                      Währung: {r.currency} · Steuersätze: {r.taxRates.join("%, ")}% · Sprachen:{" "}
                      {r.supportedLocales.join(", ").toUpperCase()}
                    </div>
                  </div>
                </div>

                <Badge variant={r.status === "active" ? "success" : "neutral"}>
                  {r.status === "active" ? "Aktiv (Startmarkt)" : "In Vorbereitung"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* E-Mail & Google Workspace Status */}
      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <EnvelopeSimple className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Google Workspace E-Mail-Konfiguration
            </h2>
          </div>

          <dl className="divide-y divide-[var(--zk-border)] text-sm">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-medium text-[var(--zk-text)]">SMTP Relay Host</dt>
              <dd className="font-mono text-xs text-[var(--zk-text-secondary)]">
                smtp.gmail.com:587 (STARTTLS)
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-medium text-[var(--zk-text)]">SMTP Auth User</dt>
              <dd className="font-mono text-xs text-[var(--zk-text-secondary)]">
                selim@zackisch.com
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-medium text-[var(--zk-text)]">From-Absenderadresse</dt>
              <dd className="font-mono text-xs text-[var(--zk-text-secondary)]">
                noreply@zackisch.com
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-medium text-[var(--zk-text)]">Reply-To Adresse</dt>
              <dd className="font-mono text-xs text-[var(--zk-text-secondary)]">
                noreply@zackisch.com
              </dd>
            </div>
            <div className="py-2.5 flex items-center justify-between gap-4">
              <dt className="font-medium text-[var(--zk-text)]">App-Passwort Status</dt>
              <dd>
                <Badge variant="success">
                  In Convex Deployment synchronisiert (16 Zeichen)
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  );
}
