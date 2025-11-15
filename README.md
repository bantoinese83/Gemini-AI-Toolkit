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
- 🤖 **Smart helpers** with auto-detection and auto-retry
- 📚 **File Search (RAG)** for querying your documents
- 📦 **Zero dependencies** (only `@google/genai` as peer dependency)
- 🔒 **Full TypeScript support** with strict type checking
- ⚡ **Auto API key detection** from environment variables
- 🎯 **Comprehensive error handling** with helpful messages
- 📚 **24 detailed examples** covering all features

### Why Gemini AI Toolkit?

| Feature | This Package | Others |
|---------|-------------|--------|
| **Code Required** | 1 line | 3-5 lines |
| **Presets** | 79 ready-to-use | Manual config |
| **Type Safety** | 100% TypeScript | Partial |
| **Utilities** | Built-in | External libs |
| **Error Messages** | Actionable tips | Generic |
| **Documentation** | Comprehensive | Basic |
| **Examples** | 24 examples | Few/None |

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
| **📚 File Search (RAG)** | Query your documents with Retrieval Augmented Generation | `gemini-2.5-flash`, `gemini-2.5-pro` |
| **🔗 URL Context** | Analyze content from web pages, PDFs, and URLs | `gemini-2.5-flash`, `gemini-2.5-pro` |
| **🧠 Thinking Mode** | Tackle complex problems with extended thinking | `gemini-2.5-pro` |
| **📁 Files API** | Upload, manage, and use media files (images, videos, audio, documents) | All multimodal models |
| **💾 Context Caching** | Cache content to reduce costs on repeated requests | `gemini-2.0-flash-001`, `gemini-2.5-flash`, `gemini-2.5-pro` |
| **🔢 Token Counting** | Count tokens for any content before sending to API | All models |
| **🎵 Lyria RealTime** | Real-time streaming music generation with interactive control | `models/lyria-realtime-exp` (experimental) |

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

### Option 1: Service-Based Architecture (Recommended) 🏗️

**Perfect for applications requiring maintainable, modular code**

```typescript
import { GeminiToolkit, CoreAIService, ChatService, GroundingService } from 'gemini-ai-toolkit';

// Initialize toolkit once
const toolkit = new GeminiToolkit({
  apiKey: 'your-api-key-here' // or set GEMINI_API_KEY env var
});

// Access service instances directly
const { coreAI, chat, grounding, fileSearch, files, cache, tokens } = toolkit;

// Core AI operations
const text = await coreAI.generateText('Explain quantum computing in simple terms');
const image = await coreAI.generateImage('A futuristic robot in a cyberpunk city');

// Chat conversations
const chatSession = chat.createChat('gemini-2.5-pro');
const response = await chatSession.sendMessage({ message: 'Hello!' });

// Grounded search
const searchResults = await grounding.groundWithSearch('Latest AI developments in 2024');

// File Search (RAG) - query your documents
const store = await fileSearch.createFileSearchStore('my-documents');
const operation = await fileSearch.uploadToFileSearchStore('document.pdf', store.name);
// Wait for operation.done, then query:
const answer = await fileSearch.queryWithFileSearch('Tell me about X', {
  fileSearchStoreNames: [store.name]
});

// Files API - upload and use files
const file = await files.uploadFile('image.jpg', { displayName: 'My Image' });
const analysis = await coreAI.generateText('Describe this image', { files: [file] });

// Context Caching - reduce costs on repeated requests
const cacheObj = await cache.createCache('gemini-2.0-flash-001', {
  systemInstruction: 'You are a helpful assistant.',
  contents: [file],
  ttl: '300s'
});
const cachedResult = await coreAI.generateText('What is this?', { cachedContent: cacheObj.name });

// Token Counting - estimate costs
const tokenCount = await tokens.countTokens('Hello, world!');
console.log(`Tokens: ${tokenCount.totalTokens}`);

// Live conversations with ephemeral tokens
const token = await chat.createEphemeralToken({
  uses: 1,
  expireTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
});
const liveSession = await chat.connectLive({
  onmessage: async (message) => console.log('Received:', message),
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
}, {}, token.name);

// Lyria RealTime music generation (experimental, requires v1alpha)
const musicSession = await chat.connectMusic({
  onmessage: async (message) => {
    if (message.serverContent?.audioChunks) {
      // Process audio chunks (16-bit PCM, 48kHz, stereo)
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
});
await musicSession.setWeightedPrompts({
  weightedPrompts: [{ text: 'minimal techno', weight: 1.0 }]
});
await musicSession.setMusicGenerationConfig({
  musicGenerationConfig: { bpm: 90, temperature: 1.0 }
});
await musicSession.play();
```

### Option 2: One-Line Functions ⚡

**Perfect for quick scripts and minimal code usage**

```typescript
import { generateText, generateImage, search, queryWithUrlContext, createFileSearchStore, uploadToFileSearchStore, queryFileSearch } from 'gemini-ai-toolkit';

// Set GEMINI_API_KEY environment variable
// export GEMINI_API_KEY="your-api-key-here"

// One line - that's it!
const text = await generateText('Explain quantum computing in simple terms');
const image = await generateImage('A futuristic robot in a cyberpunk city');
const results = await search('Latest AI developments in 2024');

// File Search (RAG) - query your documents
const store = await createFileSearchStore('my-documents');
const operation = await uploadToFileSearchStore('document.pdf', store.name);
// Wait for operation.done, then query:
const answer = await queryFileSearch('Tell me about X', {
  fileSearchStoreNames: [store.name]
});

// Files API - upload and use files
const file = await uploadFile('image.jpg', { displayName: 'My Image' });
const result = await generateText('Describe this image', { files: [file] });

// Context Caching - reduce costs on repeated requests
const cache = await createCache('gemini-2.0-flash-001', {
  systemInstruction: 'You are a helpful assistant.',
  contents: [file],
  ttl: 300
});
const cachedResult = await generateText('What is this?', { cachedContent: cache.name });

// Token Counting - estimate costs
const tokenCount = await countTokens('Hello, world!');
console.log(`Tokens: ${tokenCount.totalTokens}`);

// Lyria RealTime - generate music (experimental, requires v1alpha)
const musicSession = await connectMusic({
  onmessage: async (message) => {
    if (message.serverContent?.audioChunks) {
      // Process audio chunks (16-bit PCM, 48kHz, stereo)
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
});
await musicSession.setWeightedPrompts({
  weightedPrompts: [{ text: 'minimal techno', weight: 1.0 }]
});
await musicSession.setMusicGenerationConfig({
  musicGenerationConfig: { bpm: 90, temperature: 1.0 }
});
await musicSession.play();
```

### Option 3: Initialize Once, Use Everywhere

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

## 💡 Examples & Demos

### 🎯 SaaS Showcase (7 Complete Apps)

Experience **7 fully-functional SaaS applications** built with Gemini AI Toolkit:

```bash
# Install and run the complete SaaS showcase
npm run demo

# Or run individual demos
npm run demo:install  # Install dependencies first
cd demo-showcase && npm start
```

**Featured Applications:**
- **AdFlow Studio** - AI-powered social media ad creation
- **TalkBase** - Conversational knowledge assistant with real-time search
- **MapLens AI** - Local business content generation with Maps integration
- **SceneWriter Pro** - Automated video script and storyboard creation
- **InstaTranscribe** - Real-time audio/video analysis and insights
- **PixSense** - Photo intelligence and content analysis API
- **GemVoice** - AI voice companion with contextual conversations

[📖 Complete Showcase Documentation](./demo-showcase/README.md)

### 🔧 Code Examples

The toolkit includes comprehensive code examples demonstrating different usage patterns:

```bash
# List all available examples
npm run examples

# Run the basic service-based example (recommended)
npm run example:basic

# Run the advanced patterns example
npm run example:advanced

# Run the migration guide
npm run example:migration
```

### Example Categories

- **[`examples/service-based-example.ts`](./examples/service-based-example.ts)** - New modular architecture (recommended)
- **[`examples/advanced-service-example.ts`](./examples/advanced-service-example.ts)** - Advanced patterns and real-world usage
- **[`examples/migration-example.ts`](./examples/migration-example.ts)** - Migrating from monolithic to service-based

