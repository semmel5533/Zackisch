import type { E2EConfig } from "e2e";
import { web } from "@e2e-dev/web";

export default {
  tests: "tests/**/*.e2e.ts",
  targets: [
    {
      name: "internal",
      engine: web(),
      app: {
        url: "http://localhost:3002",
        command: {
          executable: "npm",
          args: ["run", "dev"],
          reuseExisting: true,
          log: ".e2e/logs/internal.log",
        },
      },
    },
  ],
  workers: 1,
  trace: "on",
} satisfies E2EConfig;
