import * as cheerio from 'cheerio';
import { Article } from '../../../types/article';
import { BaseScraper } from './base-scraper';
import logger from '../logger';
import { canCrawl, isAllowedByTerms } from '../compliance';

/**
 * Bisnow Scraper
 * 
 * Scrapes commercial real estate news from Bisnow.com
 */
export class BisnowScraper extends BaseScraper {
  public readonly name = 'Bisnow';
  public readonly baseUrl = 'https://www.bisnow.com/national/news';
  
  // List of Bisnow regional sites to gather comprehensive news
  private readonly regionalUrls = [
    'https://www.bisnow.com/national/news',
    'https://www.bisnow.com/new-york/news',
    'https://www.bisnow.com/chicago/news',
    'https://www.bisnow.com/los-angeles/news',
    'https://www.bisnow.com/dallas-ft-worth/news',
    'https://www.bisnow.com/washington-dc/news',
    'https://www.bisnow.com/boston/news',
    'https://www.bisnow.com/south-florida/news',
    'https://www.bisnow.com/atlanta/news'
  ];
  
  /**
   * Detect region from URL
   * @param url The URL to extract region from
   * @returns Region name
   */
  private detectRegionFromUrl(url: string): string {
    if (url.includes('/national/')) {
      return 'National';
    } else if (url.includes('/new-york/')) {
      return 'Northeast';
    } else if (url.includes('/chicago/')) {
      return 'Midwest';
    } else if (url.includes('/los-angeles/')) {
      return 'West';
    } else if (url.includes('/dallas-ft-worth/')) {
      return 'Southwest';
    } else if (url.includes('/washington-dc/')) {
      return 'Northeast';
    } else if (url.includes('/boston/')) {
      return 'Northeast';
    } else if (url.includes('/south-florida/')) {
      return 'South';
    } else if (url.includes('/atlanta/')) {
      return 'South';
    }
    
    // Default to National if no region detected
    return 'National';
  };
  
  /**
   * Verify if an article is recent (within the last month)
   * @param url The article URL to verify
   * @returns Object containing verified title, date, and whether article is recent
   */
  /**
   * Format a URL to ensure it's a complete Bisnow URL
   * @param url The URL to format
   * @returns A properly formatted URL
   */
  private formatUrl(url: string): string {
    // Handle empty or invalid URLs
    if (!url || typeof url !== 'string') {
      return 'https://www.bisnow.com';
    }
    
    // Clean the URL - remove whitespace and normalize
    const cleanUrl = url.trim();
    
    // Already a fully qualified URL
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      // Make sure it's https
      return cleanUrl.replace(/^http:/i, 'https:');
    }
    
    // Handle relative URLs
    if (cleanUrl.startsWith('/')) {
      return `https://www.bisnow.com${cleanUrl}`;
    }
    
