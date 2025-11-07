/**
 * Example: Text-to-Speech
 * 
 * Demonstrates converting text to speech using Gemini TTS models.
 * Shows different voices and use cases.
 */

import { GeminiToolkit, saveAudio, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Text-to-Speech Examples ===\n');

  // Example 1: Basic text-to-speech (using saveAudio utility)
  console.log('1. Basic text-to-speech:');
  try {
    const audioBase64 = await toolkit.generateSpeech(
      'Hello! This is a test of the text-to-speech functionality.'
    );
    
    // Save audio using utility function
    saveAudio(audioBase64, 'output-speech.wav');
    console.log('✓ Audio saved to output-speech.wav');
    console.log('Note: The audio format may vary. Check the MIME type.\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Using voice presets
  console.log('2. Using voice presets:');
  try {
    const koreAudio = await toolkit.generateSpeech(
      'This is a test using the Kore voice.',
      presets.speech.kore
    );
    saveAudio(koreAudio, 'output-speech-kore.wav');
    console.log('✓ Kore voice saved\n');

    const zephyrAudio = await toolkit.generateSpeech(
      'This is a test using the Zephyr voice.',
      presets.speech.zephyr
    );
    saveAudio(zephyrAudio, 'output-speech-zephyr.wav');
    console.log('✓ Zephyr voice saved\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Using use case presets
  console.log('3. Using use case presets:');
  try {
    const narrationAudio = await toolkit.generateSpeech(
      'Welcome to our story. Once upon a time...',
      presets.speech.narration
    );
    saveAudio(narrationAudio, 'output-speech-narration.wav');
    console.log('✓ Narration preset saved\n');

    const tutorialAudio = await toolkit.generateSpeech(
      'Welcome to the tutorial. Let\'s get started.',
      presets.speech.tutorial
    );
    saveAudio(tutorialAudio, 'output-speech-tutorial.wav');
    console.log('✓ Tutorial preset saved\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Long text
  console.log('4. Converting longer text:');
  try {
    const longText = `
      Artificial intelligence has revolutionized many aspects of our daily lives.
      From voice assistants to recommendation systems, AI is everywhere.
      Machine learning algorithms can now recognize patterns in data that humans might miss.
      This technology continues to evolve and improve.
    `;
    
    const audioBase64 = await toolkit.generateSpeech(longText);
    saveAudio(audioBase64, 'output-speech-long.wav');
    console.log('✓ Long text audio saved to output-speech-long.wav\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Multiple sentences
  console.log('5. Converting multiple sentences:');
  const sentences = [
    'First sentence with natural intonation.',
    'Second sentence with different emphasis.',
    'Third sentence to test continuity.',
  ];

  for (let i = 0; i < sentences.length; i++) {
    try {
      const audioBase64 = await toolkit.generateSpeech(sentences[i]);
      saveAudio(audioBase64, `output-speech-sentence-${i + 1}.wav`);
      console.log(`✓ Sentence ${i + 1} saved`);
    } catch (error) {
      console.error(`✗ Error with sentence ${i + 1}:`, error);
    }
  }
  console.log();

  // Example 6: Special characters and numbers
  console.log('6. Handling special characters and numbers:');
  try {
    const specialText = 'The price is $99.99. Call us at (555) 123-4567. Email: info@example.com';
    const audioBase64 = await toolkit.generateSpeech(specialText);
    saveAudio(audioBase64, 'output-speech-special.wav');
    console.log('✓ Special characters audio saved to output-speech-special.wav\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 7: Different languages (if supported)
  console.log('7. Multi-language support:');
  const multilingualTexts = [
    { text: 'Hello, how are you?', lang: 'English' },
    { text: 'Bonjour, comment allez-vous?', lang: 'French' },
    { text: 'Hola, ¿cómo estás?', lang: 'Spanish' },
  ];

  for (const { text, lang } of multilingualTexts) {
    try {
      console.log(`  Generating: ${lang}`);
      const audioBase64 = await toolkit.generateSpeech(text);
      saveAudio(audioBase64, `output-speech-${lang.toLowerCase()}.wav`);
      console.log(`  ✓ Saved`);
    } catch (error) {
      console.error(`  ✗ Error:`, error);
    }
  }

  console.log('\n\nNote: Audio files are saved in base64 format.');
  console.log('You may need to convert them to proper audio formats (WAV, MP3) depending on the output.');
}

main().catch(console.error);

