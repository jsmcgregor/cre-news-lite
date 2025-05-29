const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function analyzeConnectCRE() {
  try {
    console.log('Analyzing ConnectCRE website structure...');
    
    const url = 'https://www.connectcre.com/';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try different article selectors
    const selectors = [
      'article', 
      '.post', 
      '.article', 
      '.story-card',
      '.entry',
      '.post-item',
      '.news-item',
      '.card',
      '.featured-post',
      '.blog-post'
    ];
    
    for (const selector of selectors) {
      const elements = $(selector);
      console.log(`\nSelector "${selector}" found ${elements.length} elements`);
      
      if (elements.length > 0) {
        // Analyze the first 3 elements
        elements.slice(0, 3).each((i, el) => {
          const $el = $(el);
          console.log(`\n--- Element ${i+1} with selector "${selector}" ---`);
          
          // Check for links
          const links = $el.find('a');
          console.log(`Links found: ${links.length}`);
          links.slice(0, 2).each((j, link) => {
            console.log(`Link ${j+1}: ${$(link).attr('href')} - Text: ${$(link).text().trim().substring(0, 50)}`);
          });
          
          // Check for title elements
          const titleSelectors = ['h2', 'h3', '.title', '.entry-title', '.post-title'];
          for (const titleSelector of titleSelectors) {
            const titleEl = $el.find(titleSelector);
            if (titleEl.length > 0) {
              console.log(`Title (${titleSelector}): ${titleEl.first().text().trim().substring(0, 50)}`);
            }
          }
          
          // Check for date elements
          const dateSelectors = ['.date', 'time', '.entry-date', '.post-date', '.meta-date'];
          for (const dateSelector of dateSelectors) {
            const dateEl = $el.find(dateSelector);
            if (dateEl.length > 0) {
              console.log(`Date (${dateSelector}): ${dateEl.first().text().trim()}`);
            }
          }
          
          // Output the HTML structure of the element (limited to 300 chars)
          const html = $el.html();
          console.log(`HTML structure: ${html ? html.substring(0, 300) + '...' : 'N/A'}`);
        });
      }
    }
    
    // Look for specific patterns in the HTML
    console.log('\n\nAnalyzing HTML structure for patterns...');
    
    // Check for common WordPress article structures
    const wpArticles = $('.post, .type-post, .post-item, article.post');
    console.log(`WordPress-style articles found: ${wpArticles.length}`);
    
    // Check for specific ConnectCRE classes
    const classPattern = /connect|cre|story|news|article/i;
    const elementsWithRelevantClasses = $('*').filter(function() {
      const classes = $(this).attr('class') || '';
      return classPattern.test(classes);
    });
    
    console.log(`Elements with relevant classes: ${elementsWithRelevantClasses.length}`);
    
    // Output some of these elements
    console.log('\nSample elements with relevant classes:');
    elementsWithRelevantClasses.slice(0, 5).each((i, el) => {
      const $el = $(el);
      console.log(`Element ${i+1}: Tag=${el.tagName}, Class=${$el.attr('class')}`);
      
      // Check if it contains links to articles
      const links = $el.find('a[href*="/stories/"], a[href*="/news/"]');
      if (links.length > 0) {
        console.log(`  Contains ${links.length} links to potential articles`);
        links.slice(0, 2).each((j, link) => {
          console.log(`  Link ${j+1}: ${$(link).attr('href')}`);
        });
      }
    });
    
  } catch (error) {
    console.error('Error analyzing ConnectCRE:', error);
  }
}

analyzeConnectCRE();
