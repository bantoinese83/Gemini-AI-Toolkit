#!/usr/bin/env node

/**
 * Gemini AI SaaS Showcase
 *
 * A comprehensive demonstration of 7 AI-powered SaaS applications built with Gemini AI Toolkit:
 *
 * 1. AdFlow Studio — Smart Ad Automation SaaS
 * 2. TalkBase — Conversational Knowledge Assistant
 * 3. MapLens AI — Local Store Content Engine
 * 4. SceneWriter Pro — Video Script & Production AI
 * 5. InstaTranscribe — Real-Time Audio & Video Insights
 * 6. PixSense — Photo Intelligence API
 * 7. GemVoice — AI Voice Companion
 */

const { GeminiToolkit } = require('gemini-ai-toolkit');
const express = require('express');
const path = require('path');

class SaaSShowcase {
  constructor(apiKey) {
    this.toolkit = new GeminiToolkit({ apiKey });
    this.app = express();

    this.setupRoutes();
    this.setupStatic();

    // Demo data and state
    this.demoResults = new Map();
  }

  setupStatic() {
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    // Home page
    this.app.get('/', (req, res) => {
      res.render('index', {
        title: 'Gemini AI SaaS Showcase',
        saasApps: this.getSaasApps()
      });
    });

    // Individual app demos
    this.app.get('/demo/:appId', (req, res) => {
      const appId = req.params.appId;
      const app = this.getSaasApps().find(a => a.id === appId);

      if (!app) {
        return res.status(404).render('error', { message: 'Demo not found' });
      }

      res.render('demo', { app });
    });

    // Run demo
    this.app.post('/run-demo/:appId', async (req, res) => {
      try {
        const appId = req.params.appId;
        const demoData = req.body;

        console.log(`🚀 Running ${appId} demo...`);

        const result = await this.runDemo(appId, demoData);

        // Store result for display
        const resultId = Date.now().toString();
        this.demoResults.set(resultId, result);

        res.json({
          success: true,
          resultId,
          result
        });

      } catch (error) {
        console.error(`❌ Demo ${req.params.appId} failed:`, error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get demo result
    this.app.get('/result/:resultId', (req, res) => {
      const result = this.demoResults.get(req.params.resultId);
      if (!result) {
        return res.status(404).json({ error: 'Result not found' });
      }
      res.json(result);
    });
  }

  getSaasApps() {
    return [
      {
        id: 'adflow-studio',
        name: 'AdFlow Studio',
        tagline: 'Smart Ad Automation SaaS',
        description: 'Transform product photos into scroll-stopping social media ads automatically',
        icon: 'fas fa-magic',
        color: '#667eea',
        features: [
          'Automatic image enhancement',
          'Background removal',
          'Multi-platform ad generation',
          'AI voiceover creation'
        ],
        demoInput: {
          fields: [
            { name: 'productName', label: 'Product Name', type: 'text', placeholder: 'Premium Coffee Maker' },
            { name: 'productDescription', label: 'Description', type: 'textarea', placeholder: 'Describe your product...' },
            { name: 'targetPlatform', label: 'Platform', type: 'select', options: ['all', 'tiktok', 'instagram', 'youtube'] }
          ]
        }
      },
      {
        id: 'talkbase',
        name: 'TalkBase',
        tagline: 'Conversational Knowledge Assistant',
        description: 'Real-time voice AI that chats, remembers, and cites current information',
        icon: 'fas fa-brain',
        color: '#4facfe',
        features: [
          'Voice conversations',
          'Real-time Google Search',
          'Conversation memory',
          'Source citations'
        ],
        demoInput: {
          fields: [
            { name: 'message', label: 'Ask me anything', type: 'text', placeholder: 'What\'s the latest in AI?' }
          ]
        }
      },
      {
        id: 'maplens-ai',
        name: 'MapLens AI',
        tagline: 'Local Store Content Engine',
        description: 'Generate auto-branded short ads from storefront photos with real-time location data',
        icon: 'fas fa-map-marked-alt',
        color: '#00f2fe',
        features: [
          'Storefront enhancement',
          'Google Maps integration',
          'Location-based content',
          'Multi-platform ads'
        ],
        demoInput: {
          fields: [
            { name: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Joe\'s Coffee Shop' },
            { name: 'businessType', label: 'Type', type: 'select', options: ['restaurant', 'retail', 'hotel'] },
            { name: 'latitude', label: 'Latitude', type: 'text', placeholder: '40.7128' },
            { name: 'longitude', label: 'Longitude', type: 'text', placeholder: '-74.0060' }
          ]
        }
      },
      {
        id: 'scenewriter-pro',
        name: 'SceneWriter Pro',
        tagline: 'Video Script & Production AI',
        description: 'Write and generate mini video stories or commercials automatically',
        icon: 'fas fa-video',
        color: '#764ba2',
        features: [
          'Script generation',
          'Storyboard creation',
          'Video production',
          'Voice synthesis'
        ],
        demoInput: {
          fields: [
            { name: 'prompt', label: 'Video Concept', type: 'textarea', placeholder: 'A day in the life of a coffee shop...' }
          ]
        }
      },
      {
        id: 'instatranscribe',
        name: 'InstaTranscribe',
        tagline: 'Real-Time Audio & Video Insights',
        description: 'Upload videos and get structured insights with transcription and analysis',
        icon: 'fas fa-file-audio',
        color: '#f093fb',
        features: [
          'Real-time transcription',
          'Sentiment analysis',
          'Highlight extraction',
          'Summary generation'
        ],
        demoInput: {
          fields: [
            { name: 'content', label: 'Content to analyze', type: 'textarea', placeholder: 'Paste text or describe content...' }
          ]
        }
      },
      {
        id: 'pixsense',
        name: 'PixSense',
        tagline: 'Photo Intelligence API',
        description: 'Smart photo understanding - extract text, detect scenes, and analyze content',
        icon: 'fas fa-camera',
        color: '#4facfe',
        features: [
          'Text extraction',
          'Object detection',
          'Scene analysis',
          'Content categorization'
        ],
        demoInput: {
          fields: [
            { name: 'description', label: 'Describe the image', type: 'textarea', placeholder: 'A busy coffee shop with people...' }
          ]
        }
      },
      {
        id: 'gemvoice',
        name: 'GemVoice',
        tagline: 'AI Voice Companion',
        description: 'Fully conversational voice experience for podcasts, wellness, and education',
        icon: 'fas fa-microphone',
        color: '#667eea',
        features: [
          'Natural conversations',
          'Context awareness',
          'Personalized responses',
          'Multi-language support'
        ],
        demoInput: {
          fields: [
            { name: 'topic', label: 'Discussion Topic', type: 'text', placeholder: 'Let\'s talk about productivity...' }
          ]
        }
      }
    ];
  }

  async runDemo(appId, demoData) {
    switch (appId) {
      case 'adflow-studio':
        return await this.runAdFlowDemo(demoData);
      case 'talkbase':
        return await this.runTalkBaseDemo(demoData);
      case 'maplens-ai':
        return await this.runMapLensDemo(demoData);
      case 'scenewriter-pro':
        return await this.runSceneWriterDemo(demoData);
      case 'instatranscribe':
        return await this.runInstaTranscribeDemo(demoData);
      case 'pixsense':
        return await this.runPixSenseDemo(demoData);
      case 'gemvoice':
        return await this.runGemVoiceDemo(demoData);
      default:
        throw new Error(`Unknown demo: ${appId}`);
    }
  }

  async runAdFlowDemo(data) {
    const { productName, productDescription, targetPlatform = 'tiktok' } = data;

    // Generate product image
    const imagePrompt = `Professional product photography of: ${productDescription || productName}.
    Clean background, commercial style, high quality, appealing for advertising`;

    const productImage = await this.toolkit.coreAI.generateImage(imagePrompt, {
      aspectRatio: '1:1',
      style: 'natural'
    });

    // Generate ad copy
    const adCopy = await this.toolkit.coreAI.generateText(
      `Create a compelling ${targetPlatform} ad for ${productName}: ${productDescription}.
      Include engaging caption and call-to-action.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.8 } }
    );

    // Generate voiceover
    const voiceover = await this.toolkit.coreAI.generateSpeech(
      adCopy.substring(0, 150),
      { voiceName: 'Puck', languageCode: 'en-US' }
    );

    return {
      productName,
      productImage,
      adCopy,
      voiceover,
      platform: targetPlatform,
      type: 'adflow-studio'
    };
  }

  async runTalkBaseDemo(data) {
    const { message } = data;

    // Check if we should search
    const shouldSearch = /latest|current|today|news|what happened/i.test(message);

    let response, sources = [];

    if (shouldSearch) {
      const searchResult = await this.toolkit.grounding.groundWithSearch(message, 'gemini-2.5-flash');
      response = searchResult.text;

      if (searchResult.candidates?.[0]?.citationMetadata?.citations) {
        sources = searchResult.candidates[0].citationMetadata.citations.slice(0, 3);
      }
    } else {
      response = await this.toolkit.coreAI.generateText(
        `Respond conversationally to: "${message}". Be helpful and engaging.`,
        { model: 'gemini-2.5-flash', config: { temperature: 0.7 } }
      );
    }

    return {
      question: message,
      answer: response,
      sources,
      searched: shouldSearch,
      type: 'talkbase'
    };
  }

  async runMapLensDemo(data) {
    const { businessName, businessType, latitude, longitude } = data;

    // Get location data
    const location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    const locationInfo = await this.toolkit.grounding.groundWithMaps(
      `Find information about ${businessType} businesses near this location`,
      location,
      'gemini-2.5-flash'
    );

    // Generate branded content
    const brandContent = await this.toolkit.coreAI.generateText(
      `Create marketing content for ${businessName}, a ${businessType}.
      Include: brand description, target audience, unique selling points, social media posts.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.8 } }
    );

    return {
      businessName,
      businessType,
      locationInfo: locationInfo.text,
      brandContent,
      coordinates: location,
      type: 'maplens-ai'
    };
  }

  async runSceneWriterDemo(data) {
    const { prompt } = data;

    // Generate script
    const script = await this.toolkit.coreAI.generateText(
      `Write a video script for: ${prompt}.
      Include: scene descriptions, dialogue, voiceover narration, visual effects.
      Format as a professional video script.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.8, maxOutputTokens: 1000 } }
    );

    // Generate storyboard images (text descriptions for demo)
    const storyboard = await this.toolkit.coreAI.generateText(
      `Create a 5-scene storyboard for: ${prompt}.
      Describe each scene visually in detail.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.7 } }
    );

    return {
      prompt,
      script,
      storyboard,
      estimatedDuration: '60 seconds',
      type: 'scenewriter-pro'
    };
  }

