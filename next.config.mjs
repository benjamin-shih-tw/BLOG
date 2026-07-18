/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/BLOG',
  assetPrefix: '/BLOG',
  // 防止 Turbopack 把 @notionhq/client 打包壞掉，保持原始 Node.js 模組形式
  serverExternalPackages: ['@notionhq/client'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
