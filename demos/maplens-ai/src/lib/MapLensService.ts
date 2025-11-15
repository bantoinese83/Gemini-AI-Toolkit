import { GeminiToolkit } from 'gemini-ai-toolkit';
import fs from 'fs';
import path from 'path';

interface LocationData {
  coordinates: { latitude: number; longitude: number };
  address: string;
  searchResults?: string;
  rating?: number;
  reviews?: string;
  popularTimes?: string;
}

interface BrandedContent {
  imageAnalysis: string;
  brandStrategy: string;
  taglines: string;
  visualStyle: string;
}

interface AdVariant {
  platform: string;
  content: string;
  voiceover?: string;
  specs: {
    format: string;
    size: string;
    duration: string;
    style: string;
  };
}

interface AdResult {
  businessName: string;
  locationData: LocationData;
  enhancedImage: string;
  brandedContent: BrandedContent;
  ads: AdVariant[];
}

export class MapLensService {
  private toolkit: GeminiToolkit;

  constructor(apiKey: string) {
    this.toolkit = new GeminiToolkit({ apiKey });
  }

  async getLocationData(
    latitude: number,
    longitude: number,
    businessName: string,
    address: string
  ): Promise<LocationData> {
    console.log('📍 Getting location data...');

    try {
      const location = { latitude, longitude };

      // Search for business information
      const searchQuery = `Find information about ${businessName} at ${address}. Include ratings, reviews, hours, and popular times.`;

      const locationInfo = await this.toolkit.grounding.groundWithMaps(searchQuery, location, 'gemini-2.5-flash');

      return {
        coordinates: location,
        address,
        searchResults: locationInfo.text,
        rating: this.extractRating(locationInfo.text),
        reviews: this.extractReviews(locationInfo.text),
        popularTimes: this.extractPopularTimes(locationInfo.text)
      };

    } catch (error) {
      console.warn('Could not fetch location data:', error.message);
      // Return mock data for demo
      return {
        coordinates: { latitude, longitude },
        address,
        rating: 4.5,
        reviews: "Great local business with excellent customer service",
        popularTimes: "Busy during lunch hours and evenings"
      };
    }
  }

  async processStorefront(
    imageBuffer: Buffer,
    mimeType: string,
    businessName: string,
    businessType: string
  ): Promise<string> {
    console.log('🖼️  Processing storefront image...');

    // Enhance the storefront image
    const enhancedImage = await this.toolkit.coreAI.editImage(
      imageBuffer.toString('base64'),
      mimeType,
      `Enhance this storefront photo for professional advertising.
      Business: ${businessName} (${businessType}).
      Improve lighting, colors, and make it look modern and appealing.
      Ensure the business sign is clearly visible and readable.
      Make it suitable for social media advertising.`
    );

    return enhancedImage;
  }

  async generateBrandedContent(
    businessName: string,
    businessType: string,
    locationData: LocationData,
    specialOffers: string,
    enhancedImage: string
  ): Promise<BrandedContent> {
    console.log('🎨 Generating branded content...');

    // Analyze the enhanced image for branding insights
    const imageAnalysis = await this.toolkit.coreAI.analyzeMedia(
      enhancedImage,
      'image/jpeg',
      `Analyze this storefront image and describe the visual branding, colors, style, and atmosphere.
      Business: ${businessName} (${businessType})`
    );

    // Generate brand personality and messaging
    const brandStrategy = await this.toolkit.coreAI.generateText(
      `Create a brand strategy for ${businessName}, a ${businessType} located at ${locationData.address}.
      Include: brand personality, target audience, unique selling points, tone of voice.
      Location insights: ${locationData.searchResults || 'Local business'}.
      Special offers: ${specialOffers || 'None specified'}.
      Keep it concise but comprehensive.`,
      {
        model: 'gemini-2.5-flash',
        config: { temperature: 0.7, maxOutputTokens: 500 }
      }
    );

    // Generate captions and taglines
    const taglines = await this.toolkit.coreAI.generateText(
      `Generate 5 creative taglines and 3 social media caption templates for ${businessName}.
      Business type: ${businessType}.
      Location: ${locationData.address}.
      Include local appeal and any special offers: ${specialOffers || 'None'}.
      Make them engaging and conversion-focused.`,
      {
        model: 'gemini-2.5-flash',
        config: { temperature: 0.8, maxOutputTokens: 300 }
      }
    );

    return {
      imageAnalysis,
      brandStrategy,
      taglines,
      visualStyle: this.extractVisualStyle(imageAnalysis)
    };
  }

