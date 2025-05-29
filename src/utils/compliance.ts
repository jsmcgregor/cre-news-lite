/**
 * Legal compliance module for web scraping
 * Handles robots.txt parsing and compliance checks
 */
import { parse } from 'robots-txt-parser';
import logger from './logger';

/**
 * Robot rules cache with expiration
 */
interface RobotRulesCache {
  rules: any;
  expiry: number; // Unix timestamp
}

/**
 * Robot rules cache (domain -> rules)
 * We cache these to avoid constantly re-fetching robots.txt
 */
const robotsCache: Map<string, RobotRulesCache> = new Map();

/**
 * Cache expiry time for robots.txt (24 hours)
 */
const ROBOTS_CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Default user agent for our scraper
 */
const USER_AGENT = 'CRENewsLite/1.0';

/**
 * Get the robots.txt parser
 */
function getRobotsParser() {
  return parse({
    userAgent: USER_AGENT, 
    allowOnNeutral: true
  });
}

/**
 * Extract domain from URL
 */
function getDomainFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname;
  } catch (error) {
    logger.error({ 
      event: 'url_parse_error', 
      url, 
      error: error instanceof Error ? error.message : String(error)
    });
    // Default to the original URL to be safe
    return url;
  }
}

/**
 * Check if we can crawl a URL based on robots.txt rules
 * @param url The URL to check
 * @returns {Promise<boolean>} Whether the URL is allowed to be scraped
 */
export async function canCrawl(url: string): Promise<boolean> {
  try {
    const domain = getDomainFromUrl(url);
    
    // Skip check for localhost/development
    if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
      return true;
    }
    
    // Check cache first
    const cached = robotsCache.get(domain);
    if (cached && cached.expiry > Date.now()) {
      return await cached.rules.canCrawl(url);
    }
    
    // Need to fetch and parse robots.txt
    logger.info({ event: 'fetching_robots_txt', domain });
    
    const parser = getRobotsParser();
    const robotsUrl = `https://${domain}/robots.txt`;
    
    try {
      await parser.fetch(robotsUrl);
      
      // Cache the result
      robotsCache.set(domain, {
        rules: parser,
        expiry: Date.now() + ROBOTS_CACHE_TTL
      });
      
      const allowed = await parser.canCrawl(url);
      
      logger.info({ 
        event: 'robots_check_result', 
        url, 
        allowed 
      });
      
      return allowed;
    } catch (fetchError) {
      // If robots.txt can't be fetched, log it but don't block scraping
      // Many sites don't have a robots.txt file
      logger.warn({ 
        event: 'robots_txt_fetch_failed', 
        url: robotsUrl, 
        error: fetchError instanceof Error ? fetchError.message : String(fetchError),
        action: 'allowing_crawl_by_default'
      });
      
      // Default to allow if we can't fetch robots.txt
      return true;
    }
  } catch (error) {
    // Log the error and default to disallowing on any unexpected errors
    logger.error({ 
      event: 'robots_check_error', 
      url, 
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Be conservative - if we encounter an error while checking, don't crawl
    return false;
  }
}

/**
 * Legal notice about the scraped content
 * Include this in UI where scraped content is displayed
 */
export const LEGAL_NOTICE = `
Articles shown are for personal use only. 
Content is property of the original publishers.
Links direct to original sources for full articles.
`;

/**
 * Terms of Service check function
 * Validates whether a specific domain is allowed to be scraped
 * based on our understanding of their terms of service
 */
const KNOWN_DISALLOWED_DOMAINS: string[] = [
  // Add domains that explicitly forbid scraping in their ToS
  // Example: 'example-no-scraping-allowed.com'
];

/**
 * Check if a domain is allowed per terms of service
 */
export function isAllowedByTerms(url: string): boolean {
  const domain = getDomainFromUrl(url);
  
  // Check against known disallowed domains
  const isDisallowed = KNOWN_DISALLOWED_DOMAINS.some(
    disallowedDomain => domain.includes(disallowedDomain)
  );
  
  if (isDisallowed) {
    logger.warn({
      event: 'tos_violation',
      url,
      domain,
      reason: 'Domain is in the disallowed list per terms of service'
    });
    return false;
  }
  
  return true;
}
