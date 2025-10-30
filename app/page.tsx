import QueryCard from '@/components/QueryCard';
import { getAllQueriesWithLatestRankings } from '@/lib/db';
import { CATEGORIES } from '@/lib/constants';

export const dynamic = 'force-dynamic'; // Use dynamic rendering
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const queries = await getAllQueriesWithLatestRankings();

  // Group queries by category
  const queriesByCategory = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = queries.filter((q) => q.category === category);
      return acc;
    },
    {} as Record<string, typeof queries>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LLM Vibes Radar
          </h1>
          <p className="text-lg text-gray-600">
            Track and compare how different AI models rank opinions on
            everything
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {queries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No queries yet
            </h2>
            <p className="text-gray-600 mb-6">
              Add some queries to start tracking AI opinions!
            </p>
            <p className="text-sm text-gray-500">
              Run the seed script to add initial queries
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {CATEGORIES.map((category) => {
              const categoryQueries = queriesByCategory[category];
              if (!categoryQueries || categoryQueries.length === 0) {
                return null;
              }

              return (
                <section key={category}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryQueries.map((query) => (
                      <QueryCard key={query.id} query={query} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Stats section */}
        {queries.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {queries.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Queries Tracked
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {Object.keys(queries[0]?.latest_rankings || {}).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">AI Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {CATEGORIES.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Categories</div>
              </div>
            </div>
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
