/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the App Router for now, since we're using Pages Router
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig; 