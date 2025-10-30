// Database types
export interface Query {
  id: number;
  question: string;
  category: string;
  created_at: string;
}

export interface Response {
  id: number;
  query_id: number;
  model_name: string;
  response_text: string;
  timestamp: string;
}

export interface Ranking {
  id: number;
  response_id: number;
  item_name: string;
  rank: number;
  score?: number;
}

// Composite types for API responses
export interface QueryWithLatestRankings extends Query {
  latest_rankings: {
    [model: string]: RankingItem[];
  };
}

export interface RankingItem {
  item_name: string;
  rank: number;
  score?: number;
}

export interface HistoricalData {
  query: Query;
  timeline: TimelinePoint[];
}

export interface TimelinePoint {
  timestamp: string;
  rankings: {
    [model: string]: RankingItem[];
  };
}

// AI Model types
export type AIModel = 'claude' | 'gpt-4' | 'gemini';

export interface AIModelConfig {
  name: string;
  displayName: string;
  color: string;
}

// Categories
export type QueryCategory =
  | 'Food & Restaurants'
  | 'Tech & Products'
  | 'Politics & Society'
  | 'Entertainment'
  | 'Career & Education';
