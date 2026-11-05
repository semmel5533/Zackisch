import { test, expect } from "@playwright/test";
for (const [locale, lang, title] of [
  ["de-de", "de", "Guter Service. Ein Bestellweg mehr."],
  ["de-en", "en", "Good service. One more way to order."],
]) {
  test(`${locale} has localized metadata and fits small screens`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    const documentState = await page.evaluate(() => ({
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
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/de-de");
  const trigger = page.getByRole("button", { name: "Menü öffnen" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page
    .getByRole("dialog", { name: "Navigation" })
    .getByRole("link", { name: "So funktioniert’s" })
    .click();
  await expect(page.getByRole("dialog", { name: "Navigation" })).toBeHidden();
  await expect(page).toHaveURL(/#how-it-works$/);
});
test("FAQ and privacy controls work without optional cookies", async ({
  page,
  context,
}) => {
  await page.goto("/de-en");
  const question = page.getByRole("button", { name: "Do I need a new POS?" });
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByText("No. Zackisch supplements your existing POS process.", {
      exact: false,
    }),
  ).toBeVisible();
  await question.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Privacy settings" }).click();
  await expect(
    page.getByRole("dialog", { name: "Your choices on this website" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  expect(await context.cookies()).toEqual([]);
});
test("unknown routes return an actual 404", async ({ page, context }) => {
  const response = await page.request.get("/de-de/unknown-page");
  expect(response.status()).toBe(404);
  await page.goto("/de-de/unknown-page");
  await expect(
    page.getByRole("heading", { name: "Diese Seite gibt es nicht." }),
  ).toBeVisible();
});
test("marketing images load from the local host", async ({ page, context }) => {
  await page.goto("/de-de");
  const sources = await page.evaluate(() =>
    [...document.images].map((image) => image.src),
  );
  for (const source of sources) {
    expect(new URL(source).origin).toBe(new URL(page.url()).origin);
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
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await page.getByRole("link", { name: title, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Selim Eser", { exact: false })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "§ 5 DDG", exact: true }),
    ).toHaveAttribute(
      "href",
      "https://www.gesetze-im-internet.de/ddg/__5.html",
    );
    await page.getByRole("link", { name: privacy, exact: true }).click();
    await expect(page).toHaveURL(`/${locale}/privacy`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index/,
    );
    const state = await page.evaluate(() => ({
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
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await page.getByRole("link", { name: merchant, exact: true }).click();
    await expect(page).toHaveURL(`/${locale}/gtc`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", {
        name:
          locale === "de-de"
            ? "Nutzungsbedingungen für Betreiber"
            : "Merchant terms of service",
      }),
    ).toBeVisible();
    await page.getByRole("link", { name: guest, exact: true }).click();
    await expect(page).toHaveURL(`/${locale}/guest-terms`);
    await expect(
      page.getByRole("link", { name: "§ 312j BGB", exact: true }),
    ).toBeVisible();
  });
}
for (const [locale, label] of [
  ["de-de", "Plattform-Datenschutz"],
  ["de-en", "Platform privacy"],
]) {
  test(`${locale} opens platform privacy separately from website privacy`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(`/${locale}/privacy-policy`);
    await expect(
      page.getByRole("heading", {
        name:
          locale === "de-de"
            ? "Datenschutz für die Zackisch-Plattform"
            : "Privacy for the Zackisch platform",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name:
          locale === "de-de"
            ? "Support und interne Bearbeitung"
            : "Support and internal handling",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
for (const [locale, label, annex] of [
  [
    "de-de",
    "Auftragsverarbeitung",
    "Anlage B · Sicherheits- und Wiederherstellungsnachweise",
  ],
  [
    "de-en",
    "Data processing agreement",
    "Annex B · Security and recovery evidence",
  ],
]) {
  test(`${locale} makes the processing agreement and its annexes accessible`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(`/${locale}`);
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(`/${locale}/data-processing`);
    await expect(
      page.getByRole("heading", { name: annex, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "EDPB", exact: true }),
    ).toHaveAttribute(
      "href",
      "https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
