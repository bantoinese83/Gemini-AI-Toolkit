#!/usr/bin/env node

/**
 * AdFlow Studio — Smart Ad Automation SaaS Demo
 *
 * Concept: Let small businesses create scroll-stopping social media ads automatically.
 * Users upload a product photo or type a short description.
 * Gemini edits the image, removes the background, and animates the product with Veo 3.
 * Auto-generates short vertical videos for TikTok, Instagram, and YouTube Shorts.
 * AI voiceover using audio_spark.
 */

const { GeminiToolkit } = require('gemini-ai-toolkit');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class AdFlowStudio {
  constructor(apiKey) {
    this.toolkit = new GeminiToolkit({ apiKey });
    this.app = express();
    this.upload = multer({ dest: 'uploads/' });

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }

    this.setupRoutes();
    this.setupStatic();
  }

  setupStatic() {
    this.app.set('view engine', 'ejs');
    this.app.use(express.static('public'));
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Home page
    this.app.get('/', (req, res) => {
      res.render('index', { title: 'AdFlow Studio - Smart Ad Automation' });
    });

    // Upload and process product
    this.app.post('/create-ad', this.upload.single('productImage'), async (req, res) => {
      try {
        console.log('🚀 Processing new ad request...');

        const { productName, productDescription, targetPlatform } = req.body;
        const imagePath = req.file?.path;

        if (!imagePath && !productDescription) {
          return res.status(400).json({ error: 'Please provide either an image or description' });
        }

        // Step 1: Process the product image/description
        const processedData = await this.processProduct(productName, productDescription, imagePath);

        // Step 2: Generate ad variations for different platforms
        const adVariants = await this.generateAdVariants(processedData, targetPlatform);

        // Step 3: Create final output
        const result = {
          productName,
          processedImage: processedData.processedImage,
          adVariants,
          timestamp: new Date().toISOString()
        };

        console.log('✅ Ad created successfully!');
        res.json(result);

      } catch (error) {
        console.error('❌ Error creating ad:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get ad status
    this.app.get('/ad/:id', (req, res) => {
      // In a real app, you'd store ad data in a database
      res.json({ status: 'completed', message: 'Ad ready for download' });
    });
  }

  async processProduct(productName, description, imagePath) {
    console.log('📸 Processing product...');

    let processedImage = null;
    let enhancedDescription = description;

    if (imagePath) {
      // Step 1: Upload and analyze the product image
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(imagePath);

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

      // Clean up uploaded file
      fs.unlinkSync(imagePath);
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

  async generateAdVariants(processedData, targetPlatform) {
    console.log('🎬 Generating ad variants...');

    const variants = [];
    const platforms = targetPlatform === 'all' ? ['tiktok', 'instagram', 'youtube'] : [targetPlatform];

    for (const platform of platforms) {
      console.log(`   Creating ${platform} variant...`);

      // Generate platform-specific video
      const videoPrompt = this.generateVideoPrompt(processedData.description, platform);
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
      const voiceoverText = this.generateVoiceoverScript(processedData.description, platform);
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

  generateVideoPrompt(description, platform) {
    const platformStyles = {
      tiktok: 'fast-paced, trendy, with popular music, engaging transitions, call-to-action overlay',
      instagram: 'elegant, professional, with smooth transitions, brand colors, story-driven',
      youtube: 'educational yet engaging, with text overlays, professional narration style'
    };

    return `Create a ${platform === 'tiktok' ? '15-second' : '30-second'} vertical video advertisement for: ${description}.
    Style: ${platformStyles[platform]}
    Show the product from multiple angles, highlight key features, end with strong call-to-action.
    Make it scroll-stopping and conversion-focused.`;
  }

  generateVoiceoverScript(description, platform) {
    const platformLengths = {
      tiktok: '15-20 words',
      instagram: '25-35 words',
      youtube: '40-50 words'
    };

    return `Create a compelling ${platformLengths[platform]} voiceover script for this product: ${description}.
    Make it engaging, highlight benefits, include a strong call-to-action. Keep it conversational and authentic.`;
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log('🚀 AdFlow Studio Demo running at http://localhost:' + port);
      console.log('📱 Upload a product photo or enter a description to create automated ads!');
    });
  }
}

// Simple CLI interface for testing
if (require.main === module) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Please set GEMINI_API_KEY environment variable');
    console.log('Example: export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const studio = new AdFlowStudio(apiKey);

  // If run with --server flag, start web server
  if (process.argv.includes('--server')) {
    studio.start();
  } else {
    // CLI demo
    console.log('🎬 AdFlow Studio CLI Demo\n');

    // Example usage
    const demo = async () => {
      try {
        console.log('Creating ad for a premium coffee maker...');
        const result = await studio.processProduct(
          'Premium Coffee Maker',
          'A sleek, modern coffee maker with programmable brewing, thermal carafe, and gourmet quality',
          null // No image, will generate from description
        );

        console.log('✅ Product processed successfully!');
        console.log('📝 Description:', result.description.substring(0, 100) + '...');
        console.log('🖼️  Image generated');

        // Generate TikTok variant
        console.log('\n🎵 Generating TikTok ad variant...');
        const variants = await studio.generateAdVariants(result, 'tiktok');
        console.log('✅ TikTok ad created with voiceover!');

      } catch (error) {
        console.error('❌ Demo failed:', error.message);
      }
    };

    demo();
  }
}

module.exports = AdFlowStudio;
