/**
 * CRE Market Data Scraper
 * 
 * Provides quarterly market data for Office, Industrial, Retail, and Multi-housing sectors
 */

import { apiTracker } from '../api-tracker';

export interface MarketData {
  sector: string;
  metrics: {
    name: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    unit?: string;
  }[];
  quarter: string;
  year: number;
}

class CREMarketDataScraper {
  private name = 'CREMarketData';

  /**
   * Get the latest quarterly market data for all sectors
   */
  public async getMarketData(): Promise<MarketData[]> {
    try {
      apiTracker.trackRequest(this.name);
      
      // In a production environment, this would fetch data from an API or scrape a website
      // For now, we'll return static data representing Q2 2025
      return this.getStaticMarketData();
    } catch (error) {
      apiTracker.trackError(this.name);
      console.error('Error fetching CRE market data:', error);
      throw error;
    }
  }

  /**
   * Get market data for a specific sector
   */
  public async getSectorData(sector: 'office' | 'industrial' | 'retail' | 'multifamily'): Promise<MarketData> {
    const allData = await this.getMarketData();
    return allData.find(data => data.sector.toLowerCase() === sector.toLowerCase()) as MarketData;
  }

  /**
   * Static market data for Q2 2025
   */
  private getStaticMarketData(): MarketData[] {
    const currentQuarter = 'Q2';
    const currentYear = 2025;
    
    return [
      {
        sector: 'Office',
        quarter: currentQuarter,
        year: currentYear,
        metrics: [
          { name: 'Vacancy Rate', value: '17.8%', change: '0.3', isPositive: false, unit: '%' },
          { name: 'Absorption', value: '-5.2', change: '1.8', isPositive: true, unit: 'M sq ft' },
          { name: 'Asking Rent', value: '$36.42', change: '0.8', isPositive: true, unit: 'sq ft/yr' },
          { name: 'Under Construction', value: '42.1', unit: 'M sq ft' },
          { name: 'Cap Rate', value: '6.8%', change: '0.2', isPositive: false, unit: '%' }
        ]
      },
      {
        sector: 'Industrial',
        quarter: currentQuarter,
        year: currentYear,
        metrics: [
          { name: 'Vacancy Rate', value: '4.2%', change: '0.1', isPositive: false, unit: '%' },
          { name: 'Absorption', value: '78.3', change: '12.5', isPositive: true, unit: 'M sq ft' },
          { name: 'Asking Rent', value: '$9.85', change: '0.15', isPositive: true, unit: 'sq ft/yr' },
          { name: 'Under Construction', value: '185.6', unit: 'M sq ft' },
          { name: 'Cap Rate', value: '5.2%', change: '0.1', isPositive: true, unit: '%' }
        ]
      },
      {
        sector: 'Retail',
        quarter: currentQuarter,
        year: currentYear,
        metrics: [
          { name: 'Vacancy Rate', value: '5.1%', change: '0.2', isPositive: true, unit: '%' },
          { name: 'Absorption', value: '12.8', change: '3.2', isPositive: true, unit: 'M sq ft' },
          { name: 'Asking Rent', value: '$24.15', change: '0.45', isPositive: true, unit: 'sq ft/yr' },
          { name: 'Under Construction', value: '28.3', unit: 'M sq ft' },
          { name: 'Cap Rate', value: '6.1%', change: '0.1', isPositive: true, unit: '%' }
        ]
      },
      {
        sector: 'Multifamily',
        quarter: currentQuarter,
        year: currentYear,
        metrics: [
          { name: 'Vacancy Rate', value: '5.8%', change: '0.3', isPositive: false, unit: '%' },
          { name: 'Absorption', value: '42.5', change: '8.3', isPositive: true, unit: 'K units' },
          { name: 'Effective Rent', value: '$1,842', change: '28', isPositive: true, unit: '/unit' },
          { name: 'Under Construction', value: '512.6', unit: 'K units' },
          { name: 'Cap Rate', value: '4.9%', change: '0.2', isPositive: false, unit: '%' }
        ]
      }
    ];
  }
}

export const creMarketData = new CREMarketDataScraper();