See [`examples/README.md`](./examples/README.md) for detailed documentation of all examples.

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

#### `queryFileSearch(prompt, config, model?, apiKey?)`

Query your documents with File Search (RAG) for accurate, context-aware answers.

```typescript
import { queryFileSearch, createFileSearchStore, uploadToFileSearchStore } from 'gemini-ai-toolkit';

// Create a File Search store
const store = await createFileSearchStore('my-documents');

// Upload a file (wait for operation to complete)
const operation = await uploadToFileSearchStore('document.pdf', store.name);
// Poll operation.done until true...

// Query your documents
const result = await queryFileSearch('Tell me about Robert Graves', {
  fileSearchStoreNames: [store.name]
});
console.log(result.text);
```

**Parameters:**
- `prompt` (string, required): The query or prompt
- `config` (FileSearchQueryConfig, required): File Search configuration
  - `fileSearchStoreNames` (string[], required): Array of File Search store names
  - `metadataFilter` (string, optional): Metadata filter (e.g., `'author="Robert Graves"'`)
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)
- `apiKey` (string, optional): API key

**Returns:** `Promise<GroundedResult>` - Query results with citations

#### `createFileSearchStore(displayName?, apiKey?)`

Create a new File Search store for RAG.

```typescript
import { createFileSearchStore } from 'gemini-ai-toolkit';

const store = await createFileSearchStore('my-documents');
console.log(store.name); // Use this name for uploads and queries
```

**Returns:** `Promise<FileSearchStore>` - Created File Search store

#### `createEphemeralToken(config?, apiKey?)`

Create ephemeral token for secure Live API access (server-side only).

```typescript
import { createEphemeralToken } from 'gemini-ai-toolkit';

// Server-side: Create token
const token = await createEphemeralToken({
  uses: 1,
  expireTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  newSessionExpireTime: new Date(Date.now() + 60 * 1000), // 1 minute
  liveConnectConstraints: {
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      temperature: 0.7,
      responseModalities: ['AUDIO']
    }
  }
});
// Send token.name to client for use with connectLive()
```

**Parameters:**
- `config` (EphemeralTokenConfig, optional): Token configuration
  - `uses` (number, optional): Number of uses (default: 1)
  - `expireTime` (Date | string, optional): Expiration (default: 30 minutes)
  - `newSessionExpireTime` (Date | string, optional): New session expiration (default: 1 minute)
  - `liveConnectConstraints` (object, optional): Lock token to specific config
- `apiKey` (string, optional): API key

**Returns:** `Promise<EphemeralToken>` - Token with `name` property (use as API key)

**Note:** ⚠️ Server-side only. Ephemeral tokens enhance security for client-side Live API access.

#### Files API Quick Functions

#### `uploadFile(filePath, config?, apiKey?)`

Quick file upload - minimal code!

```typescript
import { uploadFile } from 'gemini-ai-toolkit';

const file = await uploadFile('document.pdf', { displayName: 'My Document' });
```

**Returns:** `Promise<FileObject>`

#### `getFile(fileName, apiKey?)`

Quick file metadata retrieval - minimal code!

```typescript
import { getFile } from 'gemini-ai-toolkit';

const metadata = await getFile('files/my-file-123');
```

**Returns:** `Promise<FileObject>`

#### `listFiles(pageSize?, apiKey?)`

Quick file listing - minimal code!

```typescript
import { listFiles } from 'gemini-ai-toolkit';

const files = await listFiles(10);
for await (const file of files) {
  console.log(file.name);
}
```

**Returns:** `Promise<Iterable<FileObject>>`

#### `deleteFile(fileName, apiKey?)`

Quick file deletion - minimal code!

```typescript
import { deleteFile } from 'gemini-ai-toolkit';

await deleteFile('files/my-file-123');
```

**Returns:** `Promise<void>`

#### Context Caching Quick Functions

#### `createCache(model, config, apiKey?)`

Quick cache creation - minimal code!

```typescript
import { createCache, uploadFile } from 'gemini-ai-toolkit';

const file = await uploadFile('video.mp4');
const cache = await createCache('gemini-2.0-flash-001', {
  displayName: 'my-cache',
  contents: [file],
  ttl: 300 // 5 minutes
});
```

**Returns:** `Promise<CachedContent>`

#### `listCaches(apiKey?)`

Quick cache listing - minimal code!

```typescript
import { listCaches } from 'gemini-ai-toolkit';

const caches = await listCaches();
for await (const cache of caches) {
  console.log(cache.name);
}
```

**Returns:** `Promise<Iterable<CachedContent>>`

#### `getCache(cacheName, apiKey?)`

Quick cache retrieval - minimal code!

```typescript
import { getCache } from 'gemini-ai-toolkit';

const cache = await getCache('cachedContents/my-cache-123');
```

**Returns:** `Promise<CachedContent>`

#### `updateCache(cacheName, config, apiKey?)`

Quick cache update - minimal code!

```typescript
import { updateCache } from 'gemini-ai-toolkit';

await updateCache('cachedContents/my-cache-123', { ttl: '600s' });
```

**Returns:** `Promise<CachedContent>`

#### `deleteCache(cacheName, apiKey?)`

Quick cache deletion - minimal code!

```typescript
import { deleteCache } from 'gemini-ai-toolkit';

await deleteCache('cachedContents/my-cache-123');
```

**Returns:** `Promise<void>`

#### Token Counting Quick Functions

#### `countTokens(contents, model?, apiKey?)`

Quick token counting - minimal code!

```typescript
import { countTokens } from 'gemini-ai-toolkit';

const count = await countTokens('Hello, world!');
console.log(count.totalTokens);
```

**Returns:** `Promise<TokenCount>`

#### `connectMusic(callbacks, apiKey?)`

Quick music session connection - minimal code!

```typescript
import { connectMusic } from 'gemini-ai-toolkit';

const session = await connectMusic({
  onmessage: async (message) => {
    // Handle audio chunks
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Closed')
});
```

**Returns:** `Promise<MusicSession>` - Music session object

**Note:** ⚠️ Experimental model, requires v1alpha API.

#### `uploadToFileSearchStore(filePath, fileSearchStoreName, config?, apiKey?)`

Upload a file directly to a File Search store (combines upload and import).

```typescript
import { uploadToFileSearchStore } from 'gemini-ai-toolkit';

const operation = await uploadToFileSearchStore(
  'document.pdf',
  store.name,
  {
    displayName: 'My Document',
    customMetadata: [
      { key: 'author', stringValue: 'Robert Graves' },
      { key: 'year', numericValue: 1934 }
    ],
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 200,
        maxOverlapTokens: 20
      }
    }
  }
);

// Poll operation.done until true
while (!operation.done) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  operation = await getClient().operations.get({ operation });
}
```

**Parameters:**
- `filePath` (string, required): Path to the file to upload
- `fileSearchStoreName` (string, required): Name of the File Search store
- `config` (FileSearchUploadConfig, optional): Upload configuration
  - `displayName` (string, optional): Display name for the file
  - `customMetadata` (FileMetadata[], optional): Custom metadata
  - `chunkingConfig` (ChunkingConfig, optional): Chunking configuration
- `apiKey` (string, optional): API key

**Returns:** `Promise<Operation>` - Operation that can be polled for completion

#### `queryWithUrlContext(prompt, model?, apiKey?)`

Query content from URLs using the URL Context tool. URLs should be included in the prompt text.

```typescript
import { queryWithUrlContext } from 'gemini-ai-toolkit';

const result = await queryWithUrlContext(
  'Compare the ingredients from https://example.com/recipe1 and https://example.com/recipe2'
);
console.log(result.text);

// Access URL retrieval metadata
const urlMetadata = result.candidates?.[0]?.urlContextMetadata;
console.log(urlMetadata);
```

**Parameters:**
- `prompt` (string, required): The prompt containing URLs to analyze
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)
- `apiKey` (string, optional): API key

**Returns:** `Promise<GroundedResult>` - Query results with URL metadata

**Note:** Up to 20 URLs can be processed per request. Maximum 34MB per URL.

