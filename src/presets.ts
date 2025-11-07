/**
 * @file Preset configurations for common use cases.
 * Makes it even easier for developers with ready-to-use configs.
 * Comprehensive presets covering all possible scenarios.
 */

import type {
  GenerateTextOptions,
  GenerateImageOptions,
  GenerateVideoOptions,
  GenerateSpeechOptions,
} from './geminiService';

/**
 * Comprehensive preset configurations for all use cases.
 * 
 * @example
 * ```typescript
 * import { presets, generateText, generateImage } from 'gemini-ai-toolkit';
 * 
 * // Text presets
 * const text = await generateText('Hello!', presets.text.fast);
 * 
 * // Image presets
 * const image = await generateImage('A robot', presets.image.wide);
 * 
 * // Video presets
 * const video = await generateVideo(img, 'image/png', 'Animate', presets.video.landscape);
 * ```
 */
const presets = {
  /**
   * Text generation presets for various use cases.
   */
  text: {
    // Speed presets
    fast: { model: 'gemini-2.5-flash' } as GenerateTextOptions,
    smart: { model: 'gemini-2.5-pro' } as GenerateTextOptions,

    // Style presets
    creative: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.9, maxOutputTokens: 2000 },
    } as GenerateTextOptions,
    concise: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.3, maxOutputTokens: 500 },
    } as GenerateTextOptions,
    detailed: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.7, maxOutputTokens: 4000 },
    } as GenerateTextOptions,
    balanced: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.5, maxOutputTokens: 1000 },
    } as GenerateTextOptions,

    // Use case presets
    code: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.2, maxOutputTokens: 2000 },
    } as GenerateTextOptions,
    translation: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.1, maxOutputTokens: 1000 },
    } as GenerateTextOptions,
    summarization: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.3, maxOutputTokens: 500 },
    } as GenerateTextOptions,
    qa: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.4, maxOutputTokens: 1500 },
    } as GenerateTextOptions,
    analysis: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.5, maxOutputTokens: 3000 },
    } as GenerateTextOptions,
    technical: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.2, maxOutputTokens: 2500 },
    } as GenerateTextOptions,
    casual: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.8, maxOutputTokens: 1000 },
    } as GenerateTextOptions,
    formal: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.3, maxOutputTokens: 2000 },
    } as GenerateTextOptions,
    storytelling: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.95, maxOutputTokens: 3000 },
    } as GenerateTextOptions,
    explanation: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.4, maxOutputTokens: 2000 },
    } as GenerateTextOptions,

    // Temperature presets
    lowTemp: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.1, maxOutputTokens: 1000 },
    } as GenerateTextOptions,
    mediumTemp: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.5, maxOutputTokens: 1000 },
    } as GenerateTextOptions,
    highTemp: {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.9, maxOutputTokens: 1000 },
    } as GenerateTextOptions,

    // Length presets
    short: {
      model: 'gemini-2.5-flash',
      config: { maxOutputTokens: 200 },
    } as GenerateTextOptions,
    medium: {
      model: 'gemini-2.5-flash',
      config: { maxOutputTokens: 1000 },
    } as GenerateTextOptions,
    long: {
      model: 'gemini-2.5-pro',
      config: { maxOutputTokens: 4000 },
    } as GenerateTextOptions,
  },

  /**
   * Image generation presets for various formats and use cases.
   */
  image: {
    // Aspect ratio presets
    square: { aspectRatio: '1:1' } as GenerateImageOptions,
    wide: { aspectRatio: '16:9' } as GenerateImageOptions,
    portrait: { aspectRatio: '9:16' } as GenerateImageOptions,
    standard: { aspectRatio: '4:3' } as GenerateImageOptions,
    tall: { aspectRatio: '3:4' } as GenerateImageOptions,

    // Format presets
    png: {
      aspectRatio: '1:1',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    jpeg: {
      aspectRatio: '1:1',
      outputMimeType: 'image/jpeg',
    } as GenerateImageOptions,
    webp: {
      aspectRatio: '1:1',
      outputMimeType: 'image/webp',
    } as GenerateImageOptions,

    // Use case presets
    thumbnail: {
      aspectRatio: '1:1',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    banner: {
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    socialMedia: {
      aspectRatio: '1:1',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    instagram: {
      aspectRatio: '1:1',
      outputMimeType: 'image/jpeg',
    } as GenerateImageOptions,
    instagramStory: {
      aspectRatio: '9:16',
      outputMimeType: 'image/jpeg',
    } as GenerateImageOptions,
    youtube: {
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    twitter: {
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    linkedin: {
      aspectRatio: '1:1',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    facebook: {
      aspectRatio: '1:1',
      outputMimeType: 'image/jpeg',
    } as GenerateImageOptions,
    print: {
      aspectRatio: '4:3',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    wallpaper: {
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    profile: {
      aspectRatio: '1:1',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,
    cover: {
      aspectRatio: '16:9',
      outputMimeType: 'image/png',
    } as GenerateImageOptions,

    // Multiple images
    batch2: {
      aspectRatio: '1:1',
      numberOfImages: 2,
    } as GenerateImageOptions,
    batch4: {
      aspectRatio: '1:1',
      numberOfImages: 4,
    } as GenerateImageOptions,
  },

  /**
   * Video generation presets for various platforms and use cases.
   */
  video: {
    // Aspect ratio presets
    landscape: {
      aspectRatio: '16:9',
      resolution: '720p',
    } as GenerateVideoOptions,
    portrait: {
      aspectRatio: '9:16',
      resolution: '720p',
    } as GenerateVideoOptions,
    landscapeHD: {
      aspectRatio: '16:9',
      resolution: '1080p',
    } as GenerateVideoOptions,
    portraitHD: {
      aspectRatio: '9:16',
      resolution: '1080p',
    } as GenerateVideoOptions,

    // Use case presets
    youtube: {
      aspectRatio: '16:9',
      resolution: '1080p',
    } as GenerateVideoOptions,
    tiktok: {
      aspectRatio: '9:16',
      resolution: '720p',
    } as GenerateVideoOptions,
    instagram: {
      aspectRatio: '9:16',
      resolution: '720p',
    } as GenerateVideoOptions,
    instagramStory: {
      aspectRatio: '9:16',
      resolution: '720p',
    } as GenerateVideoOptions,
    reels: {
      aspectRatio: '9:16',
      resolution: '720p',
    } as GenerateVideoOptions,
    shorts: {
      aspectRatio: '9:16',
      resolution: '1080p',
    } as GenerateVideoOptions,
    presentation: {
      aspectRatio: '16:9',
      resolution: '1080p',
    } as GenerateVideoOptions,
    social: {
      aspectRatio: '16:9',
      resolution: '720p',
    } as GenerateVideoOptions,
  },

  /**
   * Speech generation presets for various voices and use cases.
   */
  speech: {
    // Voice presets
    default: { voiceName: 'Kore' } as GenerateSpeechOptions,
    alternative: { voiceName: 'Zephyr' } as GenerateSpeechOptions,
    kore: { voiceName: 'Kore' } as GenerateSpeechOptions,
    zephyr: { voiceName: 'Zephyr' } as GenerateSpeechOptions,

    // Use case presets
    narration: { voiceName: 'Kore' } as GenerateSpeechOptions,
    conversation: { voiceName: 'Zephyr' } as GenerateSpeechOptions,
    announcement: { voiceName: 'Kore' } as GenerateSpeechOptions,
    podcast: { voiceName: 'Kore' } as GenerateSpeechOptions,
    audiobook: { voiceName: 'Zephyr' } as GenerateSpeechOptions,
    tutorial: { voiceName: 'Kore' } as GenerateSpeechOptions,
    commercial: { voiceName: 'Zephyr' } as GenerateSpeechOptions,
  },

  /**
   * Chat conversation presets for different conversation styles.
   */
  chat: {
    casual: 'gemini-2.5-flash',
    professional: 'gemini-2.5-pro',
    technical: 'gemini-2.5-pro',
    creative: 'gemini-2.5-flash',
    fast: 'gemini-2.5-flash',
    smart: 'gemini-2.5-pro',
  },

  /**
   * Analysis presets for different types of content analysis.
   */
  analysis: {
    detailed: {
      model: 'gemini-2.5-pro',
    } as GenerateTextOptions,
    summary: {
      model: 'gemini-2.5-flash',
      config: { maxOutputTokens: 500 },
    } as GenerateTextOptions,
    technical: {
      model: 'gemini-2.5-pro',
      config: { temperature: 0.2 },
    } as GenerateTextOptions,
    visual: {
      model: 'gemini-2.5-flash-image',
    } as GenerateTextOptions,
    quick: {
      model: 'gemini-2.5-flash',
      config: { maxOutputTokens: 300 },
    } as GenerateTextOptions,
  },
} as const;

/**
 * Preset configurations for common use cases.
 * 
 * @example
 * ```typescript
 * import { presets, generateText, generateImage, generateVideo } from 'gemini-ai-toolkit';
 * 
 * // Text presets
 * const code = await generateText('Write a function', presets.text.code);
 * const story = await generateText('Tell a story', presets.text.storytelling);
 * 
 * // Image presets
 * const banner = await generateImage('A banner', presets.image.banner);
 * const instagram = await generateImage('A post', presets.image.instagram);
 * 
 * // Video presets
 * const youtube = await generateVideo(img, 'image/png', 'Animate', presets.video.youtube);
 * const tiktok = await generateVideo(img, 'image/png', 'Animate', presets.video.tiktok);
 * 
 * // Speech presets
 * const narration = await generateSpeech('Hello', presets.speech.narration);
 * 
 * // Chat presets
 * const chat = createChat(presets.chat.casual);
 * 
 * // Analysis presets
 * const analysis = await analyzeImage(img, 'What is this?', 'image/png', presets.analysis.detailed);
 * ```
 */
export { presets };
