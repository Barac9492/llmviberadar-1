import { AIModelConfig, QueryCategory } from '@/types';

/**
 * AI Model configurations with display names and colors
 */
export const AI_MODELS: { [key: string]: AIModelConfig } = {
  claude: {
    name: 'claude',
    displayName: 'Claude',
    color: '#D97706', // amber-600
  },
  'gpt-4': {
    name: 'gpt-4',
    displayName: 'GPT-4',
    color: '#10B981', // emerald-500
  },
  gemini: {
    name: 'gemini',
    displayName: 'Gemini',
    color: '#3B82F6', // blue-500
  },
};

/**
 * Query categories
 */
export const CATEGORIES: QueryCategory[] = [
  'Food & Restaurants',
  'Tech & Products',
  'Politics & Society',
  'Entertainment',
  'Career & Education',
];

/**
 * Category colors for UI
 */
export const CATEGORY_COLORS: { [key in QueryCategory]: string } = {
  'Food & Restaurants': 'bg-orange-100 text-orange-800',
  'Tech & Products': 'bg-blue-100 text-blue-800',
  'Politics & Society': 'bg-purple-100 text-purple-800',
  'Entertainment': 'bg-pink-100 text-pink-800',
  'Career & Education': 'bg-green-100 text-green-800',
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
