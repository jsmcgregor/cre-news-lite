// Script to analyze GlobeSt HTML structure
const fs = require('fs');
const cheerio = require('cheerio');

// Load the HTML file
const html = fs.readFileSync('globest-national.html', 'utf8');
const $ = cheerio.load(html);

console.log('Analyzing GlobeSt HTML structure...\n');

// Look for common article container patterns
console.log('Searching for potential article containers:');

// Define potential article selectors to check
const potentialSelectors = [
  // Common article containers
  'article', '.article', 'div.article', 
  // Stream related
  '.stream', '.stream-item', '.stream__item',
  // Card related
  '.card', '.card-item', '.article-card',
  // Item related
  '.item', '.news-item', '.story-item',
  // Content related
  '.content-item', '.content-card', '.content-article',
  // Custom checks for GlobeSt
  '.headline', '.headline-container',
  '.story', '.story-container',
  // Vue.js specific classes (from the HTML inspection)
  '[data-v-46b2b74d]', '[data-v-0626d679]'
];

// Check each selector
potentialSelectors.forEach(selector => {
  const elements = $(selector);
  if (elements.length > 0) {
    console.log(`Found ${elements.length} elements with selector: ${selector}`);
  }
});

// Look for elements with 'article' in their class name
console.log('\nSearching for elements with "article" in class name:');
$('*').each((i, el) => {
  const className = $(el).attr('class');
  if (className && className.includes('article')) {
    console.log(`Found element with class containing "article": ${className}`);
  }
});

// Look for elements with links and headings (common in article listings)
console.log('\nSearching for potential article listings (elements with links and headings):');
const potentialArticleContainers = [];

// Find elements that contain both a heading and a link
$('*').each((i, el) => {
  const $el = $(el);
  const hasHeading = $el.find('h1, h2, h3, h4, h5, h6').length > 0;
  const hasLink = $el.find('a').length > 0;
  
  if (hasHeading && hasLink) {
    const className = $el.attr('class') || 'no-class';
    const id = $el.attr('id') || 'no-id';
    const tagName = $el.prop('tagName');
    
    // Only add if not already in the list
    const key = `${tagName}#${id}.${className}`;
    if (!potentialArticleContainers.includes(key)) {
      potentialArticleContainers.push(key);
      console.log(`Potential article container: ${tagName} with class "${className}" and id "${id}"`);
    }
  }
});

// Extract a sample of potential article titles and links
console.log('\nSample of potential article titles and links:');
$('a').each((i, el) => {
  const $el = $(el);
  const href = $el.attr('href');
  const text = $el.text().trim();
  
  // Only consider non-empty links with text that might be article titles
  if (href && text && text.length > 20 && text.length < 150 && href.includes('/')) {
    console.log(`Potential article: "${text}" - ${href}`);
    
    // Only show 10 samples
    if (i >= 9) return false;
  }
});
