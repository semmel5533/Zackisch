import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("guest menu changes local quantities and opens the cart", async ({ app, screen, browser }) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const itemName = process.env.E2E_SIMPLE_ITEM_NAME ?? "";
  test.skip(!path || !itemName, "Configure a development venue and an available item without customizations");
  await browser.setViewport({ width: 390, height: 844 });
  await app.open(path);
  const row = screen.getByRole("article").filter({ hasText: itemName }).first();
  await row.getByRole("button", `Hinzufügen: ${itemName}`).tap();
  await row.getByRole("button", `Menge erhöhen: ${itemName}`).tap();
  await expect(row.getByText("2")).toBeVisible();
  await screen.getByRole("button", /^2 · Zum Warenkorb/).tap();
  await expect(screen.getByRole("dialog", "Warenkorb")).toBeVisible();
  await browser.keyboard.press("Escape");
  await expect(screen.getByRole("dialog", "Warenkorb")).toBeHidden();
  await row.getByRole("button", `Menge verringern: ${itemName}`).tap();
  await row.getByRole("button", `Menge verringern: ${itemName}`).tap();
  await expect(row.getByRole("button", `Hinzufügen: ${itemName}`)).toBeVisible();
  await expect(screen.getByRole("button", /Zum Warenkorb/)).toBeHidden();
});
