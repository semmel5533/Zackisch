import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function alignedTarget(page: Page, selector: string, width: number) {
  const target = page.locator(selector);
  await expect(target).toBeFocused();
  await expect
    .poll(async () =>
      Math.abs((await target.boundingBox())!.y - (width < 800 ? 24 : 40)),
    )
    .toBeLessThanOrEqual(2);
  expect(new URL(page.url()).hash).toBe("");
}

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: section targets, footer and FAQ alignment across sizes`, async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== "desktop",
      "This matrix includes mobile widths",
    );
    const de = locale === "de-de";
    for (const width of [
      320, 390, 600, 768, 800, 844, 900, 1024, 1440, 1920, 2560,
    ]) {
      await page.setViewportSize({ width, height: width === 844 ? 390 : 900 });
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      const original = page.url();
      await page.locator('.welcome-actions a[href="#problem"]').click();
      await alignedTarget(page, "#problem h2", width);
      await expect(page).toHaveURL(original);
      await page
        .locator(`.site-footer a[href="/${locale}#how-it-works"]`)
        .click();
      await alignedTarget(page, ".chapter-introduction h2", width);
      await page.locator(`.site-footer a[href="/${locale}#contact"]`).click();
      await alignedTarget(page, "#contact h2", width);
      await page.locator(`.site-footer a[href="/${locale}#costs"]`).click();
      await alignedTarget(page, "#costs h2", width);
      const help = page
        .locator(".site-footer")
        .getByRole("link", { name: de ? "Hilfe" : "Help", exact: true });
      await expect(help).toHaveAttribute(
        "href",
        `https://support.zackisch.com/${locale}`,
      );
      await expect(page.locator(".footer-grid > div")).toHaveCount(2);
      if (width < 1250) {
        await page
          .getByRole("button", { name: de ? "Menü öffnen" : "Open menu" })
          .click();
        await page
          .getByRole("dialog")
          .getByRole("link", { name: de ? "Fragen" : "Questions" })
          .click();
        await expect(page.getByRole("dialog")).toBeHidden();
      } else {
        await page
          .locator(".desktop-navigation")
          .getByRole("link", { name: de ? "Fragen" : "Questions" })
          .click();
      }
      await alignedTarget(page, "#questions h2", width);
      const columns = await page.evaluate(() => ({
        setup: document
          .querySelector(".start-section > div")!
          .getBoundingClientRect().left,
        faq: document.querySelector(".faq-list")!.getBoundingClientRect().left,
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      expect(Math.abs(columns.setup - columns.faq)).toBeLessThanOrEqual(1);
      expect(columns.overflow).toBe(false);
    }
  });

  test(`${locale}: cross-page contact navigation keeps clean URLs and history`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${locale}/research`);
    await page.locator(`.site-footer a[href="/${locale}#contact"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await alignedTarget(page, "#contact h2", page.viewportSize()!.width);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`/${locale}/research$`));
    expect((await request.get(`/${locale}/contact`)).status()).toBe(404);
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
      `/${locale}/contact`,
    );
  });
}

test("smooth motion is progressive and reduced motion jumps directly; skip link is keyboard usable", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/de-de");
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.welcome-actions a[href="#problem"]').click();
  const early = await page.evaluate(() => scrollY);
  await alignedTarget(page, "#problem h2", 1440);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(early);
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Test skip navigation from a fresh document.
  await page.goto("about:blank");
  await page.goto("/de-de");
  // macOS WebKit includes links in keyboard navigation with Option-Tab.
  await page.keyboard.press(
    browserName === "webkit" && process.platform === "darwin"
      ? "Alt+Tab"
      : "Tab",
  );
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  expect(new URL(page.url()).hash).toBe("");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: enlarged text reflows and translations remain complete`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const frame of await page.locator(".screenshot-placeholder").all()) {
      expect(
        await frame.evaluate((e) => e.scrollHeight <= e.clientHeight + 1),
      ).toBe(true);
    }
    await expect(
      page.locator(".footer-grid > div").first().locator("a"),
    ).toHaveText(
      locale === "de-de"
        ? [
            "Hilfe",
            "Forschung & Quellen",
            "Funktionen",
            "Kosten",
            "Fragen",
            "Kontakt",
          ]
        : [
            "Help",
            "Research & sources",
            "Features",
            "Pricing",
            "Questions",
            "Contact",
          ],
    );
    await expect(page.locator(".chapter-introduction h2")).toHaveText(
      locale === "de-de"
        ? "Ein digitales Menü. Mehr Optionen"
        : "One digital menu. More options",
    );
    await expect(page.locator(".demo-heading h2")).toHaveText(
      locale === "de-de"
        ? "Hier könnte dein Lokal auftauchen"
        : "Your venue could be here",
    );
    await expect(page.locator(".demo-logo-list").first()).toContainText(
      locale === "de-de" ? "Dein Café" : "Your café",
    );
  });
}
