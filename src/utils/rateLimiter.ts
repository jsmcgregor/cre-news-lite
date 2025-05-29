import Bottleneck from 'bottleneck';
import { scraperLogger } from './logger';
import CONFIG from '../config';

/**
 * Rate limiter factory for different domains
 * 
 * Creates and manages per-domain rate limiters to ensure we don't
 * overwhelm any site with too many requests
 */
class ScraperRateLimiter {
  private limiters: Map<string, Bottleneck> = new Map();
  
  /**
   * Get a rate limiter for a specific domain
   * @param domain Domain name (e.g., 'bisnow', 'rebusiness')
   */
  getLimiter(domain: string): Bottleneck {
    if (!this.limiters.has(domain)) {
      // Get rate limit configuration or use default
      const rateLimit = CONFIG.RATE_LIMIT_RPM[domain as keyof typeof CONFIG.RATE_LIMIT_RPM] || 
                       CONFIG.RATE_LIMIT_RPM.default;
      
      // Convert requests per minute to minimum time interval in ms
      const minTime = Math.ceil(60000 / rateLimit);
      
      // Create a new limiter for this domain
      const limiter = new Bottleneck({
        maxConcurrent: 1,             // Only one request at a time per domain
        minTime,                      // Minimum time between requests
        reservoir: rateLimit,         // Start with a full reservoir of tokens
        reservoirRefreshInterval: 60000, // Refill the tokens every minute
        reservoirRefreshAmount: rateLimit // Refill up to the maximum
      });
      
      // Add logging to rate limiter events
      limiter.on('dropped', (dropped) => {
        scraperLogger.error(domain, dropped.options.id as string, 
          new Error(`Request dropped due to rate limiting`));
      });
      
      limiter.on('depleted', () => {
        // Log when rate limit is reached for a domain
        scraperLogger.rateLimit(domain, minTime);
      });
      
      this.limiters.set(domain, limiter);
    }
    
    return this.limiters.get(domain)!;
  }
  
  /**
   * Submit a function to be rate limited
   * @param domain Domain being scraped
   * @param url URL being scraped
   * @param fn Function to execute under rate limiting
   */
  async schedule<T>(domain: string, url: string, fn: () => Promise<T>): Promise<T> {
    const limiter = this.getLimiter(domain);
    
    // Schedule the job with the limiter, include the URL as id for debugging
    return await limiter.schedule({ id: url }, fn);
  }
}

// Export singleton instance
export const rateLimiter = new ScraperRateLimiter();
