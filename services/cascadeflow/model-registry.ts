/**
 * cascadeflow Model Registry — Enterprise AI Model Catalog
 *
 * Defines available LLM models across Groq, OpenAI, Anthropic, Gemini, GPT-OSS, and Ollama.
 * Includes cost per token, SLA latency targets, quality scores, and supported capabilities.
 */

import { ModelRegistryEntry } from '@/types';

export const MODEL_REGISTRY: ModelRegistryEntry[] = [
  {
    id: 'groq-qwen-32b',
    name: 'Qwen 2.5 32B (Groq LPU)',
    provider: 'groq',
    modelId: 'qwen-2.5-32b',
    description: 'High-speed analytical reasoning engine optimized for Site Reliability & DevOps root cause triage.',
    contextWindow: 131072,
    costPerMillionPromptTokens: 0.59,
    costPerMillionCompletionTokens: 0.79,
    latencySlaMs: 1200,
    qualityRating: 96,
    capabilities: ['log_analysis', 'root_cause', 'executive_summary', 'code_generation', 'fast_triage'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'standard',
  },
  {
    id: 'groq-llama-70b',
    name: 'Llama 3.3 70B Versatile (Groq LPU)',
    provider: 'groq',
    modelId: 'llama-3.3-70b-versatile',
    description: 'Heavyweight reasoning model with deep system architecture comprehension and high accuracy.',
    contextWindow: 131072,
    costPerMillionPromptTokens: 0.79,
    costPerMillionCompletionTokens: 0.99,
    latencySlaMs: 1800,
    qualityRating: 94,
    capabilities: ['log_analysis', 'root_cause', 'executive_summary', 'code_generation'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'heavy',
  },
  {
    id: 'groq-llama-8b',
    name: 'Llama 3.1 8B Instant (Groq LPU)',
    provider: 'groq',
    modelId: 'llama-3.1-8b-instant',
    description: 'Ultra-fast lightweight model for rapid log summarizing, initial triage, and formatting.',
    contextWindow: 131072,
    costPerMillionPromptTokens: 0.05,
    costPerMillionCompletionTokens: 0.08,
    latencySlaMs: 450,
    qualityRating: 84,
    capabilities: ['log_analysis', 'fast_triage'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'lightweight',
  },
  {
    id: 'openai-gpt4o',
    name: 'GPT-4o Enterprise',
    provider: 'openai',
    modelId: 'gpt-4o',
    description: 'Multimodal flagship model for complex executive incident reporting and compliance postmortems.',
    contextWindow: 128000,
    costPerMillionPromptTokens: 2.50,
    costPerMillionCompletionTokens: 10.00,
    latencySlaMs: 3200,
    qualityRating: 98,
    capabilities: ['log_analysis', 'root_cause', 'executive_summary', 'code_generation'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'reasoning',
  },
  {
    id: 'anthropic-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    description: 'Exceptional code review, runbook generation, and infrastructure bug isolation.',
    contextWindow: 200000,
    costPerMillionPromptTokens: 3.00,
    costPerMillionCompletionTokens: 15.00,
    latencySlaMs: 3500,
    qualityRating: 99,
    capabilities: ['log_analysis', 'root_cause', 'code_generation', 'executive_summary'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'reasoning',
  },
  {
    id: 'gemini-25-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'gemini',
    modelId: 'gemini-2.5-pro',
    description: 'Massive context window reasoning for multi-day incident correlation and distributed tracing.',
    contextWindow: 2000000,
    costPerMillionPromptTokens: 1.25,
    costPerMillionCompletionTokens: 5.00,
    latencySlaMs: 2800,
    qualityRating: 97,
    capabilities: ['log_analysis', 'root_cause', 'executive_summary', 'code_generation'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'heavy',
  },
  {
    id: 'gpt-oss-120b',
    name: 'GPT-OSS 120B (Open Weights)',
    provider: 'groq',
    modelId: 'gpt-oss-120b',
    description: 'Open-weights enterprise foundation model with specialized cybersecurity & DevOps training.',
    contextWindow: 65536,
    costPerMillionPromptTokens: 0.40,
    costPerMillionCompletionTokens: 0.60,
    latencySlaMs: 1500,
    qualityRating: 92,
    capabilities: ['root_cause', 'executive_summary', 'code_generation'],
    isAvailable: true,
    isLocalFallback: false,
    tier: 'standard',
  },
  {
    id: 'ollama-mistral-local',
    name: 'Mistral 7B (Local Ollama Fallback)',
    provider: 'ollama',
    modelId: 'mistral:7b-instruct',
    description: 'Zero-cost on-premise fallback model executed locally when cloud providers degrade or budget caps trigger.',
    contextWindow: 32768,
    costPerMillionPromptTokens: 0.00,
    costPerMillionCompletionTokens: 0.00,
    latencySlaMs: 800,
    qualityRating: 78,
    capabilities: ['log_analysis', 'fast_triage'],
    isAvailable: true,
    isLocalFallback: true,
    tier: 'lightweight',
  },
];

export function getModelById(id: string): ModelRegistryEntry | undefined {
  return MODEL_REGISTRY.find((m) => m.id === id || m.modelId === id);
}

export function getModelsByTier(tier: ModelRegistryEntry['tier']): ModelRegistryEntry[] {
  return MODEL_REGISTRY.filter((m) => m.tier === tier && m.isAvailable);
}

export function getLocalFallbackModel(): ModelRegistryEntry {
  return MODEL_REGISTRY.find((m) => m.isLocalFallback) || MODEL_REGISTRY[2]; // Llama 8B as fallback if no local
}
