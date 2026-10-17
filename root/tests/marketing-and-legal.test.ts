import { describe, expect, it } from "vitest";
import { translations } from "../lib/translations";
import { landingTranslations } from "../lib/landing-translations";
import { legalTranslations } from "../lib/legal-translations";

describe("Root Marketing, Brand Copy & Legal Pages Verification", () => {
  it("enforces approved brand core positioning in German and English", () => {
    // Approved core message: "Deine Kasse bleibt. Deine Gäste bestellen selbst."
    expect(landingTranslations.de.heroLeft).toBe("Deine Kasse bleibt.");
    expect(landingTranslations.de.heroRight).toBe(
      "Deine Gäste bestellen selbst.",
    );
    expect(landingTranslations.de.heroSummary).toContain(
      "gewohnte Kasse",
    );

    // English equivalent
    expect(landingTranslations.en.heroLeft).toBe("Keep your register.");
    expect(landingTranslations.en.heroRight).toBe(
      "Your guests order themselves.",
    );
  });

  it("verifies truthfulness of pricing claims (2% fee, transparent VAT, 0% on tips)", () => {
    // German fee disclosure
    expect(landingTranslations.de.feeNote).toContain("2 %");
    expect(landingTranslations.de.feeNote).toContain(
      "inkl. USt. auf unsere Leistung",
    );
    expect(landingTranslations.de.feeNote).toContain(
      "freiwilliges Trinkgeld ausgenommen",
    );
    expect(landingTranslations.de.feePromise).toContain(
      "Keine Bestellung über Zackisch? Keine prozentuale Zackisch-Gebühr",
    );

    // English fee disclosure
    expect(landingTranslations.en.feeNote).toContain("2%");
    expect(landingTranslations.en.feeNote).toContain(
      "inclusive of VAT on our service",
    );
    expect(landingTranslations.en.feeNote).toContain("tips excluded");
  });

  it("clarifies POS workflow without false automatic synchronization claims", () => {
    expect(landingTranslations.de.flowTitle).toBe(
      "Du musst nichts ersetzen, was schon funktioniert.",
    );
    expect(landingTranslations.de.flowPayText).toContain(
      "Zackisch verbindet sich nicht automatisch mit deinem Kassensystem",
    );
    expect(landingTranslations.de.flowPayText).toContain(
      "du erfasst bezahlte Bestellungen weiterhin einfach in deiner vorhandenen Kasse",
    );
  });

  it("provides comprehensive legal routes in German and English", () => {
    // All 5 required legal pages + support center
    expect(translations.de.legalUrl).toBe("/de-de/legal-notice");
    expect(translations.de.privacyUrl).toBe("/de-de/privacy-policy");
    expect(translations.de.gtcUrl).toBe("/de-de/gtc");
    expect(translations.de.dataProcessingUrl).toBe("/de-de/data-processing");
    expect(translations.de.accessibilityUrl).toBe("/de-de/accessibility");
    expect(translations.de.supportUrl).toBe("https://support.zackisch.com/de-de");

    expect(translations.en.legalUrl).toBe("/de-en/legal-notice");
    expect(translations.en.privacyUrl).toBe("/de-en/privacy-policy");
    expect(translations.en.gtcUrl).toBe("/de-en/gtc");
    expect(translations.en.dataProcessingUrl).toBe("/de-en/data-processing");
    expect(translations.en.accessibilityUrl).toBe("/de-en/accessibility");
    expect(translations.en.supportUrl).toBe("https://support.zackisch.com/de-en");

    // Imprint satisfies § 5 DDG mandatory fields
    expect(legalTranslations.de.legalBasis).toContain("§ 5 DDG");
    expect(legalTranslations.de.legalName).toBe("Selim Eser");
    expect(legalTranslations.de.legalAddress).toContain("Mannheim");
    expect(legalTranslations.de.legalEmailLabel).toBe("E-Mail:");
  });

  it("records honest model/property release status and SHA-256 checksums in media register", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const csv = fs.readFileSync(
      path.resolve(__dirname, "../public/media/register.csv"),
      "utf8",
    );
    expect(csv).toContain("sha256_webp,sha256_jpg");
    expect(csv).toContain("model_release_verified,property_release_verified");
    expect(csv).not.toContain("Agent Verification");
    expect(csv).not.toContain('"Pexels Standard License - Free Commercial Use"');
    expect(csv).toContain('"unverified"');
  });
});
