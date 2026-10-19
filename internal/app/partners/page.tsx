"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Handshake, Plus, Coins } from "@phosphor-icons/react";
import { VStack } from "@astryxdesign/core/VStack";
import { HStack } from "@astryxdesign/core/HStack";
import { StackItem } from "@astryxdesign/core/Stack";
import { Section } from "@astryxdesign/core/Section";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Button } from "@astryxdesign/core/Button";
import { Icon } from "@astryxdesign/core/Icon";
import { Table, proportional, pixel } from "@astryxdesign/core/Table";
import { Badge } from "@astryxdesign/core/Badge";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Divider } from "@astryxdesign/core/Divider";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Spinner } from "@astryxdesign/core/Spinner";
import { useAdmin } from "@/lib/admin-context";
import { toast } from "@/components/common/toast";

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
    <VStack gap={6} maxWidth={1200}>
      <HStack justify="between" vAlign="center" wrap="wrap" gap={4}>
        <StackItem size="fill">
          <VStack gap={1}>
            <Heading level={1}>Vertriebspartner & Provisionen</Heading>
            <Text type="supporting">
              Partner-Vergütung: 50% der Zackisch-Plattformgebühr (1% des Gastronomie-Umsatzes).
            </Text>
          </VStack>
        </StackItem>

        <Button
          label="Partner anlegen"
          variant="primary"
          icon={<Icon icon={Plus} size="sm" />}
          onClick={() => setShowCreateModal(true)}
        />
      </HStack>

      <Section variant="section" padding={5}>
        <VStack gap={4}>
          <HStack justify="between" vAlign="center">
            <Heading level={3}>Aktive Vertriebspartner</Heading>
            <Badge
              variant="neutral"
              label={`${partners?.length || 0} Partner registriert`}
            />
          </HStack>

          {!partners ? (
            <VStack hAlign="center" vAlign="center" minHeight={200}>
              <Spinner label="Lade Partner..." />
            </VStack>
          ) : partners.length === 0 ? (
            <EmptyState
              isCompact
              icon={<Icon icon={Handshake} size="lg" color="secondary" />}
              title="Keine Partner hinterlegt"
              description={`Keine Partner für Region ${currentRegion.toUpperCase()} hinterlegt.`}
            />
          ) : (
            <Table
              data={partners}
              idKey="_id"
              hasHover
              density="balanced"
              columns={[
                {
                  key: "name",
                  header: "Code & Partner",
                  width: proportional(1.5, { minWidth: 200 }),
                  renderCell: (p: any) => (
                    <VStack gap={0.5}>
                      <HStack gap={2} vAlign="center">
                        <Badge variant="neutral" label={p.code} />
                        <Text weight="semibold">{p.name}</Text>
                      </HStack>
                      <Text type="supporting">{p.email}</Text>
                    </VStack>
                  ),
                },
                {
                  key: "referredBusinessesCount",
                  header: "Vermittelte Betriebe",
                  width: pixel(150),
                  renderCell: (p: any) => (
                    <Text weight="semibold" hasTabularNumbers>
                      {p.referredBusinessesCount} Betriebe
                    </Text>
                  ),
                },
                {
                  key: "rate",
                  header: "Provisionssatz",
                  width: pixel(130),
                  renderCell: () => (
                    <Text hasTabularNumbers>50% (1% GMV)</Text>
                  ),
                },
                {
                  key: "totalEarnedCents",
                  header: "Verdient",
                  width: pixel(130),
                  renderCell: (p: any) => (
                    <Text weight="bold" hasTabularNumbers>
                      {formatEuro(p.totalEarnedCents)}
                    </Text>
                  ),
                },
                {
                  key: "totalPaidCents",
                  header: "Ausbezahlt",
                  width: pixel(130),
                  renderCell: (p: any) => (
                    <Text weight="semibold" hasTabularNumbers>
                      {formatEuro(p.totalPaidCents)}
                    </Text>
                  ),
                },
                {
                  key: "iban",
                  header: "IBAN",
                  width: proportional(1, { minWidth: 140 }),
                  renderCell: (p: any) => (
                    <Text type="code" color="secondary">
                      {p.iban ? `${p.iban.slice(0, 10)}...` : "—"}
                    </Text>
                  ),
                },
                {
                  key: "actions",
                  header: "Aktionen",
                  align: "end",
                  width: pixel(160),
                  renderCell: (p: any) => (
                    <Button
                      label="Auszahlung buchen"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowPayoutModal(p)}
                    />
                  ),
                },
              ]}
            />
          )}
        </VStack>
      </Section>

      <Section variant="section" padding={5}>
        <VStack gap={4}>
          <Heading level={3}>Auszahlungs-Historie (Ledger)</Heading>

          {!payouts || payouts.length === 0 ? (
            <EmptyState
              isCompact
              icon={<Icon icon={Coins} size="lg" color="secondary" />}
              title="Keine Auszahlungen"
              description="Bisher wurden keine Auszahlungen verbucht."
            />
          ) : (
            <Table
              data={payouts}
              idKey="_id"
              hasHover
              density="balanced"
              columns={[
                {
                  key: "createdAt",
                  header: "Zeitpunkt",
                  width: pixel(140),
                  renderCell: (py: any) => (
                    <Text hasTabularNumbers>
                      {new Date(py.createdAt).toLocaleDateString("de-DE")}
                    </Text>
                  ),
                },
                {
                  key: "period",
                  header: "Periode",
                  width: pixel(130),
                  renderCell: (py: any) => (
                    <Text type="code" weight="semibold">
                      {py.period}
                    </Text>
                  ),
                },
                {
                  key: "amountCents",
                  header: "Betrag",
                  width: pixel(140),
                  renderCell: (py: any) => (
                    <Text weight="bold" hasTabularNumbers>
                      {formatEuro(py.amountCents)}
                    </Text>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  width: pixel(140),
                  renderCell: () => (
                    <HStack gap={1.5} vAlign="center">
                      <StatusDot variant="success" label="Ausbezahlt" />
                      <Text>Ausbezahlt</Text>
                    </HStack>
                  ),
                },
                {
                  key: "notes",
                  header: "Notizen",
                  width: proportional(1, { minWidth: 200 }),
                  renderCell: (py: any) => (
                    <Text type="supporting">{py.notes || "—"}</Text>
                  ),
                },
              ]}
            />
          )}
        </VStack>
      </Section>

      {/* Create Partner Modal */}
      <Dialog
        isOpen={showCreateModal}
        onOpenChange={setShowCreateModal}
        width={440}
        purpose="form"
      >
        <form onSubmit={handleCreatePartner}>
          <VStack gap={4}>
            <DialogHeader
              title="Neuen Vertriebspartner anlegen"
              subtitle="Erstelle einen individuellen Partnercode für die regionale Gastronomie-Akquise."
              onOpenChange={setShowCreateModal}
            />

            <TextInput
              label="Partner-Code (Empfehlungscode)"
              placeholder="z.B. BERLIN-01"
              value={partnerCode}
              onChange={(val) => setPartnerCode(val.toUpperCase())}
              isRequired
              width="100%"
            />

            <TextInput
              label="Name / Firma"
              placeholder="z.B. Gastro Partner Nord"
              value={partnerName}
              onChange={setPartnerName}
              isRequired
              width="100%"
            />

            <TextInput
              type="email"
              label="E-Mail-Adresse"
              placeholder="partner@example.de"
              value={partnerEmail}
              onChange={setPartnerEmail}
              isRequired
              width="100%"
            />

            <TextInput
              label="IBAN"
              isOptional
              placeholder="DE89 3704 0044 0532 0130 00"
              value={partnerIban}
              onChange={setPartnerIban}
              width="100%"
            />

            <Divider />

            <HStack justify="end" gap={2}>
              <Button
                label="Abbrechen"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              />
              <Button
                type="submit"
                label="Partner anlegen"
                variant="primary"
              />
            </HStack>
          </VStack>
        </form>
      </Dialog>

      {/* Record Payout Modal */}
      <Dialog
        isOpen={Boolean(showPayoutModal)}
        onOpenChange={(open) => {
          if (!open) setShowPayoutModal(null);
        }}
        width={440}
        purpose="form"
      >
        <form onSubmit={handleRecordPayout}>
          <VStack gap={4}>
            <DialogHeader
              title={`Auszahlung für ${showPayoutModal?.name || ""}`}
              subtitle={`Partner-Code: ${showPayoutModal?.code || ""}`}
              onOpenChange={(open) => {
                if (!open) setShowPayoutModal(null);
              }}
            />

            <TextInput
              label="Auszahlungsbetrag (€)"
              placeholder="z.B. 250.00"
              value={payoutAmount}
              onChange={setPayoutAmount}
              isRequired
              width="100%"
            />

            <TextInput
              label="Abrechnungsperiode"
              placeholder="2026-10"
              value={payoutPeriod}
              onChange={setPayoutPeriod}
              isRequired
              width="100%"
            />

            <TextInput
              label="Verwendungszweck / Notiz"
              isOptional
              placeholder="Gutschrift Überweisung Finom"
              value={payoutNotes}
              onChange={setPayoutNotes}
              width="100%"
            />

            <Divider />

            <HStack justify="end" gap={2}>
              <Button
                label="Abbrechen"
                variant="secondary"
                onClick={() => setShowPayoutModal(null)}
              />
              <Button
                type="submit"
                label="Auszahlung verbuchen"
                variant="primary"
              />
            </HStack>
          </VStack>
        </form>
      </Dialog>
    </VStack>
  );
}
