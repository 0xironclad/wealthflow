import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.cache = {
      type: "filesystem",
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
};

export default nextConfig;
