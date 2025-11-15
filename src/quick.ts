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
import type {
  FileSearchUploadConfig,
  FileSearchImportConfig,
  FileSearchQueryConfig,
  EphemeralTokenConfig,
  EphemeralToken,
  FileObject,
  UploadFileConfig,
  CreateCacheConfig,
  UpdateCacheConfig,
  CachedContent,
  TokenCount,
  MusicSessionCallbacks,
} from './types';

// Global instance cache
let defaultInstance: GeminiToolkit | null = null;
let cachedApiKey: string | null = null;

/**
 * Gets or creates the default GeminiToolkit instance.
 * Uses GEMINI_API_KEY from environment if available (Node.js) or globalThis (browser).
 */
function getDefaultInstance(apiKey?: string): GeminiToolkit {
  // Browser-safe environment variable access
  const envKey = typeof process !== 'undefined' && process.env 
    ? process.env.GEMINI_API_KEY 
    : undefined;
  
  const key = apiKey || envKey;
  if (!key) {
    // Check if we're in a browser environment (without directly referencing window)
    const isBrowser = typeof globalThis !== 'undefined' && 
      (typeof (globalThis as any).window !== 'undefined' || 
       typeof (globalThis as any).document !== 'undefined');
    const errorMsg = isBrowser
      ? 'API key required. Provide it as parameter or set it in your environment configuration.'
      : 'API key required. Provide it as parameter or set GEMINI_API_KEY environment variable.';
    throw new Error(errorMsg);
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
 * Quick File Search query - RAG with your documents!
 * 
 * @example
 * ```typescript
 * const result = await queryFileSearch('Tell me about Robert Graves', {
 *   fileSearchStoreNames: [store.name]
 * });
 * ```
 */
export async function queryFileSearch(
  prompt: string,
  config: FileSearchQueryConfig,
  model?: string,
  apiKey?: string
): Promise<GroundedResult> {
  return getDefaultInstance(apiKey).queryWithFileSearch(prompt, config, model);
}

/**
 * Quick File Search store creation - one line!
 * 
 * @example
 * ```typescript
 * const store = await createFileSearchStore('my-documents');
 * ```
 */
export async function createFileSearchStore(
  displayName?: string,
  apiKey?: string
): Promise<unknown> {
  return getDefaultInstance(apiKey).createFileSearchStore(displayName);
}

/**
 * Quick file upload to File Search store - minimal code!
 * 
 * @example
 * ```typescript
 * const operation = await uploadToFileSearchStore('document.pdf', store.name);
 * ```
 */
export async function uploadToFileSearchStore(
  filePath: string | File | Blob,
  fileSearchStoreName: string,
  config?: FileSearchUploadConfig,
  apiKey?: string
): Promise<unknown> {
  return getDefaultInstance(apiKey).uploadToFileSearchStore(filePath, fileSearchStoreName, config);
}

/**
 * Quick URL Context query - analyze content from URLs!
 * 
 * @example
 * ```typescript
 * const result = await queryWithUrlContext(
 *   'Compare recipes from https://example.com/recipe1 and https://example.com/recipe2'
 * );
 * ```
 */
export async function queryWithUrlContext(
  prompt: string,
  model?: string,
  apiKey?: string
): Promise<GroundedResult> {
  return getDefaultInstance(apiKey).generateWithUrlContext(prompt, model);
}

/**
 * Quick URL Context + Search - search web and analyze URLs!
 * 
 * @example
 * ```typescript
 * const result = await queryWithUrlContextAndSearch(
 *   'Find AI trends and analyze https://example.com/ai-report'
 * );
 * ```
 */
export async function queryWithUrlContextAndSearch(
  prompt: string,
  model?: string,
  apiKey?: string
): Promise<GroundedResult> {
  return getDefaultInstance(apiKey).generateWithUrlContextAndSearch(prompt, model);
}

/**
 * Get the default toolkit instance (for advanced usage).
 */
export function getToolkit(apiKey?: string): GeminiToolkit {
  return getDefaultInstance(apiKey);
}

/**
 * Quick ephemeral token creation - minimal code!
 * 
 * ⚠️ **Server-side only** - Call this from your backend, not client-side.
 * 
 * @example
 * ```typescript
 * // Server-side
 * const token = await createEphemeralToken({
 *   uses: 1,
 *   expireTime: new Date(Date.now() + 30 * 60 * 1000)
 * });
 * // Send token.name to client
 * ```
 */
export async function createEphemeralToken(
  config?: EphemeralTokenConfig,
  apiKey?: string
): Promise<EphemeralToken> {
  return getDefaultInstance(apiKey).createEphemeralToken(config);
}

/**
 * Quick file upload - minimal code!
 */
export async function uploadFile(
  filePath: string | File | Blob,
  config?: UploadFileConfig | string,
  apiKey?: string
): Promise<FileObject> {
  return getDefaultInstance(apiKey).uploadFile(filePath, config);
}

/**
 * Quick file metadata retrieval - minimal code!
 */
export async function getFile(
  fileName: string,
  apiKey?: string
): Promise<FileObject> {
  return getDefaultInstance(apiKey).getFile(fileName);
}

/**
 * Quick file listing - minimal code!
 */
export async function listFiles(
  pageSize?: number,
  apiKey?: string
): Promise<unknown> {
  return getDefaultInstance(apiKey).listFiles(pageSize);
}

/**
 * Quick file deletion - minimal code!
 */
export async function deleteFile(
  fileName: string,
  apiKey?: string
): Promise<void> {
  return getDefaultInstance(apiKey).deleteFile(fileName);
}

/**
 * Quick cache creation - minimal code!
 */
export async function createCache(
  model: string,
  config: CreateCacheConfig,
  apiKey?: string
): Promise<CachedContent> {
  return getDefaultInstance(apiKey).createCache(model, config);
}

/**
 * Quick cache listing - minimal code!
 */
export async function listCaches(apiKey?: string): Promise<unknown> {
  return getDefaultInstance(apiKey).listCaches();
}

/**
 * Quick cache retrieval - minimal code!
 */
export async function getCache(
  cacheName: string,
  apiKey?: string
): Promise<CachedContent> {
  return getDefaultInstance(apiKey).getCache(cacheName);
}

/**
 * Quick cache update - minimal code!
 */
export async function updateCache(
  cacheName: string,
  config: UpdateCacheConfig,
  apiKey?: string
): Promise<CachedContent> {
  return getDefaultInstance(apiKey).updateCache(cacheName, config);
}

/**
 * Quick cache deletion - minimal code!
 */
export async function deleteCache(
  cacheName: string,
  apiKey?: string
): Promise<void> {
  return getDefaultInstance(apiKey).deleteCache(cacheName);
}

/**
 * Quick token counting - minimal code!
 */
export async function countTokens(
  contents: unknown,
  model?: string,
  apiKey?: string
): Promise<TokenCount> {
  return getDefaultInstance(apiKey).countTokens(contents, model);
}

/**
 * Quick function to connect to Lyria RealTime music generation session.
 * 
 * ⚠️ Experimental: Lyria RealTime is an experimental model.
 * ⚠️ Requires v1alpha API version.
 * 
 * @param callbacks - Event callbacks for the music session
 * @param apiKey - Optional API key
 * @returns Promise resolving to the music session object
 * 
 * @example
 * ```typescript
 * import { connectMusic } from 'gemini-ai-toolkit';
 * 
 * const session = await connectMusic({
 *   onmessage: async (message) => {
 *     // Handle audio chunks
 *   },
 *   onerror: (error) => console.error('Error:', error),
 *   onclose: () => console.log('Closed')
 * });
 * ```
 */
export async function connectMusic(
  callbacks: MusicSessionCallbacks,
  apiKey?: string
): Promise<unknown> {
  const toolkit = getToolkit(apiKey);
  return await toolkit.connectMusic(callbacks);
}

