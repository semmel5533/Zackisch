import { test as base, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

// Exercise the production URL contract with local, not-yet-deployed brand bytes.
// This is not evidence that these assets are already available in production.
export const test = base.extend({
  page: async ({ page }, use) => {
    const root = resolve("root/public/brand");
    await page.route("https://zackisch.com/brand/**", async (route) => {
      const path = resolve(
        root,
        decodeURIComponent(
          new URL(route.request().url()).pathname.slice("/brand/".length),
        ),
      );
      if (!path.startsWith(root + sep)) return route.abort();
      const contentType =
        {
          ".svg": "image/svg+xml",
          ".png": "image/png",
          ".ttf": "font/ttf",
          ".css": "text/css",
        }[extname(path)] ?? "application/octet-stream";
      await route.fulfill({
        body: await readFile(path),
        contentType,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    });
    await use(page);
  },
});
export { expect };
