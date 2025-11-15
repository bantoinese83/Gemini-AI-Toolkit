/**
 * @file Type definitions for the Gemini Toolkit package.
 */

/**
 * Represents a single message in a chat conversation.
 */
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Represents geographic coordinates.
 */
export interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Defines the supported aspect ratios for image generation.
 */
export type ImageAspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

/**
 * Defines the supported aspect ratios for video generation.
 */
export type VideoAspectRatio = '16:9' | '9:16';

/**
 * Defines the union of all supported aspect ratios.
 */
export type AspectRatio = ImageAspectRatio | VideoAspectRatio;

/**
 * File metadata for File Search stores.
 */
export interface FileMetadata {
  /** Metadata key */
  key: string;
  /** String value (mutually exclusive with numericValue) */
  stringValue?: string;
  /** Numeric value (mutually exclusive with stringValue) */
  numericValue?: number;
}

/**
 * Chunking configuration for File Search.
 */
export interface ChunkingConfig {
  whiteSpaceConfig?: {
    /** Maximum tokens per chunk */
    maxTokensPerChunk?: number;
    /** Maximum overlapping tokens between chunks */
    maxOverlapTokens?: number;
  };
}

/**
 * Configuration for uploading files to File Search store.
 */
export interface FileSearchUploadConfig {
  /** Display name for the file */
  displayName?: string;
  /** Custom metadata for the file */
  customMetadata?: FileMetadata[];
  /** Chunking configuration */
  chunkingConfig?: ChunkingConfig;
}

/**
 * Configuration for importing files to File Search store.
 */
export interface FileSearchImportConfig {
  /** Custom metadata for the file */
  customMetadata?: FileMetadata[];
  /** Chunking configuration */
  chunkingConfig?: ChunkingConfig;
}

/**
 * File Search query configuration.
 */
export interface FileSearchQueryConfig {
  /** File Search store names to search */
  fileSearchStoreNames: string[];
  /** Optional metadata filter (e.g., 'author="Robert Graves"') */
  metadataFilter?: string;
}

/**
 * Live API connection constraints for ephemeral tokens.
 * Locks ephemeral tokens to specific configurations for enhanced security.
 */
export interface LiveConnectConstraints {
  /** Model name to lock the token to */
  model?: string;
  /** Configuration to lock the token to */
  config?: {
    /** Session resumption configuration */
    sessionResumption?: Record<string, unknown>;
    /** Temperature setting */
    temperature?: number;
    /** Response modalities (e.g., ['AUDIO']) */
    responseModalities?: string[];
    /** Additional configuration options */
    [key: string]: unknown;
  };
}

/**
 * Configuration for creating ephemeral tokens.
 * Ephemeral tokens are short-lived authentication tokens for Live API.
 */
export interface EphemeralTokenConfig {
  /** Number of times the token can be used (default: 1) */
  uses?: number;
  /** Expiration time for the token (ISO string or Date, default: 30 minutes) */
  expireTime?: string | Date;
  /** Expiration time for starting new sessions (ISO string or Date, default: 1 minute) */
  newSessionExpireTime?: string | Date;
  /** Optional constraints to lock the token to specific configurations */
  liveConnectConstraints?: LiveConnectConstraints;
}

/**
 * Result from creating an ephemeral token.
 */
export interface EphemeralToken {
  /** The token name/value to use as API key for Live API */
  name: string;
  /** Additional token metadata */
  [key: string]: unknown;
}

/**
 * File object returned from Files API.
 */
export interface FileObject {
  /** File name (identifier) */
  name: string;
  /** File URI for use in API calls */
  uri?: string;
  /** MIME type of the file */
  mimeType?: string;
  /** Display name for the file */
  displayName?: string;
  /** File state (e.g., 'ACTIVE', 'PROCESSING') */
  state?: string;
  /** File size in bytes */
  sizeBytes?: number;
  /** Creation time */
  createTime?: string;
  /** Update time */
  updateTime?: string;
  /** Expiration time */
  expireTime?: string;
  /** Additional file metadata */
  [key: string]: unknown;
}

