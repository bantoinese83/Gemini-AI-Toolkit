/**
 * @file File Search service for RAG (Retrieval Augmented Generation) operations.
 * Handles File Search stores, document uploads, and semantic querying.
 */

import { GoogleGenAI } from '@google/genai';
import {
  FileMetadata,
  ChunkingConfig,
  FileSearchUploadConfig,
  FileSearchImportConfig,
  FileSearchQueryConfig,
  GroundedResult,
} from '../types';
import { ApiRequestError, ModelResponseError } from '../errors';
import {
  validateNonEmptyString,
  validateNonEmptyArray,
  validatePositiveInteger,
} from '../validators';
import { resolveModel, extractTextFromResponse } from '../helpers';
import { sanitizeError } from '../utils/security';
import { detectMimeType, extractFileName } from '../utils/autoDetect';
import { DEFAULT_MODELS } from '../constants';

const MAX_METADATA_ITEMS = 100;
const MAX_METADATA_KEY_LENGTH = 256;
const MAX_METADATA_VALUE_LENGTH = 1024;
const MAX_TOKENS_PER_CHUNK = 10000;

/**
 * File Search service for RAG operations.
 */
export class FileSearchService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Creates a new File Search store for document storage and querying.
   */
  async createFileSearchStore(displayName?: string): Promise<unknown> {
    try {
      const config: Record<string, unknown> = {};

      if (displayName) {
        validateNonEmptyString(displayName, 'displayName');
        config.displayName = displayName;
      }

      return await this.client.fileSearchStores.create({ config });
    } catch (error) {
      throw new ApiRequestError(
        `Failed to create File Search store: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Lists all File Search stores.
   */
  listFileSearchStores(): unknown {
    try {
      return this.client.fileSearchStores.list();
    } catch (error) {
      throw new ApiRequestError(
        `Failed to list File Search stores: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Gets a specific File Search store by name.
   */
  async getFileSearchStore(name: string): Promise<unknown> {
    validateNonEmptyString(name, 'name');

    try {
      return await this.client.fileSearchStores.get({ name });
    } catch (error) {
      throw new ApiRequestError(
        `Failed to get File Search store ${name}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Deletes a File Search store.
   */
  async deleteFileSearchStore(name: string, force: boolean = true): Promise<void> {
    validateNonEmptyString(name, 'name');

    try {
      await this.client.fileSearchStores.delete({ name });
    } catch (error) {
      throw new ApiRequestError(
        `Failed to delete File Search store ${name}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Uploads a file directly to a File Search store (combines upload and import).
   */
  async uploadToFileSearchStore(
    filePath: string | File | Blob,
    fileSearchStoreName: string,
    config: FileSearchUploadConfig = {},
    apiKey?: string
  ): Promise<unknown> {
    if (typeof filePath === 'string') {
      validateNonEmptyString(filePath, 'filePath');
    }

    validateNonEmptyString(fileSearchStoreName, 'fileSearchStoreName');

    // Validate display name
    if (config.displayName) {
      validateNonEmptyString(config.displayName, 'displayName');
    }

    // Validate custom metadata
    if (config.customMetadata) {
      validateNonEmptyArray(config.customMetadata, 'customMetadata');

      if (config.customMetadata.length > MAX_METADATA_ITEMS) {
        throw new Error(`customMetadata exceeds maximum of ${MAX_METADATA_ITEMS} items`);
      }

      for (const meta of config.customMetadata) {
        if (!meta.key || typeof meta.key !== 'string' || meta.key.trim().length === 0) {
          throw new Error('Each metadata item must have a non-empty string key');
        }

        if (meta.key.length > MAX_METADATA_KEY_LENGTH) {
          throw new Error(`Metadata key exceeds maximum length of ${MAX_METADATA_KEY_LENGTH} characters`);
        }

        if (meta.stringValue === undefined && meta.numericValue === undefined) {
          throw new Error('Each metadata item must have either stringValue or numericValue');
        }

        if (meta.stringValue !== undefined) {
          if (typeof meta.stringValue !== 'string') {
            throw new Error('stringValue must be a string');
          }
          if (meta.stringValue.length > MAX_METADATA_VALUE_LENGTH) {
            throw new Error(`stringValue exceeds maximum length of ${MAX_METADATA_VALUE_LENGTH} characters`);
          }
        }

        if (meta.numericValue !== undefined) {
          if (typeof meta.numericValue !== 'number' || isNaN(meta.numericValue) || !isFinite(meta.numericValue)) {
            throw new Error('numericValue must be a valid number');
          }
        }
      }
    }

    // Validate chunking config
    if (config.chunkingConfig?.whiteSpaceConfig) {
      const wsConfig = config.chunkingConfig.whiteSpaceConfig;

      if (wsConfig.maxTokensPerChunk !== undefined) {
        validatePositiveInteger(wsConfig.maxTokensPerChunk, 'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk');
        if (wsConfig.maxTokensPerChunk > MAX_TOKENS_PER_CHUNK) {
          throw new Error(`maxTokensPerChunk exceeds maximum of ${MAX_TOKENS_PER_CHUNK}`);
        }
      }

      if (wsConfig.maxOverlapTokens !== undefined) {
        validatePositiveInteger(wsConfig.maxOverlapTokens, 'chunkingConfig.whiteSpaceConfig.maxOverlapTokens');

        if (wsConfig.maxTokensPerChunk !== undefined &&
            wsConfig.maxOverlapTokens >= wsConfig.maxTokensPerChunk) {
          throw new Error('maxOverlapTokens must be less than maxTokensPerChunk');
        }
      }
    }

    try {
      // Use provided API key if available
      const clientToUse = apiKey ? new GoogleGenAI({ apiKey }) : this.client;

      // Prepare upload config
      const uploadConfig: Record<string, unknown> = {};

      // Set display name
      uploadConfig.displayName = config.displayName || extractFileName(filePath) || 'uploaded-file';

      // MIME type will be auto-detected by the API

      // Add custom metadata
      if (config.customMetadata) {
        uploadConfig.customMetadata = config.customMetadata;
      }

      // Upload file
      const file = await clientToUse.files.upload({
        file: filePath,
        config: uploadConfig,
      });

      // Wait for file to be processed
      let processedFile = file;
      const fileName = processedFile.name;
      if (!fileName) {
        throw new Error('File upload did not return a valid file name');
      }

      while (processedFile.state !== 'ACTIVE') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        processedFile = await clientToUse.files.get({ name: fileName });
      }

      // Import file to File Search store
      const importConfig: Record<string, unknown> = {};

      if (config.customMetadata) {
        importConfig.customMetadata = config.customMetadata;
      }

      if (config.chunkingConfig) {
        importConfig.chunkingConfig = config.chunkingConfig;
      }

      return await clientToUse.fileSearchStores.importFile({
        name: fileSearchStoreName,
        fileName,
        ...importConfig,
      } as any);
    } catch (error) {
      throw new ApiRequestError(
        `Failed to upload file to File Search store: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Imports an existing file into a File Search store.
   */
  async importFileToFileSearchStore(
    fileSearchStoreName: string,
    fileName: string,
    config: FileSearchImportConfig = {}
  ): Promise<unknown> {
    validateNonEmptyString(fileSearchStoreName, 'fileSearchStoreName');
    validateNonEmptyString(fileName, 'fileName');

    // Validate custom metadata
    if (config.customMetadata) {
      validateNonEmptyArray(config.customMetadata, 'customMetadata');

      if (config.customMetadata.length > MAX_METADATA_ITEMS) {
        throw new Error(`customMetadata exceeds maximum of ${MAX_METADATA_ITEMS} items`);
      }

      for (const meta of config.customMetadata) {
        if (!meta.key || typeof meta.key !== 'string' || meta.key.trim().length === 0) {
          throw new Error('Each metadata item must have a non-empty string key');
        }

        if (meta.key.length > MAX_METADATA_KEY_LENGTH) {
          throw new Error(`Metadata key exceeds maximum length of ${MAX_METADATA_KEY_LENGTH} characters`);
        }

        if (meta.stringValue === undefined && meta.numericValue === undefined) {
          throw new Error('Each metadata item must have either stringValue or numericValue');
        }

        if (meta.stringValue !== undefined) {
          if (typeof meta.stringValue !== 'string') {
            throw new Error('stringValue must be a string');
          }
          if (meta.stringValue.length > MAX_METADATA_VALUE_LENGTH) {
            throw new Error(`stringValue exceeds maximum length of ${MAX_METADATA_VALUE_LENGTH} characters`);
          }
        }

        if (meta.numericValue !== undefined) {
          if (typeof meta.numericValue !== 'number' || isNaN(meta.numericValue) || !isFinite(meta.numericValue)) {
            throw new Error('numericValue must be a valid number');
          }
        }
      }
    }

    // Validate chunking config
    if (config.chunkingConfig?.whiteSpaceConfig) {
      const wsConfig = config.chunkingConfig.whiteSpaceConfig;

      if (wsConfig.maxTokensPerChunk !== undefined) {
        validatePositiveInteger(wsConfig.maxTokensPerChunk, 'chunkingConfig.whiteSpaceConfig.maxTokensPerChunk');
        if (wsConfig.maxTokensPerChunk > MAX_TOKENS_PER_CHUNK) {
          throw new Error(`maxTokensPerChunk exceeds maximum of ${MAX_TOKENS_PER_CHUNK}`);
        }
      }

      if (wsConfig.maxOverlapTokens !== undefined) {
        validatePositiveInteger(wsConfig.maxOverlapTokens, 'chunkingConfig.whiteSpaceConfig.maxOverlapTokens');

        if (wsConfig.maxTokensPerChunk !== undefined &&
            wsConfig.maxOverlapTokens >= wsConfig.maxTokensPerChunk) {
          throw new Error('maxOverlapTokens must be less than maxTokensPerChunk');
        }
      }
    }

    try {
      const importConfig: Record<string, unknown> = {};

      if (config.customMetadata) {
        importConfig.customMetadata = config.customMetadata;
      }

      if (config.chunkingConfig) {
        importConfig.chunkingConfig = config.chunkingConfig;
      }

      return await this.client.fileSearchStores.importFile({
        name: fileSearchStoreName,
        fileName,
        ...importConfig,
      } as any);
    } catch (error) {
      throw new ApiRequestError(
        `Failed to import file to File Search store: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Queries documents in File Search stores with RAG (Retrieval Augmented Generation).
   */
  async queryWithFileSearch(
    prompt: string,
    config: FileSearchQueryConfig,
    model: string = DEFAULT_MODELS.TEXT
  ): Promise<GroundedResult> {
    validateNonEmptyString(prompt, 'prompt');
    validateNonEmptyArray(config.fileSearchStoreNames, 'fileSearchStoreNames');

    for (const storeName of config.fileSearchStoreNames) {
      validateNonEmptyString(storeName, `fileSearchStoreNames[${config.fileSearchStoreNames.indexOf(storeName)}]`);
    }

    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);

    try {
      const tools = [{
        fileSearch: {
          fileSearchStoreNames: config.fileSearchStoreNames,
          ...(config.metadataFilter && { metadataFilter: config.metadataFilter }),
        },
      }];

      const response = await this.client.models.generateContent({
        model: resolvedModel,
        contents: prompt,
        config: { tools },
      });

      const text = extractTextFromResponse(response, resolvedModel, 'File Search query');

      return {
        text,
        candidates: response.candidates,
        usageMetadata: response.usageMetadata,
      };
    } catch (error) {
      throw new ApiRequestError(
        `Failed to query with File Search: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
