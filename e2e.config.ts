import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";

export default {
  tests: "root/tests/**/*.e2e.ts",
  targets: [{
    name: "website",
    engine: web(),
    app: {
      url: "http://localhost:3000",
      command: {
        executable: "npm",
        args: ["run", "dev", "--prefix", "root"],
        reuseExisting: true,
        log: ".e2e/logs/website.log",
      },
    },
  }],
  workers: 1,
  trace: "on",
} satisfies E2EConfig;
