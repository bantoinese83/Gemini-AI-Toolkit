/**
 * @file Quick convenience functions for minimal code usage.
 * Provides one-liner functions that don't require instantiating the class.
 */

import { GeminiToolkit } from './geminiService';
import type {
  GenerateTextOptions,
  GenerateImageOptions,
  GenerateVideoOptions,
  GenerateSpeechOptions,
  GroundedResult,
} from './geminiService';

// Global instance cache
let defaultInstance: GeminiToolkit | null = null;
let cachedApiKey: string | null = null;

/**
 * Gets or creates the default GeminiToolkit instance.
 * Uses GEMINI_API_KEY from environment if available.
 */
function getDefaultInstance(apiKey?: string): GeminiToolkit {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      'API key required. Provide it as parameter or set GEMINI_API_KEY environment variable.'
    );
  }

  // Create new instance if key changed or doesn't exist
  if (!defaultInstance || cachedApiKey !== key) {
    defaultInstance = new GeminiToolkit({ apiKey: key });
    cachedApiKey = key;
  }

  return defaultInstance;
}

/**
 * Quick text generation - one line of code!
 * 
 * @example
 * ```typescript
 * const text = await generateText('Hello, world!');
 * ```
 */
export async function generateText(
  prompt: string,
  options?: GenerateTextOptions,
  apiKey?: string
): Promise<string> {
  return getDefaultInstance(apiKey).generateText(prompt, options);
}

/**
 * Quick image generation - minimal code!
 * 
 * @example
 * ```typescript
 * const image = await generateImage('A robot with a skateboard');
 * ```
 */
export async function generateImage(
  prompt: string,
  options?: GenerateImageOptions,
  apiKey?: string
): Promise<string> {
  return getDefaultInstance(apiKey).generateImage(prompt, options);
}

/**
 * Quick chat creation - simple and fast!
 * 
 * @example
 * ```typescript
 * const chat = createChat();
 * const response = await chat.sendMessage({ message: 'Hi!' });
 * ```
 */
export function createChat(model?: string, apiKey?: string) {
  return getDefaultInstance(apiKey).createChat(model);
}

/**
 * Quick speech generation - one line!
 * 
 * @example
 * ```typescript
 * const audio = await generateSpeech('Hello, world!');
 * ```
 */
export async function generateSpeech(
  text: string,
  options?: GenerateSpeechOptions,
  apiKey?: string
): Promise<string> {
  return getDefaultInstance(apiKey).generateSpeech(text, options);
}

/**
 * Quick search grounding - minimal code!
 * 
 * @example
 * ```typescript
 * const result = await search('Latest AI news');
 * ```
 */
export async function search(
  query: string,
  model?: string,
  apiKey?: string
): Promise<GroundedResult> {
  return getDefaultInstance(apiKey).groundWithSearch(query, model);
}

/**
 * Quick maps grounding - simple location queries!
 * 
 * @example
 * ```typescript
 * const result = await findNearby('restaurants', { lat: 37.7749, lng: -122.4194 });
 * ```
 */
export async function findNearby(
  query: string,
  location?: { lat: number; lng: number },
  model?: string,
  apiKey?: string
): Promise<GroundedResult> {
  const loc = location ? { latitude: location.lat, longitude: location.lng } : undefined;
  return getDefaultInstance(apiKey).groundWithMaps(query, loc, model);
}

/**
 * Quick image analysis - one line!
 * 
 * @example
 * ```typescript
 * const analysis = await analyzeImage(imageBase64, 'What is in this image?');
 * ```
 */
export async function analyzeImage(
  imageBase64: string,
  prompt: string,
  mimeType: string = 'image/png',
  apiKey?: string
): Promise<string> {
  return getDefaultInstance(apiKey).analyzeMedia(imageBase64, mimeType, prompt);
}

/**
 * Quick image editing - minimal code!
 * 
 * @example
 * ```typescript
 * const edited = await editImage(imageBase64, 'image/png', 'Add a sunset');
 * ```
 */
export async function editImage(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  model?: string,
  apiKey?: string
): Promise<string> {
  return getDefaultInstance(apiKey).editImage(imageBase64, mimeType, prompt, model);
}

/**
 * Initialize with API key (optional - can use env var instead).
 * Call this once at the start of your app for best performance.
 * 
 * @example
 * ```typescript
 * init('your-api-key');
 * // Now all quick functions work without passing apiKey
 * ```
 */
export function init(apiKey: string): void {
  defaultInstance = new GeminiToolkit({ apiKey });
  cachedApiKey = apiKey;
}

/**
 * Get the default toolkit instance (for advanced usage).
 */
export function getToolkit(apiKey?: string): GeminiToolkit {
  return getDefaultInstance(apiKey);
}

