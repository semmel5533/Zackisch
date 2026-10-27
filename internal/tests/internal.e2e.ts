import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("internal sign-in fits 320px, uses self-hosted Inter, and opens region/language dialog", async ({
  app,
  screen,
  browser,
}) => {
  await browser.setViewport({ width: 320, height: 800 });
  await browser.emulateMedia({ reducedMotion: "reduce" });
  await app.open("/sign-in");
  await expect(
    screen.getByRole("heading", "Zackisch Team Dashboard"),
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

  const regionBtn = screen.getByRole("button", /DE · DE/);
  await regionBtn.tap();
  await expect(
    screen.getByRole("dialog", "Region & Sprache auswählen"),
  ).toBeVisible();
  await browser.keyboard.press("Escape");
  await expect(screen.getByRole("dialog")).toBeHidden();
});
