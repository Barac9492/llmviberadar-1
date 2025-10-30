import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getHistoricalData, getLatestRankings } from '@/lib/db';
import TrendChart from '@/components/TrendChart';
import ModelComparison from '@/components/ModelComparison';
import { CATEGORY_COLORS } from '@/lib/constants';

export const dynamic = 'force-dynamic'; // Use dynamic rendering
export const revalidate = 86400; // Revalidate every 24 hours (ISR)

interface QueryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QueryPage({ params }: QueryPageProps) {
  const { id } = await params;
  const queryId = parseInt(id, 10);

  if (isNaN(queryId)) {
    notFound();
  }

  const historicalData = await getHistoricalData(queryId, 30);

  if (!historicalData || !historicalData.query) {
    notFound();
  }

  const { query, timeline } = historicalData;
  const latestRankings = await getLatestRankings(queryId);

  const categoryColor =
    CATEGORY_COLORS[query.category as keyof typeof CATEGORY_COLORS] ||
    'bg-gray-100 text-gray-800';

  const hasData = Object.keys(latestRankings).length > 0;
  const lastUpdate = timeline.length > 0
    ? new Date(timeline[timeline.length - 1].timestamp).toLocaleDateString()
    : 'No data yet';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back to all queries
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor} mb-3`}
              >
                {query.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {query.question}
              </h1>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasData ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Collecting data...
            </h2>
            <p className="text-gray-600">
              This query hasn&apos;t been run yet. Data will appear after the first
              daily update.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Trend Chart Section */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Ranking Trends (Last 30 Days)
              </h2>
              <TrendChart timeline={timeline} />
              <p className="text-sm text-gray-500 mt-4">
                Lower rank number = higher position. Rank 1 is the top choice.
              </p>
            </section>

            {/* Current Rankings Comparison */}
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Current Rankings Comparison
              </h2>
              <ModelComparison rankings={latestRankings} />
            </section>

            {/* Insights */}
            <section className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About This Query
              </h3>
              <p className="text-gray-700 mb-4">
                This query is run daily across multiple AI models. The chart
                above shows how rankings change over time, revealing shifts in
                AI opinions and potential biases.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Models tracked:</span>{' '}
                  {Object.keys(latestRankings).join(', ')}
                </div>
                <div>
                  <span className="font-semibold">Data points:</span>{' '}
                  {timeline.length} days
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>
            Tracking AI opinions across multiple models. Updated daily.
          </p>
          <p className="mt-2 text-sm">
            <a href="/about" className="text-blue-600 hover:underline">
              Learn more about our methodology
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
