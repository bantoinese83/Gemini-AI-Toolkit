/**
 * @file Core service for interacting with the Google Gemini API.
 * Provides a clean, type-safe interface for all Gemini capabilities with
 * comprehensive error handling and input validation.
 * 
 * Follows DRY, SOLID, and KISS principles.
 */

import {
  GoogleGenAI,
  GenerateContentResponse,
  Chat,
  Modality,
  LiveServerMessage,
} from '@google/genai';
import { AspectRatio, Location } from './types';
import {
  ApiKeyError,
  ValidationError,
  ApiRequestError,
  ModelResponseError,
} from './errors';
import {
  validateNonEmptyString,
  validateBase64,
  validateMimeType,
  validateAspectRatio,
  validateVideoAspectRatio,
  validateLocation,
  validateNonEmptyArray,
  validatePositiveInteger,
} from './validators';
import {
  DEFAULT_MODELS,
  DEFAULT_VOICES,
  DEFAULT_ASPECT_RATIOS,
  DEFAULT_VIDEO_RESOLUTION,
  DEFAULT_THINKING_BUDGET,
  GENERATION_LIMITS,
} from './constants';
import {
  resolveModel,
  extractTextFromResponse,
  extractInlineDataFromResponse,
  validateNumberRange,
  validateResolution,
} from './helpers';

/**
 * Configuration for initializing the Gemini Toolkit.
 * 
 * @example
 * ```typescript
 * const toolkit = new GeminiToolkit({ apiKey: 'your-key' });
 * ```
 */
export interface GeminiToolkitConfig {
  /** Your Google Gemini API key (required) */
  apiKey: string;
}

/**
 * Options for generating text content.
 * 
 * @example
 * ```typescript
 * await toolkit.generateText('Hello!', { model: 'gemini-2.5-pro' });
 * ```
 */
export interface GenerateTextOptions {
  /** Model name to use (default: 'gemini-2.5-flash') */
  model?: string;
  /** Additional configuration options for the model */
  config?: Record<string, unknown>;
}

/**
 * Options for generating images.
 * 
 * @example
 * ```typescript
 * await toolkit.generateImage('A robot', { aspectRatio: '16:9' });
 * ```
 */
export interface GenerateImageOptions {
  /** Model name to use (default: 'imagen-4.0-generate-001') */
  model?: string;
  /** Aspect ratio for the generated image (default: '1:1') */
  aspectRatio?: AspectRatio;
  /** Number of images to generate (1-4, default: 1) */
  numberOfImages?: number;
  /** Output MIME type (default: 'image/png') */
  outputMimeType?: string;
}

/**
 * Options for generating videos.
 * 
 * @example
 * ```typescript
 * await toolkit.generateVideo(image, 'image/png', 'Make it move', { aspectRatio: '16:9' });
 * ```
 */
export interface GenerateVideoOptions {
  /** Model name to use (default: 'veo-3.1-fast-generate-preview') */
  model?: string;
  /** Aspect ratio for the generated video (default: '16:9') */
  aspectRatio?: '16:9' | '9:16';
  /** Video resolution (default: '720p') */
  resolution?: '720p' | '1080p';
  /** Number of videos to generate (default: 1) */
  numberOfVideos?: number;
}

/**
 * Options for generating speech from text.
 * 
 * @example
 * ```typescript
 * await toolkit.generateSpeech('Hello!', { voiceName: 'Kore' });
 * ```
 */
export interface GenerateSpeechOptions {
  /** Model name to use (default: 'gemini-2.5-flash-preview-tts') */
  model?: string;
  /** Voice name to use (default: 'Kore') */
  voiceName?: string;
}

/**
 * Options for live conversation sessions.
 * 
 * @example
 * ```typescript
 * await toolkit.connectLive(callbacks, { voiceName: 'Zephyr' });
 * ```
 */
