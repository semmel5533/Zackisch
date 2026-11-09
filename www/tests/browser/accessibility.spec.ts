import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const locale of ["de-de", "de-en"] as const) {
  test(`${locale}: language, metadata, registration and small-screen reflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      locale === "de-de" ? "de" : "en",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/ \| Zackisch$/);
    await expect(
      page.locator('link[rel="icon"][type="image/svg+xml"]'),
    ).toHaveAttribute("href", "/brand/logo/platform/signet--favicon.svg");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://zackisch.com/${locale}`,
    );
    const signup = page
      .locator('a[href="https://app.zackisch.com/sign-up"]')
      .first();
    await expect(signup).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
  test(`${locale}: public legal navigation and image delivery`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${locale}`);
    for (const src of await page
      .locator("img")
      .evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src),
      )) {
      const response = await request.get(src);
      expect(response.ok(), src).toBe(true);
      expect(response.headers()["content-type"]).toMatch(/^image\//);
    }
    await page
      .getByRole("link", {
        name: locale === "de-de" ? "Impressum" : "Legal notice",
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/legal-notice$`));
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
test("mobile navigation supports Escape and returns focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/de-de");
  const trigger = page.getByRole("button", { name: "Menü öffnen" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});
test("FAQ keyboard interaction and no optional cookies", async ({
  page,
  context,
}) => {
  await page.goto("/de-en");
  const question = page.getByRole("button", { name: "How does it connect to my POS?" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
  expect(await context.cookies()).toEqual([]);
});
test("homepage has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/de-de");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
test("unknown page returns 404", async ({ page }) => {
  const response = await page.goto("/de-de/unknown-page");
  expect(response?.status()).toBe(404);
});

test("product placeholders and desktop motion respect user preferences", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/de-de");
  await expect(page.locator(".welcome-intro")).toContainText("Abholung am Tresen");
  await expect(page.locator(".screenshot-placeholder")).toHaveCount(4);
  await expect(page.locator(".screenshot-placeholder img")).toHaveCount(0);
  expect(
    await page
      .locator(".menu-chapter")
      .first()
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe("sticky");
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.locator(".menu-chapter").first().evaluate(el => getComputedStyle(el).position)).toBe("static");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".menu-chapter")
      .first()
      .evaluate((el) => getComputedStyle(el).position),
  ).toBe("static");
  expect(
    await page
      .locator(".welcome-main-photo")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  for (const width of [320, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
