import { describe, expect, it } from "vitest";
import {
  content,
  defaultLocale,
  localeConfigs,
  locales,
  pageSlugs,
  resolveBrowserLocale,
  resolveLanguageAlternateUrls,
  resolveLocale,
  resolveLocaleFromPathname,
} from "../lib/content";
import { marketing } from "../lib/marketing-content";
import { pageMetadata } from "../lib/metadata";

function leafPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return [path];
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, item]) =>
    leafPaths(item, `${path}.${key}`),
  );
}

describe("localized website", () => {
  it("resolves browser language preferences with defaultLocale fallback", () => {
    expect(resolveBrowserLocale(["de-DE", "en-US"], "de-DE")).toBe("de-de");
    expect(resolveBrowserLocale(["de-AT"], "de-AT")).toBe("de-de");
    expect(resolveBrowserLocale(["en-US", "de-DE"], "en-US")).toBe("de-en");
    expect(resolveBrowserLocale(["en-GB"], "en-GB")).toBe("de-en");
    expect(resolveBrowserLocale(["fr-FR", "en-US"], "fr-FR")).toBe("de-en");
    expect(resolveBrowserLocale(["fr-FR", "es-ES"], "fr-FR")).toBe(
      defaultLocale,
    );
    expect(resolveBrowserLocale([], undefined)).toBe(defaultLocale);
    expect(resolveBrowserLocale(undefined, undefined)).toBe(defaultLocale);
    expect(resolveLocale("de-en")).toBe("de-en");
    expect(resolveLocale("unknown")).toBe(defaultLocale);
    expect(resolveLocaleFromPathname("/de-en/research")).toBe("de-en");
    expect(resolveLocaleFromPathname("/unknown")).toBe(defaultLocale);
  });
  it("has matching complete dictionary structures across all configured locales", () => {
    const baseline = leafPaths(content[defaultLocale]);
    const baselineMarketing = leafPaths(marketing[defaultLocale]);
    for (const locale of locales) {
      expect(leafPaths(content[locale])).toEqual(baseline);
      expect(leafPaths(marketing[locale])).toEqual(baselineMarketing);
      expect(localeConfigs[locale].locale).toBe(locale);
    }
  });
  for (const locale of locales) {
    for (const slug of ["", ...pageSlugs] as const) {
      it(`publishes consistent alternate URLs for ${locale}/${slug}`, () => {
        const suffix = slug ? `/${slug}` : "";
        const page = slug ? content[locale].pages[slug] : undefined;
        const metadata = pageMetadata(locale, slug, page?.title, page?.intro);
        expect(metadata.alternates).toEqual({
          canonical: `https://zackisch.com/${locale}${suffix}`,
          languages: resolveLanguageAlternateUrls(slug),
        });
        expect(metadata.title).toMatch(/ \| Zackisch$/);
        expect(String(metadata.title).match(/\| Zackisch/g)).toHaveLength(1);
        expect(metadata.openGraph?.title).toBe(metadata.title);
        expect(metadata.twitter?.title).toBe(metadata.title);
        expect(metadata.openGraph?.locale).toBe(localeConfigs[locale].ogLocale);
        const expectedAlternates = locales
          .filter((candidate) => candidate !== locale)
          .map((candidate) => localeConfigs[candidate].ogLocale);
        expect(metadata.openGraph?.alternateLocale).toEqual(
          expectedAlternates.length === 1
            ? expectedAlternates[0]
            : expectedAlternates,
        );
        expect(
          String(metadata.openGraph?.description).length,
        ).toBeLessThanOrEqual(120);
        expect(
          String(metadata.twitter?.description).length,
        ).toBeLessThanOrEqual(120);
        expect(metadata.robots).toMatchObject({ index: true });
      });
    }
  }
});
