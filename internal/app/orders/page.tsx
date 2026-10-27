"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Receipt } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import {
  Card,
  Badge,
  StatusDot,
  SegmentedControl,
  Spinner,
} from "@/components/ui/primitives";

export default function OrdersPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = useQuery(
    (anyApi as any).admin.listRegionalOrders,
    sessionToken ? { regionId: currentRegion, sessionToken, limit: 100 } : "skip"
  );

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const filtered = (orders || []).filter((o: any) => {
    if (statusFilter === "all") return true;
    return o.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Bestell- und Zahlungsübersicht
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Reale Transaktionen, 2% Plattformgebühr und Zahlungsstatus in Region{" "}
            {currentRegion.toUpperCase()}.
          </p>
        </div>

        <SegmentedControl
          label="Bestellstatus filtern"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "Alle" },
            { value: "in_progress", label: "In Zubereitung" },
            { value: "ready_for_pickup", label: "Abholbereit" },
            { value: "completed", label: "Abgeschlossen" },
          ]}
        />
      </div>

      <Card padding="none">
        {!orders ? (
          <div className="py-16 flex justify-center">
            <Spinner label="Lade Bestellungen..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-2">
            <Receipt className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <div className="text-base font-bold text-[var(--zk-text)]">
              Keine Bestellungen vorhanden
            </div>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              Es wurden keine Bestellungen mit diesem Status in dieser Region gefunden.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                  <th className="py-3 px-4">Bestellung</th>
                  <th className="py-3 px-4">Typ / Tisch</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Gesamtbetrag</th>
                  <th className="py-3 px-4">Zackisch (2%)</th>
                  <th className="py-3 px-4">Stripe ID</th>
                  <th className="py-3 px-4 text-right">Zeitstempel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {filtered.map((o: any) => (
                  <tr key={o._id} className="hover:bg-[var(--zk-surface-muted)]">
                    <td className="py-3 px-4 font-mono font-bold text-[var(--zk-text)] tabular-nums">
                      #{o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--zk-text)]">
                        {o.type === "dine-in" ? "Vor Ort" : "Abholung"}
                      </div>
                      <div className="text-xs text-[var(--zk-text-secondary)]">
                        {o.tableNumber ? `Tisch ${o.tableNumber}` : "Ohne Tisch"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {o.status === "completed" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <StatusDot variant="success" label="Erledigt" />
                          <span>Erledigt</span>
                        </div>
                      ) : o.status === "ready_for_pickup" ? (
                        <Badge variant="info">Abholbereit</Badge>
                      ) : o.status === "in_progress" ? (
                        <Badge variant="warning">In Zubereitung</Badge>
                      ) : o.status === "cancelled" ? (
                        <Badge variant="error">Storniert</Badge>
                      ) : (
                        <span>{o.status}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--zk-text)] tabular-nums">
                      {formatEuro(o.total)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--zk-text)] tabular-nums">
                      {formatEuro(o.zackischFee)}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--zk-text-secondary)]">
                      {o.stripePaymentId
                        ? `${o.stripePaymentId.slice(0, 16)}...`
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-[var(--zk-text-secondary)] tabular-nums whitespace-nowrap">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("de-DE")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
