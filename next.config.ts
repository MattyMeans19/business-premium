import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line to silence the error
  turbopack: {}, 
  
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;