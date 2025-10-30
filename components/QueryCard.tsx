'use client';

import Link from 'next/link';
import { QueryWithLatestRankings } from '@/types';
import { CATEGORY_COLORS } from '@/lib/constants';

interface QueryCardProps {
  query: QueryWithLatestRankings;
}

export default function QueryCard({ query }: QueryCardProps) {
  const models = Object.keys(query.latest_rankings);
  const hasData = models.length > 0 && models.some(
    (model) => query.latest_rankings[model].length > 0
  );

  // Get top ranked item from first available model for preview
  const topItem = hasData
    ? query.latest_rankings[models[0]]?.[0]?.item_name || 'No data yet'
    : 'No data yet';

  const categoryColor =
    CATEGORY_COLORS[query.category as keyof typeof CATEGORY_COLORS] ||
    'bg-gray-100 text-gray-800';

  return (
    <Link href={`/query/${query.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Category badge */}
        <div className="mb-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}
          >
            {query.category}
          </span>
        </div>

        {/* Question */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
          {query.question}
        </h3>

        {/* Preview of top result */}
        <div className="flex-grow">
          {hasData ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Top ranked:</p>
              <p className="text-sm font-medium text-gray-700">{topItem}</p>
              <div className="flex gap-2 mt-2">
                {models.slice(0, 3).map((model) => (
                  <div
                    key={model}
                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                  >
                    {model}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">
              Collecting data...
            </div>
          )}
        </div>

        {/* View details link */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View trends →
          </span>
        </div>
      </div>
    </Link>
  );
}
