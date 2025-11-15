/**
 * @file Smart helper functions that auto-detect and simplify common operations.
 * Makes the toolkit more dynamic by reducing boilerplate and manual configuration.
 */

import { detectMimeType, isImage, isVideo, isAudio, suggestModel, extractFileName } from './autoDetect';
import { GeminiToolkit } from '../geminiService';
import { withAutoRetry } from './autoRetry';

/**
 * Smart file upload that auto-detects MIME type and handles both Node.js and browser files.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param file - File path (Node.js), File object (browser), or Blob
 * @param displayName - Optional display name (auto-detected from file if not provided)
 * @returns Uploaded file object
 * 
 * @example
 * ```typescript
 * // Node.js
 * const file = await smartUploadFile(toolkit, 'image.png');
 * 
 * // Browser
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = await smartUploadFile(toolkit, fileInput.files[0]);
 * ```
 */
export async function smartUploadFile(
  toolkit: GeminiToolkit,
  file: string | File | Blob,
  displayName?: string
) {
  // Defensive checks
  if (!toolkit) {
    throw new Error('smartUploadFile: toolkit parameter is required');
  }
  if (file === null || file === undefined) {
    throw new Error('smartUploadFile: file parameter is required');
  }
  
  // Validate file path if string
  if (typeof file === 'string') {
    if (file.trim().length === 0) {
      throw new Error('smartUploadFile: file path cannot be empty');
    }
    if (file.length > 4096) {
      throw new Error('smartUploadFile: file path exceeds maximum length of 4096 characters');
    }
  }
  
  // Auto-detect display name with fallback
  const fileName = displayName?.trim() || extractFileName(file) || 'untitled';
  if (fileName.length === 0) {
    throw new Error('smartUploadFile: unable to determine file name');
  }
  
  // Auto-detect MIME type
  let mimeType: string | undefined;
  if (typeof file === 'string') {
    mimeType = detectMimeType(file);
  } else if (file instanceof File) {
    mimeType = file.type || (file.name ? detectMimeType(file.name) : undefined);
  } else if (file instanceof Blob) {
    mimeType = file.type || 'application/octet-stream';
  } else {
    throw new Error('smartUploadFile: file must be a string path, File, or Blob');
  }

  return toolkit.uploadFile(file, {
    displayName: fileName,
    mimeType: mimeType !== 'application/octet-stream' ? mimeType : undefined,
  });
}

/**
 * Smart text generation that auto-selects model based on content.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param prompt - Text prompt
 * @param files - Optional files (auto-detects if images/videos are included)
 * @param usePro - Whether to use Pro model for complex reasoning (default: false)
 * @returns Generated text
 * 
 * @example
 * ```typescript
 * // Simple text
 * const text = await smartGenerateText(toolkit, 'Explain AI');
 * 
 * // With images (auto-selects image model)
 * const text = await smartGenerateText(toolkit, 'Describe this', [imageFile]);
 * 
 * // Complex reasoning (auto-selects Pro model)
 * const text = await smartGenerateText(toolkit, 'Solve this math problem', undefined, true);
 * ```
 */
