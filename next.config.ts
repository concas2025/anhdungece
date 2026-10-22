import type { NextConfig } from 'next';
import path from 'node:path';

// Custom domain is served at /. Opt in only for a project-URL preview.
const isProjectPages = process.env.GITHUB_PAGES_PROJECT === 'true';
const repoName = 'anhdungece';

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve('.') },
  output: 'export',
  env: { NEXT_PUBLIC_BASE_PATH: isProjectPages ? `/${repoName}` : '' },
  devIndicators: false,
  basePath: isProjectPages ? `/${repoName}` : '',
  assetPrefix: isProjectPages ? `/${repoName}/` : '',
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
