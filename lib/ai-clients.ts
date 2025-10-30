import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import {
  GenerativeModel,
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from '@google/generative-ai';
import { RankingItem } from '@/types';

// Initialize AI clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const GEMINI_KEY_ENV_VARS = [
  'GEMINI_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GOOGLE_API_KEY',
  'GOOGLE_GENAI_API_KEY',
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'NEXT_PUBLIC_GOOGLE_AI_API_KEY',
  'NEXT_PUBLIC_GOOGLE_API_KEY',
  'NEXT_PUBLIC_GOOGLE_GENAI_API_KEY',
] as const;

let genAI: GoogleGenerativeAI | null = null;
const geminiModelCache = new Map<string, GenerativeModel>();
let geminiApiKey: string | null = null;
const unavailableGeminiModels = new Set<string>();

const GEMINI_MODEL_LIST_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_MODEL_LIST_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const GEMINI_MODEL_LIST_ERROR_CACHE_TTL_MS = 60 * 1000; // 1 minute

type GeminiModelListCache = {
  ids: string[];
  expiresAt: number;
};

let geminiModelListCache: GeminiModelListCache | null = null;

const GEMINI_MODEL_CANDIDATES = [
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-pro',
] as const;

function resolveEnvValue(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function getGeminiApiKey(): string {
  if (geminiApiKey) {
    return geminiApiKey;
  }

  const resolvedKey = resolveEnvValue(GEMINI_KEY_ENV_VARS);

  if (!resolvedKey) {
    throw new Error(
      `Missing Gemini API key. Set one of: ${GEMINI_KEY_ENV_VARS.join(', ')}.`
    );
  }

  geminiApiKey = resolvedKey;
  return geminiApiKey;
}

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(getGeminiApiKey());
  }

  return genAI;
}

function getGeminiModel(modelName: string): GenerativeModel {
  const cachedModel = geminiModelCache.get(modelName);
  if (cachedModel) {
    return cachedModel;
  }

  const model = getGeminiClient().getGenerativeModel({
    model: modelName,
  });

  geminiModelCache.set(modelName, model);
  return model;
}

function parseGeminiModelId(modelName?: string): string | null {
  if (!modelName) {
    return null;
  }

  const parts = modelName.split('/');
  const parsed = parts[parts.length - 1];

  return parsed?.trim() ? parsed.trim() : null;
}

