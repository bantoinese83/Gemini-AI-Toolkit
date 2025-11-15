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

export async function POST() {
  try {
    const service = getTalkBaseService();
    const conversationId = service.createConversation();

    return NextResponse.json({ conversationId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
