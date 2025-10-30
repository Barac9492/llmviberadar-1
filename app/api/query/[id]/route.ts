import { NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/query/[id]
 * Returns a single query with historical data
 * Optional query param: days (default: 30)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const queryId = parseInt(id, 10);

    if (isNaN(queryId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query ID',
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const historicalData = await getHistoricalData(queryId, days);

    if (!historicalData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: historicalData,
    });
  } catch (error) {
    console.error('Error fetching query:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch query data',
      },
      { status: 500 }
    );
  }
}
