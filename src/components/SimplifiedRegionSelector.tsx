'use client';

import { Region } from '../../types/article';

interface SimplifiedRegionSelectorProps {
    selectedRegion: Region;
    onRegionChange: (region: Region) => void;
}

// List of major regions to include in the dropdown
const majorRegions = ['National', 'West', 'Southwest', 'Midwest', 'South', 'Northeast'];

// Default to National if no region is selected
const DEFAULT_REGION = 'National';

export default function SimplifiedRegionSelector({ selectedRegion, onRegionChange }: SimplifiedRegionSelectorProps) {
    // Ensure we always have a valid region selected
    const currentRegion = majorRegions.includes(selectedRegion) ? selectedRegion : DEFAULT_REGION;
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="region-select" className="text-gray-300 font-medium mb-2 sm:mb-0">
                Filter by Region:
            </label>
            <select
                id="region-select"
                value={currentRegion}
                onChange={(e) => onRegionChange(e.target.value as Region)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-gray-600 transition-colors"
            >
                {majorRegions.map(region => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </select>
        </div>
    );
}
