import { Article, Region } from '../../../types/article';
import { withCache } from '../cache';
import { rateLimiter } from '../rateLimiter';
import { scraperLogger } from '../logger';
import { withMonitoring } from '../monitoring';
import CONFIG from '../../config';
import { mockArticles } from '../../mocks/articles';
import { detectRegion } from '../regions';
import apiTracker from '../apiTracker';

/**
 * Base class for all scrapers
 * Implements common functionality like caching, rate limiting, and logging
 */
export abstract class BaseScraper {
  // Each scraper must implement these
  public abstract readonly name: string;
  public abstract readonly baseUrl: string;
  
  /**
   * Scrape articles from the source
   * This is the main method that each scraper must implement
   */
  protected abstract scrapeSource(): Promise<Article[]>;
  
  /**
   * Get articles with caching, rate limiting, and monitoring
   * Public method called by the API
   */
  public async getArticles(): Promise<Article[]> {
    console.log(`BaseScraper(${this.name}): getArticles called`);
    
    // If using mock data, just return mock articles for this source
    if (CONFIG.USE_MOCK_DATA) {
      console.log(`BaseScraper(${this.name}): Using mock data`);
      const sourceArticles = mockArticles.filter(article => 
        article.source.toLowerCase().includes(this.name.toLowerCase())
      );
      console.log(`BaseScraper(${this.name}): Found ${sourceArticles.length} mock articles`);
      return sourceArticles.length > 0 ? sourceArticles : [];
    }
    
    console.log(`BaseScraper(${this.name}): Using real scraper`);
    const cacheKey = `scraper:${this.name}:articles`;
    
    try {
      // Track this API request
      apiTracker.trackRequest(this.name);
      
      // Use the cache wrapper with monitoring
      const articles = await withCache(cacheKey, async () => {
        // Add monitoring wrapper around the scraping process
        return await withMonitoring(this.name, async () => {
          // Log the start of scraping
          scraperLogger.start(this.name, this.baseUrl);
          
          try {
            console.log(`BaseScraper(${this.name}): About to call scrapeSource()`);
            // Run the scraper through the rate limiter
            const scrapedArticles = await rateLimiter.schedule(
              this.name, 
              this.baseUrl,
              async () => await this.scrapeSource()
            );
            console.log(`BaseScraper(${this.name}): scrapeSource() returned ${scrapedArticles.length} articles`);
            return scrapedArticles;
          } catch (error) {
            console.error(`BaseScraper(${this.name}): Error in scrapeSource:`, error);
            // Track API error
            apiTracker.trackError(this.name);
            throw error;
          }
        });
      });
      
      console.log(`BaseScraper(${this.name}): getArticles returning ${articles.length} articles`);
      return articles;
    } catch (error) {
      console.error(`BaseScraper(${this.name}): Error in getArticles:`, error);
      // Track API error
      apiTracker.trackError(this.name);
      return [];
    }
  }
  
  /**
   * Helper to create an Article object from scraped data
   */
  protected createArticle(
    title: string,
    url: string,
    publishedDate: string,
    region?: string
  ): Article {
    // Ensure region is a valid Region type
    let validRegion: Region = 'National'; // Default to National
    
    if (region) {
      // Check if the provided region is a valid Region type
      const validRegions = ['National', 'West', 'Southwest', 'Midwest', 'South', 'Northeast'];
      if (validRegions.includes(region)) {
        validRegion = region as Region;
      }
    } else {
      // Try to detect region from title, or default to National
      const detectedRegion = detectRegion(title);
      if (detectedRegion) {
        validRegion = detectedRegion;
      }
    }
    
    return {
      title,
      url,
      publishedDate,
      source: this.name,
      region: validRegion
    };
  }
}
