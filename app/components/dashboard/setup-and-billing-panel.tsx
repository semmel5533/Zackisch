"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@astryxdesign/core/Card";
import { Button } from "@astryxdesign/core/Button";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Badge } from "@astryxdesign/core/Badge";
import { Banner } from "@astryxdesign/core/Banner";
import { VStack, HStack } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { Price } from "@/components/common/price";
import {
  Check,
  WarningCircle,
  DownloadSimple,
  Question,
  Play,
  ShieldCheck,
  Receipt,
} from "@phosphor-icons/react";
import { toast } from "@/components/common/toast";
import { useTranslation } from "@/lib/i18n";
import { updateSellerIdentityAction } from "@/actions/settings-actions";
import type { Business } from "@/lib/types";

interface SetupAndBillingPanelProps {
  business: Business;
  userEmail?: string;
  userName?: string;
}

export function SetupAndBillingPanel({
  business,
}: SetupAndBillingPanelProps) {
  const { locale, t } = useTranslation();
  const isDe = locale.startsWith("de");
  const businessId = business.$id as Id<"businesses">;

  const readiness = useQuery(api.setup.getSetupReadiness, {
    businessId,
  });
  const posSummary = useQuery(api.orders.getPosReconciliationSummary, {
    businessId,
  });
  const feeStatements = useQuery(api.setup.getFeeStatements, {
    businessId,
  });

  const recordLegalAcceptance = useMutation(api.setup.recordLegalAcceptance);
  const createControlledTestOrder = useMutation(
    api.orders.createControlledTestOrder,
  );
  const generateFeeStatement = useMutation(
    api.setup.generateMonthlyFeeStatement,
  );
  const createSupportToken = useMutation(api.support.createCrossAppToken);

  const [posSystemName, setPosSystemName] = useState(
    business.posSystemName || "Bestehende Restaurantkasse (TSE)",
  );
  const [posExternalPaymentLabel, setPosExternalPaymentLabel] = useState(
    business.posExternalPaymentLabel || "Online bezahlt – Zackisch",
  );
  const [legalName, setLegalName] = useState(
    business.legalName || business.name || "",
  );
  const [vatId, setVatId] = useState(
    business.vatId || "",
  );
  const [taxId, setTaxId] = useState(business.taxId || "");
  const [savingSeller, setSavingSeller] = useState(false);
  const [savingPos, setSavingPos] = useState(false);
  const [creatingTestOrder, setCreatingTestOrder] = useState(false);

  const currentPeriodMonth = new Date().toISOString().slice(0, 7);

  const handleSaveSellerIdentity = async () => {
    if (!legalName.trim() || (!taxId.trim() && !vatId.trim())) {
      toast.error(t("sellerIdentityInvalid"));
      return;
    }
    setSavingSeller(true);
    try {
      const result = await updateSellerIdentityAction(businessId, { legalName, taxId, vatId });
      if (!result.success) {
        toast.error(t(result.error ?? "sellerIdentitySaveFailed"));
        return;
      }
      toast.success(t("sellerIdentitySaved"));
    } catch {
      toast.error(t("sellerIdentitySaveFailed"));
    } finally {
      setSavingSeller(false);
    }
  };

  const handleAcceptContracts = async () => {
    try {
      await recordLegalAcceptance({
        businessId,
        documentSlugs: ["gtc", "data-processing", "fee-model"],
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      });
      toast.success(
        isDe
          ? "Händlervertrag, AVV (Art. 28 DSGVO) und 2 %-Preisblatt rechtsverbindlich protokolliert."
          : "Merchant contract, DPA (Art. 28 GDPR), and 2% fee schedule recorded.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Fehler bei der Vertragsbestätigung");
    }
  };

  const handleAcknowledgePos = async () => {
    setSavingPos(true);
    try {
      await recordLegalAcceptance({
        businessId,
        documentSlugs: ["pos-workflow"],
        context: `${posSystemName.trim()} | ${posExternalPaymentLabel.trim()}`,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "browser",
      });
      toast.success(
        isDe
          ? "Kassenworkflow bestätigt (Einmalerfassung ohne Doppelinkasso)."
          : "POS single-entry workflow confirmed.",
      );
    } catch (err: any) {
      toast.error(err?.message || "Fehler beim Speichern");
    } finally {
      setSavingPos(false);
    }
  };

  const handleTriggerTestOrder = async () => {
    setCreatingTestOrder(true);
    try {
      const res = await createControlledTestOrder({
        businessId,
      });
      toast.success(
        isDe
          ? `Testbestellung #${res.orderNumber} ausgelöst! Bitte jetzt unter „Aktuelle Bestellungen“ als „In Kasse erfasst“ markieren.`
          : `Test order #${res.orderNumber} created! Mark it as "Recorded in POS" under Current Orders.`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Fehler beim Erstellen der Testbestellung");
    } finally {
      setCreatingTestOrder(false);
    }
  };

  const handleGenerateStatement = async () => {
    try {
      await generateFeeStatement({
        businessId,
        period: currentPeriodMonth,
      });
      toast.success(
        isDe
          ? `Provisionsabrechnung & XRechnung XML für ${currentPeriodMonth} erstellt.`
          : `Fee statement & XRechnung XML generated for ${currentPeriodMonth}.`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Fehler bei der Abrechnungserstellung");
    }
  };

  const handleDownloadXRechnung = (statement: any) => {
    const blob = new Blob([statement.xmlContent], {
      type: "application/xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${statement.statementNumber}-xrechnung.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOpenSupportPortal = async () => {
    try {
      const res = await createSupportToken({
        businessId,
      });
      const supportBase =
        process.env.NEXT_PUBLIC_SUPPORT_URL || "https://support.zackisch.com";
      const targetUrl = `${supportBase}/${isDe ? "de-de" : "de-en"}/tickets?token=${encodeURIComponent(res.token)}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } catch {
      window.open(
        `https://support.zackisch.com/${isDe ? "de-de" : "de-en"}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <VStack gap={6} width="100%">
      {/* 1. Self-Service 8-Step Setup Wizard & Go-Live Checklist */}
      <Card variant="default" padding={5} elevation="low" width="100%">
        <VStack gap={5} width="100%">
          <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Icon icon={ShieldCheck} size="md" />
                <Heading level={3}>
                  {isDe
                    ? "Selbstständige Einrichtung & Live-Checkliste (8 Schritte)"
                    : "Self-Service Setup & Live Readiness (8 Steps)"}
                </Heading>
              </HStack>
              <Text color="secondary" size="sm">
                {isDe
                  ? "Jeder Schritt wird serverseitig geprüft. Erst wenn alle Pflichtschritte erfüllt sind, ist dein QR-Bestellsystem live."
                  : "Every step is verified server-side before live QR ordering is enabled."}
              </Text>
            </VStack>

            <HStack gap={2} vAlign="center">
              {readiness?.isReadyForLive ? (
                <Badge
                  label={isDe ? "8 / 8 Schritte bereit" : "8 / 8 steps ready"}
                  variant="success"
                />
              ) : (
                <Badge
                  label={
                    readiness
                      ? `${readiness.completedCount} / ${readiness.totalSteps}`
                      : "…"
                  }
                  variant="neutral"
                />
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleOpenSupportPortal}
                icon={<Icon icon={Question} size="sm" />}
                label={isDe ? "Hilfe & Support-Ticket" : "Help & Support Ticket"}
              />
            </HStack>
          </HStack>

          {readiness && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {readiness.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`rounded-xl border p-3 flex items-start gap-2.5 text-xs ${
                    step.completed
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                      : "border-border bg-muted/20 text-foreground"
                  }`}
                >
                  <div
                    className={`size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${
                      step.completed
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {step.completed ? (
                      <Check className="size-3" weight="bold" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="font-semibold leading-snug">{step.detail}</div>
                </div>
              ))}
            </div>
          )}

          <Divider />

          {/* Quick Seller & Tax Identity + Legal Acceptance + POS Workflow Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card variant="muted" padding={4} width="100%">
              <VStack gap={3}>
                <Heading level={4}>{t("sellerIdentityTitle")}</Heading>
                <TextInput
                  label={t("sellerLegalName")}
                  value={legalName}
                  onChange={(val) => setLegalName(val)}
                  width="100%"
                />
                <TextInput
                  label={t("sellerTaxId")}
                  value={taxId}
                  onChange={(val) => setTaxId(val)}
                  width="100%"
                />
                <TextInput
                  label={t("sellerVatId")}
                  value={vatId}
                  onChange={(val) => setVatId(val)}
                  width="100%"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  isDisabled={savingSeller}
                  isLoading={savingSeller}
                  onClick={handleSaveSellerIdentity}
                  label={t(savingSeller ? "sellerIdentitySaving" : "sellerIdentitySave")}
                />
              </VStack>
            </Card>

            {/* Box 2: Merchant Contract, DPA & 2% Fee Schedule */}
            <Card variant="muted" padding={4} width="100%">
              <VStack gap={3} justify="between" height="100%">
                <VStack gap={1.5}>
                  <Heading level={4}>
                    {isDe
                      ? "2. Händlervertrag, AVV & 2 %-Preisblatt"
                      : "2. Merchant Contract, DPA & 2% Pricing"}
                  </Heading>
                  <Text color="secondary" size="sm">
                    {isDe
                      ? "2 % Zackisch-Provision auf den bezahlten Bruttowarenwert (inkl. USt. auf unsere eigene Leistung, 0 % auf freiwilliges Trinkgeld) zzgl. Stripe-Zahlungsgebühren."
                      : "2% Zackisch platform fee on eligible gross goods/services (VAT-inclusive, 0% on voluntary tips) plus Stripe processing fees."}
                  </Text>
                </VStack>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  width="100%"
                  onClick={handleAcceptContracts}
                  icon={<Icon icon={Check} size="sm" />}
                  label={
                    isDe
                      ? "AGB, AVV & 2 %-Konditionen bestätigen"
                      : "Accept GTC, DPA & 2% fee schedule"
                  }
                />
              </VStack>
            </Card>

            {/* Box 3: POS Single-Entry Workflow & Test Order */}
            <Card variant="muted" padding={4} width="100%">
              <VStack gap={3} justify="between" height="100%">
                <VStack gap={2}>
                  <Heading level={4}>
                    {isDe
                      ? "3. Kassenworkflow & Testbestellung"
                      : "3. POS Workflow & Test Order"}
                  </Heading>
                  <TextInput
                    label={isDe ? "Kassensystem" : "POS System"}
                    value={posSystemName}
                    onChange={(val) => setPosSystemName(val)}
                    placeholder={isDe ? "Kassensystem (z.B. orderbird)" : "POS system"}
                    width="100%"
                  />
                  <TextInput
                    label={isDe ? "Zahlungsart in Kasse" : "External payment label"}
                    value={posExternalPaymentLabel}
                    onChange={(val) => setPosExternalPaymentLabel(val)}
                    placeholder={
                      isDe
                        ? "Zahlungsart in Kasse (Online bezahlt)"
                        : "External payment label in POS"
                    }
                    width="100%"
                  />
                </VStack>
                <VStack gap={2} width="100%">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    width="100%"
                    isDisabled={savingPos}
                    isLoading={savingPos}
                    onClick={handleAcknowledgePos}
                    label={isDe ? "Kassenworkflow speichern" : "Save POS workflow"}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    width="100%"
                    isDisabled={creatingTestOrder}
                    isLoading={creatingTestOrder}
                    onClick={handleTriggerTestOrder}
                    icon={<Icon icon={Play} size="sm" />}
                    label={isDe ? "Testbestellung" : "Test Order"}
                  />
                </VStack>
              </VStack>
            </Card>
          </div>

          {/* POS Reconciliation Live Status Bar */}
          {posSummary && (
            <Banner
              status={posSummary.unrecordedCount > 0 ? "warning" : "success"}
              title={
                posSummary.unrecordedCount > 0
                  ? isDe
                    ? `Kassenabgleich offen: ${posSummary.unrecordedCount} bezahlte Bestellung(en) noch nicht als „In Kasse erfasst“ markiert`
                    : `POS reconciliation open: ${posSummary.unrecordedCount} paid order(s) not yet marked as recorded in POS`
                  : isDe
                    ? `Alle ${posSummary.recordedCount} bezahlten Bestellungen sind einmalig in der Kasse erfasst`
                    : `All ${posSummary.recordedCount} paid orders are recorded in POS`
              }
              description={`${isDe ? "Bruttoumsatz gesamt:" : "Gross volume:"} ${(posSummary.totals.grossTotalCents / 100).toFixed(2).replace(".", ",")} €`}
            />
          )}
        </VStack>
      </Card>

      {/* 2. Monthly B2B Fee Statements & EN 16931 / XRechnung 3.0 XML Export */}
      <Card variant="default" padding={5} elevation="low" width="100%">
        <VStack gap={5} width="100%">
          <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Icon icon={Receipt} size="md" />
                <Heading level={3}>
                  {isDe
                    ? "Monatliche Zackisch-Provisionsabrechnung & E-Rechnung (XRechnung 3.0)"
                    : "Monthly Zackisch B2B Fee Statements & E-Invoice (XRechnung 3.0)"}
                </Heading>
              </HStack>
              <Text color="secondary" size="sm">
                {isDe
                  ? "Strukturierte B2B-Abrechnung über die 2 % Zackisch-Provision (inkl. 19 % USt. auf unsere eigene Leistung, Trinkgeld ausgenommen) nach EN 16931."
                  : "Structured B2B fee statements for the 2% Zackisch platform fee (inclusive of 19% VAT on our own service, tips excluded) per EN 16931."}
              </Text>
            </VStack>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleGenerateStatement}
              label={
                isDe
                  ? `Abrechnung für ${currentPeriodMonth} aktualisieren`
                  : `Generate statement (${currentPeriodMonth})`
              }
            />
          </HStack>

          {!feeStatements || feeStatements.length === 0 ? (
            <Text color="secondary" size="sm">
              {isDe
                ? "Noch keine monatliche Provisionsabrechnung erzeugt. Klicke oben auf „Abrechnung aktualisieren“, um eine Abrechnung inkl. XRechnung-XML zu erstellen."
                : "No monthly fee statements generated yet. Click above to generate the current month's statement and XRechnung XML."}
            </Text>
          ) : (
            <VStack gap={3} width="100%">
              {feeStatements.map((stmt) => (
                <Card key={stmt._id} variant="muted" padding={4} width="100%">
                  <HStack justify="between" vAlign="center" wrap="wrap" gap={3}>
                    <VStack gap={1}>
                      <Text weight="semibold">
                        {stmt.statementNumber} · {stmt.period}
                      </Text>
                      <Text color="secondary" size="sm">
                        {isDe ? "Provisionspflichtiger Umsatz:" : "Eligible volume:"}{" "}
                        <Price
                          cents={stmt.eligibleTurnoverCents}
                          className="font-semibold text-foreground"
                        />{" "}
                        · {isDe ? "Trinkgeld (0 % Provision):" : "Tips (0% fee):"}{" "}
                        <Price
                          cents={stmt.tipTurnoverCents}
                          className="font-semibold text-foreground"
                        />
                      </Text>
                    </VStack>

                    <HStack gap={3} vAlign="center">
                      <VStack gap={0.5} hAlign="end">
                        <Text weight="semibold">
                          {isDe ? "2 % Provision (brutto inkl. USt.):" : "2% Fee (gross incl. VAT):"}{" "}
                          <Price cents={stmt.platformFeeGrossCents} />
                        </Text>
                        <Text color="secondary" size="sm">
                          {isDe ? "Netto:" : "Net:"}{" "}
                          <Price cents={stmt.platformFeeNetCents} /> + 19 % USt. (
                          <Price cents={stmt.platformFeeVatCents} />)
                        </Text>
                      </VStack>

                      {stmt.xmlContent && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadXRechnung(stmt)}
                          icon={<Icon icon={DownloadSimple} size="sm" />}
                          label="XRechnung XML"
                        />
                      )}
                    </HStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </Card>
    </VStack>
  );
}
