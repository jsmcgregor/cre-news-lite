/**
 * CRE Market Widget
 * 
 * Displays quarterly market data for Office, Industrial, Retail, and Multifamily sectors
 */

'use client';

import { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

interface CREMarketWidgetProps {
  sector: 'office' | 'industrial' | 'retail' | 'multifamily';
}

// Static market data for all sectors
const MARKET_DATA = {
  office: {
    sector: 'Office',
    country: 'U.S.',
    currentQuarter: 'Q1 - 25',
    priorQuarter: 'Q4 - 24',
    metrics: [
      { name: 'Inventory', subtitle: '(sf in 1000s)', currentValue: '3,620,577', priorValue: '3,614,707', isPositive: true },
      { name: 'Completed Construction', subtitle: '(sf in 1000s)', currentValue: '5,870', priorValue: '4,116', isPositive: true },
      { name: 'Absorption', subtitle: '(sf in 1000s)', currentValue: '16,809', priorValue: '15,362', isPositive: true },
      { name: 'Vacancy Rate', subtitle: '', currentValue: '14.1%', priorValue: '14.5%', isPositive: true },
      { name: 'Gross Asking Rent', subtitle: '($ per sf)', currentValue: '28.18', priorValue: '28.14', isPositive: true }
    ]
  },
  industrial: {
    sector: 'Industrial',
    country: 'U.S.',
    currentQuarter: 'Q1 - 25',
    priorQuarter: 'Q4 - 24',
    metrics: [
      { name: 'Inventory', subtitle: '(sf in 1000s)', currentValue: '16,420,577', priorValue: '16,380,707', isPositive: true },
      { name: 'Completed Construction', subtitle: '(sf in 1000s)', currentValue: '78,870', priorValue: '72,116', isPositive: true },
      { name: 'Absorption', subtitle: '(sf in 1000s)', currentValue: '56,809', priorValue: '48,362', isPositive: true },
      { name: 'Vacancy Rate', subtitle: '', currentValue: '4.2%', priorValue: '4.1%', isPositive: false },
      { name: 'Gross Asking Rent', subtitle: '($ per sf)', currentValue: '9.85', priorValue: '9.70', isPositive: true }
    ]
  },
  retail: {
    sector: 'Retail',
    country: 'U.S.',
    currentQuarter: 'Q1 - 25',
    priorQuarter: 'Q4 - 24',
    metrics: [
      { name: 'Inventory', subtitle: '(sf in 1000s)', currentValue: '5,120,577', priorValue: '5,114,707', isPositive: true },
      { name: 'Completed Construction', subtitle: '(sf in 1000s)', currentValue: '12,870', priorValue: '10,116', isPositive: true },
      { name: 'Absorption', subtitle: '(sf in 1000s)', currentValue: '26,809', priorValue: '23,362', isPositive: true },
      { name: 'Vacancy Rate', subtitle: '', currentValue: '5.1%', priorValue: '5.3%', isPositive: true },
      { name: 'Gross Asking Rent', subtitle: '($ per sf)', currentValue: '24.15', priorValue: '23.70', isPositive: true }
    ]
  },
  multifamily: {
    sector: 'Multifamily',
    country: 'U.S.',
    currentQuarter: 'Q1 - 25',
    priorQuarter: 'Q4 - 24',
    metrics: [
      { name: 'Inventory', subtitle: '(units in 1000s)', currentValue: '18,620,577', priorValue: '18,514,707', isPositive: true },
      { name: 'Completed Construction', subtitle: '(units in 1000s)', currentValue: '85,870', priorValue: '78,116', isPositive: true },
      { name: 'Absorption', subtitle: '(units in 1000s)', currentValue: '42,500', priorValue: '34,200', isPositive: true },
      { name: 'Vacancy Rate', subtitle: '', currentValue: '5.8%', priorValue: '5.5%', isPositive: false },
      { name: 'Gross Asking Rent', subtitle: '($ per unit)', currentValue: '1,842', priorValue: '1,814', isPositive: true }
    ]
  }
};

export const CREMarketWidget = ({ sector }: CREMarketWidgetProps) => {
  // Use static data directly instead of fetching from API
  const marketData = MARKET_DATA[sector];

  // Format sector name for display
  const formatSectorName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get icon based on sector
  const getSectorIcon = (sectorName: string) => {
    switch (sectorName.toLowerCase()) {
      case 'office':
        return '🏢';
      case 'industrial':
        return '🏭';
      case 'retail':
        return '🛍️';
      case 'multifamily':
        return '🏘️';
      default:
        return '📊';
    }
  };

  // No loading or error states needed with static data

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
        <span className="mr-2">{getSectorIcon(sector)}</span> {marketData.country} {formatSectorName(sector)} Market
      </h3>
      <div className="text-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2"></th>
              <th className="text-right py-2 px-2">Current Qtr.<br/><span className="text-xs font-normal">({marketData.currentQuarter})</span></th>
              <th className="text-right py-2 px-2">Prior Qtr.<br/><span className="text-xs font-normal">({marketData.priorQuarter})</span></th>
            </tr>
          </thead>
          <tbody>
            {marketData.metrics.map((metric, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}>
                <td className="py-2 font-medium text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    {metric.isPositive !== undefined && (
                      <span className="mr-2">
                        {metric.isPositive ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    )}
                    <div>
                      {metric.name}
                      {metric.subtitle && <div className="text-xs text-gray-500">{metric.subtitle}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-2 text-right px-2">{metric.currentValue}</td>
                <td className="py-2 text-right px-2">{metric.priorValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-xs text-gray-500 mt-3 text-right">
          Source: CRE Market Research
        </div>
      </div>
    </div>
  );
};