  async runInstaTranscribeDemo(data) {
    const { content } = data;

    // Simulate transcription and analysis
    const transcription = content; // In real app, this would be actual transcription

    const analysis = await this.toolkit.coreAI.generateText(
      `Analyze this content: "${content}".
      Provide: summary, key insights, sentiment analysis, highlight moments.
      Structure the response clearly.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.3 } }
    );

    return {
      originalContent: content,
      transcription,
      analysis,
      duration: '2:30',
      type: 'instatranscribe'
    };
  }

  async runPixSenseDemo(data) {
    const { description } = data;

    // Generate mock image analysis (in real app, would analyze actual image)
    const analysis = await this.toolkit.coreAI.generateText(
      `Analyze this image description: "${description}".
      Provide: objects detected, scene description, colors, mood, category.
      Format as structured JSON-like response.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.3 } }
    );

    return {
      imageDescription: description,
      analysis,
      confidence: 0.92,
      processingTime: '0.8s',
      type: 'pixsense'
    };
  }

  async runGemVoiceDemo(data) {
    const { topic } = data;

    // Generate conversational response
    const response = await this.toolkit.coreAI.generateText(
      `Engage in a natural conversation about: ${topic}.
      Be conversational, ask follow-up questions, show personality.
      Keep it engaging and helpful.`,
      { model: 'gemini-2.5-flash', config: { temperature: 0.8 } }
    );

    // Generate voice
    const voiceResponse = await this.toolkit.coreAI.generateSpeech(
      response.substring(0, 200),
      { voiceName: 'Puck', languageCode: 'en-US' }
    );

    return {
      topic,
      textResponse: response,
      voiceResponse,
      conversationStyle: 'casual and engaging',
      type: 'gemvoice'
    };
  }

  start(port = 3003) {
    this.app.listen(port, () => {
      console.log('🚀 Gemini AI SaaS Showcase running at http://localhost:' + port);
      console.log('🎯 Explore 7 AI-powered SaaS applications in one place!');
      console.log('');
      console.log('Available demos:');
      this.getSaasApps().forEach(app => {
        console.log(`   • ${app.name} - ${app.tagline}`);
      });
    });
  }
}

