/**
 * @file Chat service for conversation, live sessions, and ephemeral token management.
 * Handles chat sessions, real-time conversations, and secure token generation.
 */

import { GoogleGenAI, Chat, LiveConnectConfig } from '@google/genai';
import {
  EphemeralTokenConfig,
  EphemeralToken,
  LiveSessionCallbacks,
  LiveErrorEvent,
  LiveCloseEvent,
  LiveConversationOptions,
  LiveTool,
  ContextWindowCompressionConfig,
  SessionResumptionConfig,
  RealtimeInputConfig,
  ThinkingConfig,
  ProactivityConfig,
  MediaResolution,
  WeightedPrompt,
  MusicGenerationConfig,
  MusicSessionCallbacks,
} from '../types';
import {
  ApiRequestError,
  ValidationError,
} from '../errors';
import {
  validateNonEmptyString,
  validatePositiveInteger,
  validateNumberInRange,
} from '../validators';
import { resolveModel } from '../helpers';
import { sanitizeError } from '../utils/security';
import { DEFAULT_MODELS, DEFAULT_VOICES } from '../constants';

/**
 * Chat service for managing conversations and live sessions.
 */
export class ChatService {
  constructor(private client: GoogleGenAI) {}

  /**
   * Creates a new chat session for conversational interactions.
   */
  createChat(model: string = DEFAULT_MODELS.TEXT): Chat {
    const resolvedModel = resolveModel(model, DEFAULT_MODELS.TEXT);
    return this.client.chats.create({
      model: resolvedModel,
      history: [],
    });
  }

  /**
   * Creates an ephemeral token for secure Live API access from client-side applications.
   */
  async createEphemeralToken(config: EphemeralTokenConfig = {}): Promise<EphemeralToken> {
    try {
      const tokenConfig: Record<string, unknown> = {
        httpOptions: { apiVersion: 'v1alpha' },
      };

      // Set uses (default: 1)
      if (config.uses !== undefined) {
        validatePositiveInteger(config.uses, 'uses');
        tokenConfig.uses = config.uses;
      } else {
        tokenConfig.uses = 1;
      }

      // Set expireTime (default: 30 minutes)
      if (config.expireTime !== undefined) {
        const expireTime = config.expireTime instanceof Date
          ? config.expireTime.toISOString()
          : config.expireTime;
        if (typeof expireTime !== 'string') {
          throw new ValidationError(
            'expireTime must be a Date object or ISO string',
            'expireTime'
          );
        }
        tokenConfig.expireTime = expireTime;
      } else {
        // Default: 30 minutes from now
        tokenConfig.expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      }

      // Set newSessionExpireTime (default: 1 minute)
      if (config.newSessionExpireTime !== undefined) {
        const newSessionExpireTime = config.newSessionExpireTime instanceof Date
          ? config.newSessionExpireTime.toISOString()
          : config.newSessionExpireTime;
        if (typeof newSessionExpireTime !== 'string') {
          throw new ValidationError(
            'newSessionExpireTime must be a Date object or ISO string',
            'newSessionExpireTime'
          );
        }
        tokenConfig.newSessionExpireTime = newSessionExpireTime;
      } else {
        // Default: 1 minute from now
        tokenConfig.newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();
      }

      // Add liveConnectConstraints if provided
      if (config.liveConnectConstraints) {
        const constraints: Record<string, unknown> = {};

        if (config.liveConnectConstraints.model) {
          validateNonEmptyString(config.liveConnectConstraints.model, 'liveConnectConstraints.model');
          constraints.model = config.liveConnectConstraints.model;
        }

        if (config.liveConnectConstraints.config) {
          constraints.config = config.liveConnectConstraints.config;
        }

        if (Object.keys(constraints).length > 0) {
          tokenConfig.liveConnectConstraints = constraints;
        }
      }

      const token = await this.client.authTokens.create({
        config: tokenConfig,
      });

      return {
        name: (token as { name: string }).name,
        ...token,
      } as EphemeralToken;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to create ephemeral token: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Connects to a live conversation session for real-time audio interactions.
   */
  async connectLive(
    callbacks: LiveSessionCallbacks,
    options: LiveConversationOptions = {},
    ephemeralToken?: string
  ): Promise<unknown> {
    // Validate callbacks
    if (!callbacks || typeof callbacks !== 'object') {
      throw new ValidationError('callbacks must be an object', 'callbacks');
    }

    const requiredCallbacks = ['onopen', 'onmessage', 'onerror', 'onclose'];
    for (const callbackName of requiredCallbacks) {
      if (typeof (callbacks as any)[callbackName] !== 'function') {
        throw new ValidationError(
          `callbacks.${callbackName} must be a function`,
          `callbacks.${callbackName}`
        );
      }
    }

    try {
      // Use ephemeral token if provided, otherwise use the client's API key
      const clientToUse = ephemeralToken
        ? new GoogleGenAI({ apiKey: ephemeralToken })
        : this.client;

      // Basic live connection - simplified for now
      const connectConfig: any = {
        model: resolveModel(options.model, DEFAULT_MODELS.LIVE),
      };

      return await clientToUse.live.connect(connectConfig);
    } catch (error) {
      throw new ApiRequestError(
        `Failed to connect to live session: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }

  /**
   * Connects to Lyria RealTime music generation session.
   */
  async connectMusic(
    callbacks: MusicSessionCallbacks,
    apiKey?: string
  ): Promise<unknown> {
    // Validate callbacks
    if (!callbacks || typeof callbacks !== 'object') {
      throw new ValidationError('callbacks must be an object', 'callbacks');
    }

    const requiredCallbacks = ['onmessage', 'onerror', 'onclose'];
    for (const callbackName of requiredCallbacks) {
      if (typeof (callbacks as any)[callbackName] !== 'function') {
        throw new ValidationError(
          `callbacks.${callbackName} must be a function`,
          `callbacks.${callbackName}`
        );
      }
    }

    try {
      // Use provided API key or client's API key
      const clientToUse = apiKey
        ? new GoogleGenAI({ apiKey })
        : this.client;

      // Create music session using the experimental model
      const session = await clientToUse.live.connect({
        model: 'models/lyria-realtime-exp',
      } as any);

      return session;
    } catch (error) {
      throw new ApiRequestError(
        `Failed to connect to music session: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof ApiRequestError ? error.statusCode : undefined,
        sanitizeError(error)
      );
    }
  }
}
