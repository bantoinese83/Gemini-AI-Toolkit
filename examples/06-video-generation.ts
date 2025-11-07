/**
 * Example: Video Generation
 * 
 * Demonstrates generating videos from images using Veo 3.1.
 * Note: Video generation can take several minutes.
 */

import { GeminiToolkit, loadImage, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Video Generation Examples ===\n');
  console.log('Note: Video generation can take 5-10 minutes to complete.\n');

  // Note: You need an input image file for these examples
  // Replace 'input-image.png' with your actual image file path

  // Example 1: Basic video generation (landscape) using preset
  console.log('1. Generating landscape video (16:9) using preset:');
  try {
    const imagePath = 'input-image.png'; // Replace with your image path
    const imageBase64 = await loadImage(imagePath);
    
    const operation = await toolkit.generateVideo(
      imageBase64,
      'image/png',
      'Make the scene come alive with gentle movement - leaves swaying, clouds drifting',
      presets.video.landscape
    );
    
    console.log('Video generation started. Operation:', operation);
    console.log('Poll the operation status to check when it\'s complete.\n');
    console.log('Example polling code:');
    console.log(`
      const client = toolkit.getClient();
      let pollCount = 0;
      let currentOperation = operation;
      
      while (!currentOperation.done && pollCount < 30) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        currentOperation = await client.operations.getVideosOperation({ 
          operation: currentOperation 
        });
        pollCount++;
        console.log(\`Checking status... (Attempt \${pollCount})\`);
      }
      
      if (currentOperation.done) {
        const videoUri = currentOperation.response?.generatedVideos?.[0]?.video?.uri;
        // Download video from URI
      }
    `);
  } catch (error) {
    console.error('Error (make sure input-image.png exists):', error);
  }

  // Example 2: Portrait video (9:16) using preset
  console.log('\n2. Generating portrait video (9:16) using preset:');
  try {
    const imagePath = 'input-image.png';
    const imageBase64 = await loadImage(imagePath);
    
    const operation = await toolkit.generateVideo(
      imageBase64,
      'image/png',
      'Create a smooth zoom-in effect with subtle camera movement',
      presets.video.portrait
    );
    
    console.log('Portrait video generation started.');
    console.log('Operation ID:', operation.name || 'N/A');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: High resolution video using preset
  console.log('\n3. Generating high-resolution video (1080p) using preset:');
  try {
    const imagePath = 'input-image.png';
    const imageBase64 = await loadImage(imagePath);
    
    const operation = await toolkit.generateVideo(
      imageBase64,
      'image/png',
      'Add dynamic motion - objects moving, camera panning smoothly',
      presets.video.landscapeHD
    );
    
    console.log('High-resolution video generation started.');
    console.log('Note: 1080p videos may take longer to generate.');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Different motion types
  console.log('\n4. Different motion prompts:');
  const motionPrompts = [
    'Gentle breeze making fabric flutter',
    'Slow zoom out revealing more of the scene',
    'Objects floating and rotating slowly',
    'Camera panning from left to right',
  ];

  for (const prompt of motionPrompts) {
    try {
      console.log(`\n  Generating: "${prompt}"`);
      const imagePath = 'input-image.png';
      const imageBase64 = await loadImage(imagePath);
      
      const operation = await toolkit.generateVideo(
        imageBase64,
        'image/png',
        prompt,
        presets.video.landscape
      );
      
      console.log(`  ✓ Started: ${prompt.substring(0, 30)}...`);
    } catch (error) {
      console.error(`  ✗ Error:`, error);
    }
  }

  console.log('\n\nNote: Replace "input-image.png" with your actual image file path');
  console.log('Video generation is asynchronous - use operation polling to check status.');
}

main().catch(console.error);

