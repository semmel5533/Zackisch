import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const assets = resolve(import.meta.dirname, "../../assets/zackisch");
const read = (file: string) => readFileSync(resolve(assets, file), "utf8");
const manifest = JSON.parse(read("manifest.json")) as Array<{
  file: string;
  sha256: string;
  role: string;
}>;

describe("approved brand assets", () => {
  it.each(manifest)("preserves master bytes: $file", ({ file, sha256 }) => {
    expect(createHash("sha256").update(readFileSync(resolve(assets, file))).digest("hex")).toBe(sha256);
  });

  it("has exactly the supplied 18 mascots and 48 doodles", () => {
    expect(readdirSync(resolve(assets, "mascot")).filter((f) => f.endsWith(".svg"))).toHaveLength(18);
    expect(readdirSync(resolve(assets, "icons")).filter((f) => f.endsWith(".svg"))).toHaveLength(48);
  });

  it.each(manifest.filter(({ file }) => file.endsWith(".svg")))(
    "contains no active or externally loaded SVG content: $file", ({ file }) => {
      const svg = read(file);
      expect(svg).toMatch(/<svg\s/);
      expect(svg).toMatch(/viewBox=/);
      expect(svg).not.toMatch(/<(?:script|foreignObject|image)\b|\bon\w+\s*=|(?:href|url)\s*[=(]\s*["']?(?:https?:|\/\/|data:|javascript:)/i);
    },
  );
});

const css = read("tokens.css");
const tokens = new Map([...css.matchAll(/(--zk-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]]));
function color(token: string): string {
  const value = tokens.get(token)!;
  return value.startsWith("var(") ? color(value.slice(4, -1)) : value;
}
function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((part) => {
    const c = parseInt(part, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

describe("canonical design tokens", () => {
  it("matches every normative token in DESIGN.md", () => {
    const design = readFileSync(resolve(assets, "../../DESIGN.md"), "utf8");
    const source = design.match(/```css\n(:root \{[\s\S]*?\})\n```/)![1];
    expect(css).toContain(source);
    for (const [, reference] of css.matchAll(/var\((--zk-[\w-]+)\)/g)) expect(tokens.has(reference)).toBe(true);
  });

  it.each([
    ["--zk-text", "--zk-page"], ["--zk-text-body", "--zk-page"],
    ["--zk-text-secondary", "--zk-page"], ["--zk-link", "--zk-page"],
    ["--zk-action-fg", "--zk-action"], ["--zk-success-text", "--zk-success-bg"],
    ["--zk-warning-text", "--zk-warning-bg"], ["--zk-error-text", "--zk-error-bg"],
  ])("meets AA text contrast: %s on %s", (foreground, background) => {
    const a = luminance(color(foreground)); const b = luminance(color(background));
    expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
});
