import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: compact header and complete Citron navigation drawer`, async ({
    page,
    browserName,
  }) => {
    await page.goto(`/${locale}`);
    const de = locale === "de-de";
    for (const width of [320, 390, 768, 1249]) {
      await page.setViewportSize({ width, height: 800 });
      await expect(page.locator(".header-actions")).toBeHidden();
      await expect(page.locator(".desktop-navigation")).toBeHidden();
      await page.locator(".mobile-menu").click();
      const drawer = page.locator(".mobile-navigation");
      await expect(drawer).toBeVisible();
      await expect(drawer).toHaveCSS("background-color", "rgb(198, 255, 52)");
      await expect(drawer.locator("nav a")).toHaveCount(5);
      const navLabels = await drawer.locator("nav a").allInnerTexts();
      expect(navLabels.map((label) => label.trim())).toEqual(
        de
          ? ["Funktionen", "Kosten", "Über mich", "Fragen", "Kontakt"]
          : ["Features", "Pricing", "About me", "Questions", "Contact"],
      );
      await expect(
        drawer.getByRole("link", {
          name: de ? /Betrieb einrichten/ : /Set up your venue/,
        }),
      ).toHaveCount(0);
      const actionChildren = drawer.locator(".mobile-actions > *");
      await expect(actionChildren).toHaveCount(3);
      await expect(actionChildren.nth(0)).toHaveClass(/mobile-help/);
      await expect(actionChildren.nth(1)).toHaveClass(/region-trigger/);
      await expect(actionChildren.nth(2)).toHaveClass(/mobile-login/);
      await expect(drawer.locator(".mobile-help")).not.toHaveCSS(
        "border-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(drawer.locator(".region-trigger")).not.toHaveCSS(
        "border-color",
        "rgba(0, 0, 0, 0)",
      );
      await expect(drawer.locator(".mobile-login")).toHaveCSS(
        "background-color",
        "rgb(0, 0, 0)",
      );
      for (const item of [
        drawer.locator("nav a").first(),
        drawer.locator(".mobile-help"),
        drawer.locator(".region-trigger"),
        drawer.locator(".mobile-login"),
      ]) {
        await expect(item).toHaveCSS("font-size", "17px");
      }
      expect((await drawer.boundingBox())!.x).toBe(0);
      expect(
        await drawer.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      await drawer
        .getByRole("button", {
          name: de ? "Menü schließen" : "Close menu",
          exact: true,
        })
        .click();
      await expect(drawer).toBeHidden();
      await expect(page.locator(".mobile-menu")).toBeFocused();
    }
    await page.setViewportSize({ width: 1250, height: 900 });
    await expect(page.locator(".mobile-menu")).toBeHidden();
    await expect(page.locator(".header-actions")).toBeVisible();
    await expect(page.locator(".header-login")).toHaveCSS(
      "background-color",
      "rgb(0, 0, 0)",
    );
    await expect(page.locator(".hero-primary")).toHaveCSS(
      "background-color",
      "rgb(198, 255, 52)",
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".mobile-menu").click();
    if (browserName !== "firefox") {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
    await page.locator(".mobile-navigation .region-trigger").click();
    await expect(page.locator(".locale-dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.locator(".mobile-navigation .region-trigger"),
    ).toBeFocused();
    await page.locator(".mobile-navigation .region-trigger").click();
    await page
      .locator(".locale-dialog")
      .getByRole("link", {
        name: de ? "Germany English" : "Deutschland Deutsch",
      })
      .click();
    await expect(page).toHaveURL(new RegExp(de ? "/de-en$" : "/de-de$"));
    await expect(page.locator(".mobile-navigation")).toBeHidden();
  });
}
