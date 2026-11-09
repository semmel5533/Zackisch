import { test, expect } from "./brand-fixture";
test("internal sign-in fits 320px, uses self-hosted Lexend, and opens region/language dialog", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/sign-in");
  await expect(page).toHaveTitle(/ \| Zackisch$/);
  await expect(
    page.getByRole("heading", { name: "Zackisch Team Dashboard" }),
  ).toBeVisible();
  const metrics = await page.evaluate(async () => {
    await document.fonts.ready;
    return {
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      family: getComputedStyle(document.body).fontFamily,
      externalFonts: performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    };
  });
  expect(metrics.overflow).toBe(false);
  expect(metrics.family).toContain("Lexend");
  expect(metrics.externalFonts).toEqual([]);
  const regionBtn = page.getByRole("button", { name: /DE · DE/ });
  await regionBtn.click();
  await expect(
    page.getByRole("dialog", { name: "Region & Sprache auswählen" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
