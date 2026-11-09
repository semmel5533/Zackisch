import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
const assets = resolve(import.meta.dirname, "../public/brand");
const manifest = JSON.parse(readFileSync(resolve(assets, "logo/manifest.json"), "utf8")) as { assets: {file: string; sha256: string}[] };
describe("founder-supplied brand exports", () => {
  it.each(manifest.assets)("preserves original bytes: $file", ({file, sha256}) => {
    expect(createHash("sha256").update(readFileSync(resolve(assets, "logo", file))).digest("hex")).toBe(sha256);
  });
  it.each(manifest.assets.filter(x => x.file.endsWith(".svg")))("has no active SVG content: $file", ({file}) => {
    const svg = readFileSync(resolve(assets, "logo", file), "utf8");
    expect(svg).not.toMatch(/<(?:script|foreignObject|image)\b|\bon\w+\s*=|(?:href|url)\s*[=(]\s*["']?(?:https?:|\/\/|data:|javascript:)/i);
  });
  it("uses a valid font-family and central cross-origin font source", () => {
    const css = readFileSync(resolve(assets,"tokens/tokens.css"),"utf8");
    expect(css).toContain('--zk-typography-font-family-base: "Lexend", Arial, sans-serif;');
    expect(readFileSync(resolve(assets,"fonts/fonts.css"),"utf8")).toContain('https://zackisch.com/brand/fonts/');
  });
});
