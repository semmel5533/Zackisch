import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: process.env.WEBSITE_TEST_URL ?? "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: process.env.WEBSITE_TEST_URL ? undefined : {
    command: "npm run dev --prefix root -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000/de-de",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
