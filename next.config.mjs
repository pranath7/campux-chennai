/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'canvas-confetti'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // High-speed RAM memory cache: prevents disk I/O lock while keeping compilation blazing fast
      config.cache = {
        type: 'memory',
      };
    }
    return config;
  },
};

export default nextConfig;
