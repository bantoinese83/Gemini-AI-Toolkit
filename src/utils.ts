/**
 * @file Developer-friendly utility functions for common operations.
 * High-impact helpers that save developers time and code.
 */

import { writeFileSync } from 'fs';
import { fileToBase64 } from './utils/mediaUtils';

/**
 * Saves base64 image data to a file.
 * 
 * @example
 * ```typescript
 * const imageBase64 = await generateImage('A robot');
 * saveImage(imageBase64, 'output.png');
 * ```
 */
export function saveImage(imageBase64: string, filePath: string): void {
  const buffer = Buffer.from(imageBase64, 'base64');
  writeFileSync(filePath, buffer);
}

/**
 * Saves base64 audio data to a file.
 * 
 * @example
 * ```typescript
 * const audioBase64 = await generateSpeech('Hello!');
 * saveAudio(audioBase64, 'output.wav');
 * ```
 */
export function saveAudio(audioBase64: string, filePath: string): void {
  const buffer = Buffer.from(audioBase64, 'base64');
  writeFileSync(filePath, buffer);
}

/**
 * Loads an image file and converts it to base64.
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
 */
export async function batchGenerateText(
  prompts: string[],
  generateFn: (prompt: string) => Promise<string>
): Promise<string[]> {
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
 */
export async function streamToText(
  stream: AsyncIterable<{ text: string }>
): Promise<string> {
  let fullText = '';
  for await (const chunk of stream) {
    fullText += chunk.text;
  }
  return fullText;
}

