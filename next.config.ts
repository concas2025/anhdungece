import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  trailingSlash: true
};
export default nextConfig;
