import { test, expect } from "./brand-fixture";
test("language drafts cancel safely and save across reload", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sign-in");
  await expect(page).toHaveTitle(/ \| Zackisch$/);
  const trigger = page.getByRole("button", { name: "Region & Sprache" });
  await trigger.click();
  await expect(
    page.getByRole("dialog", { name: "Region & Sprache" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "Englisch" }).check();
  await page.getByRole("button", { name: "Abbrechen" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(
    page.getByRole("radio", { name: "Deutsch", exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: "Englisch" }).check();
  await page.getByRole("button", { name: "Übernehmen" }).click();
  await expect(
    page.getByRole("button", { name: "Region & Language" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Region & Language" }).click();
  await expect(page.getByRole("radio", { name: "English" })).toBeChecked();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Region & Language" }),
  ).toBeFocused();
});
test("app typography is self-hosted Lexend", async ({
  page,
  context,
}) => {
  await page.goto("/sign-in");
  await expect(page).toHaveTitle(/ \| Zackisch$/);
  const fonts = await page.evaluate(async () => {
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
  expect(fonts.family).toContain("Lexend");
  expect(fonts.loaded).toBe(true);
  expect(fonts.external).toEqual([]);
});

test("public account pages consistently place the subject before the brand", async ({ page }) => {
  for (const path of ["/sign-in", "/sign-up", "/reset-password", "/reset-password/confirm"]) {
    await page.goto(path);
    await expect(page).toHaveTitle(/ \| Zackisch$/);
    expect((await page.title()).match(/\| Zackisch/g)).toHaveLength(1);
    expect(await page.title()).not.toMatch(/^Zackisch/);
  }
});
