# Gemini AI Toolkit Examples

This directory contains comprehensive examples demonstrating how to use the Gemini AI Toolkit effectively. The examples showcase both the legacy monolithic approach and the new service-based architecture.

## 📁 Example Overview

### Core Examples

#### [`service-based-example.ts`](./service-based-example.ts)
**Recommended starting point** - Shows the new modular service-based architecture.

- ✅ **Core AI operations**: Text, image, video, speech generation
- ✅ **Chat conversations**: Interactive chat sessions
- ✅ **Grounding features**: Google Search, Maps, URL context
- ✅ **File management**: Upload, list, and manage files
- ✅ **Context caching**: Cost-effective repeated queries
- ✅ **Token counting**: Estimate API costs

#### [`advanced-service-example.ts`](./advanced-service-example.ts)
**Comprehensive showcase** - Demonstrates advanced patterns and real-world usage.

- 🤔 **Thinking-enabled generation**: Step-by-step reasoning
- 🖼️ **Multimodal analysis**: Image and media understanding
- 🌐 **Advanced grounding**: Combined search and location queries
- 📚 **File Search (RAG)**: Document querying with retrieval augmentation
- 💾 **Context caching**: Efficient repeated interactions
- 🔢 **Token optimization**: Cost management strategies
- 🎯 **Live conversation setup**: Real-time interactions

#### [`migration-example.ts`](./migration-example.ts)
**Transition guide** - Learn how to migrate from monolithic to service-based architecture.

- 📦 **Old vs. new approaches**: Side-by-side comparison
- 🔄 **Migration strategies**: Gradual, injection, and wrapper patterns
- 🔙 **Backward compatibility**: Understanding deprecation timeline
- 🧪 **Testing migration**: Ensuring functionality preservation

### Specialized Examples

#### [`quick-functions-example.ts`](./quick-functions-example.ts)
**One-line functions** - Perfect for scripts and quick prototyping.

```typescript
import { generateText, generateImage, search } from 'gemini-ai-toolkit';

const text = await generateText('Hello, world!');
const image = await generateImage('A sunset over mountains');
const results = await search('Latest AI developments');
```

#### [`live-conversation-example.ts`](./live-conversation-example.ts)
**Real-time interactions** - WebSocket-based live conversations.

- 🎤 **Voice conversations**: Real-time speech
- 🎵 **Music generation**: AI-powered music creation
- 🔄 **Ephemeral tokens**: Secure temporary sessions

#### [`file-search-rag-example.ts`](./file-search-rag-example.ts)
**Document intelligence** - Query your documents with AI.

- 📤 **Document upload**: PDF, text, and media files
- 🔍 **Intelligent querying**: Natural language document search
- 📊 **Metadata management**: File organization and retrieval

#### [`context-caching-example.ts`](./context-caching-example.ts)
**Cost optimization** - Reduce API costs with intelligent caching.

- 💰 **Cost reduction**: Up to 90% savings on repeated queries
- 🧠 **Context preservation**: Maintain conversation state
- ⏰ **TTL management**: Automatic cache expiration

#### [`error-handling-example.ts`](./error-handling-example.ts)
**Robust applications** - Comprehensive error handling patterns.

- 🚨 **Custom error types**: Specific error handling
- 🔄 **Automatic retry**: Built-in resilience
- 🛡️ **Security**: API key protection and sanitization

## 🚀 Quick Start

### Prerequisites

```bash
# Install dependencies
npm install gemini-ai-toolkit

# Set your API key
export GEMINI_API_KEY="your-api-key-here"
```

### Running Examples

```bash
# Run the basic service-based example
npx ts-node examples/service-based-example.ts

# Run the advanced example
npx ts-node examples/advanced-service-example.ts

# Run the migration guide
npx ts-node examples/migration-example.ts
```

## 🏗️ Architecture Comparison

### Legacy Monolithic Approach (Deprecated)
```typescript
const toolkit = new GeminiToolkit({ apiKey });

await toolkit.generateText('Hello');        // Direct method call
await toolkit.createChat();                 // Direct method call
await toolkit.groundWithSearch('query');    // Direct method call
```

**Issues:**
- Large class with many responsibilities
- Tight coupling between features
- Harder to test and maintain
- Violates Single Responsibility Principle

### New Service-Based Approach (Recommended)
```typescript
const toolkit = new GeminiToolkit({ apiKey });
const { coreAI, chat, grounding } = toolkit;

await coreAI.generateText('Hello');         // CoreAIService
await chat.createChat();                    // ChatService
await grounding.groundWithSearch('query'); // GroundingService
```

**Benefits:**
- Single Responsibility Principle
- Loose coupling between services
- Easier testing and mocking
- Better maintainability and scalability
- Clear separation of concerns

## 📚 Service Reference

| Service | Responsibility | Key Methods |
|---------|----------------|-------------|
| **CoreAIService** | Text, image, video, speech generation | `generateText()`, `generateImage()`, `analyzeMedia()` |
| **ChatService** | Conversations and live sessions | `createChat()`, `connectLive()`, `createEphemeralToken()` |
| **GroundingService** | Search, maps, URL context | `groundWithSearch()`, `groundWithMaps()`, `generateWithUrlContext()` |
| **FileSearchService** | Document RAG operations | `createFileSearchStore()`, `uploadToFileSearchStore()`, `queryWithFileSearch()` |
| **FilesService** | File management | `uploadFile()`, `getFile()`, `listFiles()`, `deleteFile()` |
| **CacheService** | Context caching | `createCache()`, `listCaches()`, `getCache()`, `updateCache()` |
| **TokenService** | Token counting | `countTokens()` |

## 🎯 Best Practices

### 1. Use Service-Based Architecture
```typescript
// ✅ Recommended
const { coreAI, chat } = toolkit;
await coreAI.generateText('Hello');

// ❌ Avoid (deprecated)
await toolkit.generateText('Hello');
```

### 2. Handle Errors Properly
```typescript
try {
  const result = await coreAI.generateText('Hello');
} catch (error) {
  if (error instanceof ApiKeyError) {
    // Handle API key issues
  } else if (error instanceof ValidationError) {
    // Handle validation issues
  }
}
```

### 3. Use Context Caching for Repeated Queries
```typescript
const cache = await cache.createCache('gemini-2.5-flash', {
  systemInstruction: 'You are a helpful assistant.',
  contents: [...],
  ttl: '3600s'
});

const response = await coreAI.generateText('Question', {
  cachedContent: cache.name
});
```

### 4. Implement Proper Token Management
```typescript
// Count tokens before expensive operations
const count = await tokens.countTokens(largePrompt, 'gemini-2.5-pro');
if (count.totalTokens > 1000000) {
  throw new Error('Prompt too large');
}
```

## 🤝 Contributing

Found a bug or want to add an example? Open an issue or submit a pull request!

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.