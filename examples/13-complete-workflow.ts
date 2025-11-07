/**
 * Example: Complete Workflow
 * 
 * Demonstrates a complete end-to-end workflow using multiple Gemini features.
 * This example shows how different features can work together.
 */

import { GeminiToolkit, saveImage, saveAudio, presets } from 'gemini-ai-toolkit';

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

    console.log('=== Workflow Complete ===');
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

