"use client";

import React, { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  TrendingUp,
  Store,
  Receipt,
  Users,
  Mail,
  Handshake,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  RefreshCw,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminOverviewPage() {
  const { currentRegion, adminEmail } = useAdmin();
  const [testingSmtp, setTestingSmtp] = useState(false);

  // Queries
  const overview = useQuery((anyApi as any).admin.getRegionalOverview, {
    regionId: currentRegion,
  });

  const testSmtpAction = useAction((anyApi as any).emails.testSmtpConnection);

  const handleTestSmtp = async () => {
    setTestingSmtp(true);
    try {
      const res = await testSmtpAction({ testRecipient: adminEmail });
      if (res.success) {
        toast.success("Google Workspace SMTP Testnachricht erfolgreich versendet!");
      } else {
        toast.error(`SMTP-Fehler: ${res.message}`);
      }
    } catch (e: any) {
      toast.error(`Fehler beim Senden: ${e.message}`);
    } finally {
      setTestingSmtp(false);
    }
  };

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Region Deutschland (DE) Aktiv
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Willkommen in der Zackisch Zentrale
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Operative Übersicht für Betriebe und Gastronomie, Zahlungen, Partner und E-Mail-Marketing in deiner Region.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSmtp}
            disabled={testingSmtp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-50 transition-all shadow-2xs disabled:opacity-50"
          >
            {testingSmtp ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            SMTP-Verbindung testen
          </button>
          <Link
            href="/newsletter"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Newsletter verfassen
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* GMV */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Umsatzvolumen (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? formatEuro(overview.gmvCents) : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Gesamtes über QR abgewickeltes Bestellvolumen
          </p>
        </div>

        {/* Platform Revenue (2%) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Plattform-Gebühr (2%)</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? formatEuro(overview.platformFeeCents) : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Zackisch Einnahmen (2% pro relevanter Bestellung)
          </p>
        </div>

        {/* Partner Commission (50% of 2%) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Partner-Provision (50%)</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? formatEuro(overview.partnerCommissionCents) : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            50% der Plattformgebühr für regionale Partner
          </p>
        </div>

        {/* Betriebe */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Betriebe</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? (overview.totalOrganizations ?? overview.totalRestaurants) : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            {(overview?.activeOrganizations ?? overview?.activeRestaurants) || 0} mit abgeschlossenem Stripe Onboarding
          </p>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Bestellungen</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? overview.totalOrders : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Tisch- und Abholbestellungen in Region DE
          </p>
        </div>

        {/* Newsletter Subscribers */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Newsletter Abonnenten</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 font-num tracking-tight">
            {overview ? overview.subscriberCount : "—"}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Bestätigte Double-Opt-In Abonnenten
          </p>
        </div>
      </div>

      {/* System Infrastructure Status */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-zinc-900 mb-4">
          Infrastruktur & Anbieterstatus
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Google Workspace SMTP
            </div>
            <div className="text-[12px] text-zinc-500 space-y-0.5 mt-2">
              <div>Host: <span className="font-mono text-zinc-700">smtp-relay.gmail.com:587</span></div>
              <div>Absender: <span className="font-mono text-zinc-700">noreply@zackisch.com</span></div>
              <div>Reply-To: <span className="font-mono text-zinc-700">selim@zackisch.com</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Stripe Connect Standard
            </div>
            <div className="text-[12px] text-zinc-500 space-y-0.5 mt-2">
              <div>Modell: <span className="text-zinc-700 font-medium">Standard Connect</span></div>
              <div>Gebühr: <span className="text-zinc-700 font-medium">2% Plattformanteil</span></div>
              <div>Zahlungsabwicklung: <span className="text-zinc-700 font-medium">Betrieb trägt Kosten</span></div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Convex Cloud Backend
            </div>
            <div className="text-[12px] text-zinc-500 space-y-0.5 mt-2">
              <div>Region: <span className="text-zinc-700 font-medium">eu-west-1 (Frankfurt)</span></div>
              <div>Architektur: <span className="text-zinc-700 font-medium">Single DB, Regionstrennung</span></div>
              <div>Echtzeit: <span className="text-zinc-700 font-medium">Live Queries aktiv</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
