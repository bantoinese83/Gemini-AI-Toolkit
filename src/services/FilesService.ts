/**
 * @file Files service for managing file uploads, downloads, and metadata.
 * Handles Files API operations for storing and retrieving media files.
 */

import { GoogleGenAI } from '@google/genai';
import { FileObject, UploadFileConfig } from '../types';
import { ApiRequestError, ValidationError } from '../errors';
import { validateNonEmptyString, validateMimeType } from '../validators';
import { sanitizeError } from '../utils/security';
import { detectMimeType, extractFileName } from '../utils/autoDetect';

/**
 * Files service for Files API operations.
 */
export class FilesService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Uploads a file to the Files API for storage and reuse.
   */
  async uploadFile(
    filePath: string | File | Blob,
    config: UploadFileConfig | string = {}
  ): Promise<FileObject> {
    if (typeof filePath === 'string') {
      validateNonEmptyString(filePath, 'filePath');
    }

    // Handle config parameter - can be a string (displayName) or object
    let uploadConfig: UploadFileConfig;
    if (typeof config === 'string') {
      uploadConfig = { displayName: config };
    } else {
      uploadConfig = config;
    }

    // Set display name with fallback
    if (!uploadConfig.displayName) {
      uploadConfig.displayName = extractFileName(filePath) || 'uploaded-file';
    }
    validateNonEmptyString(uploadConfig.displayName, 'displayName');

    // Auto-detect MIME type if not provided
    if (!uploadConfig.mimeType) {
      if (typeof filePath === 'string') {
        uploadConfig.mimeType = detectMimeType(filePath);
      } else if (filePath instanceof File) {
        uploadConfig.mimeType = filePath.type;
      } else if (filePath instanceof Blob) {
        uploadConfig.mimeType = filePath.type || 'application/octet-stream';
      }
    }

    if (uploadConfig.mimeType) {
      validateMimeType(uploadConfig.mimeType, 'mimeType');
    }

    try {
      const result = await this.client.files.upload({
        file: filePath as any,
        config: uploadConfig,
      });

      return result as FileObject;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to upload file: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Gets metadata for a specific uploaded file.
   */
  async getFile(fileName: string): Promise<FileObject> {
    validateNonEmptyString(fileName, 'fileName');

    try {
      const result = await this.client.files.get({ name: fileName });
      return result as FileObject;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to get file ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Lists all uploaded files with optional pagination.
   */
  async listFiles(pageSize?: number): Promise<unknown> {
    if (pageSize !== undefined) {
      if (typeof pageSize !== 'number' || pageSize <= 0 || pageSize > 100) {
        throw new ValidationError('pageSize must be a number between 1 and 100', 'pageSize');
      }
    }

    try {
      return await this.client.files.list(pageSize ? { pageSize } : {} as any);
    } catch (error) {
      throw new ApiRequestError(
        `Failed to list files: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Deletes an uploaded file.
   */
  async deleteFile(fileName: string): Promise<void> {
    validateNonEmptyString(fileName, 'fileName');

    try {
      await this.client.files.delete({ name: fileName });
    } catch (error) {
      throw new ApiRequestError(
        `Failed to delete file ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
