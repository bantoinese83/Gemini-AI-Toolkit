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
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import { AspectRatio, Location, FileSearchUploadConfig, FileSearchImportConfig, FileSearchQueryConfig, EphemeralTokenConfig, EphemeralToken, FileObject, UploadFileConfig, CreateCacheConfig, UpdateCacheConfig, CachedContent, TokenCount, UsageMetadata, FunctionDeclaration, FunctionResponse, LiveTool, ContextWindowCompressionConfig, SessionResumptionConfig, RealtimeInputConfig, ThinkingConfig, ProactivityConfig, MediaResolution, WeightedPrompt, MusicGenerationConfig, MusicSessionCallbacks } from './types';
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
import { sanitizeError, sanitizeApiKeys } from './utils/security';
import { detectMimeType, extractFileName } from './utils/autoDetect';

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
  /** Files to include in the prompt (FileObject or file URIs) */
  files?: (FileObject | string)[];
  /** Cached content name to use */
  cachedContent?: string;
  /** System instruction */
  systemInstruction?: string;
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
  /** Tools to enable (function calling, Google Search) */
  tools?: LiveTool[];
  /** Enable input audio transcription */
  inputAudioTranscription?: boolean;
  /** Enable output audio transcription */
  outputAudioTranscription?: boolean;
  /** Context window compression configuration */
  contextWindowCompression?: ContextWindowCompressionConfig;
  /** Session resumption configuration */
  sessionResumption?: SessionResumptionConfig;
  /** Realtime input configuration (VAD settings) */
  realtimeInputConfig?: RealtimeInputConfig;
  /** Thinking configuration */
  thinkingConfig?: ThinkingConfig;
  /** Enable affective dialog (requires v1alpha API) */
  enableAffectiveDialog?: boolean;
  /** Proactivity configuration */
  proactivity?: ProactivityConfig;
  /** Media resolution */
  mediaResolution?: MediaResolution;
  /** Temperature setting */
  temperature?: number;
  /** Additional configuration options */
  [key: string]: unknown;
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
 * Result of a grounded search, maps, or file search query.
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
   * Never logs or exposes the actual API key value.
   */
  private validateApiKey(apiKey: unknown): asserts apiKey is string {
    try {
      validateNonEmptyString(apiKey, 'apiKey');
      
      // Additional security check: ensure API key isn't accidentally exposed
      if (typeof apiKey === 'string' && apiKey.length > 0) {
        // Validate format without exposing the key
        const keyLength = apiKey.length;
        if (keyLength < 20) {
          throw new ApiKeyError('API key appears to be invalid (too short)');
        }
      }
    } catch (error) {
      // Ensure error message doesn't contain the API key
      const errorMessage = error instanceof ValidationError 
        ? sanitizeApiKeys(error.message)
        : 'API key is required';
      throw new ApiKeyError(errorMessage);
    }
  }

  /**
   * Executes an API call with error handling (DRY principle).
   * Automatically sanitizes errors to prevent API key leakage.
   */
  private async executeApiCall<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Sanitize error before handling to prevent API key leakage
      const sanitizedError = sanitizeError(error);
      this.handleApiError(sanitizedError, operationName);
      throw sanitizedError;
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
   * Creates an ephemeral token for secure Live API access from client-side applications.
   * 
   * ⚠️ **Server-side only** - This should be called from your backend, not client-side.
   * Ephemeral tokens are short-lived and enhance security for client-to-server implementations.
   * 
   * @param config - Configuration for the ephemeral token
   * @returns Promise resolving to the ephemeral token
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the token creation fails
   *
   * @example
   * ```typescript
   * // Server-side: Create ephemeral token
   * const token = await toolkit.createEphemeralToken({
   *   uses: 1,
   *   expireTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
   *   newSessionExpireTime: new Date(Date.now() + 60 * 1000), // 1 minute
   * });
   * 
   * // Send token.name to client
   * // Client uses token.name as API key for connectLive()
   * ```
   */
  async createEphemeralToken(config: EphemeralTokenConfig = {}): Promise<EphemeralToken> {
    return this.executeApiCall(async () => {
      const tokenConfig: Record<string, unknown> = {
        httpOptions: { apiVersion: 'v1alpha' },
      };

      // Set uses (default: 1)
      if (config.uses !== undefined) {
        validatePositiveInteger(config.uses, 'uses');
        tokenConfig.uses = config.uses;
      } else {
        tokenConfig.uses = 1;
      }

      // Set expireTime (default: 30 minutes)
      if (config.expireTime !== undefined) {
        const expireTime = config.expireTime instanceof Date 
          ? config.expireTime.toISOString()
          : config.expireTime;
        if (typeof expireTime !== 'string') {
          throw new ValidationError(
            'expireTime must be a Date object or ISO string',
            'expireTime'
          );
        }
        tokenConfig.expireTime = expireTime;
      } else {
        // Default: 30 minutes from now
        tokenConfig.expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      }

      // Set newSessionExpireTime (default: 1 minute)
      if (config.newSessionExpireTime !== undefined) {
        const newSessionExpireTime = config.newSessionExpireTime instanceof Date
          ? config.newSessionExpireTime.toISOString()
          : config.newSessionExpireTime;
        if (typeof newSessionExpireTime !== 'string') {
          throw new ValidationError(
            'newSessionExpireTime must be a Date object or ISO string',
            'newSessionExpireTime'
          );
        }
        tokenConfig.newSessionExpireTime = newSessionExpireTime;
      } else {
        // Default: 1 minute from now
        tokenConfig.newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();
      }

      // Add liveConnectConstraints if provided
      if (config.liveConnectConstraints) {
        const constraints: Record<string, unknown> = {};
        
        if (config.liveConnectConstraints.model) {
          validateNonEmptyString(config.liveConnectConstraints.model, 'liveConnectConstraints.model');
          constraints.model = config.liveConnectConstraints.model;
        }

        if (config.liveConnectConstraints.config) {
          constraints.config = config.liveConnectConstraints.config;
        }

        if (Object.keys(constraints).length > 0) {
          tokenConfig.liveConnectConstraints = constraints;
        }
      }

      const token = await this.client.authTokens.create({
        config: tokenConfig,
      });

      return {
        name: (token as { name: string }).name,
        ...token,
      } as EphemeralToken;
    }, 'createEphemeralToken');
  }

  /**
   * Connects to a live conversation session for real-time audio interactions.
   * 
   * Can use either a standard API key or an ephemeral token (for enhanced client-side security).
   *
   * @param callbacks - Event callbacks for the live session
   * @param options - Optional configuration for the live session
   * @param ephemeralToken - Optional ephemeral token to use instead of API key (for client-side)
   * @returns Promise resolving to the live session object
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the connection fails
   *
   * @example
   * ```typescript
   * // Using standard API key
   * const session = await toolkit.connectLive({
   *   onopen: () => console.log('Connected'),
   *   onmessage: async (message) => { /* handle message *\/ },
   *   onerror: (event) => console.error('Error:', event),
   *   onclose: (event) => console.log('Disconnected')
   * });
   * 
   * // Using ephemeral token (client-side)
   * const session = await toolkit.connectLive(
   *   {
   *     onopen: () => console.log('Connected'),
   *     onmessage: async (message) => { /* handle message *\/ },
   *     onerror: (event) => console.error('Error:', event),
   *     onclose: (event) => console.log('Disconnected')
   *   },
   *   {},
   *   ephemeralToken.name // Token from server
   * );
   * ```
   */
  async connectLive(
    callbacks: LiveSessionCallbacks,
    options: LiveConversationOptions = {},
    ephemeralToken?: string
  ): Promise<unknown> {
    this.validateLiveCallbacks(callbacks);

    const model = resolveModel(options.model, DEFAULT_MODELS.LIVE);
    const voiceName = options.voiceName || DEFAULT_VOICES.LIVE;
    validateNonEmptyString(voiceName, 'voiceName');
    const responseModalities = options.responseModalities || [Modality.AUDIO];

    return this.executeApiCall(async () => {
      // If ephemeral token is provided, create a temporary client with it
      // Otherwise use the existing client with API key
      const client = ephemeralToken 
        ? new GoogleGenAI({ apiKey: ephemeralToken })
        : this.client;

      // Build config object
      const config: Record<string, unknown> = {
        responseModalities,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      };

      // Add tools if provided
      if (options.tools && options.tools.length > 0) {
        config.tools = options.tools.map(tool => {
          const toolConfig: Record<string, unknown> = {};
          
          if (tool.functionDeclarations && tool.functionDeclarations.length > 0) {
            toolConfig.functionDeclarations = tool.functionDeclarations;
          }
          
          if (tool.googleSearch) {
            toolConfig.googleSearch = tool.googleSearch;
          }
          
          return toolConfig;
        });
      }

      // Add audio transcriptions
      if (options.inputAudioTranscription !== false) {
        config.inputAudioTranscription = options.inputAudioTranscription ? {} : {};
      }
      
      if (options.outputAudioTranscription !== false) {
        config.outputAudioTranscription = options.outputAudioTranscription ? {} : {};
      }

      // Add context window compression
      if (options.contextWindowCompression) {
        const compressionConfig: Record<string, unknown> = {};
        if (options.contextWindowCompression.slidingWindow) {
          compressionConfig.slidingWindow = options.contextWindowCompression.slidingWindow;
        }
        if (options.contextWindowCompression.triggerTokens !== undefined) {
          validatePositiveInteger(options.contextWindowCompression.triggerTokens, 'contextWindowCompression.triggerTokens');
          compressionConfig.triggerTokens = options.contextWindowCompression.triggerTokens;
        }
        config.contextWindowCompression = compressionConfig;
      }

      // Add session resumption
      if (options.sessionResumption) {
        const resumptionConfig: Record<string, unknown> = {};
        if (options.sessionResumption.handle !== undefined) {
          resumptionConfig.handle = options.sessionResumption.handle;
        }
        config.sessionResumption = resumptionConfig;
      }

      // Add realtime input config (VAD)
      if (options.realtimeInputConfig) {
        const realtimeConfig: Record<string, unknown> = {};
        if (options.realtimeInputConfig.automaticActivityDetection) {
          const vadConfig: Record<string, unknown> = {};
          if (options.realtimeInputConfig.automaticActivityDetection.disabled !== undefined) {
            vadConfig.disabled = options.realtimeInputConfig.automaticActivityDetection.disabled;
          }
          if (options.realtimeInputConfig.automaticActivityDetection.startOfSpeechSensitivity) {
            vadConfig.startOfSpeechSensitivity = options.realtimeInputConfig.automaticActivityDetection.startOfSpeechSensitivity;
          }
          if (options.realtimeInputConfig.automaticActivityDetection.endOfSpeechSensitivity) {
            vadConfig.endOfSpeechSensitivity = options.realtimeInputConfig.automaticActivityDetection.endOfSpeechSensitivity;
          }
          if (options.realtimeInputConfig.automaticActivityDetection.prefixPaddingMs !== undefined) {
            validatePositiveInteger(options.realtimeInputConfig.automaticActivityDetection.prefixPaddingMs, 'realtimeInputConfig.automaticActivityDetection.prefixPaddingMs');
            vadConfig.prefixPaddingMs = options.realtimeInputConfig.automaticActivityDetection.prefixPaddingMs;
          }
          if (options.realtimeInputConfig.automaticActivityDetection.silenceDurationMs !== undefined) {
            validatePositiveInteger(options.realtimeInputConfig.automaticActivityDetection.silenceDurationMs, 'realtimeInputConfig.automaticActivityDetection.silenceDurationMs');
            vadConfig.silenceDurationMs = options.realtimeInputConfig.automaticActivityDetection.silenceDurationMs;
          }
          realtimeConfig.automaticActivityDetection = vadConfig;
        }
        config.realtimeInputConfig = realtimeConfig;
      }

      // Add thinking config
      if (options.thinkingConfig) {
        const thinkingConfig: Record<string, unknown> = {};
        if (options.thinkingConfig.thinkingBudget !== undefined) {
          validatePositiveInteger(options.thinkingConfig.thinkingBudget, 'thinkingConfig.thinkingBudget');
          thinkingConfig.thinkingBudget = options.thinkingConfig.thinkingBudget;
        }
        if (options.thinkingConfig.includeThoughts !== undefined) {
          thinkingConfig.includeThoughts = options.thinkingConfig.includeThoughts;
        }
        config.thinkingConfig = thinkingConfig;
      }

      // Add affective dialog (requires v1alpha)
      if (options.enableAffectiveDialog) {
        config.enableAffectiveDialog = true;
      }

      // Add proactivity
      if (options.proactivity) {
        const proactivityConfig: Record<string, unknown> = {};
        if (options.proactivity.proactiveAudio !== undefined) {
          proactivityConfig.proactiveAudio = options.proactivity.proactiveAudio;
        }
        config.proactivity = proactivityConfig;
      }

      // Add media resolution
      if (options.mediaResolution) {
        config.mediaResolution = options.mediaResolution;
      }

      // Add temperature
      if (options.temperature !== undefined) {
        if (typeof options.temperature !== 'number' || isNaN(options.temperature) || !isFinite(options.temperature)) {
          throw new ValidationError('temperature must be a valid number', 'temperature');
        }
        config.temperature = options.temperature;
      }

      // Add any additional config options
      const additionalConfig: Record<string, unknown> = {};
      const knownKeys = [
        'model', 'voiceName', 'responseModalities', 'tools', 'inputAudioTranscription',
        'outputAudioTranscription', 'contextWindowCompression', 'sessionResumption',
        'realtimeInputConfig', 'thinkingConfig', 'enableAffectiveDialog', 'proactivity',
        'mediaResolution', 'temperature'
      ];
      for (const [key, value] of Object.entries(options)) {
        if (!knownKeys.includes(key) && value !== undefined) {
          additionalConfig[key] = value;
        }
      }
      Object.assign(config, additionalConfig);

      return await client.live.connect({
        model,
        callbacks,
        config,
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
   * Connects to a Lyria RealTime music generation session for real-time streaming music.
   * 
   * Lyria RealTime uses WebSockets to provide low-latency, bidirectional streaming
   * for interactive music generation. You can steer the music in real-time using
   * weighted prompts and update generation parameters.
   *
   * ⚠️ **Experimental**: Lyria RealTime is an experimental model.
   * 
   * ⚠️ **Requires v1alpha API**: This feature requires the v1alpha API version.
   *
   * @param callbacks - Event callbacks for the music session
   * @param apiKey - Optional API key (uses instance key if not provided)
   * @returns Promise resolving to the music session object
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the connection fails
   *
   * @example
   * ```typescript
   * const session = await toolkit.connectMusic({
   *   onmessage: async (message) => {
   *     // Process audio chunks (16-bit PCM, 48kHz, stereo)
   *     if (message.serverContent?.audioChunks) {
   *       for (const chunk of message.serverContent.audioChunks) {
   *         const audioBuffer = Buffer.from(chunk.data, 'base64');
   *         // Play audio...
   *       }
   *     }
   *   },
   *   onerror: (error) => console.error('Error:', error),
   *   onclose: () => console.log('Session closed')
   * });
   * 
   * // Set initial prompts
   * await session.setWeightedPrompts({
   *   weightedPrompts: [
   *     { text: 'minimal techno', weight: 1.0 }
   *   ]
   * });
   * 
   * // Set generation config
   * await session.setMusicGenerationConfig({
   *   musicGenerationConfig: {
   *     bpm: 90,
   *     temperature: 1.0,
   *     audioFormat: 'pcm16',
   *     sampleRateHz: 48000
   *   }
   * });
   * 
   * // Start generating music
   * await session.play();
   * ```
   */
  async connectMusic(
    callbacks: MusicSessionCallbacks,
    apiKey?: string
  ): Promise<unknown> {
    this.validateMusicCallbacks(callbacks);

    return this.executeApiCall(async () => {
      // Use provided API key or instance key
      const key = apiKey || this.apiKey;
      if (!key) {
        throw new ApiKeyError('API key is required for music generation');
      }

      const client = new GoogleGenAI({ 
        apiKey: key, 
        httpOptions: { apiVersion: 'v1alpha' } 
      });

      return await client.live.music.connect({
        model: 'models/lyria-realtime-exp',
        callbacks: {
          onmessage: callbacks.onmessage,
          onerror: callbacks.onerror,
          onclose: callbacks.onclose,
        },
      });
    }, 'connectMusic');
  }

  /**
   * Validates music session callbacks.
   */
  private validateMusicCallbacks(callbacks: unknown): asserts callbacks is MusicSessionCallbacks {
    if (!callbacks || typeof callbacks !== 'object') {
      throw new ValidationError(
        'callbacks must be an object with onmessage, onerror, and onclose functions',
        'callbacks'
      );
    }

    const requiredCallbacks = ['onmessage', 'onerror', 'onclose'] as const;
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
   * Creates a new File Search store for RAG (Retrieval Augmented Generation).
   *
   * @param displayName - Optional display name for the store
   * @returns Promise resolving to the created File Search store
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const store = await toolkit.createFileSearchStore('my-documents');
   * ```
   */
  async createFileSearchStore(displayName?: string): Promise<unknown> {
    return this.executeApiCall(async () => {
      return await this.client.fileSearchStores.create({
        config: displayName ? { displayName } : undefined,
      });
    }, 'createFileSearchStore');
  }

  /**
   * Lists all File Search stores.
   *
   * @returns Pager/iterable of File Search stores
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const stores = toolkit.listFileSearchStores();
   * for await (const store of stores) {
   *   console.log(store);
   * }
   * ```
   */
  listFileSearchStores(): unknown {
    return this.client.fileSearchStores.list();
  }

  /**
   * Gets a specific File Search store by name.
   *
   * @param name - The name of the File Search store (e.g., 'fileSearchStores/my-store-123')
   * @returns Promise resolving to the File Search store
   * @throws {ValidationError} If the name is invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const store = await toolkit.getFileSearchStore('fileSearchStores/my-store-123');
   * ```
   */
  async getFileSearchStore(name: string): Promise<unknown> {
    validateNonEmptyString(name, 'name');
    return this.executeApiCall(async () => {
      return await this.client.fileSearchStores.get({ name });
    }, 'getFileSearchStore');
  }

  /**
   * Deletes a File Search store.
   *
   * @param name - The name of the File Search store to delete
   * @param force - Whether to force delete (default: true)
   * @returns Promise resolving when deletion is complete
   * @throws {ValidationError} If the name is invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * await toolkit.deleteFileSearchStore('fileSearchStores/my-store-123');
   * ```
   */
  async deleteFileSearchStore(name: string, force: boolean = true): Promise<void> {
    validateNonEmptyString(name, 'name');
    return this.executeApiCall(async () => {
      await this.client.fileSearchStores.delete({ name, config: { force } });
    }, 'deleteFileSearchStore');
  }

  /**
   * Uploads a file directly to a File Search store (combines upload and import).
   *
   * @param filePath - Path to the file to upload (Node.js) or File/Blob object (browser)
   * @param fileSearchStoreName - Name of the File Search store
   * @param config - Optional configuration for upload
   * @returns Promise resolving to an operation that can be polled for completion
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * // Node.js
   * const operation = await toolkit.uploadToFileSearchStore(
   *   'document.pdf',
   *   store.name,
   *   { displayName: 'My Document' }
   * );
   * 
   * // Browser
   * const fileInput = document.querySelector('input[type="file"]');
   * const file = fileInput.files[0];
   * const operation = await toolkit.uploadToFileSearchStore(
   *   file,
   *   store.name,
   *   { displayName: 'My Document' }
   * );
   * ```
   */
  async uploadToFileSearchStore(
    filePath: string | File | Blob,
    fileSearchStoreName: string,
    config?: FileSearchUploadConfig
  ): Promise<unknown> {
    if (typeof filePath === 'string') {
      validateNonEmptyString(filePath, 'filePath');
    } else if (!(filePath instanceof File) && !(filePath instanceof Blob)) {
      throw new ValidationError(
        'filePath must be a string (Node.js), File, or Blob (browser)',
        'filePath'
      );
    }
    validateNonEmptyString(fileSearchStoreName, 'fileSearchStoreName');

    return this.executeApiCall(async () => {
      const uploadConfig: Record<string, unknown> = {};
      if (config?.displayName) {
        uploadConfig.displayName = config.displayName;
      }
      if (config?.customMetadata) {
        // Validate metadata array size
        const MAX_METADATA_ITEMS = 100;
        if (config.customMetadata.length > MAX_METADATA_ITEMS) {
          throw new ValidationError(
            `customMetadata cannot exceed ${MAX_METADATA_ITEMS} items`,
            'customMetadata'
          );
        }
        
        uploadConfig.customMetadata = config.customMetadata.map((meta, index) => {
          // Validate metadata key
          if (!meta.key || typeof meta.key !== 'string' || meta.key.trim().length === 0) {
            throw new ValidationError(
              `customMetadata[${index}].key must be a non-empty string`,
              'customMetadata'
            );
          }
          
          const MAX_KEY_LENGTH = 256;
          if (meta.key.length > MAX_KEY_LENGTH) {
            throw new ValidationError(
              `customMetadata[${index}].key exceeds maximum length of ${MAX_KEY_LENGTH} characters`,
              'customMetadata'
            );
          }
          
          // Validate at least one value is provided
          if (meta.stringValue === undefined && meta.numericValue === undefined) {
            throw new ValidationError(
              `customMetadata[${index}] must have either stringValue or numericValue`,
              'customMetadata'
            );
          }
          
          // Validate string value
          if (meta.stringValue !== undefined) {
            if (typeof meta.stringValue !== 'string') {
              throw new ValidationError(
                `customMetadata[${index}].stringValue must be a string`,
                'customMetadata'
              );
            }
            const MAX_VALUE_LENGTH = 1024;
            if (meta.stringValue.length > MAX_VALUE_LENGTH) {
              throw new ValidationError(
                `customMetadata[${index}].stringValue exceeds maximum length of ${MAX_VALUE_LENGTH} characters`,
                'customMetadata'
              );
            }
          }
          
          // Validate numeric value
          if (meta.numericValue !== undefined) {
            if (typeof meta.numericValue !== 'number' || isNaN(meta.numericValue) || !isFinite(meta.numericValue)) {
              throw new ValidationError(
                `customMetadata[${index}].numericValue must be a finite number`,
                'customMetadata'
              );
            }
          }
          
          return {
            key: meta.key,
            ...(meta.stringValue !== undefined && { stringValue: meta.stringValue }),
            ...(meta.numericValue !== undefined && { numericValue: meta.numericValue }),
          };
        });
      }
      if (config?.chunkingConfig?.whiteSpaceConfig) {
        const wsConfig = config.chunkingConfig.whiteSpaceConfig;
        
        // Validate maxTokensPerChunk if provided
        if (wsConfig.maxTokensPerChunk !== undefined) {
          validatePositiveInteger(wsConfig.maxTokensPerChunk, 'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk');
          const MAX_TOKENS_PER_CHUNK = 10000;
          if (wsConfig.maxTokensPerChunk > MAX_TOKENS_PER_CHUNK) {
            throw new ValidationError(
              `maxTokensPerChunk cannot exceed ${MAX_TOKENS_PER_CHUNK}`,
              'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk'
            );
          }
        }
        
        // Validate maxOverlapTokens if provided
        if (wsConfig.maxOverlapTokens !== undefined) {
          validatePositiveInteger(wsConfig.maxOverlapTokens, 'chunkingConfig.whiteSpaceConfig.maxOverlapTokens');
          
          // Ensure overlap doesn't exceed chunk size
          if (wsConfig.maxTokensPerChunk !== undefined && 
              wsConfig.maxOverlapTokens >= wsConfig.maxTokensPerChunk) {
            throw new ValidationError(
              'maxOverlapTokens must be less than maxTokensPerChunk',
              'chunkingConfig.whiteSpaceConfig.maxOverlapTokens'
            );
          }
        }
        
        uploadConfig.chunkingConfig = {
          whiteSpaceConfig: {
            ...(wsConfig.maxTokensPerChunk !== undefined && { maxTokensPerChunk: wsConfig.maxTokensPerChunk }),
            ...(wsConfig.maxOverlapTokens !== undefined && { maxOverlapTokens: wsConfig.maxOverlapTokens }),
          },
        };
      }

      return await this.client.fileSearchStores.uploadToFileSearchStore({
        file: filePath,
        fileSearchStoreName,
        config: Object.keys(uploadConfig).length > 0 ? uploadConfig : undefined,
      });
    }, 'uploadToFileSearchStore');
  }

  /**
   * Imports an existing file into a File Search store.
   *
   * @param fileSearchStoreName - Name of the File Search store
   * @param fileName - Name of the file to import (from Files API)
   * @param config - Optional configuration for import
   * @returns Promise resolving to an operation that can be polled for completion
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const operation = await toolkit.importFileToFileSearchStore(
   *   store.name,
   *   uploadedFile.name,
   *   { customMetadata: [{ key: 'author', stringValue: 'Robert Graves' }] }
   * );
   * ```
   */
  async importFileToFileSearchStore(
    fileSearchStoreName: string,
    fileName: string,
    config?: FileSearchImportConfig
  ): Promise<unknown> {
    validateNonEmptyString(fileSearchStoreName, 'fileSearchStoreName');
    validateNonEmptyString(fileName, 'fileName');

    return this.executeApiCall(async () => {
      const importConfig: Record<string, unknown> = {};
      if (config?.customMetadata) {
        // Validate metadata array size
        const MAX_METADATA_ITEMS = 100;
        if (config.customMetadata.length > MAX_METADATA_ITEMS) {
          throw new ValidationError(
            `customMetadata cannot exceed ${MAX_METADATA_ITEMS} items`,
            'customMetadata'
          );
        }
        
        importConfig.customMetadata = config.customMetadata.map((meta, index) => {
          // Validate metadata key
          if (!meta.key || typeof meta.key !== 'string' || meta.key.trim().length === 0) {
            throw new ValidationError(
              `customMetadata[${index}].key must be a non-empty string`,
              'customMetadata'
            );
          }
          
          const MAX_KEY_LENGTH = 256;
          if (meta.key.length > MAX_KEY_LENGTH) {
            throw new ValidationError(
              `customMetadata[${index}].key exceeds maximum length of ${MAX_KEY_LENGTH} characters`,
              'customMetadata'
            );
          }
          
          // Validate at least one value is provided
          if (meta.stringValue === undefined && meta.numericValue === undefined) {
            throw new ValidationError(
              `customMetadata[${index}] must have either stringValue or numericValue`,
              'customMetadata'
            );
          }
          
          // Validate string value
          if (meta.stringValue !== undefined) {
            if (typeof meta.stringValue !== 'string') {
              throw new ValidationError(
                `customMetadata[${index}].stringValue must be a string`,
                'customMetadata'
              );
            }
            const MAX_VALUE_LENGTH = 1024;
            if (meta.stringValue.length > MAX_VALUE_LENGTH) {
              throw new ValidationError(
                `customMetadata[${index}].stringValue exceeds maximum length of ${MAX_VALUE_LENGTH} characters`,
                'customMetadata'
              );
            }
          }
          
          // Validate numeric value
          if (meta.numericValue !== undefined) {
            if (typeof meta.numericValue !== 'number' || isNaN(meta.numericValue) || !isFinite(meta.numericValue)) {
              throw new ValidationError(
                `customMetadata[${index}].numericValue must be a finite number`,
                'customMetadata'
              );
            }
          }
          
          return {
            key: meta.key,
            ...(meta.stringValue !== undefined && { stringValue: meta.stringValue }),
            ...(meta.numericValue !== undefined && { numericValue: meta.numericValue }),
          };
        });
      }
      if (config?.chunkingConfig?.whiteSpaceConfig) {
        const wsConfig = config.chunkingConfig.whiteSpaceConfig;
        
        // Validate maxTokensPerChunk if provided
        if (wsConfig.maxTokensPerChunk !== undefined) {
          validatePositiveInteger(wsConfig.maxTokensPerChunk, 'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk');
          const MAX_TOKENS_PER_CHUNK = 10000;
          if (wsConfig.maxTokensPerChunk > MAX_TOKENS_PER_CHUNK) {
            throw new ValidationError(
              `maxTokensPerChunk cannot exceed ${MAX_TOKENS_PER_CHUNK}`,
              'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk'
            );
          }
        }
        
        // Validate maxOverlapTokens if provided
        if (wsConfig.maxOverlapTokens !== undefined) {
          validatePositiveInteger(wsConfig.maxOverlapTokens, 'chunkingConfig.whiteSpaceConfig.maxOverlapTokens');
          
          // Ensure overlap doesn't exceed chunk size
          if (wsConfig.maxTokensPerChunk !== undefined && 
              wsConfig.maxOverlapTokens >= wsConfig.maxTokensPerChunk) {
            throw new ValidationError(
              'maxOverlapTokens must be less than maxTokensPerChunk',
              'chunkingConfig.whiteSpaceConfig.maxOverlapTokens'
            );
          }
        }
        
        importConfig.chunkingConfig = {
          whiteSpaceConfig: {
            ...(wsConfig.maxTokensPerChunk !== undefined && { maxTokensPerChunk: wsConfig.maxTokensPerChunk }),
            ...(wsConfig.maxOverlapTokens !== undefined && { maxOverlapTokens: wsConfig.maxOverlapTokens }),
          },
        };
      }

      return await this.client.fileSearchStores.importFile({
        fileSearchStoreName,
        fileName,
        config: Object.keys(importConfig).length > 0 ? importConfig : undefined,
      });
    }, 'importFileToFileSearchStore');
  }

  /**
   * Uploads a file using the Files API (for separate upload/import workflow).
   *
   * @param filePath - Path to the file to upload (Node.js) or File/Blob object (browser)
   * @param displayName - Optional display name for the file
   * @returns Promise resolving to the uploaded file
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * // Node.js
   * const file = await toolkit.uploadFile('document.pdf', 'My Document');
   * 
   * // Browser
   * const fileInput = document.querySelector('input[type="file"]');
   * const file = await toolkit.uploadFile(fileInput.files[0], 'My Document');
   * ```
   */
  async uploadFile(filePath: string | File | Blob, config?: UploadFileConfig | string): Promise<FileObject> {
    if (typeof filePath === 'string') {
      validateNonEmptyString(filePath, 'filePath');
    } else if (!(filePath instanceof File) && !(filePath instanceof Blob)) {
      throw new ValidationError(
        'filePath must be a string (Node.js), File, or Blob (browser)',
        'filePath'
      );
    }

    // Handle legacy string parameter for displayName
    const uploadConfig: UploadFileConfig = typeof config === 'string' 
      ? { displayName: config }
      : config || {};

    return this.executeApiCall(async () => {
      const fileConfig: Record<string, unknown> = {};
      if (uploadConfig.displayName) {
        fileConfig.name = uploadConfig.displayName;
      }
      if (uploadConfig.mimeType) {
        validateMimeType(uploadConfig.mimeType, 'mimeType');
        fileConfig.mimeType = uploadConfig.mimeType;
      }

      const file = await this.client.files.upload({
        file: filePath,
        config: Object.keys(fileConfig).length > 0 ? fileConfig : undefined,
      });

      return {
        name: (file as { name: string }).name,
        uri: (file as { uri?: string }).uri,
        mimeType: (file as { mimeType?: string }).mimeType,
        displayName: (file as { displayName?: string }).displayName,
        state: (file as { state?: { name?: string } }).state?.name,
        sizeBytes: (file as { sizeBytes?: number }).sizeBytes,
        createTime: (file as { createTime?: string }).createTime,
        updateTime: (file as { updateTime?: string }).updateTime,
        expireTime: (file as { expireTime?: string }).expireTime,
        ...file,
      } as FileObject;
    }, 'uploadFile');
  }

  /**
   * Gets metadata for an uploaded file.
   *
   * @param fileName - Name of the file (from uploadFile response)
   * @returns Promise resolving to file metadata
   * @throws {ValidationError} If fileName is invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const file = await toolkit.uploadFile('document.pdf');
   * const metadata = await toolkit.getFile(file.name);
   * console.log(metadata.state); // 'ACTIVE' or 'PROCESSING'
   * ```
   */
  async getFile(fileName: string): Promise<FileObject> {
    validateNonEmptyString(fileName, 'fileName');

    return this.executeApiCall(async () => {
      const file = await this.client.files.get({ name: fileName });
      return {
        name: (file as { name: string }).name,
        uri: (file as { uri?: string }).uri,
        mimeType: (file as { mimeType?: string }).mimeType,
        displayName: (file as { displayName?: string }).displayName,
        state: (file as { state?: { name?: string } }).state?.name,
        sizeBytes: (file as { sizeBytes?: number }).sizeBytes,
        createTime: (file as { createTime?: string }).createTime,
        updateTime: (file as { updateTime?: string }).updateTime,
        expireTime: (file as { expireTime?: string }).expireTime,
        ...file,
      } as FileObject;
    }, 'getFile');
  }

  /**
   * Lists all uploaded files.
   *
   * @param pageSize - Optional page size for pagination
   * @returns Promise resolving to an iterable of files
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const files = await toolkit.listFiles(10);
   * for await (const file of files) {
   *   console.log(file.name, file.displayName);
   * }
   * ```
   */
  async listFiles(pageSize?: number): Promise<unknown> {
    return this.executeApiCall(async () => {
      const config: Record<string, unknown> = {};
      if (pageSize !== undefined) {
        validatePositiveInteger(pageSize, 'pageSize');
        const MAX_PAGE_SIZE = 100;
        if (pageSize > MAX_PAGE_SIZE) {
          throw new ValidationError(
            `pageSize cannot exceed ${MAX_PAGE_SIZE}`,
            'pageSize'
          );
        }
        config.pageSize = pageSize;
      }

      return await this.client.files.list(
        Object.keys(config).length > 0 ? { config } : undefined
      );
    }, 'listFiles');
  }

  /**
   * Deletes an uploaded file.
   *
   * @param fileName - Name of the file to delete
   * @returns Promise resolving when file is deleted
   * @throws {ValidationError} If fileName is invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const file = await toolkit.uploadFile('document.pdf');
   * await toolkit.deleteFile(file.name);
   * ```
   */
  async deleteFile(fileName: string): Promise<void> {
    validateNonEmptyString(fileName, 'fileName');

    return this.executeApiCall(async () => {
      await this.client.files.delete({ name: fileName });
    }, 'deleteFile');
  }

  /**
   * Queries with File Search (RAG) to get answers grounded in uploaded documents.
   *
   * @param prompt - The query or prompt
   * @param config - File Search configuration
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns Promise resolving to the grounded result with text and candidates
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.queryWithFileSearch(
   *   'Tell me about Robert Graves',
   *   { fileSearchStoreNames: [store.name] }
   * );
   * ```
   */
  async queryWithFileSearch(
    prompt: string,
    config: FileSearchQueryConfig,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    validateNonEmptyArray(config.fileSearchStoreNames, 'fileSearchStoreNames');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    return this.executeApiCall(async () => {
      const toolConfig: Record<string, unknown> = {
        fileSearchStoreNames: config.fileSearchStoreNames,
      };
      if (config.metadataFilter) {
        toolConfig.metadataFilter = config.metadataFilter;
      }

      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{ fileSearch: toolConfig }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'file search query');
      return {
        text,
        candidates: response.candidates,
      };
    }, 'queryWithFileSearch');
  }

  /**
   * Generates text with URL Context tool enabled, allowing the model to access content from URLs.
   * URLs should be included in the prompt text. The model will automatically retrieve and analyze
   * content from up to 20 URLs per request.
   *
   * @param prompt - The prompt containing URLs to analyze (URLs should be in the prompt text)
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns Promise resolving to the grounded result with text, candidates, and URL metadata
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.generateWithUrlContext(
   *   'Compare the ingredients from https://example.com/recipe1 and https://example.com/recipe2'
   * );
   * console.log(result.text);
   * // Access URL retrieval metadata
   * const urlMetadata = result.candidates?.[0]?.urlContextMetadata;
   * ```
   */
  async generateWithUrlContext(
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
          tools: [{ urlContext: {} }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'URL context query');
      return {
        text,
        candidates: response.candidates,
      };
    }, 'generateWithUrlContext');
  }

  /**
   * Generates text with both URL Context and Google Search tools enabled.
   * This allows the model to search the web and then analyze specific URLs in depth.
   *
   * @param prompt - The prompt containing URLs and/or search queries
   * @param model - Model name to use (default: 'gemini-2.5-flash')
   * @returns Promise resolving to the grounded result with text, candidates, and metadata
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   * @throws {ModelResponseError} If no response is generated
   *
   * @example
   * ```typescript
   * const result = await toolkit.generateWithUrlContextAndSearch(
   *   'Find information about AI trends and analyze https://example.com/ai-report'
   * );
   * ```
   */
  async generateWithUrlContextAndSearch(
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
          tools: [{ urlContext: {} }, { googleSearch: {} }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'URL context and search query');
      return {
        text,
        candidates: response.candidates,
      };
    }, 'generateWithUrlContextAndSearch');
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
      // Sanitize error message to prevent API key leakage
      const sanitizedMessage = sanitizeApiKeys(error.message);
      
      // Try to extract status code from error
      let statusCode: number | undefined;
      if ('status' in error) {
        statusCode = error.status as number;
      } else if ('statusCode' in error) {
        statusCode = error.statusCode as number;
      } else if ('code' in error && typeof error.code === 'string' && error.code.startsWith('ERR_HTTP_')) {
        // Extract status from HTTP error codes
        const match = sanitizedMessage.match(/\b(\d{3})\b/);
        if (match) {
          statusCode = parseInt(match[1], 10);
        }
      }

      // Create sanitized original error
      const sanitizedOriginal = sanitizeError(error);

      throw new ApiRequestError(
        `Failed to ${operation}: ${sanitizedMessage}`,
        statusCode,
        sanitizedOriginal
      );
    }

    const errorMessage = error instanceof Error 
      ? sanitizeApiKeys(error.message)
      : sanitizeApiKeys(String(error));

    throw new ApiRequestError(
      `Failed to ${operation}: ${errorMessage}`,
      undefined,
      error instanceof Error ? sanitizeError(error) : new Error(errorMessage)
    );
  }

  /**
   * Creates a cache for context caching to reduce costs on repeated requests.
   *
   * @param model - Model name to use for caching
   * @param config - Cache configuration
   * @returns Promise resolving to the created cache
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the cache creation fails
   *
   * @example
   * ```typescript
   * const cache = await toolkit.createCache('gemini-2.0-flash-001', {
   *   displayName: 'my-cache',
   *   systemInstruction: 'You are a helpful assistant.',
   *   contents: [uploadedFile],
   *   ttl: '300s' // 5 minutes
   * });
   * ```
   */
  async createCache(model: string, config: CreateCacheConfig): Promise<CachedContent> {
    validateNonEmptyString(model, 'model');

    return this.executeApiCall(async () => {
      const cacheConfig: Record<string, unknown> = {};

      if (config.displayName) {
        validateNonEmptyString(config.displayName, 'displayName');
        cacheConfig.displayName = config.displayName;
      }

      if (config.systemInstruction) {
        validateNonEmptyString(config.systemInstruction, 'systemInstruction');
        cacheConfig.systemInstruction = config.systemInstruction;
      }

      if (config.contents && config.contents.length > 0) {
        cacheConfig.contents = config.contents;
      }

      // Handle TTL (can be string like '300s' or number of seconds)
      if (config.ttl !== undefined) {
        if (typeof config.ttl === 'string') {
          cacheConfig.ttl = config.ttl;
        } else if (typeof config.ttl === 'number') {
          validatePositiveInteger(config.ttl, 'ttl');
          cacheConfig.ttl = `${config.ttl}s`;
        } else {
          throw new ValidationError(
            'ttl must be a string (e.g., "300s") or number of seconds',
            'ttl'
          );
        }
      }

      // Handle expireTime
      if (config.expireTime !== undefined) {
        const expireTime = config.expireTime instanceof Date
          ? config.expireTime.toISOString()
          : config.expireTime;
        if (typeof expireTime !== 'string') {
          throw new ValidationError(
            'expireTime must be a Date object or ISO string',
            'expireTime'
          );
        }
        cacheConfig.expireTime = expireTime;
      }

      const cache = await this.client.caches.create({
        model,
        config: cacheConfig,
      });

      return {
        name: (cache as { name: string }).name,
        model: (cache as { model?: string }).model,
        displayName: (cache as { displayName?: string }).displayName,
        usageMetadata: (cache as { usageMetadata?: UsageMetadata }).usageMetadata,
        createTime: (cache as { createTime?: string }).createTime,
        updateTime: (cache as { updateTime?: string }).updateTime,
        expireTime: (cache as { expireTime?: string }).expireTime,
        ...cache,
      } as CachedContent;
    }, 'createCache');
  }

  /**
   * Lists all cached content objects.
   *
   * @returns Promise resolving to an iterable of cached content
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const caches = await toolkit.listCaches();
   * for await (const cache of caches) {
   *   console.log(cache.name, cache.displayName);
   * }
   * ```
   */
  async listCaches(): Promise<unknown> {
    return this.executeApiCall(async () => {
      return await this.client.caches.list();
    }, 'listCaches');
  }

  /**
   * Gets metadata for a cached content object.
   *
   * @param cacheName - Name of the cache
   * @returns Promise resolving to cache metadata
   * @throws {ValidationError} If cacheName is invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * const cache = await toolkit.getCache('cachedContents/my-cache-123');
   * console.log(cache.expireTime);
   * ```
   */
  async getCache(cacheName: string): Promise<CachedContent> {
    validateNonEmptyString(cacheName, 'cacheName');

    return this.executeApiCall(async () => {
      const cache = await this.client.caches.get({ name: cacheName });
      return {
        name: (cache as { name: string }).name,
        model: (cache as { model?: string }).model,
        displayName: (cache as { displayName?: string }).displayName,
        usageMetadata: (cache as { usageMetadata?: UsageMetadata }).usageMetadata,
        createTime: (cache as { createTime?: string }).createTime,
        updateTime: (cache as { updateTime?: string }).updateTime,
        expireTime: (cache as { expireTime?: string }).expireTime,
        ...cache,
      } as CachedContent;
    }, 'getCache');
  }

  /**
   * Updates a cached content object (TTL or expiration time).
   *
   * @param cacheName - Name of the cache to update
   * @param config - Update configuration
   * @returns Promise resolving to updated cache metadata
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the update fails
   *
   * @example
   * ```typescript
   * // Update TTL
   * await toolkit.updateCache(cache.name, { ttl: '600s' });
   * 
   * // Update expiration time
   * await toolkit.updateCache(cache.name, {
   *   expireTime: new Date(Date.now() + 10 * 60 * 1000)
   * });
   * ```
   */
  async updateCache(cacheName: string, config: UpdateCacheConfig): Promise<CachedContent> {
    validateNonEmptyString(cacheName, 'cacheName');

    if (!config.ttl && !config.expireTime) {
      throw new ValidationError(
        'Either ttl or expireTime must be provided',
        'config'
      );
    }

    return this.executeApiCall(async () => {
      const updateConfig: Record<string, unknown> = {};

      // Handle TTL
      if (config.ttl !== undefined) {
        if (typeof config.ttl === 'string') {
          updateConfig.ttl = config.ttl;
        } else if (typeof config.ttl === 'number') {
          validatePositiveInteger(config.ttl, 'ttl');
          updateConfig.ttl = `${config.ttl}s`;
        } else {
          throw new ValidationError(
            'ttl must be a string (e.g., "300s") or number of seconds',
            'ttl'
          );
        }
      }

      // Handle expireTime
      if (config.expireTime !== undefined) {
        const expireTime = config.expireTime instanceof Date
          ? config.expireTime.toISOString()
          : config.expireTime;
        if (typeof expireTime !== 'string') {
          throw new ValidationError(
            'expireTime must be a Date object or ISO string',
            'expireTime'
          );
        }
        updateConfig.expireTime = expireTime;
      }

      const cache = await this.client.caches.update({
        name: cacheName,
        config: updateConfig,
      });

      return {
        name: (cache as { name: string }).name,
        model: (cache as { model?: string }).model,
        displayName: (cache as { displayName?: string }).displayName,
        usageMetadata: (cache as { usageMetadata?: UsageMetadata }).usageMetadata,
        createTime: (cache as { createTime?: string }).createTime,
        updateTime: (cache as { updateTime?: string }).updateTime,
        expireTime: (cache as { expireTime?: string }).expireTime,
        ...cache,
      } as CachedContent;
    }, 'updateCache');
  }

  /**
   * Deletes a cached content object.
   *
   * @param cacheName - Name of the cache to delete
   * @returns Promise resolving when cache is deleted
   * @throws {ValidationError} If cacheName is invalid
   * @throws {ApiRequestError} If the deletion fails
   *
   * @example
   * ```typescript
   * await toolkit.deleteCache('cachedContents/my-cache-123');
   * ```
   */
  async deleteCache(cacheName: string): Promise<void> {
    validateNonEmptyString(cacheName, 'cacheName');

    return this.executeApiCall(async () => {
      await this.client.caches.delete({ name: cacheName });
    }, 'deleteCache');
  }

  /**
   * Counts tokens for the given content.
   *
   * @param contents - Content to count tokens for (text, files, chat history, etc.)
   * @param model - Model name to use for counting (default: 'gemini-2.5-flash')
   * @returns Promise resolving to token count
   * @throws {ValidationError} If inputs are invalid
   * @throws {ApiRequestError} If the API request fails
   *
   * @example
   * ```typescript
   * // Count text tokens
   * const count = await toolkit.countTokens('Hello, world!');
   * console.log(count.totalTokens);
   * 
   * // Count tokens for file + text
   * const file = await toolkit.uploadFile('image.jpg');
   * const count = await toolkit.countTokens(['Describe this image', file]);
   * 
   * // Count chat history tokens
   * const chat = toolkit.createChat();
   * await chat.sendMessage({ message: 'Hello' });
   * const count = await toolkit.countTokens(chat.getHistory());
   * ```
   */
  async countTokens(contents: unknown, model?: string): Promise<TokenCount> {
    if (contents === null || contents === undefined) {
      throw new ValidationError('contents is required', 'contents');
    }

    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    return this.executeApiCall(async () => {
      const response = await this.client.models.countTokens({
        model: resolvedModel,
        contents: contents as any,
      });

      return {
        totalTokens: (response as { totalTokens?: number }).totalTokens || 0,
        ...response,
      } as TokenCount;
    }, 'countTokens');
  }
}
