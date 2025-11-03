import { Article } from '../../types/article';

export type ArticleParams = {
  page?: number;
  pageSize?: number;
  region?: string;
  source?: string;
  searchTerm?: string;
  useMockData?: boolean;
};

export type ArticleResponse = {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Service for fetching news articles
 * This abstraction layer isolates the API calls from the UI components
 */
class NewsService {
  private baseUrl: string;
  
  constructor() {
    // This could be configured via environment variables for different environments
    this.baseUrl = '/api/scrape';
  }
  
  /**
   * Get articles with pagination and filtering options
   */
  async getArticles(params: ArticleParams = {}): Promise<ArticleResponse> {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.region && params.region !== 'All') queryParams.append('region', params.region);
      if (params.source) queryParams.append('source', params.source);
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const url = `${this.baseUrl}${queryString}`;
      
      console.log(`NewsService: Fetching articles from ${url}`);
      
      // Implement retry logic (3 attempts)
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await fetch(url, {
            headers: {
              'Accept': 'application/json',
            },
            cache: 'no-store', // Ensures fresh data each time
          });
          
          // Handle empty responses properly
          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              // Try to parse as JSON
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
            } catch (e) {
              // Not JSON, use the raw text
              errorMessage = errorText || `HTTP error! status: ${response.status}`;
            }
            console.error(`NewsService: HTTP error ${response.status}: ${errorMessage}`);
            throw new Error(errorMessage);
          }
          
          return await response.json();
        } catch (error) {
          console.error(`NewsService: Attempt ${attempts} failed:`, error);
          
          // If we've reached max attempts, throw the error
          if (attempts >= maxAttempts) {
            throw error;
          }
          
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts - 1)));
        }
      }
      
      // This should never be reached due to the throw in the loop
      throw new Error('Failed to fetch articles after multiple attempts');
    } catch (error) {
      console.error('NewsService: Error fetching articles:', error);
      throw error;
    }
  }
  
  /**
   * Get article by ID (placeholder for future implementation)
   */
  async getArticleById(id: string): Promise<Article> {
    // This is a placeholder for future implementation
    // In a real app, this would fetch a specific article from the API
    throw new Error('Not implemented yet');
  }
  
  /**
   * Get unique sources from available articles
   * In a real implementation, this would be a separate API endpoint
   */
  async getSources(): Promise<string[]> {
    try {
      const response = await this.getArticles({ pageSize: 100 });
      const sources = response.articles.map(article => article.source);
      // Get unique sources
      return [...new Set(sources)];
    } catch (error) {
      console.error('NewsService: Error fetching sources:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const newsService = new NewsService();

// Also export the class for testing purposes
export default NewsService;
