import { GeminiToolkit } from 'gemini-ai-toolkit';
import fs from 'fs';
import path from 'path';

interface ProcessedProduct {
  processedImage: string;
  description: string;
}

interface AdVariant {
  platform: string;
  video: string;
  voiceover: string;
  duration: number;
  aspectRatio: string;
}

interface AdResult {
  productName: string;
  processedImage: string;
  adVariants: AdVariant[];
  timestamp: string;
}

export class AdFlowService {
  private toolkit: GeminiToolkit;

  constructor(apiKey: string) {
    this.toolkit = new GeminiToolkit({ apiKey });
  }

  async processProduct(
    productName: string,
    description: string,
    imageBuffer?: Buffer,
    mimeType?: string
  ): Promise<ProcessedProduct> {
    console.log('📸 Processing product...');

    let processedImage = '';
    let enhancedDescription = description;

    if (imageBuffer && mimeType) {
      // Step 1: Upload and analyze the product image
      const base64Image = imageBuffer.toString('base64');

      // Step 2: Remove background and enhance image
      const enhancedImage = await this.toolkit.coreAI.editImage(
        base64Image,
        mimeType,
        `Remove background, enhance colors, make it look professional and appealing for advertising. Product: ${productName || 'product'}`
      );

      processedImage = enhancedImage;

      // Step 3: Analyze the image to generate description if not provided
      if (!description) {
        enhancedDescription = await this.toolkit.coreAI.analyzeMedia(
          base64Image,
          mimeType,
          `Describe this product in detail for advertising purposes. What is it? What are its key features? How would you market it?`
        );
      }
    } else {
      // Generate image from description
      processedImage = await this.toolkit.coreAI.generateImage(
        `Professional product photography of: ${description}. Clean background, commercial style, high quality, appealing for advertising`,
        { aspectRatio: '1:1', style: 'natural' }
      );
    }

    return {
      processedImage,
      description: enhancedDescription
    };
  }

  async generateAdVariants(
    processedData: ProcessedProduct,
    targetPlatform: string,
    productName: string
  ): Promise<AdVariant[]> {
    console.log('🎬 Generating ad variants...');

    const platforms = targetPlatform === 'all' ? ['tiktok', 'instagram', 'youtube'] : [targetPlatform];

    const variants: AdVariant[] = [];

    for (const platform of platforms) {
      console.log(`   Creating ${platform} variant...`);

      // Generate platform-specific video
      const videoPrompt = this.generateVideoPrompt(processedData.description, platform, productName);
      const video = await this.toolkit.coreAI.generateVideo(
        processedData.processedImage,
        'image/jpeg',
        videoPrompt,
        {
          durationSeconds: platform === 'tiktok' ? 15 : 30,
          aspectRatio: platform === 'tiktok' ? '9:16' : '16:9'
        }
      );

      // Generate voiceover
      const voiceoverText = this.generateVoiceoverScript(processedData.description, platform, productName);
      const voiceover = await this.toolkit.coreAI.generateSpeech(
        voiceoverText,
        {
          voiceName: 'Puck', // Friendly, engaging voice
          languageCode: 'en-US'
        }
      );

      variants.push({
        platform,
        video,
        voiceover,
        duration: platform === 'tiktok' ? 15 : 30,
        aspectRatio: platform === 'tiktok' ? '9:16' : '16:9'
      });
    }

    return variants;
  }

  private generateVideoPrompt(description: string, platform: string, productName: string): string {
    const platformStyles = {
      tiktok: 'fast-paced, trendy, with popular music, engaging transitions, call-to-action overlay',
      instagram: 'elegant, professional, with smooth transitions, brand colors, story-driven',
      youtube: 'educational yet engaging, with text overlays, professional narration style'
    };

    return `Create a ${platform === 'tiktok' ? '15-second' : '30-second'} vertical video advertisement for ${productName}.
    Product details: ${description}.
    Style: ${platformStyles[platform]}
    Show the product from multiple angles, highlight key features, end with strong call-to-action.
    Make it scroll-stopping and conversion-focused.`;
  }

  private generateVoiceoverScript(description: string, platform: string, productName: string): string {
    const platformLengths = {
      tiktok: '15-20 words',
      instagram: '25-35 words',
      youtube: '40-50 words'
    };

    return `Create a compelling ${platformLengths[platform]} voiceover script for ${productName}: ${description}.
    Make it engaging, highlight benefits, include a strong call-to-action. Keep it conversational and authentic.`;
  }

  async createAd(
    productName: string,
    productDescription: string,
    targetPlatform: string,
    imageBuffer?: Buffer,
    mimeType?: string
  ): Promise<AdResult> {
    console.log('🚀 Processing new ad request...');

    // Step 1: Process the product image/description
    const processedData = await this.processProduct(productName, productDescription, imageBuffer, mimeType);

    // Step 2: Generate ad variations for different platforms
    const adVariants = await this.generateAdVariants(processedData, targetPlatform, productName);

    // Step 3: Create final output
    const result: AdResult = {
      productName,
      processedImage: processedData.processedImage,
      adVariants,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Ad created successfully!');
    return result;
  }
}
