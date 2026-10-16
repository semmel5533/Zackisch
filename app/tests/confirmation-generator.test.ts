import { describe, expect, it } from "vitest";
import { generateOrderConfirmationHtml } from "../lib/confirmation-generator";
import type { Order, Business } from "../lib/types";

describe("generateOrderConfirmationHtml", () => {
  const mockBusiness: Business = {
    _id: "biz-1",
    $id: "biz-1",
    _creationTime: 1789992000000,
    name: "Bistro Zakkig",
    legalName: "Bistro Zakkig GmbH",
    vatId: "DE123456789",
    ownerId: "user-1",
    stripeAccountId: "acct_secret_123",
    stripeOnboardingComplete: true,
    address: "Marktplatz 1\n68159 Mannheim",
    isToGoEnabled: true,
    isToStayEnabled: true,
  };

  const mockOrder: Order = {
    _id: "order-123456",
    $id: "order-123456",
    _creationTime: 1789992000000,
    createdAt: 1789992000000,
    businessId: "biz-1",
    orderNumber: "042",
    type: "dine-in",
    tableNumber: "7",
    items: JSON.stringify([
      {
        name: "Pizza Margherita",
        price: 1250,
        quantity: 2,
        options: [{ name: "Extras", choice: "Oliven", price: 100 }],
      },
      {
        name: "Zitronenlimonade",
        price: 450,
        quantity: 1,
      },
    ]),
    total: 3150,
    tipCents: 200,
    status: "in_progress",
    email: "guest@example.com",
    stripePaymentId: "pi_secret_999",
    zakkigFee: 59,
    stripeFee: 0,
    netAmount: 2891,
    currency: "EUR",
  };

  it("generates German order and payment confirmation with explicit non-fiscal notice and seller identity", () => {
    const html = generateOrderConfirmationHtml(mockOrder, mockBusiness, "de");

    expect(html).toContain("Bestell- und Zahlungsbestätigung");
    expect(html).toContain("Kein Kassenbeleg und keine Rechnung");
    expect(html).toContain(
      "Den gesetzlich erforderlichen Kassenbeleg beziehungsweise eine Rechnung stellt dir der Gastronomiebetrieb zur Verfügung.",
    );
    expect(html).toContain("Bestellnummer");
    expect(html).toContain("042");
    expect(html).toContain("PDF speichern");
    expect(html).toContain("Bistro Zakkig");
    expect(html).toContain("Bistro Zakkig GmbH");
    expect(html).toContain("DE123456789");
    expect(html).toContain("Marktplatz 1");
    expect(html).toContain("68159 Mannheim");
    expect(html).toContain("An Tisch 7");
    expect(html).toContain("Pizza Margherita");
    expect(html).toContain("Extras: Oliven");
    expect(html).toContain("Zitronenlimonade");
    expect(html).toContain("Freiwilliges Trinkgeld");
    expect(html).toContain("2,00 €");
    expect(html).toContain("31,50 €");
    expect(html).toContain("zackisch.com");
    // Must not expose raw Stripe secret IDs or guest email in public confirmation HTML
    expect(html).not.toContain("acct_secret_123");
    expect(html).not.toContain("pi_secret_999");
    expect(html).not.toContain("guest@example.com");
  });

  it("generates English order and payment confirmation with explicit non-fiscal notice", () => {
    const takeawayOrder: Order = {
      ...mockOrder,
      type: "takeaway",
      tableNumber: undefined,
    };
    const html = generateOrderConfirmationHtml(takeawayOrder, mockBusiness, "en");

    expect(html).toContain("Order and Payment Confirmation");
    expect(html).toContain("Not a fiscal POS receipt or tax invoice");
    expect(html).toContain(
      "It is not a fiscal POS receipt and not a tax invoice. The statutory POS receipt or an invoice is provided to you by the hospitality venue.",
    );
    expect(html).toContain("Order number");
    expect(html).toContain("042");
    expect(html).toContain("Save as PDF");
    expect(html).toContain("Takeaway");
  });

  it("escapes special characters to prevent HTML injection", () => {
    const xssOrder: Order = {
      ...mockOrder,
      items: JSON.stringify([
        {
          name: "<script>alert('xss')</script>",
          price: 500,
          quantity: 1,
        },
      ]),
    };
    const html = generateOrderConfirmationHtml(xssOrder, mockBusiness, "de");

    expect(html).not.toContain("<script>alert('xss')</script>");
    expect(html).toContain("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;");
  });
});
