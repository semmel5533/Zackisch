import { test } from "@e2e-dev/web";
import { expect } from "e2e";

test("guest menu changes local quantities and opens the cart", async ({
  app,
  screen,
  browser,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const itemName = process.env.E2E_SIMPLE_ITEM_NAME ?? "";
  test.skip(
    !path || !itemName,
    "Configure a development venue and an available item without customizations",
  );
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
  await expect(
    row.getByRole("button", `Hinzufügen: ${itemName}`),
  ).toBeVisible();
  await expect(screen.getByRole("button", /Zum Warenkorb/)).toBeHidden();
});

test("customization requires a size, supports radio keyboard control and prices extras", async ({
  app,
  screen,
  browser,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const customItem = process.env.E2E_CUSTOM_ITEM_NAME ?? "";
  test.skip(
    !path || !customItem,
    "Configure the customization fixture with size and topping options",
  );
  await browser.setViewport({ width: 390, height: 844 });
  await browser.emulateMedia({ reducedMotion: "reduce" });
  await app.open(path);
  await screen.getByRole("button", `Hinzufügen: ${customItem}`).tap();
  const dialog = screen.getByRole("dialog", customItem);
  await dialog.getByRole("button", /^Hinzufügen ·/).tap();
  await expect(dialog.getByRole("alert")).toContainText(
    "erforderliche Auswahl",
  );
  await expect(dialog.getByRole("group", "Größe")).toBeFocused();
  const classic = dialog.getByRole("radio", "Klassisch (30cm)");
  await classic.check();
  await classic.press("ArrowDown");
  await expect(dialog.getByRole("radio", /^Familienpizza/)).toBeChecked();
  await dialog.getByRole("checkbox", /^Frische Champignons/).check();
  await expect(dialog.getByRole("button", /^Hinzufügen ·/)).toContainText(
    "15,50",
  );
  await dialog.getByRole("button", /^Hinzufügen ·/).tap();
  await expect(dialog).toBeHidden();
  await expect(screen.getByRole("button", /^1 · Zum Warenkorb/)).toContainText(
    "15,50",
  );
});

test("cart opens a stable checkout with zero optional tip and validates email before payment", async ({
  app,
  screen,
  browser,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const itemName = process.env.E2E_SIMPLE_ITEM_NAME ?? "";
  test.skip(
    !path || !itemName,
    "Configure a development venue and simple item",
  );
  await browser.setViewport({ width: 390, height: 844 });
  await app.open(path);
  await screen.getByRole("button", `Hinzufügen: ${itemName}`).tap();
  await screen.getByRole("button", /^1 · Zum Warenkorb/).tap();
  await screen
    .getByRole("dialog", "Warenkorb")
    .getByRole("button", /^Weiter zur Zahlung/)
    .tap();
  await expect(browser).toHaveURL(`${path}/checkout`);
  await expect(
    screen.getByRole("heading", "Zur Kasse", { exact: true }),
  ).toBeVisible();
  await expect(screen.getByRole("radio", "Kein")).toBeChecked();
  await screen.getByRole("radio", "10 %", { exact: true }).check();
  await expect(screen.getByText("9,35", { exact: false })).toBeVisible();
  await screen.getByRole("checkbox").check();
  await screen.getByRole("button", "Zahlungspflichtig weiter").tap();
  await expect(
    screen.getByRole("alert").filter({ hasText: "gültige E-Mail-Adresse" }),
  ).toBeVisible();
  await screen.getByRole("link", "Zurück zum Menü").tap();
  await expect(browser).toHaveURL(path);
  await expect(screen.getByRole("button", /^1 · Zum Warenkorb/)).toBeVisible();
});

test("direct checkout handles an empty cart and repeated table query safely", async ({
  app,
  screen,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  test.skip(!path, "Configure a development venue");
  await app.open(`${path}/checkout?table=12&table=13`);
  await expect(
    screen.getByRole("heading", "Zur Kasse", { exact: true }),
  ).toBeVisible();
  await expect(
    screen.getByText("Dein Warenkorb ist leer", { exact: false }),
  ).toBeVisible();
  await expect(
    screen.getByRole("button", "Zahlungspflichtig weiter"),
  ).toBeHidden();
});
