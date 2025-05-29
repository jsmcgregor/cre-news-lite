import { createClient } from 'redis';
import logger from './logger';
import CONFIG from '../config';

// Redis client for caching (lazy initialization)
let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis client (only when needed)
 */
// Track redis connection attempts to avoid infinite retries
let redisConnectionAttempted = false;

async function getRedisClient() {
  // Only try to connect once - if it fails, don't retry during this session
  if (!redisClient && !redisConnectionAttempted) {
    redisConnectionAttempted = true;
    try {
      logger.info({ event: 'redis_init', message: 'Initializing Redis client' });
      redisClient = createClient({ url: CONFIG.REDIS_URL });
      
      // Event handlers
      redisClient.on('error', (err) => {
        logger.error({ event: 'redis_error', error: err.message });
        // On error, set client to null to prevent further usage
        redisClient = null;
      });
      
      redisClient.on('connect', () => {
        logger.info({ event: 'redis_connect', message: 'Connected to Redis' });
      });
      
      // Set connection timeout
      const connectionPromise = redisClient.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Redis connection timeout')), 3000);
      });
      
      await Promise.race([connectionPromise, timeoutPromise]);
    } catch (error) {
      logger.error({ 
        event: 'redis_init_failed', 
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Set client to null on connection failure
      redisClient = null;
      return null;
    }
  }
  return redisClient;
}

/**
 * Cache adapter - provides caching functionality with fallback
 * If Redis fails, it falls back to an in-memory cache
 */
export class CacheAdapter {
  private memoryCache: Map<string, { data: string; expiry: number }> = new Map();
  private readonly prefix: string;
  
  constructor(prefix = 'crenews:') {
    this.prefix = prefix;
  }
  
  /**
   * Get item from cache
   * @param key Cache key
   * @returns Cached value or null if not found
   */
  async get(key: string): Promise<string | null> {
    const fullKey = this.prefix + key;
    
    try {
      // Try Redis first if enabled and not in mock mode
      if (CONFIG.USE_REDIS && !CONFIG.USE_MOCK_DATA) {
        const client = await getRedisClient();
        if (client) {
          const value = await client.get(fullKey);
          return value;
        }
      }
      
      // Fallback to memory cache
      const item = this.memoryCache.get(fullKey);
      if (item && item.expiry > Date.now()) {
        return item.data;
      }
      if (item) {
        // Expired item
        this.memoryCache.delete(fullKey);
      }
      return null;
    } catch (error) {
      logger.error({ 
        event: 'cache_get_error', 
        key: fullKey, 
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }
  
  /**
   * Set item in cache with expiration
   * @param key Cache key
   * @param value Value to cache
   * @param ttlSeconds Time-to-live in seconds
   */
  async set(key: string, value: string, ttlSeconds = CONFIG.SCRAPE_CACHE_DURATION_MINUTES * 60): Promise<void> {
    const fullKey = this.prefix + key;
    
    try {
      // Try Redis first if enabled and not in mock mode
      if (CONFIG.USE_REDIS && !CONFIG.USE_MOCK_DATA) {
        const client = await getRedisClient();
        if (client) {
          await client.setEx(fullKey, ttlSeconds, value);
        }
      }
      
      // Also set in memory cache as fallback
      this.memoryCache.set(fullKey, {
        data: value,
        expiry: Date.now() + (ttlSeconds * 1000)
      });
    } catch (error) {
      logger.error({ 
        event: 'cache_set_error', 
        key: fullKey, 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  }
}

// Export a singleton instance
export const cache = new CacheAdapter();

/**
 * Cache a function's result
 * @param cacheKey Key to use for caching
 * @param fn Function to execute and cache
 * @param ttlSeconds Cache TTL in seconds
 */
export async function withCache<T>(
  cacheKey: string, 
  fn: () => Promise<T>, 
  ttlSeconds = CONFIG.SCRAPE_CACHE_DURATION_MINUTES * 60
): Promise<T> {
  // Try to get from cache first
  const cachedValue = await cache.get(cacheKey);
  
  if (cachedValue) {
    logger.debug({ event: 'cache_hit', key: cacheKey });
    return JSON.parse(cachedValue) as T;
  }
  
  // If not in cache, execute function
  logger.debug({ event: 'cache_miss', key: cacheKey });
  const result = await fn();
  
  // Store in cache
  await cache.set(cacheKey, JSON.stringify(result), ttlSeconds);
  
  return result;
}
