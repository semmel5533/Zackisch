"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Handshake, Plus, Coins } from "@phosphor-icons/react";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";
import {
  Card,
  Button,
  Badge,
  StatusDot,
  TextField,
  Modal,
  Spinner,
} from "@/components/ui/primitives";

export default function PartnersPage() {
  const { currentRegion, sessionToken } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState<any>(null);

  const [partnerCode, setPartnerCode] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerIban, setPartnerIban] = useState("");

  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState("2026-10");
  const [payoutNotes, setPayoutNotes] = useState("");

  const partners = useQuery(
    (anyApi as any).partners.listPartners,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const payouts = useQuery(
    (anyApi as any).partners.listPayouts,
    sessionToken ? { regionId: currentRegion, sessionToken } : "skip"
  );

  const createPartnerMutation = useMutation(
    (anyApi as any).partners.createPartner
  );
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
        sessionToken: sessionToken || "",
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
        sessionToken: sessionToken || "",
      });
      toast.success("Auszahlung erfolgreich gebucht!");
      setShowPayoutModal(null);
      setPayoutAmount("");
    } catch (err: any) {
      toast.error(`Fehler: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <h1 className="text-2xl font-bold text-[var(--zk-text)]">
            Vertriebspartner & Provisionen
          </h1>
          <p className="text-sm text-[var(--zk-text-secondary)] mt-1">
            Partner-Vergütung: 50% der Zackisch-Plattformgebühr (1% des Gastronomie-Umsatzes).
          </p>
        </div>

        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="size-4" aria-hidden="true" />
          <span>Partner anlegen</span>
        </Button>
      </div>

      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--zk-text)]">
              Aktive Vertriebspartner
            </h2>
            <Badge variant="neutral">
              {partners?.length || 0} Partner registriert
            </Badge>
          </div>

          {!partners ? (
            <div className="py-12 flex justify-center">
              <Spinner label="Lade Partner..." />
            </div>
          ) : partners.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Handshake className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
              <div className="text-base font-bold text-[var(--zk-text)]">
                Keine Partner hinterlegt
              </div>
              <p className="text-sm text-[var(--zk-text-secondary)]">
                Keine Partner für Region {currentRegion.toUpperCase()} hinterlegt.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--zk-border)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                    <th className="py-3 pr-4">Code & Partner</th>
                    <th className="py-3 px-4">Vermittelte Betriebe</th>
                    <th className="py-3 px-4">Provisionssatz</th>
                    <th className="py-3 px-4">Verdient</th>
                    <th className="py-3 px-4">Ausbezahlt</th>
                    <th className="py-3 px-4">IBAN</th>
                    <th className="py-3 pl-4 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--zk-border)]">
                  {partners.map((p: any) => (
                    <tr key={p._id} className="hover:bg-[var(--zk-surface-muted)]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">{p.code}</Badge>
                          <span className="font-semibold text-[var(--zk-text)]">
                            {p.name}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--zk-text-secondary)] mt-0.5">
                          {p.email}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold tabular-nums">
                        {p.referredBusinessesCount} Betriebe
                      </td>
                      <td className="py-3 px-4 tabular-nums">50% (1% GMV)</td>
                      <td className="py-3 px-4 font-bold text-[var(--zk-text)] tabular-nums">
                        {formatEuro(p.totalEarnedCents)}
                      </td>
                      <td className="py-3 px-4 font-semibold tabular-nums">
                        {formatEuro(p.totalPaidCents)}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[var(--zk-text-secondary)]">
                        {p.iban ? `${p.iban.slice(0, 10)}...` : "—"}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowPayoutModal(p)}
                        >
                          Auszahlung buchen
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <Card padding="lg">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--zk-text)]">
            Auszahlungs-Historie (Ledger)
          </h2>

          {!payouts || payouts.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Coins className="size-8 text-[var(--zk-text-secondary)]" aria-hidden="true" />
              <div className="text-base font-bold text-[var(--zk-text)]">
                Keine Auszahlungen
              </div>
              <p className="text-sm text-[var(--zk-text-secondary)]">
                Bisher wurden keine Auszahlungen verbucht.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--zk-border)] text-xs font-semibold text-[var(--zk-text-secondary)]">
                    <th className="py-3 pr-4">Zeitpunkt</th>
                    <th className="py-3 px-4">Periode</th>
                    <th className="py-3 px-4">Betrag</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 pl-4">Notizen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--zk-border)]">
                  {payouts.map((py: any) => (
                    <tr key={py._id} className="hover:bg-[var(--zk-surface-muted)]">
                      <td className="py-3 pr-4 tabular-nums">
                        {new Date(py.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-xs">
                        {py.period}
                      </td>
                      <td className="py-3 px-4 font-bold text-[var(--zk-text)] tabular-nums">
                        {formatEuro(py.amountCents)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5">
                          <StatusDot variant="success" label="Ausbezahlt" />
                          <span>Ausbezahlt</span>
                        </div>
                      </td>
                      <td className="py-3 pl-4 text-[var(--zk-text-secondary)]">
                        {py.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Create Partner Modal */}
      <Modal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        title="Neuen Vertriebspartner anlegen"
        description="Erstelle einen individuellen Partnercode für die regionale Gastronomie-Akquise."
      >
        <form onSubmit={handleCreatePartner} className="flex flex-col gap-4">
          <TextField
            label="Partner-Code (Empfehlungscode)"
            placeholder="z.B. BERLIN-01"
            value={partnerCode}
            onChange={(val) => setPartnerCode(val.toUpperCase())}
            required
          />

          <TextField
            label="Name / Firma"
            placeholder="z.B. Gastro Partner Nord"
            value={partnerName}
            onChange={setPartnerName}
            required
          />

          <TextField
            type="email"
            label="E-Mail-Adresse"
            placeholder="partner@example.de"
            value={partnerEmail}
            onChange={setPartnerEmail}
            required
          />

          <TextField
            label="IBAN (optional)"
            placeholder="DE89 3704 0044 0532 0130 00"
            value={partnerIban}
            onChange={setPartnerIban}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowCreateModal(false)}
            >
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              Partner anlegen
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Payout Modal */}
      <Modal
        open={Boolean(showPayoutModal)}
        onOpenChange={(open) => {
          if (!open) setShowPayoutModal(null);
        }}
        title={`Auszahlung für ${showPayoutModal?.name || ""}`}
        description={`Partner-Code: ${showPayoutModal?.code || ""}`}
      >
        <form onSubmit={handleRecordPayout} className="flex flex-col gap-4">
          <TextField
            label="Auszahlungsbetrag (€)"
            placeholder="z.B. 250.00"
            value={payoutAmount}
            onChange={setPayoutAmount}
            required
          />

          <TextField
            label="Abrechnungsperiode"
            placeholder="2026-10"
            value={payoutPeriod}
            onChange={setPayoutPeriod}
            required
          />

          <TextField
            label="Verwendungszweck / Notiz (optional)"
            placeholder="Gutschrift Überweisung Finom"
            value={payoutNotes}
            onChange={setPayoutNotes}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowPayoutModal(null)}
            >
              Abbrechen
            </Button>
            <Button type="submit" variant="primary">
              Auszahlung verbuchen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
