/**
 * Application configuration
 * Controls environment settings for the CRE News Lite application
 */

// Default values that can be overridden by environment variables
const CONFIG = {
  // Toggle between mock and real data
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false', // Default to true (mock data)
  
  // Scraping configuration
  SCRAPE_CACHE_DURATION_MINUTES: Number(process.env.SCRAPE_CACHE_DURATION_MINUTES || '60'),
  
  // Sources to enable
  ENABLE_SOURCES: (process.env.ENABLE_SOURCES || 'bisnow,rebusiness,globest').split(','),
  
  // Redis configuration (for caching)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Rate limiting (requests per minute per domain)
  RATE_LIMIT_RPM: {
    default: Number(process.env.RATE_LIMIT_DEFAULT || '10'),
    bisnow: Number(process.env.RATE_LIMIT_BISNOW || '5'),
    rebusiness: Number(process.env.RATE_LIMIT_REBUSINESS || '5')
  },
  
  // Logging level
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

export default CONFIG;
