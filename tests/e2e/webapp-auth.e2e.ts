import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('webapp: merchant sign-in, sign-up and security headers', async ({ app, browser }) => {
  // 1. Sign-in page
  await app.open('/sign-in');
  await expect(browser.locator('input[type="email"]')).toBeVisible();

  // 2. Sign-up page (Step 1: Restaurant / Business Name)
  await app.open('/sign-up');
  await expect(browser.locator('input[name="restaurantName"]')).toBeVisible();

  // 3. Reset password page
  await app.open('/reset-password');
  await expect(browser.locator('input[type="email"]')).toBeVisible();
});
