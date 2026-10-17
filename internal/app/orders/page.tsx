"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Receipt,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Bestell- und Zahlungsübersicht
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Reale Transaktionen, 2% Plattformgebühr und Zahlungsstatus in Region {currentRegion.toUpperCase()}.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === "all" ? "bg-white text-black font-semibold shadow-2xs" : "text-zinc-500 hover:text-black"
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setStatusFilter("in_progress")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === "in_progress" ? "bg-white text-black font-semibold shadow-2xs" : "text-zinc-500 hover:text-black"
            }`}
          >
            In Zubereitung
          </button>
          <button
            onClick={() => setStatusFilter("ready_for_pickup")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === "ready_for_pickup" ? "bg-white text-black font-semibold shadow-2xs" : "text-zinc-500 hover:text-black"
            }`}
          >
            Abholbereit
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              statusFilter === "completed" ? "bg-white text-black font-semibold shadow-2xs" : "text-zinc-500 hover:text-black"
            }`}
          >
            Abgeschlossen
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Bestellung</th>
                <th className="py-3.5 px-4">Typ / Tisch</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Gesamtbetrag</th>
                <th className="py-3.5 px-4">Zackisch (2%)</th>
                <th className="py-3.5 px-4">Stripe ID</th>
                <th className="py-3.5 px-6 text-right">Zeitstempel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!orders ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Lade Bestellungen...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Keine Bestellungen mit diesem Status vorhanden.
                  </td>
                </tr>
              ) : (
                filtered.map((o: any) => (
                  <tr key={o._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-bold text-zinc-900">
                        #{o.orderNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-800">
                        {o.type === "dine-in" ? "Vor Ort" : "Abholung"}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {o.tableNumber ? `Tisch ${o.tableNumber}` : "Ohne Tisch"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {o.status === "completed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Erledigt
                        </span>
                      )}
                      {o.status === "ready_for_pickup" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                          <Clock className="w-3 h-3" />
                          Abholbereit
                        </span>
                      )}
                      {o.status === "in_progress" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
                          <Clock className="w-3 h-3" />
                          In Zubereitung
                        </span>
                      )}
                      {o.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700">
                          <XCircle className="w-3 h-3" />
                          Storniert
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-num font-bold text-zinc-900 text-sm">
                      {formatEuro(o.total)}
                    </td>
                    <td className="py-4 px-4 font-num font-semibold text-emerald-700">
                      {formatEuro(o.zackischFee)}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-500">
                      {o.stripePaymentId ? o.stripePaymentId.slice(0, 16) + "..." : "—"}
                    </td>
                    <td className="py-4 px-6 text-right font-num text-zinc-400 text-[11px]">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString("de-DE") : "—"}
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
