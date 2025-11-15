'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface ChatMessage extends Message {
  sources?: Source[];
  isLoading?: boolean;
}

export function TalkBaseChat() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewConversation = async () => {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      const data = await response.json();
      setConversationId(data.conversationId);
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Add loading message
    const loadingMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch(`/api/conversation/${conversationId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          useSearch
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // Replace loading message with actual response
      setMessages(prev => prev.map(msg =>
        msg.isLoading ? {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          sources: data.sources
        } : msg
      ));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">🎯</span>
                TalkBase
              </h2>
              <p className="text-blue-100 mt-1">
                Conversational Knowledge Assistant with Real-time Search
              </p>
            </div>
            <button
              onClick={createNewConversation}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Conversation
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-6 bg-gray-50">
          {!conversationId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to TalkBase
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  I'm your intelligent knowledge assistant. I can chat, remember conversations,
                  and search for current information using Google Search.
                </p>
                <button
                  onClick={createNewConversation}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Ask me anything! I can search for current information and cite sources.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">📚 Sources:</p>
                            <div className="space-y-1">
                              {message.sources.slice(0, 3).map((source, idx) => (
                                <a
                                  key={idx}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {source.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {conversationId && (
          <div className="border-t border-gray-200 p-4">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <label className="flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={useSearch}
                      onChange={(e) => setUseSearch(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    Enable real-time search
                  </label>
                </div>
                <div className="flex">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything... (Press Enter to send)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 00.001-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">🧠</div>
          <h3 className="font-semibold text-gray-900 mb-2">Intelligent Conversations</h3>
          <p className="text-sm text-gray-600">Remembers context and maintains coherent discussions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-2">Real-time Search</h3>
          <p className="text-sm text-gray-600">Accesses current information via Google Search</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-semibold text-gray-900 mb-2">Source Citations</h3>
          <p className="text-sm text-gray-600">Provides links to sources for verification</p>
        </div>
      </div>
    </div>
  );
}
