"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  ShieldCheck,
  Search,
  Filter,
  User,
  Activity,
  Calendar,
} from "lucide-react";

export default function AuditTrailPage() {
  const { currentRegion } = useAdmin();
  const [entityFilter, setEntityFilter] = useState("all");
  const [search, setSearch] = useState("");

  const auditLogs = useQuery((anyApi as any).audit.getAuditLogs, {
    regionId: currentRegion,
    entityType: entityFilter === "all" ? undefined : entityFilter,
    limit: 100,
  });

  const filtered = (auditLogs || []).filter((log: any) =>
    log.actorId.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Audit-Trail & Aktivitätshistorie
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Chronologische, filterbare Detaildokumentation aller relevanten Team- und Adminaktionen in Region {currentRegion.toUpperCase()}.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setEntityFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              entityFilter === "all" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Alle Entitäten
          </button>
          <button
            onClick={() => setEntityFilter("staff")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              entityFilter === "staff" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Mitarbeiter
          </button>
          <button
            onClick={() => setEntityFilter("partner")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              entityFilter === "partner" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Partner
          </button>
          <button
            onClick={() => setEntityFilter("newsletter")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              entityFilter === "newsletter" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Newsletter
          </button>
          <button
            onClick={() => setEntityFilter("restaurant")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              entityFilter === "restaurant" ? "bg-black text-white font-semibold" : "text-zinc-500 hover:text-black hover:bg-zinc-100"
            }`}
          >
            Betriebe
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Aktion / Akteur suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-1.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Akteur</th>
                <th className="py-3.5 px-4">Rolle</th>
                <th className="py-3.5 px-4">Aktion</th>
                <th className="py-3.5 px-4">Entität</th>
                <th className="py-3.5 px-4">Details (Sanitized JSON)</th>
                <th className="py-3.5 px-6 text-right">Zeitstempel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!auditLogs ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Lade Audit-Trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Keine Audit-Einträge gefunden.
                  </td>
                </tr>
              ) : (
                filtered.map((log: any) => (
                  <tr key={log._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-zinc-900">
                      {log.actorId}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-black text-xs">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-zinc-700">
                      {log.entityType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500 max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3.5 px-6 text-right font-num text-zinc-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString("de-DE")}
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
