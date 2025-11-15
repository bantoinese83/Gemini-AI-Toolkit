/**
 * Service-Based Architecture Example
 *
 * This example demonstrates the new modular service-based architecture
 * of the Gemini Toolkit, which provides better maintainability and
 * separation of concerns.
 */

import {
  GeminiToolkit,
  CoreAIService,
  ChatService,
  GroundingService,
  FileSearchService,
  FilesService,
  CacheService,
  TokenService
} from '../src/index';

async function main() {
  // Initialize the toolkit once
  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  // Access service instances directly
  const { coreAI, chat, grounding, fileSearch, files, cache, tokens } = toolkit;

  console.log('🚀 Gemini Toolkit - Service-Based Example\n');

  try {
    // ===== CORE AI OPERATIONS =====
    console.log('📝 Core AI Operations:');

    // Text generation
    const text = await coreAI.generateText(
      'Explain the concept of service-oriented architecture in 3 sentences',
      {
        model: 'gemini-2.5-flash',
        config: { temperature: 0.7, maxOutputTokens: 200 }
      }
    );
    console.log('Text Generation:', text.substring(0, 100) + '...\n');

    // Image generation
    const imageB64 = await coreAI.generateImage(
      'A modern web application architecture diagram',
      {
        aspectRatio: '16:9',
        style: 'natural'
      }
    );
    console.log('Image Generated: Base64 length =', imageB64.length, '\n');

    // ===== CHAT CONVERSATIONS =====
    console.log('💬 Chat Operations:');

    // Create a chat session
    const chatSession = chat.createChat('gemini-2.5-flash');
    const response = await chatSession.sendMessage({
      message: 'What are the benefits of modular software design?'
    });
    console.log('Chat Response:', response.text?.substring(0, 100) + '...\n');

    // ===== GROUNDING OPERATIONS =====
    console.log('🔍 Grounding Operations:');

    // Ground with Google Search
    const searchResult = await grounding.groundWithSearch(
      'Latest trends in TypeScript development 2024',
      'gemini-2.5-flash'
    );
    console.log('Grounded Search:', searchResult.text?.substring(0, 100) + '...');
    console.log('Citations:', searchResult.candidates?.[0]?.citationMetadata?.citations?.length || 0, '\n');

    // ===== FILE OPERATIONS =====
    console.log('📁 File Operations:');

    // Upload a file (if you have one)
    // const file = await files.uploadFile('./example.pdf', {
    //   displayName: 'Example Document',
    //   mimeType: 'application/pdf'
    // });
    // console.log('File uploaded:', file.name);

    // List files
    const fileList = await files.listFiles(5);
    console.log('Files count:', fileList.files?.length || 0, '\n');

    // ===== CACHE OPERATIONS =====
    console.log('💾 Cache Operations:');

    // Create a context cache
    const contextCache = await cache.createCache('gemini-2.5-flash', {
      systemInstruction: 'You are an expert software architect.',
      contents: [{
        role: 'user',
        parts: [{ text: 'What is clean architecture?' }]
      }],
      ttl: '1800s' // 30 minutes
    });
    console.log('Cache created:', contextCache.name);

    // Use cached context
    const cachedResponse = await coreAI.generateText(
      'How does it relate to SOLID principles?',
      { cachedContent: contextCache.name }
    );
    console.log('Cached Response:', cachedResponse.substring(0, 100) + '...\n');

    // ===== TOKEN COUNTING =====
    console.log('🔢 Token Operations:');

    // Count tokens
    const tokenCount = await tokens.countTokens(
      'Explain the benefits of service-based architecture',
      'gemini-2.5-flash'
    );
    console.log('Token count:', tokenCount.totalTokens, '\n');

    // ===== ADVANCED: FILE SEARCH (RAG) =====
    console.log('🔎 File Search Operations:');

    // Create a file search store
    const store = await fileSearch.createFileSearchStore('example-docs');
    console.log('File search store created:', store.name);

    // Note: To fully demonstrate file search, you would:
    // 1. Upload files to the store
    // 2. Wait for processing
    // 3. Query the store
    // This is shown in the advanced example

    console.log('\n✨ All operations completed successfully!');
    console.log('💡 Check out the advanced example for more complex use cases.');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}
