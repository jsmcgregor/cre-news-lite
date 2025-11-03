'use client';

import React, { useState, useEffect } from 'react';
import apiTracker from '../utils/apiTracker';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

interface ChartData {
  labels: string[];
  values: number[];
}

const StatsCard: React.FC<StatCardProps> = ({ title, value, change, isPositive = true, icon }) => {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-xl font-bold text-gray-200">{value}</h3>
          {change && (
            <p className={`text-xs mt-1 flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
              {change}
            </p>
          )}
        </div>
        <div className="p-2 bg-gray-800 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{ data: ChartData }> = ({ data }) => {
  // Find the maximum value to normalize bar heights
  const maxValue = Math.max(...data.values);
  
  return (
    <div className="w-full">
      <div className="flex items-end h-32 space-x-2">
        {data.values.map((value, index) => {
          // Calculate height percentage based on the max value
          const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-cyan-600 rounded-t"
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <span className="text-xs text-gray-400 mt-1">{data.labels[index]}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-xs text-gray-400">
        Last 7 days
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  // State for API stats
  const [apiStats, setApiStats] = useState({
    totalRequests: 0,
    errorRate: 0,
    requestsChange: { percentage: 0, isPositive: true },
    activeSources: 0,
    requestsByDay: { labels: [] as string[], values: [] as number[] },
    sourceDistribution: { labels: [] as string[], values: [] as number[] }
  });

  // Load API stats on component mount
  useEffect(() => {
    // Function to update stats
    const updateStats = () => {
      if (typeof window === 'undefined') return;
      
      const stats = apiTracker.getStats();
      const errorRate = apiTracker.getErrorRate();
      const requestsChange = apiTracker.getRequestsChange(7);
      const requestsByDay = apiTracker.getRecentRequests(7);
      
      // Calculate active sources
      const sourcesWithRequests = Object.keys(stats.requestsBySource).length;
      
      // Calculate source distribution
      const sourceLabels = Object.keys(stats.requestsBySource);
      const sourceValues: number[] = [];
      
      if (stats.totalRequests > 0) {
        sourceLabels.forEach(source => {
          const percentage = Math.round((stats.requestsBySource[source] / stats.totalRequests) * 100);
          sourceValues.push(percentage);
        });
      }
      
      setApiStats({
        totalRequests: stats.totalRequests,
        errorRate: Number(errorRate.toFixed(1)),
        requestsChange,
        activeSources: sourcesWithRequests,
        requestsByDay,
        sourceDistribution: {
          labels: sourceLabels,
          values: sourceValues
        }
      });
    };
    
    // Update stats immediately and then every 5 seconds
    updateStats();
    const interval = setInterval(updateStats, 5000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);
  
  // Stats cards data
  const stats = [
    {
      title: 'Total Articles',
      value: '1,248', // This is still mock data as we don't track article count
      change: '12% increase',
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      )
    },
    {
      title: 'Active Sources',
      value: apiStats.activeSources.toString(),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'API Requests',
      value: apiStats.totalRequests.toLocaleString(),
      change: apiStats.requestsChange.percentage > 0 ? `${apiStats.requestsChange.percentage}% ${apiStats.requestsChange.isPositive ? 'increase' : 'decrease'}` : undefined,
      isPositive: apiStats.requestsChange.isPositive,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'Error Rate',
      value: `${apiStats.errorRate}%`,
      change: apiStats.requestsChange.percentage > 0 ? '0.3% decrease' : undefined,
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  // Use real API request data for the chart
  const articlesByDay: ChartData = apiStats.requestsByDay;
  
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Articles by Day</h3>
          <BarChart data={articlesByDay} />
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Articles by Source</h3>
          <div className="flex items-center justify-center h-32">
            {/* Simple pie chart visualization */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-cyan-600" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 100%, 100% 100%, 100% 50%)' }}></div>
              <div className="absolute inset-0 rounded-full bg-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 35%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-800"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            {apiStats.sourceDistribution.labels.map((label, index) => (
              <div key={label} className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-cyan-600' : index === 1 ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                <span className="text-sm text-gray-400">{label} ({apiStats.sourceDistribution.values[index]}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
