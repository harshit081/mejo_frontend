import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.builder.io'],
  },
  reactStrictMode: true,
};

export default nextConfig;