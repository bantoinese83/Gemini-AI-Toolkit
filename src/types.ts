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

