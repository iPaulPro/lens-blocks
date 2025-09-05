import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
};

export default nextConfig;
