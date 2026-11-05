import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/brand/fonts/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  experimental: { globalNotFound: true },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
