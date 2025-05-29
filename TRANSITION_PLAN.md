# CRE News Lite: Mock Data to Real Scraping Transition Plan

This document outlines the steps to transition from the current mock data implementation to real website scraping in the CRE News Lite application.

## Current Architecture

Our application currently uses:

1. **Mock Data**: Located in `src/mocks/articles.ts` with realistic commercial real estate news articles
2. **API Route**: In `src/app/api/scrape/route.ts` that serves mock data with pagination and filtering
3. **Service Layer**: In `src/services/newsService.ts` that abstracts API calls from the UI
4. **UI Components**: Pages and components that display and filter the articles

## Transition Steps

### Step 1: Create Scraper Module

- Create a dedicated scraper module in `src/utils/scrapers/` directory
- Implement separate scraper functions for each news source (Bisnow, REBusiness, etc.)
- Example structure:
  ```
  /src/utils/scrapers/
    index.ts          # Export all scrapers
    bisnow.ts         # Bisnow-specific scraping logic
    rebusiness.ts     # REBusiness-specific scraping logic
    ...
  ```

### Step 2: Develop Scraper API Endpoint

- Update the existing API endpoint (`src/app/api/scrape/route.ts`) to:
  - Switch between mock and real data based on environment variable
  - Add error handling for each scraper
  - Maintain the same response format (for pagination compatibility)
  - Implement caching to avoid excessive scraping
  - Add rate limiting to prevent overloading source websites

### Step 3: Implement Server-Side Caching

- Add a caching layer to prevent constant scraping
- Store scraped articles in memory or a lightweight database
- Set a reasonable cache expiry (e.g., 1 hour)
- Implement background refresh to keep data current
- Example file: `src/utils/cache.ts`

### Step 4: Update Configuration

- Create environment configuration in `.env.local`:
  ```
  # Toggle between mock and real data
  NEXT_PUBLIC_USE_MOCK_DATA=false
  
  # Scraping configuration
  SCRAPE_CACHE_DURATION_MINUTES=60
  ENABLE_SOURCES=bisnow,rebusiness
  ```
- Add configuration type in `src/config/index.ts`

### Step 5: Testing Strategy

1. **Unit Tests**: Write tests for individual scrapers
2. **Integration Tests**: Test full scraping pipeline with caching
3. **UI Tests**: Verify UI works with both mock and real data
4. **Error Handling**: Test fallback behavior when scrapers fail

### Step 6: Deployment Changes

- Set up proper CORS policies in production
- Configure scraping frequency and caching in production
- Implement logging and monitoring for scraping issues
- Consider serverless function timeouts and adjust accordingly

### Step 7: Legal Compliance

- Review terms of service for each news source
- Implement appropriate attribution for scraped content
- Consider implementing robots.txt checking
- Add appropriate delays between requests to be respectful

## Implementation Timeline

1. **Week 1**: Develop individual scrapers and test locally
2. **Week 2**: Integrate scrapers with API endpoint and implement caching
3. **Week 3**: Testing and refinement
4. **Week 4**: Production deployment and monitoring

## Fallback Strategy

In case of scraping failures:
1. Log the error
2. Try an alternative scraper if available
3. Fall back to cached data if available
4. Fall back to mock data as a last resort
5. Display appropriate user feedback

## Code Example: Switching Between Mock and Real Data

```typescript
// In src/app/api/scrape/route.ts

import { mockArticles } from '../../../mocks/articles';
import { scrapeAllSources } from '../../../utils/scrapers';
import { config } from '../../../config';

export async function GET(request: Request) {
  try {
    // Parse query parameters for pagination/filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    // ... other params
    
    let articles;
    
    // Use either mock or real data based on configuration
    if (config.useMockData) {
      console.log('Using mock data...');
      articles = mockArticles;
    } else {
      console.log('Scraping real data...');
      articles = await scrapeAllSources();
    }
    
    // Pagination and filtering logic (same for both mock and real data)
    // ...
    
    return NextResponse.json({ 
      articles: paginatedArticles,
      total,
      page,
      pageSize,
      totalPages
    });
  } catch (error) {
    // Error handling
    // ...
  }
}
```

This transition plan ensures a smooth migration from mock data to real scraping while maintaining the same interface for the frontend components.
