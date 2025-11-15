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
  // Auto-detect display name
  const fileName = displayName || extractFileName(file);
  
  // Auto-detect MIME type
  let mimeType: string | undefined;
  if (typeof file === 'string') {
    mimeType = detectMimeType(file);
  } else if (file instanceof File) {
    mimeType = file.type || detectMimeType(file.name);
  } else if (file instanceof Blob) {
    mimeType = file.type || 'application/octet-stream';
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
  // Detect if files contain images/videos
  let hasImage = false;
  let hasVideo = false;

  if (files && files.length > 0) {
    for (const file of files) {
      if (typeof file === 'string') {
        hasImage = hasImage || isImage(file);
        hasVideo = hasVideo || isVideo(file);
      } else if (file && typeof file === 'object') {
        const mimeType = file.mimeType || '';
        hasImage = hasImage || mimeType.startsWith('image/');
        hasVideo = hasVideo || mimeType.startsWith('video/');
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
  let imageBase64: string;
  let mimeType: string;

  if (typeof image === 'string') {
    // Check if it's a file path or base64
    if (image.startsWith('data:') || image.length > 100) {
      // Likely base64
      imageBase64 = image.includes(',') ? image.split(',')[1] : image;
      mimeType = image.startsWith('data:') 
        ? (image.match(/^data:([^;]+);base64,/) || [])[1] || 'image/png'
        : 'image/png';
    } else {
      // File path - need to read and convert
      const { fileToBase64 } = await import('./mediaUtils');
      imageBase64 = await fileToBase64(image);
      mimeType = detectMimeType(image);
    }
  } else {
    // File or Blob - convert to base64
    const { fileToBase64Browser } = await import('./browserUtils');
    imageBase64 = await fileToBase64Browser(image);
    mimeType = image instanceof File 
      ? (image.type || detectMimeType(image.name))
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
  const { concurrency = 3, retry = true, onProgress } = options;
  const results: T[] = [];
  const total = operations.length;

  // Process in batches
  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    
    const batchResults = await Promise.all(
      batch.map(async (operation) => {
        const op = retry 
          ? () => withAutoRetry(operation, { maxRetries: 2 })
          : operation;
        return op();
      })
    );

    results.push(...batchResults);
    
    if (onProgress) {
      onProgress(results.length, total);
    }
  }

  return results;
}

