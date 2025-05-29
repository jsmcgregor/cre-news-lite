import { EnhancedConnectCREScraper } from './utils/scrapers/enhanced-connectcre';

/**
 * Test script to check if our improved ConnectCRE scraper can fetch real articles
 */
async function testConnectCREScraper() {
  console.log('Testing Enhanced ConnectCRE Scraper...');
  
  const scraper = new EnhancedConnectCREScraper();
  
  try {
    // Test scraping from the main page
    console.log('\nTesting scraping from main page...');
    const mainPageArticles = await scraper['scrapeUrl'](scraper['baseUrl']);
    
    if (mainPageArticles.length > 0) {
      console.log(`Successfully scraped ${mainPageArticles.length} articles from main page!`);
      console.log('\nSample articles:');
      mainPageArticles.slice(0, 3).forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
        console.log(`Published: ${article.publishedDate}`);
        console.log(`Region: ${article.region}`);
      });
    } else {
      console.log('Failed to scrape articles from main page, falling back to realistic articles.');
      
      // Test realistic article generation
      console.log('\nTesting realistic article generation...');
      const realisticArticles = scraper['createRealisticArticles']('National');
      
      console.log(`Generated ${realisticArticles.length} realistic articles.`);
      console.log('\nSample realistic articles:');
      realisticArticles.slice(0, 3).forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
        console.log(`Published: ${article.publishedDate}`);
        console.log(`Region: ${article.region}`);
      });
    }
    
    // Test regional scraping
    console.log('\nTesting regional scraping...');
    const regionalUrl = 'https://www.connectcre.com/new-york-tri-state/';
    const regionalArticles = await scraper['scrapeUrl'](regionalUrl, 'Northeast');
    
    if (regionalArticles.length > 0) {
      console.log(`Successfully scraped ${regionalArticles.length} articles from Northeast region!`);
      console.log('\nSample regional articles:');
      regionalArticles.slice(0, 3).forEach((article, index) => {
        console.log(`\nArticle ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
        console.log(`Published: ${article.publishedDate}`);
        console.log(`Region: ${article.region}`);
      });
    } else {
      console.log('Failed to scrape articles from Northeast region.');
    }
    
    // Test full source scraping
    console.log('\nTesting full source scraping (this may take a while)...');
    const allArticles = await scraper['scrapeSource']();
    
    console.log(`\nFull scraping results: ${allArticles.length} total articles found.`);
    if (allArticles.length > 0) {
      console.log('Scraping successful!');
    } else {
      console.log('Full scraping failed to find any articles.');
    }
    
  } catch (error) {
    console.error('Error testing ConnectCRE scraper:', error);
  }
}

// Run the test
testConnectCREScraper();
