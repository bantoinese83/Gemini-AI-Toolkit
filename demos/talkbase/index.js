#!/usr/bin/env node

/**
 * TalkBase — Conversational Knowledge Assistant Demo
 *
 * Concept: A real-time voice AI that chats, remembers, and cites current information using Google Search data.
 * Ideal for journalists, researchers, and teams needing a "living" voice assistant.
 * Users talk or upload documents; the assistant summarizes, verifies, and answers out loud.
 */

const { GeminiToolkit } = require('gemini-ai-toolkit');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

class TalkBase {
  constructor(apiKey) {
    this.toolkit = new GeminiToolkit({ apiKey });
    this.app = express();
    this.conversations = new Map(); // Store conversation history
    this.setupRoutes();
    this.setupWebSocket();
  }

  setupRoutes() {
    this.app.set('view engine', 'ejs');
    this.app.use(express.static('public'));
    this.app.use(express.json());

    // Home page
    this.app.get('/', (req, res) => {
      res.render('index', { title: 'TalkBase - Conversational Knowledge Assistant' });
    });

    // Start new conversation
    this.app.post('/conversation', (req, res) => {
      const conversationId = this.generateId();
      this.conversations.set(conversationId, {
        id: conversationId,
        messages: [],
        created: new Date(),
        context: {}
      });

      res.json({ conversationId });
    });

    // Send message
    this.app.post('/conversation/:id/message', async (req, res) => {
      try {
        const { id } = req.params;
        const { message, useSearch = true } = req.body;

        const conversation = this.conversations.get(id);
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }

        // Add user message to history
        conversation.messages.push({
          role: 'user',
          content: message,
          timestamp: new Date()
        });

        // Generate response with optional search
        const response = await this.generateResponse(message, conversation, useSearch);

        // Add assistant response to history
        conversation.messages.push({
          role: 'assistant',
          content: response.text,
          sources: response.sources,
          timestamp: new Date()
        });

        res.json({
          response: response.text,
          sources: response.sources,
          conversationId: id
        });

      } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get conversation history
    this.app.get('/conversation/:id', (req, res) => {
      const conversation = this.conversations.get(req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      res.json({
        id: conversation.id,
        messages: conversation.messages,
        created: conversation.created
      });
    });

    // Voice message endpoint (simulated)
    this.app.post('/conversation/:id/voice', async (req, res) => {
      try {
        const { id } = req.params;
        const { audioData, transcription } = req.body;

        // In a real implementation, you'd process the audioData
        // For demo, we'll use the provided transcription

        const conversation = this.conversations.get(id);
        if (!conversation) {
          return res.status(404).json({ error: 'Conversation not found' });
        }

        // Generate voice response
        const response = await this.generateVoiceResponse(transcription, conversation);

        res.json({
          transcription,
          response: response.text,
          audioResponse: response.audio,
          sources: response.sources
        });

      } catch (error) {
        console.error('Error processing voice:', error);
        res.status(500).json({ error: error.message });
      }
    });
  }

  setupWebSocket() {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', (ws) => {
      console.log('🔗 New WebSocket connection');

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());

          if (message.type === 'start_conversation') {
            const conversationId = this.generateId();
            this.conversations.set(conversationId, {
              id: conversationId,
              messages: [],
              created: new Date(),
              context: {}
            });

            ws.send(JSON.stringify({
              type: 'conversation_started',
              conversationId
            }));

          } else if (message.type === 'voice_message') {
            const conversation = this.conversations.get(message.conversationId);
            if (conversation) {
              // Process voice message
              const response = await this.generateVoiceResponse(message.transcription, conversation);

              ws.send(JSON.stringify({
                type: 'voice_response',
                transcription: message.transcription,
                response: response.text,
                audioUrl: response.audio,
                sources: response.sources
              }));
            }
          }

        } catch (error) {
          console.error('WebSocket error:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: error.message
          }));
        }
      });

      ws.on('close', () => {
        console.log('🔌 WebSocket connection closed');
      });
    });

    console.log('🎯 WebSocket server running on port 8080');
  }

  async generateResponse(message, conversation, useSearch = true) {
    let context = '';
    let sources = [];

    // Build context from conversation history
    const recentMessages = conversation.messages.slice(-5); // Last 5 messages
    if (recentMessages.length > 0) {
      context = recentMessages.map(m => `${m.role}: ${m.content}`).join('\n');
    }

    let systemPrompt = `You are TalkBase, an intelligent conversational knowledge assistant.
    You have access to real-time information through Google Search and can cite sources.
    Be helpful, accurate, and conversational. If asked about current events or facts,
    use your search capabilities to provide up-to-date information.`;

    if (useSearch && this.shouldSearch(message)) {
      try {
        console.log('🔍 Searching for context...');
        const searchResult = await this.toolkit.grounding.groundWithSearch(
          `${message}\n\nContext: ${context}`,
          'gemini-2.5-flash'
        );

        if (searchResult.candidates?.[0]?.citationMetadata?.citations) {
          sources = searchResult.candidates[0].citationMetadata.citations.map(citation => ({
            title: citation.title,
            url: citation.uri,
            snippet: citation.snippet
          }));
        }

        systemPrompt += `\n\nYou have access to current information. Use this context when relevant: ${searchResult.text}`;

      } catch (error) {
        console.warn('Search failed, continuing without:', error.message);
      }
    }

    // Generate response
    const response = await this.toolkit.coreAI.generateText(
      message,
      {
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          systemInstruction: systemPrompt
        }
      }
    );

    return {
      text: response,
      sources
    };
  }

  async generateVoiceResponse(transcription, conversation) {
    // Generate text response
    const textResponse = await this.generateResponse(transcription, conversation, true);

    // Generate speech from response
    const audioResponse = await this.toolkit.coreAI.generateSpeech(
      textResponse.text,
      {
        voiceName: 'Puck',
        languageCode: 'en-US'
      }
    );

    return {
      text: textResponse.text,
      audio: audioResponse,
      sources: textResponse.sources
    };
  }

  shouldSearch(message) {
    // Determine if the message requires current information
    const searchKeywords = [
      'current', 'latest', 'today', 'recent', 'now', 'news',
      'what happened', 'who is', 'what is', 'how to', 'price of',
      'weather', 'stock', 'election', 'update'
    ];

    const lowerMessage = message.toLowerCase();
    return searchKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  start(port = 3001) {
    this.app.listen(port, () => {
      console.log('🎯 TalkBase Demo running at http://localhost:' + port);
      console.log('🎤 WebSocket server on port 8080');
      console.log('🧠 Ask me anything - I remember conversations and search for current info!');
    });
  }
}

