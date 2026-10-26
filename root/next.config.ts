import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
