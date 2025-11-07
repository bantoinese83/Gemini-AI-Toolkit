/**
 * Example: All Presets
 * 
 * Demonstrates all available preset configurations for every use case.
 * Shows how to use presets for text, image, video, speech, chat, and analysis.
 */

import {
  generateText,
  generateImage,
  generateVideo,
  generateSpeech,
  createChat,
  analyzeImage,
  presets,
} from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  console.log('=== All Presets Examples ===\n');

  // ============================================
  // TEXT PRESETS
  // ============================================
  console.log('1. Text Generation Presets:\n');

  try {
    // Speed presets
    console.log('   Speed Presets:');
    const fast = await generateText('Quick answer', presets.text.fast);
    console.log('   ✓ Fast:', fast.substring(0, 80) + '...\n');

    const smart = await generateText('Complex question', presets.text.smart);
    console.log('   ✓ Smart:', smart.substring(0, 80) + '...\n');

    // Style presets
    console.log('   Style Presets:');
    const creative = await generateText('A story', presets.text.creative);
    console.log('   ✓ Creative:', creative.substring(0, 80) + '...\n');

    const concise = await generateText('Brief summary', presets.text.concise);
    console.log('   ✓ Concise:', concise.substring(0, 80) + '...\n');

    // Use case presets
    console.log('   Use Case Presets:');
    const code = await generateText('Write a function', presets.text.code);
    console.log('   ✓ Code:', code.substring(0, 80) + '...\n');

    const qa = await generateText('What is AI?', presets.text.qa);
    console.log('   ✓ Q&A:', qa.substring(0, 80) + '...\n');

    const technical = await generateText('Explain API', presets.text.technical);
    console.log('   ✓ Technical:', technical.substring(0, 80) + '...\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // IMAGE PRESETS
  // ============================================
  console.log('\n2. Image Generation Presets:\n');

  try {
    // Aspect ratio presets
    console.log('   Aspect Ratio Presets:');
    const square = await generateImage('A robot', presets.image.square);
    console.log('   ✓ Square (1:1) generated\n');

    const wide = await generateImage('A landscape', presets.image.wide);
    console.log('   ✓ Wide (16:9) generated\n');

    const portrait = await generateImage('A person', presets.image.portrait);
    console.log('   ✓ Portrait (9:16) generated\n');

    // Platform presets
    console.log('   Platform Presets:');
    const instagram = await generateImage('A post', presets.image.instagram);
    console.log('   ✓ Instagram post generated\n');

    const youtube = await generateImage('A thumbnail', presets.image.youtube);
    console.log('   ✓ YouTube thumbnail generated\n');

    const banner = await generateImage('A banner', presets.image.banner);
    console.log('   ✓ Banner generated\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // VIDEO PRESETS
  // ============================================
  console.log('\n3. Video Generation Presets:\n');

  try {
    // Note: Video generation requires an image first
    console.log('   Platform Presets (conceptual):');
    console.log('   ✓ YouTube:', JSON.stringify(presets.video.youtube));
    console.log('   ✓ TikTok:', JSON.stringify(presets.video.tiktok));
    console.log('   ✓ Instagram:', JSON.stringify(presets.video.instagram));
    console.log('   ✓ Shorts:', JSON.stringify(presets.video.shorts));
    console.log('   (Video generation requires an input image)\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // SPEECH PRESETS
  // ============================================
  console.log('\n4. Speech Generation Presets:\n');

  try {
    console.log('   Voice Presets:');
    const kore = await generateSpeech('Hello from Kore', presets.speech.kore);
    console.log('   ✓ Kore voice generated\n');

    const zephyr = await generateSpeech('Hello from Zephyr', presets.speech.zephyr);
    console.log('   ✓ Zephyr voice generated\n');

    console.log('   Use Case Presets:');
    const narration = await generateSpeech('This is a narration', presets.speech.narration);
    console.log('   ✓ Narration generated\n');

    const tutorial = await generateSpeech('Welcome to the tutorial', presets.speech.tutorial);
    console.log('   ✓ Tutorial generated\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // CHAT PRESETS
  // ============================================
  console.log('\n5. Chat Presets:\n');

  try {
    console.log('   Conversation Style Presets:');
    const casualChat = createChat(presets.chat.casual);
    const casualResponse = await casualChat.sendMessage({ message: 'Hi!' });
    console.log('   ✓ Casual chat:', casualResponse.text.substring(0, 80) + '...\n');

    const professionalChat = createChat(presets.chat.professional);
    const proResponse = await professionalChat.sendMessage({ message: 'Hello' });
    console.log('   ✓ Professional chat:', proResponse.text.substring(0, 80) + '...\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // ANALYSIS PRESETS
  // ============================================
  console.log('\n6. Analysis Presets:\n');

  try {
    // Note: This requires an actual image file
    console.log('   Analysis Type Presets:');
    console.log('   ✓ Detailed:', JSON.stringify(presets.analysis.detailed));
    console.log('   ✓ Summary:', JSON.stringify(presets.analysis.summary));
    console.log('   ✓ Technical:', JSON.stringify(presets.analysis.technical));
    console.log('   ✓ Quick:', JSON.stringify(presets.analysis.quick));
    console.log('   (Analysis requires an input image)\n');
  } catch (error) {
    console.error('   Error:', error);
  }

  // ============================================
  // PRESET SUMMARY
  // ============================================
  console.log('\n=== Preset Summary ===\n');
  console.log('Text Presets:', Object.keys(presets.text).length, 'options');
  console.log('Image Presets:', Object.keys(presets.image).length, 'options');
  console.log('Video Presets:', Object.keys(presets.video).length, 'options');
  console.log('Speech Presets:', Object.keys(presets.speech).length, 'options');
  console.log('Chat Presets:', Object.keys(presets.chat).length, 'options');
  console.log('Analysis Presets:', Object.keys(presets.analysis).length, 'options');
  console.log('\nTotal:', 
    Object.keys(presets.text).length +
    Object.keys(presets.image).length +
    Object.keys(presets.video).length +
    Object.keys(presets.speech).length +
    Object.keys(presets.chat).length +
    Object.keys(presets.analysis).length,
    'presets available!'
  );
}

main().catch(console.error);

