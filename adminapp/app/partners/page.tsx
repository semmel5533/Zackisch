"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAdmin } from "@/lib/admin-context";
import {
  Handshake,
  Plus,
  Coins,
  Store,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function PartnersPage() {
  const { currentRegion, adminEmail } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState<any>(null);

  const [partnerCode, setPartnerCode] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerIban, setPartnerIban] = useState("");

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState("2026-10");
  const [payoutNotes, setPayoutNotes] = useState("");

  const partners = useQuery((anyApi as any).partners.listPartners, {
    regionId: currentRegion,
  });

  const payouts = useQuery((anyApi as any).partners.listPayouts, {
    regionId: currentRegion,
  });

  const createPartnerMutation = useMutation((anyApi as any).partners.createPartner);
  const recordPayoutMutation = useMutation((anyApi as any).partners.recordPayout);

  const formatEuro = (cents: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(cents / 100);
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPartnerMutation({
        code: partnerCode,
        name: partnerName,
        email: partnerEmail,
        regionId: currentRegion,
        iban: partnerIban || undefined,
        actorEmail: adminEmail,
      });
      toast.success(`Partner ${partnerName} (${partnerCode}) angelegt!`);
      setShowCreateModal(false);
      setPartnerCode("");
      setPartnerName("");
      setPartnerEmail("");
      setPartnerIban("");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  const handleRecordPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayoutModal) return;

    try {
      const cents = Math.round(parseFloat(payoutAmount) * 100);
      await recordPayoutMutation({
        partnerId: showPayoutModal._id,
        regionId: currentRegion,
        amountCents: cents,
        period: payoutPeriod,
        notes: payoutNotes || undefined,
        actorEmail: adminEmail,
      });
      toast.success("Auszahlung erfolgreich gebucht!");
      setShowPayoutModal(null);
      setPayoutAmount("");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Vertriebspartner & Provisionen
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Partner-Vergütung: 50% der Zackisch-Plattformgebühr (1% des Gastronomie-Umsatzes).
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Partner anlegen
        </button>
      </div>

      {/* Partners List */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Aktive Vertriebspartner</h3>
          <span className="text-xs text-zinc-500">{partners?.length || 0} Partner registriert</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3.5 px-6">Code & Partner</th>
                <th className="py-3.5 px-4">Vermittelte Betriebe</th>
                <th className="py-3.5 px-4">Provisionssatz</th>
                <th className="py-3.5 px-4">Verdient</th>
                <th className="py-3.5 px-4">Ausbezahlt</th>
                <th className="py-3.5 px-4">IBAN</th>
                <th className="py-3.5 px-6 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!partners ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Lade Partner...
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    Keine Partner für Region {currentRegion.toUpperCase()} hinterlegt.
                  </td>
                </tr>
              ) : (
                partners.map((p: any) => (
                  <tr key={p._id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-zinc-100 px-2 py-0.5 rounded text-black">
                          {p.code}
                        </span>
                        <span className="font-semibold text-zinc-900 text-sm">{p.name}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">{p.email}</div>
                    </td>
                    <td className="py-4 px-4 font-num font-semibold text-zinc-800">
                      {p.referredOrganizationsCount ?? p.referredRestaurantsCount} Betriebe
                    </td>
                    <td className="py-4 px-4 font-num text-zinc-700 font-medium">
                      50% (1% GMV)
                    </td>
                    <td className="py-4 px-4 font-num font-bold text-zinc-900 text-sm">
                      {formatEuro(p.totalEarnedCents)}
                    </td>
                    <td className="py-4 px-4 font-num font-semibold text-emerald-700">
                      {formatEuro(p.totalPaidCents)}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-zinc-500">
                      {p.iban ? p.iban.slice(0, 10) + "..." : "—"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setShowPayoutModal(p)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:text-black hover:bg-zinc-100 transition-colors"
                      >
                        Auszahlung buchen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payouts Ledger */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">Auszahlungs-Historie (Ledger)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50/75 border-b border-zinc-200/80 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-3 px-6">Zeitpunkt</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Betrag</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6">Notizen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {!payouts || payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-400">
                    Bisher keine Auszahlungen verbucht.
                  </td>
                </tr>
              ) : (
                payouts.map((py: any) => (
                  <tr key={py._id} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-6 font-num text-zinc-700">
                      {new Date(py.createdAt).toLocaleDateString("de-DE")}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-900">{py.period}</td>
                    <td className="py-3 px-4 font-num font-bold text-emerald-700 text-sm">
                      {formatEuro(py.amountCents)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Ausbezahlt
                      </span>
                    </td>
                    <td className="py-3 px-6 text-zinc-500">{py.notes || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Partner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">Neuen Vertriebspartner anlegen</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Erstelle einen individuellen Partnercode für die regionale Gastronomie-Akquise.
            </p>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Partner-Code (Empfehlungscode)</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. BERLIN-01"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-black uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Name / Firma</label>
                <input
                  type="text"
                  required
                  placeholder="z.B. Gastro Partner Nord"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">E-Mail-Adresse</label>
                <input
                  type="email"
                  required
                  placeholder="partner@example.de"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">IBAN (optional)</label>
                <input
                  type="text"
                  placeholder="DE89 3704 0044 0532 0130 00"
                  value={partnerIban}
                  onChange={(e) => setPartnerIban(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800"
                >
                  Partner anlegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-1">
              Auszahlung für {showPayoutModal.name}
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Partner-Code: <span className="font-mono font-bold text-black">{showPayoutModal.code}</span>
            </p>

            <form onSubmit={handleRecordPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Auszahlungsbetrag (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="z.B. 250.00"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs font-num font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Abrechnungsperiode</label>
                <input
                  type="text"
                  required
                  placeholder="2026-10"
                  value={payoutPeriod}
                  onChange={(e) => setPayoutPeriod(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Verwendungszweck / Notiz</label>
                <input
                  type="text"
                  placeholder="Gutschrift Überweisung Finom"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800"
                >
                  Auszahlung verbuchen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
