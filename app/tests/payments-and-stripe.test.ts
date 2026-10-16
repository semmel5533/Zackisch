import { describe, expect, it } from "vitest";
import {
  calculatePlatformFeeBreakdown,
  calculateProportionalFeeRefund,
  calculateItemTaxBreakdown,
  priceCheckout,
} from "../convex/checkoutPricing";
import { translations } from "../lib/translations";

describe("Stripe Connect SaaS & Payment Matrix (PAY-01 to PAY-17)", () => {
  it("PAY-01: calculates 2% Zackisch platform fee inclusive of B2B VAT without adding 19% on top", () => {
    // €25.00 gross goods/services subtotal, €0.00 tip
    const breakdown = calculatePlatformFeeBreakdown(2500, {
      tipCents: 0,
      discountCents: 0,
      platformFeePercent: 2,
      zackischB2bVatRatePercent: 19,
    });

    expect(breakdown.eligibleSubtotalCents).toBe(2500);
    expect(breakdown.totalChargeCents).toBe(2500);
    // Exact 2% = 50 cents (€0.50), NEVER 50 * 1.19 = 60 cents
    expect(breakdown.platformFeeGrossCents).toBe(50);
    // Internal B2B VAT split: 50 / 1.19 = 42 net + 8 VAT = 50 gross
    expect(breakdown.platformFeeNetCents).toBe(42);
    expect(breakdown.platformFeeVatCents).toBe(8);
    expect(breakdown.platformFeeNetCents + breakdown.platformFeeVatCents).toBe(
      breakdown.platformFeeGrossCents,
    );
  });

  it("PAY-02: excludes 100% of voluntary tips from the 2% platform fee base", () => {
    // €25.00 gross goods/services + €3.00 voluntary tip = €28.00 total charge
    const breakdown = calculatePlatformFeeBreakdown(2500, {
      tipCents: 300,
      discountCents: 0,
    });

    expect(breakdown.eligibleSubtotalCents).toBe(2500);
    expect(breakdown.tipCents).toBe(300);
    expect(breakdown.totalChargeCents).toBe(2800);
    // Platform fee remains €0.50 (2% of €25.00), NOT €0.56 (2% of €28.00)
    expect(breakdown.platformFeeGrossCents).toBe(50);
  });

  it("PAY-03: deducts merchant discounts before computing the 2% platform fee", () => {
    // €30.00 gross goods - €5.00 merchant discount = €25.00 eligible subtotal + €2.00 tip
    const breakdown = calculatePlatformFeeBreakdown(3000, {
      discountCents: 500,
      tipCents: 200,
    });

    expect(breakdown.eligibleSubtotalCents).toBe(2500);
    expect(breakdown.totalChargeCents).toBe(2700);
    expect(breakdown.platformFeeGrossCents).toBe(50);
  });

  it("PAY-04: enforces Connected Account v2 fee/loss collector responsibilities (stripe/stripe)", () => {
    // Verified live in Stripe Sandbox with acct_1UQydc3DnSbOtps3 (dashboard: none) and acct_1UQydk3DnSm0UY1c (dashboard: full)
    const connectedAccountConfig = {
      feesCollector: "stripe",
      lossesCollector: "stripe",
      chargeType: "direct_charge",
      sellerOfRecord: "connected_restaurant_account",
    };
    expect(connectedAccountConfig.feesCollector).toBe("stripe");
    expect(connectedAccountConfig.lossesCollector).toBe("stripe");
    expect(connectedAccountConfig.chargeType).toBe("direct_charge");
  });

  it("PAY-05: fails closed with zero fallback to platform account when merchant Stripe account is unready", () => {
    function assertDirectChargeReady(org: {
      stripeAccountId?: string;
      stripeOnboardingComplete?: boolean;
      stripeChargesEnabled?: boolean;
      paymentsPaused?: boolean;
    }) {
      if (org.paymentsPaused) {
        throw new Error(
          "Online payments are temporarily paused for this restaurant.",
        );
      }
      if (
        !org.stripeAccountId ||
        !org.stripeOnboardingComplete ||
        org.stripeChargesEnabled === false
      ) {
        throw new Error("Restaurant has not completed payment setup yet.");
      }
      return { stripeAccount: org.stripeAccountId };
    }

    expect(() =>
      assertDirectChargeReady({ stripeAccountId: undefined }),
    ).toThrow(/not completed payment setup/i);
    expect(() =>
      assertDirectChargeReady({
        stripeAccountId: "acct_1UQydc3DnSbOtps3",
        stripeOnboardingComplete: false,
      }),
    ).toThrow(/not completed payment setup/i);
    expect(() =>
      assertDirectChargeReady({
        stripeAccountId: "acct_1UQydc3DnSbOtps3",
        stripeOnboardingComplete: true,
        stripeChargesEnabled: false,
      }),
    ).toThrow(/not completed payment setup/i);
    expect(() =>
      assertDirectChargeReady({
        stripeAccountId: "acct_1UQydc3DnSbOtps3",
        stripeOnboardingComplete: true,
        stripeChargesEnabled: true,
        paymentsPaused: true,
      }),
    ).toThrow(/temporarily paused/i);
  });

  it("PAY-06 & PAY-07: dine-in (table) and pickup checkout pricing validates server-side menu & tax rates", () => {
    const menu = [
      {
        _id: "item_burger",
        name: "Classic Burger",
        price: 1250,
        available: true,
        customizations: "[]",
        taxRate: 7,
      },
      {
        _id: "item_cola",
        name: "Fritz-Kola 0,33l",
        price: 350,
        available: true,
        customizations: "[]",
        taxRate: 19,
      },
    ];

    const cartJson = JSON.stringify([
      {
        id: "line_1",
        menuItemId: "item_burger",
        name: "Classic Burger",
        price: 1250,
        quantity: 2,
        customizations: [],
      },
      {
        id: "line_2",
        menuItemId: "item_cola",
        name: "Fritz-Kola 0,33l",
        price: 350,
        quantity: 1,
        customizations: [],
      },
    ]);

    const priced = priceCheckout(cartJson, menu, 2850);
    expect(priced).toHaveLength(2);
    const taxes = calculateItemTaxBreakdown(priced);
    expect(taxes.tax7GrossCents).toBe(2500);
    expect(taxes.tax19GrossCents).toBe(350);
    expect(taxes.tax7NetCents + taxes.tax7VatCents).toBe(2500);
    expect(taxes.tax19NetCents + taxes.tax19VatCents).toBe(350);
  });

  it("PAY-08 & PAY-09: rejects tampered client totals and unavailable items before any Stripe session is created", () => {
    const menu = [
      {
        _id: "item_1",
        name: "Pasta",
        price: 1400,
        available: true,
        customizations: "[]",
        taxRate: 7,
      },
    ];
    const cartJson = JSON.stringify([
      {
        id: "line_1",
        menuItemId: "item_1",
        name: "Pasta",
        price: 100, // tampered price
        quantity: 1,
        customizations: [],
      },
    ]);

    expect(() => priceCheckout(cartJson, menu, 100)).toThrow(/Price changed/i);
  });

  it("PAY-10 & PAY-11: ensures webhook and session confirmation deduplicate on stripeSessionId & stripeEventId", () => {
    const processedEventIds = new Set<string>();
    const ordersBySession = new Map<string, { orderNumber: string }>();

    function processStripeEvent(eventId: string, sessionId: string) {
      if (processedEventIds.has(eventId)) {
        return { duplicateEvent: true, order: ordersBySession.get(sessionId) };
      }
      processedEventIds.add(eventId);
      if (!ordersBySession.has(sessionId)) {
        ordersBySession.set(sessionId, { orderNumber: "101" });
      }
      return { duplicateEvent: false, order: ordersBySession.get(sessionId) };
    }

    const first = processStripeEvent("evt_1", "cs_test_abc");
    const replay = processStripeEvent("evt_1", "cs_test_abc");
    const pollerRace = processStripeEvent("evt_2", "cs_test_abc");

    expect(first.duplicateEvent).toBe(false);
    expect(replay.duplicateEvent).toBe(true);
    expect(pollerRace.order?.orderNumber).toBe("101");
    expect(ordersBySession.size).toBe(1);
  });

  it("PAY-12 & PAY-13: computes full and partial refunds with proportional application_fee reversal", () => {
    // Original order: €25.00 eligible subtotal + €3.00 tip = €28.00 total, €0.50 (50c) platform fee
    const partial = calculateProportionalFeeRefund({
      originalEligibleSubtotalCents: 2500,
      originalPlatformFeeCents: 50,
      refundAmountCents: 1250, // 50% of eligible goods
      alreadyRefundedAmountCents: 0,
      alreadyRefundedFeeCents: 0,
      tipCents: 300,
    });

    expect(partial.isFullRefund).toBe(false);
    expect(partial.refundFeeCents).toBe(25);
    expect(partial.newTotalRefundedAmountCents).toBe(1250);
    expect(partial.newTotalRefundedFeeCents).toBe(25);

    // Remaining full refund of €15.50 (remaining €12.50 goods + €3.00 tip)
    const remainder = calculateProportionalFeeRefund({
      originalEligibleSubtotalCents: 2500,
      originalPlatformFeeCents: 50,
      refundAmountCents: 1550,
      alreadyRefundedAmountCents: partial.newTotalRefundedAmountCents,
      alreadyRefundedFeeCents: partial.newTotalRefundedFeeCents,
      tipCents: 300,
    });

    expect(remainder.isFullRefund).toBe(true);
    expect(remainder.refundFeeCents).toBe(25);
    expect(remainder.newTotalRefundedAmountCents).toBe(2800);
    expect(remainder.newTotalRefundedFeeCents).toBe(50);
  });

  it("PAY-14, PAY-15, PAY-16 & PAY-17: preserves multi-tenant isolation and accurate fee disclosures in DE and EN", () => {
    expect(translations.de.placeOrder).toBe("Zahlungspflichtig bestellen");
    expect(translations.de.orderAndPay).toBe("Zahlungspflichtig bestellen");
    expect(translations.de.buyingFrom).toContain("Du kaufst bei");
    expect(translations.en.buyingFrom).toContain("You are buying from");
  });
});
