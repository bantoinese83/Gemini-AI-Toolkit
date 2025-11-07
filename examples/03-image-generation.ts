/**
 * Example: Image Generation
 * 
 * Demonstrates generating images using Imagen 4.0.
 * Shows different aspect ratios and configurations.
 */

import { GeminiToolkit, saveImage, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Image Generation Examples ===\n');

  // Example 1: Basic image generation (square) - using preset
  console.log('1. Generating square image (1:1) using preset:');
  try {
    const imageBase64 = await toolkit.generateImage(
      'A futuristic robot holding a red skateboard in a cyberpunk city',
      presets.image.square
    );
    
    // Save image using utility function
    saveImage(imageBase64, 'output-square.png');
    console.log('✓ Image saved to output-square.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Widescreen image (16:9) - using preset
  console.log('2. Generating widescreen image (16:9) using preset:');
  try {
    const imageBase64 = await toolkit.generateImage(
      'A serene mountain landscape at sunset with a lake in the foreground',
      presets.image.wide
    );
    
    saveImage(imageBase64, 'output-widescreen.png');
    console.log('✓ Image saved to output-widescreen.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Portrait image (9:16) - using preset
  console.log('3. Generating portrait image (9:16) using preset:');
  try {
    const imageBase64 = await toolkit.generateImage(
      'A portrait of an astronaut floating in space with Earth in the background',
      presets.image.portrait
    );
    
    saveImage(imageBase64, 'output-portrait.png');
    console.log('✓ Image saved to output-portrait.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Platform-specific presets
  console.log('4. Using platform-specific presets:');
  try {
    const instagramImage = await toolkit.generateImage(
      'A beautiful sunset over the ocean',
      presets.image.instagram
    );
    saveImage(instagramImage, 'output-instagram.png');
    console.log('✓ Instagram preset saved\n');

    const youtubeImage = await toolkit.generateImage(
      'A futuristic cityscape',
      presets.image.youtube
    );
    saveImage(youtubeImage, 'output-youtube.png');
    console.log('✓ YouTube preset saved\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Multiple images using batch preset
  console.log('5. Generating multiple images using batch preset:');
  try {
    const imageBase64 = await toolkit.generateImage(
      'A cute cat wearing sunglasses',
      presets.image.batch2
    );
    
    saveImage(imageBase64, 'output-multiple.png');
    console.log('✓ Batch image saved to output-multiple.png\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);

