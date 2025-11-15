import { NextRequest, NextResponse } from 'next/server';
import { TalkBaseService } from '@/lib/TalkBaseService';

let talkBaseService: TalkBaseService | null = null;

function getTalkBaseService(): TalkBaseService {
  if (!talkBaseService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable not set');
    }
    talkBaseService = new TalkBaseService(apiKey);
  }
  return talkBaseService;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { message, useSearch = true } = await request.json();

    const service = getTalkBaseService();
    const conversation = service.getConversation(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Add user message to history
    service.addMessage(id, {
      role: 'user',
      content: message
    });

    // Generate response with optional search
    const response = await service.generateResponse(message, conversation, useSearch);

    // Add assistant response to history
    service.addMessage(id, {
      role: 'assistant',
      content: response.text
    });

    return NextResponse.json({
      response: response.text,
      sources: response.sources,
      conversationId: id
    });

  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
