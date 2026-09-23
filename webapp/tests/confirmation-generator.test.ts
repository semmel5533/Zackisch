import { describe, expect, it } from "vitest";
import { generateOrderConfirmationHtml } from "../lib/confirmation-generator";
import type { Order, Organization } from "../lib/types";

describe("generateOrderConfirmationHtml", () => {
  const mockOrg: Organization = {
    _id: "org-1",
    $id: "org-1",
    _creationTime: 1789992000000,
    name: "Bistro Zakkig",
    ownerId: "user-1",
    stripeAccountId: "acct-1",
    stripeOnboardingComplete: true,
    address: "Marktplatz 1\n68159 Mannheim",
    isToGoEnabled: true,
    isToStayEnabled: true,
  };

  const mockOrder: Order = {
    _id: "order-1",
    $id: "order-1",
    _creationTime: 1789992000000,
    createdAt: 1789992000000,
    organizationId: "org-1",
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
    total: 2950,
    status: "in_progress",
    email: "",
    zakkigFee: 59,
    stripeFee: 0,
    netAmount: 2891,
    currency: "EUR",
  };

  it("generates German order and payment confirmation with legal tax disclaimer", () => {
    const html = generateOrderConfirmationHtml(mockOrder, mockOrg, "de");

    expect(html).toContain("Bestell- und Zahlungsbestätigung");
    expect(html).toContain("Bestellnummer");
    expect(html).toContain("042");
    expect(html).toContain("PDF speichern");
    expect(html).toContain("Bistro Zakkig");
    expect(html).toContain("Marktplatz 1");
    expect(html).toContain("68159 Mannheim");
    expect(html).toContain("An Tisch 7");
    expect(html).toContain("Pizza Margherita");
    expect(html).toContain("Extras: Oliven");
    expect(html).toContain("Zitronenlimonade");
    expect(html).toContain("29,50 €");
    expect(html).toContain("Wichtiger Hinweis:");
    expect(html).toContain("steuerliche Bewirtungsquittung bzw. offizielle Rechnung wird auf Wunsch direkt vom Betrieb ausgestellt");
    expect(html).toContain("zakkig.com");
  });

  it("generates English order and payment confirmation with legal tax disclaimer", () => {
    const takeawayOrder: Order = {
      ...mockOrder,
      type: "takeaway",
      tableNumber: undefined,
    };
    const html = generateOrderConfirmationHtml(takeawayOrder, mockOrg, "en");

    expect(html).toContain("Order and Payment Confirmation");
    expect(html).toContain("Order number");
    expect(html).toContain("042");
    expect(html).toContain("Save as PDF");
    expect(html).toContain("Takeaway");
    expect(html).toContain("Important note:");
    expect(html).toContain("The official tax invoice or receipt is issued directly by the venue upon request.");
    expect(html).toContain("zakkig.com");
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
    const html = generateOrderConfirmationHtml(xssOrder, mockOrg, "de");

    expect(html).not.toContain("<script>alert('xss')</script>");
    expect(html).toContain("&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;");
  });
});
