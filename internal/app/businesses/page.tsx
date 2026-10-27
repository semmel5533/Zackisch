"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Storefront } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import {
  Card,
  Badge,
  StatusDot,
  TextField,
  Spinner,
} from "@/components/ui/primitives";

export default function BusinessesPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [search, setSearch] = useState("");

  const businesses = useQuery(
    (anyApi as any).admin.listRegionalBusinesses,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const filtered = (businesses || []).filter(
    (b: any) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      (b.referralPartnerCode &&
        b.referralPartnerCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-5 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Gastronomiebetriebe
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Alle registrierten Betriebe in Region {currentRegion.toUpperCase()} inkl. Stripe-Status und Partner-Zuordnung.
          </p>
        </div>

        <div className="w-full sm:w-80">
          <TextField
            type="search"
            label="Betrieb, Slug oder Partnercode suchen"
            hideLabel
            placeholder="Betrieb, Slug oder Partnercode suchen..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      <Card padding="none">
        {!businesses ? (
          <div className="py-16 flex justify-center">
            <Spinner label="Lade Betriebe..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-2">
            <Storefront className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
            <div className="text-base font-bold text-[var(--zk-text)]">
              Keine Betriebe gefunden
            </div>
            <p className="text-sm text-[var(--zk-text-secondary)]">
              Es wurden keine Betriebe in dieser Region gefunden.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--zk-border)] bg-[var(--zk-surface-muted)] text-xs font-semibold uppercase tracking-wider text-[var(--zk-text-secondary)]">
                  <th className="py-3 px-4">Betrieb & Slug</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Stripe Connect</th>
                  <th className="py-3 px-4">Partner-Code</th>
                  <th className="py-3 px-4">Gebühr</th>
                  <th className="py-3 px-4 text-right">Erstellt am</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--zk-border)]">
                {filtered.map((b: any) => (
                  <tr key={b._id} className="hover:bg-[var(--zk-surface-muted)]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--zk-text)]">
                        {b.name}
                      </div>
                      <div className="font-mono text-xs text-[var(--zk-text-secondary)]">
                        /{b.slug}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <StatusDot
                          variant={b.isActive ? "success" : "neutral"}
                          label={b.isActive ? "Aktiv" : "Pausiert"}
                        />
                        <span>{b.isActive ? "Aktiv" : "Pausiert"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {b.stripeOnboardingComplete ? (
                        <div className="inline-flex items-center gap-1.5">
                          <StatusDot variant="success" label="Verifiziert" />
                          <span>Verifiziert</span>
                        </div>
                      ) : (
                        <Badge variant="warning">Ausstehend</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {b.referralPartnerCode ? (
                        <Badge variant="neutral">{b.referralPartnerCode}</Badge>
                      ) : (
                        <span className="text-[var(--zk-text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[var(--zk-text)] tabular-nums">
                      2,0 % (0 € Fix)
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-[var(--zk-text-secondary)] tabular-nums whitespace-nowrap">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("de-DE")
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