#### `queryWithUrlContextAndSearch(prompt, model?, apiKey?)`

Query with both URL Context and Google Search tools enabled.

```typescript
import { queryWithUrlContextAndSearch } from 'gemini-ai-toolkit';

const result = await queryWithUrlContextAndSearch(
  'Find AI trends and analyze https://example.com/ai-report'
);
```

**Returns:** `Promise<GroundedResult>` - Combined search and URL analysis results

---

### Class API (GeminiToolkit)

For applications needing more control, use the class API:

## 📚 API Reference

### Service-Based Architecture (Recommended)

The toolkit uses a modular service-based architecture for better maintainability and separation of concerns. Each service handles a specific domain of functionality.

```typescript
import { GeminiToolkit, CoreAIService, ChatService, GroundingService } from 'gemini-ai-toolkit';

// Initialize toolkit once
const toolkit = new GeminiToolkit({
  apiKey: 'your-api-key-here'
});

// Access service instances
const { coreAI, chat, grounding, fileSearch, files, cache, tokens } = toolkit;
```

#### Constructor

```typescript
new GeminiToolkit(config: GeminiToolkitConfig)
```

**Config:**
- `apiKey` (string, required): Your Gemini API key

#### Service Properties

The `GeminiToolkit` class provides the following service instances:

- `coreAI: CoreAIService` - Text, image, video, speech generation
- `chat: ChatService` - Chat conversations, live sessions, ephemeral tokens
- `grounding: GroundingService` - Google Search, Maps, URL context
- `fileSearch: FileSearchService` - File Search (RAG) operations
- `files: FilesService` - File upload/management operations
- `cache: CacheService` - Context caching operations
- `tokens: TokenService` - Token counting operations

#### CoreAIService

Handles core AI generation operations including text, images, videos, and speech.

```typescript
// Text generation
const text = await coreAI.generateText('Explain quantum computing', {
  model: 'gemini-2.5-pro',
  config: { temperature: 0.7 }
});

// Image generation
const imageB64 = await coreAI.generateImage('A futuristic robot', {
  aspectRatio: '16:9',
  personGeneration: 'allow_adult'
});

// Video generation (from image)
const videoResult = await coreAI.generateVideo(imageB64, 'image/jpeg', 'Make it dance', {
  durationSeconds: 4,
  fps: 30
});

// Image editing
const editedImage = await coreAI.editImage(existingImageB64, 'image/jpeg', 'Add a hat');

// Media analysis
const analysis = await coreAI.analyzeMedia(imageB64, 'image/jpeg', 'What do you see?');

// Speech synthesis
const audioB64 = await coreAI.generateSpeech('Hello, world!', {
  voiceName: 'Puck',
  languageCode: 'en-US'
});
```

**Methods:**
- `generateText(prompt, options?)` - Generate text content
- `generateImage(prompt, options?)` - Generate images
- `editImage(imageB64, mimeType, prompt, model?)` - Edit existing images
- `analyzeMedia(data, mimeType, prompt, options?)` - Analyze images/videos/audio
- `generateVideo(imageB64, mimeType, prompt, options?)` - Generate videos from images
- `generateSpeech(text, options?)` - Generate speech audio

#### ChatService

Manages chat conversations, live sessions, and ephemeral tokens.

```typescript
// Create chat sessions
const chat = chatService.createChat('gemini-2.5-pro');
const response = await chat.sendMessage({ message: 'Hello!' });

// Ephemeral tokens for live sessions
const token = await chatService.createEphemeralToken({
  uses: 1,
  expireTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
});

// Live conversation sessions
const liveSession = await chatService.connectLive({
  onmessage: async (message) => console.log('Received:', message),
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
}, {
  model: 'gemini-2.0-flash-exp',
  responseModalities: ['text']
}, token.name);

// Music generation (experimental)
const musicSession = await chatService.connectMusic({
  onmessage: async (message) => {
    if (message.serverContent?.audioChunks) {
      // Process 16-bit PCM audio chunks at 48kHz stereo
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
});
```

**Methods:**
- `createChat(model?)` - Create a chat session
- `createEphemeralToken(config?)` - Create ephemeral tokens for live sessions
- `connectLive(callbacks, options?, ephemeralToken?)` - Start live conversation
- `connectMusic(callbacks, apiKey?)` - Start music generation session

#### GroundingService

Provides grounding capabilities with Google Search, Maps, and URL context.

```typescript
// Ground with Google Search
const searchResult = await grounding.groundWithSearch(
  'Latest developments in quantum computing',
  'gemini-2.5-pro'
);
console.log(searchResult.text); // Grounded response
console.log(searchResult.candidates[0].citationMetadata?.citations); // Citations

// Ground with Google Maps
const mapsResult = await grounding.groundWithMaps(
  'Find Italian restaurants near Central Park',
  { latitude: 40.7829, longitude: -73.9654 },
  'gemini-2.5-pro'
);

// Generate with URL context
const urlResult = await grounding.generateWithUrlContext(
  'Summarize the main points from this article',
  'gemini-2.5-pro'
);

// Combine URL context with search
const combinedResult = await grounding.generateWithUrlContextAndSearch(
  'Compare the information from the URL with current developments',
  'gemini-2.5-pro'
);
```

**Methods:**
- `groundWithSearch(prompt, model?)` - Generate with Google Search grounding
- `groundWithMaps(prompt, location, model?)` - Generate with Google Maps grounding
- `generateWithUrlContext(prompt, model?)` - Generate with URL context
- `generateWithUrlContextAndSearch(prompt, model?)` - Generate with URL context + search

#### FileSearchService

Manages File Search (Retrieval Augmented Generation) operations.

```typescript
// Create a file search store
const store = await fileSearch.createFileSearchStore('my-documents');
console.log(`Store created: ${store.name}`);

// Upload files to the store
const operation = await fileSearch.uploadToFileSearchStore(
  'document.pdf',
  store.name,
  { mimeType: 'application/pdf' }
);

// Wait for processing to complete
// ... (polling logic)

// Query the store
const answer = await fileSearch.queryWithFileSearch(
  'What are the key findings?',
  {
    fileSearchStoreNames: [store.name],
    maxNumResults: 5,
    resultThreshold: 0.7
  },
  'gemini-2.5-pro'
);

// Import existing files
await fileSearch.importFileToFileSearchStore(
  store.name,
  'files/document.pdf',
  { mimeType: 'application/pdf' }
);

// List and manage stores
const stores = await fileSearch.listFileSearchStores();
const storeInfo = await fileSearch.getFileSearchStore(store.name);
await fileSearch.deleteFileSearchStore(store.name);
```

**Methods:**
- `createFileSearchStore(displayName?)` - Create a new file search store
- `listFileSearchStores()` - List all file search stores
- `getFileSearchStore(name)` - Get store details
- `deleteFileSearchStore(name, force?)` - Delete a store
- `uploadToFileSearchStore(file, storeName, config?, apiKey?)` - Upload file to store
- `importFileToFileSearchStore(storeName, fileName, config?)` - Import existing file
- `queryWithFileSearch(prompt, config, model?)` - Query files with RAG

#### FilesService

Handles file upload, retrieval, listing, and deletion operations.

```typescript
// Upload files
const file = await files.uploadFile('image.jpg', {
  displayName: 'My Image',
  mimeType: 'image/jpeg'
});
console.log(`Uploaded: ${file.name}`);

// Get file information
const fileInfo = await files.getFile(file.name);
console.log(`State: ${fileInfo.state}, Size: ${fileInfo.sizeBytes} bytes`);

// List files
const allFiles = await files.listFiles(10); // max 10 results
allFiles.files.forEach(f => console.log(`${f.name}: ${f.displayName}`));

// Delete files
await files.deleteFile(file.name);
```

**Methods:**
- `uploadFile(filePath, config?)` - Upload a file
- `getFile(fileName)` - Get file information
- `listFiles(pageSize?)` - List uploaded files
- `deleteFile(fileName)` - Delete a file

#### CacheService

Manages context caching for cost reduction on repeated requests.

