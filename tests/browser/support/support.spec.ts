import { test, expect } from "../brand-fixture";
test("support portal renders knowledge base, fits 320px without overflow, and uses self-hosted Lexend", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/de-de");
  await expect(page).toHaveTitle("Hilfe & Support | Zackisch");
  await expect(
    page.getByRole("heading", {
      name: "Wie können wir deinem Betrieb heute helfen?",
    }),
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
});
test("support ticket portal requires merchant authentication when unauthenticated", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/de-de/tickets");
  await expect(
    page.getByRole("heading", { name: "Support-Tickets für Gastronomen" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Anmeldung mit Betriebskonto erforderlich",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Mit Zackisch-Konto anmelden" }),
  ).toBeVisible();
});
