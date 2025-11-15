import { NextRequest, NextResponse } from 'next/server';
import { MapLensService } from '@/lib/MapLensService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const businessName = formData.get('businessName') as string;
    const businessType = formData.get('businessType') as string;
    const address = formData.get('address') as string;
    const latitude = parseFloat(formData.get('latitude') as string);
    const longitude = parseFloat(formData.get('longitude') as string);
    const specialOffers = formData.get('specialOffers') as string;
    const targetPlatform = formData.get('targetPlatform') as string;
    const storefrontImage = formData.get('storefrontImage') as File;

    if (!businessName || !address || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Please provide business name, address, and valid coordinates' },
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

    const mapLensService = new MapLensService(apiKey);

    let imageBuffer: Buffer | undefined;
    let mimeType: string | undefined;

    if (storefrontImage) {
      const bytes = await storefrontImage.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
      mimeType = storefrontImage.type;
    }

    const result = await mapLensService.createAd(
      {
        businessName,
        businessType,
        address,
        latitude,
        longitude,
        specialOffers,
        targetPlatform
      },
      imageBuffer,
      mimeType
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error generating ad:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