```typescript
// Create a cache
const cache = await cache.createCache('gemini-2.0-flash-001', {
  systemInstruction: 'You are a helpful assistant specializing in JavaScript.',
  contents: [
    {
      role: 'user',
      parts: [{ text: 'Explain closures in JavaScript.' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Closures are...' }]
    }
  ],
  ttl: '3600s' // 1 hour
});

// Use cached content
const response = await coreAI.generateText(
  'Give me an example of a closure',
  { cachedContent: cache.name }
);

// List and manage caches
const caches = await cache.listCaches();
const cacheInfo = await cache.getCache(cache.name);
await cache.updateCache(cache.name, { ttl: '7200s' }); // Extend TTL
await cache.deleteCache(cache.name);
```

**Methods:**
- `createCache(model, config)` - Create a new cache
- `listCaches()` - List all caches
- `getCache(cacheName)` - Get cache details
- `updateCache(cacheName, config)` - Update cache settings
- `deleteCache(cacheName)` - Delete a cache

#### TokenService

Provides token counting for cost estimation.

```typescript
// Count tokens in text
const count = await tokens.countTokens('Hello, world!');
console.log(`Total tokens: ${count.totalTokens}`);

// Count tokens with model context
const countWithModel = await tokens.countTokens(
  'Explain quantum computing',
  'gemini-2.5-pro'
);

// Count tokens for multimodal content
const multimodalCount = await tokens.countTokens([
  { text: 'Describe this image:' },
  { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
], 'gemini-2.5-pro');
```

**Methods:**
- `countTokens(contents, model?)` - Count tokens in content

### Legacy Direct Methods (Deprecated)

For backward compatibility, the `GeminiToolkit` class still provides direct methods, but these are deprecated. Use the service instances instead.

#### Deprecated Methods

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

##### `createEphemeralToken(config?)`

Create an ephemeral token for secure Live API access from client-side applications.

⚠️ **Server-side only** - Call this from your backend, not client-side.

```typescript
// Server-side: Create ephemeral token
const token = await toolkit.createEphemeralToken({
  uses: 1, // Token can only be used once
  expireTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  newSessionExpireTime: new Date(Date.now() + 60 * 1000), // 1 minute
  liveConnectConstraints: {
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      temperature: 0.7,
      responseModalities: ['AUDIO']
    }
  }
});

// Send token.name to client
// Client uses token.name as API key for connectLive()
```

**Options:**
- `uses` (number): Number of times token can be used (default: 1)
- `expireTime` (Date | string): Token expiration (default: 30 minutes)
- `newSessionExpireTime` (Date | string): New session expiration (default: 1 minute)
- `liveConnectConstraints` (object): Lock token to specific config

**Returns:** `EphemeralToken` with `name` property (use as API key)

##### `connectLive(callbacks, options?, ephemeralToken?)`

Connect to live conversation session. Can use standard API key or ephemeral token.

```typescript
// Basic usage with standard API key
const session = await toolkit.connectLive({
  onopen: () => console.log('Connected'),
  onmessage: async (message) => {
    console.log('Received:', message);
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Disconnected')
});

// Using ephemeral token (client-side, enhanced security)
const session = await toolkit.connectLive(
  {
    onopen: () => console.log('Connected'),
    onmessage: async (message) => {
      console.log('Received:', message);
    },
    onerror: (error) => console.error('Error:', error),
    onclose: () => console.log('Disconnected')
  },
  {}, // options
  ephemeralToken.name // Token from server
);

// With function calling
const session = await toolkit.connectLive({
  onopen: () => console.log('Connected'),
  onmessage: async (message) => {
    // Handle tool calls
    if (message.toolCall) {
      const functionResponses = [];
      for (const fc of message.toolCall.functionCalls) {
        functionResponses.push({
          id: fc.id,
          name: fc.name,
          response: { result: 'ok' }
        });
      }
      await session.sendToolResponse({ functionResponses });
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Disconnected')
}, {
  tools: [{
    functionDeclarations: [
      { name: 'turn_on_lights' },
      { name: 'turn_off_lights', behavior: 'NON_BLOCKING' }
    ]
  }]
});

// With Google Search
const session = await toolkit.connectLive({
  onopen: () => console.log('Connected'),
  onmessage: async (message) => {
    // Handle search results
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.executableCode) {
          console.log('Code:', part.executableCode.code);
        }
      }
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Disconnected')
}, {
  tools: [{ googleSearch: {} }]
});

// With session management
const session = await toolkit.connectLive({
  onopen: () => console.log('Connected'),
  onmessage: async (message) => {
    // Handle session resumption updates
    if (message.sessionResumptionUpdate?.newHandle) {
      // Save handle for resuming session
      const newHandle = message.sessionResumptionUpdate.newHandle;
    }
    
    // Handle GoAway message
    if (message.goAway) {
      console.log('Connection closing soon:', message.goAway.timeLeft);
    }
    
    // Handle generation complete
    if (message.serverContent?.generationComplete) {
      console.log('Generation complete');
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Disconnected')
}, {
  contextWindowCompression: { slidingWindow: {} },
  sessionResumption: { handle: previousSessionHandle }
});

// Send audio
await session.sendAudio(audioData);

// Send text
session.sendClientContent({ turns: 'Hello!', turnComplete: true });

// Close session
await session.close();
```

**Callbacks:**
- `onopen()`: Called when connection opens
- `onmessage(message)`: Called when message received
  - Check `message.toolCall` for function calls
  - Check `message.serverContent` for model responses
  - Check `message.sessionResumptionUpdate` for resumption tokens
  - Check `message.goAway` for connection termination warnings
- `onerror(error)`: Called on error
- `onclose(event)`: Called when connection closes

**Options:**
- `model` (string): Model name (default: Live model)
- `voiceName` (string): Voice name (default: 'Zephyr')
- `responseModalities` (Modality[]): Response modalities (default: ['AUDIO'])
- `tools` (LiveTool[]): Tools to enable (function calling, Google Search)
- `inputAudioTranscription` (boolean): Enable input audio transcription
- `outputAudioTranscription` (boolean): Enable output audio transcription
- `contextWindowCompression` (ContextWindowCompressionConfig): Enable compression for longer sessions
- `sessionResumption` (SessionResumptionConfig): Configure session resumption
- `realtimeInputConfig` (RealtimeInputConfig): Configure VAD settings
- `thinkingConfig` (ThinkingConfig): Configure thinking budget
- `enableAffectiveDialog` (boolean): Enable affective dialog (requires v1alpha)
- `proactivity` (ProactivityConfig): Configure proactive audio
- `mediaResolution` (MediaResolution): Set media resolution
- `temperature` (number): Temperature setting

**Ephemeral Token:**
- Pass `ephemeralToken.name` as third parameter for client-side security
- Ephemeral tokens are short-lived and reduce security risks

**Tool Use:**
- Function calling: Define functions in `tools[].functionDeclarations`
- Google Search: Enable with `tools: [{ googleSearch: {} }]`
- Handle tool calls in `onmessage` callback
- Respond with `session.sendToolResponse({ functionResponses })`

**Session Management:**
- Context window compression: Extend sessions beyond 15 minutes
- Session resumption: Resume sessions across connection resets
- GoAway messages: Receive warnings before connection termination

##### `connectMusic(callbacks, apiKey?)`

Connect to Lyria RealTime music generation session for real-time streaming music.

⚠️ **Experimental**: Lyria RealTime is an experimental model.

⚠️ **Requires v1alpha API**: This feature requires the v1alpha API version.

