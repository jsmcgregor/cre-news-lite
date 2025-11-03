/**
 * Chatham Financial Market Rates Scraper
 * 
 * Scrapes current market rates from Chatham Financial's website
 * https://www.chathamfinancial.com/technology/us-market-rates
 */

import apiTracker from '../apiTracker';

export interface MarketRate {
  name: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  lastUpdated: string;
}

export class ChathamRatesScraper {
  private readonly name = 'ChathamRates';
  private readonly baseUrl = 'https://www.chathamfinancial.com/technology/us-market-rates';
  private readonly apiUrl = 'https://www.chathamfinancial.com/api/rates/us-market-rates';
  
  /**
   * Scrape current market rates
   */
  public async getRates(): Promise<MarketRate[]> {
    try {
      // Track this API request
      apiTracker.trackRequest(this.name);
      
      // Fetch the rates data from Chatham's API endpoint
      const response = await fetch(this.apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Referer': this.baseUrl
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process the rates data
      const rates: MarketRate[] = [];
      
      // Process US Treasuries
      if (data.treasuries && Array.isArray(data.treasuries)) {
        data.treasuries.forEach((treasury: any) => {
          if (treasury.tenor && treasury.rate !== undefined) {
            rates.push({
              name: `${treasury.tenor} Treasury`,
              value: `${treasury.rate}%`,
              change: treasury.change !== undefined ? `${Math.abs(treasury.change)}` : undefined,
              isPositive: treasury.change >= 0,
              lastUpdated: new Date().toISOString()
            });
          }
        });
      }
      
      // Process SOFR swap rates
      if (data.sofrSwapRates && Array.isArray(data.sofrSwapRates)) {
        data.sofrSwapRates.forEach((swap: any) => {
          if (swap.tenor && swap.rate !== undefined) {
            rates.push({
              name: `${swap.tenor} SOFR Swap`,
              value: `${swap.rate}%`,
              change: swap.change !== undefined ? `${Math.abs(swap.change)}` : undefined,
              isPositive: swap.change >= 0,
              lastUpdated: new Date().toISOString()
            });
          }
        });
      }
      
      // Process other key rates
      if (data.otherRates && Array.isArray(data.otherRates)) {
        data.otherRates.forEach((rate: any) => {
          if (rate.name && rate.rate !== undefined) {
            rates.push({
              name: rate.name,
              value: `${rate.rate}%`,
              change: rate.change !== undefined ? `${Math.abs(rate.change)}` : undefined,
              isPositive: rate.change >= 0,
              lastUpdated: new Date().toISOString()
            });
          }
        });
      }
      
      // If we couldn't get any rates, return fallback data
      if (rates.length === 0) {
        return this.getFallbackRates();
      }
      
      return rates;
    } catch (error) {
      console.error('Error fetching Chatham rates:', error);
      
      // Track API error
      apiTracker.trackError(this.name);
      
      // Return fallback data
      return this.getFallbackRates();
    }
  }
  
  /**
   * Get fallback rates in case of API failure
   */
  private getFallbackRates(): MarketRate[] {
    const now = new Date().toISOString();
    
    return [
      {
        name: '10-Year Treasury',
        value: '4.35%',
        change: '0.02',
        isPositive: true,
        lastUpdated: now
      },
      {
        name: '10-Year SOFR Swap',
        value: '4.42%',
        change: '0.03',
        isPositive: true,
        lastUpdated: now
      },
      {
        name: 'SOFR',
        value: '5.31%',
        change: '0.00',
        isPositive: true,
        lastUpdated: now
      },
      {
        name: 'Prime Rate',
        value: '8.50%',
        change: '0.00',
        isPositive: true,
        lastUpdated: now
      }
    ];
  }
}

// Export a singleton instance
export const chathamRatesScraper = new ChathamRatesScraper();
