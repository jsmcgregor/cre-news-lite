/** @type {import('next').NextConfig} */
const nextConfig = {
  // API route headers for CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Enable image optimization
  images: {
    domains: ['bisnow.com', 'globest.com'],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    USE_MOCK_DATA: 'true', // Force using mock data for static exports
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable static export
  output: 'export',
  
  // Trailingslash for better compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
