/**
 * Example: Live API Session Management
 * 
 * Demonstrates session management features:
 * - Context window compression for longer sessions
 * - Session resumption across connection resets
 * - Handling GoAway messages
 * - Generation complete detection
 * - VAD configuration
 * - Thinking configuration
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Live API Session Management Examples ===\n');
  console.log('Note: Live API requires a browser environment.\n');
  console.log('This example shows the API structure.\n');

  // Example 1: Context window compression
  console.log('1️⃣ Context Window Compression (Extended Sessions):');
  console.log(`
    // Enable compression to extend sessions beyond 15 minutes
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle messages
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      contextWindowCompression: {
        slidingWindow: {},
        triggerTokens: 100000 // Compress when reaching 100k tokens
      }
    });
  `);

  // Example 2: Session resumption
  console.log('\n2️⃣ Session Resumption:');
  console.log(`
    let sessionHandle: string | null = null;
    
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Save resumption handle
        if (message.sessionResumptionUpdate?.resumable && 
            message.sessionResumptionUpdate?.newHandle) {
          sessionHandle = message.sessionResumptionUpdate.newHandle;
          console.log('Session handle updated:', sessionHandle);
          // Store this handle for later use
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => {
        console.log('Disconnected');
        // Connection closed, but session can be resumed
      }
    }, {
      sessionResumption: {
        handle: sessionHandle // null for new session, handle for resuming
      }
    });
    
    // Later, resume the session
    const resumedSession = await toolkit.connectLive({
      onopen: () => console.log('Resumed session'),
      onmessage: async (message) => {},
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      sessionResumption: {
        handle: sessionHandle // Resume with saved handle
      }
    });
  `);

  // Example 3: Handling GoAway messages
  console.log('\n3️⃣ Handling GoAway Messages:');
  console.log(`
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Server warns before connection termination
        if (message.goAway) {
          console.log('Connection closing soon!');
          console.log('Time left:', message.goAway.timeLeft);
          
          // Take action before connection closes:
          // - Save session state
          // - Prepare for reconnection
          // - Notify user
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    });
  `);

  // Example 4: Generation complete detection
  console.log('\n4️⃣ Generation Complete Detection:');
  console.log(`
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        if (message.serverContent?.generationComplete) {
          console.log('Model finished generating response');
          // Can now send next message
        }
        
        // Also check turnComplete
        if (message.serverContent?.turnComplete) {
          console.log('Turn complete');
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    });
  `);

  // Example 5: VAD configuration
  console.log('\n5️⃣ Voice Activity Detection (VAD) Configuration:');
  console.log(`
    // Configure automatic VAD
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle interruptions
        if (message.serverContent?.interrupted) {
          console.log('Generation was interrupted');
          // Stop audio playback, clear queue
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: false, // Enable automatic VAD
          startOfSpeechSensitivity: 'START_SENSITIVITY_LOW',
          endOfSpeechSensitivity: 'END_SENSITIVITY_LOW',
          prefixPaddingMs: 20,
          silenceDurationMs: 100
        }
      }
    });
    
    // Or disable automatic VAD (manual control)
    const manualVADSession = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {},
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      realtimeInputConfig: {
        automaticActivityDetection: {
          disabled: true // Manual VAD control
        }
      }
    });
    
    // Manual VAD: Send activity start/end
    // manualVADSession.sendRealtimeInput({ activityStart: {} });
    // manualVADSession.sendRealtimeInput({ audio: audioData });
    // manualVADSession.sendRealtimeInput({ activityEnd: {} });
  `);

  // Example 6: Thinking configuration
  console.log('\n6️⃣ Thinking Configuration:');
  console.log(`
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle responses with thinking
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      thinkingConfig: {
        thinkingBudget: 1024, // Tokens for thinking
        includeThoughts: true // Include thought summaries
      }
    });
  `);

  // Example 7: Affective dialog and proactive audio
  console.log('\n7️⃣ Advanced Features (v1alpha):');
  console.log(`
    // Affective dialog - adapts to user's tone
    const affectiveSession = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {},
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      enableAffectiveDialog: true // Requires v1alpha API
    });
    
    // Proactive audio - model decides when to respond
    const proactiveSession = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {},
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      proactivity: {
        proactiveAudio: true
      }
    });
  `);

  // Example 8: Complete session with all features
  console.log('\n8️⃣ Complete Session Configuration:');
  console.log(`
    let sessionHandle: string | null = null;
    
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle session resumption
        if (message.sessionResumptionUpdate?.newHandle) {
          sessionHandle = message.sessionResumptionUpdate.newHandle;
        }
        
        // Handle GoAway
        if (message.goAway) {
          console.log('Connection closing:', message.goAway.timeLeft);
        }
        
        // Handle generation complete
        if (message.serverContent?.generationComplete) {
          console.log('Generation complete');
        }
        
        // Handle interruptions
        if (message.serverContent?.interrupted) {
          console.log('Interrupted');
        }
        
        // Handle tool calls
        if (message.toolCall) {
          // Handle function calls
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      // Tools
      tools: [{ googleSearch: {} }],
      
      // Audio transcriptions
      inputAudioTranscription: true,
      outputAudioTranscription: true,
      
      // Session management
      contextWindowCompression: {
        slidingWindow: {},
        triggerTokens: 100000
      },
      sessionResumption: {
        handle: sessionHandle
      },
      
      // VAD
      realtimeInputConfig: {
        automaticActivityDetection: {
          startOfSpeechSensitivity: 'START_SENSITIVITY_LOW',
          endOfSpeechSensitivity: 'END_SENSITIVITY_LOW'
        }
      },
      
      // Thinking
      thinkingConfig: {
        thinkingBudget: 1024,
        includeThoughts: false
      },
      
      // Media resolution
      mediaResolution: 'MEDIA_RESOLUTION_LOW',
      
      // Temperature
      temperature: 0.7
    });
  `);

  console.log('\n✅ Live API Session Management examples completed!');
  console.log('\n💡 Tips:');
  console.log('   - Context compression extends sessions beyond 15 minutes');
  console.log('   - Session resumption tokens valid for 2 hours');
  console.log('   - GoAway messages warn before connection termination');
  console.log('   - VAD allows natural interruptions');
  console.log('   - Thinking config available for native audio models');
  console.log('   - Affective dialog and proactive audio require v1alpha API');
}

main().catch(console.error);

