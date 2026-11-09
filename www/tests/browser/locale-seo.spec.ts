import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("header and footer locale dialogs retain the page and use native language labels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/de-de/research");
  const triggers = page.getByRole("button", {
    name: "Region & Sprache: Deutschland",
  });
  await expect(triggers).toHaveCount(2);
  for (const trigger of [triggers.first(), triggers.last()]) {
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Region & Sprache" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(
      "Wähle die Region deines Betriebs und deine gewünschte Anzeigesprache.",
    );
    await expect(
      dialog.getByRole("button", { name: "Schließen", exact: true }),
    ).toBeFocused();
    const activeOption = dialog.getByRole("link", {
      name: "Deutschland Deutsch",
    });
    const inactiveOption = dialog.getByRole("link", {
      name: "Germany English",
    });
    await expect(activeOption).toHaveAttribute("aria-current", "page");
    await expect(inactiveOption).toHaveAttribute("href", "/de-en/research");
    const activeBg = await activeOption.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    await inactiveOption.hover();
    await expect(inactiveOption).toHaveCSS("background-color", activeBg);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
  await triggers.first().click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Schließen", exact: true })
    .click();
  await expect(triggers.first()).toBeFocused();
  await triggers.first().click();
  await page.mouse.click(2, 2);
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(triggers.first()).toBeFocused();
  await triggers.last().click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Germany English" })
    .click();
  await expect(page).toHaveURL(/\/de-en\/research$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("button", { name: "Region & language: Germany" }),
  ).toHaveCount(2);
  await page
    .getByRole("button", { name: "Region & language: Germany" })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Region & language" }),
  ).toContainText(
    "Choose your venue’s region and your preferred display language.",
  );
  await page.keyboard.press("Escape");
});

test("locale dialog passes the automated accessibility scan", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "firefox",
    "The current Firefox runner crashes during axe dialog scanning; interaction tests and homepage axe still run",
  );
  await page.goto("/de-de/research");
  await page.locator(".site-footer .region-trigger").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include('[role="dialog"]').analyze())
      .violations,
  ).toEqual([]);
});

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: search and social metadata match visible business facts`, async ({
    page,
    request,
  }) => {
    await page.goto(`/${locale}`);
    const de = locale === "de-de";
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      de ? "de" : "en",
    );
    await expect(page).toHaveTitle(
      de
        ? "Bestellen & Bezahlen mit QR-Code | Zackisch"
        : "Order & pay by QR code | Zackisch",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      de
        ? "Bestellen & Bezahlen mit QR-Code | Zackisch"
        : "Order & pay by QR code | Zackisch",
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      de ? "de_DE" : "en_DE",
    );
    await expect(
      page.locator('meta[property="og:locale:alternate"]'),
    ).toHaveAttribute("content", de ? "en_DE" : "de_DE");
    const ogDescription = await page
      .locator('meta[property="og:description"]')
      .getAttribute("content");
    expect(ogDescription).toBeTruthy();
    expect(ogDescription!.length).toBeLessThanOrEqual(120);
    const twitterDescription = await page
      .locator('meta[name="twitter:description"]')
      .getAttribute("content");
    expect(twitterDescription).toBe(ogDescription);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /https:\/\/zackisch\.com\/brand\/logo\/social\/.*1200x630\.png$/,
    );
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      "content",
      de
        ? "Zackisch: Bestellen & Bezahlen mit QR-Code"
        : "Zackisch: Order & pay by QR code",
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /index, follow/,
    );
    const data = JSON.parse(
      await page.locator('script[type="application/ld+json"]').innerText(),
    );
    const org = data["@graph"].find(
      (entry: { "@type": string }) => entry["@type"] === "Organization",
    );
    expect(org.email).toBe("selim@zackisch.com");
    expect(org).not.toHaveProperty("address");
    await expect(page.locator(".personal-contact a")).toHaveAttribute(
      "href",
      `mailto:${org.email}`,
    );
    const logoPath = new URL(org.logo).pathname;
    expect((await request.get(logoPath)).ok()).toBe(true);
    expect((await request.get("/robots.txt")).status()).toBe(200);
    expect(await (await request.get("/sitemap.xml")).text()).toContain(
      `https://zackisch.com/${locale}`,
    );
  });
}

test("photographs load and the footer ends immediately after its full-width wordmark", async ({
  page,
}) => {
  await page.goto("/de-de");
  await page.locator(".footer-mark").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".footer-mark")
        .evaluate(
          (el) =>
            (el as HTMLImageElement).complete &&
            (el as HTMLImageElement).naturalWidth > 0,
        ),
    )
    .toBe(true);
  await page
    .locator(".footer-mark")
    .evaluate(async (el) => (el as HTMLImageElement).decode());
  const bounds = await page.locator(".footer-mark").evaluate((el) => {
    const box = el.getBoundingClientRect();
    return {
      width: box.width / innerWidth,
      gap: document.documentElement.scrollHeight - (box.bottom + scrollY),
      opacity: Number(getComputedStyle(el).opacity),
    };
  });
  expect(bounds.width).toBeGreaterThan(0.89);
  expect(bounds.gap).toBeLessThanOrEqual(9);
  expect(bounds.opacity).toBeGreaterThan(0);
  expect(bounds.opacity).toBeLessThan(1);
  await expect(page.locator(".marketing img")).toHaveCount(2);
  await expect(page.locator(".site-footer .region-trigger")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.locator(".site-footer .text-button")).toHaveCSS(
    "text-decoration-line",
    "none",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".welcome-main-photo")).toBeHidden();
  await expect(page.locator(".problem-section .story-photo")).toBeHidden();
  await expect(page.locator(".footer-grid")).toHaveCSS("text-align", "center");
  await expect(page.locator(".footer-grid > div").first()).toHaveCSS(
    "align-items",
    "center",
  );
});

