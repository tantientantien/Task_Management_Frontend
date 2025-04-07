import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    domains: ['img.clerk.com'],
  },
};

export default nextConfig;
