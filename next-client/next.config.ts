import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config) => {
    config.cache = {
      type: "filesystem",
    };
    return config;
  }
};

export default nextConfig;