  async createPlatformAds(
    brandedContent: BrandedContent,
    targetPlatform: string,
    businessName: string
  ): Promise<AdVariant[]> {
    console.log('📱 Creating platform-specific ads...');

    const platforms = targetPlatform === 'all'
      ? ['google-maps', 'facebook', 'instagram']
      : [targetPlatform];

    const ads: AdVariant[] = [];

    for (const platform of platforms) {
      const adContent = await this.generatePlatformAd(brandedContent, platform, businessName);
      ads.push({
        platform,
        ...adContent
      });
    }

    return ads;
  }

  private async generatePlatformAd(
    brandedContent: BrandedContent,
    platform: string,
    businessName: string
  ): Promise<{ content: string; voiceover?: string; specs: any }> {
    const platformSpecs = {
      'google-maps': {
        format: 'Google Maps listing photo with overlay text',
        size: '1080x608 (16:9)',
        duration: 'static',
        style: 'informative, location-aware'
      },
      'facebook': {
        format: 'Facebook carousel or single image ad',
        size: '1200x628',
        duration: 'static or 15s video',
        style: 'social, community-focused'
      },
      'instagram': {
        format: 'Instagram Story or feed post',
        size: '1080x1080',
        duration: 'static or 15s video',
        style: 'visual, trendy, mobile-first'
      }
    };

    const spec = platformSpecs[platform as keyof typeof platformSpecs];

    // Generate platform-specific content
    const content = await this.toolkit.coreAI.generateText(
      `Create a ${platform} ad for this business: ${businessName}.
      Platform specs: ${spec.format}, ${spec.size}, style: ${spec.style}

      Brand strategy: ${brandedContent.brandStrategy}
      Taglines: ${brandedContent.taglines}
      Visual style: ${brandedContent.visualStyle}

      Include: headline, description, call-to-action, hashtags (if applicable).
      Make it conversion-focused and platform-optimized.`,
      {
        model: 'gemini-2.5-flash',
        config: { temperature: 0.8, maxOutputTokens: 400 }
      }
    );

    // Generate voiceover for video ads
    let voiceover = undefined;
    if (spec.duration !== 'static') {
      voiceover = await this.toolkit.coreAI.generateSpeech(
        content.substring(0, 200), // First 200 chars for voiceover
        {
          voiceName: 'Puck',
          languageCode: 'en-US'
        }
      );
    }

    return {
      content,
      voiceover,
      specs: spec
    };
  }

  private extractRating(text: string): number {
    const ratingMatch = text.match(/(\d+\.?\d*)\s*stars?/i);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 4.0;
  }

  private extractReviews(text: string): string {
    // Simple extraction - in real app, you'd parse more carefully
    const reviewKeywords = ['excellent', 'great', 'good', 'amazing', 'love', 'best'];
    return reviewKeywords.find(keyword => text.toLowerCase().includes(keyword)) || 'Positive reviews';
  }

  private extractPopularTimes(text: string): string {
    const timePatterns = ['busy', 'popular', 'peak', 'crowded', 'lunch', 'dinner', 'weekends'];
    return timePatterns.find(pattern => text.toLowerCase().includes(pattern)) || 'Varies by day';
  }

  private extractVisualStyle(analysis: string): string {
    const styles = ['modern', 'traditional', 'rustic', 'minimalist', 'vibrant', 'elegant'];
    return styles.find(style => analysis.toLowerCase().includes(style)) || 'Professional';
  }

  async createAd(
    businessData: {
      businessName: string;
      businessType: string;
      address: string;
      latitude: number;
      longitude: number;
      specialOffers: string;
      targetPlatform: string;
    },
    imageBuffer?: Buffer,
    mimeType?: string
  ): Promise<AdResult> {
    console.log('🏪 Processing storefront...');

    // Step 1: Analyze storefront and get location data
    const locationData = await this.getLocationData(
      businessData.latitude,
      businessData.longitude,
      businessData.businessName,
      businessData.address
    );

    // Step 2: Process and enhance storefront image
    let enhancedImage = '';
    if (imageBuffer && mimeType) {
      enhancedImage = await this.processStorefront(
        imageBuffer,
        mimeType,
        businessData.businessName,
        businessData.businessType
      );
    }

    // Step 3: Generate branded content
    const brandedContent = await this.generateBrandedContent(
      businessData.businessName,
      businessData.businessType,
      locationData,
      businessData.specialOffers,
      enhancedImage
    );

    // Step 4: Create platform-specific ads
    const ads = await this.createPlatformAds(
      brandedContent,
      businessData.targetPlatform,
      businessData.businessName
    );

    return {
      businessName: businessData.businessName,
      locationData,
      enhancedImage,
      brandedContent,
      ads
    };
  }
}
