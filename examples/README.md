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

