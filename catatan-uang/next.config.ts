import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    turbo: {
      rules: {
        // Configure which files should be processed by Turbopack
        '*.{js,jsx,ts,tsx}': ['swc'],
      },
    },
  },
};

export default nextConfig;
