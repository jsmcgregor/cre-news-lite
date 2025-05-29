import winston from 'winston';
import CONFIG from '../config';

/**
 * Winston logger configuration for structured logging
 * Outputs JSON in production and formatted text in development
 */
const logger = winston.createLogger({
  level: CONFIG.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'cre-news-lite' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' 
        ? winston.format.json()
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
    })
  ]
});

export default logger;

/**
 * Log scraper operations with consistent format
 */
export const scraperLogger = {
  start: (siteName: string, url: string) => {
    logger.info({
      event: 'scrape_start',
      site: siteName,
      url
    });
  },
  
  success: (siteName: string, url: string, duration: number, itemsCount: number) => {
    logger.info({
      event: 'scrape_success',
      site: siteName,
      url,
      duration_ms: duration,
      items: itemsCount
    });
  },
  
  error: (siteName: string, url: string, error: Error) => {
    logger.error({
      event: 'scrape_failure',
      site: siteName,
      url,
      error: error.message,
      stack: error.stack
    });
  },
  
  cacheHit: (siteName: string, url: string) => {
    logger.debug({
      event: 'scrape_cache_hit',
      site: siteName,
      url
    });
  },
  
  cacheMiss: (siteName: string, url: string) => {
    logger.debug({
      event: 'scrape_cache_miss',
      site: siteName,
      url
    });
  },
  
  rateLimit: (siteName: string, delay: number) => {
    logger.debug({
      event: 'rate_limit_delay',
      site: siteName,
      delay_ms: delay
    });
  }
};
