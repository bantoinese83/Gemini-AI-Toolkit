# Node.js Built-in Modules - No Installation Required!

## ✅ Automatic - No Installation Needed!

**Node.js built-in modules are automatically available** when Node.js is installed. Users **DO NOT** need to install them separately or add any imports - they're part of Node.js itself!

## 📦 How It Works

### Built-in Modules (Automatic)
These modules come **pre-installed** with Node.js:

1. **`fs`** - File System module
   - ✅ Automatically available
   - ✅ No `npm install` needed
   - ✅ Just `import { fs } from 'fs'` or `import fs from 'fs'`

2. **`Buffer`** - Binary data handling
   - ✅ Automatically available
   - ✅ No `npm install` needed
   - ✅ Global object, no import needed: `Buffer.from()`

3. **`process.env`** - Environment variables
   - ✅ Automatically available
   - ✅ No `npm install` needed
   - ✅ Global object, no import needed: `process.env.GEMINI_API_KEY`

## 🎯 For Users Installing gemini-ai-toolkit

### What Users Need to Install:

```bash
npm install gemini-ai-toolkit
```

That's it! The built-in modules are **already available** in their Node.js installation.

### What Happens Automatically:

1. **`fs` module**: ✅ Already in Node.js
2. **`Buffer`**: ✅ Already in Node.js
3. **`process.env`**: ✅ Already in Node.js

### Example - User's Code:

```typescript
// User just imports from gemini-ai-toolkit
import { generateText, saveImage, fileToBase64 } from 'gemini-ai-toolkit';

// They DON'T need to:
// ❌ npm install fs
// ❌ npm install buffer
// ❌ npm install process

// They CAN use Node.js built-ins directly if needed:
import { writeFileSync } from 'fs'; // ✅ Works automatically
const buffer = Buffer.from('data', 'base64'); // ✅ Works automatically
const apiKey = process.env.GEMINI_API_KEY; // ✅ Works automatically
```

## 📚 Built-in vs External Modules

### Built-in Modules (No Installation)
- `fs` - File system
- `path` - Path utilities
- `http` - HTTP server/client
- `https` - HTTPS server/client
- `crypto` - Cryptographic functions
- `stream` - Streams
- `Buffer` - Binary data
- `process` - Process information
- `os` - Operating system info
- And many more...

### External Modules (Need Installation)
- `@google/genai` - ✅ Installed automatically when user installs gemini-ai-toolkit
- `lodash` - ❌ Would need separate install
- `axios` - ❌ Would need separate install

## 🔍 How gemini-ai-toolkit Uses Built-ins

### Inside gemini-ai-toolkit (src/utils.ts):
```typescript
// We use built-in 'fs' - no installation needed
import { writeFileSync } from 'fs';

export function saveImage(imageBase64: string, filePath: string): void {
  const buffer = Buffer.from(imageBase64, 'base64'); // Built-in Buffer
  writeFileSync(filePath, buffer); // Built-in fs
}
```

### User's Perspective:
```typescript
// User just uses our function - fs and Buffer are handled internally
import { saveImage } from 'gemini-ai-toolkit';
saveImage(imageBase64, 'output.png'); // ✅ Works! No extra installs needed
```

## ✅ Summary

| Module | Type | Installation Required? | User Action |
|--------|------|----------------------|------------|
| `fs` | Built-in | ❌ No | ✅ Automatic |
| `Buffer` | Built-in | ❌ No | ✅ Automatic |
| `process.env` | Built-in | ❌ No | ✅ Automatic |
| `@google/genai` | External | ✅ Yes | ✅ Auto-installed with gemini-ai-toolkit |

## 🎉 Bottom Line

**Users only need to run:**
```bash
npm install gemini-ai-toolkit
```

**Everything else is automatic!** The built-in modules (`fs`, `Buffer`, `process.env`) are already part of Node.js and work automatically. No additional installation or configuration needed!

