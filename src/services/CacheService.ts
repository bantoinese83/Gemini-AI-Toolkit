/**
 * @file Cache service for context caching operations.
 * Handles cached content management to reduce API costs on repeated requests.
 */

import { GoogleGenAI } from '@google/genai';
import { CreateCacheConfig, UpdateCacheConfig, CachedContent } from '../types';
import { ApiRequestError, ValidationError } from '../errors';
import { validateNonEmptyString } from '../validators';
import { sanitizeError } from '../utils/security';

/**
 * Cache service for context caching operations.
 */
export class CacheService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Creates a cached content object to reduce costs on repeated requests.
   */
  async createCache(
    model: string,
    config: CreateCacheConfig
  ): Promise<CachedContent> {
    validateNonEmptyString(model, 'model');

    // Validate display name
    if (config.displayName) {
      validateNonEmptyString(config.displayName, 'displayName');
    }

    // Validate system instruction
    if (config.systemInstruction) {
      validateNonEmptyString(config.systemInstruction, 'systemInstruction');
    }

    // Validate contents
    if (config.contents && config.contents.length > 0) {
      // Contents validation would depend on the specific content types
      // For now, just ensure it's an array
      if (!Array.isArray(config.contents)) {
        throw new ValidationError('contents must be an array', 'contents');
      }
    }

    // Validate TTL
    if (config.ttl !== undefined) {
      if (typeof config.ttl !== 'string' && typeof config.ttl !== 'number') {
        throw new ValidationError('ttl must be a string or number', 'ttl');
      }
    }

    // Validate expireTime
    if (config.expireTime !== undefined) {
      const expireTime = config.expireTime instanceof Date
        ? config.expireTime.toISOString()
        : config.expireTime;
      if (typeof expireTime !== 'string') {
        throw new ValidationError('expireTime must be a Date or ISO string', 'expireTime');
      }
    }

    try {
      const cacheConfig: Record<string, unknown> = {};

      if (config.displayName) {
        cacheConfig.displayName = config.displayName;
      }

      if (config.systemInstruction) {
        cacheConfig.systemInstruction = config.systemInstruction;
      }

      if (config.contents) {
        cacheConfig.contents = config.contents;
      }

      if (config.ttl) {
        cacheConfig.ttl = config.ttl;
      }

      if (config.expireTime) {
        const expireTime = config.expireTime instanceof Date
          ? config.expireTime.toISOString()
          : config.expireTime;
        cacheConfig.expireTime = expireTime;
      }

      const result = await this.client.caches.create({
        model,
        config: cacheConfig,
      } as any);
      return result as CachedContent;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to create cache: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Lists all cached content objects.
   */
  async listCaches(): Promise<unknown> {
    try {
      return await this.client.caches.list();
    } catch (error) {
      throw new ApiRequestError(
        `Failed to list caches: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Gets a specific cached content object by name.
   */
  async getCache(cacheName: string): Promise<CachedContent> {
    validateNonEmptyString(cacheName, 'cacheName');

    try {
      const result = await this.client.caches.get({ name: cacheName });
      return result as CachedContent;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to get cache ${cacheName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Updates a cached content object's TTL or expiration time.
   */
  async updateCache(
    cacheName: string,
    config: UpdateCacheConfig
  ): Promise<CachedContent> {
    validateNonEmptyString(cacheName, 'cacheName');

    // Validate TTL
    if (config.ttl !== undefined) {
      if (typeof config.ttl !== 'string' && typeof config.ttl !== 'number') {
        throw new ValidationError('ttl must be a string or number', 'ttl');
      }
    }

    // Validate expireTime
    if (config.expireTime !== undefined) {
      const expireTime = config.expireTime instanceof Date
        ? config.expireTime.toISOString()
        : config.expireTime;
      if (typeof expireTime !== 'string') {
        throw new ValidationError('expireTime must be a Date or ISO string', 'expireTime');
      }
    }

    try {
      const updateConfig: Record<string, unknown> = {};

      if (config.ttl !== undefined) {
        updateConfig.ttl = config.ttl;
      }

      if (config.expireTime !== undefined) {
        const expireTime = config.expireTime instanceof Date
          ? config.expireTime.toISOString()
          : config.expireTime;
        updateConfig.expireTime = expireTime;
      }

      const result = await this.client.caches.update({
        name: cacheName,
        config: updateConfig,
      });

      return result as CachedContent;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to update cache ${cacheName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Deletes a cached content object.
   */
  async deleteCache(cacheName: string): Promise<void> {
    validateNonEmptyString(cacheName, 'cacheName');

    try {
      await this.client.caches.delete({ name: cacheName });
    } catch (error) {
      throw new ApiRequestError(
        `Failed to delete cache ${cacheName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
