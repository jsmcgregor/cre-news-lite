'use client';

import { useState, useEffect } from 'react';
import CONFIG from '../../config';
import AdminDashboard from '../../components/AdminDashboard';
import Layout from '../../components/Layout';

interface ScraperStatus {
  name: string;
  enabled: boolean;
  lastRun?: string;
  articleCount?: number;
  status: 'active' | 'disabled' | 'error';
  error?: string;
}

export default function AdminPage() {
  const [scrapers, setScrapers] = useState<ScraperStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch scraper statuses
  useEffect(() => {
    async function fetchScraperStatus() {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call to get actual scraper statuses
        // For now, we'll create mock data based on the enabled sources in config
        const enabledSources = CONFIG.ENABLE_SOURCES;
        
        // Create mock scraper statuses
        const mockScrapers: ScraperStatus[] = [
          {
            name: 'Bisnow',
            enabled: enabledSources.includes('bisnow'),
            lastRun: new Date().toISOString(),
            articleCount: 42,
            status: enabledSources.includes('bisnow') ? 'active' : 'disabled'
          },
          {
            name: 'GlobeSt',
            enabled: enabledSources.includes('globest'),
            lastRun: new Date().toISOString(),
            articleCount: 38,
            status: enabledSources.includes('globest') ? 'active' : 'disabled'
          },
          {
            name: 'ConnectCRE',
            enabled: enabledSources.includes('connectcre'),
            lastRun: enabledSources.includes('connectcre') ? new Date().toISOString() : undefined,
            articleCount: enabledSources.includes('connectcre') ? 27 : 0,
            status: enabledSources.includes('connectcre') ? 'active' : 'disabled'
          },
          {
            name: 'REBusiness',
            enabled: false,
            status: 'disabled'
          },
          {
            name: 'CommercialSearch',
            enabled: false,
            status: 'disabled'
          }
        ];
        
        setScrapers(mockScrapers);
      } catch (err) {
        setError('Failed to load scraper status. Please try again.');
        console.error('Error fetching scraper status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchScraperStatus();
  }, []);

  // Handle refreshing scrapers (simulated)
  const handleRefreshScrapers = async () => {
    setIsRefreshing(true);
    setSuccessMessage(null);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last run time for enabled scrapers
      setScrapers(prev => 
        prev.map(scraper => 
          scraper.enabled 
            ? { ...scraper, lastRun: new Date().toISOString() } 
            : scraper
        )
      );
      
      setSuccessMessage('Scrapers refreshed successfully!');
    } catch (err) {
      setError('Failed to refresh scrapers. Please try again.');
      console.error('Error refreshing scrapers:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle toggling a scraper's enabled status (simulated)
  const handleToggleScraper = async (scraperName: string) => {
    setSuccessMessage(null);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update scraper status
      setScrapers(prev => 
        prev.map(scraper => 
          scraper.name === scraperName
            ? { 
                ...scraper, 
                enabled: !scraper.enabled,
                status: !scraper.enabled ? 'active' : 'disabled'
              } 
            : scraper
        )
      );
      
      setSuccessMessage(`${scraperName} scraper ${scrapers.find(s => s.name === scraperName)?.enabled ? 'disabled' : 'enabled'} successfully!`);
    } catch (err) {
      setError(`Failed to update ${scraperName} scraper status. Please try again.`);
      console.error(`Error toggling scraper ${scraperName}:`, err);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              CRE News Lite Admin
            </h1>
            <p className="text-gray-400 mt-2">
              Manage scrapers and monitor system status
            </p>
          </div>
        </div>
      </header>
        
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}
        
        {/* Dashboard */}
        <div className="mb-8">
          <AdminDashboard />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Scraper Management */}
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-200">Scraper Management</h2>
              <button
                onClick={handleRefreshScrapers}
                disabled={isRefreshing}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isRefreshing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh All
                  </>
                )}
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                  <p className="text-gray-400">Loading scrapers...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-gray-400 font-medium">Scraper</th>
                      <th className="pb-3 text-gray-400 font-medium">Status</th>
                      <th className="pb-3 text-gray-400 font-medium">Last Run</th>
                      <th className="pb-3 text-gray-400 font-medium">Articles</th>
                      <th className="pb-3 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scrapers.map((scraper) => (
                      <tr key={scraper.name} className="border-b border-gray-700/50">
                        <td className="py-4 text-gray-200 font-medium">{scraper.name}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            scraper.status === 'active' 
                              ? 'bg-green-900/30 text-green-400 border border-green-800' 
                              : scraper.status === 'error'
                              ? 'bg-red-900/30 text-red-400 border border-red-800'
                              : 'bg-gray-700/30 text-gray-400 border border-gray-600'
                          }`}>
                            {scraper.status === 'active' ? 'Active' : scraper.status === 'error' ? 'Error' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-300">
                          {scraper.lastRun 
                            ? new Date(scraper.lastRun).toLocaleString() 
                            : <span className="text-gray-500">Never</span>}
                        </td>
                        <td className="py-4 text-gray-300">
                          {scraper.articleCount !== undefined 
                            ? scraper.articleCount 
                            : <span className="text-gray-500">-</span>}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => handleToggleScraper(scraper.name)}
                            className={`px-3 py-1 rounded-md text-sm ${
                              scraper.enabled
                                ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-800/50'
                                : 'bg-green-900/20 text-green-400 hover:bg-green-900/40 border border-green-800/50'
                            } transition-colors`}
                          >
                            {scraper.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* System Status */}
          <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-6">System Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Cache Status</h3>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-200 font-medium">Operational</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Cache duration: {CONFIG.SCRAPE_CACHE_DURATION_MINUTES} minutes
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-gray-400 text-sm font-medium mb-2">API Status</h3>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-gray-200 font-medium">Operational</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Rate limit: {CONFIG.RATE_LIMIT_DEFAULT} req/min
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Mode</h3>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full ${CONFIG.USE_MOCK_DATA ? 'bg-yellow-500' : 'bg-blue-500'} mr-2`}></span>
                  <span className="text-gray-200 font-medium">
                    {CONFIG.USE_MOCK_DATA ? 'Using Mock Data' : 'Using Live Scrapers'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {CONFIG.USE_MOCK_DATA 
                    ? 'Mock data is enabled for testing' 
                    : 'Live scraping from sources'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
    </Layout>
  );
}
