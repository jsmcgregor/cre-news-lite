import { Article } from '../../types/article';

// Function to generate properly formatted dates within the last 2 weeks
const getFormattedDate = (dayOffset = 0) => {
  // Use current date minus 14 days as the base date for the 2-week period
  // This ensures we get dates from the last 2 weeks
  const today = new Date(); // Current date
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14); // Base date is 2 weeks ago
  
  // Calculate the actual date by adding the offset to the base date (twoWeeksAgo)
  // This way, dayOffset=0 is 2 weeks ago, and dayOffset=14 is today
  const resultDate = new Date(twoWeeksAgo);
  resultDate.setDate(twoWeeksAgo.getDate() + dayOffset);
  
  // Format date as 'Month Day, Year'
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return resultDate.toLocaleDateString('en-US', options);
};

// Pre-generate a set of unique dates for our articles within the last 2 weeks
// With dayOffset ranging from 0 to 14, we get dates from 2 weeks ago to today
const articleDates: string[] = [];

// Generate 50 dates spread across the last 2 weeks (some days will have multiple articles)
// This creates a more realistic distribution of articles over the 2-week period
for (let i = 0; i < 50; i++) {
  // Distribute the dates across the 2-week period
  // Using modulo to ensure we stay within the 0-14 day range
  // Math.floor(i / 3) creates clusters of dates (several articles per day)
  const dayOffset = Math.floor(i / 3) % 15;
  articleDates.push(getFormattedDate(dayOffset));
}

// Add a few more recent dates (last 3 days) to ensure we have very recent articles
for (let i = 0; i < 10; i++) {
  const recentOffset = 12 + (i % 3); // This gives us dates from the last 3 days
  articleDates.push(getFormattedDate(recentOffset));
}

// Add a few older dates from the beginning of the 2-week period
for (let i = 0; i < 10; i++) {
  const olderOffset = i % 3; // This gives us dates from the beginning of the 2-week period
  articleDates.push(getFormattedDate(olderOffset));
}