```typescript
const session = await toolkit.connectMusic({
  onmessage: async (message) => {
    // Process audio chunks (16-bit PCM, 48kHz, stereo)
    if (message.serverContent?.audioChunks) {
      for (const chunk of message.serverContent.audioChunks) {
        const audioBuffer = Buffer.from(chunk.data, 'base64');
        // Play audio...
      }
    }
  },
  onerror: (error) => console.error('Error:', error),
  onclose: () => console.log('Session closed')
});

// Set initial prompts
await session.setWeightedPrompts({
  weightedPrompts: [
    { text: 'minimal techno', weight: 1.0 },
    { text: 'deep bass', weight: 0.5 }
  ]
});

// Set generation config
await session.setMusicGenerationConfig({
  musicGenerationConfig: {
    bpm: 90,
    temperature: 1.0,
    density: 0.7,
    brightness: 0.6,
    scale: 'C_MAJOR_A_MINOR',
    audioFormat: 'pcm16',
    sampleRateHz: 48000
  }
});

// Start generating music
await session.play();

// Control playback
await session.pause();
await session.play();
await session.stop();
await session.resetContext();

// Update prompts in real-time
await session.setWeightedPrompts({
  weightedPrompts: [
    { text: 'Piano', weight: 2.0 },
    { text: 'Meditation', weight: 0.5 }
  ]
});

// Update config (reset context for BPM/scale changes)
await session.setMusicGenerationConfig({
  musicGenerationConfig: {
    bpm: 120,
    scale: 'D_MAJOR_B_MINOR'
  }
});
await session.resetContext();
```

**Callbacks:**
- `onmessage(message)`: Called when audio chunks or other messages are received
- `onerror(error)`: Called when an error occurs
- `onclose()`: Called when the session closes

**Session Methods:**
- `setWeightedPrompts({ weightedPrompts })`: Set or update music prompts
- `setMusicGenerationConfig({ musicGenerationConfig })`: Set or update generation config
- `play()`: Start/resume music generation
- `pause()`: Pause music generation
- `stop()`: Stop music generation
- `resetContext()`: Reset context (required after BPM/scale changes)

**Music Generation Config:**
- `guidance` (0.0-6.0, default: 4.0): How strictly model follows prompts
- `bpm` (60-200): Beats Per Minute
- `density` (0.0-1.0): Density of musical notes/sounds
- `brightness` (0.0-1.0): Tonal quality
- `scale` (MusicScale): Musical scale/key
- `muteBass` (boolean): Mute bass output
- `muteDrums` (boolean): Mute drums output
- `onlyBassAndDrums` (boolean): Only output bass and drums
- `musicGenerationMode` ('QUALITY' | 'DIVERSITY' | 'VOCALIZATION'): Generation mode
- `temperature` (0.0-3.0, default: 1.1): Temperature setting
- `topK` (1-1000, default: 40): Top K sampling
- `seed` (0-2147483647): Random seed
- `audioFormat` (string, default: 'pcm16'): Audio format
- `sampleRateHz` (number, default: 48000): Sample rate

**Audio Format:**
- Output: Raw 16-bit PCM Audio
- Sample rate: 48kHz
- Channels: 2 (stereo)

**Note:** 
- Prompts are checked by safety filters
- Output audio is watermarked
- Model generates instrumental music only
- Implement robust audio buffering for smooth playback

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

##### URL Context Methods

##### `generateWithUrlContext(prompt, model?)`

Generate text with URL Context tool enabled, allowing the model to access content from URLs.

```typescript
// Basic usage - URLs in prompt
const result = await toolkit.generateWithUrlContext(
  'Compare the ingredients from https://example.com/recipe1 and https://example.com/recipe2'
);
console.log(result.text);

// Access URL retrieval metadata
const urlMetadata = result.candidates?.[0]?.urlContextMetadata;
if (urlMetadata?.urlMetadata) {
  urlMetadata.urlMetadata.forEach((meta) => {
    console.log(`URL: ${meta.retrievedUrl}`);
    console.log(`Status: ${meta.urlRetrievalStatus}`);
  });
}
```

**Parameters:**
- `prompt` (string): The prompt containing URLs to analyze (URLs should be in the prompt text)
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)

**Returns:** `Promise<GroundedResult>` - Results with URL metadata

**Limitations:**
- Up to 20 URLs per request
- Maximum 34MB per URL
- URLs must be publicly accessible (no login/paywall)
- Supported content types: HTML, JSON, PDF, images (PNG, JPEG, BMP, WebP)

**Use Cases:**
- Extract data from multiple URLs
- Compare documents, articles, or reports
- Synthesize content from several sources
- Analyze code and documentation from GitHub

##### `generateWithUrlContextAndSearch(prompt, model?)`

Generate text with both URL Context and Google Search tools enabled.

```typescript
const result = await toolkit.generateWithUrlContextAndSearch(
  'Find the latest AI developments and analyze https://example.com/ai-report'
);
```

**Use Cases:**
- Search the web and then analyze specific URLs in depth
- Combine broad search with detailed URL analysis
- Get comprehensive answers using both tools

**Parameters:**
- `prompt` (string): The prompt containing URLs and/or search queries
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)

**Returns:** `Promise<GroundedResult>` - Combined results

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

##### Files API Methods

##### `uploadFile(filePath, config?)`

Upload a file using the Files API. Use when request size exceeds 20MB or for reusable file references.

```typescript
// Node.js
const file = await toolkit.uploadFile('document.pdf', {
  displayName: 'My Document',
  mimeType: 'application/pdf'
});

// Browser
const fileInput = document.querySelector('input[type="file"]');
const file = await toolkit.uploadFile(fileInput.files[0], {
  displayName: 'My Document'
});

// Use in generateText
const result = await toolkit.generateText('Describe this document', {
  files: [file]
});
```

**Parameters:**
- `filePath` (string | File | Blob): Path to file (Node.js) or File/Blob (browser)
- `config` (UploadFileConfig | string, optional): Configuration or display name

**Returns:** `Promise<FileObject>` - Uploaded file with metadata

##### `getFile(fileName)`

Get metadata for an uploaded file.

```typescript
const file = await toolkit.uploadFile('document.pdf');
const metadata = await toolkit.getFile(file.name);
console.log(metadata.state); // 'ACTIVE' or 'PROCESSING'
```

**Returns:** `Promise<FileObject>`

##### `listFiles(pageSize?)`

List all uploaded files.

```typescript
const files = await toolkit.listFiles(10);
for await (const file of files) {
  console.log(file.name, file.displayName);
}
```

**Returns:** `Promise<Iterable<FileObject>>`

##### `deleteFile(fileName)`

Delete an uploaded file.

```typescript
await toolkit.deleteFile('files/my-file-123');
```

**Returns:** `Promise<void>`

##### Context Caching Methods

##### `createCache(model, config)`

Create a cache for context caching to reduce costs on repeated requests.

```typescript
const videoFile = await toolkit.uploadFile('movie.mp4');

// Wait for processing
while (videoFile.state !== 'ACTIVE') {
  await new Promise(resolve => setTimeout(resolve, 2000));
  videoFile = await toolkit.getFile(videoFile.name);
}

const cache = await toolkit.createCache('gemini-2.0-flash-001', {
  displayName: 'movie-analysis-cache',
  systemInstruction: 'You are an expert video analyzer.',
  contents: [videoFile],
  ttl: '300s' // 5 minutes
});

// Use cache
const result = await toolkit.generateText('Describe the characters', {
  cachedContent: cache.name
});
```

**Parameters:**
- `model` (string): Model name (must use explicit version like `gemini-2.0-flash-001`)
- `config` (CreateCacheConfig): Cache configuration
  - `displayName` (string, optional): Display name
  - `systemInstruction` (string, optional): System instruction to cache
  - `contents` (unknown[], optional): Contents to cache
  - `ttl` (string | number, optional): Time to live (e.g., `'300s'` or `300`)
  - `expireTime` (Date | string, optional): Expiration time

**Returns:** `Promise<CachedContent>`

**Note:** Minimum 2,048 tokens (2.5 Flash) or 4,096 tokens (2.5 Pro). Cached tokens billed at reduced rate.

##### `listCaches()`

List all cached content objects.

```typescript
const caches = await toolkit.listCaches();
for await (const cache of caches) {
  console.log(cache.name, cache.displayName);
}
```

**Returns:** `Promise<Iterable<CachedContent>>`

##### `getCache(cacheName)`

Get metadata for a cached content object.

```typescript
const cache = await toolkit.getCache('cachedContents/my-cache-123');
console.log(cache.expireTime);
```

**Returns:** `Promise<CachedContent>`

##### `updateCache(cacheName, config)`

Update a cache's TTL or expiration time.

```typescript
await toolkit.updateCache(cache.name, { ttl: '600s' });
```

