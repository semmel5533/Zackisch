import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("uses self-hosted Inter without external font requests", async ({ app, browser }) => {
  await app.open("/");
  const result = await browser.evaluate(async () => {
    await document.fonts.ready;
    return {
      family: getComputedStyle(document.body).fontFamily,
      loaded: document.fonts.check('16px "Inter"'),
      external: performance.getEntriesByType("resource").map((r) => r.name)
        .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    };
  });
  expect(result.family).toContain("Inter");
  expect(result.loaded).toBe(true);
  expect(result.external).toEqual([]);
});
