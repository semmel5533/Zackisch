import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { translations } from "../lib/translations";
const state = vi.hoisted(() => ({ locale: "de" as "de" | "en" }));
vi.mock("@/lib/i18n", () => ({
  useTranslation: () => ({
    t: (key: keyof typeof translations.de & keyof typeof translations.en) =>
      translations[state.locale][key],
  }),
}));
import { CheckoutSummary } from "../components/guest/checkout-summary";
describe("guest legal disclosure", () => {
  for (const locale of ["de", "en"] as const)
    it(`separates merchant terms from guest information in ${locale}`, () => {
      state.locale = locale;
      const html = renderToStaticMarkup(
        createElement(CheckoutSummary, {
          business: {
            $id: "venue",
            _id: "venue",
            name: "Restaurant",
            canOrder: true,
            isPaused: false,
          },
          editable: false,
          totalChargeCents: 1000,
          tipCents: 0,
        }),
      );
      expect(html).toContain(`https://zackisch.com/de-${locale}/guest-terms`);
      expect(html).not.toContain("/gtc");
      expect(html).not.toMatch(/stimmst du|you agree/);
      expect(html).toContain(translations[locale].privacyPolicy);
    });
});
