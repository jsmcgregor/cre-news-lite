'use client';

import { Region } from '../../types/article';
import { regionGroups } from '../utils/regions';

interface RegionSelectorProps {
    regions: Region[];
    selectedRegion: Region | 'all';
    onRegionChange: (region: Region | 'all') => void;
}

export default function RegionSelector({ regions, selectedRegion, onRegionChange }: RegionSelectorProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label htmlFor="region-select" className="text-gray-300 font-medium mb-2 sm:mb-0">
                Filter by Region:
            </label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value as Region | 'all')}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-gray-600 transition-colors"
            >
                <option value="all">All Regions</option>
                <option value="National">National</option>
                
                {/* Major Regions */}
                <optgroup label="Major Regions">
                    {regionGroups.map((group) => (
                        <option key={group.name} value={group.name}>
                            {group.name}
                        </option>
                    ))}
                </optgroup>

                {/* Note: Subregions feature removed due to type compatibility */}

                {/* Individual States */}
                <optgroup label="Individual States">
                    {regionGroups.flatMap(group => group.states)
                        .sort()
                        .map(state => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                </optgroup>
            </select>
        </div>
    );
}
