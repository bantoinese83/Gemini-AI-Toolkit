/**
 * Example: Grounded Search
 * 
 * Demonstrates using Google Search grounding to get up-to-date information.
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Grounded Search Examples ===\n');

  // Example 1: Basic search grounding
  console.log('1. Basic search grounding:');
  try {
    const result = await toolkit.groundWithSearch(
      'What are the latest developments in artificial intelligence in 2024?'
    );
    
    console.log('Query: Latest AI developments in 2024');
    console.log('Response:', result.text);
    console.log('Candidates:', result.candidates?.length || 0, 'results found\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Current events
  console.log('2. Current events:');
  try {
    const result = await toolkit.groundWithSearch(
      'What are the current top news stories today?'
    );
    
    console.log('Response:', result.text.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Technical information
  console.log('3. Technical information:');
  try {
    const result = await toolkit.groundWithSearch(
      'What are the latest features in React 19?'
    );
    
    console.log('Response:', result.text);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Using different models
  console.log('4. Using gemini-2.5-pro for complex queries:');
  try {
    const result = await toolkit.groundWithSearch(
      'Compare the latest performance benchmarks of GPT-4, Claude 3, and Gemini models',
      'gemini-2.5-pro'
    );
    
    console.log('Response:', result.text.substring(0, 400) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Multiple search queries
  console.log('5. Multiple search queries:');
  const queries = [
    'What is the weather forecast for San Francisco today?',
    'What are the latest stock prices for tech companies?',
    'What are the current trends in machine learning?',
  ];

  for (const query of queries) {
    try {
      console.log(`\nQuery: ${query}`);
      const result = await toolkit.groundWithSearch(query);
      console.log('Answer:', result.text.substring(0, 200) + '...');
    } catch (error) {
      console.error(`Error with query "${query}":`, error);
    }
  }

  // Example 6: Accessing source information
  console.log('\n6. Accessing source information:');
  try {
    const result = await toolkit.groundWithSearch(
      'What are the health benefits of exercise?'
    );
    
    console.log('Response:', result.text);
    console.log('\nSources:');
    
    // Extract grounding chunks if available
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any, index: number) => {
        const uri = chunk.web?.uri || chunk.maps?.uri;
        const title = chunk.web?.title || chunk.maps?.title || 'Source';
        console.log(`  ${index + 1}. ${title}`);
        if (uri) {
          console.log(`     ${uri}`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 7: Fact-checking
  console.log('\n7. Fact-checking:');
  try {
    const result = await toolkit.groundWithSearch(
      'Verify: Is it true that the James Webb Space Telescope discovered water on an exoplanet?'
    );
    
    console.log('Response:', result.text);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);

