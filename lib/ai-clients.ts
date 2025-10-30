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

function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const geminiApiKey = resolveEnvValue(GEMINI_KEY_ENV_VARS);

    if (!geminiApiKey) {
      throw new Error(
        `Missing Gemini API key. Set one of: ${GEMINI_KEY_ENV_VARS.join(', ')}.`
      );
    }

    genAI = new GoogleGenerativeAI(geminiApiKey);
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
 * Query Gemini (Google) - Updated with new API key
 */
export async function queryGemini(question: string): Promise<string> {
  for (const modelName of GEMINI_MODEL_CANDIDATES) {
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
      if (
        error instanceof GoogleGenerativeAIFetchError &&
        error.status === 404
      ) {
        console.warn(
          `Gemini model ${modelName} not available (404). Trying next candidate...`
        );
        continue;
      }

      console.error(`Error querying Gemini model ${modelName}:`, error);
      throw error;
    }
  }

  throw new Error(
    `Gemini request failed: no configured model (${GEMINI_MODEL_CANDIDATES.join(
      ', '
    )}) is available.`
  );
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