// CLI Demo
if (require.main === module) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Please set GEMINI_API_KEY environment variable');
    console.log('Example: export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const talkbase = new TalkBase(apiKey);

  // If run with --server flag, start web server
  if (process.argv.includes('--server')) {
    talkbase.start();
  } else {
    // CLI demo
    console.log('🎤 TalkBase CLI Demo\n');

    const demo = async () => {
      try {
        // Create a conversation
        const conversationId = talkbase.generateId();
        talkbase.conversations.set(conversationId, {
          id: conversationId,
          messages: [],
          created: new Date(),
          context: {}
        });

        const conversation = talkbase.conversations.get(conversationId);

        // Example conversation
        const questions = [
          "What's the latest news about AI development?",
          "Can you tell me more about that?",
          "How does this compare to traditional programming?"
        ];

        for (const question of questions) {
          console.log(`❓ ${question}`);

          const response = await talkbase.generateResponse(question, conversation, true);
          console.log(`🤖 ${response.text}`);

          if (response.sources.length > 0) {
            console.log(`📚 Sources: ${response.sources.length} found`);
          }

          console.log(''); // Empty line
        }

        console.log('✅ Conversation completed!');

      } catch (error) {
        console.error('❌ Demo failed:', error.message);
      }
    };

    demo();
  }
}

module.exports = TalkBase;
