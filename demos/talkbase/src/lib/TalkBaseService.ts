import { GeminiToolkit } from 'gemini-ai-toolkit';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  messages: Message[];
  created: Date;
  context: Record<string, any>;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface ResponseData {
  text: string;
  sources: SearchResult[];
}

export class TalkBaseService {
  private toolkit: GeminiToolkit;
  private conversations: Map<string, Conversation> = new Map();

  constructor(apiKey: string) {
    this.toolkit = new GeminiToolkit({ apiKey });
  }

  createConversation(): string {
    const conversationId = this.generateId();
    this.conversations.set(conversationId, {
      id: conversationId,
      messages: [],
      created: new Date(),
      context: {}
    });
    return conversationId;
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  async generateResponse(
    message: string,
    conversation: Conversation,
    useSearch: boolean = true
  ): Promise<ResponseData> {
    let context = '';
    let sources: SearchResult[] = [];

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

  async generateVoiceResponse(
    transcription: string,
    conversation: Conversation
  ): Promise<{ text: string; audio: string; sources: SearchResult[] }> {
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

  addMessage(conversationId: string, message: Omit<Message, 'timestamp'>): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push({
        ...message,
        timestamp: new Date()
      });
    }
  }

  private shouldSearch(message: string): boolean {
    // Determine if the message requires current information
    const searchKeywords = [
      'current', 'latest', 'today', 'recent', 'now', 'news',
      'what happened', 'who is', 'what is', 'how to', 'price of',
      'weather', 'stock', 'election', 'update'
    ];

    const lowerMessage = message.toLowerCase();
    return searchKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
