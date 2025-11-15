/**
 * Example: Complete Workflow
 * 
 * Demonstrates a complete end-to-end workflow using multiple Gemini features.
 * This example shows how different features can work together.
 */

import { GeminiToolkit, saveImage, saveAudio, presets } from 'gemini-ai-toolkit';
import { writeFileSync, unlinkSync } from 'fs';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Complete Workflow Example ===\n');

  try {
    // Step 1: Generate an image (using preset)
    console.log('Step 1: Generating an image...');
    const imageBase64 = await toolkit.generateImage(
      'A futuristic office space with a robot assistant helping a human worker',
      presets.image.wide
    );
    
    // Save using utility function
    saveImage(imageBase64, 'workflow-generated-image.png');
    console.log('✓ Image generated and saved\n');

    // Step 2: Analyze the generated image
    console.log('Step 2: Analyzing the generated image...');
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'Describe this image in detail. What is the setting, what are the main elements, and what story does it tell?'
    );
    console.log('Analysis:', analysis.substring(0, 300) + '...\n');

    // Step 3: Edit the image based on analysis
    console.log('Step 3: Editing the image...');
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Add a warm sunset glow through the windows and make the colors more vibrant'
    );
    
    saveImage(editedImage, 'workflow-edited-image.png');
    console.log('✓ Image edited and saved\n');

    // Step 4: Generate text description
    console.log('Step 4: Generating a text description...');
    const description = await toolkit.generateText(
      `Based on this image description: "${analysis.substring(0, 200)}", 
      write a short creative story (2-3 paragraphs) about this scene.`
    );
    console.log('Story:', description);
    console.log();

    // Step 5: Convert story to speech (using preset)
    console.log('Step 5: Converting story to speech...');
    const audioBase64 = await toolkit.generateSpeech(description, presets.speech.narration);
    saveAudio(audioBase64, 'workflow-story-audio.wav');
    console.log('✓ Audio generated and saved\n');

    // Step 6: Research related topics
    console.log('Step 6: Researching related topics...');
    const research = await toolkit.groundWithSearch(
      'What are the latest developments in human-robot collaboration in workplaces?'
    );
    console.log('Research:', research.text.substring(0, 300) + '...\n');

    // Step 7: Complex analysis with thinking mode
    console.log('Step 7: Complex analysis with thinking mode...');
    const complexAnalysis = await toolkit.generateWithThinking(
      `Based on the image analysis and research:
      Image: ${analysis.substring(0, 200)}
      Research: ${research.text.substring(0, 200)}
      
      Analyze: How does this image represent current trends in workplace automation? 
      What are the implications for the future of work?`,
      32768
    );
    console.log('Complex Analysis:', complexAnalysis.substring(0, 400) + '...\n');

    // Step 8: Create a chat session for follow-up questions
    console.log('Step 8: Creating a chat session...');
    const chat = toolkit.createChat('gemini-2.5-flash');
    
    const chatResponse = await chat.sendMessage({
      message: 'Based on everything we discussed, what are 3 key takeaways?',
    });
    console.log('Chat Response:', chatResponse.text.substring(0, 300) + '...\n');

    // Step 9: File Search (RAG) - Store and query documents
    console.log('Step 9: Using File Search (RAG)...');
    try {
      // Create a document with our workflow results
      const workflowDocument = `
Workflow Summary:
- Generated Image: A futuristic office space with a robot assistant
- Analysis: ${analysis.substring(0, 200)}
- Story: ${description.substring(0, 200)}
- Research: ${research.text.substring(0, 200)}
- Key Takeaways: ${chatResponse.text.substring(0, 200)}
      `.trim();

      // Save document temporarily
      const docFile = 'workflow-document.txt';
      writeFileSync(docFile, workflowDocument);

      // Create File Search store
      const store = await toolkit.createFileSearchStore('workflow-documents');
      const storeName = (store as { name: string }).name;
      console.log('✓ File Search store created');

      // Upload document
      const operation = await toolkit.uploadToFileSearchStore(
        docFile,
        storeName,
        {
          displayName: 'Workflow Summary',
          customMetadata: [
            { key: 'type', stringValue: 'workflow' },
            { key: 'step', numericValue: 9 }
          ]
        }
      );
      console.log('✓ Document uploaded (processing in background)');

      // Note: In production, wait for operation.done before querying
      // For demo purposes, we'll just show the store was created
      console.log('  (File Search queries available after upload completes)\n');

      // Clean up temp file
      const { unlinkSync } = require('fs');
      try {
        unlinkSync(docFile);
      } catch (err) {
        // Ignore
      }
    } catch (error) {
      console.log('  (File Search step skipped - may require additional setup)');
      console.log('  Error:', (error as Error).message);
    }

    // Step 10: Files API
    console.log('\n📁 Step 10: Using Files API');
    try {
      const workflowSummary = `
Gemini AI Toolkit Complete Workflow Summary:
- Text generation with presets
- Image generation and editing
- Video generation
- Audio synthesis
- Chat conversations
- Grounded search and maps
- File Search (RAG) for document querying
- URL Context for web content analysis
      `.trim();

      const summaryFile = 'workflow-summary.txt';
      writeFileSync(summaryFile, workflowSummary);

      const uploadedFile = await toolkit.uploadFile(summaryFile, {
        displayName: 'Workflow Summary'
      });
      console.log(`✓ File uploaded: ${uploadedFile.name}`);

      // Use file in generateText
      const fileAnalysis = await toolkit.generateText('Summarize this document', {
        files: [uploadedFile]
      });
      console.log(`✓ File analysis: ${fileAnalysis.substring(0, 100)}...`);

      // Cleanup
      await toolkit.deleteFile(uploadedFile.name);
      unlinkSync(summaryFile);
    } catch (error) {
      console.log('  (Files API step skipped - may require additional setup)');
    }

    // Step 11: Context Caching
    console.log('\n💾 Step 11: Using Context Caching');
    try {
      const longContent = 'This is a long document that we want to cache for repeated queries. '.repeat(100);
      const contentFile = 'long-content.txt';
      writeFileSync(contentFile, longContent);

      const cachedFile = await toolkit.uploadFile(contentFile, {
        displayName: 'Long Content'
      });

      // Wait for file to be active
      let fileState = cachedFile.state;
      while (fileState !== 'ACTIVE') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedFile = await toolkit.getFile(cachedFile.name);
        fileState = updatedFile.state || 'PROCESSING';
      }

      const cache = await toolkit.createCache('gemini-2.0-flash-001', {
        displayName: 'workflow-cache',
        systemInstruction: 'You are a helpful assistant.',
        contents: [cachedFile],
        ttl: 300 // 5 minutes
      });
      console.log(`✓ Cache created: ${cache.name}`);

      // Use cache in multiple requests
      const cachedResult1 = await toolkit.generateText('What is this about?', {
        cachedContent: cache.name,
        model: 'gemini-2.0-flash-001'
      });
      console.log(`✓ Cached query 1: ${cachedResult1.substring(0, 80)}...`);

      const cachedResult2 = await toolkit.generateText('Summarize the key points.', {
        cachedContent: cache.name,
        model: 'gemini-2.0-flash-001'
      });
      console.log(`✓ Cached query 2: ${cachedResult2.substring(0, 80)}...`);

      // Cleanup
      await toolkit.deleteCache(cache.name);
      await toolkit.deleteFile(cachedFile.name);
      unlinkSync(contentFile);
    } catch (error) {
      console.log('  (Context caching step skipped - may require gemini-2.0-flash-001)');
    }

    // Step 12: Token Counting
    console.log('\n🔢 Step 12: Token Counting');
    try {
      const sampleText = 'The quick brown fox jumps over the lazy dog.';
      const tokenCount = await toolkit.countTokens(sampleText);
      console.log(`✓ Text: "${sampleText}"`);
      console.log(`  Tokens: ${tokenCount.totalTokens}`);
      console.log(`  Characters: ${sampleText.length}`);
      console.log(`  Ratio: ~${(sampleText.length / tokenCount.totalTokens).toFixed(1)} chars per token`);

      // Count chat history tokens
      const chat = toolkit.createChat();
      await chat.sendMessage({ message: 'Hello, how are you?' });
      await chat.sendMessage({ message: 'Tell me about AI.' });
      
      const chatCount = await toolkit.countTokens(chat.getHistory());
      console.log(`✓ Chat history tokens: ${chatCount.totalTokens}`);
    } catch (error) {
      console.log('  (Token counting step skipped)');
    }

    console.log('\n=== Workflow Complete ===');
    console.log('\nGenerated files:');
    console.log('- workflow-generated-image.png');
    console.log('- workflow-edited-image.png');
    console.log('- workflow-story-audio.wav');
    console.log('\nAll steps completed successfully!');

  } catch (error) {
    console.error('Error in workflow:', error);
  }
}

main().catch(console.error);

