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

// Developer-friendly utilities
export {
  saveImage,
  saveAudio,
  loadImage,
  batchGenerateText,
  streamToText,
} from './utils';

// Preset configurations
export { presets } from './presets';
