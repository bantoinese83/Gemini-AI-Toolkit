/**
 * @file Input validation utilities.
 * Centralizes validation logic to keep the main service clean and maintainable.
 */

import { ValidationError } from './errors';
import { AspectRatio, Location } from './types';

/**
 * Validates that a string is not empty and within size limits.
 */
export function validateNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (value === null || value === undefined) {
    throw new ValidationError(
      `${fieldName} must be a non-empty string, got ${value === null ? 'null' : 'undefined'}`,
      fieldName
    );
  }
  
  if (typeof value !== 'string') {
    throw new ValidationError(
      `${fieldName} must be a string, got ${typeof value}`,
      fieldName
    );
  }
  
  if (value.trim().length === 0) {
    throw new ValidationError(
      `${fieldName} must be a non-empty string (whitespace-only strings are not allowed)`,
      fieldName
    );
  }
  
  // Validate prompt length limit (for prompts specifically)
  if (fieldName === 'prompt' && value.length > 1_000_000) {
    throw new ValidationError(
      `${fieldName} exceeds maximum length of 1,000,000 characters`,
      fieldName
    );
  }
}

/**
 * Validates that a value is a valid number within a range.
 */
export function validateNumberInRange(
  value: unknown,
  fieldName: string,
  min: number,
  max: number
): asserts value is number {
  if (typeof value !== 'number' || isNaN(value) || value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be a number between ${min} and ${max}`,
      fieldName
    );
  }
}

/**
 * Validates that a value is a positive integer.
 */
export function validatePositiveInteger(
  value: unknown,
  fieldName: string
): asserts value is number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new ValidationError(
      `${fieldName} must be a positive integer`,
      fieldName
    );
  }
}

/**
 * Validates base64 string format and size.
 */
export function validateBase64(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName);
  
  // Remove whitespace (base64 can have whitespace but we normalize it)
  const normalized = (value as string).replace(/\s/g, '');
  
  // Validate format: base64 characters only, proper padding (0-2 = signs)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(normalized)) {
    throw new ValidationError(
      `${fieldName} must be a valid base64 encoded string`,
      fieldName
    );
  }
  
  // Validate length is multiple of 4 (base64 requirement)
  if (normalized.length % 4 !== 0) {
    throw new ValidationError(
      `${fieldName} has invalid base64 padding (length must be multiple of 4)`,
      fieldName
    );
  }
  
  // Validate size limit (import from constants to avoid circular dependency)
  const MAX_BASE64_SIZE = 20_000_000;
  if (normalized.length > MAX_BASE64_SIZE) {
    throw new ValidationError(
      `${fieldName} exceeds maximum size of ${MAX_BASE64_SIZE} characters`,
      fieldName
    );
  }
}

/**
 * Validates MIME type format.
 */
export function validateMimeType(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName);
  const mimeTypeRegex = /^[a-z]+\/[a-z0-9][a-z0-9\-_]*$/i;
  if (!mimeTypeRegex.test(value)) {
    throw new ValidationError(
      `${fieldName} must be a valid MIME type (e.g., 'image/png', 'video/mp4')`,
      fieldName
    );
  }
}

/**
 * Validates aspect ratio.
 */
export function validateAspectRatio(value: unknown, fieldName: string): asserts value is AspectRatio {
  const validRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  if (typeof value !== 'string' || !validRatios.includes(value as AspectRatio)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${validRatios.join(', ')}`,
      fieldName
    );
  }
}

/**
 * Validates video aspect ratio.
 */
export function validateVideoAspectRatio(
  value: unknown,
  fieldName: string
): asserts value is '16:9' | '9:16' {
  if (value !== '16:9' && value !== '9:16') {
    throw new ValidationError(
      `${fieldName} must be either '16:9' or '9:16'`,
      fieldName
    );
  }
}

/**
 * Validates location coordinates.
 */
export function validateLocation(value: unknown, fieldName: string): asserts value is Location {
  if (!value || typeof value !== 'object') {
    throw new ValidationError(
      `${fieldName} must be an object with latitude and longitude`,
      fieldName
    );
  }
  const location = value as Record<string, unknown>;
  if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
    throw new ValidationError(
      `${fieldName} must have numeric latitude and longitude properties`,
      fieldName
    );
  }
  validateNumberInRange(location.latitude, 'latitude', -90, 90);
  validateNumberInRange(location.longitude, 'longitude', -180, 180);
}

/**
 * Validates that an array is not empty.
 */
export function validateNonEmptyArray<T>(
  value: unknown,
  fieldName: string
): asserts value is T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError(
      `${fieldName} must be a non-empty array`,
      fieldName
    );
  }
}

/**
 * Validates model name format.
 */
export function validateModelName(value: unknown, fieldName: string): asserts value is string {
  validateNonEmptyString(value, fieldName);
  // Model names typically contain alphanumeric characters, dots, and hyphens
  const modelNameRegex = /^[a-z0-9][a-z0-9.\-]*$/i;
  if (!modelNameRegex.test(value)) {
    throw new ValidationError(
      `${fieldName} must be a valid model name`,
      fieldName
    );
  }
}