// CLI Demo Runner
if (require.main === module) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Please set GEMINI_API_KEY environment variable');
    console.error('Example: export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const showcase = new SaaSShowcase(apiKey);

  // If run with --server flag, start web server
  if (process.argv.includes('--server')) {
    showcase.start();
  } else {
    // CLI demo - run all demos
    console.log('🚀 Gemini AI SaaS Showcase - CLI Demo\n');
    console.log('Running all 7 SaaS demos...\n');

    const runAllDemos = async () => {
      const demoInputs = {
        'adflow-studio': {
          productName: 'AI Assistant',
          productDescription: 'Revolutionary AI assistant that helps with productivity',
          targetPlatform: 'tiktok'
        },
        'talkbase': {
          message: 'What are the latest developments in AI safety?'
        },
        'maplens-ai': {
          businessName: 'Tech Coffee',
          businessType: 'restaurant',
          latitude: '40.7128',
          longitude: '-74.0060'
        },
        'scenewriter-pro': {
          prompt: 'A futuristic city where AI helps people achieve their dreams'
        },
        'instatranscribe': {
          content: 'This is a sample podcast about artificial intelligence and its impact on society.'
        },
        'pixsense': {
          description: 'A modern coffee shop with people working on laptops and warm lighting'
        },
        'gemvoice': {
          topic: 'How can AI help with creative writing?'
        }
      };

      for (const [appId, input] of Object.entries(demoInputs)) {
        try {
          console.log(`🎯 Running ${appId} demo...`);
          const result = await showcase.runDemo(appId, input);
          console.log(`✅ ${appId} completed\n`);
        } catch (error) {
          console.log(`❌ ${appId} failed: ${error.message}\n`);
        }
      }

      console.log('🎉 All demos completed!');
      console.log('💡 Run with --server flag to start the web interface');
    };

    runAllDemos().catch(console.error);
  }
}

module.exports = SaaSShowcase;
