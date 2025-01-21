import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  typescript: {
    // This will ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This will ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
