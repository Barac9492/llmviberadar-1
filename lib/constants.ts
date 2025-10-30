import { AIModelConfig, QueryCategory } from '@/types';

/**
 * AI Model configurations with display names and colors
 */
export const AI_MODELS: { [key: string]: AIModelConfig } = {
  claude: {
    name: 'claude',
    displayName: 'Claude Sonnet 4.5',
    color: '#D97706', // amber-600
  },
  'gpt-4': {
    name: 'gpt-4',
    displayName: 'GPT-4 Turbo',
    color: '#10B981', // emerald-500
  },
};

/**
 * Query categories
 */
export const CATEGORIES: QueryCategory[] = [
  'Korean Tech',
  'Korean Culture',
  'Korean Lifestyle',
  'Korean Tourism',
  'Korean Innovation',
];

/**
 * Category colors for UI
 */
export const CATEGORY_COLORS: { [key in QueryCategory]: string } = {
  'Korean Tech': 'bg-blue-100 text-blue-800',
  'Korean Culture': 'bg-pink-100 text-pink-800',
  'Korean Lifestyle': 'bg-purple-100 text-purple-800',
  'Korean Tourism': 'bg-green-100 text-green-800',
  'Korean Innovation': 'bg-orange-100 text-orange-800',
};

/**
 * Get color for a model
 */
export function getModelColor(modelName: string): string {
  return AI_MODELS[modelName]?.color || '#6B7280';
}

/**
 * Get display name for a model
 */
export function getModelDisplayName(modelName: string): string {
  return AI_MODELS[modelName]?.displayName || modelName;
}
