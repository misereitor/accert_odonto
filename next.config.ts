import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'objectstorage.sa-saopaulo-1.oraclecloud.com'
      }
    ]
  }
};

export default nextConfig;
