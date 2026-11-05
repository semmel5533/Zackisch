import { defineConfig, devices } from "@playwright/test";

const target = process.env.TEST_APP ?? "root";
if (!["root", "app", "support", "internal"].includes(target))
  throw new Error("Invalid TEST_APP");
const port = { root: 3000, app: 3001, internal: 3002, support: 3003 }[
  target as "root"
];
const baseURL = process.env.WEBSITE_TEST_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: `./tests/browser/${target}`,
  fullyParallel: true,
  outputDir: `test-results/${target}`,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: `playwright-report/${target}` }],
  ],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: process.env.WEBSITE_TEST_URL
    ? undefined
    : {
        command: `npm run dev --prefix ${target} -- --hostname 127.0.0.1`,
        url: `${baseURL}${target === "root" || target === "support" ? "/de-de" : "/sign-in"}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
