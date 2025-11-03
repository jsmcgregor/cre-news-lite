/**
 * API Route for Market Rates
 * 
 * Fetches market rates from Chatham Financial and returns them
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

interface MarketRate {
  name: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  lastUpdated: string;
}

export async function GET() {
  try {
    const url = 'https://www.chathamfinancial.com/technology/us-market-rates';

    // Try Puppeteer first to render client-side tables
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('h2, h3, h4', { timeout: 10000 });

      const results = await page.evaluate(() => {
        const findTableByHeading = (headingText: string): HTMLTableElement | null => {
          const headings = Array.from(document.querySelectorAll('h2, h3, h4')) as HTMLElement[];
          const heading = headings.find((el) => el.textContent?.trim().toLowerCase().includes(headingText.toLowerCase()));
          if (!heading) return null;
          let el: Element | null = heading;
          for (let i = 0; i < 10 && el; i++) {
            el = el.nextElementSibling;
            if (!el) break;
            if (el.tagName && el.tagName.toLowerCase() === 'table') return el as HTMLTableElement;
          }
          const table = heading.parentElement?.querySelector('table');
          return (table as HTMLTableElement) || null;
        };

        const getCurrentFromTable = (table: HTMLTableElement | null, rowLabelMatchers: (string|RegExp)[]): string | null => {
          if (!table) return null;
          const firstRow = (table.tHead?.rows[0] || table.rows[0]) as HTMLTableRowElement | undefined;
          const headers = firstRow ? Array.from(firstRow.cells).map((c) => c.textContent?.trim() || '') : [];
          let currentIdx = headers.findIndex((h) => /current/i.test(h));
          if (currentIdx === -1) currentIdx = 1;
          const rows = table.tBodies.length ? Array.from(table.tBodies[0].rows) : Array.from(table.rows).slice(1);
          for (const tr of rows) {
            const cells = Array.from(tr.cells);
            if (!cells.length) continue;
            const label = (cells[0].textContent || '').trim().toLowerCase();
            const matched = rowLabelMatchers.some((m) => (typeof m === 'string' ? label.includes(m.toLowerCase()) : m.test(label)));
            if (matched) {
              const raw = (cells[currentIdx]?.textContent || '').trim().replace(/\s+/g, ' ');
              const pct = raw.match(/-?\d+(?:\.\d+)?%/);
              return pct ? pct[0] : raw;
            }
          }
          return null;
        };

        const tenY = getCurrentFromTable(
          findTableByHeading('US Treasuries') || findTableByHeading('Treasuries'),
          [/^\s*10\s*(year|yr|y)\b/, /^\s*10y\b/, /^\s*10-?yr\b/]
        );
        const thirtyY = getCurrentFromTable(
          findTableByHeading('US Treasuries') || findTableByHeading('Treasuries'),
          [/^\s*30\s*(year|yr|y)\b/, /^\s*30y\b/, /^\s*30-?yr\b/]
        );
        const tenYSwap = getCurrentFromTable(
          findTableByHeading('Fixed Rate Swaps (SOFR)') || findTableByHeading('SOFR Swaps') || findTableByHeading('Swaps'),
          [/^\s*10\s*(year|yr|y)\b/, /^\s*10y\b/, /^\s*10-?yr\b/]
        );
        const sofr = getCurrentFromTable(
          findTableByHeading('Overnight Rates') || findTableByHeading('Overnight'),
          [/\bsofr\b/]
        );
        const prime = getCurrentFromTable(
          findTableByHeading('Base Rates') || findTableByHeading('Prime'),
          [/\bprime\b/]
        );

        return { tenY, thirtyY, tenYSwap, sofr, prime };
      });

      await browser.close();

      const now = new Date().toISOString();
      const out: MarketRate[] = [];
      if (results.tenY) out.push({ name: '10-Year Treasury', value: results.tenY, lastUpdated: now });
      if (results.tenYSwap) out.push({ name: '10-Year SOFR Swap', value: results.tenYSwap, lastUpdated: now });
      if (results.sofr) out.push({ name: 'SOFR', value: results.sofr, lastUpdated: now });
      if (results.prime) out.push({ name: 'Prime Rate', value: results.prime, lastUpdated: now });
      if (results.thirtyY) out.push({ name: '30-Year Treasury', value: results.thirtyY, lastUpdated: now });

      if (out.length > 0) {
        return NextResponse.json(out, {
          status: 200,
          headers: { 'Cache-Control': 'max-age=300' },
        });
      }
    } catch (e) {
      console.warn('[market-rates] puppeteer scrape failed, falling back:', e);
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      // @ts-ignore - node-fetch option
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    console.log('[market-rates] fetched html length:', html.length);
    console.log('[market-rates] html snippet:', html.slice(0, 500).replace(/\n/g, ' '));
    const $ = cheerio.load(html);

    const findTableByHeading = (headingText: string) => {
      const heading = $("h2, h3, h4").filter((_, el) => $(el).text().trim().toLowerCase().includes(headingText.toLowerCase())).first();
      if (!heading.length) return null;
      const table = heading.nextAll('table').first();
      return table.length ? table : null;
    };

    const getCurrentFromTable = (table: cheerio.Cheerio<any>, rowLabelMatchers: (string|RegExp)[]): string | null => {
      if (!table) return null;
      const headers = table.find('thead th, thead td, tr').first().find('th,td').map((_, el) => $(el).text().trim()).get();
      const currentIdx = headers.findIndex(h => /current/i.test(h)) !== -1 ? headers.findIndex(h => /current/i.test(h)) : 1;
      const rows = table.find('tbody tr').length ? table.find('tbody tr') : table.find('tr');
      let value: string | null = null;
      rows.each((_, tr) => {
        const cells = $(tr).find('th,td');
        const label = $(cells.get(0)).text().trim();
        const lower = label.toLowerCase();
        const matched = rowLabelMatchers.some((m) => {
          if (typeof m === 'string') return lower.includes(m.toLowerCase());
          return m.test(lower);
        });
        if (matched) {
          const raw = $(cells.get(currentIdx)).text().trim();
          if (raw) {
            const compact = raw.replace(/\s+/g, ' ');
            const pct = compact.match(/-?\d+(?:\.\d+)?%/);
            value = pct ? pct[0] : compact;
            return false;
          }
        }
      });
      return value;
    };

    const now = new Date().toISOString();

    // US Treasuries
    const treasuriesTable = findTableByHeading('US Treasuries') || findTableByHeading('Treasuries');
    console.log('[market-rates] treasuriesTable found:', !!treasuriesTable);
    if (!treasuriesTable) console.warn('Treasuries table not found');
    const tenY = getCurrentFromTable(treasuriesTable as any, [/^\s*10\s*(year|yr|y)\b/, /^\s*10y\b/, /^\s*10-?yr\b/]);
    const thirtyY = getCurrentFromTable(treasuriesTable as any, [/^\s*30\s*(year|yr|y)\b/, /^\s*30y\b/, /^\s*30-?yr\b/]);

    // SOFR Swaps
    const swapsTable = findTableByHeading('Fixed Rate Swaps (SOFR)') || findTableByHeading('SOFR Swaps') || findTableByHeading('Swaps');
    console.log('[market-rates] swapsTable found:', !!swapsTable);
    if (!swapsTable) console.warn('SOFR swaps table not found');
    const tenYSwap = getCurrentFromTable(swapsTable as any, [/^\s*10\s*(year|yr|y)\b/, /^\s*10y\b/, /^\s*10-?yr\b/]);

    // SOFR (Overnight)
    const overnightTable = findTableByHeading('Overnight Rates') || findTableByHeading('Overnight');
    console.log('[market-rates] overnightTable found:', !!overnightTable);
    if (!overnightTable) console.warn('Overnight rates table not found');
    const sofr = getCurrentFromTable(overnightTable as any, [/\bsofr\b/]);

    // Prime Rate (Base rates)
    const baseRatesTable = findTableByHeading('Base Rates') || findTableByHeading('Prime');
    console.log('[market-rates] baseRatesTable found:', !!baseRatesTable);
    if (!baseRatesTable) console.warn('Base rates table not found');
    const prime = getCurrentFromTable(baseRatesTable as any, [/\bprime\b/]);

    console.log('[market-rates] parsed values:', { tenY, tenYSwap, sofr, prime, thirtyY });
    const out: MarketRate[] = [];
    if (tenY) out.push({ name: '10-Year Treasury', value: tenY, lastUpdated: now });
    if (tenYSwap) out.push({ name: '10-Year SOFR Swap', value: tenYSwap, lastUpdated: now });
    if (sofr) out.push({ name: 'SOFR', value: sofr, lastUpdated: now });
    if (prime) out.push({ name: 'Prime Rate', value: prime, lastUpdated: now });
    if (thirtyY) out.push({ name: '30-Year Treasury', value: thirtyY, lastUpdated: now });

    if (out.length === 0) {
      return NextResponse.json(getFallbackRates());
    }

    return NextResponse.json(out, {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (error) {
    console.error('Error fetching Chatham rates:', error);
    
    // Return fallback data
    return NextResponse.json(getFallbackRates());
  }
}

/**
 * Get fallback rates in case of API failure
 */
function getFallbackRates(): MarketRate[] {
  const now = new Date().toISOString();
  
  return [
    {
      name: '10-Year Treasury',
      value: '4.35%',
      change: '0.02',
      isPositive: true,
      lastUpdated: now
    },
    {
      name: '10-Year SOFR Swap',
      value: '4.42%',
      change: '0.03',
      isPositive: true,
      lastUpdated: now
    },
    {
      name: 'SOFR',
      value: '5.31%',
      change: '0.00',
      isPositive: true,
      lastUpdated: now
    },
    {
      name: 'Prime Rate',
      value: '8.50%',
      change: '0.00',
      isPositive: true,
      lastUpdated: now
    }
  ];
}
