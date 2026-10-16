import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('support: SSR knowledge base, categories, articles, breadcrumbs and private tickets noindex', async ({ app, browser }) => {
  // 1. Help center homepage (German)
  await app.open('/de-de');
  await expect(browser.locator('h1')).toContainText('Wie können wir deinem Betrieb heute helfen?');

  // Verify POS clarification callout
  await expect(browser.locator('text=Wichtiger Ablauf für deinen Kassen-Alltag (POS)')).toBeVisible();

  // 2. Category page
  await app.open('/de-de/categories/onboarding');
  await expect(browser.locator('h1')).toBeVisible();

  // 3. Article page
  await app.open('/de-de/articles/setup-checklist-15-minutes');
  await expect(browser.locator('h1')).toContainText('Einrichtungs-Checkliste');
  await expect(browser.locator('text=Voraussetzungen')).toBeVisible();
  await expect(browser.locator('text=Schritt-für-Schritt-Anleitung')).toBeVisible();
  await expect(browser.locator('text=Erfolgskontrolle')).toBeVisible();

  // 4. Tickets route must have noindex
  await app.open('/de-de/tickets');
  const robotsMeta = browser.locator('meta[name="robots"]');
  await expect(robotsMeta).toHaveAttribute('content', 'noindex, nofollow');
});
