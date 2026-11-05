import { test, expect } from "../brand-fixture";
test("guest menu changes local quantities and opens the cart", async ({
  page,
  context,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const itemName = process.env.E2E_SIMPLE_ITEM_NAME ?? "";
  test.skip(
    !path || !itemName,
    "Configure a development venue and an available item without customizations",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path);
  const row = page.getByRole("article").filter({ hasText: itemName }).first();
  await row.getByRole("button", { name: `Hinzufügen: ${itemName}` }).click();
  await row.getByRole("button", { name: `Menge erhöhen: ${itemName}` }).click();
  await expect(row.getByText("2")).toBeVisible();
  await page.getByRole("button", { name: /^2 · Zum Warenkorb/ }).click();
  await expect(page.getByRole("dialog", { name: "Warenkorb" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Warenkorb" })).toBeHidden();
  await row
    .getByRole("button", { name: `Menge verringern: ${itemName}` })
    .click();
  await row
    .getByRole("button", { name: `Menge verringern: ${itemName}` })
    .click();
  await expect(
    row.getByRole("button", { name: `Hinzufügen: ${itemName}` }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Zum Warenkorb/ }),
  ).toBeHidden();
});
test("customization requires a size, supports radio keyboard control and prices extras", async ({
  page,
  context,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const customItem = process.env.E2E_CUSTOM_ITEM_NAME ?? "";
  test.skip(
    !path || !customItem,
    "Configure the customization fixture with size and topping options",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(path);
  await page.getByRole("button", { name: `Hinzufügen: ${customItem}` }).click();
  const dialog = page.getByRole("dialog", { name: customItem });
  await dialog.getByRole("button", { name: /^Hinzufügen ·/ }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "erforderliche Auswahl",
  );
  await expect(dialog.getByRole("group", { name: "Größe" })).toBeFocused();
  const classic = dialog.getByRole("radio", { name: "Klassisch (30cm)" });
  await classic.check();
  await classic.press("ArrowDown");
  await expect(
    dialog.getByRole("radio", { name: /^Familienpizza/ }),
  ).toBeChecked();
  await dialog.getByRole("checkbox", { name: /^Frische Champignons/ }).check();
  await expect(
    dialog.getByRole("button", { name: /^Hinzufügen ·/ }),
  ).toContainText("15,50");
  await dialog.getByRole("button", { name: /^Hinzufügen ·/ }).click();
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole("button", { name: /^1 · Zum Warenkorb/ }),
  ).toContainText("15,50");
});
test("cart opens a stable checkout with zero optional tip and validates email before payment", async ({
  page,
  context,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  const itemName = process.env.E2E_SIMPLE_ITEM_NAME ?? "";
  test.skip(
    !path || !itemName,
    "Configure a development venue and simple item",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(path);
  await page.getByRole("button", { name: `Hinzufügen: ${itemName}` }).click();
  await page.getByRole("button", { name: /^1 · Zum Warenkorb/ }).click();
  await page
    .getByRole("dialog", { name: "Warenkorb" })
    .getByRole("button", { name: /^Weiter zur Zahlung/ })
    .click();
  await expect(page).toHaveURL(`${path}/checkout`);
  await expect(
    page.getByRole("heading", { name: "Zur Kasse", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("radio", { name: "Kein" })).toBeChecked();
  await page.getByRole("radio", { name: "10 %", exact: true }).check();
  await expect(page.getByText("9,35", { exact: false })).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Zahlungspflichtig weiter" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "gültige E-Mail-Adresse" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Zurück zum Menü" }).click();
  await expect(page).toHaveURL(path);
  await expect(
    page.getByRole("button", { name: /^1 · Zum Warenkorb/ }),
  ).toBeVisible();
});
test("direct checkout handles an empty cart and repeated table query safely", async ({
  page,
  context,
}) => {
  const path = process.env.E2E_GUEST_PATH ?? "";
  test.skip(!path, "Configure a development venue");
  await page.goto(`${path}/checkout?table=12&table=13`);
  await expect(
    page.getByRole("heading", { name: "Zur Kasse", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Dein Warenkorb ist leer", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Zahlungspflichtig weiter" }),
  ).toBeHidden();
});
