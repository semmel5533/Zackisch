import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const CURRENT_LEGAL_VERSION = "2026-10-v1";

export const getSetupReadiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  returns: v.union(
    v.null(),
    v.object({
      completedCount: v.number(),
      totalSteps: v.number(),
      percentComplete: v.number(),
      isReadyForLive: v.boolean(),
      isPaused: v.boolean(),
      pauseReason: v.optional(v.string()),
      steps: v.array(
        v.object({
          id: v.string(),
          completed: v.boolean(),
          detail: v.string(),
        })
      ),
      acceptedDocuments: v.array(
        v.object({
          documentSlug: v.string(),
          documentVersion: v.string(),
          acceptedAt: v.number(),
        })
      ),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const org = await ctx.db.get(args.businessId);
    if (!org) return null;

    if (!userId || org.ownerId !== userId) {
      return null;
    }

    const categories = await ctx.db
      .query("menuCategories")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const availableItemsWithValidVat = items.filter(
      (i) => i.available && (i.taxRate === 7 || i.taxRate === 19)
    );

    const orderSessions = await ctx.db
      .query("orderSessions")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const staffSessions = await ctx.db
      .query("staffSessions")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const acceptanceRows = await ctx.db
      .query("acceptanceEvents")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const acceptedSlugs = new Set(acceptanceRows.map((r) => r.documentSlug));

    const hasBusinessProfile = Boolean(
      org.name?.trim() &&
        org.legalName?.trim() &&
        org.address?.trim() &&
        (org.taxId?.trim() || org.vatId?.trim())
    );

    const hasContractsAccepted =
      acceptedSlugs.has("gtc") &&
      acceptedSlugs.has("data-processing") &&
      acceptedSlugs.has("fee-model");

    const hasStripeConnected = Boolean(
      org.stripeAccountId &&
        !org.stripeAccountId.startsWith("acct_test_") &&
        (org.stripeOnboardingComplete || org.stripeChargesEnabled)
    );

    const hasMenuConfigured =
      categories.length >= 1 && availableItemsWithValidVat.length >= 1;

    const hasQrConfigured = Boolean(
      org.isToGoEnabled ||
        (org.isToStayEnabled && org.tables && org.tables.length > 0)
    );

    const hasTabletPaired =
      orderSessions.length > 0 || staffSessions.length > 0;

    const hasPosAndTestOrder = Boolean(
      (org.posWorkflowConfirmedAt || acceptedSlugs.has("pos-workflow")) &&
        org.testOrderCompletedAt
    );

    const steps = [
      {
        id: "account",
        completed: true,
        detail: "Inhaber-Konto verifiziert",
      },
      {
        id: "business_profile",
        completed: hasBusinessProfile,
        detail: hasBusinessProfile
          ? `${org.legalName || org.name} (${org.taxId || org.vatId})`
          : "Rechtlicher Firmenname, Anschrift & Steuernummer/USt-IdNr. erforderlich",
      },
      {
        id: "contracts",
        completed: hasContractsAccepted,
        detail: hasContractsAccepted
          ? `AGB, AVV & 2%-Provisionsmodell (${CURRENT_LEGAL_VERSION}) bestätigt`
          : "B2B-AGB, Auftragsverarbeitung & Gebührenmodell bestätigen",
      },
      {
        id: "stripe_connect",
        completed: hasStripeConnected,
        detail: hasStripeConnected
          ? `Verbunden (${org.stripeAccountId})`
          : "Stripe Connect Onboarding für Direktzahlungen abschließen",
      },
      {
        id: "menu_vat",
        completed: hasMenuConfigured,
        detail: hasMenuConfigured
          ? `${categories.length} Kategorien, ${availableItemsWithValidVat.length} aktive Artikel (7 % / 19 % MwSt.)`
          : "Mindestens 1 Kategorie und 1 verfügbarer Artikel mit 7 % oder 19 % MwSt.",
      },
      {
        id: "qr_codes",
        completed: hasQrConfigured,
        detail: hasQrConfigured
          ? `${org.tables?.length || 0} Tische / Abholung aktiv`
          : "Tisch-QR-Codes oder Abhol-Modus aktivieren",
      },
      {
        id: "staff_tablet",
        completed: hasTabletPaired,
        detail: hasTabletPaired
          ? `${orderSessions.length + staffSessions.length} aktive Personal-Sitzung(en)`
          : "Bestehendes Tablet für Bestell- oder Personal-Ansicht koppeln",
      },
      {
        id: "pos_test_order",
        completed: hasPosAndTestOrder,
        detail: hasPosAndTestOrder
          ? "Kassen-Leitfaden bestätigt & Testbestellung durchgeführt"
          : "Einmalige Kassenerfassung bestätigen und Testbestellung auslösen",
      },
    ];

    const completedCount = steps.filter((s) => s.completed).length;
    const totalSteps = steps.length;
    const percentComplete = Math.round((completedCount / totalSteps) * 100);
    const isReadyForLive =
      completedCount === totalSteps && !org.isPaused;

    return {
      completedCount,
      totalSteps,
      percentComplete,
      isReadyForLive,
      isPaused: org.isPaused ?? false,
      pauseReason: org.pauseReason,
      steps,
      acceptedDocuments: acceptanceRows.map((r) => ({
        documentSlug: r.documentSlug,
        documentVersion: r.documentVersion,
        acceptedAt: r.acceptedAt,
      })),
    };
  },
});

