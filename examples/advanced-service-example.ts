/**
 * Advanced Service-Based Architecture Example
 *
 * This example demonstrates advanced usage patterns with the new service-based
 * architecture, including file search (RAG), live conversations, and
 * comprehensive error handling.
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
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  const { coreAI, chat, grounding, fileSearch, files, cache, tokens } = toolkit;

  console.log('🚀 Advanced Gemini Toolkit Example\n');

  try {
    // ===== ADVANCED TEXT GENERATION WITH THINKING =====
    console.log('🤔 Advanced Text Generation:');

    const thinkingResponse = await coreAI.generateText(
      'Design a microservices architecture for an e-commerce platform. Include service boundaries, communication patterns, and scalability considerations.',
      {
        model: 'gemini-2.5-pro',
        thinkingConfig: {
          includeThoughts: true,
          budgetTokens: 1024
        },
        config: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      }
    );
    console.log('Thinking-enabled response preview:');
    console.log(thinkingResponse.substring(0, 200) + '...\n');

    // ===== MULTIMODAL CONTENT ANALYSIS =====
    console.log('🖼️  Multimodal Analysis:');

    // Generate an image first
    const diagramImage = await coreAI.generateImage(
      'A detailed microservices architecture diagram with API gateways, service mesh, and databases',
      {
        aspectRatio: '16:9',
        style: 'natural',
        quality: 'standard'
      }
    );

    // Analyze the generated image
    const analysis = await coreAI.analyzeMedia(
      diagramImage,
      'image/jpeg',
      'Describe this architecture diagram in detail. What components do you see and how do they interact?',
      { model: 'gemini-2.5-flash' }
    );
    console.log('Image analysis:', analysis.substring(0, 150) + '...\n');

    // ===== COMPREHENSIVE GROUNDING =====
    console.log('🌐 Advanced Grounding:');

    // Grounded search with maps
    const locationQuery = await grounding.groundWithMaps(
      'Find the best rated coffee shops within 2 miles of Times Square, Manhattan',
      { latitude: 40.7580, longitude: -73.9855 },
      'gemini-2.5-flash'
    );
    console.log('Location-based results:', locationQuery.text?.substring(0, 100) + '...\n');

    // URL context analysis
    const urlAnalysis = await grounding.generateWithUrlContextAndSearch(
      'Analyze the current state of AI tooling and compare it with traditional software development practices',
      'gemini-2.5-pro'
    );
    console.log('URL + Search analysis:', urlAnalysis.text?.substring(0, 150) + '...\n');

    // ===== FILE SEARCH (RAG) WORKFLOW =====
    console.log('📚 File Search (RAG) Workflow:');

    // Create a file search store
    const docStore = await fileSearch.createFileSearchStore('architecture-docs');
    console.log('📁 Created document store:', docStore.name);

    // Create a sample document for demonstration
    const sampleDoc = `
# Service-Based Architecture Guide

## Overview
Service-based architecture (SBA) is a design approach where applications are composed of loosely coupled services that communicate through well-defined interfaces.

## Benefits
- **Scalability**: Individual services can be scaled independently
- **Maintainability**: Changes to one service don't affect others
- **Technology Diversity**: Different services can use different technologies
- **Team Autonomy**: Teams can work on different services independently

## Implementation Patterns
1. **API Gateway Pattern**: Single entry point for client requests
2. **Service Mesh**: Manages service-to-service communication
3. **Circuit Breaker**: Prevents cascading failures
4. **Saga Pattern**: Manages distributed transactions

## Best Practices
- Design services around business capabilities
- Use asynchronous communication when possible
- Implement comprehensive monitoring and logging
- Plan for service discovery and load balancing
`;

    // Save sample document
    const tempDocPath = path.join(__dirname, 'sample-architecture-guide.md');
    fs.writeFileSync(tempDocPath, sampleDoc);

    try {
      // Upload document to file search store
      const uploadOp = await fileSearch.uploadToFileSearchStore(
        tempDocPath,
        docStore.name,
        {
          mimeType: 'text/markdown',
          displayName: 'Service Architecture Guide'
        }
      );
      console.log('📤 Document uploaded, operation:', uploadOp.name);

      // Wait for processing (simplified polling)
      console.log('⏳ Waiting for document processing...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Query the document store
      const docQuery = await fileSearch.queryWithFileSearch(
        'What are the main benefits of service-based architecture and what implementation patterns should I consider?',
        {
          fileSearchStoreNames: [docStore.name],
          maxNumResults: 3,
          resultThreshold: 0.5
        },
        'gemini-2.5-flash'
      );
      console.log('📖 Document query result:');
      console.log(docQuery.text?.substring(0, 200) + '...\n');

    } finally {
      // Clean up temp file
      if (fs.existsSync(tempDocPath)) {
        fs.unlinkSync(tempDocPath);
      }
    }

    // ===== CONTEXT CACHING FOR EFFICIENCY =====
    console.log('💾 Context Caching:');

    // Create a specialized cache for architecture discussions
    const architectureCache = await cache.createCache('gemini-2.5-flash', {
      systemInstruction: `You are an expert software architect specializing in service-based architectures.
      Always consider scalability, maintainability, and best practices in your responses.`,
      contents: [
        {
          role: 'user',
          parts: [{ text: 'What is service-based architecture?' }]
        },
        {
          role: 'model',
          parts: [{ text: 'Service-based architecture is a design paradigm where complex applications are built as a collection of loosely coupled services that communicate through well-defined APIs. Each service is responsible for a specific business capability and can be developed, deployed, and scaled independently.' }]
        }
      ],
      ttl: '3600s' // 1 hour
    });
    console.log('🗄️  Architecture cache created:', architectureCache.name);

    // Use cached context for multiple related queries
    const queries = [
      'How do I design service boundaries?',
      'What communication patterns work best?',
      'How do I handle data consistency across services?'
    ];

    for (const query of queries) {
      const response = await coreAI.generateText(query, {
        cachedContent: architectureCache.name,
        config: { temperature: 0.3 }
      });
      console.log(`❓ ${query}`);
      console.log(`💡 ${response.substring(0, 80)}...\n`);
    }

    // ===== TOKEN OPTIMIZATION =====
    console.log('🔢 Token Optimization:');

    // Count tokens for different content types
    const textTokens = await tokens.countTokens(
      'This is a sample text for token counting.',
      'gemini-2.5-flash'
    );

    const multimodalTokens = await tokens.countTokens([
      { text: 'Analyze this architecture diagram:' },
      { inlineData: { mimeType: 'image/jpeg', data: diagramImage } }
    ], 'gemini-2.5-flash');

    console.log('📊 Token counts:');
    console.log(`   Text: ${textTokens.totalTokens} tokens`);
    console.log(`   Multimodal: ${multimodalTokens.totalTokens} tokens\n`);

    // ===== LIVE CONVERSATION SETUP =====
    console.log('🎯 Live Conversation Setup:');

    // Create ephemeral token for live session
    const ephemeralToken = await chat.createEphemeralToken({
      ttl: '1800s', // 30 minutes
      uses: 5
    });
    console.log('🎫 Ephemeral token created:', ephemeralToken.name);

    // Note: Actual live conversation would require WebSocket handling
    // This demonstrates the setup process
    console.log('💬 Live session ready - token expires:', ephemeralToken.expireTime);
    console.log('   (See live-conversation-example.ts for full implementation)\n');

    // ===== CLEANUP =====
    console.log('🧹 Cleanup:');

    // Clean up resources
    await fileSearch.deleteFileSearchStore(docStore.name, true);
    await cache.deleteCache(architectureCache.name);

    console.log('✅ Cleanup completed');
    console.log('\n🎉 Advanced example completed successfully!');
    console.log('💡 This example demonstrated:');
    console.log('   • Service-based architecture usage');
    console.log('   • Advanced text generation with thinking');
    console.log('   • Multimodal content analysis');
    console.log('   • Comprehensive grounding (search + maps)');
    console.log('   • File Search (RAG) workflow');
    console.log('   • Context caching for efficiency');
    console.log('   • Token counting and optimization');
    console.log('   • Live conversation setup');

  } catch (error) {
    console.error('❌ Error in advanced example:', error);

    // Demonstrate error handling
    if (error instanceof Error) {
      console.log('🔍 Error details:');
      console.log('   Name:', error.name);
      console.log('   Message:', error.message);

      // If it's a Gemini toolkit error, it might have additional context
      if ('code' in error) {
        console.log('   Code:', (error as any).code);
      }
    }
  }
}

// Utility function for polling operation status
async function waitForOperation(operationName: string, fileSearch: FileSearchService, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const status = await fileSearch.listFileSearchStores();
      // Check if operation is complete (simplified)
      console.log(`   Attempt ${i + 1}: Checking operation status...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   Operation completed on attempt ${i + 1}`);
      return;
    }
  }
  throw new Error(`Operation ${operationName} did not complete within ${maxAttempts} attempts`);
}

if (require.main === module) {
  main().catch(console.error);
}
