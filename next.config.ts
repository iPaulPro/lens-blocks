import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: config => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, net: false, tls: false };
    config.resolve.alias = { ...(config.resolve.alias || {}), canvas: false };
    config.externals = Array.isArray(config.externals) ? config.externals : [];
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [{ hostname: "**" }],
    unoptimized: true,
  },
};

export default nextConfig;
