# Developer Experience Improvements

This document outlines all the high-impact improvements made to make the package as developer-friendly as possible.

## 🚀 Quick Start Options

### 1. One-Line Functions (Minimal Code)
```typescript
import { generateText } from 'gemini-ai-toolkit';
const text = await generateText('Hello!'); // Auto-uses GEMINI_API_KEY
```

### 2. Initialize Once
```typescript
import { init, generateText } from 'gemini-ai-toolkit';
init('your-key'); // Once
const text = await generateText('Hello!'); // Everywhere
```

### 3. Full Class API
```typescript
import { GeminiToolkit } from 'gemini-ai-toolkit';
const toolkit = new GeminiToolkit({ apiKey: 'key' });
```

## 💡 Helpful Error Messages

Errors now include actionable tips:

```typescript
// API Key Error
💡 Tip: Set GEMINI_API_KEY environment variable or pass apiKey parameter.
   Example: export GEMINI_API_KEY="your-api-key"

// Rate Limit Error (429)
💡 Tip: Rate limit exceeded. Consider implementing retry logic or reducing request frequency.

// Server Error (500/503)
💡 Tip: Server error. This is usually temporary. Consider retrying the request.
```

## 🎯 Preset Configurations

Ready-to-use configs for common scenarios:

```typescript
import { presets, generateText, generateImage } from 'gemini-ai-toolkit';

// Text presets
presets.text.fast      // Fast generation
presets.text.smart     // Complex reasoning
presets.text.creative   // Creative writing
presets.text.concise    // Brief answers

// Image presets
presets.image.square   // 1:1 aspect ratio
presets.image.wide      // 16:9 aspect ratio
presets.image.portrait  // 9:16 aspect ratio

// Speech presets
presets.speech.default      // Default voice
presets.speech.alternative  // Alternative voice
```

## 🛠️ Developer Utilities

### File Operations
```typescript
import { saveImage, saveAudio, loadImage } from 'gemini-ai-toolkit';

// Save generated content
saveImage(imageBase64, 'output.png');
saveAudio(audioBase64, 'output.wav');

// Load files
const image = await loadImage('input.png');
```

### Batch Processing
```typescript
import { batchGenerateText } from 'gemini-ai-toolkit';

const results = await batchGenerateText(
  ['Prompt 1', 'Prompt 2', 'Prompt 3'],
  (prompt) => generateText(prompt)
);
```

### Streaming Helpers
```typescript
import { streamToText } from 'gemini-ai-toolkit';

const fullText = await streamToText(chat.sendMessageStream({ message: 'Hi' }));
```

## 📦 CommonJS Support

Works with both ES modules and CommonJS:

```javascript
// ES Modules
import { generateText } from 'gemini-ai-toolkit';

// CommonJS
const { generateText } = require('gemini-ai-toolkit');
```

## 🎨 Better TypeScript Experience

- Comprehensive JSDoc with examples
- Full type definitions
- IntelliSense autocomplete
- Type-safe error handling

## 🔍 Code Comparison

### Before (3+ lines):
```typescript
const toolkit = new GeminiToolkit({ apiKey: 'key' });
const text = await toolkit.generateText('Hello!');
const buffer = Buffer.from(text, 'base64');
writeFileSync('output.png', buffer);
```

### After (1-2 lines):
```typescript
const image = await generateImage('Hello!');
saveImage(image, 'output.png');
```

## 📚 Comprehensive Examples

14 example files covering:
- Quick start patterns
- All models and features
- Utilities and presets
- Complete workflows

## ✅ Input Validation

Automatic validation with helpful messages:
- API keys
- Prompts (non-empty)
- Base64 data
- MIME types
- Coordinates (lat/lng ranges)
- Model names
- Aspect ratios

## 🎯 Best Practices Built-In

- Instance caching (performance)
- Error handling (robustness)
- Type safety (correctness)
- Validation (safety)
- Presets (convenience)

## 🚀 Performance Optimizations

- Reuses toolkit instances
- Efficient error handling
- Minimal overhead
- Fast validation

## 📖 Documentation

- README with all options
- Examples for every feature
- Type definitions
- Error handling guide
- Best practices

