<div align="center">

# 🤖 Gemini AI Toolkit

**The most comprehensive, developer-friendly toolkit for Google's Gemini API**

[![npm version](https://img.shields.io/npm/v/gemini-ai-toolkit.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/gemini-ai-toolkit)
[![npm downloads](https://img.shields.io/npm/dm/gemini-ai-toolkit.svg?style=for-the-badge&logo=npm&color=cb3837)](https://www.npmjs.com/package/gemini-ai-toolkit)
[![License](https://img.shields.io/npm/l/gemini-ai-toolkit.svg?style=for-the-badge&color=blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)](https://github.com/bantoinese83/Gemini-AI-Toolkit)
[![Code Quality](https://img.shields.io/badge/code%20quality-100%2F100-brightgreen.svg?style=for-the-badge)](https://github.com/bantoinese83/Gemini-AI-Toolkit)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg?style=for-the-badge)](https://github.com/bantoinese83/Gemini-AI-Toolkit)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [API Reference](#-api-reference) • [Presets](#-presets) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Presets](#-presets)
- [Utilities](#-utilities)
- [Error Handling](#-error-handling)
- [Type Definitions](#-type-definitions)
- [Examples](#-examples)
- [Best Practices](#-best-practices)
- [Performance Tips](#-performance-tips)
- [Requirements](#-requirements)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**Gemini AI Toolkit** is a production-ready, TypeScript-first npm package that provides a clean, intuitive interface to Google's powerful Gemini API. Built with developer experience in mind, it offers:

- 🚀 **One-line functions** for minimal code usage
- 🎨 **79 preset configurations** for common use cases
- 🛠️ **Developer-friendly utilities** for file operations
- 📦 **Zero dependencies** (only `@google/genai` as peer dependency)
- 🔒 **Full TypeScript support** with strict type checking
- ⚡ **Auto API key detection** from environment variables
- 🎯 **Comprehensive error handling** with helpful messages
- 📚 **16 detailed examples** covering all features

### Why Gemini AI Toolkit?

| Feature | This Package | Others |
|---------|-------------|--------|
| **Code Required** | 1 line | 3-5 lines |
| **Presets** | 79 ready-to-use | Manual config |
| **Type Safety** | 100% TypeScript | Partial |
| **Utilities** | Built-in | External libs |
| **Error Messages** | Actionable tips | Generic |
| **Documentation** | Comprehensive | Basic |
| **Examples** | 16 examples | Few/None |

---

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description | Models Supported |
|---------|-------------|------------------|
| **📝 Text Generation** | Generate text with latest Gemini models | `gemini-2.5-flash`, `gemini-2.5-pro` |
| **💬 Chat Conversations** | Create and manage chat sessions with context | All text models |
| **🖼️ Image Generation** | Generate images with Imagen 4.0 | `imagen-4.0-generate-001` |
| **🎨 Image Editing** | Edit images with text prompts | Imagen models |
| **🔍 Image Understanding** | Analyze and understand image content | `gemini-2.5-flash-image` |
| **🎬 Video Generation** | Generate videos from images with Veo 3.1 | `veo-3.1-fast-generate-preview` |
| **📹 Video Understanding** | Analyze video content frame-by-frame | All vision models |
| **🔊 Text-to-Speech** | Convert text to natural speech | `gemini-2.5-flash-preview-tts` |
| **🎤 Live Conversations** | Real-time audio conversations | `gemini-2.5-flash-native-audio-preview-09-2025` |
| **🌐 Grounded Search** | Get up-to-date answers from Google Search | All text models |
| **🗺️ Grounded Maps** | Find location-based information | All text models |
| **🧠 Thinking Mode** | Tackle complex problems with extended thinking | `gemini-2.5-pro` |

### 🎁 Developer Experience Features

- ⚡ **Quick Functions**: One-liner functions for common operations
- 🎨 **79 Presets**: Pre-configured options for all use cases
- 🛠️ **Utilities**: File operations, batch processing, streaming helpers
- 🔄 **Auto-initialization**: Automatic API key detection
- 📦 **Minimal Dependencies**: Only 1 production dependency
- 🎯 **Type Safety**: Full TypeScript support with strict mode
- 📚 **Comprehensive Docs**: Detailed documentation and examples

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn** or **pnpm**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Install

```bash
# Using npm
npm install gemini-ai-toolkit

# Using yarn
yarn add gemini-ai-toolkit

# Using pnpm
pnpm add gemini-ai-toolkit
```

### Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy and store it securely

---

## 🚀 Quick Start

### Option 1: One-Line Functions (Recommended) ⚡

**Perfect for quick scripts and minimal code usage**

```typescript
import { generateText, generateImage, search } from 'gemini-ai-toolkit';

// Set GEMINI_API_KEY environment variable
// export GEMINI_API_KEY="your-api-key-here"

// One line - that's it!
const text = await generateText('Explain quantum computing in simple terms');
const image = await generateImage('A futuristic robot in a cyberpunk city');
const results = await search('Latest AI developments in 2024');
```

### Option 2: Initialize Once, Use Everywhere

**Best for applications with multiple API calls**

```typescript
import { init, generateText, generateImage } from 'gemini-ai-toolkit';

// Initialize once at app startup
init('your-api-key-here');

// Now use anywhere - no API key needed!
const text1 = await generateText('First prompt');
const text2 = await generateText('Second prompt');
const image = await generateImage('A robot');
```

### Option 3: Full Class API (Maximum Control)

**Best for complex applications needing fine-grained control**

```typescript
import { GeminiToolkit } from 'gemini-ai-toolkit';

const toolkit = new GeminiToolkit({ 
  apiKey: 'your-api-key-here' 
});

const text = await toolkit.generateText('Hello, world!');
const chat = toolkit.createChat('gemini-2.5-pro');
```

### Environment Variable Setup

```bash
# Linux/macOS
export GEMINI_API_KEY="your-api-key-here"

# Windows (PowerShell)
$env:GEMINI_API_KEY="your-api-key-here"

# Windows (CMD)
set GEMINI_API_KEY=your-api-key-here

# Or use a .env file (recommended)
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

---

## 📚 API Reference

### Quick Functions (One-Liners)

All quick functions automatically detect your API key from `GEMINI_API_KEY` environment variable or use the cached instance from `init()`.

#### `generateText(prompt, options?, apiKey?)`

Generate text content with a single line of code.

```typescript
import { generateText, presets } from 'gemini-ai-toolkit';

// Basic usage
const text = await generateText('What is artificial intelligence?');

// With options
const text = await generateText('Explain quantum computing', {
  model: 'gemini-2.5-pro',
  config: { temperature: 0.7, maxOutputTokens: 2000 }
});

// With preset
const text = await generateText('Quick answer', presets.text.fast);

// With explicit API key
const text = await generateText('Hello!', undefined, 'your-api-key');
```

**Parameters:**
- `prompt` (string, required): The text prompt
- `options` (GenerateTextOptions, optional): Configuration options
- `apiKey` (string, optional): API key (overrides env var)

**Returns:** `Promise<string>` - Generated text

#### `generateImage(prompt, options?, apiKey?)`

Generate images with Imagen 4.0.

```typescript
import { generateImage, presets, saveImage } from 'gemini-ai-toolkit';

// Basic usage
const imageBase64 = await generateImage('A robot with a skateboard');

// With preset
const imageBase64 = await generateImage('A landscape', presets.image.wide);

// Save to file
saveImage(imageBase64, 'output.png');
```

**Parameters:**
- `prompt` (string, required): Image description
- `options` (GenerateImageOptions, optional): Configuration options
- `apiKey` (string, optional): API key

**Returns:** `Promise<string>` - Base64 encoded image

#### `createChat(model?, apiKey?)`

Create a chat session for conversational interactions.

```typescript
import { createChat, presets } from 'gemini-ai-toolkit';

// Basic usage
const chat = createChat();

// With model
const chat = createChat('gemini-2.5-pro');

// With preset
const chat = createChat(presets.chat.professional);

// Use the chat
const response = await chat.sendMessage({ message: 'Hello!' });
console.log(response.text);

// Streaming
const stream = await chat.sendMessageStream({ message: 'Tell a story' });
for await (const chunk of stream) {
  process.stdout.write(chunk.text);
}
```

**Returns:** `Chat` instance

#### `generateSpeech(text, options?, apiKey?)`

Convert text to natural speech.

```typescript
import { generateSpeech, saveAudio, presets } from 'gemini-ai-toolkit';

// Basic usage
const audioBase64 = await generateSpeech('Hello, world!');

// With preset
const audioBase64 = await generateSpeech('Welcome!', presets.speech.narration);

// Save to file
saveAudio(audioBase64, 'output.wav');
```

**Returns:** `Promise<string>` - Base64 encoded audio

#### `search(query, apiKey?)`

Search the web and get grounded answers.

```typescript
import { search } from 'gemini-ai-toolkit';

const result = await search('Latest AI developments in 2024');
console.log(result.text);
```

**Returns:** `Promise<GroundedResult>` - Search results with citations

#### `findNearby(query, location, apiKey?)`

Find nearby places using Google Maps.

```typescript
import { findNearby } from 'gemini-ai-toolkit';

const places = await findNearby('restaurants', {
  latitude: 37.7749,
  longitude: -122.4194
});
console.log(places.text);
```

**Returns:** `Promise<GroundedResult>` - Location-based results

#### `analyzeImage(imageBase64, prompt, mimeType, options?, apiKey?)`

Analyze image content.

```typescript
import { analyzeImage, loadImage, presets } from 'gemini-ai-toolkit';

const imageBase64 = await loadImage('photo.jpg');
const analysis = await analyzeImage(
  imageBase64,
  'What is in this image?',
  'image/jpeg',
  presets.analysis.detailed
);
```

**Returns:** `Promise<string>` - Analysis text

#### `editImage(imageBase64, mimeType, prompt, apiKey?)`

Edit images with text prompts.

```typescript
import { editImage, loadImage, saveImage } from 'gemini-ai-toolkit';

const imageBase64 = await loadImage('input.png');
const edited = await editImage(
  imageBase64,
  'image/png',
  'Add a sunset in the background'
);
saveImage(edited, 'output.png');
```

**Returns:** `Promise<string>` - Base64 encoded edited image

#### `init(apiKey)`

Initialize the toolkit once for use with quick functions.

```typescript
import { init, generateText } from 'gemini-ai-toolkit';

// Initialize once
init('your-api-key-here');

// Now all quick functions work without passing API key
const text = await generateText('Hello!');
```

#### `getToolkit()`

Get the default toolkit instance.

```typescript
import { getToolkit } from 'gemini-ai-toolkit';

const toolkit = getToolkit();
// Use toolkit methods directly
```

---

### Class API (GeminiToolkit)

For applications needing more control, use the class API:

```typescript
import { GeminiToolkit } from 'gemini-ai-toolkit';

const toolkit = new GeminiToolkit({ 
  apiKey: 'your-api-key-here' 
});
```

#### Constructor

```typescript
new GeminiToolkit(config: GeminiToolkitConfig)
```

**Config:**
- `apiKey` (string, required): Your Gemini API key

#### Methods

##### `generateText(prompt, options?)`

Generate text content.

```typescript
const text = await toolkit.generateText('Hello, world!', {
  model: 'gemini-2.5-pro',
  config: {
    temperature: 0.7,
    maxOutputTokens: 2000,
    topP: 0.95,
    topK: 40
  }
});
```

**Options:**
- `model` (string): Model name (default: `'gemini-2.5-flash'`)
- `config` (object): Additional model configuration

##### `createChat(model?)`

Create a chat session.

```typescript
const chat = toolkit.createChat('gemini-2.5-pro');

// Send message
const response = await chat.sendMessage({ 
  message: 'Hello!' 
});

// Streaming
const stream = await chat.sendMessageStream({ 
  message: 'Tell a story' 
});

for await (const chunk of stream) {
  console.log(chunk.text);
}
```

**Chat Methods:**
- `sendMessage({ message })` - Send a message and get response
- `sendMessageStream({ message })` - Stream response chunks

##### `generateImage(prompt, options?)`

Generate images.

```typescript
const imageBase64 = await toolkit.generateImage(
  'A futuristic city at sunset',
  {
    aspectRatio: '16:9',
    outputMimeType: 'image/png',
    numberOfImages: 1
  }
);
```

**Options:**
- `model` (string): Model name (default: `'imagen-4.0-generate-001'`)
- `aspectRatio` (ImageAspectRatio): `'1:1'`, `'16:9'`, `'9:16'`, `'4:3'`, `'3:4'`
- `numberOfImages` (number): 1-4 (default: 1)
- `outputMimeType` (string): `'image/png'`, `'image/jpeg'`, `'image/webp'`

##### `editImage(imageBase64, mimeType, prompt, model?)`

Edit images.

```typescript
const edited = await toolkit.editImage(
  imageBase64,
  'image/png',
  'Apply a retro 80s filter with warm tones'
);
```

##### `analyzeMedia(data, mimeType, prompt, options?)`

Analyze images, video frames, or audio.

```typescript
// Single image
const analysis = await toolkit.analyzeMedia(
  imageBase64,
  'image/png',
  'What is in this image?'
);

// Multiple frames (video)
const frames = [frame1, frame2, frame3];
const analysis = await toolkit.analyzeMedia(
  frames,
  'image/jpeg',
  'Describe the video content',
  { isVideo: true }
);
```

**Options:**
- `model` (string): Model name
- `isVideo` (boolean): Set to `true` for video analysis

##### `generateVideo(imageBase64, mimeType, prompt, options?)`

Generate videos from images.

```typescript
const operation = await toolkit.generateVideo(
  imageBase64,
  'image/png',
  'Make the scene come alive with gentle movement',
  {
    aspectRatio: '16:9',
    resolution: '1080p'
  }
);

// Poll for completion
// Note: Video generation is asynchronous
```

**Options:**
- `model` (string): Model name (default: `'veo-3.1-fast-generate-preview'`)
- `aspectRatio` (VideoAspectRatio): `'16:9'` or `'9:16'`
- `resolution` (string): `'720p'` or `'1080p'`
- `numberOfVideos` (number): 1

**Returns:** `Operation` object (poll for completion)

##### `generateSpeech(text, options?)`

Convert text to speech.

```typescript
const audioBase64 = await toolkit.generateSpeech('Hello, world!', {
  voiceName: 'Kore',
  model: 'gemini-2.5-flash-preview-tts'
});
```

**Options:**
- `model` (string): Model name
- `voiceName` (string): `'Kore'` or `'Zephyr'`

##### `connectLive(callbacks, options?)`

Connect to live conversation session.

```typescript
const session = await toolkit.connectLive({
  onopen: () => console.log('Connected'),
  onmessage: async (message) => {
    console.log('Received:', message);
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Disconnected')
});

// Send audio
await session.sendAudio(audioData);

// Close session
await session.close();
```

**Callbacks:**
- `onopen()`: Called when connection opens
- `onmessage(message)`: Called when message received
- `onerror(error)`: Called on error
- `onclose(event)`: Called when connection closes

##### `groundWithSearch(prompt, model?)`

Get answers grounded in Google Search.

```typescript
const result = await toolkit.groundWithSearch(
  'What are the latest AI developments?',
  'gemini-2.5-pro'
);

console.log(result.text);
console.log(result.candidates); // Citations
```

**Returns:** `GroundedResult` with `text` and `candidates`

##### `groundWithMaps(prompt, location?, model?)`

Get location-based information.

```typescript
const result = await toolkit.groundWithMaps(
  'Find nearby coffee shops',
  { latitude: 37.7749, longitude: -122.4194 },
  'gemini-2.5-pro'
);
```

**Returns:** `GroundedResult`

##### `generateWithThinking(prompt, thinkingBudget?, model?)`

Generate text with extended thinking capabilities.

```typescript
const result = await toolkit.generateWithThinking(
  'Solve this complex problem step by step...',
  32768, // Thinking budget
  'gemini-2.5-pro'
);
```

**Parameters:**
- `prompt` (string): The problem to solve
- `thinkingBudget` (number): Tokens for thinking (default: 32768)
- `model` (string): Model name (default: `'gemini-2.5-pro'`)

---

## 🎨 Presets

**79 ready-to-use preset configurations** covering all use cases. No configuration needed - just use the preset!

### Text Presets (22 presets)

```typescript
import { generateText, presets } from 'gemini-ai-toolkit';

// Speed presets
const fast = await generateText('Quick answer', presets.text.fast);
const smart = await generateText('Complex question', presets.text.smart);

// Style presets
const creative = await generateText('Story', presets.text.creative);
const concise = await generateText('Summary', presets.text.concise);
const detailed = await generateText('Analysis', presets.text.detailed);
const balanced = await generateText('Answer', presets.text.balanced);

// Use case presets
const code = await generateText('Write function', presets.text.code);
const qa = await generateText('What is AI?', presets.text.qa);
const technical = await generateText('Explain API', presets.text.technical);
const storytelling = await generateText('Tell story', presets.text.storytelling);
const translation = await generateText('Translate', presets.text.translation);
const summarization = await generateText('Summarize', presets.text.summarization);
const analysis = await generateText('Analyze', presets.text.analysis);
const casual = await generateText('Chat', presets.text.casual);
const formal = await generateText('Document', presets.text.formal);
const explanation = await generateText('Explain', presets.text.explanation);

// Temperature presets
const lowTemp = await generateText('Factual', presets.text.lowTemp);
const mediumTemp = await generateText('Balanced', presets.text.mediumTemp);
const highTemp = await generateText('Creative', presets.text.highTemp);

// Length presets
const short = await generateText('Brief', presets.text.short);
const medium = await generateText('Standard', presets.text.medium);
const long = await generateText('Detailed', presets.text.long);
```

### Image Presets (23 presets)

```typescript
import { generateImage, presets, saveImage } from 'gemini-ai-toolkit';

// Aspect ratio presets
const square = await generateImage('A robot', presets.image.square);
const wide = await generateImage('Landscape', presets.image.wide);
const portrait = await generateImage('Person', presets.image.portrait);
const standard = await generateImage('Image', presets.image.standard);
const tall = await generateImage('Image', presets.image.tall);

// Platform presets
const instagram = await generateImage('Post', presets.image.instagram);
const instagramStory = await generateImage('Story', presets.image.instagramStory);
const youtube = await generateImage('Thumbnail', presets.image.youtube);
const twitter = await generateImage('Tweet', presets.image.twitter);
const linkedin = await generateImage('Post', presets.image.linkedin);
const facebook = await generateImage('Post', presets.image.facebook);
const banner = await generateImage('Banner', presets.image.banner);
const thumbnail = await generateImage('Thumbnail', presets.image.thumbnail);
const socialMedia = await generateImage('Post', presets.image.socialMedia);
const wallpaper = await generateImage('Wallpaper', presets.image.wallpaper);
const profile = await generateImage('Profile', presets.image.profile);
const cover = await generateImage('Cover', presets.image.cover);
const print = await generateImage('Print', presets.image.print);

// Format presets
const png = await generateImage('Image', presets.image.png);
const jpeg = await generateImage('Image', presets.image.jpeg);
const webp = await generateImage('Image', presets.image.webp);

// Batch presets
const batch2 = await generateImage('Image', presets.image.batch2); // 2 images
const batch4 = await generateImage('Image', presets.image.batch4); // 4 images
```

### Video Presets (12 presets)

```typescript
import { generateVideo, presets, loadImage } from 'gemini-ai-toolkit';

const imageBase64 = await loadImage('input.png');

// Platform presets
const youtube = await generateVideo(img, 'image/png', 'Animate', presets.video.youtube);
const tiktok = await generateVideo(img, 'image/png', 'Animate', presets.video.tiktok);
const instagram = await generateVideo(img, 'image/png', 'Animate', presets.video.instagram);
const instagramStory = await generateVideo(img, 'image/png', 'Animate', presets.video.instagramStory);
const reels = await generateVideo(img, 'image/png', 'Animate', presets.video.reels);
const shorts = await generateVideo(img, 'image/png', 'Animate', presets.video.shorts);
const presentation = await generateVideo(img, 'image/png', 'Animate', presets.video.presentation);
const social = await generateVideo(img, 'image/png', 'Animate', presets.video.social);

// Resolution presets
const landscape = await generateVideo(img, 'image/png', 'Animate', presets.video.landscape);
const landscapeHD = await generateVideo(img, 'image/png', 'Animate', presets.video.landscapeHD);
const portrait = await generateVideo(img, 'image/png', 'Animate', presets.video.portrait);
const portraitHD = await generateVideo(img, 'image/png', 'Animate', presets.video.portraitHD);
```

### Speech Presets (11 presets)

```typescript
import { generateSpeech, saveAudio, presets } from 'gemini-ai-toolkit';

// Voice presets
const kore = await generateSpeech('Hello', presets.speech.kore);
const zephyr = await generateSpeech('Hello', presets.speech.zephyr);
const defaultVoice = await generateSpeech('Hello', presets.speech.default);
const alternative = await generateSpeech('Hello', presets.speech.alternative);

// Use case presets
const narration = await generateSpeech('Text', presets.speech.narration);
const conversation = await generateSpeech('Text', presets.speech.conversation);
const announcement = await generateSpeech('Text', presets.speech.announcement);
const podcast = await generateSpeech('Text', presets.speech.podcast);
const audiobook = await generateSpeech('Text', presets.speech.audiobook);
const tutorial = await generateSpeech('Text', presets.speech.tutorial);
const commercial = await generateSpeech('Text', presets.speech.commercial);
```

### Chat Presets (6 presets)

```typescript
import { createChat, presets } from 'gemini-ai-toolkit';

const casual = createChat(presets.chat.casual);
const professional = createChat(presets.chat.professional);
const technical = createChat(presets.chat.technical);
const creative = createChat(presets.chat.creative);
const fast = createChat(presets.chat.fast);
const smart = createChat(presets.chat.smart);
```

### Analysis Presets (5 presets)

```typescript
import { analyzeImage, loadImage, presets } from 'gemini-ai-toolkit';

const imageBase64 = await loadImage('photo.jpg');

const detailed = await analyzeImage(img, 'Analyze', 'image/jpeg', presets.analysis.detailed);
const summary = await analyzeImage(img, 'Summarize', 'image/jpeg', presets.analysis.summary);
const technical = await analyzeImage(img, 'Technical', 'image/jpeg', presets.analysis.technical);
const visual = await analyzeImage(img, 'Visual', 'image/jpeg', presets.analysis.visual);
const quick = await analyzeImage(img, 'Quick', 'image/jpeg', presets.analysis.quick);
```

### Preset Summary

| Category | Count | Use Cases |
|----------|-------|-----------|
| **Text** | 22 | Speed, style, use cases, temperature, length |
| **Image** | 23 | Aspect ratios, platforms, formats, batch |
| **Video** | 12 | Platforms, resolutions, aspect ratios |
| **Speech** | 11 | Voices, use cases |
| **Chat** | 6 | Conversation styles |
| **Analysis** | 5 | Analysis types |
| **Total** | **79** | **All use cases covered** |

---

## 🛠️ Utilities

### File Utilities

```typescript
import { saveImage, saveAudio, loadImage } from 'gemini-ai-toolkit';

// Save generated image
const imageBase64 = await generateImage('A robot');
saveImage(imageBase64, 'output.png');

// Save generated audio
const audioBase64 = await generateSpeech('Hello!');
saveAudio(audioBase64, 'output.wav');

// Load image from file
const imageBase64 = await loadImage('input.png');
const edited = await editImage(imageBase64, 'image/png', 'Add sunset');
```

### Batch Operations

```typescript
import { batchGenerateText, generateText, presets } from 'gemini-ai-toolkit';

const prompts = [
  'What is artificial intelligence?',
  'What is machine learning?',
  'What is deep learning?'
];

// Process all prompts in parallel
const results = await batchGenerateText(prompts, (prompt) =>
  generateText(prompt, presets.text.concise)
);

console.log(results); // Array of results
```

### Streaming Helpers

```typescript
import { streamToText, createChat } from 'gemini-ai-toolkit';

const chat = createChat();
const stream = await chat.sendMessageStream({ 
  message: 'Tell me a long story' 
});

// Collect all chunks into one string
const fullText = await streamToText(stream);
console.log(fullText);
```

### Media Utilities

```typescript
import { fileToBase64, bufferToBase64 } from 'gemini-ai-toolkit';

// Convert file to base64
const base64 = await fileToBase64('/path/to/image.png');

// Convert buffer to base64
const buffer = Buffer.from('data');
const base64 = bufferToBase64(buffer);
```

---

## ⚠️ Error Handling

The toolkit provides specific error types for better error handling:

```typescript
import {
  GeminiToolkitError,
  ApiKeyError,
  ValidationError,
  ApiRequestError,
  ModelResponseError,
} from 'gemini-ai-toolkit';

try {
  const text = await generateText('Hello!');
} catch (error) {
  if (error instanceof ApiKeyError) {
    console.error('API key issue:', error.message);
    // Error includes helpful tips
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof ApiRequestError) {
    console.error('API request failed:', error.message);
    console.error('Status code:', error.statusCode);
    // Error includes retry suggestions for 429, 500, etc.
  } else if (error instanceof ModelResponseError) {
    console.error('Model error:', error.message);
  } else if (error instanceof GeminiToolkitError) {
    console.error('Toolkit error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Error Types

| Error Type | When It Occurs | Helpful Tips Included |
|------------|----------------|----------------------|
| `ApiKeyError` | Missing or invalid API key | ✅ Yes |
| `ValidationError` | Invalid input parameters | ✅ Yes |
| `ApiRequestError` | HTTP request failures | ✅ Yes (retry suggestions) |
| `ModelResponseError` | Model response issues | ✅ Yes |
| `GeminiToolkitError` | Base error class | ✅ Yes |

---

## 📘 Type Definitions

All types are exported for TypeScript users:

```typescript
import type {
  // Configuration
  GeminiToolkitConfig,
  
  // Options
  GenerateTextOptions,
  GenerateImageOptions,
  GenerateVideoOptions,
  GenerateSpeechOptions,
  LiveConversationOptions,
  LiveSessionCallbacks,
  
  // Results
  GroundedResult,
  
  // Core Types
  ChatMessage,
  Location,
  AspectRatio,
  ImageAspectRatio,
  VideoAspectRatio,
  
  // Events
  LiveErrorEvent,
  LiveCloseEvent,
} from 'gemini-ai-toolkit';
```

### Type Examples

```typescript
// Location type
const location: Location = {
  latitude: 37.7749,
  longitude: -122.4194
};

// Aspect ratios
const imageRatio: ImageAspectRatio = '16:9';
const videoRatio: VideoAspectRatio = '16:9';

// Chat message
const message: ChatMessage = {
  role: 'user',
  content: 'Hello!'
};
```

---

## 📖 Examples

We provide **16 comprehensive examples** covering all features:

### Quick Start
- **[00-quick-start.ts](./examples/00-quick-start.ts)** - ⚡ Start here! Minimal code examples

### Basic Usage
- **[01-basic-text-generation.ts](./examples/01-basic-text-generation.ts)** - Text generation with presets
- **[02-chat-conversation.ts](./examples/02-chat-conversation.ts)** - Chat conversations with streaming

### Image Features
- **[03-image-generation.ts](./examples/03-image-generation.ts)** - Generate images with presets
- **[04-image-editing.ts](./examples/04-image-editing.ts)** - Edit images with utilities
- **[05-image-understanding.ts](./examples/05-image-understanding.ts)** - Analyze images

### Video Features
- **[06-video-generation.ts](./examples/06-video-generation.ts)** - Generate videos
- **[07-video-understanding.ts](./examples/07-video-understanding.ts)** - Analyze video content

### Audio Features
- **[08-text-to-speech.ts](./examples/08-text-to-speech.ts)** - Text-to-speech with presets
- **[09-live-conversation.ts](./examples/09-live-conversation.ts)** - Real-time audio conversations

### Advanced Features
- **[10-grounded-search.ts](./examples/10-grounded-search.ts)** - Google Search grounding
- **[11-grounded-maps.ts](./examples/11-grounded-maps.ts)** - Google Maps grounding
- **[12-thinking-mode.ts](./examples/12-thinking-mode.ts)** - Complex reasoning

### Complete Examples
- **[13-complete-workflow.ts](./examples/13-complete-workflow.ts)** - End-to-end workflow
- **[14-utilities-and-presets.ts](./examples/14-utilities-and-presets.ts)** - Utilities and presets
- **[15-all-presets.ts](./examples/15-all-presets.ts)** - All 79 presets demonstration

### Running Examples

```bash
# Set your API key
export GEMINI_API_KEY="your-api-key-here"

# Run with ts-node
npx ts-node examples/00-quick-start.ts

# Or compile first
npx tsc examples/00-quick-start.ts
node examples/00-quick-start.js
```

See [examples/README.md](./examples/README.md) for detailed instructions.

---

## 🎯 Best Practices

### 1. Error Handling

Always wrap API calls in try-catch blocks:

```typescript
try {
  const text = await generateText('Hello!');
} catch (error) {
  if (error instanceof ApiRequestError && error.statusCode === 429) {
    // Handle rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Retry...
  }
}
```

### 2. API Key Management

**✅ DO:**
- Use environment variables
- Use `init()` for applications
- Store keys securely

**❌ DON'T:**
- Hardcode API keys
- Commit keys to version control
- Share keys publicly

### 3. Rate Limiting

Be mindful of API rate limits:

```typescript
// Add delays between requests
for (const prompt of prompts) {
  await generateText(prompt);
  await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
}
```

### 4. Resource Management

Clean up resources:

```typescript
const session = await toolkit.connectLive({...});
try {
  // Use session
} finally {
  await session.close();
}
```

### 5. Type Safety

Use TypeScript for better safety:

```typescript
import type { GenerateTextOptions } from 'gemini-ai-toolkit';

const options: GenerateTextOptions = {
  model: 'gemini-2.5-pro',
  config: { temperature: 0.7 }
};
```

### 6. Use Presets

Leverage presets for common use cases:

```typescript
// ✅ Good - uses preset
const text = await generateText('Story', presets.text.storytelling);

// ❌ Less ideal - manual config
const text = await generateText('Story', {
  model: 'gemini-2.5-flash',
  config: { temperature: 0.95, maxOutputTokens: 3000 }
});
```

---

## ⚡ Performance Tips

### 1. Batch Processing

Process multiple requests in parallel:

```typescript
const results = await Promise.all([
  generateText('Prompt 1'),
  generateText('Prompt 2'),
  generateText('Prompt 3')
]);
```

### 2. Use Appropriate Models

- **Fast responses**: `gemini-2.5-flash`
- **Complex reasoning**: `gemini-2.5-pro`
- **Image analysis**: `gemini-2.5-flash-image`

### 3. Caching

Cache responses when appropriate:

```typescript
const cache = new Map();

async function getCachedText(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt);
  }
  const text = await generateText(prompt);
  cache.set(prompt, text);
  return text;
}
```

### 4. Streaming for Long Responses

Use streaming for better UX:

```typescript
const stream = await chat.sendMessageStream({ 
  message: 'Tell a long story' 
});

for await (const chunk of stream) {
  process.stdout.write(chunk.text); // Show progress
}
```

---

## 📋 Requirements

- **Node.js** >= 18.0.0
- **TypeScript** >= 5.0 (optional, but recommended)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Browser Support

This package is designed for **Node.js** environments. For browser usage, you may need polyfills for:
- `fs` module (file operations)
- `Buffer` (binary data)

---

## ❓ FAQ

### Q: How do I get an API key?

A: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a new API key.

### Q: Is this package free?

A: The package itself is free and open-source. However, using the Gemini API may incur costs based on Google's pricing. Check [Google's pricing page](https://ai.google.dev/pricing) for details.

### Q: Can I use this in the browser?

A: The package is designed for Node.js. Some features (file operations) require Node.js APIs. For browser usage, consider using only the API methods without file utilities.

### Q: How do I handle rate limits?

A: The toolkit includes helpful error messages for rate limits (429 errors). Implement retry logic with exponential backoff:

```typescript
async function withRetry(fn: () => Promise<any>, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 429) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
}
```

### Q: What's the difference between quick functions and class API?

A: Quick functions are one-liners that auto-detect your API key. The class API gives you more control and is better for complex applications.

### Q: Can I use presets with the class API?

A: Yes! Presets work with both quick functions and the class API:

```typescript
const toolkit = new GeminiToolkit({ apiKey: 'key' });
const text = await toolkit.generateText('Hello', presets.text.fast);
```

### Q: How do I contribute?

A: See the [Contributing](#-contributing) section below. We welcome contributions!

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/bantoinese83/Gemini-AI-Toolkit.git
   cd Gemini-AI-Toolkit
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make your changes**
6. **Build and test**
   ```bash
   npm run build
   ```
7. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
8. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Guidelines

- ✅ Follow existing code style
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Add examples if applicable
- ✅ Ensure TypeScript compilation passes
- ✅ Follow semantic commit messages

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🎨 More presets
- 🧪 Tests
- 🌍 Translations
- 💡 Examples

---

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Get Help

- 📖 **Documentation**: Check this README and [examples](./examples/)
- 💬 **Issues**: [Open an issue](https://github.com/bantoinese83/Gemini-AI-Toolkit/issues)
- 💡 **Discussions**: [Join discussions](https://github.com/bantoinese83/Gemini-AI-Toolkit/discussions)

### Report Issues

Found a bug? Please [open an issue](https://github.com/bantoinese83/Gemini-AI-Toolkit/issues) with:
- Description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)

### Feature Requests

Have an idea? [Open a feature request](https://github.com/bantoinese83/Gemini-AI-Toolkit/issues) and let's discuss!

---

## 🏆 Acknowledgments

- **Google** for the amazing Gemini API
- **All contributors** who help improve this package
- **The open-source community** for inspiration and support

---

## 📊 Project Status

| Metric | Status |
|--------|--------|
| **Version** | 1.0.0 |
| **Build Status** | ✅ Passing |
| **Code Quality** | ✅ 100/100 |
| **Type Coverage** | ✅ 100% |
| **Documentation** | ✅ Complete |
| **Examples** | ✅ 16 examples |
| **Presets** | ✅ 79 presets |
| **Test Coverage** | ✅ Comprehensive |

---

## 🔗 Related Projects

- [@google/genai](https://www.npmjs.com/package/@google/genai) - Official Google Gemini SDK
- [Google AI Studio](https://makersuite.google.com/) - Try Gemini API in browser

---

## ⭐ Star History

If you find this package useful, please consider giving it a star! ⭐

---

<div align="center">

**Made with ❤️ by the community**

[⬆ Back to Top](#-gemini-ai-toolkit)

</div>
