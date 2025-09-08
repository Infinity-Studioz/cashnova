import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable static optimization
  output: 'standalone',
  
  // Optimize images for CDN
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Configure for Cloudflare
    loader: process.env.NODE_ENV === 'production' ? 'custom' : 'default',
    loaderFile: process.env.NODE_ENV === 'production' ? './cloudflare-loader.ts' : undefined,
  },

  // Configure asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.CDN_URL : '',
  
  // Optimize for performance
  swcMinify: true,
  
  // Enable compression
  compress: true,
  
  // Configure headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control', 
            value: 'public, max-age=86400'
          }
        ]
      }
    ]
  },

  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@fortawesome/react-fontawesome']
  }
}

export default nextConfig