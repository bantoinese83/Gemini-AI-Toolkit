/**
 * Example: Image Understanding
 * 
 * Demonstrates analyzing and understanding image content.
 * Shows various analysis capabilities.
 */

import { GeminiToolkit, loadImage, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Image Understanding Examples ===\n');

  // Note: You need an input image file for these examples
  // Replace 'input-image.png' with your actual image file path

  // Example 1: Basic image description (using loadImage utility)
  console.log('1. Basic image description:');
  try {
    const imagePath = 'input-image.png'; // Replace with your image path
    const imageBase64 = await loadImage(imagePath);
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'Describe what you see in this image in detail.'
    );
    
    console.log('Analysis:', analysis);
    console.log();
  } catch (error) {
    console.error('Error (make sure input-image.png exists):', error);
  }

  // Example 2: Object detection
  console.log('2. Object detection:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'List all objects, people, and animals visible in this image. For each, describe their position and appearance.'
    );
    
    console.log('Objects detected:', analysis);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Text extraction (OCR)
  console.log('3. Text extraction (OCR):');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'Extract all text visible in this image. Preserve the formatting and layout if possible.'
    );
    
    console.log('Extracted text:', analysis);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Scene understanding
  console.log('4. Scene understanding:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'Analyze the scene: What is the setting? What time of day? What mood or atmosphere does it convey? What activities might be happening?'
    );
    
    console.log('Scene analysis:', analysis);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Technical analysis using preset
  console.log('5. Technical image analysis using preset:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'Analyze the technical aspects: What is the composition? What colors dominate? What is the lighting like? What camera techniques might have been used?',
      presets.analysis.technical
    );
    
    console.log('Technical analysis:', analysis);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 6: Using different models
  console.log('6. Using gemini-2.5-flash-image model:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const analysis = await toolkit.analyzeMedia(
      imageBase64,
      'image/png',
      'What is the main subject of this image and how is it presented?',
      {
        model: 'gemini-2.5-flash-image',
      }
    );
    
    console.log('Analysis:', analysis);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 7: Question answering about image
  console.log('7. Question answering:');
  try {
    const imageBase64 = await loadImage('input-image.png');
    
    const questions = [
      'How many people are in this image?',
      'What emotions do the people in this image appear to be feeling?',
      'What is the weather like in this image?',
    ];

    for (const question of questions) {
      const answer = await toolkit.analyzeMedia(
        imageBase64,
        'image/png',
        question
      );
      console.log(`Q: ${question}`);
      console.log(`A: ${answer}\n`);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\nNote: Replace "input-image.png" with your actual image file path');
}

main().catch(console.error);

