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
    unoptimized: true,
  },
  
  // Enable compression
  compress: true,
  
  // Environment variables that will be available at build time
  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Enable static exports for GitHub Pages
  output: 'export',
  
  // Base path for GitHub Pages (update this with your repository name when deploying)
  // basePath: '/cre-news-lite',
};

module.exports = nextConfig;
