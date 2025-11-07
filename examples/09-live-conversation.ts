/**
 * Example: Live Conversation
 * 
 * Demonstrates real-time audio conversations with Gemini.
 * Note: This requires browser environment for audio capture/playback.
 * For Node.js, this is a conceptual example showing the API structure.
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';

/**
 * Browser-only example for live conversations
 * This requires:
 * - Browser environment (not Node.js)
 * - Microphone access
 * - Audio context APIs
 */
function browserLiveConversationExample() {
  console.log(`
    // Browser-only code example:
    
    const toolkit = new GeminiToolkit({ apiKey: 'your-api-key' });
    
    let liveSession: any = null;
    let inputAudioContext: AudioContext | null = null;
    let outputAudioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;
    
    async function startLiveConversation() {
      // Initialize audio contexts
      inputAudioContext = new AudioContext({ sampleRate: 16000 });
      outputAudioContext = new AudioContext({ sampleRate: 24000 });
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream = stream;
      
      // Connect to live session
      liveSession = await toolkit.connectLive({
        onopen: () => {
          console.log('Live session opened');
          
          // Set up audio processing
          const source = inputAudioContext!.createMediaStreamSource(stream);
          const processor = inputAudioContext!.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            // Convert to PCM and send to session
            // (Implementation details for encoding)
          };
          
          source.connect(processor);
          processor.connect(inputAudioContext!.destination);
        },
        onmessage: async (message) => {
          // Handle incoming audio
          const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData) {
            // Decode and play audio
            // (Implementation details for decoding)
          }
          
          // Handle transcriptions
          if (message.serverContent?.inputTranscription) {
            console.log('You:', message.serverContent.inputTranscription.text);
          }
          if (message.serverContent?.outputTranscription) {
            console.log('Assistant:', message.serverContent.outputTranscription.text);
          }
        },
        onerror: (event) => {
          console.error('Live session error:', event);
        },
        onclose: () => {
          console.log('Live session closed');
          // Clean up audio contexts and streams
        },
      });
    }
    
    function stopLiveConversation() {
      if (liveSession) {
        liveSession.close();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (inputAudioContext) {
        inputAudioContext.close();
      }
      if (outputAudioContext) {
        outputAudioContext.close();
      }
    }
  `);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Live Conversation Examples ===\n');
  console.log('Note: Live conversations require a browser environment.\n');
  console.log('This example shows the API structure. For full implementation,');
  console.log('see the browser code example below.\n');

  // Example 1: Basic live conversation setup
  console.log('1. Basic live conversation setup:');
  console.log(`
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle messages
      },
      onerror: (event) => console.error('Error:', event),
      onclose: (event) => console.log('Disconnected'),
    });
  `);

  // Example 2: With custom voice
  console.log('\n2. Custom voice configuration:');
  console.log(`
    const session = await toolkit.connectLive(
      {
        onopen: () => {},
        onmessage: async (message) => {},
        onerror: (event) => {},
        onclose: (event) => {},
      },
      {
        voiceName: 'Zephyr', // or 'Kore'
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      }
    );
  `);

  // Example 3: Handling transcriptions
  console.log('\n3. Handling transcriptions:');
  console.log(`
    const session = await toolkit.connectLive({
      onopen: () => {},
      onmessage: async (message) => {
        // User transcription
        if (message.serverContent?.inputTranscription) {
          const userText = message.serverContent.inputTranscription.text;
          console.log('User said:', userText);
        }
        
        // Model transcription
        if (message.serverContent?.outputTranscription) {
          const modelText = message.serverContent.outputTranscription.text;
          console.log('Assistant said:', modelText);
        }
        
        // Turn complete
        if (message.serverContent?.turnComplete) {
          console.log('Turn complete');
        }
      },
      onerror: (event) => {},
      onclose: (event) => {},
    });
  `);

  // Example 4: Error handling
  console.log('\n4. Error handling:');
  console.log(`
    try {
      const session = await toolkit.connectLive({
        onopen: () => console.log('Connected'),
        onmessage: async (message) => {
          try {
            // Process message
          } catch (error) {
            console.error('Error processing message:', error);
          }
        },
        onerror: (event) => {
          console.error('Session error:', event.message || event.error);
          // Handle reconnection if needed
        },
        onclose: (event) => {
          if (!event.wasClean) {
            console.error('Unexpected close:', event.reason);
          }
        },
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error('Invalid configuration:', error.message);
      } else if (error instanceof ApiRequestError) {
        console.error('API error:', error.message);
      }
    }
  `);

  // Example 5: Complete browser implementation
  console.log('\n5. Complete browser implementation:');
  browserLiveConversationExample();

  console.log('\n\nNote: Live conversations require:');
  console.log('- Browser environment (not Node.js)');
  console.log('- Microphone permissions');
  console.log('- AudioContext API support');
  console.log('- Proper audio encoding/decoding (PCM format)');
}

main().catch(console.error);

