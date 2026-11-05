import { expect, test } from "@playwright/test";
import { pageSlugs } from "../../../root/lib/content";

const viewports = [
  { width: 320, height: 800 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 844, height: 390 },
  { width: 1024, height: 768 }, { width: 1440, height: 1000 },
  { width: 1920, height: 1080 }, { width: 2560, height: 1440 },
];
for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: complete responsive viewport matrix`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Viewport matrix already covers mobile dimensions");
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".welcome-actions a").first()).toBeVisible();
      await expect(page).toHaveTitle(/ \| Zackisch$/);
      const bounds = await page.evaluate(() => ({
        fits: document.documentElement.scrollWidth <= innerWidth,
        clips: [...document.querySelectorAll("h1,h2,h3,.button")].filter(el => {
          const box = el.getBoundingClientRect();
          return box.width > 0 && (box.left < -1 || box.right > innerWidth + 1);
        }).map(el => el.textContent),
      }));
      expect(bounds, `${locale} at ${viewport.width}×${viewport.height}`).toEqual({ fits: true, clips: [] });
      if (process.env.VISUAL_OUTPUT) await page.screenshot({ path: `${process.env.VISUAL_OUTPUT}/${locale}-${viewport.width}.png`, fullPage: true });
    }
  });
  test(`${locale}: all public information routes retain titles and narrow reflow`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Same route audit once per language");
    await page.setViewportSize({ width: 320, height: 800 });
    for (const slug of pageSlugs) {
      const response = await page.goto(`/${locale}/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/ \| Zackisch$/);
      expect((await page.title()).match(/\| Zackisch/g)).toHaveLength(1);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), slug).toBe(true);
    }
    await page.goto(`/${locale}/not-a-real-page`);
    await expect(page).toHaveTitle(/ \| Zackisch$/);
  });
}
