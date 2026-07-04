/**
 * Groq AI Client
 *
 * Wraps the Groq SDK with error handling and fallback behavior.
 * Future: cascadeflow routing will wrap this client via services/ai/index.ts
 */

import Groq from 'groq-sdk';

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  if (typeof window !== 'undefined') return null; // Server-side only
  if (groqClient) return groqClient;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('[AI] GROQ_API_KEY not set — using mock AI responses');
    return null;
  }

  groqClient = new Groq({ apiKey });
  return groqClient;
}

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  isMock: boolean;
}

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export async function groqChat(
  messages: GroqChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<GroqResponse> {
  const client = getGroqClient();

  if (!client) {
    // Return a mock response when no API key is available
    return {
      content: '[Mock AI Response] Groq API key not configured. Add GROQ_API_KEY to .env.local.',
      model: 'mock',
      isMock: true,
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: options?.model ?? DEFAULT_MODEL,
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 2048,
    });

    const choice = completion.choices[0];
    return {
      content: choice.message.content ?? '',
      model: completion.model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
      isMock: false,
    };
  } catch (error) {
    console.error('[AI] Groq request failed:', error);
    throw error;
  }
}

export { DEFAULT_MODEL };
