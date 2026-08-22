import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true' || true;
const repoName = 'bio-link';

const nextConfig: NextConfig = {
  output: 'export',
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