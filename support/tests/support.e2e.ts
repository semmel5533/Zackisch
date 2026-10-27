import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("support portal renders knowledge base, fits 320px without overflow, and uses self-hosted Inter", async ({
  app,
  screen,
  browser,
}) => {
  await browser.setViewport({ width: 320, height: 800 });
  await browser.emulateMedia({ reducedMotion: "reduce" });
  await app.open("/de-de");
  await expect(
    screen.getByRole("heading", "Wie können wir deinem Betrieb heute helfen?"),
  ).toBeVisible();

  const metrics = await browser.evaluate(async () => {
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
  expect(metrics.family).toContain("Inter");
  expect(metrics.externalFonts).toEqual([]);
});

test("support ticket portal requires merchant authentication when unauthenticated", async ({
  app,
  screen,
  browser,
}) => {
  await browser.setViewport({ width: 1024, height: 768 });
  await app.open("/de-de/tickets");
  await expect(
    screen.getByRole("heading", "Support-Tickets für Gastronomen"),
  ).toBeVisible();
  await expect(
    screen.getByRole("heading", "Anmeldung mit Betriebskonto erforderlich"),
  ).toBeVisible();
  await expect(
    screen.getByRole("link", "Mit Zackisch-Konto anmelden"),
  ).toBeVisible();
});
