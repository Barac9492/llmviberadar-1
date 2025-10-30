'use client';

import { RankingItem } from '@/types';
import { getModelDisplayName, getModelColor } from '@/lib/constants';

interface ModelComparisonProps {
  rankings: {
    [model: string]: RankingItem[];
  };
}

export default function ModelComparison({ rankings }: ModelComparisonProps) {
  const models = Object.keys(rankings);

  if (models.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500">No rankings available</p>
      </div>
    );
  }

  // Get max number of items across all models
  const maxItems = Math.max(
    ...models.map((model) => rankings[model]?.length || 0)
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Rank
            </th>
            {models.map((model) => (
              <th
                key={model}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider border-b"
                style={{ color: getModelColor(model) }}
              >
                {getModelDisplayName(model)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: maxItems }, (_, index) => {
            const rank = index + 1;
            return (
              <tr key={rank} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{rank}
                </td>
                {models.map((model) => {
                  const item = rankings[model]?.[index];
                  return (
                    <td
                      key={model}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {item ? (
                        <span className="block">{item.item_name}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Consensus indicator */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Consensus Analysis:</span>{' '}
          {calculateConsensus(rankings)}
        </p>
      </div>
    </div>
  );
}

/**
 * Calculate how much agreement there is between models
 */
function calculateConsensus(rankings: {
  [model: string]: RankingItem[];
}): string {
  const models = Object.keys(rankings);
  if (models.length < 2) return 'Not enough models to compare';

  // Check if top item is the same across all models
  const topItems = models.map((model) => rankings[model]?.[0]?.item_name);
  const uniqueTopItems = new Set(topItems.filter(Boolean));

  if (uniqueTopItems.size === 1) {
    return `All ${models.length} models agree on #1: ${topItems[0]}`;
  }

  // Count how many models agree on the top item
  const topItemCounts: { [item: string]: number } = {};
  topItems.forEach((item) => {
    if (item) {
      topItemCounts[item] = (topItemCounts[item] || 0) + 1;
    }
  });

  const mostCommon = Object.entries(topItemCounts).sort(
    ([, a], [, b]) => b - a
  )[0];

  if (mostCommon) {
    const [item, count] = mostCommon;
    return `${count}/${models.length} models rank "${item}" as #1`;
  }

  return 'Models show significant disagreement';
}
