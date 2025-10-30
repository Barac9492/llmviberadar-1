import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            About LLM Vibes Radar
          </h1>
          <p className="text-lg text-gray-600">
            Understanding our methodology and mission
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              LLM Vibes Radar tracks which brands and products AI models recommend.
              We reveal which companies have the strongest &quot;AI mindshare&quot; and how
              these recommendations change over time. Think of it as SEO for the AI age -
              helping businesses understand their visibility in AI-powered recommendations.
            </p>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Daily Queries
                </h3>
                <p>
                  We run product and service ranking questions across Claude Sonnet 4.5
                  and GPT-4 Turbo every 24 hours to track which brands they recommend.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Structured Responses
                </h3>
                <p>
                  Each AI is asked to provide rankings in a consistent,
                  numbered list format to ensure accurate comparison.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Historical Tracking
                </h3>
                <p>
                  We store all responses over time, allowing you to see how AI
                  opinions evolve and identify patterns or biases.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  4. Visualization
                </h3>
                <p>
                  Our Google Trends-style charts make it easy to spot changes,
                  consensus, and disagreements between models.
                </p>
              </div>
            </div>
          </section>

          {/* Models Tracked */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              AI Models We Track
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Claude Sonnet 4.5</h3>
                <p className="text-sm text-gray-600">
                  Anthropic&apos;s latest flagship model, released September 2025
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">GPT-4 Turbo</h3>
                <p className="text-sm text-gray-600">
                  OpenAI&apos;s advanced model with extended context
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Who Is This For?
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Product & Marketing Teams</strong> - Track your brand&apos;s AI visibility
                  and monitor competitive positioning
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Investors & Analysts</strong> - Identify which brands are winning
                  AI mindshare before it shows in market metrics
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Developers & Founders</strong> - Optimize your product for AI
                  recommendation engines and track AI SEO performance
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Tech Enthusiasts</strong> - Discover which products AI models
                  consistently recommend and compare their preferences
                </p>
              </div>
            </div>
          </section>

          {/* Methodology */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Data Accuracy & Limitations
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="mb-2">
                <strong>Important:</strong> AI responses can vary based on:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Training data and model updates</li>
                <li>Temperature and randomness settings</li>
                <li>Query phrasing and context</li>
                <li>Time-sensitive information</li>
              </ul>
              <p className="mt-3">
                Our rankings represent AI opinions at specific points in time
                and should not be considered absolute truths.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  How often is data updated?
                </h3>
                <p className="text-gray-700">
                  All queries are run once every 24 hours at 2:00 AM UTC.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Can I suggest a query to track?
                </h3>
                <p className="text-gray-700">
                  Custom query submission is coming soon! For now, we&apos;re
                  tracking a curated set of interesting questions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Is this data available via API?
                </h3>
                <p className="text-gray-700">
                  API access for researchers is planned for a future release.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>
            LLM Vibes Radar - Tracking Brand AI Mindshare Across Leading Models
          </p>
        </div>
      </footer>
    </div>
  );
}
