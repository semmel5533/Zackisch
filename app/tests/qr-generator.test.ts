import { describe, expect, it } from "vitest";
import {
  buildGuestQrUrl,
  createQrPrintCardSpec,
  sanitizeTableIdentifier,
} from "../lib/qr-generator";

describe("qr-generator", () => {
  it("builds deterministic takeaway and table URLs without trailing slash bugs", () => {
    expect(
      buildGuestQrUrl({
        baseUrl: "https://app.zackisch.com/",
        organizationId: "org_123",
      }),
    ).toBe("https://app.zackisch.com/org_123");

    expect(
      buildGuestQrUrl({
        baseUrl: "https://app.zackisch.com",
        organizationId: "org_123",
        tableNumber: "14",
      }),
    ).toBe("https://app.zackisch.com/org_123/14");
  });

  it("sanitizes special characters in table numbers", () => {
    expect(sanitizeTableIdentifier('  Terrasse "A"<script>  ')).toBe(
      "Terrasse Ascript",
    );
  });

  it("enforces ISO/IEC 18004 >= 4-module quiet zone, high-contrast black-on-white, and >= 30mm print size", () => {
    const card = createQrPrintCardSpec({
      organizationId: "org_123",
      venueName: "Bistro Zackisch",
      tableNumber: "7",
      locale: "de",
    });

    expect(card.quietZoneModules).toBeGreaterThanOrEqual(4);
    expect(card.foregroundColor).toBe("#000000");
    expect(card.backgroundColor).toBe("#FFFFFF");
    expect(card.minPrintSizeMm).toBeGreaterThanOrEqual(30);
    expect(card.heading).toBe("AN TISCH 7 BESTELLEN");
    expect(card.displayUrl).toBe("app.zackisch.com/org_123/7");
  });
});
