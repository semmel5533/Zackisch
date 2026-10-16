import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
