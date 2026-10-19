import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import { translations } from "../lib/translations";

describe("next-intl messages", () => {
  for (const [surface, dictionaries] of Object.entries({
    app: translations,
  })) {
    for (const [locale, messages] of Object.entries(dictionaries)) {
      it(`formats every ${surface} message in ${locale}`, () => {
        const errors: unknown[] = [];
        const t = createTranslator({
          locale,
          messages: messages as Record<string, string>,
          onError: (error) => errors.push(error),
        });
        for (const [key, text] of Object.entries(
          messages as Record<string, string>,
        )) {
          const values = Object.fromEntries(
            [...text.matchAll(/\{(\w+)\}/g)].map((match) => [match[1], "3"]),
          );
          expect(t(key, values)).toBeTruthy();
        }
        expect(errors).toEqual([]);
      });
    }
  }
  it("formats dynamic values without manual replacement", () => {
    const t = createTranslator({ locale: "de", messages: translations.de });
    expect(t("printMultipleCodes", { count: "3" })).toBe("3 drucken");
    expect(t("resendIn", { time: "45" })).toContain("45");
  });
});