async function getAvailableGeminiModelIds(
  forceRefresh: boolean = false
): Promise<string[]> {
  const now = Date.now();

  if (!forceRefresh && geminiModelListCache && geminiModelListCache.expiresAt > now) {
    return geminiModelListCache.ids;
  }

  const url = new URL(GEMINI_MODEL_LIST_ENDPOINT);
  url.searchParams.set('key', getGeminiApiKey());

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Failed to list Gemini models (${response.status} ${response.statusText}): ${errorText}`
      );
      geminiModelListCache = {
        ids: [],
        expiresAt: now + GEMINI_MODEL_LIST_ERROR_CACHE_TTL_MS,
      };
      return [];
    }

    const data = (await response.json()) as {
      models?: { name?: string }[];
    };

    const ids =
      data.models
        ?.map((model) => parseGeminiModelId(model.name))
        .filter((modelName): modelName is string => Boolean(modelName)) ?? [];

    geminiModelListCache = {
      ids,
      expiresAt: now + GEMINI_MODEL_LIST_CACHE_TTL_MS,
    };

    return ids;
  } catch (error) {
    console.warn('Failed to fetch Gemini model list:', error);
    geminiModelListCache = {
      ids: [],
      expiresAt: now + GEMINI_MODEL_LIST_ERROR_CACHE_TTL_MS,
    };
    return [];
  }
}

function isGeminiNotFoundError(error: unknown): boolean {
  if (
    error instanceof GoogleGenerativeAIFetchError &&
    error.status === 404
  ) {
    return true;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: number }).status === 404
  ) {
    return true;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    (error as { statusCode?: number }).statusCode === 404
  ) {
    return true;
  }

  if (error instanceof Error && /\b404\b/.test(error.message)) {
    return true;
  }

  return false;
}

/**
 * Create a structured prompt for ranking queries
 */
export function createRankingPrompt(question: string): string {
  return `You are ranking items based on the following question. Reply with ONLY a numbered list, no explanation or additional text.

Example format:
1. [Item name]
2. [Item name]
3. [Item name]
4. [Item name]
5. [Item name]

Question: ${question}

Provide your ranking now:`;
}

/**
 * Parse a numbered list response into rankings
 */
export function parseRankings(responseText: string): RankingItem[] {
  const rankings: RankingItem[] = [];
  const lines = responseText.split('\n');

  for (const line of lines) {
    // Match patterns like "1. Item name" or "1) Item name"
    const match = line.match(/^\s*(\d+)[\.\)]\s*(.+)$/);
    if (match) {
      const rank = parseInt(match[1], 10);
      const itemName = match[2].trim();
      if (itemName) {
        rankings.push({ item_name: itemName, rank });
      }
    }
  }

  return rankings;
}

/**
 * Query Claude (Anthropic)
 */
export async function queryClaude(question: string): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: createRankingPrompt(question),
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : '';
  } catch (error) {
    console.error('Error querying Claude:', error);
    throw error;
  }
}

/**
 * Query GPT-4 (OpenAI)
 */
export async function queryGPT4(question: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'user',
          content: createRankingPrompt(question),
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error querying GPT-4:', error);
    throw error;
  }
}

/**
 * Query Gemini (Google)
 */
export async function queryGemini(question: string): Promise<string> {
  const attemptedModels: string[] = [];
  const attemptedSet = new Set<string>();
  let lastError: unknown;
  let sawNotFound = false;

  const tryModel = async (modelName: string): Promise<string | null> => {
    if (attemptedSet.has(modelName) || unavailableGeminiModels.has(modelName)) {
      return null;
    }

    attemptedSet.add(modelName);
    attemptedModels.push(modelName);

    try {
      const model = getGeminiModel(modelName);
      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: createRankingPrompt(question) }],
          },
        ],
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;

      if (isGeminiNotFoundError(error)) {
        unavailableGeminiModels.add(modelName);
        geminiModelCache.delete(modelName);
        sawNotFound = true;
        console.warn(
          `Gemini model ${modelName} not available (404). Trying next candidate...`
        );
        return null;
      }

      console.error(`Error querying Gemini model ${modelName}:`, error);
      throw error;
    }
  };

  for (const modelName of GEMINI_MODEL_CANDIDATES) {
    const response = await tryModel(modelName);
    if (typeof response === 'string') {
      return response;
    }
  }

  const availableModels = await getAvailableGeminiModelIds(sawNotFound);

  for (const modelName of availableModels) {
    const response = await tryModel(modelName);
    if (typeof response === 'string') {
      return response;
    }
  }

  const attemptedList =
    attemptedModels.length > 0
      ? attemptedModels.join(', ')
      : GEMINI_MODEL_CANDIDATES.join(', ');
  const availableList =
    availableModels.length > 0
      ? availableModels.join(', ')
      : 'none reported';

  const errorParts = [
    `Gemini request failed: no configured model (${attemptedList}) is available.`,
  ];

  if (availableModels.length > 0) {
    errorParts.push(`API reported available models: ${availableList}.`);
  } else {
    errorParts.push('API did not report any available models.');
  }

  if (lastError instanceof Error) {
    errorParts.push(`Last error: ${lastError.message}`);
  }

  throw new Error(errorParts.join(' '));
}

/**
 * Query all AI models with retry logic
 */
export async function queryAllModels(question: string): Promise<{
  claude: string;
  'gpt-4': string;
  gemini: string;
}> {
  const results = await Promise.allSettled([
    retryWithBackoff(() => queryClaude(question), 3),
    retryWithBackoff(() => queryGPT4(question), 3),
    retryWithBackoff(() => queryGemini(question), 3),
  ]);

  return {
    claude: results[0].status === 'fulfilled' ? results[0].value : '',
    'gpt-4': results[1].status === 'fulfilled' ? results[1].value : '',
    gemini: results[2].status === 'fulfilled' ? results[2].value : '',
  };
}

/**
 * Retry function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Max retries reached');
}

/**
 * Query a model and parse the response into rankings
 */
export async function queryAndParseModel(
  modelName: 'claude' | 'gpt-4' | 'gemini',
  question: string
): Promise<{ response: string; rankings: RankingItem[] }> {
  let response: string;

  switch (modelName) {
    case 'claude':
      response = await retryWithBackoff(() => queryClaude(question), 3);
      break;
    case 'gpt-4':
      response = await retryWithBackoff(() => queryGPT4(question), 3);
      break;
    case 'gemini':
      response = await retryWithBackoff(() => queryGemini(question), 3);
      break;
    default:
      throw new Error(`Unknown model: ${modelName}`);
  }

  const rankings = parseRankings(response);

  // If parsing failed, try to use Claude to structure the response
  if (rankings.length === 0 && response) {
    console.warn(
      `Failed to parse rankings from ${modelName}, attempting fallback...`
    );
    // For now, just return empty rankings
    // In production, you might want to use another AI call to structure it
  }

  return { response, rankings };
}
