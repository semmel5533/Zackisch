import { expect, test } from "@playwright/test";

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: section cues, page arrows and external tabs are consistent`, async ({
    page,
    context,
  }) => {
    await context.route(
      (url) => url.hostname !== "127.0.0.1" && url.hostname !== "localhost",
      (route) =>
        route.fulfill({
          contentType: "text/html",
          body: "<title>External destination</title>",
        }),
    );
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    const helpPill = page.locator(".header-help");
    await expect(helpPill).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await helpPill.hover();
    await expect(helpPill).not.toHaveCSS(
      "background-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(helpPill).toHaveCSS("text-decoration-line", "none");
    const section = page.locator(`.site-footer a[href="/${locale}#questions"]`);
    await expect(section.locator("svg")).toHaveCount(0);
    await section.hover();
    await expect(section).toHaveCSS("text-decoration-line", "underline");
    await section.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    await expect(page.locator("#questions h2")).toBeFocused();
    const signup = page.locator(".welcome-actions .button-primary");
    await expect(signup).toHaveCSS("font-size", "19px");
    await expect(signup).toHaveAccessibleDescription(
      locale === "de-de" ? "Öffnet in einem neuen Tab" : "Opens in a new tab",
    );
    for (const link of [
      signup,
      page.locator(".header-login"),
      page.locator(
        `.site-footer a[href="https://support.zackisch.com/${locale}"]`,
      ),
    ]) {
      await expect(link.locator(".navigation-arrow")).toHaveCount(1);
      await link.hover();
      await expect(link).toHaveCSS("text-decoration-line", "none");
      const href = await link.getAttribute("href");
      const popupPromise = context.waitForEvent("page");
      await link.click();
      const popup = await popupPromise;
      await popup.waitForLoadState();
      expect(popup.url()).toBe(href);
      expect(await popup.evaluate(() => window.opener === null)).toBe(true);
      await popup.close();
      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    }
    const legal = page.locator(
      `.site-footer a[href="/${locale}/legal-notice"]`,
    );
    await legal.hover();
    await expect(legal).toHaveCSS("text-decoration-line", "none");
    await expect(legal.locator(".navigation-arrow")).toHaveCount(1);
    await expect(legal).not.toHaveAttribute("target", "_blank");
    await legal.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/legal-notice$`));
    expect(context.pages()).toHaveLength(1);
    for (const source of await page.locator(".article a").all()) {
      await expect(source).toHaveAttribute("target", "_blank");
      await expect(source.locator(".navigation-arrow")).toHaveCount(1);
    }
  });
}

test("region pills share sizing and header ghost differs from footer outlines", async ({
  page,
}) => {
  await page.goto("/de-de");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const header = page.locator("header .region-trigger");
    const footer = page.locator("footer .region-trigger");
    const footerResearch = page.locator(".footer-research");
    for (const control of [
      ...(width >= 1250 ? [header] : []),
      footer,
      page.locator(".footer-help"),
      footerResearch,
    ]) {
      await expect(control).toHaveCSS("height", "48px");
      await expect(control).toHaveCSS("font-size", "17px");
      await expect(control).toHaveCSS("align-items", "center");
      await expect(control.locator("svg")).toHaveCSS("translate", "none");
      const centers = await control.evaluate((el) => {
        const label = el.querySelector("span")!;
        const icon = el.querySelector("svg")!;
        const lBox = label.getBoundingClientRect();
        const iBox = icon.getBoundingClientRect();
        return Math.abs(
          (lBox.top + lBox.bottom) / 2 - (iBox.top + iBox.bottom) / 2,
        );
      });
      expect(centers).toBeLessThanOrEqual(0.5);
    }
    await expect(header).toHaveCSS("border-color", "rgba(0, 0, 0, 0)");
    await expect(footer).not.toHaveCSS("border-color", "rgba(0, 0, 0, 0)");
    await expect(page.locator(".footer-help")).not.toHaveCSS(
      "border-color",
      "rgba(0, 0, 0, 0)",
    );
    await expect(footerResearch).not.toHaveCSS(
      "border-color",
      "rgba(0, 0, 0, 0)",
    );
  }
});
