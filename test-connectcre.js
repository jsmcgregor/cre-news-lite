const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Test script to check if we can scrape ConnectCRE with enhanced anti-scraping bypass techniques
 */
async function testConnectCREScraping() {
  console.log('Testing ConnectCRE scraping with enhanced anti-scraping bypass techniques...');
  
  // Array of user agents to rotate through
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
  ];
  
  // Get a random user agent
  const getRandomUserAgent = () => {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  };
  
  // URLs to test
  const urls = [
    { name: 'Main Page', url: 'https://www.connectcre.com' },
    { name: 'New York', url: 'https://www.connectcre.com/new-york-tri-state/' },
    { name: 'California', url: 'https://www.connectcre.com/california/' }
  ];
  
  // Test each URL
  for (const { name, url } of urls) {
    console.log(`\nTesting ${name}: ${url}`);
    
    try {
      // Use enhanced headers to bypass anti-scraping measures
      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.google.com/',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0',
          'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-User': '?1',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const html = await response.text();
      console.log(`Successfully fetched ${url} (${html.length} bytes)`);
      
      // Parse HTML with cheerio
      const $ = cheerio.load(html);
      
      // Try multiple selectors that might contain articles
      const articleSelectors = [
        'article', 
        '.post', 
        '.article', 
        '.story-card',
        '.entry',
        '.post-item',
        '.news-item',
        '.card',
        '.featured-post',
        '.blog-post',
        '.post-content',
        '.post-listing article',
        '.post-box',
        '.news-box',
        'div.row div.col-md-4',
        'div.container div.row > div'
      ];
      
      let articleElements = null;
      let selectorUsed = '';
      
      // Try each selector until we find some elements
      for (const selector of articleSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          articleElements = elements;
          selectorUsed = selector;
          console.log(`Found ${elements.length} article elements using selector: ${selector}`);
          break;
        }
      }
      
      // If we still didn't find any elements, try a more aggressive approach
      if (!articleElements || articleElements.length === 0) {
        // Look for any elements that contain links to stories
        const storyLinks = [];
        $('a').each((_, link) => {
          const href = $(link).attr('href') || '';
          if (href.includes('/stories/') || href.includes('/news/')) {
            storyLinks.push({
              href,
              text: $(link).text().trim()
            });
          }
        });
        
        console.log(`Found ${storyLinks.length} links to stories`);
        
        // Display the first 5 story links
        if (storyLinks.length > 0) {
          console.log('\nSample story links:');
          storyLinks.slice(0, 5).forEach((link, index) => {
            console.log(`${index + 1}. ${link.text} - ${link.href}`);
          });
        }
      } else {
        // Process the first 3 article elements
        console.log('\nSample articles:');
        articleElements.slice(0, 3).each((index, element) => {
          const $article = $(element);
          
          // Try to find the title
          let title = '';
          const titleSelectors = ['h2', 'h3', '.title', '.entry-title', '.post-title'];
          
          for (const selector of titleSelectors) {
            const $title = $article.find(selector).first();
            if ($title.length > 0) {
              title = $title.text().trim();
              if (title) break;
            }
          }
          
          // Try to find the link
          let url = '';
          $article.find('a').each((_, link) => {
            const href = $(link).attr('href') || '';
            if (href && (href.includes('/stories/') || href.includes('/news/'))) {
              url = href;
              return false; // break the loop
            }
          });
          
          console.log(`\nArticle ${index + 1}:`);
          console.log(`Title: ${title || 'Unknown'}`);
          console.log(`URL: ${url || 'Unknown'}`);
        });
      }
      
    } catch (error) {
      console.error(`Error testing ${url}:`, error.message);
    }
    
    // Add a delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

// Run the test
testConnectCREScraping();
