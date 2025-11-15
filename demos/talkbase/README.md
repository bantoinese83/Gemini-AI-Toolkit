# TalkBase — Conversational Knowledge Assistant Demo

A Next.js TypeScript application demonstrating an intelligent conversational AI that remembers conversations and searches for real-time information.

## Features

- **Conversational Memory**: Remembers conversation history and maintains context
- **Real-time Search**: Accesses current information via Google Search integration
- **Source Citations**: Provides links and snippets from search results
- **Modern Chat UI**: Clean, responsive interface with loading states
- **Voice Support**: API-ready for voice input/output (foundation implemented)
- **Toggle Search**: Users can enable/disable search functionality per message

## Concept

TalkBase is a real-time voice AI that serves as a "living" voice assistant for journalists, researchers, and teams. It combines conversational AI with real-time search capabilities to provide:

- **Contextual Conversations**: Remembers what you've discussed
- **Current Information**: Searches Google for up-to-date facts and news
- **Source Verification**: Cites sources for credibility
- **Voice Interface**: Ready for speech-to-text and text-to-speech integration

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI**: Tailwind CSS with modern React components
- **Backend**: Next.js API routes
- **AI**: Gemini AI Toolkit (gemini-ai-toolkit)
- **Search**: Google Grounding API integration
- **State**: React hooks for conversation management

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Add your Gemini API key:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Routes

- `POST /api/conversation` - Create a new conversation
- `POST /api/conversation/[id]/message` - Send a message to a conversation
- `POST /api/conversation/[id]/voice` - Process voice input (framework ready)
- `GET /api/conversation/[id]` - Get conversation history

## Demo Flow

1. **Start Conversation**: Click "New Conversation" to begin
2. **Chat Naturally**: Ask questions about current events, news, or general knowledge
3. **Search Toggle**: Enable/disable real-time search as needed
4. **View Sources**: Click source links to verify information
5. **Context Awareness**: Ask follow-up questions that reference previous context

## Features Demonstrated

- Conversational AI with memory
- Google Search integration via Grounding API
- Source citation and verification
- Real-time API communication
- Modern React patterns with hooks
- Responsive design and UX best practices

## Business Value

Perfect for:
- **Journalists**: Research current events with source citations
- **Researchers**: Get up-to-date information with verification
- **Teams**: Maintain knowledge bases with conversational access
- **Students**: Study aids with current information access
- **Professionals**: Quick access to industry news and trends

## Search Intelligence

The system automatically detects when search is needed based on keywords like:
- Current events: "latest", "today", "recent", "news"
- Factual queries: "what is", "who is", "how to"
- Time-sensitive: "price of", "weather", "stock"

## Future Enhancements

- Voice input/output integration
- Conversation export/sharing
- Multi-user collaboration
- Custom knowledge base integration
- Advanced search filters and preferences

## License

Apache-2.0