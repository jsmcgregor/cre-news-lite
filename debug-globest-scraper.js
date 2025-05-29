// Debug script to test the GlobeSt scraper's date extraction in isolation
const { EnhancedGlobeStScraper } = require('./dist/utils/scrapers/enhanced-globest');
const logger = require('./dist/utils/logger').default;

async function debugGlobeStScraper() {
  try {
    console.log('Starting GlobeSt scraper debug...');
    
    // Create an instance of the GlobeSt scraper
    const scraper = new EnhancedGlobeStScraper();
    
    // Get articles directly from the scraper
    console.log('Calling scraper.getArticles()...');
    const articles = await scraper.getArticles();
    
    console.log(`Retrieved ${articles.length} articles from GlobeSt`);
    
    // Log the first 5 articles with their dates
    console.log('\nSample articles:');
    articles.slice(0, 5).forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Date: ${article.publishedDate}`);
      console.log(`Region: ${article.region}`);
      console.log(`URL: ${article.url}`);
    });
    
    // Check if any articles have "Unknown" dates
    const unknownDates = articles.filter(article => article.publishedDate === 'Unknown');
    console.log(`\nArticles with "Unknown" dates: ${unknownDates.length} out of ${articles.length}`);
    
    if (unknownDates.length > 0) {
      console.log('\nSample articles with "Unknown" dates:');
      unknownDates.slice(0, 3).forEach((article, index) => {
        console.log(`\nUnknown Date Article ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
      });
    }
    
    // Check the structure of the article objects
    console.log('\nArticle object structure:');
    if (articles.length > 0) {
      const article = articles[0];
      console.log(JSON.stringify(article, null, 2));
      
      // Check if the publishedDate property exists and is being set correctly
      console.log('\nPublishedDate property:');
      console.log(`Type: ${typeof article.publishedDate}`);
      console.log(`Value: "${article.publishedDate}"`);
      console.log(`Object keys: ${Object.keys(article)}`);
    }
  } catch (error) {
    console.error('Error debugging GlobeSt scraper:', error);
  }
}

// Run the debug function
debugGlobeStScraper();
