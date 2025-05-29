// Script to directly test the GlobeSt scraper and API response
const fetch = require('node-fetch');
const fs = require('fs');

async function testGlobeStApi() {
  try {
    console.log('Testing GlobeSt API response...');
    
    // First, make a direct request to the API to get GlobeSt articles
    console.log('\nFetching GlobeSt articles from API...');
    const apiResponse = await fetch('http://localhost:3001/api/scrape?source=GlobeSt');
    const apiData = await apiResponse.json();
    
    console.log(`API returned ${apiData.articles.length} GlobeSt articles`);
    
    // Check if any articles have "Unknown" dates
    const unknownDates = apiData.articles.filter(article => article.publishedDate === 'Unknown');
    console.log(`Articles with "Unknown" dates: ${unknownDates.length} out of ${apiData.articles.length}`);
    
    // Log sample articles
    console.log('\nSample articles from API:');
    apiData.articles.slice(0, 5).forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Date: ${article.publishedDate}`);
      console.log(`Source: ${article.source}`);
      console.log(`Region: ${article.region}`);
      console.log(`URL: ${article.url}`);
    });
    
    // Save the API response to a file for analysis
    fs.writeFileSync('globest-api-response.json', JSON.stringify(apiData, null, 2));
    console.log('\nSaved API response to globest-api-response.json');
    
    // Clear the cache by making a request to a special endpoint (if it exists)
    try {
      console.log('\nAttempting to clear cache...');
      await fetch('http://localhost:3001/api/clear-cache', { method: 'POST' });
      console.log('Cache clear request sent');
    } catch (error) {
      console.log('No cache clear endpoint available, continuing with test');
    }
    
    // Wait a moment for cache to clear
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Make another request to see if the cache was cleared
    console.log('\nFetching GlobeSt articles again after cache clear attempt...');
    const secondResponse = await fetch('http://localhost:3001/api/scrape?source=GlobeSt');
    const secondData = await secondResponse.json();
    
    console.log(`Second API call returned ${secondData.articles.length} GlobeSt articles`);
    
    // Check if any articles have "Unknown" dates in the second response
    const secondUnknownDates = secondData.articles.filter(article => article.publishedDate === 'Unknown');
    console.log(`Articles with "Unknown" dates in second call: ${secondUnknownDates.length} out of ${secondData.articles.length}`);
    
    // Compare the two responses
    console.log('\nComparing responses:');
    console.log(`First response had ${unknownDates.length} unknown dates`);
    console.log(`Second response has ${secondUnknownDates.length} unknown dates`);
    
    if (JSON.stringify(apiData) === JSON.stringify(secondData)) {
      console.log('The responses are identical - cache may still be in effect');
    } else {
      console.log('The responses are different - cache may have been cleared');
    }
  } catch (error) {
    console.error('Error testing GlobeSt API:', error);
  }
}

// Run the test
testGlobeStApi();
