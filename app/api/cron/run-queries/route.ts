import { NextResponse } from 'next/server';
import runDailyQueries from '@/scripts/daily-queries';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for cron job

/**
 * POST /api/cron/run-queries
 * Protected endpoint to trigger daily queries
 * Requires CRON_SECRET in headers
 */
export async function POST(request: Request) {
  try {
    // Verify the cron secret
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.error('CRON_SECRET not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('Unauthorized cron request');
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Run the daily queries
    console.log('Starting scheduled query run...');
    await runDailyQueries();

    return NextResponse.json({
      success: true,
      message: 'Daily queries completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error running daily queries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run daily queries',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/run-queries
 * Returns cron status (for health checks)
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Cron endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
