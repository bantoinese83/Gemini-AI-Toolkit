/**
 * @file Core AI service for text, image, video, and audio generation operations.
 * Handles the fundamental AI generation capabilities of the Gemini API.
 */

import { GoogleGenAI } from '@google/genai';
import {
  AspectRatio,
  VideoAspectRatio,
  FileObject,
} from '../types';
import {
  ApiRequestError,
  ModelResponseError,
} from '../errors';
import {
  validateNonEmptyString,
  validateBase64,
  validateMimeType,
  validateAspectRatio,
  validateVideoAspectRatio,
  validateNumberInRange,
  validatePositiveInteger,
  validateNonEmptyArray,
} from '../validators';
import {
  resolveModel,
  extractTextFromResponse,
  extractInlineDataFromResponse,
  validateResolution,
} from '../helpers';
import { sanitizeError } from '../utils/security';
import { detectMimeType } from '../utils/autoDetect';
import { DEFAULT_MODELS, DEFAULT_VOICES, DEFAULT_ASPECT_RATIOS, DEFAULT_VIDEO_RESOLUTION, GENERATION_LIMITS } from '../constants';

/**
 * Options for generating text content.
 */
export interface GenerateTextOptions {
  /** Model name to use (default: 'gemini-2.5-flash') */
  model?: string;
  /** Additional configuration options for the model */
  config?: Record<string, unknown>;
  /** Files to include in the prompt (FileObject or file URIs) */
  files?: (FileObject | string)[];
  /** Cached content name to use */
  cachedContent?: string;
  /** System instruction */
  systemInstruction?: string;
}

/**
 * Options for generating images.
 */
export interface GenerateImageOptions {
  /** Model name to use (default: 'imagen-4.0-generate-001') */
  model?: string;
  /** Aspect ratio for the generated image (default: '1:1') */
  aspectRatio?: AspectRatio;
  /** Number of images to generate (1-4, default: 1) */
  numberOfImages?: number;
  /** Output MIME type */
  outputMimeType?: string;
}

/**
 * Options for generating video.
 */
export interface GenerateVideoOptions {
  /** Model name to use (default: 'veo-3.1-fast-generate-preview') */
  model?: string;
  /** Aspect ratio for the generated video */
  aspectRatio?: VideoAspectRatio;
  /** Video resolution */
  resolution?: string;
  /** Number of videos to generate (default: 1) */
  numberOfVideos?: number;
}

/**
 * Options for generating speech.
 */
export interface GenerateSpeechOptions {
  /** Model name to use (default: 'gemini-2.5-flash-preview-tts') */
  model?: string;
  /** Voice name to use */
  voiceName?: string;
  /** Language code (default: 'en-US') */
  languageCode?: string;
}

/**
 * Core AI service for text, image, video, and audio generation.
 */
