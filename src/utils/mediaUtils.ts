/**
 * @file Utility functions for handling media data in Node.js environments.
 */

import { promises as fs } from 'fs';

/**
 * Reads a file from the given path and converts it to a Base64 encoded string.
 * @param filePath The path to the file.
 * @returns A promise that resolves with the Base64 encoded string of the file.
 */
export async function fileToBase64(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.toString('base64');
}

/**
 * Converts a Buffer to a Base64 string.
 * @param buffer The buffer to convert.
 * @returns The Base64 encoded string.
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

