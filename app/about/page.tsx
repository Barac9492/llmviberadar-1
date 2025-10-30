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
            Korea AI Perception Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Tracking how AI models view Korea, Korean brands, and Korean culture
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
              Korea AI Perception Tracker reveals how the world&apos;s leading AI models
              (Claude Sonnet 4.5 and GPT-4 Turbo) rank Korean brands, culture, and innovation.
              We track Korea&apos;s &quot;AI mindshare&quot; - from Samsung vs Apple, to K-pop&apos;s
              global influence, to Korean cuisine rankings. Essential intelligence for Korean
              companies, investors, and anyone tracking Korea&apos;s global brand strength.
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
                  We ask Claude Sonnet 4.5 and GPT-4 Turbo 25 Korea-focused questions
                  every 24 hours - covering technology, culture, tourism, and innovation.
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
                  <strong>Korean Companies</strong> - Samsung, LG, Hyundai, HYBE, Naver -
                  track how AI models rank you vs global competitors
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Korean Tourism & Government</strong> - Monitor Korea&apos;s global
                  brand perception and identify opportunities to improve AI visibility
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>K-pop Agencies & Entertainment</strong> - Track cultural influence
                  and how AI models rank Korean entertainment globally
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Investors & Analysts</strong> - Gauge Korea&apos;s brand strength
                  in tech, culture, and innovation before it shows in market data
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <p>
                  <strong>Korean Startups & Founders</strong> - Understand global positioning
                  and optimize for AI-powered discovery
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
            Korea AI Perception Tracker - 한국의 AI 브랜드 파워 추적
          </p>
        </div>
      </footer>
    </div>
  );
}
