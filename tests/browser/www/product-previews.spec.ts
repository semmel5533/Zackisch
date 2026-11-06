import { expect, test } from "@playwright/test";

test("guest frames and centered staff preview retain readable placeholders", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/de-de");
    await expect(page.locator(".phone-placeholder")).toHaveCount(3);
    await expect(page.locator(".service-section img")).toHaveCount(0);
    const frame = page.locator(".staff-placeholder");
    await expect(frame).toContainText("Personalansicht");
    const box = await frame.boundingBox();
    expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThan(2);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".staff-preview")).toHaveCSS("transform", "none");
  }
});

test("staff preview grows on desktop and respects live reduced-motion changes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/de-en");
  const frame = page.locator(".staff-preview");
  const scale = () =>
    frame.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).a);
  await expect.poll(scale).toBeCloseTo(0.88, 2);
  await frame.evaluate((e) =>
    window.scrollTo({
      top: (e as HTMLElement).offsetTop - innerHeight * 0.35,
      behavior: "instant",
    }),
  );
  await expect.poll(scale).toBeCloseTo(1, 2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(frame).toHaveCSS("transform", "none");
  await expect(page.locator(".chapter-introduction p")).toContainText(
    "variants, extras and selection steps",
  );
  await page
    .getByRole("button", { name: "What if an item or option sells out?" })
    .click();
  await expect(
    page.getByText(
      "Your team can switch items, individual options and entire selection steps off and back on in the staff view.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(page.locator(".service-section")).not.toContainText(
    "individual options",
  );
  await expect(page.locator(".staff-placeholder")).toHaveCSS(
    "border-top-width",
    "6px",
  );
});
