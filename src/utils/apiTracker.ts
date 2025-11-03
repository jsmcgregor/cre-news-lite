/**
 * API Tracker Service
 * 
 * Tracks API requests made by the application to external sources
 * Stores counts in localStorage for persistence
 */

interface ApiStats {
  totalRequests: number;
  requestsBySource: Record<string, number>;
  requestsByDate: Record<string, number>;
  errors: number;
  lastUpdated: string;
}

const LOCAL_STORAGE_KEY = 'cre-news-api-stats';

class ApiTrackerService {
  private stats: ApiStats;
  
  constructor() {
    this.stats = this.loadStats();
  }
  
  /**
   * Load stats from localStorage or initialize with defaults
   */
  private loadStats(): ApiStats {
    if (typeof window === 'undefined') {
      // Return default stats when running on server
      return this.getDefaultStats();
    }
    
    const savedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStats) {
      try {
        return JSON.parse(savedStats);
      } catch (e) {
        console.error('Error parsing API stats from localStorage:', e);
        return this.getDefaultStats();
      }
    }
    
    return this.getDefaultStats();
  }
  
  /**
   * Get default stats object
   */
  private getDefaultStats(): ApiStats {
    return {
      totalRequests: 0,
      requestsBySource: {},
      requestsByDate: {},
      errors: 0,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * Save stats to localStorage
   */
  private saveStats(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.error('Error saving API stats to localStorage:', e);
    }
  }
  
  /**
   * Track a successful API request
   * @param source The source of the request (e.g., 'Bisnow', 'GlobeSt')
   */
  trackRequest(source: string): void {
    // Increment total requests
    this.stats.totalRequests++;
    
    // Increment requests for this source
    this.stats.requestsBySource[source] = (this.stats.requestsBySource[source] || 0) + 1;
    
    // Track by date (using YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];
    this.stats.requestsByDate[today] = (this.stats.requestsByDate[today] || 0) + 1;
    
    // Update last updated timestamp
    this.stats.lastUpdated = new Date().toISOString();
    
    // Save changes
    this.saveStats();
  }
  
  /**
   * Track an API request error
   * @param source The source of the request (e.g., 'Bisnow', 'GlobeSt')
   */
  trackError(source: string): void {
    // Increment error count
    this.stats.errors++;
    
    // Still count this as a request
    this.trackRequest(source);
  }
  
  /**
   * Get all stats
   */
  getStats(): ApiStats {
    return { ...this.stats };
  }
  
  /**
   * Get error rate as a percentage
   */
  getErrorRate(): number {
    if (this.stats.totalRequests === 0) return 0;
    return (this.stats.errors / this.stats.totalRequests) * 100;
  }
  
  /**
   * Get requests for the last n days
   * @param days Number of days to include
   */
  getRecentRequests(days: number = 7): { labels: string[], values: number[] } {
    const result: { labels: string[], values: number[] } = {
      labels: [],
      values: []
    };
    
    // Generate dates for the last n days
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }
    
    // Get request counts for each date
    result.labels = dates.map(date => date.split('-')[2]); // Just the day part
    result.values = dates.map(date => this.stats.requestsByDate[date] || 0);
    
    return result;
  }
  
  /**
   * Get percentage change in requests compared to previous period
   * @param days Number of days to include
   */
  getRequestsChange(days: number = 7): { percentage: number, isPositive: boolean } {
    const currentPeriod = this.getRecentRequests(days);
    const previousPeriod = this.getPreviousPeriodRequests(days);
    
    const currentTotal = currentPeriod.values.reduce((sum, val) => sum + val, 0);
    const previousTotal = previousPeriod.values.reduce((sum, val) => sum + val, 0);
    
    if (previousTotal === 0) return { percentage: 0, isPositive: true };
    
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    return {
      percentage: Math.abs(Math.round(change)),
      isPositive: change >= 0
    };
  }
  
  /**
   * Get requests for the period before the last n days
   * @param days Number of days in each period
   */
  private getPreviousPeriodRequests(days: number = 7): { labels: string[], values: number[] } {
    const result: { labels: string[], values: number[] } = {
      labels: [],
      values: []
    };
    
    // Generate dates for the period before the last n days
    const dates: string[] = [];
    for (let i = days * 2 - 1; i >= days; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
    }
    
    // Get request counts for each date
    result.labels = dates.map(date => date.split('-')[2]); // Just the day part
    result.values = dates.map(date => this.stats.requestsByDate[date] || 0);
    
    return result;
  }
  
  /**
   * Reset all stats
   */
  resetStats(): void {
    this.stats = this.getDefaultStats();
    this.saveStats();
  }
}

// Export a singleton instance
const apiTracker = new ApiTrackerService();
export default apiTracker;
