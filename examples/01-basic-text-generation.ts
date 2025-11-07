/**
 * Example: Basic Text Generation
 * 
 * Demonstrates simple text generation using Gemini models.
 * Shows different models, presets, and use cases.
 */

import { GeminiToolkit, generateText, presets } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Basic Text Generation Examples ===\n');

  // Example 1: Simple text generation with default model (gemini-2.5-flash)
  console.log('1. Simple text generation:');
  try {
    const text = await toolkit.generateText('Explain quantum computing in simple terms.');
    console.log('Response:', text);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Using gemini-2.5-pro for complex reasoning
  console.log('2. Complex reasoning with gemini-2.5-pro:');
  try {
    const text = await toolkit.generateText(
      'What are the ethical implications of AI in healthcare?',
      { model: 'gemini-2.5-pro' }
    );
    console.log('Response:', text);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Custom configuration
  console.log('3. Text generation with custom config:');
  try {
    const text = await toolkit.generateText(
      'Write a short story about a robot learning to paint.',
      {
        model: 'gemini-2.5-flash',
        config: {
          temperature: 0.9,
          maxOutputTokens: 500,
        },
      }
    );
    console.log('Response:', text);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Using presets
  console.log('4. Using preset configurations:');
  try {
    const fastText = await toolkit.generateText('Quick answer', presets.text.fast);
    console.log('Fast preset:', fastText.substring(0, 100) + '...\n');
    
    const smartText = await toolkit.generateText('Complex question', presets.text.smart);
    console.log('Smart preset:', smartText.substring(0, 100) + '...\n');
    
    const creativeText = await toolkit.generateText('Creative story', presets.text.creative);
    console.log('Creative preset:', creativeText.substring(0, 100) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Quick functions (alternative to class API)
  console.log('5. Using quick functions (one-liners):');
  try {
    const text = await generateText('Hello from quick function!');
    console.log('Quick function result:', text.substring(0, 100) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 6: Multiple prompts
  console.log('6. Batch processing multiple prompts:');
  const prompts = [
    'What is machine learning?',
    'What is deep learning?',
    'What is the difference between AI and ML?',
  ];

  for (const prompt of prompts) {
    try {
      const text = await toolkit.generateText(prompt);
      console.log(`Q: ${prompt}`);
      console.log(`A: ${text.substring(0, 100)}...\n`);
    } catch (error) {
      console.error(`Error with prompt "${prompt}":`, error);
    }
  }
}

main().catch(console.error);

