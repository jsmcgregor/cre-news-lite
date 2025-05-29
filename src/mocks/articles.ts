import { Article } from '../../types/article';

// Function to generate dates in the past few days
const getRandomDate = () => {
  const days = Math.floor(Math.random() * 14); // Random number of days from 0-14
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString();
};

// Mock data with various articles for different regions
export const mockArticles: Article[] = [
  // National Articles
  {
    title: 'Federal Reserve Signals Rate Cuts Could Impact Commercial Real Estate Recovery',
    url: 'https://example.com/fed-impact-cre',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'National'
  },
  {
    title: 'REIT Performance Exceeds Market Expectations in Q1 Earnings',
    url: 'https://example.com/reit-q1-earnings',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'National'
  },
  {
    title: 'New Tax Legislation Could Reshape 1031 Exchange Market for CRE Investors',
    url: 'https://example.com/1031-exchange-changes',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'National'
  },
  {
    title: 'Office Vacancy Rates Expected to Stabilize by End of Year, Report Finds',
    url: 'https://example.com/office-vacancy-stabilize',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'National'
  },
  {
    title: 'Commercial Mortgage Delinquencies See First Quarterly Decline Since 2021',
    url: 'https://example.com/mortgage-delinquencies',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'National'
  },
  // Northeast Articles
  {
    title: 'New York Office Market Shows Signs of Recovery as Tech Companies Return',
    url: 'https://example.com/ny-recovery',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Northeast'
  },
  {
    title: 'Boston Life Sciences Real Estate Hits $1.2B in Q1 Transactions',
    url: 'https://example.com/boston-lifesciences',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'Northeast'
  },
  {
    title: 'Pennsylvania Industrial Corridor Sees Unprecedented Growth Near Logistics Hubs',
    url: 'https://example.com/pa-industrial',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'Northeast'
  },
  {
    title: 'Manhattan Retail Spaces Find New Life with Experiential Tenants',
    url: 'https://example.com/manhattan-retail',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Northeast'
  },
  {
    title: 'New Jersey Multifamily Developments Target Suburban Migration Trend',
    url: 'https://example.com/nj-multifamily',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'Northeast'
  },

  // West Articles
  {
    title: 'San Francisco Tech Companies Return to Office Space, Reversing Remote Work Trend',
    url: 'https://example.com/sf-return',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'West'
  },
  {
    title: 'Seattle Data Center Demand Continues to Rise with Cloud Computing Expansion',
    url: 'https://example.com/seattle-data',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'West'
  },
  {
    title: 'Portland Mixed-Use Developments Focus on Sustainability and Community Impact',
    url: 'https://example.com/portland-mixed',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'West'
  },
  {
    title: 'Los Angeles Entertainment Studio Space Expands Amid Streaming Content Boom',
    url: 'https://example.com/la-studios',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'West'
  },
  {
    title: 'Bay Area Life Sciences Campuses Attract $3B in New Investment',
    url: 'https://example.com/bayarea-lifesciences',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'West'
  },

  // Midwest Articles
  {
    title: 'Chicago Industrial Real Estate Boom Continues with E-commerce Growth',
    url: 'https://example.com/chicago-industrial',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'Midwest'
  },
  {
    title: 'Detroit Automotive Industry Drives New Manufacturing Facility Developments',
    url: 'https://example.com/detroit-auto',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Midwest'
  },
  {
    title: 'Minneapolis Office-to-Residential Conversions Address Housing Shortage',
    url: 'https://example.com/minneapolis-conversion',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'Midwest'
  },
  {
    title: 'Cleveland Healthcare Real Estate Expands with New Medical Office Buildings',
    url: 'https://example.com/cleveland-healthcare',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'Midwest'
  },
  {
    title: 'Indianapolis Logistics Hub Attracts Major Distribution Centers',
    url: 'https://example.com/indy-logistics',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Midwest'
  },

  // South Articles
  {
    title: 'Miami Multifamily Growth Outpaces National Average for Third Consecutive Quarter',
    url: 'https://example.com/miami-multifamily',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'South'
  },
  {
    title: 'Austin Tech Corridor Expands with New Corporate Campuses Breaking Ground',
    url: 'https://example.com/austin-tech',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'South'
  },
  {
    title: 'Dallas-Fort Worth Leads Nation in Industrial Space Under Construction',
    url: 'https://example.com/dfw-industrial',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'South'
  },
  {
    title: 'Nashville Hospitality Sector Rebounds with New Hotel Developments Downtown',
    url: 'https://example.com/nashville-hotels',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'South'
  },
  {
    title: 'Atlanta Office Market Sees Positive Absorption for First Time Since Pandemic',
    url: 'https://example.com/atlanta-office',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'South'
  },

  // Southwest Articles
  {
    title: 'Phoenix Industrial Market Sets New Records for Absorption and Development',
    url: 'https://example.com/phoenix-industrial',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Southwest'
  },
  {
    title: 'Las Vegas Retail Centers Transform with Experiential Shopping Concepts',
    url: 'https://example.com/vegas-retail',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'Southwest'
  },
  {
    title: 'Tucson Affordable Housing Developments Receive New Tax Credit Financing',
    url: 'https://example.com/tucson-affordable',
    publishedDate: getRandomDate(),
    source: 'Mock Bisnow',
    region: 'Southwest'
  },
  {
    title: 'Albuquerque Mixed-Use Projects Revitalize Downtown District',
    url: 'https://example.com/abq-downtown',
    publishedDate: getRandomDate(),
    source: 'Mock CRE News',
    region: 'Southwest'
  },
  {
    title: 'Salt Lake City Life Sciences Real Estate Emerges as New Growth Sector',
    url: 'https://example.com/slc-lifesciences',
    publishedDate: getRandomDate(),
    source: 'Mock REBusiness',
    region: 'Southwest'
  }
];
