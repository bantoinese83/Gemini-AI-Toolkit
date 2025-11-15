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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const service = getTalkBaseService();
    const conversation = service.getConversation(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: conversation.id,
      messages: conversation.messages,
      created: conversation.created
    });

  } catch (error) {
    console.error('Error getting conversation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
