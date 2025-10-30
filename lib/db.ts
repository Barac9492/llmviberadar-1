import { createClient } from '@supabase/supabase-js';
import {
  Query,
  Response,
  QueryWithLatestRankings,
  HistoricalData,
  RankingItem,
} from '@/types';

// Initialize Supabase client
// Use placeholder values during build if env vars are not set
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all queries from the database
 */
export async function getAllQueries(): Promise<Query[]> {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching queries:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single query by ID
 */
export async function getQueryById(id: number): Promise<Query | null> {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching query ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Get queries by category
 */
export async function getQueriesByCategory(category: string): Promise<Query[]> {
  const { data, error } = await supabase
    .from('queries')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching queries for category ${category}:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Save a response from an AI model
 */
export async function saveResponse(
  queryId: number,
  modelName: string,
  responseText: string
): Promise<Response | null> {
  const { data, error } = await supabase
    .from('responses')
    .insert({
      query_id: queryId,
      model_name: modelName,
      response_text: responseText,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving response:', error);
    return null;
  }

  return data;
}

/**
 * Save rankings for a response
 */
export async function saveRankings(
  responseId: number,
  rankings: RankingItem[]
): Promise<boolean> {
  const rankingsData = rankings.map((item) => ({
    response_id: responseId,
    item_name: item.item_name,
    rank: item.rank,
    score: item.score || null,
  }));

  const { error } = await supabase.from('rankings').insert(rankingsData);

  if (error) {
    console.error('Error saving rankings:', error);
    return false;
  }

  return true;
}

/**
 * Get the latest rankings for a query across all models
 */
export async function getLatestRankings(
  queryId: number
): Promise<{ [model: string]: RankingItem[] }> {
  // Get the most recent response for each model
  const { data: responses, error: responsesError } = await supabase
    .from('responses')
    .select('id, model_name, timestamp')
    .eq('query_id', queryId)
    .order('timestamp', { ascending: false });

  if (responsesError || !responses) {
    console.error('Error fetching responses:', responsesError);
    return {};
  }

  // Group by model and get the most recent one
  const latestByModel: { [model: string]: number } = {};
  responses.forEach((response) => {
    if (!latestByModel[response.model_name]) {
      latestByModel[response.model_name] = response.id;
    }
  });

  // Get rankings for each latest response
  const result: { [model: string]: RankingItem[] } = {};

  for (const [modelName, responseId] of Object.entries(latestByModel)) {
    const { data: rankings, error: rankingsError } = await supabase
      .from('rankings')
      .select('item_name, rank, score')
      .eq('response_id', responseId)
      .order('rank', { ascending: true });

    if (!rankingsError && rankings) {
      result[modelName] = rankings;
    }
  }

  return result;
}

/**
 * Get historical data for a query over the specified number of days
 */
export async function getHistoricalData(
  queryId: number,
  days: number = 30
): Promise<HistoricalData | null> {
  const query = await getQueryById(queryId);
  if (!query) return null;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Get all responses within the time range
  const { data: responses, error: responsesError } = await supabase
    .from('responses')
    .select('id, model_name, timestamp')
    .eq('query_id', queryId)
    .gte('timestamp', cutoffDate.toISOString())
    .order('timestamp', { ascending: true });

  if (responsesError || !responses) {
    console.error('Error fetching historical responses:', responsesError);
    return { query, timeline: [] };
  }

  // Get all response IDs
  const responseIds = responses.map((r) => r.id);

  if (responseIds.length === 0) {
    return { query, timeline: [] };
  }

  // Get all rankings for these responses
  const { data: allRankings, error: rankingsError } = await supabase
    .from('rankings')
    .select('response_id, item_name, rank, score')
    .in('response_id', responseIds)
    .order('rank', { ascending: true });

  if (rankingsError || !allRankings) {
    console.error('Error fetching historical rankings:', rankingsError);
    return { query, timeline: [] };
  }

  // Group rankings by response_id
  const rankingsByResponse: { [responseId: number]: RankingItem[] } = {};
  allRankings.forEach((ranking) => {
    if (!rankingsByResponse[ranking.response_id]) {
      rankingsByResponse[ranking.response_id] = [];
    }
    rankingsByResponse[ranking.response_id].push({
      item_name: ranking.item_name,
      rank: ranking.rank,
      score: ranking.score || undefined,
    });
  });

  // Group responses by timestamp (date)
  const timelineMap: {
    [timestamp: string]: { [model: string]: RankingItem[] };
  } = {};

  responses.forEach((response) => {
    const dateKey = new Date(response.timestamp).toISOString().split('T')[0];
    if (!timelineMap[dateKey]) {
      timelineMap[dateKey] = {};
    }
    timelineMap[dateKey][response.model_name] =
      rankingsByResponse[response.id] || [];
  });

  // Convert to timeline array
  const timeline = Object.entries(timelineMap).map(([timestamp, rankings]) => ({
    timestamp,
    rankings,
  }));

  return { query, timeline };
}

/**
 * Create a new query
 */
export async function createQuery(
  question: string,
  category: string
): Promise<Query | null> {
  const { data, error } = await supabase
    .from('queries')
    .insert({
      question,
      category,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating query:', error);
    return null;
  }

  return data;
}

/**
 * Get all queries with their latest rankings
 */
export async function getAllQueriesWithLatestRankings(): Promise<
  QueryWithLatestRankings[]
> {
  const queries = await getAllQueries();
  const result: QueryWithLatestRankings[] = [];

  for (const query of queries) {
    const latestRankings = await getLatestRankings(query.id);
    result.push({
      ...query,
      latest_rankings: latestRankings,
    });
  }

  return result;
}
