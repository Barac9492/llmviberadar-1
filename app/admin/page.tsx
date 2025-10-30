'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const triggerQueries = async () => {
    setLoading(true);
    setStatus('Starting queries... This will take 2-5 minutes.');

    try {
      const response = await fetch('/api/cron/run-queries', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer llm-vibes-radar-secret-2024',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ Success! ${data.message}\nTime: ${data.timestamp}`);
      } else {
        setStatus(`❌ Error: ${data.error}\n${data.details || ''}`);
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-600 mb-8">
            Manually trigger the daily AI queries. This will query all 20
            questions across Claude, GPT-4, and Gemini.
          </p>

          <button
            onClick={triggerQueries}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Running Queries...' : '🚀 Run All Queries Now'}
          </button>

          {status && (
            <div
              className={`mt-6 p-4 rounded-lg whitespace-pre-wrap ${
                status.startsWith('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : status.startsWith('❌')
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              {status}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Note:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• This process takes 2-5 minutes</li>
              <li>• It makes 60 API calls (20 queries × 3 models)</li>
              <li>• Costs approximately $0.50-1.00 per run</li>
              <li>• Results are saved to the database</li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
