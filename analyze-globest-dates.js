// Script to analyze GlobeSt HTML structure for date elements
const fs = require('fs');
const cheerio = require('cheerio');

// Load the HTML file
const html = fs.readFileSync('globest-national.html', 'utf8');
const $ = cheerio.load(html);

console.log('Analyzing GlobeSt HTML structure for date elements...\n');

// Look for potential date elements
console.log('Searching for potential date elements:');

// Define potential date selectors to check
const potentialDateSelectors = [
  '.date', 'time', '.published', '.meta', '.timestamp',
  '.article-date', '.publish-date', '.byline-date',
  '[datetime]', '[data-date]', '[data-timestamp]'
];

// Check each selector
potentialDateSelectors.forEach(selector => {
  const elements = $(selector);
  if (elements.length > 0) {
    console.log(`Found ${elements.length} elements with selector: ${selector}`);
    
    // Show sample content for the first few elements
    elements.slice(0, 3).each((i, el) => {
      const $el = $(el);
      console.log(`  Sample ${i+1}: "${$el.text().trim()}" with attributes:`, $el.attr());
    });
  }
});

// Look for elements with 'date' in their class name
console.log('\nSearching for elements with "date" in class name:');
$('*').each((i, el) => {
  const className = $(el).attr('class');
  if (className && className.toLowerCase().includes('date')) {
    console.log(`Found element with class containing "date": ${className}`);
    console.log(`  Content: "${$(el).text().trim()}"`);
    
    // Only show first 10 matches
    if (i >= 9) return false;
  }
});

// Look for elements with date-like text content (MM/DD/YYYY or Month DD, YYYY)
console.log('\nSearching for elements with date-like text content:');
const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

$('*').each((i, el) => {
  const text = $(el).text().trim().toLowerCase();
  
  // Check for Month DD, YYYY format
  const hasMonth = months.some(month => text.includes(month)) || shortMonths.some(month => text.includes(month));
  const hasYear = /\b20\d\d\b/.test(text); // Look for years like 2020, 2021, etc.
  
  // Check for MM/DD/YYYY format
  const hasDateFormat = /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(text);
  
  if ((hasMonth && hasYear) || hasDateFormat) {
    console.log(`Found element with date-like content: "${$(el).text().trim()}"`);
    console.log(`  Tag: ${$(el).prop('tagName')}, Class: ${$(el).attr('class') || 'none'}`);
    
    // Only show first 10 matches
    if (i >= 9) return false;
  }
});

// Look for elements near article titles that might contain dates
console.log('\nSearching for potential date elements near article titles:');
$('h1, h2, h3, h4, h5, h6').each((i, el) => {
  const $el = $(el);
  const $parent = $el.parent();
  
  // Check siblings and children of parent for potential date elements
  const $siblings = $parent.children();
  $siblings.each((j, sib) => {
    const $sib = $(sib);
    if ($sib.prop('tagName') !== $el.prop('tagName')) { // Not another heading
      const text = $sib.text().trim();
      if (text.length > 0 && text.length < 50) { // Short text that might be a date
        console.log(`Potential date element near article title "${$el.text().trim().substring(0, 50)}..."`);
        console.log(`  Content: "${text}"`);
        console.log(`  Tag: ${$sib.prop('tagName')}, Class: ${$sib.attr('class') || 'none'}`);
      }
    }
  });
  
  // Only check first 10 headings
  if (i >= 9) return false;
});
