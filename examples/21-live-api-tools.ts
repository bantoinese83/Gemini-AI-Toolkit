/**
 * Example: Live API with Tools
 * 
 * Demonstrates using function calling and Google Search with the Live API.
 * Note: This requires browser environment for audio capture/playback.
 * For Node.js, this is a conceptual example showing the API structure.
 */

import { GeminiToolkit, FunctionDeclaration, LiveTool } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Live API with Tools Examples ===\n');
  console.log('Note: Live API requires a browser environment.\n');
  console.log('This example shows the API structure.\n');

  // Example 1: Function calling
  console.log('1️⃣ Function Calling with Live API:');
  console.log(`
    const turnOnLights: FunctionDeclaration = {
      name: 'turn_on_the_lights',
      description: 'Turn on the lights in the room'
    };
    
    const turnOffLights: FunctionDeclaration = {
      name: 'turn_off_the_lights',
      description: 'Turn off the lights in the room',
      behavior: 'NON_BLOCKING' // Run asynchronously
    };
    
    const tools: LiveTool[] = [{
      functionDeclarations: [turnOnLights, turnOffLights]
    }];
    
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle tool calls
        if (message.toolCall) {
          console.log('Tool called:', message.toolCall.functionCalls);
          
          const functionResponses = [];
          for (const fc of message.toolCall.functionCalls) {
            // Execute function based on name
            let result = { result: 'ok' };
            if (fc.name === 'turn_on_the_lights') {
              // Your implementation here
              result = { result: 'Lights turned on' };
            } else if (fc.name === 'turn_off_the_lights') {
              result = { result: 'Lights turned off' };
            }
            
            functionResponses.push({
              id: fc.id,
              name: fc.name,
              response: result
            });
          }
          
          // Send function responses
          await session.sendToolResponse({ functionResponses });
        }
        
        // Handle audio/text responses
        if (message.serverContent) {
          // Process response
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      tools: tools
    });
    
    // Send a prompt that triggers function call
    session.sendClientContent({
      turns: 'Turn on the lights please',
      turnComplete: true
    });
  `);

  // Example 2: Asynchronous function calling
  console.log('\n2️⃣ Asynchronous Function Calling:');
  console.log(`
    // Non-blocking function
    const asyncFunction: FunctionDeclaration = {
      name: 'check_weather',
      behavior: 'NON_BLOCKING' // Won't block conversation
    };
    
    // In function response, specify scheduling
    const functionResponse = {
      id: fc.id,
      name: fc.name,
      response: {
        result: { temperature: 72, condition: 'sunny' },
        scheduling: 'INTERRUPT' // Tell model immediately
        // Or 'WHEN_IDLE' - wait until finished
        // Or 'SILENT' - use knowledge later
      }
    };
  `);

  // Example 3: Google Search grounding
  console.log('\n3️⃣ Google Search Grounding:');
  console.log(`
    const tools: LiveTool[] = [{
      googleSearch: {}
    }];
    
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle search results
        if (message.serverContent?.modelTurn?.parts) {
          for (const part of message.serverContent.modelTurn.parts) {
            // Model may generate Python code to use Search
            if (part.executableCode) {
              console.log('Generated code:', part.executableCode.code);
            }
            
            // Code execution results
            if (part.codeExecutionResult) {
              console.log('Execution result:', part.codeExecutionResult.output);
            }
            
            // Audio data
            if (part.inlineData?.data) {
              // Process audio
            }
          }
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      tools: tools
    });
    
    // Ask a question that requires search
    session.sendClientContent({
      turns: 'When did the last Brazil vs. Argentina soccer match happen?',
      turnComplete: true
    });
  `);

  // Example 4: Combining multiple tools
  console.log('\n4️⃣ Combining Multiple Tools:');
  console.log(`
    const tools: LiveTool[] = [
      { googleSearch: {} },
      {
        functionDeclarations: [
          { name: 'turn_on_lights' },
          { name: 'turn_off_lights' }
        ]
      }
    ];
    
    const session = await toolkit.connectLive({
      onopen: () => console.log('Connected'),
      onmessage: async (message) => {
        // Handle both search and function calls
        if (message.toolCall) {
          // Handle function calls
        }
        if (message.serverContent?.modelTurn) {
          // Handle search results
        }
      },
      onerror: (error) => console.error('Error:', error),
      onclose: () => console.log('Disconnected')
    }, {
      tools: tools
    });
    
    // Use both tools in one prompt
    session.sendClientContent({
      turns: \`Hey, I need you to do two things:
      1. Use Google Search to look up the largest earthquake in California the week of Dec 5 2024
      2. Then turn on the lights\`,
      turnComplete: true
    });
  `);

  console.log('\n✅ Live API Tools examples completed!');
  console.log('\n💡 Tips:');
  console.log('   - Function calling requires manual handling in onmessage callback');
  console.log('   - Use sendToolResponse() to respond to function calls');
  console.log('   - NON_BLOCKING functions run asynchronously');
  console.log('   - Google Search may generate executable code');
  console.log('   - You can combine multiple tools in one session');
  console.log('   - Browser environment required for full audio functionality');
}

main().catch(console.error);