    // Handle URLs without leading slash
    return `https://www.bisnow.com/${cleanUrl}`;
  }
  
  /**
   * Validate and fix a URL to ensure it's a valid, working URL
   * @param url The URL to validate and fix
   * @returns A validated and fixed URL
   */
  private validateAndFixUrl(url: string): string {
    // Handle empty or invalid URLs
    if (!url || typeof url !== 'string') {
      return 'https://www.bisnow.com';
    }
    
    try {
      // First, ensure the URL is formatted correctly
      const formattedUrl = this.formatUrl(url);
      
      // Try to parse the URL to validate it
      const parsedUrl = new URL(formattedUrl);
      
      // Make sure we're using HTTPS
      parsedUrl.protocol = 'https:';
      
      // Make sure the hostname is set
      if (!parsedUrl.hostname) {
        parsedUrl.hostname = 'www.bisnow.com';
      }
      
      // Return the validated URL
      return parsedUrl.toString();
    } catch (error) {
      // If URL parsing fails, log the error and return a fallback URL
      logger.error({
        event: 'url_validation_failed',
        url,
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Return the formatted URL as a fallback
      return this.formatUrl(url);
    }
  }

  /**
   * Verify if an article is recent (within the last month)
   * @param url The article URL to verify
   * @returns Object containing verified title, date, and whether article is recent
   */
  private async verifyArticle(url: string): Promise<{ title: string | null; date: string | null; isRecent: boolean }> {
    // Validate and fix the URL
    const validatedUrl = this.validateAndFixUrl(url);
    
    // Log the URL we're verifying
    logger.info({
      event: 'verifying_article',
      originalUrl: url,
      validatedUrl: validatedUrl
    });
    
    try {
      const response = await fetch(validatedUrl, { method: 'GET' });
      
      if (!response.ok) {
        logger.warn({
          event: 'article_verification_failed_status',
          url: validatedUrl,
          originalUrl: url,
          status: response.status
        });
        return { title: null, date: null, isRecent: false };
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract the actual title from the article page
      let pageTitle = $('h1').first().text().trim();
      
      // If no h1 title, try other selectors
      if (!pageTitle) {
        pageTitle = $('.article-title').text().trim();
      }
      
      // If still no title, try the page title
      if (!pageTitle) {
        pageTitle = $('title').text().trim();
        // Clean up the title by removing site name
        pageTitle = pageTitle.replace(' | Bisnow', '').replace('Bisnow - ', '').trim();
      }
      
      // Log the extracted title for debugging
      logger.info({
        event: 'extracted_title',
        url: validatedUrl,
        title: pageTitle
      });
      
      // Extract the actual date from the article page
      const pageDateText = $('.publish-date').text().trim() || 
                           $('.article-date').text().trim() || 
                           $('meta[property="article:published_time"]').attr('content');
      
      // Parse the date
      let articleDate: Date | null = null;
      let formattedDate: string | null = null;
      
      if (pageDateText) {
        try {
          if (pageDateText.includes('T')) {
            // ISO format
            articleDate = new Date(pageDateText);
          } else {
            // Text format
            articleDate = new Date(pageDateText);
          }
          
          // Format the date
          formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(articleDate);
        } catch (e) {
          logger.warn({
            event: 'date_parse_failed',
            dateText: pageDateText,
            error: e instanceof Error ? e.message : String(e)
          });
        }
      }
      
      // Check if the article is from the last month
      let isRecent = false;
      if (articleDate) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        isRecent = articleDate >= oneMonthAgo;
      }
      
      return { 
        title: pageTitle || null, 
        date: formattedDate || null,
        isRecent: isRecent
      };
    } catch (error) {
      logger.warn({
        event: 'article_verification_failed',
        url: validatedUrl,
        originalUrl: url,
        error: error instanceof Error ? error.message : String(error)
      });
      return { title: null, date: null, isRecent: false };
    }
  }
  
  /**
   * Scrape the Bisnow website for CRE news articles
   */
  protected async scrapeSource(): Promise<Article[]> {
    try {
      const allArticles: Article[] = [];
      
      // First, check if we're allowed to scrape this site
      const isAllowedTerms = isAllowedByTerms(this.baseUrl);
      if (!isAllowedTerms) {
        logger.warn({
          event: 'scraping_not_allowed_by_terms',
          site: this.name,
          url: this.baseUrl
        });
        return [];
      }
      
      // Then check robots.txt
      const isAllowedRobots = await canCrawl(this.baseUrl);
      if (!isAllowedRobots) {
        logger.warn({
          event: 'scraping_not_allowed_by_robots',
          site: this.name,
          url: this.baseUrl
        });
        return [];
      }
      
      // Fetch and process each regional URL
      for (const regionalUrl of this.regionalUrls) {
        try {
          logger.info({
            event: 'scraping_regional_site',
            site: this.name,
            url: regionalUrl
          });
          
          // Fetch the HTML content
          const response = await fetch(regionalUrl);
          
          if (!response.ok) {
            logger.warn({
              event: 'fetch_failed',
              site: this.name,
              url: regionalUrl,
              status: response.status
            });
            continue; // Skip this region but continue with others
          }
          
          const html = await response.text();
          const $ = cheerio.load(html);
          
          // Get region from URL
          const region = this.detectRegionFromUrl(regionalUrl);
      
          // Updated selectors for current Bisnow website structure
          const articleSelectors = [
            '.news-feed-item',
            '.news-feed .news-item, .news-feed .article-card',
            '.article-card',
            '.article-list-item',
            'article, .news-item',
            '.article, .post',
            '.card'
          ];
          
          let articleElements: any[] = [];
          
          for (const selector of articleSelectors) {
            const found = $(selector);
            if (found.length > 0) {
              found.each(function(_, el) {
                articleElements.push($(el));
              });
              break;
            }
          }
          
          // If no elements found with our selectors, try a generic approach
          if (articleElements.length === 0) {
            $('a').each((_, el) => {
              const $el = $(el);
              const href = $el.attr('href');
              
              // Look for links that might be news articles
              if (href && href.includes('/news/') && $el.find('h2, h3, .title').length > 0) {
                articleElements.push($el);
              }
            });
          }
          
          logger.info({
            event: 'found_article_elements',
            site: this.name,
            url: regionalUrl,
            count: articleElements.length
          });
          
          // Process each article element
          for (const $article of articleElements) {
            try {
              // Try multiple possible selectors for title
              let title = '';
              let titleElement: any = null;
              
              const titleSelectors = [
                '.news-feed-item__title',
                '.news-item__headline', '.article-card__headline',
                '.card-title', '.article-title',
                'h2', 'h3', '.title', '.headline'
              ];
              
              for (const selector of titleSelectors) {
                const found = $article.find(selector);
                if (found.length > 0) {
                  titleElement = found;
                  title = found.text().trim();
                  break;
                }
              }
              
              // If no title found via selectors, try the article element itself
              if (!title && $article.is('a')) {
                const $heading = $article.find('h2, h3, h4');
                if ($heading.length > 0) {
                  title = $heading.text().trim();
                }
              }
              
              // Get the URL from the article or title element
              let articleUrl = '';
              
              if (titleElement && titleElement.is('a')) {
                articleUrl = titleElement.attr('href') || '';
              } else if (titleElement) {
                const linkElement = titleElement.find('a');
                articleUrl = linkElement.attr('href') || '';
              }
              
              // If still no URL, check the article itself
              if (!articleUrl && $article.is('a')) {
                articleUrl = $article.attr('href') || '';
              } else if (!articleUrl) {
                const linkElement = $article.find('a').first();
                articleUrl = linkElement.attr('href') || '';
              }
              
              // Skip if missing essential data
              if (!title || !articleUrl) {
                continue;
              }
              
              // Build and validate the full URL
              const fullUrl = this.validateAndFixUrl(articleUrl);
              
              // Extract date (format varies on Bisnow)
              const dateSelectors = [
                '.news-feed-item__date',
                '.news-item__date', '.article-card__date',
                '.article-date', '.publish-date',
                '.date', 'time', '.timestamp', '.meta'
              ];
              
              let dateText = '';
              for (const selector of dateSelectors) {
                const dateElement = $article.find(selector);
                if (dateElement.length > 0) {
                  dateText = dateElement.text().trim();
                  break;
                }
              }
              
              // Verify the article by fetching its page to get accurate title and date
              // and to check if it's recent
              const verificationResult = await this.verifyArticle(fullUrl);
              
              // Skip if article is not recent or verification failed
              if (!verificationResult.isRecent || !verificationResult.title) {
                logger.info({
                  event: verificationResult.isRecent ? 'article_verification_failed' : 'article_too_old',
                  url: fullUrl,
                  validatedUrl: this.validateAndFixUrl(fullUrl),
                  originalTitle: title,
                  verifiedTitle: verificationResult.title
                });
                continue;
              }
              
              // FOR TESTING: Change all headlines to X
              const finalTitle = "X";
              const finalDate = verificationResult.date || dateText || new Date().toDateString();
              
              // Final URL validation before creating the article
              const validatedUrl = this.validateAndFixUrl(fullUrl);
              
              // Log the final article data before creating
              logger.info({
                event: 'creating_article',
                originalTitle: title,
                verifiedTitle: verificationResult.title,
                finalTitle: finalTitle,
                originalUrl: fullUrl,
                finalUrl: validatedUrl
              });
              
              // Create the article and add to the list
              allArticles.push(this.createArticle(finalTitle, validatedUrl, finalDate, region));
              
              logger.info({
                event: 'article_added',
                title: finalTitle,
                originalUrl: fullUrl,
                validatedUrl: validatedUrl,
                region
              });
            } catch (articleError) {
              // Log error but continue with other articles
              logger.error({
                event: 'article_parse_error',
                site: this.name,
                url: regionalUrl,
                error: articleError instanceof Error ? articleError.message : String(articleError)
              });
            }
          }
          
          logger.info({
            event: 'region_scrape_complete',
            site: this.name,
            url: regionalUrl,
            articlesFound: articleElements.length
          });
          
        } catch (regionError) {
          // Log error but continue with other regions
          logger.error({
            event: 'region_scrape_error',
            site: this.name,
            url: regionalUrl,
            error: regionError instanceof Error ? regionError.message : String(regionError)
          });
        }
      }
      
      return allArticles;
    } catch (error) {
      // Log and re-throw
      logger.error({
        event: 'scraper_error',
        site: this.name,
        url: this.baseUrl,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
