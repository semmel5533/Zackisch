"use client";

import React from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  Storefront,
  Receipt,
  Coins,
  EnvelopeSimple,
  Handshake,
  ShieldCheck,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { Card, Badge, StatusDot, Spinner } from "@/components/ui/primitives";

export default function InternalOverviewPage() {
  const { currentRegion, regions, sessionToken } = useAdmin();
  const activeRegionObj = regions.find((r) => r.code === currentRegion);

  const stats = useQuery(
    (anyApi as any).admin.getRegionalStats,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const recentAudit = useQuery(
    (anyApi as any).admin.listAuditLogs,
    sessionToken ? { regionId: currentRegion, sessionToken, limit: 8 } : "skip"
  );

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: activeRegionObj?.currency || "EUR",
    }).format(cents / 100);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--zk-text)]">
            Operatives Regional-Dashboard
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Echtzeit-Kennzahlen, Plattformgebühren (2%), Partner-Provisionen (1% GMV) und Systemstatus für Region:{" "}
            <strong className="font-semibold text-[var(--zk-text)]">
              {activeRegionObj?.name || currentRegion.toUpperCase()}
            </strong>
          </p>
        </div>

        <Badge variant="success">
          <span className="inline-flex items-center gap-1.5">
            <StatusDot variant="success" label="Verbunden" />
            <span>Convex Live · {currentRegion.toUpperCase()}</span>
          </span>
        </Badge>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Aktive Gastronomiebetriebe
              </span>
              <Storefront className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? `${stats.activeBusinesses} / ${stats.totalBusinesses}` : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              Davon {stats ? stats.stripeVerifiedBusinesses : 0} mit verifiziertem Stripe Connect
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Gastronomie-Bruttoumsatz (GMV)
              </span>
              <Receipt className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? formatEuro(stats.grossVolumeCents) : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)] tabular-nums">
              Über {stats ? stats.totalOrders : 0} bezahlte Bestellungen
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Zackisch Plattformgebühr (2%)
              </span>
              <Coins className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? formatEuro(stats.platformFeeCents) : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)] tabular-nums">
              Netto nach Partner-Provisionen:{" "}
              {stats ? formatEuro(stats.netPlatformRevenueCents) : "—"}
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Vertriebspartner & Provisionen
              </span>
              <Handshake className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? formatEuro(stats.partnerCommissionLiabilityCents) : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)] tabular-nums">
              {stats ? stats.activePartners : 0} aktive Partner (50% Gebührenanteil = 1% GMV)
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Newsletter-Abonnenten
              </span>
              <EnvelopeSimple className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? stats.confirmedSubscribers : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              Double-Opt-In bestätigt in Region {currentRegion.toUpperCase()}
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--zk-text-secondary)]">
                Autorisierte Teammitglieder
              </span>
              <ShieldCheck className="size-4 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            </div>
            <div className="text-2xl font-bold text-[var(--zk-text)] tabular-nums">
              {stats ? stats.staffCount : "—"}
            </div>
            <div className="text-xs text-[var(--zk-text-secondary)]">
              Aktive Zugänge für Region {currentRegion.toUpperCase()}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Audit Trail */}
      <Card padding="md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Letzte Aktivitäten im regionalen Audit-Trail
            </h2>
            <a
              href="/audit"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--zk-link)] hover:underline"
            >
              <span>Alle Protokolle ansehen</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          {!recentAudit ? (
            <div className="py-10 flex justify-center">
              <Spinner label="Lade Audit-Protokoll..." />
            </div>
          ) : recentAudit.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--zk-text-secondary)]">
              Noch keine protokollierten Aktivitäten in dieser Region vorhanden.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--zk-border)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                    <th className="py-2.5 pr-4">Zeitpunkt</th>
                    <th className="py-2.5 px-4">Akteur</th>
                    <th className="py-2.5 px-4">Aktion</th>
                    <th className="py-2.5 pl-4">Zielobjekt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--zk-border)]">
                  {recentAudit.map((log: any) => (
                    <tr key={log._id} className="hover:bg-[var(--zk-surface-muted)]">
                      <td className="py-3 pr-4 text-xs text-[var(--zk-text-secondary)] tabular-nums whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("de-DE")}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[var(--zk-text)]">
                        {log.actorEmail}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral">{log.action}</Badge>
                      </td>
                      <td className="py-3 pl-4 font-mono text-xs text-[var(--zk-text-secondary)]">
                        {log.targetType}
                        {log.targetId ? ` (${log.targetId})` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