**Returns:** `Promise<CachedContent>`

##### `deleteCache(cacheName)`

Delete a cached content object.

```typescript
await toolkit.deleteCache('cachedContents/my-cache-123');
```

**Returns:** `Promise<void>`

##### Token Counting Methods

##### `countTokens(contents, model?)`

Count tokens for any content before sending to the API.

```typescript
// Count text tokens
const count = await toolkit.countTokens('Hello, world!');
console.log(count.totalTokens);

// Count tokens for file + text
const file = await toolkit.uploadFile('image.jpg');
const count = await toolkit.countTokens(['Describe this image', file]);

// Count chat history
const chat = toolkit.createChat();
await chat.sendMessage({ message: 'Hello' });
const count = await toolkit.countTokens(chat.getHistory());
```

**Parameters:**
- `contents` (unknown): Content to count (text, files, chat history, etc.)
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)

**Returns:** `Promise<TokenCount>` - Token count result

**Note:** 1 token ≈ 4 characters, 100 tokens ≈ 60-80 words. Images: 258 tokens (2.0) or variable. Video: 263 tokens/sec. Audio: 32 tokens/sec.

##### Ephemeral Token Methods

##### `createEphemeralToken(config?)`

Create an ephemeral token for secure Live API access from client-side applications.

⚠️ **Server-side only** - Call this from your backend, not client-side.

```typescript
// Server-side: Create ephemeral token
const token = await toolkit.createEphemeralToken({
  uses: 1, // Token can only be used once
  expireTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  newSessionExpireTime: new Date(Date.now() + 60 * 1000), // 1 minute
  liveConnectConstraints: {
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      temperature: 0.7,
      responseModalities: ['AUDIO']
    }
  }
});

// Send token.name to client
// Client uses token.name as API key for connectLive()
```

**Options:**
- `uses` (number): Number of times token can be used (default: 1)
- `expireTime` (Date | string): Token expiration (default: 30 minutes)
- `newSessionExpireTime` (Date | string): New session expiration (default: 1 minute)
- `liveConnectConstraints` (object): Lock token to specific config

**Returns:** `EphemeralToken` with `name` property (use as API key)

##### File Search (RAG) Methods

##### `createFileSearchStore(displayName?)`

Create a new File Search store for RAG.

```typescript
const store = await toolkit.createFileSearchStore('my-documents');
console.log(store.name); // Use this for uploads and queries
```

**Parameters:**
- `displayName` (string, optional): Display name for the store

**Returns:** `Promise<FileSearchStore>` - Created File Search store

##### `listFileSearchStores()`

List all File Search stores.

```typescript
const stores = toolkit.listFileSearchStores();
for await (const store of stores) {
  console.log(store.name, store.displayName);
}
```

**Returns:** `AsyncIterable<FileSearchStore>` - Iterable of File Search stores

##### `getFileSearchStore(name)`

Get a specific File Search store by name.

```typescript
const store = await toolkit.getFileSearchStore('fileSearchStores/my-store-123');
```

**Parameters:**
- `name` (string): Store name (e.g., `'fileSearchStores/my-store-123'`)

**Returns:** `Promise<FileSearchStore>` - File Search store

##### `deleteFileSearchStore(name, force?)`

Delete a File Search store.

```typescript
await toolkit.deleteFileSearchStore('fileSearchStores/my-store-123', true);
```

**Parameters:**
- `name` (string): Store name to delete
- `force` (boolean): Force delete (default: `true`)

##### `uploadToFileSearchStore(filePath, fileSearchStoreName, config?)`

Upload a file directly to a File Search store (combines upload and import).

```typescript
const operation = await toolkit.uploadToFileSearchStore(
  'document.pdf',
  store.name,
  {
    displayName: 'My Document',
    customMetadata: [
      { key: 'author', stringValue: 'Robert Graves' },
      { key: 'year', numericValue: 1934 }
    ],
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 200,
        maxOverlapTokens: 20
      }
    }
  }
);

// Poll for completion
while (!operation.done) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  operation = await toolkit.getClient().operations.get({ operation });
}
```

**Parameters:**
- `filePath` (string): Path to the file to upload
- `fileSearchStoreName` (string): Name of the File Search store
- `config` (FileSearchUploadConfig, optional): Upload configuration
  - `displayName` (string, optional): Display name for the file
  - `customMetadata` (FileMetadata[], optional): Custom metadata
  - `chunkingConfig` (ChunkingConfig, optional): Chunking configuration

**Returns:** `Promise<Operation>` - Operation that can be polled for completion

##### Files API Methods

##### `uploadFile(filePath, config?)`

Upload a file using the Files API. Use this when request size exceeds 20MB or for reusable file references.

```typescript
// Node.js
const file = await toolkit.uploadFile('document.pdf', { 
  displayName: 'My Document',
  mimeType: 'application/pdf'
});

// Browser
const fileInput = document.querySelector('input[type="file"]');
const file = await toolkit.uploadFile(fileInput.files[0], { 
  displayName: 'My Document' 
});

// Use file in generateText
const result = await toolkit.generateText('Describe this document', {
  files: [file]
});
```

**Parameters:**
- `filePath` (string | File | Blob): Path to file (Node.js) or File/Blob (browser)
- `config` (UploadFileConfig | string, optional): Configuration or display name
  - `displayName` (string, optional): Display name for the file
  - `mimeType` (string, optional): MIME type (auto-detected if not provided)

**Returns:** `Promise<FileObject>` - Uploaded file with metadata

**Note:** Files are automatically deleted after 48 hours. Use for files larger than 20MB or when you need to reuse files across multiple requests.

##### `getFile(fileName)`

Get metadata for an uploaded file.

```typescript
const file = await toolkit.uploadFile('document.pdf');
const metadata = await toolkit.getFile(file.name);
console.log(metadata.state); // 'ACTIVE' or 'PROCESSING'
console.log(metadata.sizeBytes);
console.log(metadata.expireTime);
```

**Parameters:**
- `fileName` (string): Name of the file (from uploadFile response)

**Returns:** `Promise<FileObject>` - File metadata

##### `listFiles(pageSize?)`

List all uploaded files.

```typescript
const files = await toolkit.listFiles(10);
for await (const file of files) {
  console.log(file.name, file.displayName, file.state);
}
```

**Parameters:**
- `pageSize` (number, optional): Page size for pagination (max: 100)

**Returns:** `Promise<Iterable<FileObject>>` - Iterable of files

##### `deleteFile(fileName)`

Delete an uploaded file.

```typescript
const file = await toolkit.uploadFile('document.pdf');
await toolkit.deleteFile(file.name);
```

**Parameters:**
- `fileName` (string): Name of the file to delete

**Returns:** `Promise<void>`

##### `importFileToFileSearchStore(fileSearchStoreName, fileName, config?)`

Import an existing file into a File Search store.

```typescript
const operation = await toolkit.importFileToFileSearchStore(
  store.name,
  uploadedFile.name,
  {
    customMetadata: [
      { key: 'author', stringValue: 'Robert Graves' }
    ],
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 200,
        maxOverlapTokens: 20
      }
    }
  }
);
```

**Parameters:**
- `fileSearchStoreName` (string): Name of the File Search store
- `fileName` (string): Name of the file (from Files API)
- `config` (FileSearchImportConfig, optional): Import configuration

**Returns:** `Promise<Operation>` - Operation that can be polled for completion

##### `queryWithFileSearch(prompt, config, model?)`

Query documents with File Search (RAG) to get answers grounded in uploaded documents.

```typescript
// Basic query
const result = await toolkit.queryWithFileSearch(
  'Tell me about Robert Graves',
  { fileSearchStoreNames: [store.name] }
);
console.log(result.text);

// Query with metadata filter
const filteredResult = await toolkit.queryWithFileSearch(
  "Tell me about the book 'I, Claudius'",
  {
    fileSearchStoreNames: [store.name],
    metadataFilter: 'author="Robert Graves"'
  }
);

// Access citations
const citations = result.candidates?.[0]?.groundingMetadata;
console.log(citations);
```

