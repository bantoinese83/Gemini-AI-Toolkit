/**
 * @file Request queuing utility for managing rate limits and concurrent requests.
 * Provides intelligent request queuing with automatic rate limit handling.
 */

/**
 * Configuration for request queuing.
 */
export interface RequestQueueConfig {
  /** Maximum number of concurrent requests (default: 10) */
  maxConcurrent?: number;
  /** Minimum delay between requests in milliseconds (default: 100) */
  minDelay?: number;
  /** Whether to automatically retry on rate limit (default: true) */
  autoRetryOnRateLimit?: boolean;
  /** Maximum queue size (default: 1000) */
  maxQueueSize?: number;
}

interface QueuedRequest<T> {
  operation: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
  priority?: number;
}

/**
 * Request queue for managing concurrent API requests and rate limits.
 * 
 * @example
 * ```typescript
 * const queue = createRequestQueue({ maxConcurrent: 5, minDelay: 200 });
 * 
 * // Queue requests
 * const result1 = await queue.add(() => generateText('Prompt 1'));
 * const result2 = await queue.add(() => generateText('Prompt 2'));
 * ```
 */
export class RequestQueue {
  private queue: QueuedRequest<unknown>[] = [];
  private running = 0;
  private readonly maxConcurrent: number;
  private readonly minDelay: number;
  private readonly autoRetryOnRateLimit: boolean;
  private readonly maxQueueSize: number;
  private lastRequestTime = 0;

  constructor(config: RequestQueueConfig = {}) {
    this.maxConcurrent = config.maxConcurrent ?? 10;
    this.minDelay = config.minDelay ?? 100;
    this.autoRetryOnRateLimit = config.autoRetryOnRateLimit ?? true;
    this.maxQueueSize = config.maxQueueSize ?? 1000;
    
    // Validate config
    if (this.maxConcurrent < 1 || this.maxConcurrent > 100) {
      throw new Error('RequestQueue: maxConcurrent must be between 1 and 100');
    }
    if (this.minDelay < 0 || this.minDelay > 60000) {
      throw new Error('RequestQueue: minDelay must be between 0 and 60000ms');
    }
    if (this.maxQueueSize < 1 || this.maxQueueSize > 10000) {
      throw new Error('RequestQueue: maxQueueSize must be between 1 and 10000');
    }
  }

  /**
   * Add a request to the queue.
   */
  async add<T>(operation: () => Promise<T>, priority: number = 0): Promise<T> {
    if (typeof operation !== 'function') {
      throw new Error('RequestQueue.add: operation must be a function');
    }
    
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error(`RequestQueue: Queue is full (max size: ${this.maxQueueSize})`);
    }

    return new Promise<T>((resolve, reject) => {
      const request: QueuedRequest<T> = {
        operation,
        resolve,
        reject,
        priority,
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(r => (r.priority ?? 0) < priority);
      if (insertIndex === -1) {
        this.queue.push(request as QueuedRequest<unknown>);
      } else {
        this.queue.splice(insertIndex, 0, request as QueuedRequest<unknown>);
      }

      this.processQueue();
    });
  }

  /**
   * Get current queue status.
   */
  getStatus() {
    return {
      queued: this.queue.length,
      running: this.running,
      total: this.queue.length + this.running,
    };
  }

  /**
   * Clear all queued requests.
   */
  clear() {
    const pending = this.queue;
    this.queue = [];
    pending.forEach(request => {
      request.reject(new Error('RequestQueue: Queue was cleared'));
    });
  }

  private async processQueue() {
    // Don't process if at max concurrent or queue is empty
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    // Get next request
    const request = this.queue.shift();
    if (!request) {
      return;
    }

    this.running++;

    // Enforce minimum delay between requests
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();

    // Execute request
    try {
      const result = await request.operation();
      request.resolve(result);
    } catch (error) {
      // Handle rate limit errors
      if (this.autoRetryOnRateLimit && this.isRateLimitError(error)) {
        // Re-queue with lower priority
        const retryRequest: QueuedRequest<unknown> = {
          operation: request.operation,
          resolve: request.resolve,
          reject: request.reject,
          priority: (request.priority ?? 0) - 1,
        };
        this.queue.unshift(retryRequest);
      } else {
        request.reject(error);
      }
    } finally {
      this.running--;
      // Process next request
      this.processQueue();
    }
  }

  private isRateLimitError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      return (error as { statusCode?: number }).statusCode === 429;
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('rate limit') || message.includes('429');
    }
    return false;
  }
}

/**
 * Create a new request queue instance.
 * 
 * @example
 * ```typescript
 * const queue = createRequestQueue({ maxConcurrent: 5 });
 * const result = await queue.add(() => generateText('Hello!'));
 * ```
 */
export function createRequestQueue(config?: RequestQueueConfig): RequestQueue {
  return new RequestQueue(config);
}

