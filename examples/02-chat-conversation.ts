/**
 * Example: Chat Conversations
 * 
 * Demonstrates creating and managing chat sessions with Gemini.
 * Shows streaming and non-streaming message handling.
 */

import { GeminiToolkit, createChat, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Chat Conversation Examples ===\n');

  // Example 1: Basic chat with non-streaming
  console.log('1. Basic chat conversation:');
  try {
    const chat = toolkit.createChat('gemini-2.5-flash');
    
    const response1 = await chat.sendMessage({ message: 'Hello! What can you help me with?' });
    console.log('User: Hello! What can you help me with?');
    console.log('Assistant:', response1.text);
    console.log();

    const response2 = await chat.sendMessage({ message: 'Tell me a fun fact about space.' });
    console.log('User: Tell me a fun fact about space.');
    console.log('Assistant:', response2.text);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Chat with streaming
  console.log('2. Chat with streaming:');
  try {
    const chat = toolkit.createChat('gemini-2.5-flash');
    
    console.log('User: Write a haiku about programming.');
    console.log('Assistant (streaming): ');
    
    const stream = await chat.sendMessageStream({ message: 'Write a haiku about programming.' });
    
    for await (const chunk of stream) {
      process.stdout.write(chunk.text);
    }
    console.log('\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Multi-turn conversation with context
  console.log('3. Multi-turn conversation:');
  try {
    const chat = toolkit.createChat('gemini-2.5-flash');
    
    // First message
    const response1 = await chat.sendMessage({ 
      message: 'I want to learn about TypeScript. Where should I start?' 
    });
    console.log('User: I want to learn about TypeScript. Where should I start?');
    console.log('Assistant:', response1.text.substring(0, 200) + '...\n');

    // Follow-up question (chat maintains context)
    const response2 = await chat.sendMessage({ 
      message: 'What about advanced features?' 
    });
    console.log('User: What about advanced features?');
    console.log('Assistant:', response2.text.substring(0, 200) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Using different models for chat
  console.log('4. Chat with gemini-2.5-pro for complex discussions:');
  try {
    const chat = toolkit.createChat('gemini-2.5-pro');
    
    const response = await chat.sendMessage({ 
      message: 'Explain the concept of recursion with examples in different programming languages.' 
    });
    console.log('User: Explain the concept of recursion...');
    console.log('Assistant:', response.text.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Using chat presets
  console.log('5. Using chat presets:');
  try {
    const casualChat = toolkit.createChat(presets.chat.casual);
    const casualResponse = await casualChat.sendMessage({ 
      message: 'Hey! What\'s up?' 
    });
    console.log('Casual chat:', casualResponse.text.substring(0, 150) + '...\n');

    const professionalChat = toolkit.createChat(presets.chat.professional);
    const proResponse = await professionalChat.sendMessage({ 
      message: 'Good morning. I need assistance with a technical matter.' 
    });
    console.log('Professional chat:', proResponse.text.substring(0, 150) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 6: Using quick function for chat
  console.log('6. Using quick function to create chat:');
  try {
    const quickChat = createChat();
    const quickResponse = await quickChat.sendMessage({ 
      message: 'Hello from quick function!' 
    });
    console.log('Quick chat:', quickResponse.text.substring(0, 150) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);