test("entry route selects browser locale and defaults to de-de when unsupported", async ({
  browser,
}) => {
  for (const [localeHeader, expectedPath] of [
    ["en-US", /\/de-en$/],
    ["de-DE", /\/de-de$/],
    ["fr-FR", /\/de-de$/],
  ] as const) {
    const context = await browser.newContext({ locale: localeHeader });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(expectedPath);
    await context.close();
  }
});

test("demo logo band is explicitly illustrative and motion can be paused", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/de-de");
  await expect(
    page.getByRole("heading", { name: "Hier könnte dein Betrieb auftauchen" }),
  ).toBeVisible();
  const track = page.locator(".logo-track");
  const before = await track.evaluate((el) => getComputedStyle(el).transform);
  await expect
    .poll(() => track.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before);
  await page.getByRole("button", { name: "Logo-Band pausieren" }).click();
  expect(
    await track.evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await page.getByRole("button", { name: "Logo-Band fortsetzen" }).click();
  await expect(track).toHaveAttribute("data-paused", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
  await expect(
    page.locator('.demo-logo-list[aria-hidden="true"]'),
  ).toBeHidden();
  await expect(page.getByRole("button", { name: /Logo-Band/ })).toBeHidden();
});

for (const locale of ["de-de", "de-en"]) {
  test(`${locale}: marketing terminology, seasonal pricing and manual POS are clear`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);
    const main = page.locator("main");
    await expect(main).not.toContainText("Stripe");
    await expect(
      page.locator(".welcome-main-photo figcaption, .story-photo figcaption"),
    ).toHaveCount(0);
    const styles = await page.locator(".site-header").evaluate((el) => {
      const properties = [
        "borderRadius",
        "minHeight",
        "padding",
        "fontSize",
        "lineHeight",
      ];
      return [".region-trigger", ".header-login"].map((selector) => {
        const style = getComputedStyle(el.querySelector(selector)!);
        return properties.map(
          (property) => style[property as keyof CSSStyleDeclaration],
        );
      });
    });
    expect(styles[0]).toEqual(styles[1]);
    await expect(page.locator(".questions .faq-trigger")).toHaveCount(8);
    const german = locale === "de-de";
    await expect(page.locator(".welcome-intro")).toContainText(
      german ? "Abholung am Tresen" : "counter pickup",
    );
    await page
      .getByRole("button", {
        name: german
          ? "Funktioniert Zackisch auch ohne Tische, nur mit Abholung?"
          : "Does Zackisch work for counter pickup without tables?",
      })
      .click();
    await expect(page.locator(".questions")).toContainText(
      german
        ? "Bestellnummer und den Abholstatus"
        : "order number and pickup status",
    );
    await expect(page.locator(".personal-contact")).toHaveCSS(
      "text-align",
      "left",
    );
    await expect(page.locator(".personal-contact")).toHaveCSS(
      "border-top-width",
      "0px",
    );
    await expect(page.locator(".personal-contact")).toHaveCSS(
      "border-bottom-width",
      "1px",
    );
    await page
      .getByRole("button", {
        name: german
          ? "Können meine Gäste persönlich bestellen oder bar bezahlen?"
          : "Can guests order in person or pay cash?",
      })
      .click();
    await expect(page.locator(".questions")).toContainText(
      german
        ? "Barzahlungen erfolgen im Betrieb"
        : "Cash payments are handled by the venue",
    );
    await expect(page.locator(".personal-contact h2")).toHaveText(
      german ? "Schreibe mir persönlich" : "Write to me personally",
    );
    await expect(page.locator(".personal-contact p")).toHaveCount(0);
    const email = page.locator(".personal-contact > a");
    await expect(email.locator("svg")).toHaveCount(0);
    await expect(email).toHaveCSS("text-decoration-line", "none");
    await email.hover();
    await expect(email).toHaveCSS("text-decoration-line", "underline");
    await expect(page.locator(".cost-details")).toContainText(
      german ? "Saisonpause" : "season",
    );
    const question = page.getByRole("button", {
      name: german
        ? "Wie funktioniert die Anbindung an meine Kasse?"
        : "How does it connect to my POS?",
    });
    await question.click();
    await expect(page.locator(".questions")).toContainText(
      german ? "genau einmal manuell" : "exactly once",
    );
    if (german)
      await expect(main).not.toContainText(/Speisekarte|Gerichte|Eine Karte/);
    await page.goto(`/${locale}`);
    await expect(page.locator("main")).not.toContainText("Stripe");
    await expect(page.locator("main")).toContainText(
      german ? "Saisonpause" : "season",
    );
  });
}
