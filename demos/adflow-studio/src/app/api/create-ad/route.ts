import { NextRequest, NextResponse } from 'next/server';
import { AdFlowService } from '@/lib/AdFlowService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const productName = formData.get('productName') as string;
    const productDescription = formData.get('productDescription') as string;
    const targetPlatform = formData.get('targetPlatform') as string;
    const productImage = formData.get('productImage') as File;

    if (!productName || (!productImage && !productDescription)) {
      return NextResponse.json(
        { error: 'Please provide a product name and either an image or description' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable not set' },
        { status: 500 }
      );
    }

    const adFlowService = new AdFlowService(apiKey);

    let imageBuffer: Buffer | undefined;
    let mimeType: string | undefined;

    if (productImage) {
      const bytes = await productImage.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
      mimeType = productImage.type;
    }

    const result = await adFlowService.createAd(
      productName,
      productDescription,
      targetPlatform,
      imageBuffer,
      mimeType
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error creating ad:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