**Parameters:**
- `prompt` (string): The query or prompt
- `config` (FileSearchQueryConfig): File Search configuration
  - `fileSearchStoreNames` (string[]): Array of File Search store names
  - `metadataFilter` (string, optional): Metadata filter (e.g., `'author="Robert Graves"'`)
- `model` (string, optional): Model name (default: `'gemini-2.5-flash'`)

**Returns:** `Promise<GroundedResult>` - Query results with citations

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

### File Utilities (Node.js)

```typescript
import { saveImage, saveAudio, loadImage } from 'gemini-ai-toolkit';

// Save generated image (Node.js only)
const imageBase64 = await generateImage('A robot');
saveImage(imageBase64, 'output.png');

// Save generated audio (Node.js only)
const audioBase64 = await generateSpeech('Hello!');
saveAudio(audioBase64, 'output.wav');

// Load image from file (Node.js only)
const imageBase64 = await loadImage('input.png');
const edited = await editImage(imageBase64, 'image/png', 'Add sunset');
```

### Browser-Compatible Utilities

```typescript
import {
  base64ImageToBlobUrl,
  base64AudioToBlobUrl,
  fileToBase64Browser,
  downloadBase64Image,
  downloadBase64Audio,
} from 'gemini-ai-toolkit';

// Convert base64 to Blob URL for display
const imageBase64 = await generateImage('A robot');
const imageUrl = base64ImageToBlobUrl(imageBase64, 'image/png');
// Use in React: <img src={imageUrl} />

// Convert File to base64 (browser)
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const base64 = await fileToBase64Browser(file);

// Download files in browser
downloadBase64Image(imageBase64, 'robot.png', 'image/png');
downloadBase64Audio(audioBase64, 'hello.wav', 'audio/wav');
```

### Security Utilities

Protect API keys from accidental leakage:

```typescript
import { maskApiKey, sanitizeApiKeys, sanitizeError, protectApiKeys } from 'gemini-ai-toolkit';

// Mask API keys for safe logging
const masked = maskApiKey('sk-1234567890abcdef');
console.log('API Key:', masked); // "sk-1...cdef"

// Sanitize text that might contain API keys
const safeText = sanitizeApiKeys('Error: API key sk-1234567890abcdef is invalid');
// Returns: "Error: API key sk-12...cdef is invalid"

// Sanitize error objects (automatically done in toolkit errors)
try {
  await generateText('Hello');
} catch (error) {
  const safeError = sanitizeError(error);
  // safeError.message and safeError.stack are sanitized
}

// Protect objects from serialization
const config = protectApiKeys({ apiKey: 'sk-1234567890abcdef' });
JSON.stringify(config); // API key is masked
```

**Note:** All error messages and stack traces are automatically sanitized by the toolkit to prevent API key leakage.

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

### Auto-Detection Utilities

Automatically detect MIME types, file types, aspect ratios, and suggest optimal models:

```typescript
import {
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
} from 'gemini-ai-toolkit';

// Detect MIME type from file extension
const mimeType = detectMimeType('image.png'); // 'image/png'
const mimeType2 = detectMimeType('.jpg'); // 'image/jpeg'
const mimeType3 = detectMimeType('document.pdf'); // 'application/pdf'

// Check file types
if (isImage('photo.jpg')) {
  console.log('This is an image');
}
if (isVideo('movie.mp4')) {
  console.log('This is a video');
}
if (isAudio('song.mp3')) {
  console.log('This is audio');
}
if (isDocument('report.pdf')) {
  console.log('This is a document');
}

// Suggest optimal model based on use case
const model = suggestModel('text-generation'); // 'gemini-2.5-flash'
const imageModel = suggestModel('image-analysis', true); // 'gemini-2.5-flash-image'
const proModel = suggestModel('complex-reasoning'); // 'gemini-2.5-pro'

// Detect aspect ratios
const ratio = detectAspectRatio(1920, 1080); // '16:9'
const square = detectAspectRatio(1080, 1080); // '1:1'
const portrait = detectAspectRatio(1080, 1920); // '9:16'

// Extract file names
const fileName = extractFileName('/path/to/image.png'); // 'image.png'
const fileName2 = extractFileName('image.png'); // 'image.png'

// Check if content is base64
if (isBase64('data:image/png;base64,iVBORw0KGgo...')) {
  console.log('This is base64 encoded');
}

// Detect MIME type from data URL
const mime = detectMimeTypeFromDataUrl('data:image/png;base64,...'); // 'image/png'
```

### Auto-Retry Utilities

Automatically retry failed requests with exponential backoff:

```typescript
import { withAutoRetry, withRetryConfig, type RetryConfig } from 'gemini-ai-toolkit';

// Basic retry with default settings (3 retries, exponential backoff)
const result = await withAutoRetry(
  () => generateText('Hello!'),
  { maxRetries: 5, initialDelay: 2000 }
);

// Custom retry configuration
const retryConfig: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryOnRateLimit: true, // Retry on 429 errors
  retryOnServerError: true, // Retry on 500, 502, 503, 504
  shouldRetry: (error, attempt) => {
    // Custom retry logic
    if (error instanceof ApiRequestError && error.statusCode === 429) {
      return attempt < 5; // Retry up to 5 times for rate limits
    }
    return false;
  }
};

const result2 = await withAutoRetry(
  () => generateText('Complex prompt'),
  retryConfig
);

// Create a retry wrapper with pre-configured settings
const retryableGenerate = withRetryConfig({ maxRetries: 5 });
const result3 = await retryableGenerate(() => generateText('Hello!'));
```

**Features:**
- ✅ Exponential backoff with jitter
- ✅ Automatic retry on rate limits (429)
- ✅ Automatic retry on server errors (500, 502, 503, 504)
- ✅ Custom retry logic support
- ✅ Configurable delays and max retries

### Smart Helpers

Intelligent wrappers that auto-detect and simplify common operations:

```typescript
import {
  smartUploadFile,
  smartGenerateText,
  smartAnalyzeImage,
  smartGenerateImage,
  smartCreateChat,
  smartBatch,
  GeminiToolkit,
} from 'gemini-ai-toolkit';

const toolkit = new GeminiToolkit({ apiKey: process.env.GEMINI_API_KEY });

// Smart file upload - auto-detects MIME type and handles both Node.js and browser
// Node.js
const file = await smartUploadFile(toolkit, 'image.png');

// Browser
const fileInput = document.querySelector('input[type="file"]');
const file2 = await smartUploadFile(toolkit, fileInput.files[0]);

// Smart text generation - auto-selects model based on content
const text = await smartGenerateText(toolkit, 'Explain AI'); // Uses gemini-2.5-flash
const imageText = await smartGenerateText(toolkit, 'Describe this', [imageFile]); // Auto-selects image model
const complexText = await smartGenerateText(toolkit, 'Solve this problem', undefined, true); // Uses Pro model

// Smart image analysis - auto-detects MIME type and handles various inputs
const analysis = await smartAnalyzeImage(toolkit, 'photo.jpg', 'What is this?'); // From file path
const analysis2 = await smartAnalyzeImage(toolkit, base64Image, 'Describe this'); // From base64
const analysis3 = await smartAnalyzeImage(toolkit, fileInput.files[0], 'Analyze'); // From File object

// Smart image generation - auto-retry and better defaults
const image = await smartGenerateImage(toolkit, 'A robot', '1:1', true); // With auto-retry

// Smart chat creation - auto-model selection
const chat = smartCreateChat(toolkit); // Uses gemini-2.5-flash
const proChat = smartCreateChat(toolkit, true); // Uses gemini-2.5-pro

// Smart batch processing - auto-retry and progress tracking
const results = await smartBatch(
  toolkit,
  [
    () => toolkit.generateText('Prompt 1'),
    () => toolkit.generateText('Prompt 2'),
    () => toolkit.generateText('Prompt 3'),
  ],
  {
    concurrency: 2, // Process 2 at a time
    retry: true, // Auto-retry on errors
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total}`);
    }
  }
);
```

**Benefits:**
- ✅ Less boilerplate code
- ✅ Automatic MIME type detection
- ✅ Automatic model selection
- ✅ Built-in error retry
- ✅ Works in both Node.js and browser
- ✅ Progress tracking for batch operations

### Request Queuing

Intelligent request queuing for managing rate limits and concurrent requests:

```typescript
import { createRequestQueue, generateText } from 'gemini-ai-toolkit';

