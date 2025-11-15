/**
 * @file Security utilities to prevent API key leakage.
 * Provides functions to sanitize, mask, and protect sensitive data.
 */

/**
 * Masks an API key showing only the first 4 and last 4 characters.
 * Example: "sk-1234567890abcdef" -> "sk-1...cdef"
 * 
 * @param apiKey - The API key to mask
 * @returns Masked API key string
 */
export function maskApiKey(apiKey: string | null | undefined): string {
  if (!apiKey || typeof apiKey !== 'string') {
    return '[REDACTED]';
  }
  
  if (apiKey.length <= 8) {
    return '[REDACTED]'; // Too short to safely mask
  }
  
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  return `${start}...${end}`;
}

/**
 * Sanitizes a string by replacing any potential API keys with masked versions.
 * Looks for common API key patterns and replaces them.
 * 
 * @param text - Text that might contain API keys
 * @returns Sanitized text with API keys masked
 */
export function sanitizeApiKeys(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  // Common API key patterns (Gemini keys typically start with specific prefixes)
  // Pattern: matches strings that look like API keys (alphanumeric, 20+ chars)
  const apiKeyPatterns = [
    // Gemini API keys (various formats)
    /(?:api[_-]?key|apikey|GEMINI_API_KEY)\s*[:=]\s*([a-zA-Z0-9_-]{20,})/gi,
    // Generic API key patterns
    /(?:key|token|secret|password)\s*[:=]\s*([a-zA-Z0-9_-]{20,})/gi,
    // Standalone long alphanumeric strings (potential keys)
    /\b([a-zA-Z0-9_-]{32,})\b/g,
  ];
  
  let sanitized = text;
  
  for (const pattern of apiKeyPatterns) {
    sanitized = sanitized.replace(pattern, (match, key) => {
      // Don't mask if it's already masked or looks like a hash/ID
      if (match.includes('...') || match.includes('[REDACTED]')) {
        return match;
      }
      
      // Don't mask if it's clearly not an API key (e.g., file paths, URLs)
      if (match.includes('/') || match.includes('http') || match.includes('@')) {
        return match;
      }
      
      return match.replace(key, maskApiKey(key));
    });
  }
  
  return sanitized;
}

/**
 * Sanitizes an error object to remove any API keys from the message and stack trace.
 * 
 * @param error - Error object that might contain API keys
 * @returns New error object with sanitized message and stack
 */
export function sanitizeError(error: unknown): Error {
  if (!(error instanceof Error)) {
    return new Error(String(error));
  }
  
  const sanitized = new Error(sanitizeApiKeys(error.message));
  sanitized.name = error.name;
  sanitized.stack = error.stack ? sanitizeApiKeys(error.stack) : undefined;
  
  // Copy any additional properties
  Object.keys(error).forEach(key => {
    if (key !== 'message' && key !== 'stack' && key !== 'name') {
      const value = (error as any)[key];
      if (typeof value === 'string') {
        (sanitized as any)[key] = sanitizeApiKeys(value);
      } else {
        (sanitized as any)[key] = value;
      }
    }
  });
  
  return sanitized;
}

/**
 * Checks if a string might contain an API key.
 * 
 * @param text - Text to check
 * @returns True if text might contain an API key
 */
export function mightContainApiKey(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  // Check for common API key indicators
  const indicators = [
    /api[_-]?key/gi,
    /apikey/gi,
    /GEMINI_API_KEY/gi,
    /\b[a-zA-Z0-9_-]{32,}\b/, // Long alphanumeric strings
  ];
  
  return indicators.some(pattern => pattern.test(text));
}

/**
 * Prevents API keys from being serialized in JSON.stringify.
 * Use this to wrap objects that might contain API keys.
 * 
 * @param obj - Object that might contain API keys
 * @returns Proxy that masks API keys during serialization
 */
export function protectApiKeys<T extends Record<string, any>>(obj: T): T {
  return new Proxy(obj, {
    get(target, prop) {
      const value = target[prop as string];
      
      // Check if property name suggests it contains an API key
      const propName = String(prop).toLowerCase();
      if ((propName.includes('key') || propName.includes('token') || propName.includes('secret')) 
          && typeof value === 'string' 
          && value.length > 20) {
        return maskApiKey(value);
      }
      
      return value;
    },
    
    ownKeys(target) {
      return Object.keys(target);
    },
    
    getOwnPropertyDescriptor(target, prop) {
      return Object.getOwnPropertyDescriptor(target, prop);
    },
  });
}

/**
 * Validates that an API key format looks correct without exposing it.
 * 
 * @param apiKey - API key to validate
 * @returns Object with validation result and masked key
 */
export function validateApiKeyFormat(apiKey: string): {
  isValid: boolean;
  masked: string;
  reason?: string;
} {
  const masked = maskApiKey(apiKey);
  
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, masked, reason: 'API key must be a non-empty string' };
  }
  
  if (apiKey.trim().length === 0) {
    return { isValid: false, masked, reason: 'API key cannot be whitespace-only' };
  }
  
  if (apiKey.length < 20) {
    return { isValid: false, masked, reason: 'API key appears too short' };
  }
  
  // Basic format check (alphanumeric, dashes, underscores)
  if (!/^[a-zA-Z0-9_-]+$/.test(apiKey)) {
    return { isValid: false, masked, reason: 'API key contains invalid characters' };
  }
  
  return { isValid: true, masked };
}

