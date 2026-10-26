import { describe, expect, it } from "vitest";
import { content, locales, pageSlugs } from "../lib/content";
import { pageMetadata } from "../lib/metadata";

function leafPaths(value: unknown, path = ""): string[] {
  if (typeof value === "string") return [path];
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, item]) => leafPaths(item, `${path}.${key}`));
}

describe("localized website", () => {
  it("has matching complete dictionary structures", () => {
    expect(leafPaths(content["de-en"])).toEqual(leafPaths(content["de-de"]));
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
        expect(metadata.robots).toMatchObject({ index: false });
      });
    }
  }
});
