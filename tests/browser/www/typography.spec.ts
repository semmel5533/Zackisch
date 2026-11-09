import { test, expect } from "@playwright/test";
test("uses self-hosted Lexend without external font requests", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      family: getComputedStyle(document.body).fontFamily,
      loaded: document.fonts.check('16px "Lexend"'),
      external: performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    };
  });
  expect(result.family).toContain("Lexend");
  expect(result.loaded).toBe(true);
  expect(result.external).toEqual([]);
});
