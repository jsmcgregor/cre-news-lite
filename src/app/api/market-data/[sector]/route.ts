/**
 * API Route for CRE Market Data
 * 
 * Provides quarterly market data for Office, Industrial, Retail, and Multifamily sectors
 */

import { NextResponse } from 'next/server';
import { creMarketData } from '../../../../utils/scrapers/cre-market-data';

// Configure for static export
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET(
  request: Request,
  { params }: { params: { sector: string } }
) {
  try {
    const sector = params.sector.toLowerCase();
    
    // Validate sector parameter
    if (!['office', 'industrial', 'retail', 'multifamily'].includes(sector)) {
      return NextResponse.json(
        { error: `Invalid sector: ${sector}` },
        { status: 400 }
      );
    }
    
    // Get market data for the requested sector
    const marketData = await creMarketData.getSectorData(
      sector as 'office' | 'industrial' | 'retail' | 'multifamily'
    );
    
    return NextResponse.json(marketData, {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error(`Error fetching ${params.sector} market data:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
