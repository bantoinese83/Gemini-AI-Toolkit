#!/usr/bin/env node

/**
 * MapLens AI — Local Store Content Engine Demo
 *
 * Concept: For small retailers, restaurants, and hotels — generate auto-branded short ads from storefront photos.
 * Pulls real-time location and ratings data from Maps.
 * Enhances the photo, animates it, then combines with dynamic captions.
 * Perfect for Google Maps listings or local social ads.
 */

const { GeminiToolkit } = require('gemini-ai-toolkit');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

class MapLensAI {
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
      res.render('index', { title: 'MapLens AI - Local Store Content Engine' });
    });

    // Generate ad from storefront
    this.app.post('/generate-ad', this.upload.single('storefrontImage'), async (req, res) => {
      try {
        console.log('🏪 Processing storefront...');

        const {
          businessName,
          businessType,
          address,
          latitude,
          longitude,
          specialOffers,
          targetPlatform
        } = req.body;

        const imagePath = req.file?.path;

        if (!imagePath) {
          return res.status(400).json({ error: 'Please upload a storefront image' });
        }

        // Step 1: Analyze storefront and get location data
        const locationData = await this.getLocationData(latitude, longitude, businessName, address);

        // Step 2: Process and enhance storefront image
        const enhancedImage = await this.processStorefront(imagePath, businessName, businessType);

        // Step 3: Generate branded content
        const brandedContent = await this.generateBrandedContent(
          businessName,
          businessType,
          locationData,
          specialOffers,
          enhancedImage
        );

        // Step 4: Create platform-specific ads
        const ads = await this.createPlatformAds(brandedContent, targetPlatform);

        // Clean up uploaded file
        fs.unlinkSync(imagePath);

        res.json({
          businessName,
          locationData,
          enhancedImage,
          brandedContent,
          ads,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error generating ad:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get sample location data
    this.app.get('/sample-locations', (req, res) => {
      res.json([
        {
          name: "Joe's Coffee Shop",
          address: "123 Main St, Anytown, USA",
          lat: 40.7128,
          lng: -74.0060,
          type: "restaurant"
        },
        {
          name: "Maria's Italian Kitchen",
          address: "456 Oak Ave, Somewhere, USA",
          lat: 34.0522,
          lng: -118.2437,
          type: "restaurant"
        },
        {
          name: "Tech Hub Electronics",
          address: "789 Pine St, Elsewhere, USA",
          lat: 41.8781,
          lng: -87.6298,
          type: "retail"
        }
      ]);
    });
  }

  async getLocationData(latitude, longitude, businessName, address) {
    console.log('📍 Getting location data...');

    try {
      // Use Google Maps grounding to get real location data
      const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };

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
        coordinates: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        address,
        rating: 4.5,
        reviews: "Great local business with excellent customer service",
        popularTimes: "Busy during lunch hours and evenings"
      };
    }
  }

  async processStorefront(imagePath, businessName, businessType) {
    console.log('🖼️  Processing storefront image...');

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = this.getMimeType(imagePath);

    // Enhance the storefront image
    const enhancedImage = await this.toolkit.coreAI.editImage(
      base64Image,
      mimeType,
      `Enhance this storefront photo for professional advertising.
      Business: ${businessName} (${businessType}).
      Improve lighting, colors, and make it look modern and appealing.
      Ensure the business sign is clearly visible and readable.
      Make it suitable for social media advertising.`
    );

    return enhancedImage;
  }

  async generateBrandedContent(businessName, businessType, locationData, specialOffers, enhancedImage) {
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

  async createPlatformAds(brandedContent, targetPlatform) {
    console.log('📱 Creating platform-specific ads...');

    const platforms = targetPlatform === 'all'
      ? ['google-maps', 'facebook', 'instagram']
      : [targetPlatform];

    const ads = [];

    for (const platform of platforms) {
      const adContent = await this.generatePlatformAd(brandedContent, platform);
      ads.push({
        platform,
        ...adContent
      });
    }

    return ads;
  }

  async generatePlatformAd(brandedContent, platform) {
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

    const spec = platformSpecs[platform];

    // Generate platform-specific content
    const content = await this.toolkit.coreAI.generateText(
      `Create a ${platform} ad for this business.
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
    let voiceover = null;
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
      specs: spec,
      format: spec.format,
      size: spec.size,
      duration: spec.duration
    };
  }

  extractRating(text) {
    const ratingMatch = text.match(/(\d+\.?\d*)\s*stars?/i);
    return ratingMatch ? parseFloat(ratingMatch[1]) : 4.0;
  }

  extractReviews(text) {
    // Simple extraction - in real app, you'd parse more carefully
    const reviewKeywords = ['excellent', 'great', 'good', 'amazing', 'love', 'best'];
    return reviewKeywords.find(keyword => text.toLowerCase().includes(keyword)) || 'Positive reviews';
  }

  extractPopularTimes(text) {
    const timePatterns = ['busy', 'popular', 'peak', 'crowded', 'lunch', 'dinner', 'weekends'];
    return timePatterns.find(pattern => text.toLowerCase().includes(pattern)) || 'Varies by day';
  }

  extractVisualStyle(analysis) {
    const styles = ['modern', 'traditional', 'rustic', 'minimalist', 'vibrant', 'elegant'];
    return styles.find(style => analysis.toLowerCase().includes(style)) || 'Professional';
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  start(port = 3002) {
    this.app.listen(port, () => {
      console.log('🏪 MapLens AI Demo running at http://localhost:' + port);
      console.log('📸 Upload a storefront photo and watch us create branded local ads!');
    });
  }
}

// CLI Demo
if (require.main === module) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Please set GEMINI_API_KEY environment variable');
    console.log('Example: export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const maplens = new MapLensAI(apiKey);

  // If run with --server flag, start web server
  if (process.argv.includes('--server')) {
    maplens.start();
  } else {
    // CLI demo
    console.log('🏪 MapLens AI CLI Demo\n');

    const demo = async () => {
      try {
        console.log('Creating branded content for a local coffee shop...');

        // Mock storefront processing (would normally use an uploaded image)
        const mockImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg=='; // 1x1 transparent PNG

        const enhancedImage = await maplens.processStorefront(null, "Joe's Coffee Shop", "restaurant");

        const locationData = {
          coordinates: { latitude: 40.7128, longitude: -74.0060 },
          address: "123 Main St, Anytown, USA",
          rating: 4.5,
          reviews: "Cozy atmosphere with great coffee",
          popularTimes: "Busy during morning rush"
        };

        const brandedContent = await maplens.generateBrandedContent(
          "Joe's Coffee Shop",
          "restaurant",
          locationData,
          "Free WiFi, 20% off first visit",
          enhancedImage
        );

        const ads = await maplens.createPlatformAds(brandedContent, 'facebook');

        console.log('✅ Branded content generated!');
        console.log('📝 Brand strategy preview:', brandedContent.brandStrategy.substring(0, 100) + '...');
        console.log('🏷️  Taglines preview:', brandedContent.taglines.substring(0, 100) + '...');
        console.log('📱 Generated', ads.length, 'platform-specific ad(s)');

      } catch (error) {
        console.error('❌ Demo failed:', error.message);
      }
    };

    demo();
  }
}

module.exports = MapLensAI;
