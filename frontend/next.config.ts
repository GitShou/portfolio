import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    externalDir: true,
  },
  /* config options here */
};

export default nextConfig;
