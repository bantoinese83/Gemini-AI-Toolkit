/**
 * @file Token service for counting tokens in various content types.
 * Handles token estimation for cost calculation and API limits.
 */

import { GoogleGenAI } from '@google/genai';
import { TokenCount } from '../types';
import { ApiRequestError } from '../errors';
import { resolveModel } from '../helpers';
import { sanitizeError } from '../utils/security';
import { DEFAULT_MODELS } from '../constants';

/**
 * Token service for token counting operations.
 */
export class TokenService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Counts tokens for any content before sending to the API.
   */
  async countTokens(
    contents: unknown,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<TokenCount> {
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const result = await this.client.models.countTokens({
        model: resolvedModel,
        contents: contents as any,
      });

      return result as TokenCount;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to count tokens: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
