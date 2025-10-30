import { NextResponse } from 'next/server';
import { getAllQueriesWithLatestRankings, getQueriesByCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/queries
 * Returns all queries with their latest rankings
 * Optional query param: category
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let queries;
    if (category) {
      const categoryQueries = await getQueriesByCategory(category);
      // For category queries, we still want the latest rankings
      queries = [];
      const { getLatestRankings } = await import('@/lib/db');
      for (const query of categoryQueries) {
        const latestRankings = await getLatestRankings(query.id);
        queries.push({
          ...query,
          latest_rankings: latestRankings,
        });
      }
    } else {
      queries = await getAllQueriesWithLatestRankings();
    }

    return NextResponse.json({
      success: true,
      data: queries,
      count: queries.length,
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch queries',
      },
      { status: 500 }
    );
  }
}
