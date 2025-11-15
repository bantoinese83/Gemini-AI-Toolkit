/**
 * @file Developer-friendly utility functions for common operations.
 * High-impact helpers that save developers time and code.
 * 
 * Note: File operations (saveImage, saveAudio, loadImage) are Node.js-only.
 * For browser usage, use the core API methods and handle file operations
 * using browser APIs (FileReader, Blob, etc.).
 */

// Node.js-only imports - will be undefined in browser
let writeFileSync: typeof import('fs')['writeFileSync'] | undefined;
let Buffer: typeof globalThis.Buffer | undefined;

// Try to import Node.js modules (will fail gracefully in browser)
try {
  if (typeof require !== 'undefined') {
    writeFileSync = require('fs').writeFileSync;
    Buffer = globalThis.Buffer || require('buffer').Buffer;
  }
} catch {
  // Running in browser - file operations won't be available
}

import { fileToBase64 } from './utils/mediaUtils';

/**
 * Saves base64 image data to a file.
 * 
 * ⚠️ **Node.js only** - Not available in browser environments.
 * For browser usage, use browser APIs:
 * ```typescript
 * const blob = await fetch(`data:image/png;base64,${imageBase64}`).then(r => r.blob());
 * const url = URL.createObjectURL(blob);
 * // Use url for download or display
 * ```
 * 
 * @example
 * ```typescript
 * const imageBase64 = await generateImage('A robot');
 * saveImage(imageBase64, 'output.png');
 * ```
 */
export function saveImage(imageBase64: string, filePath: string): void {
  if (!writeFileSync || !Buffer) {
    throw new Error(
      'saveImage is only available in Node.js environments. ' +
      'For browser usage, convert base64 to Blob and use URL.createObjectURL().'
    );
  }
  const buffer = Buffer.from(imageBase64, 'base64');
  writeFileSync(filePath, buffer);
}

/**
 * Saves base64 audio data to a file.
 * 
 * ⚠️ **Node.js only** - Not available in browser environments.
 * For browser usage, use browser APIs:
 * ```typescript
 * const blob = await fetch(`data:audio/wav;base64,${audioBase64}`).then(r => r.blob());
 * const url = URL.createObjectURL(blob);
 * // Use url for download or playback
 * ```
 * 
 * @example
 * ```typescript
 * const audioBase64 = await generateSpeech('Hello!');
 * saveAudio(audioBase64, 'output.wav');
 * ```
 */
export function saveAudio(audioBase64: string, filePath: string): void {
  if (!writeFileSync || !Buffer) {
    throw new Error(
      'saveAudio is only available in Node.js environments. ' +
      'For browser usage, convert base64 to Blob and use URL.createObjectURL().'
    );
  }
  const buffer = Buffer.from(audioBase64, 'base64');
  writeFileSync(filePath, buffer);
}

/**
 * Loads an image file and converts it to base64.
 * 
 * ⚠️ **Node.js only** - Not available in browser environments.
 * For browser usage, use FileReader API:
 * ```typescript
 * const file = event.target.files[0];
 * const reader = new FileReader();
 * reader.onload = () => {
 *   const base64 = reader.result.split(',')[1];
 *   // Use base64
 * };
 * reader.readAsDataURL(file);
 * ```
 * 
 * @example
 * ```typescript
 * const imageBase64 = loadImage('input.png');
 * const edited = await editImage(imageBase64, 'image/png', 'Add sunset');
 * ```
 */
export async function loadImage(filePath: string): Promise<string> {
  return fileToBase64(filePath);
}

/**
 * Batch processes multiple text generation requests.
 * 
 * @example
 * ```typescript
 * const results = await batchGenerateText([
 *   'What is AI?',
 *   'What is ML?',
 *   'What is deep learning?'
 * ]);
 * ```
 * @throws {Error} If prompts array is invalid or empty
 */
export async function batchGenerateText(
  prompts: string[],
  generateFn: (prompt: string) => Promise<string>
): Promise<string[]> {
  if (!Array.isArray(prompts)) {
    throw new Error('batchGenerateText: prompts must be an array');
  }
  
  if (prompts.length === 0) {
    throw new Error('batchGenerateText: prompts array cannot be empty');
  }
  
  // Validate all prompts are strings
  for (let i = 0; i < prompts.length; i++) {
    if (typeof prompts[i] !== 'string') {
      throw new Error(`batchGenerateText: prompts[${i}] must be a string`);
    }
  }
  
  if (typeof generateFn !== 'function') {
    throw new Error('batchGenerateText: generateFn must be a function');
  }
  
  return Promise.all(prompts.map(prompt => generateFn(prompt)));
}

/**
 * Streams text generation and collects all chunks.
 * 
 * @example
 * ```typescript
 * const chat = createChat();
 * const fullText = await streamToText(
 *   chat.sendMessageStream({ message: 'Tell me a story' })
 * );
 * ```
 * @throws {Error} If stream is invalid or iteration fails
 */
export async function streamToText(
  stream: AsyncIterable<{ text: string }> | null | undefined
): Promise<string> {
  if (!stream) {
    throw new Error('streamToText: stream is required');
  }
  
  // Check if stream is async iterable
  if (typeof (stream as any)[Symbol.asyncIterator] !== 'function') {
    throw new Error('streamToText: stream must be an AsyncIterable');
  }
  
  let fullText = '';
  let chunkCount = 0;
  const MAX_CHUNKS = 10000; // Prevent infinite loops
  
  try {
    for await (const chunk of stream) {
      chunkCount++;
      
      if (chunkCount > MAX_CHUNKS) {
        throw new Error(`streamToText: Stream exceeded maximum chunk count of ${MAX_CHUNKS}`);
      }
      
      if (!chunk || typeof chunk !== 'object') {
        throw new Error(`streamToText: Invalid chunk at position ${chunkCount}`);
      }
      
      if (chunk.text !== undefined) {
        if (typeof chunk.text !== 'string') {
          throw new Error(`streamToText: chunk.text must be a string at position ${chunkCount}`);
        }
        fullText += chunk.text;
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('streamToText:')) {
      throw error;
    }
    throw new Error(`streamToText: Error iterating stream: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return fullText;
}

