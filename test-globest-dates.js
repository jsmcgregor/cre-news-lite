// Script to test date extraction from GlobeSt articles
const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Function to fetch and parse a GlobeSt page
async function fetchAndParsePage(url) {
  console.log(`Fetching ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    console.log('Analyzing page for date elements...');
    
    // Look for prettyDate elements
    const prettyDateElements = $('.prettyDate');
    console.log(`Found ${prettyDateElements.length} prettyDate elements`);
    
    prettyDateElements.each((i, el) => {
      const text = $(el).text().trim();
      console.log(`prettyDate ${i+1}: "${text}"`);
    });
    
    // Look for date patterns in the HTML
    const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}/gi;
    const matches = html.match(dateRegex) || [];
    
    console.log(`\nFound ${matches.length} date patterns in the HTML:`);
    matches.slice(0, 10).forEach((match, i) => {
      console.log(`Date pattern ${i+1}: "${match}"`);
    });
    
    // Look for elements with text containing dates
    console.log('\nLooking for elements with text containing dates:');
    $('*').each((i, el) => {
      const text = $(el).text().trim();
      if (text.match(dateRegex)) {
        console.log(`Element with date: ${$(el).prop('tagName')}.${$(el).attr('class') || 'no-class'} - "${text.substring(0, 50)}..."`);
        
        // Only check first 10 elements
        if (i >= 9) return false;
      }
    });
    
    // Try to find article elements and extract dates
    console.log('\nTrying to find article elements and extract dates:');
    
    // Look for common article containers
    const articleContainers = [
      'article', '.article', 
      'div.article', '.article-item', 
      '.news-item', '.content-item'
    ];
    
    for (const selector of articleContainers) {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        elements.each((i, el) => {
          const $el = $(el);
          const title = $el.find('h1, h2, h3, h4, h5, h6').first().text().trim();
          console.log(`Article title: "${title}"`);
          
          // Look for date elements
          const dateElement = $el.find('.prettyDate, .date, time, .published, .meta').first();
          if (dateElement.length > 0) {
            console.log(`Date element text: "${dateElement.text().trim()}"`);
          } else {
            console.log('No date element found');
            
            // Try to find date in the article text
            const articleText = $el.text();
            const dateMatch = articleText.match(dateRegex);
            if (dateMatch) {
              console.log(`Found date in article text: "${dateMatch[0]}"`);
            }
          }
          
          // Only check first 3 articles
          if (i >= 2) return false;
        });
      }
    }
    
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
  }
}

// URLs to test
const urls = [
  'https://www.globest.com/markets/national/',
  'https://www.globest.com/markets/west/',
  'https://www.globest.com/2023/05/01/office-market-shows-signs-of-recovery-in-q1/' // Sample article URL
];

// Test each URL
async function testUrls() {
  for (const url of urls) {
    await fetchAndParsePage(url);
    console.log('\n-----------------------------------\n');
  }
}

// Run the tests
testUrls().catch(console.error);
