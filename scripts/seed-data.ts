#!/usr/bin/env ts-node

import { createQuery } from '../lib/db';

const SEED_QUERIES = [
  // Food & Restaurants (5 queries)
  {
    question: 'Best burger in San Francisco',
    category: 'Food & Restaurants',
  },
  {
    question: 'Top pizza places in NYC',
    category: 'Food & Restaurants',
  },
  {
    question: 'Best ramen in Tokyo',
    category: 'Food & Restaurants',
  },
  {
    question: 'Michelin-worthy restaurants under $100',
    category: 'Food & Restaurants',
  },
  {
    question: 'Best coffee shops for remote work',
    category: 'Food & Restaurants',
  },

  // Tech & Products (5 queries)
  {
    question: 'Best laptop under $1000',
    category: 'Tech & Products',
  },
  {
    question: 'iPhone vs Android in 2024',
    category: 'Tech & Products',
  },
  {
    question: 'Best VPN service',
    category: 'Tech & Products',
  },
  {
    question: 'Top AI coding assistants',
    category: 'Tech & Products',
  },
  {
    question: 'Best noise-cancelling headphones',
    category: 'Tech & Products',
  },

  // Politics & Society (3 queries)
  {
    question: 'Most effective climate change solutions',
    category: 'Politics & Society',
  },
  {
    question: 'Best countries for quality of life',
    category: 'Politics & Society',
  },
  {
    question: 'Most influential tech leaders',
    category: 'Politics & Society',
  },

  // Entertainment (4 queries)
  {
    question: 'Best movies of 2024',
    category: 'Entertainment',
  },
  {
    question: 'Top Netflix shows right now',
    category: 'Entertainment',
  },
  {
    question: 'Best video games of all time',
    category: 'Entertainment',
  },
  {
    question: 'Greatest basketball player ever',
    category: 'Entertainment',
  },

  // Career & Education (3 queries)
  {
    question: 'Best programming language to learn first',
    category: 'Career & Education',
  },
  {
    question: 'Highest paying careers in 2024',
    category: 'Career & Education',
  },
  {
    question: 'Best online learning platforms',
    category: 'Career & Education',
  },
];

async function seedDatabase() {
  console.log('Starting database seeding...');
  console.log(`Creating ${SEED_QUERIES.length} queries\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const { question, category } of SEED_QUERIES) {
    try {
      const result = await createQuery(question, category);
      if (result) {
        console.log(`✓ Created: "${question}" [${category}]`);
        successCount++;
      } else {
        console.error(`✗ Failed to create: "${question}"`);
        errorCount++;
      }
    } catch (error) {
      console.error(`✗ Error creating "${question}":`, error);
      errorCount++;
    }
  }

  console.log('\n=== Seeding Complete ===');
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Errors: ${errorCount}`);
  console.log(`Total: ${SEED_QUERIES.length}`);
}

// Run if executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\nDatabase seeded successfully!');
      console.log('Run the daily-queries script to populate with initial data.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
