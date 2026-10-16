import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('internal: team portal sign-in, branding and noindex protection', async ({ app, browser }) => {
  await app.open('/sign-in');

  // Verify internal portal branding
  await expect(browser.locator('text=Zackisch Team Dashboard').first()).toBeVisible();

  // Verify email & password fields are rendered
  await expect(browser.locator('input[type="email"]')).toBeVisible();
  await expect(browser.locator('input[type="password"]')).toBeVisible();

  // Verify internal app has noindex, nofollow
  const robotsMeta = browser.locator('meta[name="robots"]');
  await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
});
