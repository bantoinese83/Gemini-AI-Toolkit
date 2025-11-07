/**
 * Example: Thinking Mode
 * 
 * Demonstrates using thinking mode for complex problem-solving.
 * Thinking mode allows the model to use extended reasoning.
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Thinking Mode Examples ===\n');

  // Example 1: Basic thinking mode
  console.log('1. Basic thinking mode (default budget):');
  try {
    const result = await toolkit.generateWithThinking(
      'Solve this step by step: If a train travels 120 km in 2 hours, and another train travels 180 km in 3 hours, which train is faster and by how much?'
    );
    
    console.log('Problem: Train speed comparison');
    console.log('Response:', result);
    console.log();
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 2: Custom thinking budget
  console.log('2. Custom thinking budget:');
  try {
    const result = await toolkit.generateWithThinking(
      'Analyze the pros and cons of renewable energy sources. Consider environmental impact, cost, scalability, and technological challenges.',
      65536  // Higher thinking budget for complex analysis
    );
    
    console.log('Problem: Renewable energy analysis');
    console.log('Response:', result.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 3: Mathematical problem solving
  console.log('3. Mathematical problem solving:');
  try {
    const result = await toolkit.generateWithThinking(
      `Solve this optimization problem:
      A company wants to minimize costs. They can produce widgets using:
      - Method A: $10 per widget, 2 hours per widget
      - Method B: $8 per widget, 3 hours per widget
      They have 100 hours available and need at least 30 widgets.
      What's the optimal production mix?`,
      32768
    );
    
    console.log('Problem: Optimization problem');
    console.log('Response:', result.substring(0, 400) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 4: Code analysis
  console.log('4. Code analysis and debugging:');
  try {
    const result = await toolkit.generateWithThinking(
      `Analyze this algorithm and find the time complexity:
      function findMax(arr) {
        let max = arr[0];
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] > max) {
            max = arr[i];
          }
        }
        return max;
      }
      Also suggest optimizations if any.`,
      32768
    );
    
    console.log('Problem: Algorithm analysis');
    console.log('Response:', result.substring(0, 400) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 5: Multi-step reasoning
  console.log('5. Multi-step reasoning:');
  try {
    const result = await toolkit.generateWithThinking(
      `Plan a software architecture for an e-commerce platform:
      1. Identify core components
      2. Design database schema
      3. Plan API structure
      4. Consider scalability
      5. Address security concerns
      Provide detailed reasoning for each step.`,
      65536
    );
    
    console.log('Problem: Software architecture planning');
    console.log('Response:', result.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 6: Logical puzzles
  console.log('6. Logical puzzles:');
  try {
    const result = await toolkit.generateWithThinking(
      `Solve this logic puzzle:
      There are 5 houses in a row, each with a different color, owner, pet, drink, and nationality.
      - The Englishman lives in the red house
      - The Spaniard owns a dog
      - Coffee is drunk in the green house
      - The Ukrainian drinks tea
      - The green house is immediately to the right of the ivory house
      - The person who smokes Old Gold has snails
      - Kools are smoked in the yellow house
      - Milk is drunk in the middle house
      - The Norwegian lives in the first house
      - The person who smokes Chesterfields lives next to the person with the fox
      - Kools are smoked in the house next to the horse
      - The person who smokes Lucky Strike drinks orange juice
      - The Japanese smokes Parliaments
      - The Norwegian lives next to the blue house
      Who owns the zebra?`,
      65536
    );
    
    console.log('Problem: Logic puzzle (Einstein's riddle)');
    console.log('Response:', result.substring(0, 600) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 7: Scientific reasoning
  console.log('7. Scientific reasoning:');
  try {
    const result = await toolkit.generateWithThinking(
      `Explain the greenhouse effect:
      1. What causes it?
      2. How does it work at a molecular level?
      3. What are the consequences?
      4. How does it relate to climate change?
      Provide detailed scientific explanations.`,
      32768
    );
    
    console.log('Problem: Scientific explanation');
    console.log('Response:', result.substring(0, 500) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }

  // Example 8: Comparison with regular generation
  console.log('8. Comparison: Thinking mode vs regular generation:');
  try {
    console.log('Regular generation:');
    const regular = await toolkit.generateText(
      'What are the implications of quantum computing for cryptography?'
    );
    console.log(regular.substring(0, 300) + '...\n');

    console.log('Thinking mode:');
    const thinking = await toolkit.generateWithThinking(
      'What are the implications of quantum computing for cryptography? Analyze the technical details, timeline, and potential solutions.',
      32768
    );
    console.log(thinking.substring(0, 300) + '...\n');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);

