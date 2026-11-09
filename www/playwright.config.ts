import { defineConfig, devices } from "@playwright/test";

const browser = process.env.TEST_BROWSER ?? "chromium";
if (browser !== "chromium" && browser !== "firefox" && browser !== "webkit")
  throw new Error("Invalid TEST_BROWSER");
const baseURL = process.env.WEBSITE_TEST_URL ?? "http://127.0.0.1:3000";
const desktop =
  devices[
    browser === "firefox"
      ? "Desktop Firefox"
      : browser === "webkit"
        ? "Desktop Safari"
        : "Desktop Chrome"
  ];
const mobile =
  browser === "firefox"
    ? {
        ...devices["Desktop Firefox"],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
      }
    : devices[browser === "webkit" ? "iPhone 13" : "Pixel 7"];

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  outputDir: `test-results/${browser}`,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: `playwright-report/${browser}` }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop",
      use: { ...desktop, defaultBrowserType: browser },
    },
    {
      name: "mobile",
      use: {
        ...mobile,
        defaultBrowserType: browser,
        isMobile: browser !== "firefox",
      },
    },
  ],
  webServer: process.env.WEBSITE_TEST_URL
    ? undefined
    : {
        command: "npm run dev -- --hostname 127.0.0.1",
        url: `${baseURL}/de-de`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
