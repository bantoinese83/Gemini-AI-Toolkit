/**
 * @file Custom error classes for the Gemini Toolkit.
 * Provides specific error types for better error handling and debugging.
 */

/**
 * Base error class for all Gemini Toolkit errors.
 */
export class GeminiToolkitError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'GeminiToolkitError';
    Object.setPrototypeOf(this, GeminiToolkitError.prototype);
  }
}

/**
 * Error thrown when API key is invalid or missing.
 */
export class ApiKeyError extends GeminiToolkitError {
  constructor(message: string = 'API key is required and must be a non-empty string') {
    const helpfulMessage = message.includes('GEMINI_API_KEY') 
      ? message 
      : `${message}\n\n💡 Tip: Set GEMINI_API_KEY environment variable or pass apiKey parameter.\n   Example: export GEMINI_API_KEY="your-api-key"`;
    super(helpfulMessage, 'API_KEY_ERROR');
    this.name = 'ApiKeyError';
    Object.setPrototypeOf(this, ApiKeyError.prototype);
  }
}

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends GeminiToolkitError {
  constructor(message: string, public readonly field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Error thrown when API request fails.
 */
export class ApiRequestError extends GeminiToolkitError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly originalError?: Error
  ) {
    let helpfulMessage = message;
    
    // Add helpful suggestions based on status code
    if (statusCode === 401) {
      helpfulMessage += '\n\n💡 Tip: Check if your API key is valid and has the required permissions.';
    } else if (statusCode === 429) {
      helpfulMessage += '\n\n💡 Tip: Rate limit exceeded. Consider implementing retry logic or reducing request frequency.';
    } else if (statusCode === 500 || statusCode === 503) {
      helpfulMessage += '\n\n💡 Tip: Server error. This is usually temporary. Consider retrying the request.';
    }
    
    super(helpfulMessage, 'API_REQUEST_ERROR');
    this.name = 'ApiRequestError';
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

/**
 * Error thrown when model response is invalid or empty.
 */
export class ModelResponseError extends GeminiToolkitError {
  constructor(message: string, public readonly model?: string) {
    super(message, 'MODEL_RESPONSE_ERROR');
    this.name = 'ModelResponseError';
    Object.setPrototypeOf(this, ModelResponseError.prototype);
  }
}

