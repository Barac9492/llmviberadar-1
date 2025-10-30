#!/usr/bin/env ts-node

import { getAllQueries, saveResponse, saveRankings } from '../lib/db';
import { queryAndParseModel } from '../lib/ai-clients';
import { AIModel } from '../types';

const MODELS: AIModel[] = ['claude', 'gpt-4', 'gemini'];

/**
 * Run all queries for all models
 */
async function runDailyQueries() {
  console.log('Starting daily queries...');
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    // Get all queries from database
    const queries = await getAllQueries();
    console.log(`Found ${queries.length} queries to process`);

    if (queries.length === 0) {
      console.log('No queries found. Exiting.');
      return;
    }

    // Process each query
    for (const query of queries) {
      console.log(`\nProcessing query ${query.id}: "${query.question}"`);

      // Query each model
      for (const modelName of MODELS) {
        try {
          console.log(`  Querying ${modelName}...`);

          const { response, rankings } = await queryAndParseModel(
            modelName,
            query.question
          );

          // Save the response
          const savedResponse = await saveResponse(
            query.id,
            modelName,
            response
          );

          if (savedResponse && rankings.length > 0) {
            // Save the rankings
            const success = await saveRankings(savedResponse.id, rankings);
            if (success) {
              console.log(
                `  ✓ Saved ${rankings.length} rankings for ${modelName}`
              );
            } else {
              console.error(`  ✗ Failed to save rankings for ${modelName}`);
            }
          } else if (rankings.length === 0) {
            console.warn(
              `  ⚠ No rankings parsed for ${modelName} (response saved)`
            );
          } else {
            console.error(`  ✗ Failed to save response for ${modelName}`);
          }

          // Add a small delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`  ✗ Error querying ${modelName}:`, error);
          // Continue with next model even if one fails
        }
      }
    }

    console.log('\n✓ Daily queries completed successfully');
  } catch (error) {
    console.error('Fatal error running daily queries:', error);
    throw error;
  }
}

/**
 * Run a single query for testing
 */
export async function runSingleQuery(queryId: number) {
  console.log(`Running single query ${queryId}...`);

  const { getQueryById } = await import('../lib/db');
  const query = await getQueryById(queryId);

  if (!query) {
    console.error(`Query ${queryId} not found`);
    return;
  }

  console.log(`Question: "${query.question}"`);

  for (const modelName of MODELS) {
    try {
      console.log(`\nQuerying ${modelName}...`);

      const { response, rankings } = await queryAndParseModel(
        modelName,
        query.question
      );

      console.log(`Response: ${response.substring(0, 200)}...`);
      console.log(`Parsed ${rankings.length} rankings:`);
      rankings.forEach((r) => console.log(`  ${r.rank}. ${r.item_name}`));

      const savedResponse = await saveResponse(query.id, modelName, response);

      if (savedResponse && rankings.length > 0) {
        await saveRankings(savedResponse.id, rankings);
        console.log(`✓ Saved to database`);
      }
    } catch (error) {
      console.error(`Error with ${modelName}:`, error);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  runDailyQueries()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export default runDailyQueries;
