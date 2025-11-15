/**
 * Example: Lyria RealTime Music Generation
 * 
 * Demonstrates real-time streaming music generation using Lyria RealTime.
 * This allows interactive creation, continuous steering, and performance of instrumental music.
 * 
 * ⚠️ Experimental: Lyria RealTime is an experimental model.
 * ⚠️ Requires v1alpha API: This feature requires the v1alpha API version.
 * 
 * Note: This requires audio playback capabilities (Node.js with speaker library or browser).
 */

import { GeminiToolkit, WeightedPrompt, MusicGenerationConfig } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Lyria RealTime Music Generation Examples ===\n');
  console.log('⚠️  Experimental: Lyria RealTime is an experimental model.\n');
  console.log('⚠️  Requires v1alpha API version.\n');

  // Example 1: Basic music generation
  console.log('1️⃣ Basic Music Generation:');
  console.log(`
    const session = await toolkit.connectMusic({
      onmessage: async (message) => {
        // Process audio chunks (16-bit PCM, 48kHz, stereo)
        if (message.serverContent?.audioChunks) {
          for (const chunk of message.serverContent.audioChunks) {
            const audioBuffer = Buffer.from(chunk.data, 'base64');
            // Play audio using speaker library or Web Audio API
            // speaker.write(audioBuffer); // Node.js
            // audioContext.decodeAudioData(audioBuffer); // Browser
          }
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Session closed')
    });
    
    // Set initial prompts
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'minimal techno', weight: 1.0 }
      ]
    });
    
    // Set generation config
    await session.setMusicGenerationConfig({
      musicGenerationConfig: {
        bpm: 90,
        temperature: 1.0,
        audioFormat: 'pcm16',
        sampleRateHz: 48000
      }
    });
    
    // Start generating music
    await session.play();
  `);

  // Example 2: Multiple weighted prompts
  console.log('\n2️⃣ Multiple Weighted Prompts:');
  console.log(`
    // Blend multiple musical influences
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Piano', weight: 2.0 },
        { text: 'Meditation', weight: 0.5 },
        { text: 'Live Performance', weight: 1.0 }
      ]
    });
    
    // Or combine instruments and genres
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Harmonica', weight: 0.3 },
        { text: 'Afrobeat', weight: 0.7 }
      ]
    });
  `);

  // Example 3: Real-time steering
  console.log('\n3️⃣ Real-time Music Steering:');
  console.log(`
    // Gradually transition music by updating prompts
    // Start with one style
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Acid Jazz', weight: 1.0 }
      ]
    });
    
    // Gradually transition (implement cross-fading)
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Acid Jazz', weight: 0.7 },
        { text: 'Deep House', weight: 0.3 }
      ]
    });
    
    // Continue transition
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Acid Jazz', weight: 0.3 },
        { text: 'Deep House', weight: 0.7 }
      ]
    });
    
    // Complete transition
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'Deep House', weight: 1.0 }
      ]
    });
  `);

  // Example 4: Complete configuration
  console.log('\n4️⃣ Complete Music Generation Configuration:');
  console.log(`
    const musicConfig: MusicGenerationConfig = {
      // Guidance: How strictly model follows prompts (0.0-6.0, default: 4.0)
      guidance: 4.0,
      
      // BPM: Beats Per Minute (60-200)
      bpm: 120,
      
      // Density: Density of musical notes (0.0-1.0)
      density: 0.75,
      
      // Brightness: Tonal quality (0.0-1.0)
      brightness: 0.6,
      
      // Scale: Musical scale/key
      scale: 'C_MAJOR_A_MINOR',
      
      // Mute options
      muteBass: false,
      muteDrums: false,
      onlyBassAndDrums: false,
      
      // Generation mode
      musicGenerationMode: 'QUALITY', // or 'DIVERSITY' or 'VOCALIZATION'
      
      // Classic parameters
      temperature: 1.1, // 0.0-3.0, default: 1.1
      topK: 40, // 1-1000, default: 40
      seed: 12345, // 0-2147483647, optional
      
      // Audio format
      audioFormat: 'pcm16',
      sampleRateHz: 48000
    };
    
    await session.setMusicGenerationConfig({
      musicGenerationConfig: musicConfig
    });
  `);

  // Example 5: Playback control
  console.log('\n5️⃣ Playback Control:');
  console.log(`
    // Start/resume music generation
    await session.play();
    
    // Pause music generation
    await session.pause();
    
    // Resume
    await session.play();
    
    // Stop music generation
    await session.stop();
    
    // Reset context (required after BPM/scale changes)
    await session.resetContext();
  `);

  // Example 6: Updating configuration
  console.log('\n6️⃣ Updating Configuration:');
  console.log(`
    // Update BPM (requires resetContext)
    await session.setMusicGenerationConfig({
      musicGenerationConfig: {
        bpm: 128,
        scale: 'D_MAJOR_B_MINOR',
        musicGenerationMode: 'QUALITY'
      }
    });
    await session.resetContext(); // Required for BPM/scale changes
    
    // Update other parameters (no reset needed)
    await session.setMusicGenerationConfig({
      musicGenerationConfig: {
        density: 0.8,
        brightness: 0.7,
        temperature: 1.2
      }
    });
  `);

  // Example 7: Prompt examples
  console.log('\n7️⃣ Prompt Examples:');
  console.log(`
    // Instruments
    { text: '303 Acid Bass', weight: 1.0 }
    { text: '808 Hip Hop Beat', weight: 1.0 }
    { text: 'Flamenco Guitar', weight: 1.0 }
    { text: 'Sitar', weight: 1.0 }
    { text: 'Moog Oscillations', weight: 1.0 }
    
    // Genres
    { text: 'Acid Jazz', weight: 1.0 }
    { text: 'Minimal Techno', weight: 1.0 }
    { text: 'Lo-Fi Hip Hop', weight: 1.0 }
    { text: 'Jazz Fusion', weight: 1.0 }
    { text: 'Synthpop', weight: 1.0 }
    
    // Moods/Descriptions
    { text: 'Ambient', weight: 1.0 }
    { text: 'Dreamy', weight: 1.0 }
    { text: 'Funky', weight: 1.0 }
    { text: 'Psychedelic', weight: 1.0 }
    { text: 'Upbeat', weight: 1.0 }
    { text: 'Live Performance', weight: 1.0 }
  `);

  // Example 8: Complete workflow
  console.log('\n8️⃣ Complete Workflow:');
  console.log(`
    // 1. Connect to music session
    const session = await toolkit.connectMusic({
      onmessage: async (message) => {
        if (message.serverContent?.audioChunks) {
          for (const chunk of message.serverContent.audioChunks) {
            const audioBuffer = Buffer.from(chunk.data, 'base64');
            // Play audio
          }
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Session closed')
    });
    
    // 2. Set initial prompts
    await session.setWeightedPrompts({
      weightedPrompts: [
        { text: 'minimal techno with deep bass', weight: 1.0 }
      ]
    });
    
    // 3. Set initial config
    await session.setMusicGenerationConfig({
      musicGenerationConfig: {
        bpm: 90,
        temperature: 1.0,
        audioFormat: 'pcm16',
        sampleRateHz: 48000
      }
    });
    
    // 4. Start generating
    await session.play();
    
    // 5. Steer music in real-time
    setTimeout(async () => {
      await session.setWeightedPrompts({
        weightedPrompts: [
          { text: 'minimal techno', weight: 0.5 },
          { text: 'atmospheric synths', weight: 0.5 }
        ]
      });
    }, 10000);
    
    // 6. Update config
    setTimeout(async () => {
      await session.setMusicGenerationConfig({
        musicGenerationConfig: {
          density: 0.8,
          brightness: 0.7
        }
      });
    }, 20000);
    
    // 7. Stop when done
    setTimeout(async () => {
      await session.stop();
    }, 60000);
  `);

  console.log('\n✅ Lyria RealTime Music Generation examples completed!');
  console.log('\n💡 Tips:');
  console.log('   - Implement robust audio buffering for smooth playback');
  console.log('   - Use gradual weight transitions for smooth music changes');
  console.log('   - Reset context after BPM or scale changes');
  console.log('   - Experiment with different prompt combinations');
  console.log('   - Output is 16-bit PCM, 48kHz, stereo');
  console.log('   - Prompts are checked by safety filters');
  console.log('   - Output audio is watermarked');
  console.log('   - Model generates instrumental music only');
  console.log('\n📚 Prompt Guide:');
  console.log('   - Instruments: 303 Acid Bass, Flamenco Guitar, Sitar, Moog, etc.');
  console.log('   - Genres: Acid Jazz, Minimal Techno, Lo-Fi Hip Hop, etc.');
  console.log('   - Moods: Ambient, Dreamy, Funky, Psychedelic, Upbeat, etc.');
}

main().catch(console.error);

