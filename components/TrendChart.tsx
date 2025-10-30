'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { TimelinePoint } from '@/types';
import { getModelColor, getModelDisplayName } from '@/lib/constants';

interface TrendChartProps {
  timeline: TimelinePoint[];
  itemName?: string; // Optional: track a specific item across models
}

/**
 * Transform timeline data for Recharts
 * If itemName is provided, track that item's rank across models
 * Otherwise, show all rankings
 */
function transformDataForChart(timeline: TimelinePoint[], itemName?: string) {
  return timeline.map((point) => {
    const dataPoint: any = {
      date: format(new Date(point.timestamp), 'MMM dd'),
      timestamp: point.timestamp,
    };

    // For each model, get the rank of the specified item (or first item if no itemName)
    Object.entries(point.rankings).forEach(([model, rankings]) => {
      if (itemName) {
        const item = rankings.find((r) => r.item_name === itemName);
        dataPoint[model] = item ? item.rank : null;
      } else {
        // If no specific item, show rank 1 item for each model
        dataPoint[model] = rankings[0]?.rank || null;
      }
    });

    return dataPoint;
  });
}

/**
 * Get all unique models from the timeline
 */
function getModelsFromTimeline(timeline: TimelinePoint[]): string[] {
  const models = new Set<string>();
  timeline.forEach((point) => {
    Object.keys(point.rankings).forEach((model) => models.add(model));
  });
  return Array.from(models);
}

export default function TrendChart({ timeline, itemName }: TrendChartProps) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No historical data available yet</p>
      </div>
    );
  }

  const data = transformDataForChart(timeline, itemName);
  const models = getModelsFromTimeline(timeline);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            reversed
            domain={[1, 'auto']}
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
            label={{
              value: 'Rank',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '14px', fill: '#6B7280' },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '1rem' }}
            iconType="line"
          />
          {models.map((model) => (
            <Line
              key={model}
              type="monotone"
              dataKey={model}
              stroke={getModelColor(model)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name={getModelDisplayName(model)}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {itemName && (
        <p className="text-sm text-gray-600 mt-2 text-center">
          Tracking rankings for: <span className="font-semibold">{itemName}</span>
        </p>
      )}
    </div>
  );
}
