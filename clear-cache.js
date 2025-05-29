// Script to clear the cache for the GlobeSt scraper
const { cache } = require('./dist/utils/cache');

async function clearCache() {
  try {
    console.log('Clearing cache for GlobeSt scraper...');
    
    // Clear the specific cache key for the GlobeSt scraper
    const cacheKey = 'scraper:GlobeSt:articles';
    await cache.delete(cacheKey);
    
    console.log(`Cache cleared for key: ${cacheKey}`);
    console.log('Next time the API is called, it will fetch fresh data from GlobeSt.com');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Run the function
clearCache();
