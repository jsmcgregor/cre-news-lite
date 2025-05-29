/**
 * Monitoring utilities for scraper health and performance
 */
import logger from './logger';

/**
 * Scraper metrics
 */
interface ScraperMetrics {
  name: string;
  successCount: number;
  errorCount: number;
  lastRunTime: number | null;
  averageRunTime: number;
  totalArticles: number;
  lastRunDate: Date | null;
  status: 'healthy' | 'warning' | 'error';
}

/**
 * Simple in-memory metrics store
 */
class ScraperMonitor {
  private metrics: Map<string, ScraperMetrics> = new Map();
  
  /**
   * Record a successful scraper run
   */
  recordSuccess(name: string, runTime: number, articlesCount: number): void {
    const existing = this.getMetrics(name);
    
    const newMetrics: ScraperMetrics = {
      name,
      successCount: existing.successCount + 1,
      errorCount: existing.errorCount,
      lastRunTime: runTime,
      averageRunTime: this.calculateAverage(existing.averageRunTime, runTime, existing.successCount),
      totalArticles: existing.totalArticles + articlesCount,
      lastRunDate: new Date(),
      status: 'healthy'
    };
    
    // Update status based on run time (warning if unusually slow)
    if (runTime > existing.averageRunTime * 2 && existing.successCount > 5) {
      newMetrics.status = 'warning';
      logger.warn({
        event: 'scraper_performance_warning',
        scraper: name,
        runTime,
        averageRunTime: existing.averageRunTime
      });
    }
    
    this.metrics.set(name, newMetrics);
    
    // Log the metrics
    logger.info({
      event: 'scraper_metrics_update',
      metrics: { ...newMetrics, lastRunDate: newMetrics.lastRunDate?.toISOString() }
    });
  }
  
  /**
   * Record a failed scraper run
   */
  recordError(name: string, error: Error): void {
    const existing = this.getMetrics(name);
    
    const newMetrics: ScraperMetrics = {
      ...existing,
      errorCount: existing.errorCount + 1,
      lastRunDate: new Date(),
      status: 'error'
    };
    
    this.metrics.set(name, newMetrics);
    
    // Log the metrics
    logger.error({
      event: 'scraper_error_recorded',
      scraper: name,
      error: error.message,
      metrics: { ...newMetrics, lastRunDate: newMetrics.lastRunDate?.toISOString() }
    });
  }
  
  /**
   * Get metrics for a scraper
   */
  getMetrics(name: string): ScraperMetrics {
    if (!this.metrics.has(name)) {
      // Initialize default metrics
      this.metrics.set(name, {
        name,
        successCount: 0,
        errorCount: 0,
        lastRunTime: null,
        averageRunTime: 0,
        totalArticles: 0,
        lastRunDate: null,
        status: 'healthy'
      });
    }
    
    return this.metrics.get(name)!;
  }
  
  /**
   * Get all scraper metrics
   */
  getAllMetrics(): ScraperMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  /**
   * Get health status summary
   */
  getHealthSummary(): { healthy: number; warning: number; error: number } {
    const metrics = this.getAllMetrics();
    return {
      healthy: metrics.filter(m => m.status === 'healthy').length,
      warning: metrics.filter(m => m.status === 'warning').length,
      error: metrics.filter(m => m.status === 'error').length
    };
  }
  
  /**
   * Calculate running average
   */
  private calculateAverage(currentAvg: number, newValue: number, n: number): number {
    if (n === 0) return newValue;
    return (currentAvg * n + newValue) / (n + 1);
  }
}

// Export singleton instance
export const scraperMonitor = new ScraperMonitor();

/**
 * Monitor a scraper function execution
 * Wraps a function with monitoring
 */
export async function withMonitoring<T>(
  scraperName: string,
  fn: () => Promise<T[]>
): Promise<T[]> {
  const startTime = Date.now();
  
  try {
    const results = await fn();
    const runtime = Date.now() - startTime;
    
    // Record success
    scraperMonitor.recordSuccess(scraperName, runtime, results.length);
    
    return results;
  } catch (error) {
    // Record error
    scraperMonitor.recordError(
      scraperName, 
      error instanceof Error ? error : new Error(String(error))
    );
    
    // Re-throw for upstream handling
    throw error;
  }
}
