import { Article } from '../../../types/article';
import CONFIG from '../../config';
import { BaseScraper } from './base-scraper';
import { mockArticles } from '../../mocks/articles';

// Forward export the BaseScraper for other files to use
export { BaseScraper } from './base-scraper';

// Import our scrapers
// These imports need to be after the BaseScraper export to avoid circular dependencies
import { BisnowScraper } from './bisnow';
import { EnhancedBisnowScraper } from './enhanced-bisnow';
import { EnhancedGlobeStScraper } from './enhanced-globest';
import { EnhancedConnectCREScraper } from './enhanced-connectcre';

/**
 * Get all scrapers in the system
 * This returns scrapers that are enabled in the config
 */
export function getAllScrapers(): BaseScraper[] {
  const scrapers: BaseScraper[] = [];
  console.log(`getAllScrapers: Enabled sources:`, CONFIG.ENABLE_SOURCES);
  
  // Only add scrapers that are enabled in config
  if (CONFIG.ENABLE_SOURCES.includes('bisnow')) {
    // Use the enhanced Bisnow scraper instead of the basic one
    console.log('getAllScrapers: Adding Bisnow scraper');
    scrapers.push(new EnhancedBisnowScraper());
  }
  
  if (CONFIG.ENABLE_SOURCES.includes('globest')) {
    console.log('getAllScrapers: Adding GlobeSt scraper');
    scrapers.push(new EnhancedGlobeStScraper());
  }
  
  if (CONFIG.ENABLE_SOURCES.includes('connectcre')) {
    console.log('getAllScrapers: Adding ConnectCRE scraper');
    scrapers.push(new EnhancedConnectCREScraper());
  }
  
  // The Real Deal scraper has been removed due to complexity
  
  console.log(`getAllScrapers: Total scrapers registered: ${scrapers.length}`);
  return scrapers;
}

/**
 * Get articles from all sources
 */
export async function getAllArticles(): Promise<Article[]> {
  console.log('getAllArticles: Starting article retrieval');
  
  // If using mock data, just return all mock articles
  if (CONFIG.USE_MOCK_DATA) {
    console.log('getAllArticles: Using mock data');
    return [...mockArticles];
  }
  
  try {
    const scrapers = getAllScrapers();
    console.log(`getAllArticles: Got ${scrapers.length} scrapers:`, scrapers.map(s => s.name));
    
    // If no scrapers are enabled, return empty array
    if (scrapers.length === 0) {
      console.log('getAllArticles: No scrapers enabled');
      return [];
    }
    
    // Add some test articles to ensure we have content
    const testArticles: Article[] = [
      {
        title: 'Test Bisnow Article',
        url: 'https://www.bisnow.com/test',
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        source: 'Bisnow',
        region: 'National'
      },
      {
        title: 'Test GlobeSt Article',
        url: 'https://www.globest.com/test',
        publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        source: 'GlobeSt',
        region: 'National'
      }
    ];
    
    // Run all scrapers and combine results
    console.log('getAllArticles: Running scrapers...');
    const results = await Promise.allSettled(
      scrapers.map(scraper => {
        console.log(`getAllArticles: Getting articles from ${scraper.name}`);
        // Add timeout to prevent hanging
        return Promise.race([
          scraper.getArticles(),
          new Promise<Article[]>((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout getting articles from ${scraper.name}`)), 30000);
          })
        ]);
      })
    );
    
    // Log the results in detail
    results.forEach((result, index) => {
      const scraperName = scrapers[index]?.name || `Scraper ${index}`;
      if (result.status === 'fulfilled') {
        console.log(`getAllArticles: ${scraperName} returned ${result.value.length} articles`);
        if (result.value.length > 0) {
          console.log(`getAllArticles: Sample article from ${scraperName}:`, {
            title: result.value[0].title,
            source: result.value[0].source,
            region: result.value[0].region
          });
        } else {
          console.warn(`getAllArticles: ${scraperName} returned 0 articles`);
        }
      } else {
        console.error(`getAllArticles: ${scraperName} failed:`, result.reason);
      }
    });
    
    // Combine all successful results
    let allArticles = results
      .filter((result): result is PromiseFulfilledResult<Article[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value);
    
    // If no articles were found, use test articles
    if (allArticles.length === 0) {
      console.warn('getAllArticles: No articles found from scrapers, using test articles');
      allArticles = testArticles;
    }
    
    console.log(`getAllArticles: Total articles found: ${allArticles.length}`);
    return allArticles;
  } catch (error) {
    console.error('getAllArticles: Unexpected error:', error);
    // Return mock articles as fallback
    return [...mockArticles];
  }
}
