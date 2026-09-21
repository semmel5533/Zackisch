import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";
import { fileURLToPath } from "node:url";
const app = fileURLToPath(new URL("../../", import.meta.url));
const stub = fileURLToPath(new URL("./stubs.ts", import.meta.url));
export default defineConfig({
  root: fileURLToPath(new URL("./", import.meta.url)),
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  define: {
    "process.env": {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_capture_only",
    },
  },
  resolve: {
    alias: [
      {
        find: "next/image",
        replacement: fileURLToPath(new URL("./Image.tsx", import.meta.url)),
      },
      ...[
        "next/navigation",
        "convex/react",
        "@/actions/checkout-actions",
        "@/actions/order-actions",
      ].map((find) => ({ find, replacement: stub })),
      { find: "@", replacement: app },
    ],
  },
  server: { host: "127.0.0.1", port: 4174, fs: { allow: [app] } },
});
