/**
 * Example: Grounded Maps
 * 
 * Demonstrates using Google Maps grounding for location-based information.
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Grounded Maps Examples ===\n');

  // Example 1: Basic location search without coordinates
  console.log('1. Basic location search:');
  try {
    const result = await toolkit.groundWithMaps(
      'Find coffee shops near me'
    );
    
    console.log('Query: Find coffee shops near me');
    console.log('Response:', result.text.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Location search with coordinates
  console.log('2. Location search with coordinates:');
  try {
    const result = await toolkit.groundWithMaps(
      'Find Italian restaurants nearby',
      {
        latitude: 37.7749,  // San Francisco
        longitude: -122.4194,
      }
    );
    
    console.log('Query: Find Italian restaurants nearby');
    console.log('Location: San Francisco (37.7749, -122.4194)');
    console.log('Response:', result.text.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Directions and routes
  console.log('3. Getting directions:');
  try {
    const result = await toolkit.groundWithMaps(
      'How do I get from San Francisco to Los Angeles?',
      {
        latitude: 37.7749,
        longitude: -122.4194,
      }
    );
    
    console.log('Response:', result.text.substring(0, 400) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Local business information
  console.log('4. Local business information:');
  try {
    const result = await toolkit.groundWithMaps(
      'What are the best museums in New York City?',
      {
        latitude: 40.7128,  // New York City
        longitude: -74.0060,
      }
    );
    
    console.log('Response:', result.text.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Multiple location queries
  console.log('5. Multiple location queries:');
  const locationQueries = [
    {
      query: 'Find gas stations nearby',
      location: { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
    },
    {
      query: 'What are the top-rated parks in this area?',
      location: { latitude: 47.6062, longitude: -122.3321 }, // Seattle
    },
    {
      query: 'Where can I find parking near downtown?',
      location: { latitude: 39.9526, longitude: -75.1652 }, // Philadelphia
    },
  ];

  for (const { query, location } of locationQueries) {
    try {
      console.log(`\nQuery: ${query}`);
      const result = await toolkit.groundWithMaps(query, location);
      console.log('Answer:', result.text.substring(0, 200) + '...');
    } catch (error) {
      console.error(`Error:`, error);
    }
  }

  // Example 6: Accessing map sources
  console.log('\n6. Accessing map sources:');
  try {
    const result = await toolkit.groundWithMaps(
      'Find hotels near the airport',
      {
        latitude: 25.7617,  // Miami
        longitude: -80.1918,
      }
    );
    
    console.log('Response:', result.text);
    console.log('\nMap Sources:');
    
    // Extract grounding chunks if available
    const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      chunks.forEach((chunk: any, index: number) => {
        const uri = chunk.maps?.uri;
        const title = chunk.maps?.title || 'Location';
        console.log(`  ${index + 1}. ${title}`);
        if (uri) {
          console.log(`     ${uri}`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 7: Using different models
  console.log('\n7. Using gemini-2.5-pro for detailed location analysis:');
  try {
    const result = await toolkit.groundWithMaps(
      'Analyze the neighborhood: What are the demographics, amenities, and transportation options?',
      {
        latitude: 40.7589,  // Times Square, NYC
        longitude: -73.9851,
      },
      'gemini-2.5-pro'
    );
    
    console.log('Response:', result.text.substring(0, 400) + '...');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 8: Travel planning
  console.log('\n8. Travel planning:');
  try {
    const result = await toolkit.groundWithMaps(
      'Plan a day trip: What are the must-see attractions, restaurants, and activities?',
      {
        latitude: 48.8566,  // Paris
        longitude: 2.3522,
      }
    );
    
    console.log('Response:', result.text.substring(0, 400) + '...');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);

