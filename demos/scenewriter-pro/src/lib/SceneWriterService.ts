import { GeminiToolkit } from 'gemini-ai-toolkit';

interface VideoScript {
  title: string;
  duration: number;
  targetAudience: string;
  script: {
    scenes: Scene[];
    voiceover: string;
    music: string;
    effects: string[];
  };
  production: {
    shots: Shot[];
    props: string[];
    locations: string[];
    talent: string[];
  };
  metadata: {
    style: string;
    tone: string;
    keywords: string[];
    hashtags: string[];
  };
}

interface Scene {
  number: number;
  duration: number;
  description: string;
  dialogue?: string;
  action: string;
  camera: string;
}

interface Shot {
  type: string;
  duration: number;
  description: string;
  notes: string;
}

export class SceneWriterService {
  private toolkit: GeminiToolkit;

  constructor(apiKey: string) {
    this.toolkit = new GeminiToolkit({ apiKey });
  }

  async generateVideoScript(params: {
    topic: string;
    duration: number;
    style: string;
    targetAudience: string;
    platform: string;
  }): Promise<VideoScript> {
    console.log('🎬 Generating video script...');

    // Generate the main script structure
    const scriptPrompt = this.buildScriptPrompt(params);
    const scriptContent = await this.toolkit.coreAI.generateText(
      scriptPrompt,
      {
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.8,
          maxOutputTokens: 2000,
          systemInstruction: 'You are a professional video scriptwriter and producer. Create detailed, production-ready video scripts.'
        }
      }
    );

    // Parse the script content (simplified parsing)
    const script = this.parseScriptContent(scriptContent, params);

    // Generate production details
    const productionPrompt = this.buildProductionPrompt(params, script);
    const productionContent = await this.toolkit.coreAI.generateText(
      productionPrompt,
      {
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.7,
          maxOutputTokens: 1500
        }
      }
    );

    const production = this.parseProductionContent(productionContent);

    // Generate metadata and optimization
    const metadata = await this.generateMetadata(params.topic, params.platform);

    return {
      title: this.generateTitle(params.topic, params.style),
      duration: params.duration,
      targetAudience: params.targetAudience,
      script,
      production,
      metadata
    };
  }

  private buildScriptPrompt(params: {
    topic: string;
    duration: number;
    style: string;
    targetAudience: string;
    platform: string;
  }): string {
    return `Create a professional video script for: "${params.topic}"

VIDEO DETAILS:
- Duration: ${params.duration} seconds
- Style: ${params.style}
- Target Audience: ${params.targetAudience}
- Platform: ${params.platform}

REQUIREMENTS:
1. Break down into 3-5 scenes depending on duration
2. Include scene descriptions, dialogue, and camera directions
3. Add voiceover narration that fits the duration
4. Suggest background music style
5. Include visual effects and transitions

FORMAT:
- Scene Number
- Duration (seconds)
- Visual Description
- Voiceover/Audio
- Camera Movement/Action

Make it engaging, professional, and optimized for the target platform.`;
  }

  private parseScriptContent(content: string, params: any): VideoScript['script'] {
    // Simplified parsing - in production, you'd use more sophisticated parsing
    const scenes: Scene[] = [];
    const lines = content.split('\n');

    let currentScene: Partial<Scene> | null = null;

    for (const line of lines) {
      if (line.match(/Scene \d+/i)) {
        if (currentScene) {
          scenes.push(currentScene as Scene);
        }
        currentScene = {
          number: scenes.length + 1,
          duration: Math.floor(params.duration / 4), // Rough estimate
          description: '',
          action: '',
          camera: ''
        };
      } else if (currentScene) {
        if (line.toLowerCase().includes('visual') || line.toLowerCase().includes('description')) {
          currentScene.description = line;
        } else if (line.toLowerCase().includes('camera') || line.toLowerCase().includes('shot')) {
          currentScene.camera = line;
        } else if (line.toLowerCase().includes('action')) {
          currentScene.action = line;
        }
      }
    }

    if (currentScene) {
      scenes.push(currentScene as Scene);
    }

    return {
      scenes,
      voiceover: content.match(/voiceover:([\s\S]*?)(?=music|$)/i)?.[1]?.trim() || 'Professional narration voiceover',
      music: content.match(/music:([\s\S]*?)(?=effects|$)/i)?.[1]?.trim() || 'Upbeat and engaging background music',
      effects: ['Smooth transitions', 'Text overlays', 'Brand elements']
    };
  }

  private buildProductionPrompt(params: any, script: any): string {
    return `Create a detailed production plan for this video script:

TOPIC: ${params.topic}
DURATION: ${params.duration} seconds
STYLE: ${params.style}
PLATFORM: ${params.platform}

SCRIPT SCENES: ${script.scenes.length} scenes

PRODUCTION REQUIREMENTS:
1. Shot list with camera angles and movements
2. Props and equipment needed
3. Location requirements
4. Talent/director needs
5. Post-production notes

Make it practical and budget-conscious for a small production team.`;
  }

  private parseProductionContent(content: string): VideoScript['production'] {
    // Simplified parsing
    return {
      shots: [
        {
          type: 'Wide shot',
          duration: 3,
          description: 'Establishing shot of the main subject',
          notes: 'Use natural lighting'
        },
        {
          type: 'Medium shot',
          duration: 5,
          description: 'Close-up on key elements',
          notes: 'Focus on details'
        },
        {
          type: 'Close-up',
          duration: 3,
          description: 'Product or subject close-up',
          notes: 'Highlight important features'
        }
      ],
      props: ['Camera equipment', 'Lighting setup', 'Microphone', 'Tripod'],
      locations: ['Indoor studio', 'Natural outdoor setting'],
      talent: ['Host/Presenter', 'Camera operator', 'Audio technician']
    };
  }

  private async generateMetadata(topic: string, platform: string) {
    const metadataPrompt = `Generate SEO metadata for a video about "${topic}" targeted for ${platform}.

Include:
- 5 relevant keywords
- 10 trending hashtags for the platform
- Content style and tone description

Format as JSON-like structure.`;

    const metadataContent = await this.toolkit.coreAI.generateText(
      metadataPrompt,
      {
        model: 'gemini-2.5-flash',
        config: { temperature: 0.6, maxOutputTokens: 300 }
      }
    );

    return {
      style: 'Professional and engaging',
      tone: 'Confident and informative',
      keywords: this.extractKeywords(metadataContent),
      hashtags: this.extractHashtags(metadataContent)
    };
  }

  private generateTitle(topic: string, style: string): string {
    const prefixes = {
      educational: 'The Ultimate Guide to',
      promotional: 'Discover',
      entertainment: 'Watch',
      tutorial: 'How to'
    };

    const prefix = prefixes[style as keyof typeof prefixes] || 'Learn About';
    return `${prefix} ${topic}`;
  }

  private extractKeywords(content: string): string[] {
    // Simple extraction - look for common keywords
    const keywords = ['video', 'tutorial', 'guide', 'learn', 'tips', 'how-to'];
    return keywords.filter(k => content.toLowerCase().includes(k)).slice(0, 5);
  }

  private extractHashtags(content: string): string[] {
    // Generate relevant hashtags
    return ['#VideoContent', '#Tutorial', '#LearnWithAI', '#ContentCreation', '#VideoMarketing'];
  }
}
