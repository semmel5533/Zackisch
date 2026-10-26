import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("language drafts cancel safely and save across reload", async ({
  app,
  screen,
  browser,
}) => {
  await browser.setViewport({ width: 390, height: 844 });
  await app.open("/sign-in");
  const trigger = screen.getByRole("button", "Region & Sprache");
  await trigger.tap();
  await expect(screen.getByRole("dialog", "Region & Sprache")).toBeVisible();
  await screen.getByRole("radio", "Englisch").check();
  await screen.getByRole("button", "Abbrechen").tap();
  await expect(screen.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await expect(screen.getByRole("radio", "Deutsch")).toBeChecked();
  await screen.getByRole("radio", "Englisch").check();
  await screen.getByRole("button", "Übernehmen").tap();
  await expect(screen.getByRole("button", "Region & Language")).toBeVisible();
  await browser.reload();
  await screen.getByRole("button", "Region & Language").tap();
  await expect(screen.getByRole("radio", "English")).toBeChecked();
  await browser.keyboard.press("Escape");
  await expect(screen.getByRole("dialog")).toBeHidden();
  await expect(screen.getByRole("button", "Region & Language")).toBeFocused();
});

test("app typography is self-hosted Inter", async ({ app, browser }) => {
  await app.open("/sign-in");
  const fonts = await browser.evaluate(async () => {
    await document.fonts.ready;
    return {
      family: getComputedStyle(document.body).fontFamily,
      loaded: document.fonts.check('16px "Inter"'),
      external: performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
    };
  });
  expect(fonts.family).toContain("Inter");
  expect(fonts.loaded).toBe(true);
  expect(fonts.external).toEqual([]);
});
