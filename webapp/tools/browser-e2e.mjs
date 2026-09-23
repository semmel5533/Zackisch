import puppeteer from "puppeteer-core";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const chrome =
  process.env.CHROME_BIN ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const output = process.env.E2E_OUTPUT || "/tmp/zakkig-browser-e2e";
const fixture = process.env.E2E_FIXTURE_URL || "http://127.0.0.1:4174";
const website = process.env.E2E_WEBSITE_URL || "http://localhost:3000";
const webapp = process.env.E2E_WEBAPP_URL || "http://localhost:3001";
const quick = process.argv.includes("--quick");
const widths = quick
  ? [390, 768, 1440]
  : [320, 390, 500, 768, 844, 1024, 1110, 1440, 1920];
const surfaces = [
  ["website", `${website}/de-de`],
  ["website-en", `${website}/de-en`],
  ["sign-in", `${webapp}/sign-in`],
  ["guest", `${fixture}/?scenario=empty-cart`],
  ["cart", `${fixture}/?screen=cart`],
  ["kitchen", `${fixture}/?screen=kitchen`],
  ...[
    "overview",
    "archive",
    "menu",
    "settings",
    "availability",
    "tracker-ready",
    "tracker-completed",
  ].map((name) => [name, `${fixture}/browser-test.html?screen=${name}`]),
];

await mkdir(output, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox"],
});
const results = [];
const record = (name, ok, details = "") => results.push({ name, ok, details });

async function visit(url, width = 390, height = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 30000,
  });
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => document.body.innerText.length > 20, {
      timeout: 10000,
    })
    .catch(() => undefined);
  return { page, status: response?.status(), errors };
}

async function clickText(page, text, exact = false) {
  return page.evaluate(
    (label, exactMatch) => {
      const button = [...document.querySelectorAll("button")].find((node) => {
        const value =
          `${node.getAttribute("aria-label") || ""} ${node.textContent || ""}`.trim();
        return exactMatch ? value === label : value.includes(label);
      });
      if (!button) return false;
      button.click();
      return true;
    },
    text,
    exact,
  );
}