export interface LiveConversationOptions {
  /** Model name to use (default: 'gemini-2.5-flash-native-audio-preview-09-2025') */
  model?: string;
  /** Voice name to use (default: 'Zephyr') */
  voiceName?: string;
  /** Response modalities (default: [Modality.AUDIO]) */
  responseModalities?: Modality[];
}

/**
 * Error event emitted by live conversation sessions.
 */
export interface LiveErrorEvent {
  /** Error message */
  message?: string;
  /** Original error object */
  error?: Error;
}

/**
 * Close event emitted when a live conversation session closes.
 */
export interface LiveCloseEvent {
  /** Close code */
  code?: number;
  /** Reason for closing */
  reason?: string;
  /** Whether the connection closed cleanly */
  wasClean?: boolean;
}

/**
 * Callbacks for handling live conversation session events.
 */
export interface LiveSessionCallbacks {
  /** Called when the session opens */
  onopen: () => void;
  /** Called when a message is received */
  onmessage: (message: LiveServerMessage) => Promise<void> | void;
  /** Called when an error occurs */
  onerror: (event: LiveErrorEvent) => void;
  /** Called when the session closes */
  onclose: (event: LiveCloseEvent) => void;
}

/**
 * Result of a grounded search or maps query.
 */
export interface GroundedResult {
  /** Generated text response */
  text: string;
  /** Full response candidates with metadata */
  candidates: GenerateContentResponse['candidates'];
}

/**
 * Main class for interacting with the Google Gemini API.
 * Provides methods for text generation, chat, image/video generation,
 * media analysis, speech synthesis, and grounding features.
 *
 * @example
 * ```typescript
 * const toolkit = new GeminiToolkit({ apiKey: 'your-api-key' });
 * const text = await toolkit.generateText('Hello, world!');
 * ```
 */
export class GeminiToolkit {
  private readonly client: GoogleGenAI;
  private readonly apiKey: string;

