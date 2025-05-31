import { Article } from '../../types/article';
import { newsService, ArticleParams, ArticleResponse } from '../services/newsService';

// Legacy function for backward compatibility
export async function getArticles(params: ArticleParams = {}): Promise<Article[]> {
    console.log('Starting to fetch articles...');
    try {
        // Use the service layer to get articles
        const response = await newsService.getArticles(params);
        console.log(`Fetched ${response.articles.length} articles (page ${response.page} of ${response.totalPages})`);
        return response.articles;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

// Import mock articles for static exports
import { mockArticles } from '../mocks/articles';

// New comprehensive function that returns pagination info
export async function getArticlesWithPagination(params: ArticleParams = {}): Promise<ArticleResponse> {
    console.log('Starting to fetch articles with pagination...');
    
    // Use mock data for static exports or when explicitly requested
    if (params.useMockData) {
        console.log('Using mock data for static export');
        
        // Filter mock articles based on region and source
        let filteredArticles = [...mockArticles];
        
        if (params.region && params.region !== 'All') {
            filteredArticles = filteredArticles.filter(article => article.region === params.region);
        }
        
        if (params.source) {
            filteredArticles = filteredArticles.filter(article => article.source === params.source);
        }
        
        // Calculate pagination
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const total = filteredArticles.length;
        const totalPages = Math.ceil(total / pageSize);
        
        // Get articles for current page
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
        
        return {
            articles: paginatedArticles,
            total,
            page,
            pageSize,
            totalPages
        };
    }
    
    try {
        // Use the service layer to get articles with pagination
        return await newsService.getArticles(params);
    } catch (error) {
        console.error('Error fetching articles with pagination:', error);
        // Return a safe default empty response
        return {
            articles: [],
            total: 0,
            page: params.page || 1,
            pageSize: params.pageSize || 10,
            totalPages: 0
        };
    }
}