try {
  for (const width of widths) {
    for (const [name, url] of surfaces) {
      const { page, status, errors } = await visit(url, width);
      const metrics = await page.evaluate(() => {
        const clipped = [];
        const offscreen = [];
        for (const el of document.querySelectorAll(
          'button,a,input,select,textarea,[role="button"]',
        )) {
          const box = el.getBoundingClientRect();
          if (!box.width || !box.height) continue;
          const label = (el.getAttribute("aria-label") || el.textContent || "")
            .trim()
            .slice(0, 45);
          if (
            label.length > 2 &&
            !el.classList.contains("sr-only") &&
            el.scrollWidth > el.clientWidth + 3
          )
            clipped.push(label);
          if (box.right < -1 || box.left > innerWidth + 1) {
            let parent = el.parentElement;
            let inCarousel = false;
            while (parent && parent !== document.body) {
              const overflow = getComputedStyle(parent).overflowX;
              if (
                (overflow === "auto" || overflow === "scroll") &&
                parent.scrollWidth > parent.clientWidth
              ) {
                inCarousel = true;
                break;
              }
              parent = parent.parentElement;
            }
            if (!inCarousel) offscreen.push(label);
          }
        }
        return {
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          textLength: document.body.innerText.length,
          clipped: clipped.slice(0, 8),
          offscreen: offscreen.slice(0, 8),
        };
      });
      const ok =
        (status === 200 || status === 304) &&
        errors.length === 0 &&
        metrics.textLength > 20 &&
        metrics.scrollWidth <= width + 1 &&
        !metrics.clipped.length &&
        !metrics.offscreen.length;
      record(
        `render ${name} ${width}`,
        ok,
        JSON.stringify({ status, ...metrics, errors }),
      );
      if (
        !ok ||
        (width === 390 &&
          ["guest", "cart", "kitchen", "menu", "settings"].includes(name))
      ) {
        await page.screenshot({
          path: join(output, `${name}-${width}.png`),
          fullPage: false,
        });
      }
      await page.close();
    }
  }

  for (const [name, url] of [
    ["cart", `${fixture}/?screen=cart`],
    ["checkout", `${fixture}/?screen=checkout`],
    ["menu", `${fixture}/browser-test.html?screen=menu`],
  ]) {
    const { page, errors } = await visit(url, 844, 390);
    const action = await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")]
        .filter((el) => el.getBoundingClientRect().width > 0)
        .at(-1);
      if (!button) return null;
      const box = button.getBoundingClientRect();
      return {
        label: (button.textContent || "").trim(),
        top: box.top,
        bottom: box.bottom,
        viewportHeight: innerHeight,
      };
    });
    record(
      `landscape ${name} action reachable`,
      !errors.length && !!action && action.bottom <= 390,
      JSON.stringify({ action, errors }),
    );
    await page.screenshot({ path: join(output, `${name}-844x390.png`) });
    await page.close();
  }

  {
    const { page } = await visit(`${website}/de-de`);
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    const respects = await page.evaluate(() => {
      const node =
        document.querySelector("main h1") || document.querySelector("h1");
      if (!node) return false;
      const style = getComputedStyle(node);
      return (
        style.animationDuration === "0s" ||
        style.animationDuration === "0.01ms" ||
        style.animationDuration === "1e-05s" ||
        style.animationName === "none"
      );
    });
    record("website reduced motion heading", respects);
    await page.close();
  }

  {
    const { page } = await visit(`${fixture}/?scenario=empty-cart`);
    const before = await page.evaluate(() =>
      document.body.innerText.includes("Zum Warenkorb"),
    );
    await clickText(page, "Hinzufügen");
    const after = await page.evaluate(() =>
      document.body.innerText.includes("Zum Warenkorb"),
    );
    record(
      "empty cart hides banner and add reveals it",
      !before && after,
      JSON.stringify({ before, after }),
    );
    await clickText(page, "Zum Warenkorb");
    record(
      "cart navigation",
      await page.evaluate(
        () =>
          !![...document.querySelectorAll("h1")].find((x) =>
            x.textContent?.includes("Warenkorb"),
          ),
      ),
    );
    const qtyButtons = await page.evaluate(() =>
      [...document.querySelectorAll("button")]
        .filter(
          (b) =>
            /^(Menge erhöhen|Menge verringern|Entfernen:)/.test(
              b.getAttribute("aria-label") || "",
            ),
        )
        .map((b) => ({
          text: b.textContent?.trim(),
          label: b.getAttribute("aria-label"),
          title: b.getAttribute("title"),
        })),
    );
    record(
      "cart quantity controls have accessible labels",
      qtyButtons.length >= 2 && qtyButtons.every((b) => !!b.label),
      JSON.stringify(qtyButtons),
    );
    await page.close();
  }

  {
    const { page } = await visit(`${fixture}/?scenario=modifiers`);
    const opened = await clickText(page, "Hinzufügenab");
    await new Promise((resolve) => setTimeout(resolve, 200));
    const dialog = await page.$('[role="dialog"]');
    record("required modifiers open actual dialog", opened && !!dialog);
    await page.evaluate(() =>
      [...document.querySelectorAll('[role="dialog"] button')]
        .find((x) => x.textContent?.includes("Hinzufügen"))
        ?.click(),
    );
    const stayed = await page.evaluate(
      () => !!document.querySelector('[role="dialog"]'),
    );
    record("required modifiers prevent empty selection", stayed);
    for (const text of ["Sauerteig", "Oliven", "Knoblauch", "Hinzufügen"]) {
      await page.evaluate(
        (label) =>
          [...document.querySelectorAll('[role="dialog"] button')]
            .find((x) => x.textContent?.includes(label))
            ?.click(),
        text,
      );
    }
    const added = await page.evaluate(
      () =>
        document.body.innerText.includes("Zum Warenkorb") &&
        !document.querySelector('[role="dialog"]'),
    );
    record("single and multi selection adds to cart", added);
    await page.close();
  }

  {
    const { page } = await visit(`${fixture}/?screen=kitchen`);
    const hasOrder = await page.evaluate(() =>
      document.body.innerText.includes("001"),
    );
    await clickText(page, "Bereitstellen");
    await new Promise((resolve) => setTimeout(resolve, 250));
    const state = await page.evaluate(() =>
      document.body.innerText.slice(0, 450),
    );
    record("kitchen displays seeded order", hasOrder);
    record(
      "kitchen rejected mock action preserves order",
      state.includes("001"),
      state,
    );
    await page.close();
  }

  {
    const { page } = await visit(`${fixture}/browser-test.html?screen=menu`);
    await page.evaluate(() =>
      document.querySelector('button[title="Aufklappen"]')?.click(),
    );
    await new Promise((resolve) => setTimeout(resolve, 150));
    const clicked = await clickText(page, "Artikel hinzufügen");
    await new Promise((resolve) => setTimeout(resolve, 150));
    record(
      "menu editor opens real dialog",
      clicked && !!(await page.$('[role="dialog"]')),
    );
    await page.close();
  }

  {
    const { page } = await visit(`${webapp}/sign-in`);
    const input = await page.$('input[type="password"]');
    const button = await page.$(
      'button[title*="Passwort"], button[title*="password"]',
    );
    if (button) await button.click();
    record(
      "sign-in password visibility control",
      !!input && !!button && !!(await page.$('input[type="text"]')),
    );
    await page.close();
  }

  {
    const { page } = await visit(`${website}/de-de`);
    const menu = await clickText(page, "Navigation öffnen");
    await clickText(page, "Navigation schließen");
    const faq = await page.evaluate(() => {
      const summary = [...document.querySelectorAll("summary")].find((node) =>
        node.textContent?.includes("Brauchen meine Kunden eine App?"),
      );
      summary?.click();
      return !!summary?.closest("details")?.open;
    });
    record("website mobile menu and FAQ interaction", menu && faq);
    await page.close();
  }
} finally {
  await browser.close();
}

const failures = results.filter((result) => !result.ok);
for (const result of results)
  process.stdout.write(
    `${result.ok ? "PASS" : "FAIL"} ${result.name}${result.ok ? "" : ` ${result.details}`}\n`,
  );
process.stdout.write(
  `${results.length - failures.length}/${results.length} checks passed; captures: ${output}\n`,
);
process.exitCode = failures.length ? 1 : 0;
