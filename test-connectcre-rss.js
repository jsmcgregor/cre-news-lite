const fetch = require('node-fetch');
const xml2js = require('xml2js');

/**
 * Test script to check ConnectCRE's RSS feed
 * This will help us determine if we can use the RSS feed as a source for articles
 */
async function testConnectCRERSS() {
  try {
    console.log('Testing ConnectCRE RSS feed...');
    
    // Try different regional feeds
    const feeds = [
      { name: 'Main Feed', url: 'https://www.connectcre.com/feed' },
      { name: 'National', url: 'https://www.connectcre.com/feed?story-market=national' },
      { name: 'New York', url: 'https://www.connectcre.com/feed?story-market=new-york-tri-state' },
      { name: 'California', url: 'https://www.connectcre.com/feed?story-market=california' }
    ];
    
    for (const feed of feeds) {
      console.log(`\nChecking ${feed.name} feed: ${feed.url}`);
      
      // Use browser-like headers
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.connectcre.com/',
          'Connection': 'keep-alive',
          'Cache-Control': 'max-age=0'
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch ${feed.url}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const xml = await response.text();
      console.log(`Received ${xml.length} bytes of XML data`);
      
      // Parse the XML
      const parser = new xml2js.Parser({ explicitArray: false });
      const result = await parser.parseStringPromise(xml);
      
      if (result.rss && result.rss.channel && result.rss.channel.item) {
        const items = Array.isArray(result.rss.channel.item) 
          ? result.rss.channel.item 
          : [result.rss.channel.item];
        
        console.log(`Found ${items.length} articles in the feed`);
        
        // Display the first 3 articles
        items.slice(0, 3).forEach((item, index) => {
          console.log(`\nArticle ${index + 1}:`);
          console.log(`Title: ${item.title}`);
          console.log(`Link: ${item.link}`);
          console.log(`Date: ${item.pubDate}`);
          console.log(`Categories: ${Array.isArray(item.category) ? item.category.join(', ') : item.category || 'None'}`);
          
          // Show a snippet of the description (which often contains the article excerpt)
          const description = item.description || '';
          console.log(`Description: ${description.substring(0, 150)}...`);
        });
      } else {
        console.log('No items found in the feed or unexpected feed structure');
      }
    }
    
  } catch (error) {
    console.error('Error testing ConnectCRE RSS feed:', error);
  }
}

// Also test the WordPress REST API
async function testWordPressAPI() {
  try {
    console.log('\n\nTesting ConnectCRE WordPress REST API...');
    
    // Try different API endpoints
    const endpoints = [
      { name: 'Posts', url: 'https://www.connectcre.com/wp-json/wp/v2/posts?per_page=5' },
      { name: 'Stories', url: 'https://www.connectcre.com/wp-json/wp/v2/stories?per_page=5' },
      { name: 'API Index', url: 'https://www.connectcre.com/wp-json/' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\nChecking ${endpoint.name} endpoint: ${endpoint.url}`);
      
      // Use browser-like headers
      const response = await fetch(endpoint.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.connectcre.com/',
          'Connection': 'keep-alive',
          'Cache-Control': 'max-age=0'
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch ${endpoint.url}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`Received API response with ${Array.isArray(data) ? data.length : 'non-array'} data`);
      
      if (Array.isArray(data) && data.length > 0) {
        // Display info about the first item
        console.log(`First item sample:`, JSON.stringify(data[0], null, 2).substring(0, 500) + '...');
      } else if (typeof data === 'object') {
        // For API index, show available routes
        console.log(`API data:`, JSON.stringify(data, null, 2).substring(0, 500) + '...');
      }
    }
    
  } catch (error) {
    console.error('Error testing WordPress API:', error);
  }
}

// Run both tests
async function runTests() {
  await testConnectCRERSS();
  await testWordPressAPI();
}

runTests();
