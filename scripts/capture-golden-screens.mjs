import { chromium } from "playwright-core";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "320px", width: 320, height: 600 },
  { name: "390px", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1024px", width: 1024, height: 768 },
  { name: "1440px", width: 1440, height: 900 },
  { name: "1920px", width: 1920, height: 1080 },
];

const OUT_DIR = "/Users/selim/dev/Zackisch/docs/evidence/golden-screens";

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. Obtain admin session token from convex
  let adminToken = "";
  try {
    const loginRes = JSON.parse(
      execSync("npx convex run admin:loginAdmin '{\"email\":\"selim@zackisch.com\",\"password\":\"demo\"}'", {
        cwd: "/Users/selim/dev/Zackisch/app",
        stdio: ["ignore", "pipe", "ignore"],
      }).toString()
    );
    adminToken = loginRes.admin?.sessionToken || "";
  } catch (e) {
    console.error("Failed to get admin session:", e.message);
  }

  const businessId = "ns7b4cvnvbqabsjv76aeajvnch8gecnz";

  const screens = [
    {
      id: "GOLD-01",
      name: "marketing-de",
      url: "http://localhost:3000/de-de",
    },
    {
      id: "GOLD-01",
      name: "marketing-en",
      url: "http://localhost:3000/de-en",
    },
    {
      id: "GOLD-02",
      name: "owner-overview",
      url: `http://localhost:3001/dashboard/${businessId}/overview`,
      auth: "owner",
    },
    {
      id: "GOLD-03",
      name: "guest-checkout",
      url: `http://localhost:3001/pickup/${businessId}`,
    },
    {
      id: "GOLD-04",
      name: "support-article-de",
      url: "http://localhost:3003/de-de/articles/pos-single-entry-workflow",
    },
    {
      id: "GOLD-04",
      name: "support-article-en",
      url: "http://localhost:3003/de-en/articles/pos-single-entry-workflow",
    },
    {
      id: "GOLD-05",
      name: "ops-triage",
      url: "http://localhost:3002/tickets",
      auth: "admin",
    },
  ];

  const browser = await chromium.launch({ headless: true });

  for (const screen of screens) {
    console.log(`\nCapturing ${screen.id} (${screen.name}) at ${screen.url}...`);
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      if (screen.auth === "admin" && adminToken) {
        await context.addInitScript((tok) => {
          window.sessionStorage.setItem("zackisch_ops_session", tok);
        }, adminToken);
      }

      if (screen.auth === "owner") {
        await context.addCookies([
          {
            name: "zakkig_session",
            value: "demo-owner-session",
            domain: "localhost",
            path: "/",
          },
        ]);
      }

      const page = await context.newPage();
      try {
        await page.goto(screen.url, { waitUntil: "networkidle", timeout: 15000 });
        await page.waitForTimeout(600); // allow transitions to settle

        const fileName = `${screen.id}_${screen.name}_${vp.name}.png`;
        const filePath = path.join(OUT_DIR, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        console.log(`  ✓ Saved ${fileName}`);
      } catch (err) {
        console.error(`  ✗ Error capturing ${vp.name}:`, err.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log("\n=== ALL GOLDEN SCREEN CAPTURES FINISHED ===");
}

main().catch(console.error);
