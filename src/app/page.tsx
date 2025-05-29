'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article, Region } from '../../types/article';
import ArticleCard from '../components/ArticleCard';
import SimplifiedRegionSelector from '../components/SimplifiedRegionSelector';
import { getArticlesWithPagination } from '../utils/scraper';
import Layout from '../components/Layout';

const ARTICLES_PER_PAGE = 12; // Show 12 articles per page

export default function Home() {
  // Core state
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(ARTICLES_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState<Region>('National');
  const [selectedSource, setSelectedSource] = useState<string>('');

  // Load articles with pagination and filters
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    
    try {
      console.log('Page: Fetching articles with params:', { 
        page: currentPage, 
        pageSize,
        region: selectedRegion,
        source: selectedSource || undefined 
      });
      
      // Use the enhanced function that returns pagination data
      const response = await getArticlesWithPagination({
        page: currentPage,
        pageSize,
        region: selectedRegion,
        source: selectedSource || undefined
      });
      
      console.log('Page: Got articles response:', response);
      setArticles(response.articles);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
      
      // Adjust current page if it's beyond the available pages
      if (currentPage > response.totalPages && response.totalPages > 0) {
        setCurrentPage(response.totalPages);
      }
    } catch (error) {
      console.error('Page: Error fetching articles:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load articles');
      setArticles([]);
    } finally {
      console.log('Page: Finished loading');
      setIsLoading(false);
    }
  }, [currentPage, pageSize, selectedRegion, selectedSource]);

  // Load articles when component mounts or dependencies change
  useEffect(() => {
    loadArticles();
  }, [loadArticles, currentPage, selectedRegion, selectedSource]);
  
  // Handle region change
  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    setCurrentPage(1); // Reset to first page when changing region
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-300">Loading articles...</p>
        </div>
      </div>
    );
  }

  // Group articles by region for display
  const articlesByRegion = articles.reduce((acc, article) => {
    const region = article.region || 'Other';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(article);
    return acc;
  }, {} as Record<string, Article[]>);
  
  // Define the region display order
  const regionDisplayOrder = ['National', 'West', 'Southwest', 'Midwest', 'South', 'Northeast'];
  
  // Get all regions that have articles
  const availableRegions = Object.keys(articlesByRegion);
  
  // Sort regions according to the display order, with any remaining regions at the end
  const sortedRegions = [
    // First include regions in our preferred order (if they exist)
    ...regionDisplayOrder.filter(region => availableRegions.includes(region)),
    // Then include any other regions alphabetically
    ...availableRegions.filter(region => !regionDisplayOrder.includes(region)).sort()
  ];

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              CRE News Lite
            </h1>
            <p className="text-gray-400 text-lg">
              Latest commercial real estate news from top industry sources
            </p>
          </header>
          <div className="flex items-center justify-center py-12 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg text-red-400 font-semibold mb-2">Error loading articles</p>
              <p className="text-gray-300">{errorMessage}</p>
              <button 
                className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors" 
                onClick={loadArticles}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Handle empty state
  if (!articles.length) {
    return (
      <div className="min-h-screen bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center py-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-3">
              CRE News Lite
            </h1>
            <p className="text-gray-400 text-lg">
              Latest commercial real estate news from top industry sources
            </p>
          </header>
          <div className="flex items-center justify-center py-12 bg-gray-800 rounded-lg shadow-md border border-gray-700 p-8">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-lg text-gray-300 font-semibold mb-2">No Articles Found</p>
              <p className="text-gray-400">There are currently no articles matching your filter criteria.</p>
              <button 
                className="mt-6 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                onClick={() => handleRegionChange('National')}
              >
                View National Articles
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <header className="mb-8 text-center py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-3">
          CRE News Lite
        </h1>
        <p className="text-gray-400 text-lg">
          Latest commercial real estate news from top industry sources
        </p>
      </header>
        
        {/* Filter and Search Bar */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
              <SimplifiedRegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
              />
              
              {/* Source Filter */}
              <div>
                <select
                  value={selectedSource}
                  onChange={(e) => {
                    setSelectedSource(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                >
                  <option value="">All Sources</option>
                  <option value="bisnow">Bisnow</option>
                  <option value="globest">GlobeSt</option>
                </select>
              </div>
            </div>
            
            {/* Search Box */}
            <div className="w-full sm:w-64 lg:w-72">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2.5 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-cyan-500 focus:border-cyan-500" 
                  placeholder="Search articles..."
                  // In a real app, this would trigger a search API call
                />
              </div>
            </div>
          </div>
          
          {/* Results Summary */}
          <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Showing {articles.length} of {totalItems} articles
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                // In a real app, this would change the sort order
              >
                <option value="date">Newest First</option>
                <option value="source">Source</option>
                <option value="region">Region</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Articles by Region */}
        <div className="space-y-10">
          {sortedRegions.map((region) => {
            const regionArticles = articlesByRegion[region];
            if (!regionArticles?.length) return null;
            
            return (
              <section key={region} className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-200 flex items-center">
                  <span 
                    className="inline-block w-3 h-3 rounded-full bg-cyan-500 mr-3"
                    aria-hidden="true"
                  ></span>
                  {region}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regionArticles.map((article) => (
                    <ArticleCard key={article.url} article={article} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-10 mb-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-gray-600 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </button>
            
            <span className="px-3 py-2 rounded-md bg-cyan-900 text-cyan-200 border border-cyan-800 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 hover:border-gray-600 transition-colors flex items-center"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
    </Layout>
  );
}
