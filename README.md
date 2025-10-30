# LLM Vibes Radar

Track and visualize how different AI models rank opinions on everything from burgers to political candidates.

## Overview

LLM Vibes Radar is a Next.js application that automatically queries multiple AI models (Claude, GPT-4, Gemini) with the same questions daily, tracks their rankings over time, and visualizes the data to reveal AI biases and opinion shifts.

## Features

- **Daily AI Queries**: Automatically runs queries across multiple AI models every 24 hours
- **Trend Visualization**: Google Trends-style charts showing ranking changes over time
- **Model Comparison**: Side-by-side comparison of current rankings
- **ISR (Incremental Static Regeneration)**: Fast page loads with automatic cache revalidation
- **Category Organization**: Queries organized by Food, Tech, Politics, Entertainment, and Career

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **AI SDKs**: Anthropic SDK, OpenAI SDK, Google Generative AI

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- API keys for:
  - Anthropic (Claude)
  - OpenAI (GPT-4)
  - Google AI (Gemini)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd llmviberadar-1
npm install
```

### 2. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the schema from `lib/schema.sql` to create tables

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# AI API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
# Gemini API Key (any of these variable names work)
# GEMINI_API_KEY=...
# GOOGLE_AI_API_KEY=...
# GOOGLE_API_KEY=...
# GOOGLE_GENAI_API_KEY=...
# NEXT_PUBLIC_GEMINI_API_KEY=...
# NEXT_PUBLIC_GOOGLE_AI_API_KEY=...
# NEXT_PUBLIC_GOOGLE_API_KEY=...
# NEXT_PUBLIC_GOOGLE_GENAI_API_KEY=...

# Cron Security (generate a random string)
CRON_SECRET=your-random-secret-here
```

### 4. Seed the Database

```bash
npx ts-node scripts/seed-data.ts
```

This will create 20 initial queries across different categories.

### 5. Run Initial Queries (Optional)

To populate with initial data immediately:

```bash
npx ts-node scripts/daily-queries.ts
```

Note: This will make API calls to all three AI providers and may take several minutes.

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
llmviberadar-1/
├── app/
│   ├── api/
│   │   ├── queries/          # API route for all queries
│   │   ├── query/[id]/       # API route for single query
│   │   └── cron/run-queries/ # Cron endpoint
│   ├── query/[id]/           # Query detail page
│   ├── about/                # About page
│   ├── page.tsx              # Homepage
│   └── layout.tsx            # Root layout
├── components/
│   ├── TrendChart.tsx        # Line chart component
│   ├── ModelComparison.tsx   # Comparison table
│   └── QueryCard.tsx         # Query preview card
├── lib/
│   ├── db.ts                 # Database helper functions
│   ├── ai-clients.ts         # AI API client utilities
│   ├── constants.ts          # App constants
│   └── schema.sql            # Database schema
├── scripts/
│   ├── daily-queries.ts      # Daily query runner
│   └── seed-data.ts          # Database seeding script
├── types/
│   └── index.ts              # TypeScript types
└── vercel.json               # Vercel cron configuration
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your repository
2. Add all environment variables from `.env.local` in the Vercel dashboard
3. Deploy

### 3. Set Up Cron Job

The `vercel.json` file configures a daily cron job at 2:00 AM UTC. Vercel will automatically set this up.

To manually trigger the cron job for testing:

```bash
curl -X POST https://your-app.vercel.app/api/cron/run-queries \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## API Endpoints

- `GET /api/queries` - Get all queries with latest rankings
- `GET /api/queries?category=Tech+%26+Products` - Filter by category
- `GET /api/query/[id]` - Get single query with historical data
- `GET /api/query/[id]?days=60` - Get data for custom time range
- `POST /api/cron/run-queries` - Trigger daily queries (protected)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx ts-node scripts/seed-data.ts` - Seed database with initial queries
- `npx ts-node scripts/daily-queries.ts` - Run queries manually

## Configuration

### ISR Revalidation

- Homepage: Revalidates every hour (`revalidate: 3600`)
- Query detail pages: Revalidates every 24 hours (`revalidate: 86400`)

### Cron Schedule

Daily queries run at 2:00 AM UTC (configured in `vercel.json`)

## Development Tips

### Testing Individual Queries

You can test a single query without running all of them:

```typescript
import { runSingleQuery } from './scripts/daily-queries';
runSingleQuery(1); // Query ID
```

### Adding New Queries

```typescript
import { createQuery } from './lib/db';
await createQuery('Your question here', 'Category Name');
```

### Debugging API Calls

Check Vercel logs or use local logging:

```bash
# View logs in development
tail -f .next/server.log
```

## Cost Estimates

### API Costs (Monthly)

- Claude API: ~$50-100
- OpenAI API: ~$50-100
- Google AI API: ~$50-100
- **Total API costs: $150-300/month**

### Infrastructure

- Vercel: Free tier or ~$20/month (Pro)
- Supabase: Free tier or ~$25/month (Pro)
- **Total infrastructure: $0-45/month**

**Total estimated monthly cost: $150-345**

## Troubleshooting

### Database Connection Issues

- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check that tables were created using `lib/schema.sql`
- Ensure Supabase project is not paused (free tier pauses after inactivity)

### API Rate Limits

- Claude: 50 requests/min
- OpenAI: 3,500 requests/min (tier 1)
- Gemini: 60 requests/min

The script includes 2-second delays between models and automatic retry logic.

### Cron Job Not Running

- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel cron logs in the dashboard
- Ensure `vercel.json` is in the root directory

## Future Enhancements

- [ ] Custom query submission by users
- [ ] Email alerts for ranking changes
- [ ] Export data to CSV
- [ ] API access for researchers
- [ ] More AI models (Llama, Mistral, etc.)
- [ ] B2B dashboard for brand monitoring

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Support

For issues or questions, please open a GitHub issue.
