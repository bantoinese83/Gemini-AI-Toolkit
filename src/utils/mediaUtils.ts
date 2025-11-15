/**
 * @file Utility functions for handling media data in Node.js environments.
 * 
 * ⚠️ **Node.js only** - These utilities require Node.js file system APIs.
 * For browser usage, use FileReader API or fetch() for remote files.
 */

// Node.js-only imports - will be undefined in browser
let fs: typeof import('fs')['promises'] | undefined;
let Buffer: typeof globalThis.Buffer | undefined;

// Try to import Node.js modules (will fail gracefully in browser)
try {
  if (typeof require !== 'undefined') {
    fs = require('fs').promises;
    Buffer = globalThis.Buffer || require('buffer').Buffer;
  }
} catch {
  // Running in browser - file operations won't be available
}

/**
 * Reads a file from the given path and converts it to a Base64 encoded string.
 * 
 * ⚠️ **Node.js only** - Not available in browser environments.
 * For browser usage, use FileReader API or fetch() for remote files.
 * 
 * @param filePath The path to the file.
 * @returns A promise that resolves with the Base64 encoded string of the file.
 */
export async function fileToBase64(filePath: string): Promise<string> {
  if (!fs) {
    throw new Error(
      'fileToBase64 is only available in Node.js environments. ' +
      'For browser usage, use FileReader API or fetch() for remote files.'
    );
  }
  const fileBuffer = await fs.readFile(filePath);
  return fileBuffer.toString('base64');
}

/**
 * Converts a Buffer to a Base64 string.
 * 
 * ⚠️ **Node.js only** - Not available in browser environments.
 * For browser usage, use Blob/ArrayBuffer APIs.
 * 
 * @param buffer The buffer to convert.
 * @returns The Base64 encoded string.
 */
export function bufferToBase64(buffer: Buffer | ArrayBuffer | Uint8Array): string {
  if (buffer instanceof ArrayBuffer || buffer instanceof Uint8Array) {
    // Browser-compatible: convert ArrayBuffer/Uint8Array to base64
    const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  // Node.js Buffer
  if (!Buffer) {
    throw new Error('Buffer is not available in this environment');
  }
  // Type assertion needed because TypeScript doesn't know Buffer type at compile time
  const nodeBuffer = buffer as InstanceType<typeof Buffer>;
  return nodeBuffer.toString('base64');
}