export async function smartGenerateText(
  toolkit: GeminiToolkit,
  prompt: string,
  files?: (string | { uri?: string; name?: string; mimeType?: string })[],
  usePro: boolean = false
): Promise<string> {
  // Defensive checks
  if (!toolkit) {
    throw new Error('smartGenerateText: toolkit parameter is required');
  }
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('smartGenerateText: prompt must be a non-empty string');
  }
  if (prompt.trim().length === 0) {
    throw new Error('smartGenerateText: prompt cannot be empty or whitespace-only');
  }
  
  // Validate files array if provided
  if (files !== undefined) {
    if (!Array.isArray(files)) {
      throw new Error('smartGenerateText: files must be an array');
    }
    if (files.length > 100) {
      throw new Error('smartGenerateText: files array exceeds maximum length of 100');
    }
  }
  
  // Detect if files contain images/videos
  let hasImage = false;
  let hasVideo = false;

  if (files && files.length > 0) {
    for (const file of files) {
      if (file === null || file === undefined) {
        continue; // Skip null/undefined entries
      }
      if (typeof file === 'string') {
        if (file.trim().length > 0) {
          hasImage = hasImage || isImage(file);
          hasVideo = hasVideo || isVideo(file);
        }
      } else if (file && typeof file === 'object') {
        const mimeType = file.mimeType || '';
        if (mimeType) {
          hasImage = hasImage || mimeType.startsWith('image/');
          hasVideo = hasVideo || mimeType.startsWith('video/');
        }
      }
    }
  }

  // Auto-select model
  const useCase = usePro ? 'complex-reasoning' : hasImage || hasVideo ? 'image-analysis' : 'text-generation';
  const model = suggestModel(useCase, hasImage, hasVideo);

  return toolkit.generateText(prompt, {
    model,
    files: files as any,
  });
}

/**
 * Smart image analysis that auto-detects MIME type.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param image - Base64 image, file path, or File/Blob
 * @param prompt - Analysis prompt
 * @returns Analysis result
 * 
 * @example
 * ```typescript
 * // From file path (auto-detects MIME type)
 * const result = await smartAnalyzeImage(toolkit, 'photo.jpg', 'What is this?');
 * 
 * // From base64
 * const result = await smartAnalyzeImage(toolkit, base64Image, 'Describe this');
 * ```
 */
export async function smartAnalyzeImage(
  toolkit: GeminiToolkit,
  image: string | File | Blob,
  prompt: string
): Promise<string> {
  // Defensive checks
  if (!toolkit) {
    throw new Error('smartAnalyzeImage: toolkit parameter is required');
  }
  if (image === null || image === undefined) {
    throw new Error('smartAnalyzeImage: image parameter is required');
  }
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('smartAnalyzeImage: prompt must be a non-empty string');
  }
  
  let imageBase64: string;
  let mimeType: string;

  if (typeof image === 'string') {
    if (image.trim().length === 0) {
      throw new Error('smartAnalyzeImage: image path or data cannot be empty');
    }
    
    // Check if it's a file path or base64
    if (image.startsWith('data:') || image.length > 100) {
      // Likely base64
      imageBase64 = image.includes(',') ? image.split(',')[1] : image;
      if (!imageBase64 || imageBase64.trim().length === 0) {
        throw new Error('smartAnalyzeImage: invalid base64 data');
      }
      mimeType = image.startsWith('data:') 
        ? (image.match(/^data:([^;]+);base64,/) || [])[1] || 'image/png'
        : 'image/png';
    } else {
      // File path - validate length
      if (image.length > 4096) {
        throw new Error('smartAnalyzeImage: file path exceeds maximum length of 4096 characters');
      }
      // File path - need to read and convert
      const { fileToBase64 } = await import('./mediaUtils');
      imageBase64 = await fileToBase64(image);
      mimeType = detectMimeType(image);
    }
  } else {
    // File or Blob - validate size
    if (image instanceof File || image instanceof Blob) {
      if (image.size === 0) {
        throw new Error('smartAnalyzeImage: file is empty');
      }
      // Check reasonable size limit (100MB)
      const MAX_FILE_SIZE = 100 * 1024 * 1024;
      if (image.size > MAX_FILE_SIZE) {
        throw new Error(`smartAnalyzeImage: file size (${image.size} bytes) exceeds maximum of ${MAX_FILE_SIZE} bytes`);
      }
    }
    
    // File or Blob - convert to base64
    const { fileToBase64Browser } = await import('./browserUtils');
    imageBase64 = await fileToBase64Browser(image);
    if (!imageBase64 || imageBase64.trim().length === 0) {
      throw new Error('smartAnalyzeImage: failed to convert file to base64');
    }
    mimeType = image instanceof File 
      ? (image.type || (image.name ? detectMimeType(image.name) : 'image/png'))
      : (image.type || 'image/png');
  }

  return toolkit.analyzeMedia(imageBase64, mimeType, prompt);
}

