/**
 * Example: Utilities and Presets
 * 
 * Demonstrates developer-friendly utilities and preset configurations
 * that make common tasks even easier.
 */

import {
  generateText,
  generateImage,
  generateSpeech,
  presets,
  saveImage,
  saveAudio,
  loadImage,
  batchGenerateText,
  streamToText,
  createChat,
} from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  console.log('=== Utilities and Presets Examples ===\n');

  // ============================================
  // PRESETS - Ready-to-use configurations
  // ============================================
  console.log('1. Using Presets:\n');

  // Text presets
  console.log('   Text Presets:');
  try {
    const fastText = await generateText('Quick summary', presets.text.fast);
    console.log('   Fast:', fastText.substring(0, 100) + '...\n');

    const smartText = await generateText('Complex analysis', presets.text.smart);
    console.log('   Smart:', smartText.substring(0, 100) + '...\n');

    const creativeText = await generateText('Creative story', presets.text.creative);
    console.log('   Creative:', creativeText.substring(0, 100) + '...\n');

    const conciseText = await generateText('Brief answer', presets.text.concise);
    console.log('   Concise:', conciseText.substring(0, 100) + '...\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // Image presets
  console.log('   Image Presets:');
  try {
    const squareImage = await generateImage('A robot', presets.image.square);
    console.log('   Square image generated\n');

    const wideImage = await generateImage('A landscape', presets.image.wide);
    console.log('   Wide image generated\n');

    const portraitImage = await generateImage('A portrait', presets.image.portrait);
    console.log('   Portrait image generated\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // Speech presets
  console.log('   Speech Presets:');
  try {
    const audio1 = await generateSpeech('Hello!', presets.speech.default);
    console.log('   Default voice generated\n');

    const audio2 = await generateSpeech('Hello!', presets.speech.alternative);
    console.log('   Alternative voice generated\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // UTILITIES - Save/Load helpers
  // ============================================
  console.log('\n2. File Utilities:\n');

  try {
    // Generate and save image in one go
    const imageBase64 = await generateImage('A cute cat');
    saveImage(imageBase64, 'output-cat.png');
    console.log('   ✓ Image saved to output-cat.png\n');

    // Load image and use it
    const loadedImage = await loadImage('output-cat.png');
    console.log('   ✓ Image loaded from file\n');

    // Generate and save audio
    const audioBase64 = await generateSpeech('Hello, world!');
    saveAudio(audioBase64, 'output-audio.wav');
    console.log('   ✓ Audio saved to output-audio.wav\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // BATCH OPERATIONS
  // ============================================
  console.log('\n3. Batch Operations:\n');

  try {
    const prompts = [
      'What is AI?',
      'What is machine learning?',
      'What is deep learning?',
    ];

    const results = await batchGenerateText(prompts, (prompt) =>
      generateText(prompt, presets.text.concise)
    );

    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${prompts[index]}`);
      console.log(`      ${result.substring(0, 80)}...\n`);
    });
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // STREAMING HELPERS
  // ============================================
  console.log('\n4. Streaming Helpers:\n');

  try {
    const chat = createChat();
    const fullText = await streamToText(
      chat.sendMessageStream({ message: 'Tell me a short joke' })
    );
    console.log('   Full streamed text:', fullText.substring(0, 200) + '...\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  console.log('\n=== All Examples Complete ===');
}

main().catch(console.error);

