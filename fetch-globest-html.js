// Script to fetch and save HTML from GlobeSt
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function fetchAndSaveHtml(url, outputFile) {
  console.log(`Fetching HTML from ${url}...`);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return;
    }
    
    const html = await response.text();
    fs.writeFileSync(outputFile, html);
    console.log(`HTML saved to ${outputFile}`);
    
    // Also save a shorter version with just the first 5000 characters
    const shortHtml = html.substring(0, 5000);
    const shortOutputFile = outputFile.replace('.html', '-short.html');
    fs.writeFileSync(shortOutputFile, shortHtml);
    console.log(`Short HTML preview saved to ${shortOutputFile}`);
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
  }
}

// URL to fetch
const url = 'https://www.globest.com/markets/national/';
const outputFile = path.join(__dirname, 'globest-national.html');

fetchAndSaveHtml(url, outputFile).catch(console.error);
