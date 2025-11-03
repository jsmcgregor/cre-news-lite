/**
 * Application configuration
 * Centralizes all configuration settings for the application
 */

// Get environment variables with fallbacks, ensuring defaults work correctly
// IMPORTANT: Default must be false to use real data in development
// Force USE_MOCK_DATA to be false to ensure real data is used
const USE_MOCK_DATA = false;

// Only use Redis if specifically enabled - better default for dev environments
const USE_REDIS = process.env.USE_REDIS === 'true';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Cache duration and other settings
// Setting a very short cache duration to ensure fresh data
const SCRAPE_CACHE_DURATION_MINUTES = Number(process.env.SCRAPE_CACHE_DURATION_MINUTES || '1');
// Always ensure bisnow is included in enabled sources
const envSources = process.env.ENABLE_SOURCES || 'bisnow,globest,connectcre';
const ENABLE_SOURCES = envSources.split(',');
// Make sure bisnow is always included
if (!ENABLE_SOURCES.includes('bisnow')) {
  ENABLE_SOURCES.push('bisnow');
}
const RATE_LIMIT_DEFAULT = Number(process.env.RATE_LIMIT_DEFAULT || '10');
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Rate limiting configuration (requests per minute)
const RATE_LIMIT_RPM = {
  default: RATE_LIMIT_DEFAULT,
  Bisnow: Number(process.env.RATE_LIMIT_BISNOW || '5'),
  REBusiness: Number(process.env.RATE_LIMIT_REBUSINESS || '5'),
  GlobeSt: Number(process.env.RATE_LIMIT_GLOBEST || '5'),
  ConnectCRE: Number(process.env.RATE_LIMIT_CONNECTCRE || '5'),
  CREDaily: Number(process.env.RATE_LIMIT_CREDAILY || '5'),
  CommercialSearch: Number(process.env.RATE_LIMIT_COMMERCIALSEARCH || '5')
};

// Export configuration as a single object
const CONFIG = {
  USE_MOCK_DATA,
  USE_REDIS,
  REDIS_URL,
  SCRAPE_CACHE_DURATION_MINUTES,
  ENABLE_SOURCES,
  RATE_LIMIT_DEFAULT,
  RATE_LIMIT_RPM,
  LOG_LEVEL,
};

console.log('CONFIG loaded:', { 
  USE_MOCK_DATA, 
  USE_REDIS,
  ENABLE_SOURCES, 
  SCRAPE_CACHE_DURATION_MINUTES,
  // Don't log sensitive data like REDIS_URL
});

export default CONFIG;