  /**
   * Creates a new GeminiToolkit instance.
   *
   * @param config - Configuration object containing the API key
   * @throws {ApiKeyError} If the API key is missing or invalid
   * 
   * @example
   * ```typescript
   * const toolkit = new GeminiToolkit({ apiKey: process.env.GEMINI_API_KEY });
   * ```
   */
  constructor(config: GeminiToolkitConfig) {
    this.validateApiKey(config.apiKey);
    this.apiKey = config.apiKey;
    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Validates the API key.
   */
  private validateApiKey(apiKey: unknown): asserts apiKey is string {
    try {
      validateNonEmptyString(apiKey, 'apiKey');
    } catch (error) {
      throw new ApiKeyError(
        error instanceof ValidationError ? error.message : 'API key is required'
      );
    }
  }

  /**
   * Executes an API call with error handling (DRY principle).
   */
  private async executeApiCall<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleApiError(error, operationName);
      throw error;
    }
  }

  /**
   * Generates text content using the specified Gemini model.
   *
   * @param prompt - The text prompt to generate content from
   * @param options - Optional configuration for text generation
   * @returns Promise resolving to the generated text
   * @throws {ValidationError} If the prompt is invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If the model returns an invalid response
   *
   * @example
   * ```typescript
   * const text = await toolkit.generateText('Explain quantum computing');
   * ```
   */
  async generateText(
    prompt: string,
    options: GenerateTextOptions = {}
  ): Promise<string> {
    validateNonEmptyString(prompt, 'prompt');
    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT);

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model,
        contents: prompt,
        config: options.config || {},
      });

      return extractTextFromResponse(response, model, 'text generation');
    }, 'generateText');
  }

  /**
   * Creates a new chat session for conversational interactions.
   *
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns A Chat instance for sending messages
   * @throws {ValidationError} If the model name is invalid
   *
   * @example
   * ```typescript
   * const chat = toolkit.createChat();
   * const response = await chat.sendMessage({ message: 'Hello!' });
   * ```
   */
  createChat(model: string = DEFAULT_MODELS.TEXT): Chat {
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);
    return this.client.chats.create({
      model: resolvedModel,
      history: [],
    });
  }

  /**
   * Generates an image using Imagen based on a text prompt.
   *
   * @param prompt - Text description of the image to generate
   * @param options - Optional configuration for image generation
   * @returns Promise resolving to base64-encoded image data
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no image is generated
   *
   * @example
   * ```typescript
   * const imageBase64 = await toolkit.generateImage(
   *   'A futuristic city at sunset',
   *   { aspectRatio: '16:9' }
   * );
   * ```
   */
  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {}
  ): Promise<string> {
    validateNonEmptyString(prompt, 'prompt');
    const model = resolveModel(options.model, DEFAULT_MODELS.IMAGE);
    const aspectRatio = options.aspectRatio || DEFAULT_ASPECT_RATIOS.IMAGE;
    validateAspectRatio(aspectRatio, 'aspectRatio');

    const numberOfImages = options.numberOfImages || 1;
    validateNumberRange(
      numberOfImages,
      'numberOfImages',
      GENERATION_LIMITS.MIN_IMAGES,
      GENERATION_LIMITS.MAX_IMAGES
    );

    const outputMimeType = options.outputMimeType || 'image/png';
    validateMimeType(outputMimeType, 'outputMimeType');

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateImages({
        model,
        prompt,
        config: {
          numberOfImages,
          outputMimeType,
          aspectRatio,
        },
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new ModelResponseError(
          `Model ${model} did not generate any images.`,
          model
        );
      }

      const firstImage = response.generatedImages[0];
      if (!firstImage?.image?.imageBytes) {
        throw new ModelResponseError(
          `Model ${model} generated an image but the image data is missing.`,
          model
        );
      }

      return firstImage.image.imageBytes;
    }, 'generateImage');
  }

  /**
   * Edits an existing image based on a text prompt.
   *
   * @param imageBase64 - Base64-encoded image data
   * @param mimeType - MIME type of the image (e.g., 'image/png')
   * @param prompt - Text description of the desired edits
   * @param model - Model name to use (default: 'gemini-2.5-flash-image')
   * @returns Promise resolving to base64-encoded edited image data
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no edited image is generated
   *
   * @example
   * ```typescript
   * const editedImage = await toolkit.editImage(
   *   imageBase64,
   *   'image/png',
   *   'Add a retro filter'
   * );
   * ```
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

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: {
          parts: [
            { inlineData: { data: imageBase64, mimeType } },
            { text: prompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      return extractInlineDataFromResponse(part, resolvedModel, 'an edited image');
    }, 'editImage');
  }

  /**
   * Analyzes media content (images, video frames, or audio).
   *
   * @param data - Base64-encoded media data or array of base64 strings for video frames
   * @param mimeType - MIME type of the media (e.g., 'image/png', 'video/mp4', 'audio/webm')
   * @param prompt - Question or instruction for the analysis
   * @param options - Optional configuration including model and whether it's video
   * @returns Promise resolving to the analysis text
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no analysis is generated
   *
   * @example
   * ```typescript
   * const analysis = await toolkit.analyzeMedia(
   *   imageBase64,
   *   'image/png',
   *   'What objects are in this image?'
   * );
   * ```
   */
  async analyzeMedia(
    data: string | string[],
    mimeType: string,
    prompt: string,
    options: {
      model?: string;
      isVideo?: boolean;
    } = {}
  ): Promise<string> {
    // Validate data
    if (Array.isArray(data)) {
      validateNonEmptyArray(data, 'data');
      data.forEach((frame, index) => {
        validateBase64(frame, `data[${index}]`);
      });
    } else {
      validateBase64(data, 'data');
    }

    validateMimeType(mimeType, 'mimeType');
    validateNonEmptyString(prompt, 'prompt');
    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT);

    // Build content parts
    const parts = Array.isArray(data)
      ? data.map((frame) => ({ inlineData: { data: frame, mimeType } }))
      : [{ inlineData: { data, mimeType } }];

    const fullPrompt = options.isVideo
      ? `Analyze these video frames. ${prompt}`
      : prompt;

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model,
        contents: { parts: [...parts, { text: fullPrompt }] },
      });

      return extractTextFromResponse(response, model, 'media analysis');
    }, 'analyzeMedia');
  }

  /**
   * Generates a video from an image and text prompt using Veo.
   *
   * @param imageBase64 - Base64-encoded starting image
   * @param mimeType - MIME type of the image
   * @param prompt - Text description of the video to generate
   * @param options - Optional configuration for video generation
   * @returns Promise resolving to a video generation operation
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const operation = await toolkit.generateVideo(
   *   imageBase64,
   *   'image/png',
   *   'Make the robot wave',
   *   { aspectRatio: '16:9' }
   * );
   * ```
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
    const aspectRatio = options.aspectRatio || DEFAULT_ASPECT_RATIOS.VIDEO;
    validateVideoAspectRatio(aspectRatio, 'aspectRatio');

    const resolution = options.resolution || DEFAULT_VIDEO_RESOLUTION;
    validateResolution(resolution, 'resolution');

    const numberOfVideos = options.numberOfVideos || 1;
    validateNumberRange(
      numberOfVideos,
      'numberOfVideos',
      GENERATION_LIMITS.MIN_VIDEOS,
      GENERATION_LIMITS.MAX_VIDEOS
    );

    return this.executeApiCall(async () => {
      return await this.client.models.generateVideos({
        model,
        prompt,
        image: {
          imageBytes: imageBase64,
          mimeType,
        },
        config: {
          numberOfVideos,
          resolution,
          aspectRatio,
        },
      });
    }, 'generateVideo');
  }

  /**
   * Generates speech audio from text.
   *
   * @param text - Text to convert to speech
   * @param options - Optional configuration for speech generation
   * @returns Promise resolving to base64-encoded audio data
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no audio is generated
   *
   * @example
   * ```typescript
   * const audioBase64 = await toolkit.generateSpeech('Hello, world!');
   * ```
   */
  async generateSpeech(
    text: string,
    options: GenerateSpeechOptions = {}
  ): Promise<string> {
    validateNonEmptyString(text, 'text');
    const model = resolveModel(options.model, DEFAULT_MODELS.TEXT_TTS);
    const voiceName = options.voiceName || DEFAULT_VOICES.SPEECH;
    validateNonEmptyString(voiceName, 'voiceName');

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      return extractInlineDataFromResponse(part, model, 'audio data');
    }, 'generateSpeech');
  }

  /**
   * Connects to a live conversation session for real-time audio interactions.
   *
   * @param callbacks - Event callbacks for the live session
   * @param options - Optional configuration for the live session
   * @returns Promise resolving to the live session object
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the connection fails
   *
   * @example
   * ```typescript
   * const session = await toolkit.connectLive({
   *   onopen: () => console.log('Connected'),
   *   onmessage: async (message) => { /* handle message *\/ },
   *   onerror: (event) => console.error('Error:', event),
   *   onclose: (event) => console.log('Disconnected')
   * });
   * ```
   */
  async connectLive(
    callbacks: LiveSessionCallbacks,
    options: LiveConversationOptions = {}
  ): Promise<unknown> {
    this.validateLiveCallbacks(callbacks);

    const model = resolveModel(options.model, DEFAULT_MODELS.LIVE);
    const voiceName = options.voiceName || DEFAULT_VOICES.LIVE;
    validateNonEmptyString(voiceName, 'voiceName');
    const responseModalities = options.responseModalities || [Modality.AUDIO];

    return this.executeApiCall(async () => {
      return await this.client.live.connect({
        model,
        callbacks,
        config: {
          responseModalities,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });
    }, 'connectLive');
  }

  /**
   * Validates live session callbacks (extracted for clarity - KISS).
   */
  private validateLiveCallbacks(callbacks: unknown): asserts callbacks is LiveSessionCallbacks {
    if (!callbacks || typeof callbacks !== 'object') {
      throw new ValidationError(
        'callbacks must be an object with onopen, onmessage, onerror, and onclose functions',
        'callbacks'
      );
    }

    const requiredCallbacks = ['onopen', 'onmessage', 'onerror', 'onclose'] as const;
    for (const callbackName of requiredCallbacks) {
      if (typeof (callbacks as Record<string, unknown>)[callbackName] !== 'function') {
        throw new ValidationError(
          `callbacks.${callbackName} must be a function`,
          `callbacks.${callbackName}`
        );
      }
    }
  }

  /**
   * Grounds a prompt with Google Search results for up-to-date information.
   *
   * @param prompt - The search query or prompt
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns Promise resolving to the grounded result with text and candidates
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.groundWithSearch('Latest AI developments');
   * console.log(result.text);
   * ```
   */
  async groundWithSearch(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'search grounding');
      return {
        text,
        candidates: response.candidates,
      };
    }, 'groundWithSearch');
  }

  /**
   * Grounds a prompt with Google Maps data for location-based information.
   *
   * @param prompt - The location query or prompt
   * @param location - Optional geographic coordinates for location context
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns Promise resolving to the grounded result with text and candidates
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.groundWithMaps(
   *   'Find nearby restaurants',
   *   { latitude: 37.7749, longitude: -122.4194 }
   * );
   * ```
   */
  async groundWithMaps(
    prompt: string,
    location?: Location,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    if (location) {
      validateLocation(location, 'location');
    }
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    return this.executeApiCall(async () => {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: location
            ? {
                retrievalConfig: {
                  latLng: location,
                },
              }
            : undefined,
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'maps grounding');
      return {
        text,
        candidates: response.candidates,
      };
    }, 'groundWithMaps');
  }

  /**
   * Generates text with thinking mode enabled for complex problem-solving.
   *
   * @param prompt - The prompt for complex reasoning
   * @param thinkingBudget - Budget for thinking tokens (default: 32768)
   * @param model - Model name to use (default: 'gemini-2.5-pro')
   * @returns Promise resolving to the generated text
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.generateWithThinking(
   *   'Solve this complex mathematical problem...',
   *   32768
   * );
   * ```
   */
  async generateWithThinking(
    prompt: string,
    thinkingBudget: number = DEFAULT_THINKING_BUDGET,
    model: string = DEFAULT_MODELS.TEXT_PRO
  ): Promise<string> {
    validateNonEmptyString(prompt, 'prompt');
    validatePositiveInteger(thinkingBudget, 'thinkingBudget');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT_PRO);

    return this.generateText(prompt, {
      model: resolvedModel,
      config: {
        thinkingConfig: { thinkingBudget },
      },
    });
  }

  /**
   * Gets the underlying GoogleGenAI client instance for advanced usage.
   *
   * @returns The GoogleGenAI client instance
   *
   * @example
   * ```typescript
   * const client = toolkit.getClient();
   * // Use client for advanced operations not covered by the toolkit
   * ```
   */
  getClient(): GoogleGenAI {
    return this.client;
  }

  /**
   * Handles API errors and wraps them in appropriate error types.
   */
  private handleApiError(error: unknown, operation: string): void {
    if (error instanceof ApiRequestError || error instanceof ModelResponseError) {
      return; // Already wrapped
    }

    if (error instanceof Error) {
      // Try to extract status code from error
      let statusCode: number | undefined;
      if ('status' in error) {
        statusCode = error.status as number;
      } else if ('statusCode' in error) {
        statusCode = error.statusCode as number;
      } else if ('code' in error && typeof error.code === 'string' && error.code.startsWith('ERR_HTTP_')) {
        // Extract status from HTTP error codes
        const match = error.message.match(/\b(\d{3})\b/);
        if (match) {
          statusCode = parseInt(match[1], 10);
        }
      }

      throw new ApiRequestError(
        `Failed to ${operation}: ${error.message}`,
        statusCode,
        error
      );
    }

    throw new ApiRequestError(
      `Failed to ${operation}: Unknown error occurred`,
      undefined,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}
