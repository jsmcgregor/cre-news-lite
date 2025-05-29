// Script to test the API response and check if dates are being correctly sent
const fetch = require('node-fetch');

async function testApiResponse() {
  try {
    console.log('Testing API response...');
    
    // Make a request to the API specifically for GlobeSt articles
    const response = await fetch('http://localhost:3000/api/scrape?source=GlobeSt');
    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      return;
    }
    
    const data = await response.json();
    console.log(`Received ${data.articles.length} articles`);
    
    // Check for GlobeSt articles and their dates
    const globestArticles = data.articles.filter(article => article.source === 'GlobeSt');
    console.log(`Found ${globestArticles.length} GlobeSt articles`);
    
    // Display the first few GlobeSt articles with their dates
    console.log('\nSample GlobeSt articles:');
    globestArticles.slice(0, 5).forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Source: ${article.source}`);
      console.log(`Date: ${article.publishedDate}`);
      console.log(`Region: ${article.region}`);
      console.log(`URL: ${article.url}`);
    });
    
    // Check if any GlobeSt articles have "Unknown" dates
    const unknownDates = globestArticles.filter(article => article.publishedDate === 'Unknown');
    console.log(`\nGlobeSt articles with "Unknown" dates: ${unknownDates.length} out of ${globestArticles.length}`);
    
    if (unknownDates.length > 0) {
      console.log('\nSample articles with "Unknown" dates:');
      unknownDates.slice(0, 3).forEach((article, index) => {
        console.log(`\nUnknown Date Article ${index + 1}:`);
        console.log(`Title: ${article.title}`);
        console.log(`URL: ${article.url}`);
      });
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testApiResponse();
