/**
 * @file Auto-retry utilities for handling transient errors.
 * Automatically retries failed requests with exponential backoff.
 */

import { ApiRequestError } from '../errors';

/**
 * Configuration for auto-retry behavior.
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Whether to retry on rate limit errors (429) (default: true) */
  retryOnRateLimit?: boolean;
  /** Whether to retry on server errors (500, 502, 503, 504) (default: true) */
  retryOnServerError?: boolean;
  /** Custom function to determine if error should be retried */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryOnRateLimit: true,
  retryOnServerError: true,
  shouldRetry: () => true,
};

/**
 * Determines if an error should be retried based on status code and config.
 */
function shouldRetryError(error: unknown, config: Required<RetryConfig>, attempt: number): boolean {
  // Use custom shouldRetry if provided
  if (config.shouldRetry && !config.shouldRetry(error, attempt)) {
    return false;
  }

  // Don't retry validation errors
  if (error instanceof Error && error.name === 'ValidationError') {
    return false;
  }

  // Check API request errors
  if (error instanceof ApiRequestError) {
    const statusCode = error.statusCode;

    // Rate limit errors
    if (statusCode === 429 && config.retryOnRateLimit) {
      return true;
    }

    // Server errors
    if (statusCode && statusCode >= 500 && statusCode < 600 && config.retryOnServerError) {
      return true;
    }

    // Network errors (no status code)
    if (!statusCode && config.retryOnServerError) {
      return true;
    }
  }

  // Check for network errors in generic Error objects
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('econnreset') ||
      errorMessage.includes('enotfound')
    ) {
      return config.retryOnServerError;
    }
  }

  return false;
}

/**
 * Calculates delay for exponential backoff with jitter.
 */
function calculateDelay(attempt: number, config: Required<RetryConfig>): number {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const delay = Math.min(exponentialDelay, config.maxDelay);
  
  // Add jitter (±20%) to prevent thundering herd
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.max(0, delay + jitter);
}

/**
 * Automatically retries an async operation with exponential backoff.
 * 
 * @param operation - Async function to retry
 * @param config - Retry configuration
 * @returns Promise resolving to the operation result
 * 
 * @example
 * ```typescript
 * const result = await withAutoRetry(
 *   () => generateText('Hello!'),
 *   { maxRetries: 5, initialDelay: 2000 }
 * );
 * ```
 */
export async function withAutoRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  // Defensive checks
  if (typeof operation !== 'function') {
    throw new Error('withAutoRetry: operation must be a function');
  }
  
  const finalConfig: Required<RetryConfig> = { ...DEFAULT_CONFIG, ...config };
  
  // Validate config values
  if (finalConfig.maxRetries < 0 || finalConfig.maxRetries > 100) {
    throw new Error('withAutoRetry: maxRetries must be between 0 and 100');
  }
  if (finalConfig.initialDelay < 0 || finalConfig.initialDelay > 60000) {
    throw new Error('withAutoRetry: initialDelay must be between 0 and 60000ms');
  }
  if (finalConfig.maxDelay < finalConfig.initialDelay) {
    throw new Error('withAutoRetry: maxDelay must be >= initialDelay');
  }
  if (finalConfig.backoffMultiplier < 1 || finalConfig.backoffMultiplier > 10) {
    throw new Error('withAutoRetry: backoffMultiplier must be between 1 and 10');
  }
  
  let lastError: unknown;
  const startTime = Date.now();
  const MAX_TOTAL_TIME = 300000; // 5 minutes max total retry time

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry if this was the last attempt
      if (attempt === finalConfig.maxRetries) {
        break;
      }

      // Check if we've exceeded max total time
      const elapsed = Date.now() - startTime;
      if (elapsed > MAX_TOTAL_TIME) {
        throw new Error(`withAutoRetry: Exceeded maximum total retry time of ${MAX_TOTAL_TIME}ms. Last error: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Check if error should be retried
      if (!shouldRetryError(error, finalConfig, attempt)) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateDelay(attempt, finalConfig);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Ensure we have an error to throw
  if (lastError === undefined) {
    throw new Error('withAutoRetry: Operation failed but no error was captured');
  }

  throw lastError;
}

/**
 * Creates a retry wrapper function with pre-configured settings.
 * 
 * @example
 * ```typescript
 * const retryableGenerate = withRetryConfig({ maxRetries: 5 });
 * const result = await retryableGenerate(() => generateText('Hello!'));
 * ```
 */
export function withRetryConfig<T extends (...args: any[]) => Promise<any>>(
  config: RetryConfig
): (operation: () => ReturnType<T>) => ReturnType<T> {
  return (operation: () => ReturnType<T>) => {
    return withAutoRetry(operation, config) as ReturnType<T>;
  };
}

