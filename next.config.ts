import type { NextConfig } from 'next';
import path from 'node:path';

const isGitHubPages = process.env.GITHUB_PAGES !== 'false';
const repoName = 'bio-link';

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve('.') },
  output: 'export',
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/bio-link' : '' },
  devIndicators: false,
  basePath: isGitHubPages ? `/${repoName}` : '',
  assetPrefix: isGitHubPages ? `/${repoName}/` : '',
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
