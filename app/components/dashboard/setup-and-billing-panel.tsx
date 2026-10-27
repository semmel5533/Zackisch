"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Price } from "@/components/common/price";
import {
  Check,
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
import { Button } from "@/components/ui/button";
import { Card, Badge, Banner, Divider } from "@/components/ui/surfaces";
import { TextField } from "@/components/ui/form-controls";

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
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Self-Service 8-Step Setup Wizard & Go-Live Checklist */}
      <Card variant="default" padding={5} elevation="low" width="100%">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 shrink-0" />
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {isDe
                    ? "Selbstständige Einrichtung & Live-Checkliste (8 Schritte)"
                    : "Self-Service Setup & Live Readiness (8 Steps)"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isDe
                  ? "Jeder Schritt wird serverseitig geprüft. Erst wenn alle Pflichtschritte erfüllt sind, ist dein QR-Bestellsystem live."
                  : "Every step is verified server-side before live QR ordering is enabled."}
              </p>
            </div>

            <div className="flex items-center gap-2">
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
              >
                <Question className="size-4" />
                <span>{isDe ? "Hilfe & Support-Ticket" : "Help & Support Ticket"}</span>
              </Button>
            </div>
          </div>

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
              <div className="flex flex-col gap-3">
                <h4 className="text-base font-bold text-foreground">{t("sellerIdentityTitle")}</h4>
                <TextField
                  label={t("sellerLegalName")}
                  value={legalName}
                  onValueChange={(val) => setLegalName(val)}
                />
                <TextField
                  label={t("sellerTaxId")}
                  value={taxId}
                  onValueChange={(val) => setTaxId(val)}
                />
                <TextField
                  label={t("sellerVatId")}
                  value={vatId}
                  onValueChange={(val) => setVatId(val)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  disabled={savingSeller}
                  loading={savingSeller}
                  onClick={handleSaveSellerIdentity}
                >
                  {t(savingSeller ? "sellerIdentitySaving" : "sellerIdentitySave")}
                </Button>
              </div>
            </Card>

            {/* Box 2: Merchant Contract, DPA & 2% Fee Schedule */}
            <Card variant="muted" padding={4} width="100%">
              <div className="flex flex-col justify-between gap-3 h-full">
                <div className="flex flex-col gap-1.5">
                  <h4 className="text-base font-bold text-foreground">
                    {isDe
                      ? "2. Händlervertrag, AVV & 2 %-Preisblatt"
                      : "2. Merchant Contract, DPA & 2% Pricing"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isDe
                      ? "2 % Zackisch-Provision auf den bezahlten Bruttowarenwert (inkl. USt. auf unsere eigene Leistung, 0 % auf freiwilliges Trinkgeld) zzgl. Stripe-Zahlungsgebühren."
                      : "2% Zackisch platform fee on eligible gross goods/services (VAT-inclusive, 0% on voluntary tips) plus Stripe processing fees."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleAcceptContracts}
                >
                  <Check className="size-4" />
                  <span>
                    {isDe
                      ? "AGB, AVV & 2 %-Konditionen bestätigen"
                      : "Accept GTC, DPA & 2% fee schedule"}
                  </span>
                </Button>
              </div>
            </Card>

            {/* Box 3: POS Single-Entry Workflow & Test Order */}
            <Card variant="muted" padding={4} width="100%">
              <div className="flex flex-col justify-between gap-3 h-full">
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-bold text-foreground">
                    {isDe
                      ? "3. Kassenworkflow & Testbestellung"
                      : "3. POS Workflow & Test Order"}
                  </h4>
                  <TextField
                    label={isDe ? "Kassensystem" : "POS System"}
                    value={posSystemName}
                    onValueChange={(val) => setPosSystemName(val)}
                    placeholder={isDe ? "Kassensystem (z.B. orderbird)" : "POS system"}
                  />
                  <TextField
                    label={isDe ? "Zahlungsart in Kasse" : "External payment label"}
                    value={posExternalPaymentLabel}
                    onValueChange={(val) => setPosExternalPaymentLabel(val)}
                    placeholder={
                      isDe
                        ? "Zahlungsart in Kasse (Online bezahlt)"
                        : "External payment label in POS"
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    disabled={savingPos}
                    loading={savingPos}
                    onClick={handleAcknowledgePos}
                  >
                    {isDe ? "Kassenworkflow speichern" : "Save POS workflow"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    fullWidth
                    disabled={creatingTestOrder}
                    loading={creatingTestOrder}
                    onClick={handleTriggerTestOrder}
                  >
                    <Play className="size-4" />
                    <span>{isDe ? "Testbestellung" : "Test Order"}</span>
                  </Button>
                </div>
              </div>
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
        </div>
      </Card>

      {/* 2. Monthly B2B Fee Statements & EN 16931 / XRechnung 3.0 XML Export */}
      <Card variant="default" padding={5} elevation="low" width="100%">
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 shrink-0" />
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {isDe
                    ? "Monatliche Zackisch-Provisionsabrechnung & E-Rechnung (XRechnung 3.0)"
                    : "Monthly Zackisch B2B Fee Statements & E-Invoice (XRechnung 3.0)"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {isDe
                  ? "Strukturierte B2B-Abrechnung über die 2 % Zackisch-Provision (inkl. 19 % USt. auf unsere eigene Leistung, Trinkgeld ausgenommen) nach EN 16931."
                  : "Structured B2B fee statements for the 2% Zackisch platform fee (inclusive of 19% VAT on our own service, tips excluded) per EN 16931."}
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleGenerateStatement}
            >
              {isDe
                ? `Abrechnung für ${currentPeriodMonth} aktualisieren`
                : `Generate statement (${currentPeriodMonth})`}
            </Button>
          </div>

          {!feeStatements || feeStatements.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isDe
                ? "Noch keine monatliche Provisionsabrechnung erzeugt. Klicke oben auf „Abrechnung aktualisieren“, um eine Abrechnung inkl. XRechnung-XML zu erstellen."
                : "No monthly fee statements generated yet. Click above to generate the current month's statement and XRechnung XML."}
            </p>
          ) : (
            <div className="flex flex-col gap-3 w-full">
              {feeStatements.map((stmt) => (
                <Card key={stmt._id} variant="muted" padding={4} width="100%">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-foreground">
                        {stmt.statementNumber} · {stmt.period}
                      </span>
                      <span className="text-sm text-muted-foreground">
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
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="font-semibold text-foreground">
                          {isDe ? "2 % Provision (brutto inkl. USt.):" : "2% Fee (gross incl. VAT):"}{" "}
                          <Price cents={stmt.platformFeeGrossCents} />
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {isDe ? "Netto:" : "Net:"}{" "}
                          <Price cents={stmt.platformFeeNetCents} /> + 19 % USt. (
                          <Price cents={stmt.platformFeeVatCents} />)
                        </span>
                      </div>

                      {stmt.xmlContent && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDownloadXRechnung(stmt)}
                        >
                          <DownloadSimple className="size-4" />
                          <span>XRechnung XML</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
