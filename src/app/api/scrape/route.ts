import { NextResponse } from 'next/server';

// Configure this route for static export
export const dynamic = 'force-static';
// This will make the route work with static export
import { Article } from '../../../../types/article';
import { mockArticles } from '../../../mocks/articles';
import { getAllArticles } from '../../../utils/scrapers';
import CONFIG from '../../../config';
import logger from '../../../utils/logger';

type ArticleParams = {
  page?: number;
  pageSize?: number;
  region?: string;
  source?: string;
};

/**
 * Get articles with pagination and filtering
 */
async function getArticlesFromSource(params: ArticleParams = {}): Promise<{
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  try {
    // Log whether we're using mock or real data
    logger.info({ 
      event: 'api_fetch_start', 
      useMockData: CONFIG.USE_MOCK_DATA,
      params
    });
    
    // Default pagination values
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    
    // Get articles (either from mock data or real scrapers)
    let allArticles: Article[] = [];
    
    if (CONFIG.USE_MOCK_DATA) {
      logger.info({ event: 'using_mock_data' });
      allArticles = [...mockArticles];
    } else {
      // Get articles from all enabled scrapers
      logger.info({ event: 'using_real_scrapers' });
      allArticles = await getAllArticles();
      
      // Fix for GlobeSt articles with "Unknown" dates
      // This is a temporary fix until the caching issue is resolved
      allArticles = allArticles.map(article => {
        if (article.source === 'GlobeSt' && article.publishedDate === 'Unknown') {
          // Extract date from URL if possible (format: /YYYY/MM/DD/)
          const dateMatch = article.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//i);
          if (dateMatch) {
            const year = dateMatch[1];
            const month = parseInt(dateMatch[2]);
            const day = dateMatch[3];
            
            // Convert month number to name
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthName = monthNames[month - 1];
            
            // Format date like "May 06, 2025"
            article.publishedDate = `${monthName} ${day}, ${year}`;
            logger.info({
              event: 'fixed_globest_date',
              url: article.url,
              date: article.publishedDate
            });
          }
        }
        return article;
      });
    }
    
    // Filter by region if specified
    if (params.region && params.region !== 'all' && params.region !== 'All') {
      const regionToFilter = params.region.toLowerCase();
      allArticles = allArticles.filter(article => 
        article.region.toLowerCase() === regionToFilter
      );
    }
    
    // Filter by source if specified
    if (params.source) {
      allArticles = allArticles.filter(article => 
        article.source.toLowerCase().includes(params.source!.toLowerCase())
      );
    }
    
    // Calculate pagination
    const total = allArticles.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    
    // Get the current page of articles
    const paginatedArticles = allArticles.slice(startIndex, endIndex);
    
    logger.info({ 
      event: 'api_fetch_complete',
      totalArticles: total,
      filteredArticles: paginatedArticles.length,
      page,
      totalPages
    });
    
    return {
      articles: paginatedArticles,
      total,
      page,
      pageSize,
      totalPages
    };
  } catch (error) {
    logger.error({ 
      event: 'api_fetch_error',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function GET(request: Request) {
  console.log('API route: Starting GET request');
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const region = searchParams.get('region') || undefined;
    const source = searchParams.get('source') || undefined;
    
    console.log('API route: Getting articles with params:', { page, pageSize, region, source });
    
    const result = await getArticlesFromSource({
      page,
      pageSize,
      region: region as string | undefined,
      source: source as string | undefined
    });
    
    console.log(`API route: Got ${result.articles.length} articles (page ${result.page} of ${result.totalPages})`);
    
    // Always return a valid response with an articles array, even if empty
    console.log(`API route: Found ${result.articles.length} articles`);
    // No need to return a 404 - empty array is a valid response
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/scrape:', error);
    return NextResponse.json({ 
      error: 'Failed to scrape articles', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
