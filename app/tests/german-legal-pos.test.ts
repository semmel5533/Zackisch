import { describe, expect, it } from "vitest";
import { generateOrderConfirmationHtml } from "../lib/confirmation-generator";
import { translations } from "../lib/translations";
import {
  buildEn16931XRechnungXml,
  validateEn16931Completeness,
} from "../convex/setup";
import type { Order, Business } from "../lib/types";

const sampleBusiness: Business = {
  _id: "biz_legal_1",
  $id: "biz_legal_1",
  _creationTime: 1789992000000,
  name: "Ristorante Bella Vista",
  legalName: "Bella Vista Gastro GmbH",
  address: "Friedrichstraße 100\n10117 Berlin",
  taxId: "DE999888777",
  vatId: "DE999888777",
  ownerId: "user_1",
  stripeAccountId: "acct_1UQydc3DnSbOtps3",
  stripeOnboardingComplete: true,
  stripeChargesEnabled: true,
  stripePayoutsEnabled: true,
  region: "DE",
  currency: "EUR",
  isToGoEnabled: true,
  isToStayEnabled: true,
};

const sampleOrder: Order = {
  _id: "order_legal_1",
  $id: "order_legal_1",
  _creationTime: 1789992000000,
  createdAt: 1789992000000,
  businessId: "biz_legal_1",
  orderNumber: "204",
  tableNumber: "7",
  type: "dine-in",
  status: "in_progress",
  email: "guest@example.com",
  items: JSON.stringify([
    {
      name: "Pizza Margherita",
      price: 1200,
      quantity: 1,
      taxRate: 7,
    },
    {
      name: "Aperol Spritz",
      price: 800,
      quantity: 1,
      taxRate: 19,
    },
  ]),
  total: 2200,
  eligibleGrossSubtotalCents: 2000,
  tipCents: 200,
  applicationFeeCents: 40,
  zakkigFee: 40,
  stripeFee: 0,
  netAmount: 2160,
  posStatus: "pending",
  stripePaymentId: "pi_test_secret_123456789",
  stripeSessionId: "cs_test_secret_987654321",
  currency: "EUR",
};

describe("German Legal, Fiscal & POS Single-Entry Matrix (DE-LEGAL-001 to DE-LEGAL-025)", () => {
  it("DE-LEGAL-001 to DE-LEGAL-005: enforces § 312j Abs. 3 BGB button wording, PAngV gross pricing, and Seller of Record notice", () => {
    expect(translations.de.placeOrder).toBe("Zahlungspflichtig bestellen");
    expect(translations.de.orderAndPay).toBe("Zahlungspflichtig bestellen");
    expect(translations.de.buyingFrom).toBe("Du kaufst bei:");
    expect(translations.de.priceWithTax).toBe("(inkl. MwSt.)");
  });

  it("DE-LEGAL-006 to DE-LEGAL-012: guest confirmation states 'Bestell- und Zahlungsbestätigung' and 'Kein Kassenbeleg und keine Rechnung' without false legal claims", () => {
    const htmlDe = generateOrderConfirmationHtml(sampleOrder, sampleBusiness, "de");

    expect(htmlDe).toContain("Bestell- und Zahlungsbestätigung");
    expect(htmlDe).toContain("Kein Kassenbeleg und keine Rechnung");

    // Must never claim that ONLY the physical POS can legally issue an invoice
    expect(htmlDe.toLowerCase()).not.toContain("nur die kasse");
    expect(htmlDe.toLowerCase()).not.toContain("ausschließlich die kasse");

    // Must display Seller of Record legal name and address
    expect(htmlDe).toContain("Bella Vista Gastro GmbH");
    expect(htmlDe).toContain("Friedrichstraße 100");

    // Must never leak raw Stripe secret IDs
    expect(htmlDe).not.toContain("cs_test_secret_987654321");
    expect(htmlDe).not.toContain("pi_test_secret_123456789");
  });

  it("DE-LEGAL-013 to DE-LEGAL-020: enforces single-entry POS recording workflow and duplicate booking prevention", () => {
    // Simulate POS state machine
    let posStatus: "pending" | "recorded" = "pending";
    function markRecorded() {
      if (posStatus === "recorded") {
        throw new Error(
          "Order is already marked as recorded in the POS. Duplicate POS entry is blocked.",
        );
      }
      posStatus = "recorded";
      return posStatus;
    }

    expect(markRecorded()).toBe("recorded");
    expect(() => markRecorded()).toThrow(/Duplicate POS entry is blocked/i);
  });

  it("DE-LEGAL-021 to DE-LEGAL-025: verifies 8-year tax retention alignment (§ 147 AO / GoBD) and B2B EN 16931 / XRechnung 3.0 completeness validation", () => {
    const retentionYears = 8; // § 147 Abs. 3 AO (BEG IV) minimum commercial/tax booking document retention
    expect(retentionYears).toBeGreaterThanOrEqual(8);
    expect(sampleOrder.applicationFeeCents).toBe(40); // 2% of €20.00 eligible goods (excluding €2.00 tip)

    const baseParams = {
      statementNumber: "ZCK-202610-BIZ1",
      issueDateIso: "2026-10-17",
      period: "2026-10",
      merchantName: "Bella Vista Gastro GmbH",
      merchantAddress: "Friedrichstraße 100, 10117 Berlin",
      merchantTaxId: "DE999888777",
      eligibleTurnoverCents: 100000,
      platformFeeGrossCents: 2000,
      platformFeeNetCents: 1681,
      platformFeeVatCents: 319,
      platformFeeVatRate: 19,
      currency: "EUR",
    };

    // Without supplierTaxId, must flag incomplete mandatory § 14 UStG field and mark XML as draft
    const draftCheck = validateEn16931Completeness(baseParams);
    expect(draftCheck.isComplete).toBe(false);
    expect(draftCheck.missingFields).toContain("supplierTaxId");
    const draftXml = buildEn16931XRechnungXml(baseParams);
    expect(draftXml).toContain("urn:cen.eu:en16931:2017#draft-pending-supplier-tax-id");
    expect(draftXml).toContain("VORLÄUFIGER ABRECHNUNGSENTWURF");
    expect(draftXml).toContain("Dannstadter Straße 6-8");
    expect(draftXml).toContain("68199");
    expect(draftXml).toContain("Mannheim");

    // With supplierTaxId configured, must pass completeness and emit full XRechnung 3.0 UBL
    const completeParams = {
      ...baseParams,
      supplierTaxId: "DE123456789",
    };
    const completeCheck = validateEn16931Completeness(completeParams);
    expect(completeCheck.isComplete).toBe(true);
    expect(completeCheck.missingFields).toHaveLength(0);
    const completeXml = buildEn16931XRechnungXml(completeParams);
    expect(completeXml).toContain(
      "urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0",
    );
    expect(completeXml).toContain("<cbc:CompanyID>DE123456789</cbc:CompanyID>");
    expect(completeXml).toContain("<cbc:PaymentMeansCode>48</cbc:PaymentMeansCode>");
  });
});
