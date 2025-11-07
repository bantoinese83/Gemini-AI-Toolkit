/**
 * Example: Quick Start - Minimal Code Usage
 * 
 * Demonstrates the absolute simplest way to use the toolkit.
 * These functions require minimal code - often just one line!
 * 
 * Set GEMINI_API_KEY environment variable before running.
 */

// ============================================
// OPTION 1: One-Line Functions (Easiest!)
// ============================================
// Auto-detects API key from GEMINI_API_KEY environment variable

import {
  generateText,
  generateImage,
  createChat,
  search,
  generateSpeech,
  presets,
  saveImage,
  saveAudio,
} from 'gemini-ai-toolkit';

async function quickStartExample() {
  console.log('=== Quick Start: One-Line Functions ===\n');
  
  // ONE LINE: Generate text
  const text = await generateText('Explain AI in one sentence');
  console.log('Text:', text);
  console.log();

  // ONE LINE: Generate image
  const image = await generateImage('A cute robot');
  console.log('Image generated!', image.substring(0, 50) + '...');
  console.log();

  // ONE LINE: Create chat
  const chat = createChat();
  const response = await chat.sendMessage({ message: 'Hello!' });
  console.log('Chat:', response.text);
  console.log();

  // ONE LINE: Search the web
  const results = await search('Latest AI developments');
  console.log('Search:', results.text.substring(0, 200) + '...');
  console.log();

  // ONE LINE: Generate speech
  const audio = await generateSpeech('Hello, world!');
  console.log('Audio generated!', audio.substring(0, 50) + '...');
  console.log();

  // ONE LINE: Use presets for common configurations
  const fastText = await generateText('Quick answer', presets.text.fast);
  const wideImage = await generateImage('A landscape', presets.image.wide);
  console.log('Using presets:', fastText.substring(0, 50) + '...');
  console.log();

  // ONE LINE: Save files easily
  const savedImage = await generateImage('A robot');
  saveImage(savedImage, 'quick-output.png');
  console.log('✓ Image saved with one line!');
}

// ============================================
// OPTION 2: Initialize Once, Use Everywhere
// ============================================
// Best for apps with multiple API calls

import { init, generateText as quickText, generateImage as quickImage } from 'gemini-ai-toolkit';

async function initExample() {
  console.log('=== Quick Start: Initialize Once ===\n');
  
  // Initialize once at app startup
  init(process.env.GEMINI_API_KEY || 'your-api-key-here');
  
  // Now use anywhere without passing API key
  const text1 = await quickText('First prompt');
  const text2 = await quickText('Second prompt');
  const text3 = await quickText('Third prompt');
  
  console.log('Text 1:', text1.substring(0, 100));
  console.log('Text 2:', text2.substring(0, 100));
  console.log('Text 3:', text3.substring(0, 100));
}

// ============================================
// OPTION 3: Pass API Key Directly
// ============================================
// No environment variable needed

import { generateText as textGen } from 'gemini-ai-toolkit';

async function directKeyExample() {
  console.log('=== Quick Start: Direct API Key ===\n');
  
  // Pass API key directly (no env var needed)
  const text = await textGen('Hello!', undefined, 'your-api-key-here');
  console.log('Text:', text);
}

// ============================================
// COMPARISON: Before vs After
// ============================================

/*
BEFORE (3 lines):
const toolkit = new GeminiToolkit({ apiKey: 'key' });
const text = await toolkit.generateText('Hello!');
console.log(text);

AFTER (1 line):
const text = await generateText('Hello!');
console.log(text);
*/

// Run examples
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Please set GEMINI_API_KEY environment variable');
    console.log('\nExample:');
    console.log('  export GEMINI_API_KEY="your-api-key"');
    console.log('  npm run example:quick');
    return;
  }

  try {
    await quickStartExample();
    // await initExample();
    // await directKeyExample();
  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
