/**
 * @file Main entry point for the Gemini Toolkit npm package.
 * Exports all public APIs, types, and utilities.
 */

// Main class
export { GeminiToolkit } from './geminiService';

// Quick convenience functions (minimal code usage)
export {
  generateText,
  generateImage,
  createChat,
  generateSpeech,
  search,
  findNearby,
  analyzeImage,
  editImage,
  queryFileSearch,
  createFileSearchStore,
  uploadToFileSearchStore,
  createEphemeralToken,
  uploadFile,
  getFile,
  listFiles,
  deleteFile,
  createCache,
  listCaches,
  getCache,
  updateCache,
  deleteCache,
  countTokens,
  connectMusic,
  queryWithUrlContext,
  queryWithUrlContextAndSearch,
  init,
  getToolkit,
} from './quick';

// Configuration and option types
export type {
  GeminiToolkitConfig,
  GenerateTextOptions,
  GenerateImageOptions,
  GenerateVideoOptions,
  GenerateSpeechOptions,
  LiveConversationOptions,
  LiveSessionCallbacks,
  LiveErrorEvent,
  LiveCloseEvent,
  GroundedResult,
} from './geminiService';

// Core types
export type {
  ChatMessage,
  Location,
  ImageAspectRatio,
  VideoAspectRatio,
  AspectRatio,
  FileMetadata,
  ChunkingConfig,
  FileSearchUploadConfig,
  FileSearchImportConfig,
  FileSearchQueryConfig,
  EphemeralTokenConfig,
  EphemeralToken,
  LiveConnectConstraints,
  FileObject,
  UploadFileConfig,
  CreateCacheConfig,
  UpdateCacheConfig,
  CachedContent,
  TokenCount,
  UsageMetadata,
  FunctionDeclaration,
  FunctionResponse,
  LiveTool,
  ContextWindowCompressionConfig,
  SessionResumptionConfig,
  RealtimeInputConfig,
  ThinkingConfig,
  ProactivityConfig,
  MediaResolution,
  WeightedPrompt,
  MusicGenerationConfig,
  MusicSessionCallbacks,
  MusicScale,
  MusicGenerationMode,
} from './types';

// Error classes
export {
  GeminiToolkitError,
  ApiKeyError,
  ValidationError,
  ApiRequestError,
  ModelResponseError,
} from './errors';

// Utilities
export { fileToBase64, bufferToBase64 } from './utils/mediaUtils';

// Browser-compatible utilities (for client-side usage)
export {
  base64ImageToBlobUrl,
  base64AudioToBlobUrl,
  fileToBase64Browser,
  downloadBase64Image,
  downloadBase64Audio,
} from './utils/browserUtils';

// Security utilities (for API key protection)
export {
  maskApiKey,
  sanitizeApiKeys,
  sanitizeError,
  mightContainApiKey,
  protectApiKeys,
  validateApiKeyFormat,
} from './utils/security';

// Developer-friendly utilities
export {
  saveImage,
  saveAudio,
  loadImage,
  batchGenerateText,
  streamToText,
} from './utils';

// Auto-detection utilities
export {
  detectMimeType,
  isImage,
  isVideo,
  isAudio,
  isDocument,
  suggestModel,
  detectAspectRatio,
  detectVideoAspectRatio,
  extractFileName,
  isBase64,
  detectMimeTypeFromDataUrl,
} from './utils/autoDetect';

// Auto-retry utilities
export {
  withAutoRetry,
  withRetryConfig,
  type RetryConfig,
} from './utils/autoRetry';

// Smart helpers (auto-detection + simplification)
export {
  smartUploadFile,
  smartGenerateText,
  smartAnalyzeImage,
  smartGenerateImage,
  smartCreateChat,
  smartBatch,
} from './utils/smartHelpers';

// Preset configurations
export { presets } from './presets';
