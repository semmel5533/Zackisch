import type { NextConfig } from "next";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
let convexHostname = "";
try {
  if (convexUrl) {
    convexHostname = new URL(convexUrl).hostname;
  }
} catch {
  // fallback
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(convexHostname
        ? [
            {
              protocol: "https" as const,
              hostname: convexHostname,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "*.convex.site",
      },
      {
        protocol: "https",
        hostname: "zackisch.com",
      },
      {
        protocol: "https",
        hostname: "www.zackisch.com",
      },
      {
        protocol: "https",
        hostname: "app.zackisch.com",
      },
      {
        protocol: "https",
        hostname: "zackisch.de",
      },
      {
        protocol: "https",
        hostname: "www.zackisch.de",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: [
        "app.zackisch.com",
        "app.zackisch.de",
        "internal.zackisch.com",
        "support.zackisch.com",
        "zackisch.com",
        "localhost:3000",
        "localhost:3001",
        "localhost:3002",
        "localhost:3003",
        "127.0.0.1:3000",
        "127.0.0.1:3001",
        "127.0.0.1:3002",
        "127.0.0.1:3003",
      ],
    },
  },
};

export default nextConfig;
