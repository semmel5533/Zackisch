import { test, expect } from "@playwright/test";
test("uses self-hosted League Spartan without external font requests", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      family: getComputedStyle(document.body).fontFamily,
      loaded: document.fonts.check('16px "League Spartan"'),
      external: performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    };
  });
  expect(result.family).toContain("League Spartan");
  expect(result.loaded).toBe(true);
  expect(result.external).toEqual([]);
});
