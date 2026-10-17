"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Store,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
} from "lucide-react";

export default function BusinessesPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [search, setSearch] = useState("");

  const businesses = useQuery(
    (anyApi as any).admin.listRegionalBusinesses,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const filtered = (businesses || []).filter((r: any) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.address && r.address.toLowerCase().includes(search.toLowerCase())) ||
    (r.partnerCode && r.partnerCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Betriebs- & Gastronomieverwaltung
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Alle registrierten Betriebe (Restaurants, Cafés, Imbisse, Bars) und Speisekarten in Region {currentRegion.toUpperCase()}.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Betrieb suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Businesses Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Betrieb</th>
                <th className="py-3.5 px-4">Stripe Onboarding</th>
                <th className="py-3.5 px-4">Tische / QR</th>
                <th className="py-3.5 px-4">Modus</th>
                <th className="py-3.5 px-4">Partner-Code</th>
                <th className="py-3.5 px-6 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!businesses ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Lade Betriebe...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Keine Betriebe in dieser Region gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
                        <Store className="w-4 h-4 text-zinc-400 shrink-0" />
                        {r.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 pl-6">{r.address || "Keine Adresse angegeben"}</div>
                    </td>
                    <td className="py-4 px-4">
                      {r.stripeOnboardingComplete ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Aktiv
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
                          <AlertCircle className="w-3 h-3" />
                          Ausstehend
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-num font-semibold text-zinc-800">
                      {r.tablesCount} Tische
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1.5">
                        {r.isToStayEnabled !== false && (
                          <span className="text-[10px] font-medium bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
                            Vor Ort
                          </span>
                        )}
                        {r.isToGoEnabled && (
                          <span className="text-[10px] font-medium bg-zinc-100 px-2 py-0.5 rounded text-zinc-700">
                            Abholung
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {r.partnerCode ? (
                        <span className="font-mono text-[11px] font-semibold bg-zinc-100 px-2 py-0.5 rounded text-zinc-800">
                          {r.partnerCode}
                        </span>
                      ) : (
                        <span className="text-zinc-400 text-[11px]">Direkt</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`https://app.zackisch.com/menu/${r._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
                      >
                        Menü ansehen <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
