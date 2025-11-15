# Security Guide: API Key Protection

This document outlines the security measures implemented in the Gemini AI Toolkit to prevent API key leakage.

## 🔒 API Key Protection Features

### 1. Automatic Sanitization

All error messages, stack traces, and logs are automatically sanitized to remove any API keys:

```typescript
import { generateText } from 'gemini-ai-toolkit';

try {
  await generateText('Hello');
} catch (error) {
  // Error message is automatically sanitized
  // API keys are masked: "sk-1...cdef"
  console.error(error.message);
}
```

### 2. Error Message Sanitization

Error messages never contain full API keys:

```typescript
// ❌ Before: "API key sk-1234567890abcdef is invalid"
// ✅ After:  "API key sk-12...cdef is invalid"
```

### 3. Stack Trace Protection

Stack traces are automatically sanitized to prevent API key leakage:

```typescript
import { sanitizeError } from 'gemini-ai-toolkit';

try {
  // Some operation that might fail
} catch (error) {
  const safeError = sanitizeError(error);
  // safeError.message and safeError.stack are sanitized
}
```

## 🛡️ Security Utilities

### Mask API Keys

```typescript
import { maskApiKey } from 'gemini-ai-toolkit';

const masked = maskApiKey('sk-1234567890abcdef');
// Returns: "sk-1...cdef"
```

### Sanitize Text

```typescript
import { sanitizeApiKeys } from 'gemini-ai-toolkit';

const text = 'API key: sk-1234567890abcdef';
const safe = sanitizeApiKeys(text);
// Returns: "API key: sk-12...cdef"
```

### Check for API Keys

```typescript
import { mightContainApiKey } from 'gemini-ai-toolkit';

if (mightContainApiKey(someText)) {
  // Handle carefully
}
```

### Protect Objects

```typescript
import { protectApiKeys } from 'gemini-ai-toolkit';

const config = {
  apiKey: 'sk-1234567890abcdef',
  otherData: 'safe'
};

const protected = protectApiKeys(config);
console.log(protected.apiKey); // "sk-1...cdef"
```

## ✅ Best Practices

### 1. Never Log API Keys

```typescript
// ❌ BAD
console.log('API Key:', apiKey);
console.error('Error with key:', apiKey);

// ✅ GOOD
import { maskApiKey } from 'gemini-ai-toolkit';
console.log('API Key:', maskApiKey(apiKey));
```

### 2. Use Environment Variables

```typescript
// ❌ BAD - Hardcoded
const toolkit = new GeminiToolkit({ 
  apiKey: 'sk-1234567890abcdef' 
});

// ✅ GOOD - Environment variable
const toolkit = new GeminiToolkit({ 
  apiKey: process.env.GEMINI_API_KEY 
});
```

### 3. Sanitize Before Logging

```typescript
import { sanitizeApiKeys } from 'gemini-ai-toolkit';

// ❌ BAD
logger.error('Request failed:', error);

// ✅ GOOD
logger.error('Request failed:', sanitizeApiKeys(error.message));
```

### 4. Never Commit API Keys

```bash
# Add to .gitignore
.env
*.env
.env.local
.env.*.local
```

### 5. Use Secure Storage

```typescript
// ✅ Server-side: Use environment variables
process.env.GEMINI_API_KEY

// ✅ Client-side: Use secure storage (never localStorage for production)
// Consider using secure HTTP-only cookies or server-side proxy
```

## 🚨 What Gets Protected

The toolkit automatically protects:

- ✅ Error messages
- ✅ Stack traces
- ✅ Validation error messages
- ✅ API request error messages
- ✅ Model response error messages
- ✅ All error objects

## 🔍 Detection Patterns

The sanitization detects:

- API keys in error messages
- API keys in stack traces
- API keys in console logs (if you use the utilities)
- Common API key patterns:
  - `apiKey`, `api_key`, `API_KEY`
  - `GEMINI_API_KEY`
  - Long alphanumeric strings (32+ chars)

## 📋 Security Checklist

- [ ] Never hardcode API keys
- [ ] Use environment variables
- [ ] Never commit `.env` files
- [ ] Use `maskApiKey()` when logging
- [ ] Use `sanitizeApiKeys()` for user-facing errors
- [ ] Review error messages before sharing
- [ ] Use secure storage for client-side keys
- [ ] Rotate API keys regularly
- [ ] Monitor API key usage
- [ ] Revoke compromised keys immediately

## 🆘 If Your API Key is Leaked

1. **Immediately revoke the key** in Google Cloud Console
2. **Generate a new API key**
3. **Update all applications** with the new key
4. **Review access logs** for unauthorized usage
5. **Check for any commits** that might have exposed the key

## 📚 Additional Resources

- [Google Cloud API Key Security](https://cloud.google.com/docs/authentication/api-keys)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Environment Variables Best Practices](https://12factor.net/config)