/**
 * Smart image generation with auto-retry and better defaults.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param prompt - Image generation prompt
 * @param aspectRatio - Optional aspect ratio (default: '1:1')
 * @param retry - Whether to auto-retry on errors (default: true)
 * @returns Generated image base64
 */
export async function smartGenerateImage(
  toolkit: GeminiToolkit,
  prompt: string,
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' = '1:1',
  retry: boolean = true
): Promise<string> {
  const operation = () => toolkit.generateImage(prompt, { aspectRatio });

  if (retry) {
    return withAutoRetry(operation, {
      maxRetries: 3,
      retryOnRateLimit: true,
      retryOnServerError: true,
    });
  }

  return operation();
}

/**
 * Smart chat creation with auto-model selection.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param usePro - Whether to use Pro model (default: false)
 * @returns Chat instance
 */
export function smartCreateChat(toolkit: GeminiToolkit, usePro: boolean = false) {
  const model = usePro ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  return toolkit.createChat(model);
}

/**
 * Batch operations with auto-retry and progress tracking.
 * 
 * @param toolkit - GeminiToolkit instance
 * @param operations - Array of async operations
 * @param options - Batch options
 * @returns Array of results
 * 
 * @example
 * ```typescript
 * const results = await smartBatch(toolkit, [
 *   () => toolkit.generateText('Prompt 1'),
 *   () => toolkit.generateText('Prompt 2'),
 *   () => toolkit.generateText('Prompt 3'),
 * ], { concurrency: 2, onProgress: (i, total) => console.log(`${i}/${total}`) });
 * ```
 */
export async function smartBatch<T>(
  toolkit: GeminiToolkit,
  operations: (() => Promise<T>)[],
  options: {
    concurrency?: number;
    retry?: boolean;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<T[]> {
  // Defensive checks
  if (!toolkit) {
    throw new Error('smartBatch: toolkit parameter is required');
  }
  if (!Array.isArray(operations)) {
    throw new Error('smartBatch: operations must be an array');
  }
  if (operations.length === 0) {
    return []; // Return empty array for empty operations
  }
  if (operations.length > 1000) {
    throw new Error('smartBatch: operations array exceeds maximum length of 1000');
  }
  
  // Validate operations are functions
  for (let i = 0; i < operations.length; i++) {
    if (typeof operations[i] !== 'function') {
      throw new Error(`smartBatch: operations[${i}] must be a function`);
    }
  }
  
  const { concurrency = 3, retry = true, onProgress } = options;
  
  // Validate concurrency
  if (typeof concurrency !== 'number' || concurrency < 1 || concurrency > 100) {
    throw new Error('smartBatch: concurrency must be a number between 1 and 100');
  }
  
  const results: T[] = [];
  const total = operations.length;
  const errors: Array<{ index: number; error: unknown }> = [];

  // Process in batches with error handling
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    const batchIndices = batch.map((_, idx) => i + idx);
    
    const batchResults = await Promise.allSettled(
      batch.map(async (operation, batchIdx) => {
        try {
          const op = retry 
            ? () => withAutoRetry(operation, { maxRetries: 2 })
            : operation;
          return await op();
        } catch (error) {
          errors.push({ index: batchIndices[batchIdx], error });
          throw error; // Re-throw to mark as rejected in Promise.allSettled
        }
      })
    );

    // Process results and handle errors
    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        // Error already logged in errors array
        // Optionally, you could push a default value or re-throw
        throw new Error(`smartBatch: Operation at index ${batchIndices[j]} failed: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`);
      }
    }
    
    if (onProgress) {
      try {
        onProgress(results.length, total);
      } catch (progressError) {
        // Don't let progress callback errors break the batch
        console.warn('smartBatch: onProgress callback threw an error:', progressError);
      }
    }
  }

  if (errors.length > 0 && results.length === 0) {
    // If all operations failed, throw the first error
    throw errors[0].error;
  }

  return results;
}

