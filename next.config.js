/** @type {import('next').NextConfig} */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  ...(basePath && basePath !== '' && { basePath }),
  ...(basePath && basePath !== '' && { assetPrefix: basePath }),
  experimental: {
    // Disable static generation for all pages
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
