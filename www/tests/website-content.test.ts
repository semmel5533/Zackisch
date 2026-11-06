import { describe, expect, it } from "vitest";
import {
  content,
  locales,
  pageSlugs,
  resolveBrowserLocale,
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
  it("resolves browser language preferences with de-de default fallback", () => {
    expect(resolveBrowserLocale(["de-DE", "en-US"], "de-DE")).toBe("de-de");
    expect(resolveBrowserLocale(["de-AT"], "de-AT")).toBe("de-de");
    expect(resolveBrowserLocale(["en-US", "de-DE"], "en-US")).toBe("de-en");
    expect(resolveBrowserLocale(["en-GB"], "en-GB")).toBe("de-en");
    expect(resolveBrowserLocale(["fr-FR", "en-US"], "fr-FR")).toBe("de-en");
    expect(resolveBrowserLocale(["fr-FR", "es-ES"], "fr-FR")).toBe("de-de");
    expect(resolveBrowserLocale([], undefined)).toBe("de-de");
    expect(resolveBrowserLocale(undefined, undefined)).toBe("de-de");
  });
  it("has matching complete dictionary structures", () => {
    expect(leafPaths(content["de-en"])).toEqual(leafPaths(content["de-de"]));
    expect(leafPaths(marketing["de-en"])).toEqual(
      leafPaths(marketing["de-de"]),
    );
  });
  for (const locale of locales) {
    for (const slug of ["", ...pageSlugs]) {
      it(`publishes consistent alternate URLs for ${locale}/${slug}`, () => {
        const suffix = slug ? `/${slug}` : "";
        const metadata = pageMetadata(locale, slug);
        expect(metadata.alternates).toEqual({
          canonical: `https://zackisch.com/${locale}${suffix}`,
          languages: {
            "de-DE": `https://zackisch.com/de-de${suffix}`,
            "en-DE": `https://zackisch.com/de-en${suffix}`,
            "x-default": `https://zackisch.com/de-de${suffix}`,
          },
        });
        expect(metadata.title).toMatch(/ \| Zackisch$/);
        expect(String(metadata.title).match(/\| Zackisch/g)).toHaveLength(1);
        expect(metadata.robots).toMatchObject({ index: true });
      });
    }
  }
});