// Generate a larger collection of articles from the three main sources
function generateArticles(): Article[] {
  const articles: Article[] = [
  // National Articles
  {
    title: "Blackstone's $10B Data Center Deal Shows Sector's Rapid Growth",
    url: 'https://www.bisnow.com/national/news/data-center/blackstone-data-center-qts-deal-109544',
    publishedDate: articleDates[0],
    source: 'Bisnow',
    region: 'National'
  },
  {
    title: 'Industrial Real Estate Demand Remains Strong Despite Economic Headwinds',
    url: 'https://www.globest.com/2023/05/15/industrial-real-estate-demand-remains-strong-despite-economic-headwinds/',
    publishedDate: articleDates[1],
    source: 'GlobeSt',
    region: 'National'
  },
  {
    title: 'Office-to-Residential Conversions Gain Momentum with New Federal Incentives',
    url: 'https://www.connectcre.com/stories/office-to-residential-conversions-gain-momentum-with-new-federal-incentives/',
    publishedDate: articleDates[2],
    source: 'ConnectCRE',
    region: 'National'
  },
  {
    title: 'ESG Investing in Real Estate Continues Despite Political Backlash',
    url: 'https://www.bisnow.com/national/news/sustainability/esg-investing-real-estate-cbre-report-115416',
    publishedDate: articleDates[3],
    source: 'Bisnow',
    region: 'National'
  },
  {
    title: "What the Fed's Latest Rate Hike Means for CRE",
    url: 'https://www.globest.com/2023/05/04/what-the-feds-latest-rate-hike-means-for-cre/',
    publishedDate: articleDates[4],
    source: 'GlobeSt',
    region: 'National'
  },
  // Northeast Articles
  {
    title: 'Related, Oxford Break Ground On 50 Hudson Yards',
    url: 'https://www.bisnow.com/new-york/news/mixed-use/related-oxford-break-ground-on-50-hudson-yards-75862',
    publishedDate: articleDates[5],
    source: 'Bisnow',
    region: 'Northeast'
  },
  {
    title: "Boston Life Science Market Continues to Expand",
    url: 'https://www.connectcre.com/boston/boston-life-science-market-continues-to-expand/',
    publishedDate: articleDates[6],
    source: 'ConnectCRE',
    region: 'Northeast'
  },
  {
    title: 'Long Island Industrial Market Tightens Further as E-commerce Demand Continues',
    url: 'https://www.globest.com/2022/08/01/long-island-industrial-market-tightens-further/',
    publishedDate: articleDates[28],
    source: 'GlobeSt',
    region: 'New York'
  },
  {
    title: 'Philadelphia Multifamily Market Sees Record Absorption Despite New Supply',
    url: 'https://www.globest.com/2022/01/28/philadelphia-multifamily-market-sees-record-absorption-despite-new-supply/',
    publishedDate: articleDates[7],
    source: 'GlobeSt',
    region: 'Northeast'
  },
  {
    title: 'Manhattan Retail Spaces Find New Life with Experiential Tenants',
    url: 'https://example.com/manhattan-retail',
    publishedDate: articleDates[8],
    source: 'Mock CRE News',
    region: 'Northeast'
  },

  // California Articles
  {
    title: 'San Francisco Office Market Shows Signs of Stabilization',
    url: 'https://www.bisnow.com/san-francisco/news/office/san-francisco-office-market-recovery-114787',
    publishedDate: articleDates[17],
    source: 'Bisnow',
    region: 'California'
  },
  {
    title: 'SoCal Industrial Demand Drives Cap Rates to Historic Lows',
    url: 'https://www.connectcre.com/stories/socal-industrial-demand-drives-cap-rates-to-historic-lows/',
    publishedDate: articleDates[18],
    source: 'ConnectCRE',
    region: 'California'
  },
  {
    title: 'Sacramento Emerges as Alternative Investment Market for Bay Area Investors',
    url: 'https://www.globest.com/2022/03/07/sacramento-emerges-as-alternative-investment-market-for-bay-area-investors/',
    publishedDate: articleDates[19],
    source: 'GlobeSt',
    region: 'California'
  },
  {
    title: 'Portland Mixed-Use Developments Focus on Sustainability and Community Impact',
    url: 'https://example.com/portland-mixed',
    publishedDate: articleDates[12],
    source: 'Mock Bisnow',
    region: 'West'
  },
  {
    title: 'Los Angeles Entertainment Studio Space Expands Amid Streaming Content Boom',
    url: 'https://example.com/la-studios',
    publishedDate: articleDates[13],
    source: 'Mock CRE News',
    region: 'West'
  },
  {
    title: 'Bay Area Life Sciences Campuses Attract $3B in New Investment',
    url: 'https://example.com/bayarea-lifesciences',
    publishedDate: articleDates[14],
    source: 'Mock REBusiness',
    region: 'West'
  },

  // Midwest Articles
  {
    title: 'Chicago Industrial Market Continues to Outperform',
    url: 'https://www.connectcre.com/chicago/chicago-industrial-market-continues-to-outperform/',
    publishedDate: articleDates[8],
    source: 'ConnectCRE',
    region: 'Midwest'
  },
  {
    title: 'Minneapolis Downtown Council Pushes For Office-To-Residential Conversions',
    url: 'https://www.bisnow.com/minneapolis-st-paul/news/office/minneapolis-downtown-council-office-residential-conversion-116841',
    publishedDate: articleDates[9],
    source: 'Bisnow',
    region: 'Midwest'
  },
  {
    title: 'Minneapolis Office-to-Residential Conversions Address Housing Shortage',
    url: 'https://example.com/minneapolis-conversion',
    publishedDate: articleDates[17],
    source: 'Mock REBusiness',
    region: 'Midwest'
  },
  {
    title: 'Cleveland Healthcare Real Estate Expands with New Medical Office Buildings',
    url: 'https://example.com/cleveland-healthcare',
    publishedDate: articleDates[18],
    source: 'Mock Bisnow',
    region: 'Midwest'
  },
  {
    title: 'Indianapolis Logistics Hub Attracts Major Distribution Centers',
    url: 'https://example.com/indy-logistics',
    publishedDate: articleDates[19],
    source: 'Mock CRE News',
    region: 'Midwest'
  },

  // South Articles
  {
    title: 'Austin Office Development Pipeline Remains Strong Despite National Slowdown',
    url: 'https://www.bisnow.com/austin-san-antonio/news/office/austin-office-development-pipeline-remains-strong-despite-national-slowdown-116438',
    publishedDate: articleDates[11],
    source: 'Bisnow',
    region: 'South'
  },
  {
    title: 'Dallas-Fort Worth Industrial Absorption Hits All-Time High in Q1',
    url: 'https://www.connectcre.com/dallas/dallas-fort-worth-industrial-absorption-hits-all-time-high-in-q1/',
    publishedDate: articleDates[12],
    source: 'ConnectCRE',
    region: 'South'
  },
  {
    title: 'San Antonio Office Market Sees Positive Absorption for First Time Since 2020',
    url: 'https://www.connectcre.com/texas/san-antonio-office-market-sees-positive-absorption-for-first-time-since-2020/',
    publishedDate: articleDates[21],
    source: 'ConnectCRE',
    region: 'Texas'
  },
  {
    title: 'Nashville Hospitality Sector Rebounds with New Hotel Developments Downtown',
    url: 'https://example.com/nashville-hotels',
    publishedDate: articleDates[23],
    source: 'Mock REBusiness',
    region: 'South'
  },
  {
    title: 'Atlanta Office Market Sees Positive Absorption for First Time Since Pandemic',
    url: 'https://example.com/atlanta-office',
    publishedDate: articleDates[24],
    source: 'Mock Bisnow',
    region: 'South'
  },
  {
    title: 'Miami Multifamily Growth Outpaces National Average for Third Consecutive Quarter',
    url: 'https://example.com/miami-multifamily',
    publishedDate: articleDates[20],
    source: 'Mock REBusiness',
    region: 'South'
  },

  // Southwest Articles
  {
    title: 'Phoenix Industrial Market Continues Expansion with 15M SF Under Construction',
    url: 'https://www.globest.com/2025/04/10/phoenix-industrial-market-expansion',
    publishedDate: articleDates[16],
    source: 'GlobeSt',
    region: 'West'
  },
  {
    title: 'Las Vegas Retail Market Rebounds as Tourism Returns to Pre-Pandemic Levels',
    url: 'https://www.globest.com/2022/04/11/las-vegas-retail-market-rebounds-as-tourism-returns-to-pre-pandemic-levels/',
    publishedDate: articleDates[15],
    source: 'GlobeSt',
    region: 'West'
  },
  {
    title: 'Las Vegas Retail Centers Transform with Experiential Shopping Concepts',
    url: 'https://www.connectcre.com/las-vegas/vegas-retail-experiential-shopping',
    publishedDate: articleDates[26],
    source: 'ConnectCRE',
    region: 'Southwest'
  },
  {
    title: 'Tucson Affordable Housing Developments Receive New Tax Credit Financing',
    url: 'https://www.bisnow.com/phoenix/news/affordable-housing/tucson-tax-credit-financing',
    publishedDate: articleDates[27],
    source: 'Bisnow',
    region: 'Southwest'
  },
  {
    title: 'Albuquerque Mixed-Use Projects Revitalize Downtown District',
    url: 'https://www.globest.com/2025/03/25/albuquerque-downtown-revitalization',
    publishedDate: articleDates[28],
    source: 'GlobeSt',
    region: 'Southwest'
  },
  {
    title: 'Salt Lake City Life Sciences Real Estate Emerges as New Growth Sector',
    url: 'https://www.connectcre.com/salt-lake-city/slc-life-sciences-growth',
    publishedDate: articleDates[29],
    source: 'ConnectCRE',
    region: 'Southwest'
  },
  
  // Illinois Articles
  {
    title: "Chicago Suburban Office Markets See Renewed Interest from Corporate Users",
    url: 'https://www.bisnow.com/chicago/news/office/chicago-suburban-office-corporate-users',
    publishedDate: articleDates[29],
    source: 'Bisnow',
    region: 'Illinois'
  },
  {
    title: 'Illinois Logistics Corridor Attracts $1.5B in New Industrial Development',
    url: 'https://www.globest.com/2025/03/16/illinois-logistics-corridor-industrial-development',
    publishedDate: articleDates[30],
    source: 'GlobeSt',
    region: 'Illinois'
  },
  {
    title: 'Chicago Affordable Housing Initiatives Gain Momentum with New Tax Incentives',
    url: 'https://www.connectcre.com/chicago/chicago-affordable-housing-tax-incentives',
    publishedDate: articleDates[31],
    source: 'ConnectCRE',
    region: 'Illinois'
  },
  
  // Additional Bisnow Articles
  {
    title: "Blackstone Acquires $7.6B Portfolio of Last-Mile Distribution Centers",
    url: 'https://www.bisnow.com/national/news/industrial/blackstone-last-mile-portfolio-acquisition',
    publishedDate: articleDates[32],
    source: 'Bisnow',
    region: 'National'
  },
  {
    title: "WeWork's Restructuring Plan Approved by Bankruptcy Court",
    url: 'https://www.bisnow.com/national/news/coworking/wework-restructuring-plan-approved',
    publishedDate: articleDates[33],
    source: 'Bisnow',
    region: 'National'
  },
  {
    title: "Prologis Launches $1B Climate Tech Investment Fund",
    url: 'https://www.bisnow.com/national/news/industrial/prologis-climate-tech-fund',
    publishedDate: articleDates[34],
    source: 'Bisnow',
    region: 'National'
  },
  {
    title: "New York City Office Conversions Accelerate as Vacancy Rates Remain High",
    url: 'https://www.bisnow.com/new-york/news/office/nyc-office-conversions-accelerate',
    publishedDate: articleDates[35],
    source: 'Bisnow',
    region: 'New York'
  },
  {
    title: "San Francisco's Transamerica Pyramid Undergoes $400M Renovation",
    url: 'https://www.bisnow.com/san-francisco/news/office/transamerica-pyramid-renovation',
    publishedDate: articleDates[36],
    source: 'Bisnow',
    region: 'California'
  },
  {
    title: "Houston Multifamily Developers Shift Focus To Suburban Markets",
    url: 'https://www.bisnow.com/houston/news/multifamily/houston-multifamily-developers-shift-focus-to-suburban-markets-112458',
    publishedDate: articleDates[20],
    source: 'Bisnow',
    region: 'Texas'
  },
  {
    title: "Boston's Seaport District Reaches 95% Office Occupancy Despite Market Trends",
    url: 'https://www.bisnow.com/boston/news/office/seaport-district-high-occupancy',
    publishedDate: articleDates[38],
    source: 'Bisnow',
    region: 'Northeast'
  },
  {
    title: "Chicago's Fulton Market Sees Surge in Life Sciences Development",
    url: 'https://www.bisnow.com/chicago/news/life-sciences/fulton-market-life-sciences',
    publishedDate: articleDates[39],
    source: 'Bisnow',
    region: 'Illinois'
  },
  {
    title: "Dallas-Fort Worth Leads Nation in Multifamily Construction Starts",
    url: 'https://www.bisnow.com/dallas-ft-worth/news/multifamily/dfw-multifamily-construction-leads-nation',
    publishedDate: articleDates[40],
    source: 'Bisnow',
    region: 'Texas'
  },
  {
    title: "Denver Office Market Sees Increased Demand For Class A Space Despite Remote Work Trends",
    url: 'https://www.bisnow.com/colorado/news/office/denver-office-market-sees-increased-demand-for-class-a-space-despite-remote-work-trends-115782',
    publishedDate: articleDates[14],
    source: 'Bisnow',
    region: 'West'
  },
  
  // Additional GlobeSt Articles
  {
    title: "Retail Sector Shows Resilience with Strong Q2 Performance",
    url: 'https://www.globest.com/2025/06/28/retail-sector-shows-resilience-strong-q2',
    publishedDate: articleDates[42],
    source: 'GlobeSt',
    region: 'National'
  },
  {
    title: "Self-Storage REITs Outperform All Other Property Sectors in First Half of 2025",
    url: 'https://www.globest.com/2025/06/25/self-storage-reits-outperform-all-sectors',
    publishedDate: articleDates[43],
    source: 'GlobeSt',
    region: 'National'
  },
  {
    title: "Multifamily Rent Growth Stabilizes After Two Years of Volatility",
    url: 'https://www.globest.com/2025/06/22/multifamily-rent-growth-stabilizes',
    publishedDate: articleDates[44],
    source: 'GlobeSt',
    region: 'National'
  },
  {
    title: "New York's Hudson Yards Phase 2 Secures $3.8B in Financing",
    url: 'https://www.globest.com/2025/06/20/hudson-yards-phase-2-financing',
    publishedDate: articleDates[45],
    source: 'GlobeSt',
    region: 'New York'
  },
  {
    title: "Los Angeles Office Market Shows Signs of Recovery in Premium Properties",
    url: 'https://www.globest.com/2025/06/18/los-angeles-office-market-recovery',
    publishedDate: articleDates[46],
    source: 'GlobeSt',
    region: 'California'
  },
  {
    title: "Miami's Industrial Market Tightens as E-commerce Demand Continues to Grow",
    url: 'https://www.globest.com/2025/06/15/miami-industrial-market-tightens',
    publishedDate: articleDates[47],
    source: 'GlobeSt',
    region: 'Florida'
  },
  {
    title: "Boston Life Sciences Real Estate Continues to Attract Institutional Capital",
    url: 'https://www.globest.com/2025/06/12/boston-life-sciences-institutional-capital',
    publishedDate: articleDates[48],
    source: 'GlobeSt',
    region: 'Northeast'
  },
  {
    title: "Chicago's Industrial Corridor Sees Record Low Vacancy Rates",
    url: 'https://www.globest.com/2025/06/10/chicago-industrial-corridor-low-vacancy',
    publishedDate: articleDates[49],
    source: 'GlobeSt',
    region: 'Illinois'
  },
  {
    title: "Austin Office Development Continues Despite National Slowdown",
    url: 'https://www.globest.com/2025/06/08/austin-office-development-continues',
    publishedDate: articleDates[50],
    source: 'GlobeSt',
    region: 'Texas'
  },
  {
    title: "Denver Multifamily Investment Reaches $2.5B in First Half of 2025",
    url: 'https://www.globest.com/2025/06/05/denver-multifamily-investment',
    publishedDate: articleDates[51],
    source: 'GlobeSt',
    region: 'West'
  },
  {
    title: 'Atlanta Multifamily Investments Surge as Population Growth Continues',
    url: 'https://www.globest.com/2022/05/17/atlanta-multifamily-investments-surge-as-population-growth-continues/',
    publishedDate: articleDates[13],
    source: 'GlobeSt',
    region: 'South'
  },
  
  // Additional ConnectCRE Articles
  {
    title: "Institutional Investors Increase Allocations to Commercial Real Estate",
    url: 'https://www.connectcre.com/stories/institutional-investors-increase-cre-allocations',
    publishedDate: articleDates[52],
    source: 'ConnectCRE',
    region: 'National'
  },
  {
    title: "Data Centers Emerge as Top-Performing Asset Class in 2025",
    url: 'https://www.connectcre.com/stories/data-centers-top-performing-asset-class',
    publishedDate: articleDates[53],
    source: 'ConnectCRE',
    region: 'National'
  },
  {
    title: "Green Building Standards Becoming Mandatory in Major Markets",
    url: 'https://www.connectcre.com/stories/green-building-standards-mandatory',
    publishedDate: articleDates[54],
    source: 'ConnectCRE',
    region: 'National'
  },
  {
    title: "Manhattan Office Leasing Activity Reaches Post-Pandemic High",
    url: 'https://www.connectcre.com/new-york/manhattan-office-leasing-post-pandemic-high',
    publishedDate: articleDates[55],
    source: 'ConnectCRE',
    region: 'New York'
  },
  {
    title: "San Diego Life Sciences Corridor Expands with Five New Developments",
    url: 'https://www.connectcre.com/san-diego/san-diego-life-sciences-expansion',
    publishedDate: articleDates[56],
    source: 'ConnectCRE',
    region: 'California'
  },
  {
    title: "Orlando's Tourism Corridor Sees Surge in Hotel Development",
    url: 'https://www.connectcre.com/orlando/orlando-tourism-hotel-development',
    publishedDate: articleDates[57],
    source: 'ConnectCRE',
    region: 'Florida'
  },
  {
    title: "Philadelphia's Navy Yard Redevelopment Attracts Major Life Sciences Tenants",
    url: 'https://www.connectcre.com/philadelphia/navy-yard-life-sciences-tenants',
    publishedDate: articleDates[58],
    source: 'ConnectCRE',
    region: 'Northeast'
  },
  {
    title: "Chicago's Fulton Market Continues Transformation with New Mixed-Use Projects",
    url: 'https://www.connectcre.com/chicago/fulton-market-mixed-use-projects',
    publishedDate: articleDates[59],
    source: 'ConnectCRE',
    region: 'Illinois'
  },
  {
    title: "Houston Energy Corridor Sees Renewed Office Demand as Energy Prices Stabilize",
    url: 'https://www.connectcre.com/houston/energy-corridor-office-demand',
    publishedDate: articleDates[60],
    source: 'ConnectCRE',
    region: 'Texas'
  },
  {
    title: 'Phoenix Industrial Market Sets New Records for Construction and Absorption',
    url: 'https://www.connectcre.com/phoenix/phoenix-industrial-market-sets-new-records-for-construction-and-absorption/',
    publishedDate: articleDates[61],
    source: 'ConnectCRE',
    region: 'West'
  }
  ];
  
  return articles;
}

// Export the mock articles
export const mockArticles: Article[] = generateArticles();
