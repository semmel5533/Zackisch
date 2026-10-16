"use client";

import React from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Settings,
  Globe,
  Coins,
  Shield,
  Mail,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function SettingsPage() {
  const { currentRegion, regions } = useAdmin();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Regionale Einstellungen & Parameter
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Konfiguration für Region {currentRegion.toUpperCase()} und Überblick über Expansionsmärkte.
        </p>
      </div>

      {/* Pricing & Business Policy Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Coins className="w-4 h-4 text-zinc-500" />
          Gebührenmodell & Richtlinien
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Grundgebühr</span>
            <div className="text-2xl font-extrabold text-zinc-900 font-num mt-1">0,00 €</div>
            <p className="text-xs text-zinc-500 mt-1">Keine monatliche Fixgebühr für Betriebe</p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Einrichtungsgebühr</span>
            <div className="text-2xl font-extrabold text-zinc-900 font-num mt-1">0,00 €</div>
            <p className="text-xs text-zinc-500 mt-1">Kostenlose Registrierung und Bereitstellung</p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Zackisch Plattformgebühr</span>
            <div className="text-2xl font-extrabold text-zinc-900 font-num mt-1">2,0 %</div>
            <p className="text-xs text-zinc-500 mt-1">Nur bei tatsächlich erfolgter Bestellung</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-900">Partner-Provisionsanspruch</div>
            <div className="text-xs text-zinc-500">50 % der Zackisch-Plattformgebühr (entspricht rechnerisch 1 % der Umsatzbasis)</div>
          </div>
          <span className="font-num text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
            50 %
          </span>
        </div>
      </div>

      {/* Supported Regions */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-500" />
          Geschäftsregionen
        </h3>

        <div className="space-y-3">
          {(regions || []).map((r: any) => (
            <div
              key={r.code}
              className="p-4 rounded-xl border border-zinc-200/80 flex items-center justify-between bg-zinc-50/30"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold bg-zinc-200 text-black px-2 py-1 rounded">
                  {r.code.toUpperCase()}
                </span>
                <div>
                  <div className="text-sm font-bold text-zinc-900">{r.name}</div>
                  <div className="text-xs text-zinc-500">
                    Währung: {r.currency} · Steuersätze: {r.taxRates.join("%, ")}% · Sprachen: {r.supportedLocales.join(", ").toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                {r.status === "active" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aktiv (Startmarkt)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600">
                    <Clock className="w-3.5 h-3.5" /> In Vorbereitung
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E-Mail & Google Workspace Status */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-zinc-500" />
          Google Workspace E-Mail-Konfiguration
        </h3>

        <div className="space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="font-medium text-zinc-500">SMTP Relay Host</span>
            <span className="font-mono font-semibold text-zinc-900">smtp.gmail.com:587 (STARTTLS)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="font-medium text-zinc-500">SMTP Auth User</span>
            <span className="font-mono font-semibold text-zinc-900">selim@zackisch.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="font-medium text-zinc-500">From-Absenderadresse</span>
            <span className="font-mono font-semibold text-zinc-900">noreply@zackisch.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-100">
            <span className="font-medium text-zinc-500">Reply-To Adresse</span>
            <span className="font-mono font-semibold text-zinc-900">noreply@zackisch.com</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-medium text-zinc-500">App-Passwort Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> In Convex Deployment synchronisiert (16 Zeichen)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
