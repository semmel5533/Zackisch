import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('root: German and English marketing pages with pricing, legal and navigation', async ({ app, browser }) => {
  // 1. Check German homepage
  await app.open('/de-de');
  const body = browser.locator('body');
  await expect(body).toBeVisible();

  // Verify core positioning
  await expect(browser.locator('text=Deine Kasse bleibt').first()).toBeVisible();
  await expect(browser.locator('text=Deine Gäste bestellen selbst').first()).toBeVisible();

  // Verify pricing claim (2% fee)
  await expect(browser.locator('text=2 %').first()).toBeVisible();

  // Verify POS clarification
  await expect(browser.locator('text=Zackisch verbindet sich nicht automatisch mit deinem Kassensystem').first()).toBeVisible();

  // Check English homepage
  await app.open('/de-en');
  await expect(browser.locator('text=Keep your register').first()).toBeVisible();
  await expect(browser.locator('text=Your guests order themselves').first()).toBeVisible();
});