/**
 * Configuration for uploading files.
 */
export interface UploadFileConfig {
  /** Display name for the file */
  displayName?: string;
  /** MIME type (auto-detected if not provided) */
  mimeType?: string;
}

/**
 * Configuration for creating cached content.
 */
export interface CreateCacheConfig {
  /** Display name for the cache (used to identify it) */
  displayName?: string;
  /** System instruction to cache */
  systemInstruction?: string;
  /** Contents to cache (files, text, etc.) */
  contents?: unknown[];
  /** Time to live (e.g., '300s' for 5 minutes, or number of seconds) */
  ttl?: string | number;
  /** Expiration time (ISO string or Date) */
  expireTime?: string | Date;
}

/**
 * Configuration for updating cached content.
 */
export interface UpdateCacheConfig {
  /** New time to live (e.g., '300s' or number of seconds) */
  ttl?: string | number;
  /** New expiration time (ISO string or Date) */
  expireTime?: string | Date;
}

/**
 * Cached content object.
 */
export interface CachedContent {
  /** Cache name (identifier) */
  name: string;
  /** Model name */
  model?: string;
  /** Display name */
  displayName?: string;
  /** Usage metadata */
  usageMetadata?: {
    /** Total tokens cached */
    totalTokenCount?: number;
    /** Cached content token count */
    cachedContentTokenCount?: number;
  };
  /** Creation time */
  createTime?: string;
  /** Update time */
  updateTime?: string;
  /** Expiration time */
  expireTime?: string;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Token count result.
 */
export interface TokenCount {
  /** Total token count */
  totalTokens: number;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Usage metadata from API responses.
 */
export interface UsageMetadata {
  /** Prompt token count */
  promptTokenCount?: number;
  /** Cached content token count */
  cachedContentTokenCount?: number;
  /** Candidates token count (output) */
  candidatesTokenCount?: number;
  /** Total token count */
  totalTokenCount?: number;
}

/**
 * Function declaration for Live API function calling.
 */
export interface FunctionDeclaration {
  /** Function name */
  name: string;
  /** Function description */
  description?: string;
  /** Function parameters schema */
  parameters?: Record<string, unknown>;
  /** Function behavior: 'NON_BLOCKING' for async execution */
  behavior?: 'NON_BLOCKING' | 'BLOCKING';
}

/**
 * Function response for Live API function calling.
 */
export interface FunctionResponse {
  /** Function call ID */
  id: string;
  /** Function name */
  name: string;
  /** Function response data */
  response: Record<string, unknown>;
  /** Scheduling for non-blocking functions: 'INTERRUPT', 'WHEN_IDLE', or 'SILENT' */
  scheduling?: 'INTERRUPT' | 'WHEN_IDLE' | 'SILENT';
}

/**
 * Tool configuration for Live API.
 */
export interface LiveTool {
  /** Function declarations for function calling */
  functionDeclarations?: FunctionDeclaration[];
  /** Enable Google Search grounding */
  googleSearch?: Record<string, unknown>;
}

/**
 * Context window compression configuration for Live API.
 */
export interface ContextWindowCompressionConfig {
  /** Sliding window configuration */
  slidingWindow?: Record<string, unknown>;
  /** Number of tokens that triggers compression */
  triggerTokens?: number;
}

/**
 * Session resumption configuration for Live API.
 */
export interface SessionResumptionConfig {
  /** Session handle to resume (null/undefined to start new session) */
  handle?: string | null;
}

/**
 * Automatic activity detection configuration for Live API VAD.
 */
export interface AutomaticActivityDetectionConfig {
  /** Disable automatic VAD (default: false) */
  disabled?: boolean;
  /** Start of speech sensitivity: 'START_SENSITIVITY_LOW', 'START_SENSITIVITY_MEDIUM', 'START_SENSITIVITY_HIGH' */
  startOfSpeechSensitivity?: string;
  /** End of speech sensitivity: 'END_SENSITIVITY_LOW', 'END_SENSITIVITY_MEDIUM', 'END_SENSITIVITY_HIGH' */
  endOfSpeechSensitivity?: string;
  /** Prefix padding in milliseconds */
  prefixPaddingMs?: number;
  /** Silence duration in milliseconds */
  silenceDurationMs?: number;
}

/**
 * Realtime input configuration for Live API.
 */
export interface RealtimeInputConfig {
  /** Automatic activity detection configuration */
  automaticActivityDetection?: AutomaticActivityDetectionConfig;
}

/**
 * Thinking configuration for Live API.
 */
export interface ThinkingConfig {
  /** Thinking budget in tokens */
  thinkingBudget?: number;
  /** Include thought summaries in response */
  includeThoughts?: boolean;
}

/**
 * Proactivity configuration for Live API.
 */
export interface ProactivityConfig {
  /** Enable proactive audio */
  proactiveAudio?: boolean;
}

/**
 * Media resolution for Live API.
 */
export type MediaResolution = 'MEDIA_RESOLUTION_LOW' | 'MEDIA_RESOLUTION_MEDIUM' | 'MEDIA_RESOLUTION_HIGH';

/**
 * Musical scale for Lyria RealTime music generation.
 */
export type MusicScale = 
  | 'C_MAJOR_A_MINOR'
  | 'D_FLAT_MAJOR_B_FLAT_MINOR'
  | 'D_MAJOR_B_MINOR'
  | 'E_FLAT_MAJOR_C_MINOR'
  | 'E_MAJOR_D_FLAT_MINOR'
  | 'F_MAJOR_D_MINOR'
  | 'G_FLAT_MAJOR_E_FLAT_MINOR'
  | 'G_MAJOR_E_MINOR'
  | 'A_FLAT_MAJOR_F_MINOR'
  | 'A_MAJOR_G_FLAT_MINOR'
  | 'B_FLAT_MAJOR_G_MINOR'
  | 'B_MAJOR_A_FLAT_MINOR'
  | 'SCALE_UNSPECIFIED';

/**
 * Music generation mode for Lyria RealTime.
 */
export type MusicGenerationMode = 'QUALITY' | 'DIVERSITY' | 'VOCALIZATION';

/**
 * Weighted prompt for Lyria RealTime music generation.
 */
export interface WeightedPrompt {
  /** Prompt text describing musical idea, genre, instrument, mood, etc. */
  text: string;
  /** Weight value (any value except 0, 1.0 is usually a good starting point) */
  weight: number;
}

/**
 * Music generation configuration for Lyria RealTime.
 */
export interface MusicGenerationConfig {
  /** Guidance (0.0-6.0, default: 4.0) - Controls how strictly model follows prompts */
  guidance?: number;
  /** BPM (60-200) - Beats Per Minute */
  bpm?: number;
  /** Density (0.0-1.0) - Controls density of musical notes/sounds */
  density?: number;
  /** Brightness (0.0-1.0) - Adjusts tonal quality */
  brightness?: number;
  /** Musical scale */
  scale?: MusicScale;
  /** Mute bass (default: false) */
  muteBass?: boolean;
  /** Mute drums (default: false) */
  muteDrums?: boolean;
  /** Only bass and drums (default: false) */
  onlyBassAndDrums?: boolean;
  /** Music generation mode (default: 'QUALITY') */
  musicGenerationMode?: MusicGenerationMode;
  /** Temperature (0.0-3.0, default: 1.1) */
  temperature?: number;
  /** Top K (1-1000, default: 40) */
  topK?: number;
  /** Seed (0-2147483647, randomly selected by default) */
  seed?: number;
  /** Audio format (default: 'pcm16') */
  audioFormat?: string;
  /** Sample rate in Hz (default: 48000) */
  sampleRateHz?: number;
}

/**
 * Callbacks for Lyria RealTime music session.
 */
export interface MusicSessionCallbacks {
  /** Called when a message is received */
  onmessage: (message: unknown) => Promise<void> | void;
  /** Called when an error occurs */
  onerror: (error: unknown) => void;
  /** Called when the session closes */
  onclose: () => void;
}
