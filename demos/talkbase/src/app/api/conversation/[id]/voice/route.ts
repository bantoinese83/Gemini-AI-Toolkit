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
    const { audioData, transcription } = await request.json();

    const service = getTalkBaseService();
    const conversation = service.getConversation(id);

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // In a real implementation, you'd process the audioData
    // For demo, we'll use the provided transcription

    // Generate voice response
    const response = await service.generateVoiceResponse(transcription, conversation);

    return NextResponse.json({
      transcription,
      response: response.text,
      audioResponse: response.audio,
      sources: response.sources
    });

  } catch (error) {
    console.error('Error processing voice:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
