// Test script to analyze GlobeSt date extraction
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

// Simplified version of the date extraction logic from enhanced-globest.ts
function extractDate(text) {
  if (!text) return 'Unknown';
  
  // If the text contains a pipe character, it's likely in the format "Author | Date"
  if (text.includes('|')) {
    const parts = text.split('|');
    if (parts.length > 1) {
      return parts[1].trim().replace(/\\s+/g, ' ');
    }
  }
  
  // Check if the text contains a date pattern
  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2},\\s+\\d{4}/i;
  const match = text.match(dateRegex);
  if (match) {
    return match[0];
  }
  
  return text.trim();
}

// Function to get element path (simplified version)
function getElementPath($, element) {
  if (!element) return '';
  
  const tagName = element.tagName || element.name;
  const classes = $(element).attr('class') || '';
  const id = $(element).attr('id') || '';
  
  return `${tagName}${id ? '#' + id : ''}${classes ? '.' + classes.replace(/\\s+/g, '.') : ''}`;
}

async function testGlobeStDateExtraction() {
  try {
    console.log('Testing GlobeSt date extraction...');
    
    // URLs to test
    const urls = [
      'https://www.globest.com/markets/national/',
      'https://www.globest.com/markets/west/',
      'https://www.globest.com/markets/southwest/'
    ];
    
    for (const url of urls) {
      console.log(`\\nTesting URL: ${url}`);
      
      // Fetch the page
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      console.log('Looking for date elements...');
      
      // Extract all prettyDate elements
      const prettyDates = new Map();
      $('.prettyDate').each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        const date = extractDate(text);
        
        // Use the element's path as a key
        const path = getElementPath($, el);
        prettyDates.set(path, date);
        
        console.log(`Found prettyDate: "${text}" -> "${date}"`);
      });
      
      console.log(`Found ${prettyDates.size} prettyDate elements`);
      
      // Look for article elements
      console.log('\\nLooking for article elements...');
      const articleElements = $('.articleSummary').closest('div');
      console.log(`Found ${articleElements.length} article elements`);
      
      // Process each article
      articleElements.each((i, element) => {
        if (i >= 5) return false; // Only process the first 5 articles
        
        const $element = $(element);
        
        // Try to find title and URL
        const titleElement = $element.find('h1, h2, h3, h4, h5, h6').first();
        const linkElement = titleElement.find('a').length ? 
          titleElement.find('a') : 
          $element.find('a').first();
        
        const title = titleElement.text().trim() || linkElement.text().trim();
        const articleUrl = linkElement.attr('href') || '';
        
        // Try to find date
        let publishedDate = 'Unknown';
        
        // First, check if there's a prettyDate element directly inside this element
        const dateElement = $element.find('.prettyDate').first();
        if (dateElement.length > 0) {
          publishedDate = extractDate(dateElement.text());
          console.log(`Article ${i+1} has direct prettyDate: "${dateElement.text()}" -> "${publishedDate}"`);
        } else {
          console.log(`Article ${i+1} has no direct prettyDate, looking for alternatives...`);
          
          // If no direct prettyDate, look for other date indicators
          const otherDateElement = $element.find('.date, time, .published, .meta').first();
          if (otherDateElement.length > 0) {
            publishedDate = extractDate(otherDateElement.text());
            console.log(`Article ${i+1} has other date element: "${otherDateElement.text()}" -> "${publishedDate}"`);
          } else {
            // Try to find a date pattern in the text
            const fullText = $element.text();
            const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\s+\\d{1,2},\\s+\\d{4}/i;
            const dateMatch = fullText.match(dateRegex);
            if (dateMatch) {
              publishedDate = dateMatch[0];
              console.log(`Article ${i+1} has date in text: "${dateMatch[0]}"`);
            } else {
              console.log(`Article ${i+1} has no date in text, looking for nearby prettyDate...`);
              
              // Try to find a nearby prettyDate by traversing up the DOM
              let current = $element;
              let found = false;
              
              // Try up to 3 levels up
              for (let j = 0; j < 3 && !found; j++) {
                current = current.parent();
                const path = getElementPath($, current[0]);
                
                if (prettyDates.has(path)) {
                  publishedDate = prettyDates.get(path) || 'Unknown';
                  console.log(`Article ${i+1} found date in parent (level ${j+1}): "${publishedDate}"`);
                  found = true;
                  break;
                }
                
                // Also check siblings
                current.siblings().each((_, sibling) => {
                  if (found) return false;
                  
                  const siblingPath = getElementPath($, sibling);
                  if (prettyDates.has(siblingPath)) {
                    publishedDate = prettyDates.get(siblingPath) || 'Unknown';
                    console.log(`Article ${i+1} found date in sibling: "${publishedDate}"`);
                    found = true;
                    return false;
                  }
                });
              }
              
              if (!found) {
                console.log(`Article ${i+1} could not find a date, using "Unknown"`);
              }
            }
          }
        }
        
        console.log(`\\nArticle ${i+1}:`);
        console.log(`Title: ${title}`);
        console.log(`URL: ${articleUrl}`);
        console.log(`Date: ${publishedDate}`);
        console.log('-'.repeat(50));
      });
    }
  } catch (error) {
    console.error('Error testing GlobeSt date extraction:', error);
  }
}

// Run the test
testGlobeStDateExtraction();
