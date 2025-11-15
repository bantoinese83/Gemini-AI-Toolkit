/**
 * @file Grounding service for search and URL context operations.
 * Handles Google Search grounding, Maps grounding, and URL context analysis.
 */

import { GoogleGenAI } from '@google/genai';
import { Location, GroundedResult } from '../types';
import { ApiRequestError, ModelResponseError } from '../errors';
import { validateNonEmptyString, validateLocation } from '../validators';
import { resolveModel, extractTextFromResponse } from '../helpers';
import { sanitizeError } from '../utils/security';
import { DEFAULT_MODELS } from '../constants';

/**
 * Grounding service for search and URL context operations.
 */
export class GroundingService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Generates text with Google Search grounding for up-to-date information.
   */
  async groundWithSearch(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'search-grounded generation');

      return {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate search-grounded content: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates text with Google Maps grounding for location-based information.
   */
  async groundWithMaps(
    prompt: string,
    location: Location,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    validateLocation(location, 'location');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{
            googleSearch: {
              location: location,
            } as any,
          }],
        } as any,
      });

      const text = extractTextFromResponse(response, resolvedModel, 'maps-grounded generation');

      return {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate maps-grounded content: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates text with URL Context tool enabled for analyzing web content.
   */
  async generateWithUrlContext(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [{ urlContext: {} }],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'URL context generation');

      return {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate with URL context: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Generates text with both URL Context and Google Search tools enabled.
   */
  async generateWithUrlContextAndSearch(
    prompt: string,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: {
          tools: [
            { urlContext: {} },
            { googleSearch: {} }
          ],
        },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'URL context and search generation');

      return {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to generate with URL context and search: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
