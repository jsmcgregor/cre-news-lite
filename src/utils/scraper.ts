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

// New comprehensive function that returns pagination info
export async function getArticlesWithPagination(params: ArticleParams = {}): Promise<ArticleResponse> {
    console.log('Starting to fetch articles with pagination...');
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
