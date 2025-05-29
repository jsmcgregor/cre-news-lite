// Test script for GlobeSt regional URLs
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Function to test scraping a URL
async function testScrapeUrl(url) {
  console.log(`Testing URL: ${url}`);
  
  try {
    // Fetch the URL
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Articles to return
    const articles = [];
    
    // Detect region from URL
    let region = 'Unknown';
    if (url.includes('/national/')) region = 'National';
    else if (url.includes('/west/')) region = 'West';
    else if (url.includes('/southwest/')) region = 'Southwest';
    else if (url.includes('/midwest/')) region = 'Midwest';
    else if (url.includes('/southeast/')) region = 'South';
    
    // Find article elements - GlobeSt specific selectors
    const articleSelectors = [
      '.article-card',
      '.article-item',
      '.article',
      '.post',
      '.news-item',
      '.latest-stories__item',
      '.content-feed__item'
    ];
    
    let foundArticles = false;
    
    for (const selector of articleSelectors) {
      const articleElements = $(selector);
      
      if (articleElements.length > 0) {
        foundArticles = true;
        console.log(`Found ${articleElements.length} articles with selector: ${selector}`);
        
        articleElements.each((_, element) => {
          const $element = $(element);
          
          // Try to find title and URL
          const titleElement = $element.find('h2, h3, h4, .title, .headline').first();
          const linkElement = titleElement.find('a').length ? 
            titleElement.find('a') : 
            $element.find('a').first();
          
          const title = titleElement.text().trim();
          const articleUrl = linkElement.attr('href') || '';
          
          // Skip if no title or URL
          if (!title || !articleUrl) return;
          
          // Try to find date
          const dateElement = $element.find('.date, time, .published, .meta').first();
          const publishedDate = dateElement.text().trim();
          
          // Create article object
          const article = {
            title,
            url: articleUrl,
            source: 'GlobeSt',
            publishedDate: publishedDate || 'Unknown',
            region
          };
          
          articles.push(article);
        });
        
        // If we found articles with this selector, no need to try others
        if (articles.length > 0) break;
      }
    }
    
    console.log(`Scraped ${articles.length} articles from ${url}`);
    return articles;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return [];
  }
}

// URLs to test
const urls = [
  'https://www.globest.com/markets/national/',
  'https://www.globest.com/markets/west/',
  'https://www.globest.com/markets/southwest/',
  'https://www.globest.com/markets/midwest/',
  'https://www.globest.com/markets/southeast/'
];

// Test each URL
async function testUrls() {
  console.log('Testing GlobeSt regional URLs...');
  
  for (const url of urls) {
    console.log(`
Testing URL: ${url}`);
    try {
      const articles = await testScrapeUrl(url);
      
      if (articles.length > 0) {
        console.log('Sample articles:');
        // Show the first 3 articles or all if less than 3
        const sampleSize = Math.min(3, articles.length);
        for (let i = 0; i < sampleSize; i++) {
          const article = articles[i];
          console.log(`- Title: ${article.title}`);
          console.log(`  URL: ${article.url}`);
          console.log(`  Region: ${article.region}`);
          console.log(`  Published: ${article.publishedDate}`);
        }
      } else {
        console.log('No articles found for this URL');
      }
    } catch (error) {
      console.error(`Error testing ${url}:`, error);
    }
  }
}

// Run the test
testUrls().catch(console.error);
