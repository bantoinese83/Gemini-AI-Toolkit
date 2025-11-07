/**
 * @file Constants used throughout the Gemini Toolkit.
 * Centralizes default values and configuration to maintain consistency.
 */

/**
 * Default model names for different use cases.
 */
export const DEFAULT_MODELS = {
  TEXT: 'gemini-2.5-flash',
  TEXT_PRO: 'gemini-2.5-pro',
  TEXT_IMAGE: 'gemini-2.5-flash-image',
  TEXT_TTS: 'gemini-2.5-flash-preview-tts',
  IMAGE: 'imagen-4.0-generate-001',
  VIDEO: 'veo-3.1-fast-generate-preview',
  LIVE: 'gemini-2.5-flash-native-audio-preview-09-2025',
} as const;

/**
 * Default voice names for speech synthesis.
 */
export const DEFAULT_VOICES = {
  SPEECH: 'Kore',
  LIVE: 'Zephyr',
} as const;

/**
 * Default aspect ratios.
 */
export const DEFAULT_ASPECT_RATIOS = {
  IMAGE: '1:1' as const,
  VIDEO: '16:9' as const,
} as const;

/**
 * Default video resolution.
 */
export const DEFAULT_VIDEO_RESOLUTION = '720p' as const;

/**
 * Default thinking budget for thinking mode.
 */
export const DEFAULT_THINKING_BUDGET = 32768;

/**
 * Valid video resolutions.
 */
export const VIDEO_RESOLUTIONS = ['720p', '1080p'] as const;

/**
 * Valid image aspect ratios.
 */
export const IMAGE_ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;

/**
 * Valid video aspect ratios.
 */
export const VIDEO_ASPECT_RATIOS = ['16:9', '9:16'] as const;

/**
 * Minimum and maximum values for number of images/videos.
 */
export const GENERATION_LIMITS = {
  MIN_IMAGES: 1,
  MAX_IMAGES: 4,
  MIN_VIDEOS: 1,
  MAX_VIDEOS: 1,
} as const;

