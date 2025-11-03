/**
 * Market Rates Widget
 * 
 * Displays current market rates in a sidebar widget
 */

'use client';

import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

interface MarketRate {
  name: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

// Static market rate data (empty: rely on API)
const MARKET_RATES: MarketRate[] = [];

export const MarketRatesWidget = () => {
  const DISABLE_MARKET_RATES = true;
  if (DISABLE_MARKET_RATES) return null;
  // Use static data instead of fetching from API
  const [rates, setRates] = useState<MarketRate[]>(MARKET_RATES);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('/api/market-rates', { cache: 'no-store' });
        if (!res.ok) return;
        const data: Array<{ name: string; value: string }> = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: MarketRate[] = data.map((r) => ({ name: r.name, value: r.value }));
          setRates(mapped);
        }
      } catch (_) {
        // ignore and keep static fallback
      }
    };
    fetchRates();
  }, []);

  // Display all rates (API-driven)
  const displayRates = rates;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
        <span className="mr-2">📈</span> Market Rates
      </h3>
      
      <div className="space-y-2">
        {displayRates.length === 0 && (
          <div className="text-sm text-gray-400">Loading market rates…</div>
        )}
        {displayRates.map((rate) => (
          <div key={rate.name} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
            <span className="text-sm font-medium text-gray-300">{rate.name}</span>
            <div className="flex items-center">
              <span className="font-semibold text-white mr-2">{rate.value}</span>
              {rate.change && (
                <span className={`text-xs flex items-center ${
                  rate.change === '0.00' ? 'text-gray-500' : 
                  rate.isPositive ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                }`}>
                  {rate.isPositive ? (
                    rate.change === '0.00' ? (
                      <ArrowRightIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    )
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  {rate.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 mt-3 text-right">
        Source: Market Data as of {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default MarketRatesWidget;
