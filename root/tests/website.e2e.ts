import { test } from "@e2e-dev/web";
import { expect } from "e2e";

for (const [locale, lang, title] of [
  ["de-de", "de", "Guter Service. Ein Bestellweg mehr."],
  ["de-en", "en", "Good service. One more way to order."],
]) {
  test(`${locale} has localized metadata and fits small screens`, async ({
    app,
    browser,
    screen,
  }) => {
    await browser.setViewport({ width: 320, height: 800 });
    await browser.emulateMedia({ reducedMotion: "reduce" });
    await app.open(`/${locale}`);
    await expect(screen.getByRole("heading", title)).toBeVisible();
    const documentState = await browser.evaluate(() => ({
      lang: document.documentElement.lang,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      canonical:
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ??
        null,
      headings: document.querySelectorAll("h1").length,
      images: [...document.images].filter((image) => !image.hasAttribute("alt"))
        .length,
    }));
    expect(documentState).toEqual({
      lang,
      overflow: false,
      canonical: `https://zackisch.com/${locale}`,
      headings: 1,
      images: 0,
    });
  });
}

test("mobile menu closes after anchor selection and returns focus on Escape", async ({
  app,
  browser,
  screen,
}) => {
  await browser.setViewport({ width: 390, height: 844 });
  await app.open("/de-de");
  const trigger = screen.getByRole("button", "Menü öffnen");
  await trigger.tap();
  await expect(screen.getByRole("dialog", "Navigation")).toBeVisible();
  await browser.keyboard.press("Escape");
  await expect(screen.getByRole("dialog", "Navigation")).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.tap();
  await screen
    .getByRole("dialog", "Navigation")
    .getByRole("link", "So funktioniert’s")
    .tap();
  await expect(screen.getByRole("dialog", "Navigation")).toBeHidden();
  await expect(browser).toHaveURL(/#how-it-works$/);
});

test("FAQ and privacy controls work without optional cookies", async ({
  app,
  browser,
  screen,
}) => {
  await app.open("/de-en");
  const question = screen.getByRole("button", "Do I need a new POS?");
  await question.tap();
  await expect(question).toBeExpanded();
  await expect(
    screen.getByText("No. Zackisch supplements your existing POS process.", {
      exact: false,
    }),
  ).toBeVisible();
  await question.press("Enter");
  await expect(question).not.toBeExpanded();
  await screen.getByRole("button", "Privacy settings").tap();
  await expect(
    screen.getByRole("dialog", "Your choices on this website"),
  ).toBeVisible();
  await screen.getByRole("button", "Close").tap();
  await expect(screen.getByRole("dialog")).toBeHidden();
  expect(await browser.cookies()).toEqual([]);
});

test("unknown routes return an actual 404", async ({ app, screen }) => {
  const response = await fetch("http://localhost:3000/de-de/unknown-page");
  expect(response.status).toBe(404);
  await app.open("/de-de/unknown-page");
  await expect(
    screen.getByRole("heading", "Diese Seite gibt es nicht."),
  ).toBeVisible();
});

test("marketing images load from the local host", async ({ app, browser }) => {
  await app.open("/de-de");
  const sources = await browser.evaluate(() =>
    [...document.images].map((image) => image.src),
  );
  for (const source of sources) {
    expect(new URL(source).origin).toBe("http://localhost:3000");
    const response = await fetch(source);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toMatch(/^image\//);
  }
});

for (const [locale, title, privacy] of [
  ["de-de", "Impressum", "Datenschutz"],
  ["de-en", "Legal notice", "Privacy"],
]) {
  test(`${locale} exposes editable legal pages through normal footer navigation`, async ({
    app,
    browser,
    screen,
  }) => {
    await browser.setViewport({ width: 320, height: 800 });
    await app.open(`/${locale}`);
    await screen.getByRole("link", title, { exact: true }).tap();
    await expect(
      screen.getByRole("heading", title, { exact: true }),
    ).toBeVisible();
    await expect(
      screen.getByText("Max Mustermann", { exact: false }),
    ).toBeVisible();
    await expect(
      screen.getByRole("link", "§ 5 DDG", { exact: true }),
    ).toHaveAttribute(
      "href",
      "https://www.gesetze-im-internet.de/ddg/__5.html",
    );
    await screen.getByRole("link", privacy, { exact: true }).tap();
    await expect(browser).toHaveURL(`/${locale}/privacy`);
    const state = await browser.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      robots:
        document
          .querySelector('meta[name="robots"]')
          ?.getAttribute("content") ?? null,
    }));
    expect(state.overflow).toBe(false);
    expect(state.robots).not.toContain("noindex");
  });
}

for (const [locale, merchant, guest] of [
  ["de-de", "Betreibervertrag", "Gastbestellung"],
  ["de-en", "Merchant agreement", "Guest ordering"],
]) {
  test(`${locale} distinguishes merchant agreement and guest information`, async ({
    app,
    screen,
    browser,
  }) => {
    await browser.setViewport({ width: 320, height: 800 });
    await app.open(`/${locale}`);
    await screen.getByRole("link", merchant, { exact: true }).tap();
    await expect(browser).toHaveURL(`/${locale}/gtc`);
    expect(
      await browser.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      screen.getByRole(
        "heading",
        locale === "de-de"
          ? "Nutzungsbedingungen für Betreiber"
          : "Merchant terms of service",
      ),
    ).toBeVisible();
    await screen.getByRole("link", guest, { exact: true }).tap();
    await expect(browser).toHaveURL(`/${locale}/guest-terms`);
    await expect(
      screen.getByRole("link", "§ 312j BGB", { exact: true }),
    ).toBeVisible();
  });
}