export class CoreAIService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Generates text content using the specified model.
   */
  async generateText(
    prompt: string,
    options: GenerateTextOptions = {}
  ): Promise<string> {
    validateNonEmptyString(prompt, 'prompt');
    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT);

    try {
      const config: Record<string, unknown> = { ...(options.config || {}) };

      // Add cached content if provided
      if (options.cachedContent) {
        validateNonEmptyString(options.cachedContent, 'cachedContent');
        config.cachedContent = options.cachedContent;
      }

      // Add system instruction if provided
      if (options.systemInstruction) {
        validateNonEmptyString(options.systemInstruction, 'systemInstruction');
        config.systemInstruction = options.systemInstruction;
      }

      // Build contents - handle files if provided
      let contents: unknown;

      if (options.files && options.files.length > 0) {
        // Build parts array with files and text
        const parts: unknown[] = [];

        for (const file of options.files) {
          let fileUri: string | undefined;
          let mimeType: string | undefined;

          if (typeof file === 'string') {
            // File URI string
            fileUri = file;
          } else if (file && typeof file === 'object') {
            if ('uri' in file && file.uri) {
              // FileObject with URI
              fileUri = file.uri as string;
              mimeType = (file as FileObject).mimeType;
            } else if ('name' in file && file.name) {
              // FileObject - need to get URI
              const fileObj = await this.getFile(file.name as string);
              fileUri = fileObj.uri;
              mimeType = fileObj.mimeType;
            }
          }

          if (fileUri) {
            // Use createPartFromUri helper if available, otherwise construct manually
            try {
              const { createPartFromUri } = await import('@google/genai');
              const part = createPartFromUri(fileUri, mimeType || '');
              parts.push(part);
            } catch {
              // Fallback if helper not available
              parts.push({ fileData: { fileUri, mimeType: mimeType || '' } } as any);
            }
          }
        }

        // Add text prompt
        parts.push(prompt);

        // Use createUserContent helper if available
        try {
          const { createUserContent } = await import('@google/genai');
          contents = createUserContent(parts as any);
        } catch {
          // Fallback
          contents = [{ parts }] as any;
        }
      } else {
        // No files, just use prompt
        contents = prompt;
      }

      const response = await this.client.models.generateContent({
        model,
        contents: contents as any,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      return extractTextFromResponse(response, model, 'text generation');
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate text: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates an image using Imagen based on a text prompt.
   */
  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {}
  ): Promise<string> {
    validateNonEmptyString(prompt, 'prompt');
    const model = resolveModel(options.model, DEFAULT_MODELS.IMAGE);

    const aspectRatio = options.aspectRatio || DEFAULT_ASPECT_RATIOS.IMAGE;
    const numberOfImages = options.numberOfImages || 1;
    const outputMimeType = options.outputMimeType || 'image/png';

    validateAspectRatio(aspectRatio, 'aspectRatio');
    validateNumberInRange(numberOfImages, 'numberOfImages', GENERATION_LIMITS.MIN_IMAGES, GENERATION_LIMITS.MAX_IMAGES);
    validateMimeType(outputMimeType, 'outputMimeType');

    try {
      const response = await this.client.models.generateImages({
        model,
        prompt,
        aspectRatio: aspectRatio as any,
        numberOfImages,
        outputMimeType,
      } as any);

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new ModelResponseError(
          `Model ${model} did not generate any images for the prompt.`,
          model
        );
      }

      const firstImage = response.generatedImages[0];
      if (!firstImage?.image?.imageBytes) {
        throw new ModelResponseError(
          `Model ${model} generated an image but no image data was returned.`,
          model
        );
      }

      return firstImage.image.imageBytes;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Edits an existing image based on a text prompt.
   */
  async editImage(
    imageBase64: string,
    mimeType: string,
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT_IMAGE
  ): Promise<string> {
    validateBase64(imageBase64, 'imageBase64');
    validateMimeType(mimeType, 'mimeType');
    validateNonEmptyString(prompt, 'prompt');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT_IMAGE);

    try {
      // Convert base64 to buffer for processing
      const imageBuffer = Buffer.from(imageBase64, 'base64');

      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageBuffer.toString('base64'),
                  mimeType,
                },
              },
            ],
          },
        ],
      });

      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts?.[0]) {
        throw new ModelResponseError(
          `Model ${resolvedModel} did not return edited image content.`,
          resolvedModel
        );
      }

      return extractInlineDataFromResponse(
        candidate.content.parts[0],
        resolvedModel,
        'edited image'
      );
    } catch (error) {
      throw new ApiRequestError(
        `Failed to edit image: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Analyzes media content (images, videos) and returns analysis text.
   */
  async analyzeMedia(
    data: string | string[],
    mimeType: string,
    prompt: string,
    options: { model?: string; isVideo?: boolean } = {}
  ): Promise<string> {
    if (Array.isArray(data)) {
      validateNonEmptyArray(data, 'data');
      for (let index = 0; index < data.length; index++) {
        validateBase64(data[index], `data[${index}]`);
      }
    } else {
      validateBase64(data, 'data');
    }

    validateMimeType(mimeType, 'mimeType');
    validateNonEmptyString(prompt, 'prompt');

    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT_IMAGE);

    try {
      const parts: unknown[] = [];

      if (Array.isArray(data)) {
        // Multiple frames (video)
        for (const frame of data) {
          parts.push({
            inlineData: {
              data: frame,
              mimeType,
            },
          });
        }
      } else {
        // Single image
        parts.push({
          inlineData: {
            data,
            mimeType,
          },
        });
      }

      // Add the prompt
      parts.push({ text: prompt });

      const response = await this.client.models.generateContent({
        model,
        contents: [{ parts }] as any,
      });

      return extractTextFromResponse(response, model, 'media analysis');
    } catch (error) {
      throw new ApiRequestError(
        `Failed to analyze media: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates a video from an image and text prompt.
   */
  async generateVideo(
    imageBase64: string,
    mimeType: string,
    prompt: string,
    options: GenerateVideoOptions = {}
  ): Promise<unknown> {
    validateBase64(imageBase64, 'imageBase64');
    validateMimeType(mimeType, 'mimeType');
    validateNonEmptyString(prompt, 'prompt');

    const model = resolveModel(options.model, DEFAULT_MODELS.VIDEO);
    const aspectRatio = options.aspectRatio || DEFAULT_ASPECT_RATIOS.VIDEO as VideoAspectRatio;
    const resolution = options.resolution || DEFAULT_VIDEO_RESOLUTION;
    const numberOfVideos = options.numberOfVideos || 1;

    validateVideoAspectRatio(aspectRatio, 'aspectRatio');
    validateResolution(resolution, 'resolution');
    validateNumberInRange(numberOfVideos, 'numberOfVideos', GENERATION_LIMITS.MIN_VIDEOS, GENERATION_LIMITS.MAX_VIDEOS);

    try {
      const imageBuffer = Buffer.from(imageBase64, 'base64');

      return await this.client.models.generateVideos({
        model,
        sourceMedia: {
          image: {
            imageBytes: imageBuffer.toString('base64'),
            mimeType,
          },
        },
        prompt,
        aspectRatio: aspectRatio as any,
        resolution,
        numberOfVideos,
      } as any);
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate video: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates speech from text using the specified voice.
   */
  async generateSpeech(
    text: string,
    options: GenerateSpeechOptions = {}
  ): Promise<string> {
    validateNonEmptyString(text, 'text');

    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT_TTS);
    const voiceName = options.voiceName || DEFAULT_VOICES.SPEECH;
    const languageCode = options.languageCode || 'en-US';

    validateNonEmptyString(voiceName, 'voiceName');

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: [
          {
            parts: [
              {
                text: `${text}

Generate speech using voice: ${voiceName}, language: ${languageCode}`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceName,
            languageCode,
          } as any,
        } as any,
      });

      const candidate = response.candidates?.[0];
      if (!candidate?.content?.parts?.[0]) {
        throw new ModelResponseError(
          `Model ${model} did not return speech content.`,
          model
        );
      }

      return extractInlineDataFromResponse(
        candidate.content.parts[0],
        model,
        'generated speech'
      );
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate speech: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Helper method to get file information (used internally for file processing).
   */
  private async getFile(fileName: string): Promise<FileObject> {
    validateNonEmptyString(fileName, 'fileName');

    try {
      const response = await this.client.files.get({ name: fileName });
      return response as FileObject;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to get file ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
