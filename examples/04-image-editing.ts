/**
 * Example: Image Editing
 * 
 * Demonstrates editing existing images with text prompts.
 * Requires an input image file.
 */

import { GeminiToolkit, loadImage, saveImage } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Image Editing Examples ===\n');

  // Note: You need an input image file for these examples
  // Replace 'input-image.png' with your actual image file path

  // Example 1: Add a filter (using loadImage utility)
  console.log('1. Adding a retro filter to an image:');
  try {
    // Load image using utility function
    const imagePath = 'input-image.png'; // Replace with your image path
    const imageBase64 = await loadImage(imagePath);
    
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Apply a retro 80s film filter with warm tones and slight grain'
    );
    
    // Save using utility function
    saveImage(editedImage, 'output-retro-filter.png');
    console.log('✓ Edited image saved to output-retro-filter.png\n');
  } catch (error) {
    console.error('Error (make sure input-image.png exists):', error);
  }

  // Example 2: Change style
  console.log('2. Changing image style to watercolor:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Transform this image into a watercolor painting style'
    );
    
    saveImage(editedImage, 'output-watercolor.png');
    console.log('✓ Edited image saved to output-watercolor.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Add elements
  console.log('3. Adding elements to image:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Add a rainbow in the sky and make the colors more vibrant'
    );
    
    saveImage(editedImage, 'output-enhanced.png');
    console.log('✓ Edited image saved to output-enhanced.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Remove objects
  console.log('4. Removing objects from image:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Remove any text or watermarks from this image'
    );
    
    saveImage(editedImage, 'output-cleaned.png');
    console.log('✓ Edited image saved to output-cleaned.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Color adjustments
  console.log('5. Adjusting colors and lighting:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const editedImage = await toolkit.editImage(
      imageBase64,
      'image/png',
      'Increase brightness by 20%, enhance contrast, and add a warm golden hour glow'
    );
    
    saveImage(editedImage, 'output-color-adjusted.png');
    console.log('✓ Edited image saved to output-color-adjusted.png\n');
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\nNote: Replace "input-image.png" with your actual image file path');
}

main().catch(console.error);

