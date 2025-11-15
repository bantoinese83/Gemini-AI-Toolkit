/**
 * @file Core service for interacting with the Google Gemini API.
 * Provides a clean, type-safe interface for all Gemini capabilities with
 * comprehensive error handling and input validation.
 * 
 * Follows DRY, SOLID, and KISS principles.
 */

import { GoogleGenAI, Chat, Modality, LiveServerMessage, GenerateContentResponse, createPartFromUri, createUserContent } from '@google/genai';
import { CoreAIService } from './services/CoreAIService';
import { ChatService } from './services/ChatService';
import { GroundingService } from './services/GroundingService';
import { FileSearchService } from './services/FileSearchService';
import { FilesService } from './services/FilesService';
import { CacheService } from './services/CacheService';
import { TokenService } from './services/TokenService';
import { AspectRatio, Location, FileSearchUploadConfig, FileSearchImportConfig, FileSearchQueryConfig, EphemeralTokenConfig, EphemeralToken, FileObject, UploadFileConfig, CreateCacheConfig, UpdateCacheConfig, CachedContent, TokenCount, UsageMetadata, FunctionDeclaration, FunctionResponse, LiveTool, ContextWindowCompressionConfig, SessionResumptionConfig, RealtimeInputConfig, ThinkingConfig, ProactivityConfig, MediaResolution, WeightedPrompt, MusicGenerationConfig, MusicSessionCallbacks, GroundedResult } from './types';
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

  // Service composition for better separation of concerns
  public readonly coreAI: CoreAIService;
  public readonly chat: ChatService;
  public readonly grounding: GroundingService;
  public readonly fileSearch: FileSearchService;
  public readonly files: FilesService;
  public readonly cache: CacheService;
  public readonly tokens: TokenService;

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

    // Initialize service instances
    this.coreAI = new CoreAIService(this.client);
    this.chat = new ChatService(this.client);
    this.grounding = new GroundingService(this.client);
    this.fileSearch = new FileSearchService(this.client);
    this.files = new FilesService(this.client);
    this.cache = new CacheService(this.client);
    this.tokens = new TokenService(this.client);
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
        ? error.message
        : `Invalid API key: ${error instanceof Error ? error.message : String(error)}`;
      throw new ApiKeyError(errorMessage);
    }
  }

  // ===== DELEGATION METHODS =====
  // These methods delegate to the appropriate service instances

  /**
   * @deprecated Use toolkit.coreAI.generateText() instead
   */
  async generateText(
    prompt: string,
    options: GenerateTextOptions = {}
  ): Promise<string> {
    return this.coreAI.generateText(prompt, options);
  }

  /**
   * @deprecated Use toolkit.chat.createChat() instead
   */
  createChat(model: string = DEFAULT_MODELS.TEXT): Chat {
    return this.chat.createChat(model);
  }

  /**
   * @deprecated Use toolkit.coreAI.generateImage() instead
   */
  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {}
  ): Promise<string> {
    return this.coreAI.generateImage(prompt, options);
  }

  /**
   * @deprecated Use toolkit.coreAI.editImage() instead
   */
  async editImage(
    imageBase64: string,
    mimeType: string,
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT_IMAGE
  ): Promise<string> {
    return this.coreAI.editImage(imageBase64, mimeType, prompt, model);
  }

  /**
   * @deprecated Use toolkit.coreAI.analyzeMedia() instead
   */
  async analyzeMedia(
    data: string | string[],
    mimeType: string,
    prompt: string,
    options: { model?: string; isVideo?: boolean } = {}
  ): Promise<string> {
    return this.coreAI.analyzeMedia(data, mimeType, prompt, options);
  }

  /**
   * @deprecated Use toolkit.coreAI.generateVideo() instead
   */
  async generateVideo(
    imageBase64: string,
    mimeType: string,
    prompt: string,
    options: GenerateVideoOptions = {}
  ): Promise<unknown> {
    return this.coreAI.generateVideo(imageBase64, mimeType, prompt, options);
  }

  /**
   * @deprecated Use toolkit.coreAI.generateSpeech() instead
   */
  async generateSpeech(
    text: string,
    options: GenerateSpeechOptions = {}
  ): Promise<string> {
    return this.coreAI.generateSpeech(text, options);
  }

  /**
   * @deprecated Use toolkit.chat.createEphemeralToken() instead
   */
  async createEphemeralToken(config: EphemeralTokenConfig = {}): Promise<EphemeralToken> {
    return this.chat.createEphemeralToken(config);
  }

  /**
   * @deprecated Use toolkit.chat.connectLive() instead
   */
  async connectLive(
    callbacks: LiveSessionCallbacks,
    options: LiveConversationOptions = {},
    ephemeralToken?: string
  ): Promise<unknown> {
    return this.chat.connectLive(callbacks, options, ephemeralToken);
  }

  /**
   * @deprecated Use toolkit.chat.connectMusic() instead
   */
  async connectMusic(
    callbacks: MusicSessionCallbacks,
    apiKey?: string
  ): Promise<unknown> {
    return this.chat.connectMusic(callbacks, apiKey);
  }

  /**
   * @deprecated Use toolkit.grounding.groundWithSearch() instead
   */
  async groundWithSearch(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    return this.grounding.groundWithSearch(prompt, model);
  }

  /**
   * @deprecated Use toolkit.grounding.groundWithMaps() instead
   */
  async groundWithMaps(
    prompt: string,
    location: Location,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    return this.grounding.groundWithMaps(prompt, location, model);
  }

  /**
   * @deprecated Use toolkit.grounding.generateWithUrlContext() instead
   */
  async generateWithUrlContext(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    return this.grounding.generateWithUrlContext(prompt, model);
  }

  /**
   * @deprecated Use toolkit.grounding.generateWithUrlContextAndSearch() instead
   */
  async generateWithUrlContextAndSearch(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    return this.grounding.generateWithUrlContextAndSearch(prompt, model);
  }

  /**
   * @deprecated Use toolkit.fileSearch.createFileSearchStore() instead
   */
  async createFileSearchStore(displayName?: string): Promise<unknown> {
    return this.fileSearch.createFileSearchStore(displayName);
  }

  /**
   * @deprecated Use toolkit.fileSearch.listFileSearchStores() instead
   */
  listFileSearchStores(): unknown {
    return this.fileSearch.listFileSearchStores();
  }

  /**
   * @deprecated Use toolkit.fileSearch.getFileSearchStore() instead
   */
  async getFileSearchStore(name: string): Promise<unknown> {
    return this.fileSearch.getFileSearchStore(name);
  }

  /**
   * @deprecated Use toolkit.fileSearch.deleteFileSearchStore() instead
   */
  async deleteFileSearchStore(name: string, force: boolean = true): Promise<void> {
    return this.fileSearch.deleteFileSearchStore(name, force);
  }

  /**
   * @deprecated Use toolkit.fileSearch.uploadToFileSearchStore() instead
   */
  async uploadToFileSearchStore(
    filePath: string | File | Blob,
    fileSearchStoreName: string,
    config: FileSearchUploadConfig = {},
    apiKey?: string
  ): Promise<unknown> {
    return this.fileSearch.uploadToFileSearchStore(filePath, fileSearchStoreName, config, apiKey);
  }

  /**
   * @deprecated Use toolkit.fileSearch.importFileToFileSearchStore() instead
   */
  async importFileToFileSearchStore(
    fileSearchStoreName: string,
    fileName: string,
    config: FileSearchImportConfig = {}
  ): Promise<unknown> {
    return this.fileSearch.importFileToFileSearchStore(fileSearchStoreName, fileName, config);
  }

  /**
   * @deprecated Use toolkit.files.uploadFile() instead
   */
  async uploadFile(
    filePath: string | File | Blob,
    config: UploadFileConfig | string = {}
  ): Promise<FileObject> {
    return this.files.uploadFile(filePath, config);
  }

  /**
   * @deprecated Use toolkit.files.getFile() instead
   */
  async getFile(fileName: string): Promise<FileObject> {
    return this.files.getFile(fileName);
  }

  /**
   * @deprecated Use toolkit.files.listFiles() instead
   */
  async listFiles(pageSize?: number): Promise<unknown> {
    return this.files.listFiles(pageSize);
  }

  /**
   * @deprecated Use toolkit.files.deleteFile() instead
   */
  async deleteFile(fileName: string): Promise<void> {
    return this.files.deleteFile(fileName);
  }

  /**
   * @deprecated Use toolkit.fileSearch.queryWithFileSearch() instead
   */
  async queryWithFileSearch(
    prompt: string,
    config: FileSearchQueryConfig,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    return this.fileSearch.queryWithFileSearch(prompt, config, model);
  }

  /**
   * @deprecated Use toolkit.coreAI.generateText() with thinking config instead
   */
  async generateWithThinking(
    prompt: string,
    thinkingBudget: number = DEFAULT_THINKING_BUDGET,
    model: string = DEFAULT_MODELS.TEXT_PRO
  ): Promise<unknown> {
    // This method needs special handling as it combines text generation with thinking
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT_PRO);

    try {
      const response = await this.client.models.generateContent({
      model: resolvedModel,
        contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget },
      },
    });

      return {
        text: extractTextFromResponse(response, resolvedModel, 'thinking generation'),
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate with thinking: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * @deprecated Use toolkit.cache.createCache() instead
   */
  async createCache(
    model: string,
    config: CreateCacheConfig
  ): Promise<CachedContent> {
    return this.cache.createCache(model, config);
  }

  /**
   * @deprecated Use toolkit.cache.listCaches() instead
   */
  async listCaches(): Promise<unknown> {
    return this.cache.listCaches();
  }

  /**
   * @deprecated Use toolkit.cache.getCache() instead
   */
  async getCache(cacheName: string): Promise<CachedContent> {
    return this.cache.getCache(cacheName);
  }

  /**
   * @deprecated Use toolkit.cache.updateCache() instead
   */
  async updateCache(
    cacheName: string,
    config: UpdateCacheConfig
  ): Promise<CachedContent> {
    return this.cache.updateCache(cacheName, config);
  }

  /**
   * @deprecated Use toolkit.cache.deleteCache() instead
   */
  async deleteCache(cacheName: string): Promise<void> {
    return this.cache.deleteCache(cacheName);
  }

  /**
   * @deprecated Use toolkit.tokens.countTokens() instead
   */
  async countTokens(
    contents: unknown,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<TokenCount> {
    return this.tokens.countTokens(contents, model);
  }

  /**
   * @deprecated Use this.client instead - direct access to GoogleGenAI client
   */
  getClient(): GoogleGenAI {
    return this.client;
  }

}
