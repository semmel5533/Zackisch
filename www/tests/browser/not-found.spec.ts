import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pageSlugs } from "../../lib/content";

for (const [path, language] of [
  ["/de-de/asd", "de"],
  ["/de-en/sdf", "en"],
  ["/efsf", "de"],
]) {
  test(`${path}: branded localized 404 and language recovery`, async ({
    page,
  }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page).toHaveTitle(
      language === "en"
        ? "Page not found | Zackisch"
        : "Seite nicht gefunden | Zackisch",
    );
    await expect(page.locator("h1")).toHaveText(
      language === "en"
        ? "This page doesn’t exist"
        : "Diese Seite gibt es nicht",
    );
    await expect(page.locator(".not-found-code")).toHaveCount(0);
    await expect(page.locator(".not-found")).toHaveCSS("text-align", "center");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.locator(".site-header .region-trigger").click();
    const other = page.getByRole("dialog").getByRole("link", {
      name: language === "en" ? "Deutschland Deutsch" : "Germany English",
    });
    await expect(other).toHaveAttribute(
      "href",
      language === "en" ? "/de-de" : "/de-en",
    );
    await other.click();
    await expect(page).toHaveURL(
      new RegExp(language === "en" ? "/de-de$" : "/de-en$"),
    );
    await expect(page.locator(".welcome")).toBeVisible();
  });
}

test("language switches preserve every existing public page", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "Routes are independent of viewport",
  );
  for (const slug of ["", ...pageSlugs]) {
    const suffix = slug ? `/${slug}` : "";
    await page.goto(`/de-de${suffix}`);
    await page.locator(".site-header .region-trigger").click();
    await page.getByRole("link", { name: "Germany English" }).click();
    await expect(page).toHaveURL(new RegExp(`/de-en${suffix}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await page.locator(".site-footer .region-trigger").click();
    await page.getByRole("link", { name: "Deutschland Deutsch" }).click();
    await expect(page).toHaveURL(new RegExp(`/de-de${suffix}$`));
  }
});

test("404 accessibility and removed routes remain honest", async ({ page }) => {
  for (const path of [
    "/de-de/pricing",
    "/de-en/pricing",
    "/de-de/contact",
    "/de-en/contact",
  ]) {
    expect((await page.goto(path))?.status()).toBe(404);
  }
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  const sitemap = await (await page.request.get("/sitemap.xml")).text();
  expect(sitemap).not.toMatch(/\/(pricing|contact)</);
});