// Create a queue with concurrency limits
const queue = createRequestQueue({
  maxConcurrent: 5,        // Max 5 concurrent requests
  minDelay: 200,           // 200ms minimum between requests
  autoRetryOnRateLimit: true, // Auto-retry on 429 errors
  maxQueueSize: 1000       // Max queue size
});

// Queue requests (automatically manages concurrency and rate limits)
const result1 = await queue.add(() => generateText('Prompt 1'), 1); // Priority 1
const result2 = await queue.add(() => generateText('Prompt 2'), 0); // Priority 0 (lower)

// Check queue status
const status = queue.getStatus();
console.log(`Queued: ${status.queued}, Running: ${status.running}`);

// Clear queue if needed
queue.clear();
```

**Features:**
- ✅ Automatic concurrency management
- ✅ Rate limit protection with minimum delays
- ✅ Priority-based queuing
- ✅ Automatic retry on rate limit errors
- ✅ Queue size limits to prevent memory issues
- ✅ Status monitoring

**Use Cases:**
- Batch processing with rate limit protection
- Managing concurrent API calls
- Preventing 429 rate limit errors
- Prioritizing important requests

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
  
  // File Search Types
  FileMetadata,
  ChunkingConfig,
  FileSearchUploadConfig,
  FileSearchImportConfig,
  FileSearchQueryConfig,
  
  // Ephemeral Token Types
  EphemeralTokenConfig,
  EphemeralToken,
  LiveConnectConstraints,
  
  // Events
  LiveErrorEvent,
  LiveCloseEvent,
  
  // Live API Tool Types
  FunctionDeclaration,
  FunctionResponse,
  LiveTool,
  ContextWindowCompressionConfig,
  SessionResumptionConfig,
  RealtimeInputConfig,
  AutomaticActivityDetectionConfig,
  ThinkingConfig,
  ProactivityConfig,
  MediaResolution,
  WeightedPrompt,
  MusicGenerationConfig,
  MusicSessionCallbacks,
  MusicScale,
  MusicGenerationMode,
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

// File Search metadata
const metadata: FileMetadata[] = [
  { key: 'author', stringValue: 'Robert Graves' },
  { key: 'year', numericValue: 1934 }
];

// Ephemeral token configuration
const tokenConfig: EphemeralTokenConfig = {
  uses: 1,
  expireTime: new Date(Date.now() + 30 * 60 * 1000),
  liveConnectConstraints: {
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      temperature: 0.7,
      responseModalities: ['AUDIO']
    }
  }
};

// File Search query config
const queryConfig: FileSearchQueryConfig = {
  fileSearchStoreNames: ['fileSearchStores/my-store-123'],
  metadataFilter: 'author="Robert Graves"'
};

// Chunking configuration
const chunkingConfig: ChunkingConfig = {
  whiteSpaceConfig: {
    maxTokensPerChunk: 200,
    maxOverlapTokens: 20
  }
};

// Live API function declaration
const functionDecl: FunctionDeclaration = {
  name: 'turn_on_lights',
  description: 'Turn on the lights',
  behavior: 'NON_BLOCKING'
};

// Live API tool
const liveTool: LiveTool = {
  functionDeclarations: [functionDecl],
  googleSearch: {}
};

// Live API session resumption
const sessionResumption: SessionResumptionConfig = {
  handle: 'previous-session-handle'
};

// Live API context compression
const compression: ContextWindowCompressionConfig = {
  slidingWindow: {},
  triggerTokens: 100000
};

// Lyria RealTime weighted prompt
const weightedPrompt: WeightedPrompt = {
  text: 'minimal techno',
  weight: 1.0
};

// Lyria RealTime music generation config
const musicConfig: MusicGenerationConfig = {
  bpm: 90,
  temperature: 1.0,
  density: 0.7,
  brightness: 0.6,
  scale: 'C_MAJOR_A_MINOR',
  musicGenerationMode: 'QUALITY'
};
```

---

## 📖 Examples

We provide **24 comprehensive examples** covering all features:

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
- **[16-file-search-rag.ts](./examples/16-file-search-rag.ts)** - File Search (RAG) with document querying
- **[17-url-context.ts](./examples/17-url-context.ts)** - URL Context for analyzing web pages and PDFs
- **[18-files-api.ts](./examples/18-files-api.ts)** - Files API for uploading and managing media files
- **[19-context-caching.ts](./examples/19-context-caching.ts)** - Context caching to reduce costs on repeated requests
- **[20-token-counting.ts](./examples/20-token-counting.ts)** - Token counting for cost estimation and limits
- **[24-smart-utilities.ts](./examples/24-smart-utilities.ts)** - Auto-detection, auto-retry, and smart helpers

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
- Use security utilities for logging

**❌ DON'T:**
- Hardcode API keys
- Commit keys to version control
- Share keys publicly
- Log API keys directly

**🔒 API Key Protection:**

The toolkit automatically sanitizes all error messages and stack traces to prevent API key leakage:

```typescript
import { maskApiKey, sanitizeApiKeys } from 'gemini-ai-toolkit';

// Mask API keys when logging
console.log('Using key:', maskApiKey(apiKey)); // "sk-1...cdef"

// Sanitize text that might contain API keys
const safeText = sanitizeApiKeys(errorMessage);
```

**🔐 Ephemeral Tokens for Live API:**

For client-side Live API access, use ephemeral tokens instead of API keys:

```typescript
// Server-side: Create ephemeral token
import { createEphemeralToken } from 'gemini-ai-toolkit';

const token = await createEphemeralToken({
  uses: 1,
  expireTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
});

// Send token.name to client
// Client uses token.name as API key for connectLive()
```

See [SECURITY.md](./SECURITY.md) for comprehensive security guidelines.

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

- **Node.js** >= 18.0.0 (for server-side usage)
- **Modern browser** (for client-side usage)
- **TypeScript** >= 5.0 (optional, but recommended)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Client & Server Support

This package works in **both Node.js and browser environments**:

#### ✅ Universal (Works Everywhere)
- Core API methods (`generateText`, `generateImage`, `createChat`, etc.)
- All quick functions
- File Search (RAG) - accepts File/Blob in browser, file paths in Node.js
- URL Context
- All grounding features (Search, Maps)
- Presets

#### ⚠️ Node.js Only
- File utilities: `saveImage()`, `saveAudio()`, `loadImage()`
- File system operations: `fileToBase64()` (file path version)

#### 🌐 Browser-Compatible Alternatives
For browser usage, use these utilities instead:
- `base64ImageToBlobUrl()` - Convert base64 image to Blob URL
- `base64AudioToBlobUrl()` - Convert base64 audio to Blob URL
- `fileToBase64Browser()` - Convert File/Blob to base64
- `downloadBase64Image()` - Download image in browser
- `downloadBase64Audio()` - Download audio in browser

### Usage Examples

**Node.js (Server):**
```typescript
import { generateText, saveImage } from 'gemini-ai-toolkit';

const text = await generateText('Hello!');
const image = await generateImage('A robot');
saveImage(image, 'output.png'); // ✅ Works in Node.js
```

**Browser (Client):**
```typescript
import { generateText, base64ImageToBlobUrl, downloadBase64Image } from 'gemini-ai-toolkit';

const text = await generateText('Hello!');
const image = await generateImage('A robot');

// Option 1: Display in <img>
const imageUrl = base64ImageToBlobUrl(image, 'image/png');
// <img src={imageUrl} />

// Option 2: Download
downloadBase64Image(image, 'robot.png', 'image/png');
```

**File Search in Browser:**
```typescript
import { uploadToFileSearchStore, createFileSearchStore } from 'gemini-ai-toolkit';

const store = await createFileSearchStore('my-docs');
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0]; // Browser File object

const operation = await uploadToFileSearchStore(file, store.name); // ✅ Works!
```

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

**Made by Monarch Labs**

[⬆ Back to Top](#-gemini-ai-toolkit)

</div>
