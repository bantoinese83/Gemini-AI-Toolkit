# Dependencies and Packages Used

## 📦 External npm Packages

### Production Dependencies

#### `@google/genai` (^1.29.0)
- **Purpose**: Official Google Gemini API client library
- **Used for**: 
  - All Gemini API interactions
  - Text generation
  - Image generation (Imagen)
  - Video generation (Veo)
  - Chat conversations
  - Speech synthesis
  - Live conversations
  - Grounding features
- **Location**: Used in `src/geminiService.ts`
- **Why**: This is the core dependency that provides all Gemini API functionality

### Development Dependencies

#### `typescript` (^5.3.3)
- **Purpose**: TypeScript compiler
- **Used for**: Compiling TypeScript to JavaScript
- **Location**: Build process
- **Why**: The package is written in TypeScript

#### `@types/node` (^20.11.5)
- **Purpose**: TypeScript type definitions for Node.js
- **Used for**: Type safety for Node.js built-in modules (fs, Buffer, etc.)
- **Location**: Type checking during development
- **Why**: Provides types for Node.js built-in modules

## 🏗️ Node.js Built-in Modules

### `fs` (File System)
- **Purpose**: File system operations
- **Used in**:
  - `src/utils/mediaUtils.ts` - Reading files with `fs.promises.readFile()`
  - `src/utils.ts` - Writing files with `fs.writeFileSync()`
- **Functions used**:
  - `fs.promises.readFile()` - Async file reading
  - `fs.writeFileSync()` - Synchronous file writing
- **Why**: Needed for file I/O operations (loading/saving images, audio)

### `Buffer` (Built-in)
- **Purpose**: Binary data handling
- **Used in**:
  - `src/utils.ts` - Converting base64 to Buffer for file writing
  - `src/utils/mediaUtils.ts` - Converting Buffer to base64
- **Functions used**:
  - `Buffer.from()` - Creating buffers from strings
  - `buffer.toString('base64')` - Converting to base64
- **Why**: Essential for handling binary data (images, audio)

### `process.env` (Built-in)
- **Purpose**: Environment variables
- **Used in**:
  - `src/quick.ts` - Auto-detecting `GEMINI_API_KEY` from environment
- **Why**: Allows developers to set API key via environment variable

## 📊 Dependency Summary

### Total Dependencies
- **Production**: 1 package (`@google/genai`)
- **Development**: 2 packages (`typescript`, `@types/node`)
- **Node.js Built-ins**: 3 modules (`fs`, `Buffer`, `process.env`)

### Package Size Impact
- **@google/genai**: ~Main dependency (includes all Gemini API functionality)
- **Total package size**: 28.9 kB (compressed), 125.6 kB (unpacked)
- **Minimal dependencies**: Only one production dependency!

## 🎯 Why So Few Dependencies?

The package is designed to be **lightweight** and **minimal**:

1. **Only essential dependency**: `@google/genai` for API access
2. **Uses Node.js built-ins**: Leverages `fs` and `Buffer` instead of external packages
3. **No unnecessary abstractions**: Direct use of Node.js APIs
4. **Small footprint**: Minimal dependencies = faster installs, fewer security concerns

## 📝 Usage Examples

### Using fs (File System)
```typescript
// In src/utils/mediaUtils.ts
import { promises as fs } from 'fs';
const fileBuffer = await fs.readFile(filePath);

// In src/utils.ts
import { writeFileSync } from 'fs';
writeFileSync(filePath, buffer);
```

### Using Buffer
```typescript
// Converting base64 to Buffer
const buffer = Buffer.from(imageBase64, 'base64');

// Converting Buffer to base64
const base64 = buffer.toString('base64');
```

### Using process.env
```typescript
// In src/quick.ts
const apiKey = apiKey || process.env.GEMINI_API_KEY;
```

## ✅ Dependency Health

- **No deprecated packages**
- **All packages up to date**
- **Minimal dependency tree**
- **No security vulnerabilities** (as of audit)
- **All dependencies are well-maintained**

## 🔍 Dependency Tree

```
gemini-ai-toolkit
├── @google/genai@1.29.0 (production)
│   └── [Google's internal dependencies]
├── typescript@5.9.3 (dev)
└── @types/node@20.19.24 (dev)
```

## 💡 Could We Add More?

The package intentionally keeps dependencies minimal, but here are some that could be added (if needed):

### Potential Additions (Not Currently Used)
- **Form-data libraries**: Not needed (API handles this)
- **HTTP clients**: Not needed (`@google/genai` handles this)
- **Image processing**: Not needed (handled by API)
- **Video processing**: Not needed (handled by API)
- **Base64 utilities**: Not needed (using built-in Buffer)
- **File utilities**: Not needed (using built-in fs)

**Conclusion**: The current dependency setup is optimal - minimal, secure, and efficient!