export const recordLegalAcceptance = mutation({
  args: {
    businessId: v.id("businesses"),
    documentSlugs: v.array(v.string()),
    documentVersion: v.optional(v.string()),
    context: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  returns: v.object({
    recordedCount: v.number(),
    version: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Nicht authentifiziert.");
    }
    const org = await ctx.db.get(args.businessId);
    if (!org || org.ownerId !== userId) {
      throw new Error("Keine Berechtigung für diesen Betrieb.");
    }

    const version = args.documentVersion || CURRENT_LEGAL_VERSION;
    const now = Date.now();
    let recordedCount = 0;

    for (const slug of args.documentSlugs) {
      const existing = await ctx.db
        .query("acceptanceEvents")
        .withIndex("by_businessId_and_slug", (q) =>
          q.eq("businessId", args.businessId).eq("documentSlug", slug)
        )
        .first();

      if (!existing || existing.documentVersion !== version) {
        await ctx.db.insert("acceptanceEvents", {
          businessId: args.businessId,
          userId,
          documentSlug: slug,
          documentVersion: version,
          acceptedAt: now,
          userAgent: args.userAgent,
          context: args.context || "setup_wizard",
        });
        recordedCount++;
      }

      if (slug === "pos-workflow") {
        await ctx.db.patch(args.businessId, {
          posWorkflowConfirmedAt: now,
        });
      }
    }

    await ctx.db.insert("auditLogs", {
      actorId: userId,
      actorRole: "merchant",
      action: "merchant.legal_acceptance",
      entityType: "restaurant",
      entityId: String(args.businessId),
      regionId: org.region || "de",
      details: JSON.stringify({
        documentSlugs: args.documentSlugs,
        version,
        context: args.context || "setup_wizard",
      }),
      timestamp: now,
    });

    return { recordedCount, version };
  },
});

function buildEn16931XRechnungXml(params: {
  statementNumber: string;
  issueDateIso: string;
  period: string;
  merchantName: string;
  merchantAddress: string;
  merchantTaxId: string;
  eligibleTurnoverCents: number;
  platformFeeGrossCents: number;
  platformFeeNetCents: number;
  platformFeeVatCents: number;
  platformFeeVatRate: number;
  currency: string;
}): string {
  const netEur = (params.platformFeeNetCents / 100).toFixed(2);
  const vatEur = (params.platformFeeVatCents / 100).toFixed(2);
  const grossEur = (params.platformFeeGrossCents / 100).toFixed(2);
  const eligibleEur = (params.eligibleTurnoverCents / 100).toFixed(2);
  const escapeXml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ubl:Invoice xmlns:ubl="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
             xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
             xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID>
  <cbc:ID>${escapeXml(params.statementNumber)}</cbc:ID>
  <cbc:IssueDate>${escapeXml(params.issueDateIso)}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${escapeXml(params.currency)}</cbc:DocumentCurrencyCode>
  <cbc:BuyerReference>${escapeXml(params.period)}</cbc:BuyerReference>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>Zackisch (Selim Eser)</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:CountrySubentity>DE</cbc:CountrySubentity>
        <cac:Country><cbc:IdentificationCode>DE</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName><cbc:Name>${escapeXml(params.merchantName)}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${escapeXml(params.merchantAddress)}</cbc:StreetName>
        <cac:Country><cbc:IdentificationCode>DE</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${escapeXml(params.merchantTaxId)}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="${escapeXml(params.currency)}">${vatEur}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="${escapeXml(params.currency)}">${netEur}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="${escapeXml(params.currency)}">${vatEur}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${params.platformFeeVatRate}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${escapeXml(params.currency)}">${netEur}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${escapeXml(params.currency)}">${netEur}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${escapeXml(params.currency)}">${grossEur}</cbc:TaxInclusiveAmount>
    <cbc:PrepaidAmount currencyID="${escapeXml(params.currency)}">${grossEur}</cbc:PrepaidAmount>
    <cbc:PayableAmount currencyID="${escapeXml(params.currency)}">0.00</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="${escapeXml(params.currency)}">${netEur}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>2 % Zackisch-Plattformprovision (inkl. USt.) auf ${eligibleEur} ${escapeXml(params.currency)} provisionspflichtigen Bruttowarenwert (ohne freiwilliges Trinkgeld) im Abrechnungszeitraum ${escapeXml(params.period)}. Bereits per Stripe Connect Application Fee einbehalten.</cbc:Description>
      <cbc:Name>Zackisch Plattformprovision (${escapeXml(params.period)})</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${params.platformFeeVatRate}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="${escapeXml(params.currency)}">${netEur}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>
</ubl:Invoice>`;
}

export const getFeeStatements = query({
  args: {
    businessId: v.id("businesses"),
  },
  returns: v.array(
    v.object({
      _id: v.id("merchantFeeStatements"),
      _creationTime: v.number(),
      businessId: v.id("businesses"),
      regionId: v.string(),
      period: v.string(),
      statementNumber: v.string(),
      eligibleTurnoverCents: v.number(),
      tipTurnoverCents: v.number(),
      refundedTurnoverCents: v.number(),
      platformFeeGrossCents: v.number(),
      platformFeeNetCents: v.number(),
      platformFeeVatCents: v.number(),
      platformFeeVatRate: v.number(),
      stripeFeesReportedCents: v.number(),
      orderCount: v.number(),
      xmlContent: v.string(),
      status: v.union(v.literal("issued"), v.literal("corrected")),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const org = await ctx.db.get(args.businessId);
    if (!org || !userId || org.ownerId !== userId) {
      return [];
    }

    return await ctx.db
      .query("merchantFeeStatements")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .order("desc")
      .collect();
  },
});

export const generateMonthlyFeeStatement = mutation({
  args: {
    businessId: v.id("businesses"),
    period: v.string(), // YYYY-MM
  },
  returns: v.id("merchantFeeStatements"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const org = await ctx.db.get(args.businessId);
    if (!org) throw new Error("Betrieb nicht gefunden.");
    if (!userId || org.ownerId !== userId) {
      throw new Error("Nicht berechtigt: Nur der Betriebsinhaber kann Gebührenabrechnungen erstellen.");
    }

    const merchantTaxId = org.vatId?.trim() || org.taxId?.trim();
    if (!merchantTaxId) {
      throw new Error("Steuernummer oder USt-IdNr. des Betriebs erforderlich für die Gebührenabrechnung.");
    }

    const existing = await ctx.db
      .query("merchantFeeStatements")
      .withIndex("by_businessId_and_period", (q) =>
        q.eq("businessId", args.businessId).eq("period", args.period)
      )
      .first();
    if (existing) {
      return existing._id;
    }

    const allOrders = await ctx.db
      .query("orders")
      .withIndex("by_businessId", (q) =>
        q.eq("businessId", args.businessId)
      )
      .collect();

    const periodOrders = allOrders.filter((o) => {
      if (o.status === "cancelled" || o.isTestOrder) return false;
      const d = new Date(o.createdAt ?? o._creationTime);
      const ym = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      return ym === args.period;
    });

    let eligibleTurnoverCents = 0;
    let tipTurnoverCents = 0;
    let refundedTurnoverCents = 0;
    let platformFeeGrossCents = 0;
    let stripeFeesReportedCents = 0;

    for (const o of periodOrders) {
      const tip = o.tipCents ?? 0;
      const refunded = o.refundedAmountCents ?? 0;
      const eligible = Math.max(
        0,
        (o.eligibleSubtotalCents ?? Math.max(0, o.total - tip)) -
          Math.min(o.eligibleSubtotalCents ?? o.total, refunded)
      );
      const feeGross = Math.max(
        0,
        (o.platformFeeGrossCents ?? o.zackischFee ?? 0) -
          (o.refundedPlatformFeeCents ?? 0)
      );

      eligibleTurnoverCents += eligible;
      tipTurnoverCents += tip;
      refundedTurnoverCents += refunded;
      platformFeeGrossCents += feeGross;
      stripeFeesReportedCents += o.stripeFee ?? 0;
    }

    const platformFeeVatRate = 19;
    const platformFeeNetCents = Math.round(
      platformFeeGrossCents / (1 + platformFeeVatRate / 100)
    );
    const platformFeeVatCents = platformFeeGrossCents - platformFeeNetCents;

    const statementNumber = `ZCK-${args.period.replace("-", "")}-${String(
      args.businessId
    )
      .slice(-4)
      .toUpperCase()}`;

    const xmlContent = buildEn16931XRechnungXml({
      statementNumber,
      issueDateIso: new Date().toISOString().slice(0, 10),
      period: args.period,
      merchantName: org.legalName || org.name,
      merchantAddress: org.address || "Deutschland",
      merchantTaxId,
      eligibleTurnoverCents,
      platformFeeGrossCents,
      platformFeeNetCents,
      platformFeeVatCents,
      platformFeeVatRate,
      currency: org.currency || "EUR",
    });

    return await ctx.db.insert("merchantFeeStatements", {
      businessId: args.businessId,
      regionId: org.region || "de",
      period: args.period,
      statementNumber,
      eligibleTurnoverCents,
      tipTurnoverCents,
      refundedTurnoverCents,
      platformFeeGrossCents,
      platformFeeNetCents,
      platformFeeVatCents,
      platformFeeVatRate,
      stripeFeesReportedCents,
      orderCount: periodOrders.length,
      xmlContent,
      status: "issued",
      createdAt: Date.now(),
    });
  },
});
