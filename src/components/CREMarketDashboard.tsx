/**
 * CRE Market Dashboard
 * 
 * Container component for all CRE market widgets
 */

'use client';

import { useState } from 'react';
import { CREMarketWidget } from './CREMarketWidget';

export const CREMarketDashboard = () => {
  const [activeSector, setActiveSector] = useState<'office' | 'industrial' | 'retail' | 'multifamily'>('office');
  
  const sectors = [
    { id: 'office', name: 'Office', icon: '🏢' },
    { id: 'industrial', name: 'Industrial', icon: '🏭' },
    { id: 'retail', name: 'Retail', icon: '🛍️' },
    { id: 'multifamily', name: 'Multifamily', icon: '🏘️' }
  ] as const;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-white flex items-center">
        <span className="mr-2">📊</span> CRE Market Dashboard
      </h3>
      
      <div className="flex justify-between mb-4">
        {sectors.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setActiveSector(sector.id)}
            className={`px-2 py-1 text-sm rounded-md flex items-center flex-1 mx-0.5 justify-center ${
              activeSector === sector.id
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-1">{sector.icon}</span>
            {sector.name}
          </button>
        ))}
      </div>
      
      <CREMarketWidget sector={activeSector} />
    </div>
  );
};
