import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
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
        hostname: "app.zackisch.com",
      },
      {
        protocol: "https",
        hostname: "support.zackisch.com",
      },
    ],
  },
};

export default nextConfig;
