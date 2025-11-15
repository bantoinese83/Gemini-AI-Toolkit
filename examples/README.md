# Gemini AI Toolkit Examples

This directory contains comprehensive examples demonstrating how to use all features and models of the Gemini AI Toolkit.

## Prerequisites

1. Install the toolkit:
```bash
npm install gemini-ai-toolkit
```

2. Import in your code:
```typescript
// Option 1: Class API
import { GeminiToolkit, saveImage, loadImage, presets } from 'gemini-ai-toolkit';

// Option 2: Quick functions (one-liners)
import { generateText, generateImage, saveImage, presets } from 'gemini-ai-toolkit';
```

3. Set your API key as an environment variable:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
GEMINI_API_KEY=your-api-key-here
```

## Examples

### Quick Start (Minimal Code)
- **[00-quick-start.ts](./00-quick-start.ts)** - ⚡ **Start here!** One-line functions, minimal code

### Basic Usage
- **[01-basic-text-generation.ts](./01-basic-text-generation.ts)** - Simple text generation
- **[02-chat-conversation.ts](./02-chat-conversation.ts)** - Chat conversations

### Image Features
- **[03-image-generation.ts](./03-image-generation.ts)** - Generate images with Imagen 4.0
- **[04-image-editing.ts](./04-image-editing.ts)** - Edit images with text prompts
- **[05-image-understanding.ts](./05-image-understanding.ts)** - Analyze images

### Video Features
- **[06-video-generation.ts](./06-video-generation.ts)** - Generate videos with Veo 3.1
- **[07-video-understanding.ts](./07-video-understanding.ts)** - Analyze video content

### Audio Features
- **[08-text-to-speech.ts](./08-text-to-speech.ts)** - Convert text to speech
- **[09-live-conversation.ts](./09-live-conversation.ts)** - Real-time audio conversations

### Advanced Features
- **[10-grounded-search.ts](./10-grounded-search.ts)** - Google Search grounding
- **[11-grounded-maps.ts](./11-grounded-maps.ts)** - Google Maps grounding
- **[12-thinking-mode.ts](./12-thinking-mode.ts)** - Complex reasoning with thinking mode
- **[16-file-search-rag.ts](./16-file-search-rag.ts)** - File Search (RAG) with document querying
- **[17-url-context.ts](./17-url-context.ts)** - URL Context for analyzing web pages and PDFs
- **[18-files-api.ts](./18-files-api.ts)** - Files API for uploading and managing media files
- **[19-context-caching.ts](./19-context-caching.ts)** - Context caching to reduce costs on repeated requests
- **[20-token-counting.ts](./20-token-counting.ts)** - Token counting for cost estimation and limits
- **[21-live-api-tools.ts](./21-live-api-tools.ts)** - Live API with function calling and Google Search
- **[22-live-api-session-management.ts](./22-live-api-session-management.ts)** - Live API session management (compression, resumption, VAD)
- **[23-lyria-music-generation.ts](./23-lyria-music-generation.ts)** - Lyria RealTime music generation with interactive control
- **[24-smart-utilities.ts](./24-smart-utilities.ts)** - Auto-detection utilities, auto-retry, and smart helpers

### Complete Examples
- **[13-complete-workflow.ts](./13-complete-workflow.ts)** - End-to-end workflow example
- **[14-utilities-and-presets.ts](./14-utilities-and-presets.ts)** - Utilities and preset configurations
- **[15-all-presets.ts](./15-all-presets.ts)** - Comprehensive preset examples for all use cases

## Running Examples

### Using TypeScript directly:
```bash
npx tsx examples/01-basic-text-generation.ts
```

### Using Node.js (after building):
```bash
npm run build
node dist/examples/01-basic-text-generation.js
```

### Using ts-node:
```bash
npx ts-node examples/01-basic-text-generation.ts
```

## Models Used

### Text Models
- `gemini-2.5-flash` - Fast, efficient text generation
- `gemini-2.5-pro` - Advanced reasoning and complex tasks
- `gemini-2.5-flash-image` - Image understanding and editing

### Image Models
- `imagen-4.0-generate-001` - High-quality image generation

### Video Models
- `veo-3.1-fast-generate-preview` - Video generation from images

### Audio Models
- `gemini-2.5-flash-preview-tts` - Text-to-speech synthesis
- `gemini-2.5-flash-native-audio-preview-09-2025` - Live conversations

## Error Handling

All examples include proper error handling. Make sure to wrap API calls in try-catch blocks:

```typescript
try {
  const result = await toolkit.generateText('Hello!');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof ApiRequestError) {
    console.error('API error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Notes

- Replace `process.env.GEMINI_API_KEY` with your actual API key for testing
- Some examples require file operations (image/video examples)
- Live conversation examples require browser environment for audio
- Video generation may take several minutes to complete
- File Search (RAG) examples require file uploads - operations are asynchronous and need polling
- File Search stores persist data indefinitely until manually deleted
- URL Context examples require publicly accessible URLs (no login/paywall)
- URL Context supports up to 20 URLs per request, max 34MB per URL
- Files API: Files are automatically deleted after 48 hours
- Files API: Use when request size exceeds 20MB or for reusable file references
- Context Caching: Minimum 2,048 tokens (2.5 Flash) or 4,096 tokens (2.5 Pro)
- Context Caching: Use explicit model versions (e.g., `gemini-2.0-flash-001`)
- Token Counting: 1 token ≈ 4 characters, 100 tokens ≈ 60-80 words
- Live API Tools: Function calling requires manual handling in onmessage callback
- Live API Tools: Google Search may generate executable code
- Live API Session: Context compression extends sessions beyond 15 minutes
- Live API Session: Session resumption tokens valid for 2 hours
- Live API Session: GoAway messages warn before connection termination
- Lyria RealTime: Experimental model, requires v1alpha API
- Lyria RealTime: Output is 16-bit PCM, 48kHz, stereo
- Lyria RealTime: Reset context after BPM or scale changes
- Lyria RealTime: Implement robust audio buffering for smooth playback
- Smart Utilities: Auto-detection utilities automatically detect MIME types, file types, and suggest models
- Smart Utilities: Auto-retry utilities handle transient errors with exponential backoff
- Smart Utilities: Smart helpers reduce boilerplate with automatic detection and model selection

