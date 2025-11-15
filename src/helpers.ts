/**
 * @file Helper utilities to reduce code duplication.
 * Implements DRY principle by extracting common patterns.
 */

import { ValidationError, ModelResponseError } from './errors';
import { validateModelName } from './validators';

/**
 * Resolves model name with default fallback and optional validation.
 */
export function resolveModel(
  providedModel: string | undefined,
  defaultModel: string,
  validate: boolean = true
): string {
  const model = providedModel || defaultModel;
  if (validate && providedModel) {
    validateModelName(providedModel, 'model');
  }
  return model;
}

/**
 * Validates and extracts text from a model response.
 */
export function extractTextFromResponse(
  response: { text?: string } | null | undefined,
  model: string,
  operation: string = 'generate content'
): string {
  if (!response) {
    throw new ModelResponseError(
      `Model ${model} returned null or undefined response for ${operation}.`,
      model
    );
  }
  
  if (typeof response !== 'object') {
    throw new ModelResponseError(
      `Model ${model} returned invalid response type for ${operation}. Expected object, got ${typeof response}.`,
      model
    );
  }
  
  if (!response.text) {
    throw new ModelResponseError(
      `Model ${model} did not generate any text for ${operation}. The response may be empty or invalid.`,
      model
    );
  }
  
  if (typeof response.text !== 'string') {
    throw new ModelResponseError(
      `Model ${model} returned invalid text type for ${operation}. Expected string, got ${typeof response.text}.`,
      model
    );
  }
  
  return response.text;
}

/**
 * Validates and extracts inline data from a model response part.
 */
export function extractInlineDataFromResponse(
  part: { inlineData?: { data?: string } } | null | undefined,
  model: string,
  dataType: string = 'data'
): string {
  if (!part) {
    throw new ModelResponseError(
      `Model ${model} returned null or undefined part for ${dataType}.`,
      model
    );
  }
  
  if (typeof part !== 'object') {
    throw new ModelResponseError(
      `Model ${model} returned invalid part type for ${dataType}. Expected object, got ${typeof part}.`,
      model
    );
  }
  
  if (!part.inlineData) {
    throw new ModelResponseError(
      `Model ${model} did not include inlineData in response part for ${dataType}.`,
      model
    );
  }
  
  if (typeof part.inlineData !== 'object') {
    throw new ModelResponseError(
      `Model ${model} returned invalid inlineData type for ${dataType}. Expected object, got ${typeof part.inlineData}.`,
      model
    );
  }
  
  const data = part.inlineData.data;
  if (!data) {
    throw new ModelResponseError(
      `Model ${model} did not generate ${dataType}.`,
      model
    );
  }
  
  if (typeof data !== 'string') {
    throw new ModelResponseError(
      `Model ${model} returned invalid ${dataType} type. Expected string, got ${typeof data}.`,
      model
    );
  }
  
  return data;
}

/**
 * Validates number is within range.
 */
export function validateNumberRange(
  value: number,
  fieldName: string,
  min: number,
  max: number
): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      fieldName
    );
  }
}

/**
 * Validates resolution value.
 */
export function validateResolution(
  value: string,
  fieldName: string
): asserts value is '720p' | '1080p' {
  if (value !== '720p' && value !== '1080p') {
    throw new ValidationError(
      `${fieldName} must be either '720p' or '1080p'`,
      fieldName
    );
  }
}

/**
 * Retries an async operation with exponential backoff.
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on validation errors or client errors (4xx)
      if (error instanceof ValidationError) {
        throw error;
      }
      
      if (error instanceof Error && 'statusCode' in error) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        if (statusCode && statusCode >= 400 && statusCode < 500) {
          throw error; // Don't retry client errors
        }
      }
      
      // Last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
