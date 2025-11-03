/**
 * API Tracker
 * 
 * Tracks API requests and errors for monitoring and analytics
 */

interface ApiStats {
  totalRequests: number;
  requestsBySource: Record<string, number>;
  errorsBySource: Record<string, number>;
  requestsByDay: Record<string, number>;
}

class ApiTracker {
  private stats: ApiStats;
  private storageKey = 'cre-news-lite-api-stats';

  constructor() {
    this.stats = this.loadStats();
  }

  private loadStats(): ApiStats {
    if (typeof window === 'undefined') {
      // Server-side, return empty stats
      return {
        totalRequests: 0,
        requestsBySource: {},
        errorsBySource: {},
        requestsByDay: {}
      };
    }

    try {
      const savedStats = localStorage.getItem(this.storageKey);
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (error) {
      console.error('Error loading API stats:', error);
    }

    return {
      totalRequests: 0,
      requestsBySource: {},
      errorsBySource: {},
      requestsByDay: {}
    };
  }

  private saveStats(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    } catch (error) {
      console.error('Error saving API stats:', error);
    }
  }

  public trackRequest(source: string): void {
    // Increment total requests
    this.stats.totalRequests++;
    
    // Increment requests for this source
    this.stats.requestsBySource[source] = (this.stats.requestsBySource[source] || 0) + 1;
    
    // Track by day
    const today = new Date().toISOString().split('T')[0];
    this.stats.requestsByDay[today] = (this.stats.requestsByDay[today] || 0) + 1;
    
    this.saveStats();
  }

  public trackError(source: string): void {
    // Increment errors for this source
    this.stats.errorsBySource[source] = (this.stats.errorsBySource[source] || 0) + 1;
    this.saveStats();
  }

  public getStats(): ApiStats {
    return { ...this.stats };
  }

  public getErrorRate(): number {
    const totalErrors = Object.values(this.stats.errorsBySource).reduce((sum, count) => sum + count, 0);
    return this.stats.totalRequests > 0 ? (totalErrors / this.stats.totalRequests) * 100 : 0;
  }

  public getRequestsChange(days: number): number {
    const dates = this.getLastNDays(days);
    
    // Get requests for the first half and second half of the period
    const halfPoint = Math.floor(dates.length / 2);
    const firstHalf = dates.slice(0, halfPoint);
    const secondHalf = dates.slice(halfPoint);
    
    const firstHalfRequests = firstHalf.reduce((sum, date) => sum + (this.stats.requestsByDay[date] || 0), 0);
    const secondHalfRequests = secondHalf.reduce((sum, date) => sum + (this.stats.requestsByDay[date] || 0), 0);
    
    if (firstHalfRequests === 0) return secondHalfRequests > 0 ? 100 : 0;
    
    return ((secondHalfRequests - firstHalfRequests) / firstHalfRequests) * 100;
  }

  public getRecentRequests(days: number): { date: string; count: number }[] {
    const dates = this.getLastNDays(days);
    return dates.map(date => ({
      date,
      count: this.stats.requestsByDay[date] || 0
    }));
  }

  private getLastNDays(n: number): string[] {
    const dates: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      requestsBySource: {},
      errorsBySource: {},
      requestsByDay: {}
    };
    this.saveStats();
  }
}

// Export a singleton instance
export const apiTracker = new ApiTracker();
