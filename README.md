# CRE News Lite

A commercial real estate news aggregator that scrapes articles from various sources including Bisnow and GlobeSt.

## Quick Start

The easiest way to start the application is to use the included batch file:

1. Double-click on `start-app.bat` in the project root directory
2. Wait for the server to start (you'll see "Ready" in the console)
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Real-time scraping of commercial real estate news from multiple sources
- Article filtering by region and source
- Pagination for browsing large sets of articles
- Responsive design for desktop and mobile viewing

## Manual Setup

If you prefer to start the application manually:

```bash
# Navigate to the project directory
cd C:\Users\sterl\CascadeProjects\cre-news-lite

# Install dependencies (only needed once or when dependencies change)
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Configuration

The application is configured to use real data from scrapers by default. This configuration is set in `src/config.ts`.

Key configuration options:
- `USE_MOCK_DATA`: Set to `false` to use real scraped data
- `ENABLE_SOURCES`: List of enabled scraper sources
- `CACHE_DURATION`: How long to cache scraped articles

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
