import { chromium } from "playwright-core";
import { execSync } from "child_process";

async function run() {
  console.log("=== STARTING FULL DEV CONSOLE AUDIT ===");

  // 1. Get valid admin session token from Convex
  let adminToken = "";
  try {
    const loginRes = JSON.parse(
      execSync("npx convex run admin:loginAdmin '{\"email\":\"selim@zackisch.com\",\"password\":\"demo\"}'", {
        cwd: "/Users/selim/dev/Zackisch/app",
        stdio: ["ignore", "pipe", "ignore"],
      }).toString()
    );
    adminToken = loginRes.admin?.sessionToken || "";
    console.log("Got admin session token:", adminToken ? "YES" : "NO");
  } catch (e) {
    console.error("Failed to login admin:", e.message);
  }

  // 2. Get owner business ID
  let businessId = "ns7b4cvnvbqabsjv76aeajvnch8gecnz"; // fallback from previous logs

  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const warnings = [];

  const targets = [
    // ROOT (Port 3000)
    { app: "root", url: "http://localhost:3000/de-de" },
    { app: "root", url: "http://localhost:3000/de-en" },
    { app: "root", url: "http://localhost:3000/de-de/privacy-policy" },
    { app: "root", url: "http://localhost:3000/de-de/gtc" },
    { app: "root", url: "http://localhost:3000/de-de/legal-notice" },
    { app: "root", url: "http://localhost:3000/de-de/accessibility" },
    { app: "root", url: "http://localhost:3000/de-de/data-processing" },

    // SUPPORT (Port 3003)
    { app: "support", url: "http://localhost:3003/de-de" },
    { app: "support", url: "http://localhost:3003/de-en" },
    { app: "support", url: "http://localhost:3003/de-de/categories/onboarding" },
    { app: "support", url: "http://localhost:3003/de-de/categories/payments-payouts" },
    { app: "support", url: "http://localhost:3003/de-de/articles/setup-checklist-15-minutes" },
    { app: "support", url: "http://localhost:3003/de-de/articles/pos-single-entry-workflow" },
    { app: "support", url: "http://localhost:3003/de-de/tickets" },
    { app: "support", url: "http://localhost:3003/de-de/tickets/new" },

    // INTERNAL (Port 3002) - with admin session
    { app: "internal", url: "http://localhost:3002/", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/businesses", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/orders", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/tickets", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/staff", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/partners", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/newsletter", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/emails", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/audit", auth: "admin" },
    { app: "internal", url: "http://localhost:3002/settings", auth: "admin" },

    // APP (Port 3001) - auth & guest pages
    { app: "app", url: "http://localhost:3001/sign-in" },
    { app: "app", url: "http://localhost:3001/sign-up" },
    { app: "app", url: "http://localhost:3001/reset-password" },
    { app: "app", url: `http://localhost:3001/pickup/${businessId}` },

    // APP (Port 3001) - authenticated owner dashboard
    { app: "app", url: `http://localhost:3001/dashboard/${businessId}/overview`, auth: "owner" },
    { app: "app", url: `http://localhost:3001/dashboard/${businessId}/menu`, auth: "owner" },
    { app: "app", url: `http://localhost:3001/dashboard/${businessId}/current-orders`, auth: "owner" },
    { app: "app", url: `http://localhost:3001/dashboard/${businessId}/all-orders`, auth: "owner" },
    { app: "app", url: `http://localhost:3001/dashboard/${businessId}/settings`, auth: "owner" },
  ];

  for (const target of targets) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    if (target.auth === "admin" && adminToken) {
      await context.addInitScript((tok) => {
        window.sessionStorage.setItem("zackisch_ops_session", tok);
      }, adminToken);
    }
    if (target.auth === "owner") {
      await context.addCookies([
        {
          name: "zakkig_session",
          value: "demo_owner_session",
          domain: "localhost",
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
        },
      ]);
    }

    const page = await context.newPage();
    const pageErrors = [];
    const pageWarnings = [];

    page.on("pageerror", (e) => {
      pageErrors.push(e.message);
      errors.push({ app: target.app, url: target.url, error: e.message });
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        pageErrors.push(msg.text());
        errors.push({ app: target.app, url: target.url, error: msg.text() });
      } else if (msg.type() === "warning") {
        pageWarnings.push(msg.text());
        warnings.push({ app: target.app, url: target.url, warning: msg.text() });
      }
    });

    try {
      const resp = await page.goto(target.url, { waitUntil: "networkidle", timeout: 15000 });
      const status = resp?.status() || 0;
      await page.waitForTimeout(1000);

      const statusColor = status >= 400 ? "FAILED" : "OK";
      console.log(`[${target.app.toUpperCase()}] ${statusColor} (${status}) -> ${target.url} [Errors: ${pageErrors.length}, Warnings: ${pageWarnings.length}]`);
      if (status >= 400) {
        errors.push({ app: target.app, url: target.url, error: `HTTP status ${status}` });
      }
    } catch (e) {
      console.log(`[${target.app.toUpperCase()}] ERROR LOADING -> ${target.url}: ${e.message}`);
      errors.push({ app: target.app, url: target.url, error: e.message });
    }

    await context.close();
  }

  await browser.close();

  console.log("\n=================== AUDIT RESULTS ===================");
  console.log(`Total Errors: ${errors.length}`);
  console.log(`Total Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log("\n--- ERRORS LIST ---");
    for (const err of errors) {
      console.log(`[${err.app}] ${err.url}: ${err.error}`);
    }
  }

  if (warnings.length > 0) {
    console.log("\n--- WARNINGS LIST ---");
    for (const w of warnings) {
      console.log(`[${w.app}] ${w.url}: ${w.warning}`);
    }
  }

  console.log("=====================================================\n");
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
