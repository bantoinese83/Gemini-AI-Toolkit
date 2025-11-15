'use client';

import { TalkBaseChat } from '@/components/TalkBaseChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-purple-600">TalkBase</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conversational Knowledge Assistant — A real-time voice AI that chats, remembers, and cites current information using Google Search data.
          </p>
        </header>

        <TalkBaseChat />
      </div>
    </div>
  );
}