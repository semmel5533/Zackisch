import { describe, expect, it } from "vitest";
import { translations } from "../../app/lib/translations";
import { content, pageSlugs } from "../lib/content";

describe("application legal links", () => {
  for (const lang of ["de", "en"] as const) {
    it(`resolves merchant, guest and platform privacy links in ${lang}`, () => {
      for (const key of ["termsUrl", "guestTermsUrl", "privacyUrl"] as const) {
        const url = new URL(translations[lang][key]);
        expect(url.origin).toBe("https://zackisch.com");
        const [, locale, slug] = url.pathname.split("/");
        expect(locale).toBe(`de-${lang}`);
        expect(pageSlugs).toContain(slug);
      }
      expect(
        content[`de-${lang}`].pages["privacy-policy"].sections.length,
      ).toBeGreaterThan(0);
      expect(translations[lang].privacyUrl).not.toBe(
        `https://zackisch.com/de-${lang}/privacy`,
      );
    });
  }
});
