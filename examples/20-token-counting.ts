/**
 * Example: Token Counting
 * 
 * Demonstrates counting tokens for various content types before sending to the API.
 * Useful for:
 * - Cost estimation
 * - Staying within token limits
 * - Understanding token usage
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';
import { writeFileSync, unlinkSync } from 'fs';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Token Counting Examples ===\n');

  try {
    // Example 1: Count text tokens
    console.log('1️⃣ Counting text tokens...');
    const text = 'The quick brown fox jumps over the lazy dog.';
    const textCount = await toolkit.countTokens(text);
    console.log(`✅ Text: "${text}"`);
    console.log(`   Tokens: ${textCount.totalTokens}`);
    console.log(`   Characters: ${text.length}`);
    console.log(`   Ratio: ~${(text.length / textCount.totalTokens).toFixed(1)} chars per token\n`);

    // Example 2: Count longer text
    console.log('2️⃣ Counting longer text...');
    const longText = `
Artificial intelligence (AI) is intelligence demonstrated by machines,
in contrast to the natural intelligence displayed by humans and animals.
Leading AI textbooks define the field as the study of "intelligent agents":
any device that perceives its environment and takes actions that maximize
its chance of successfully achieving its goals.
    `.trim();
    const longTextCount = await toolkit.countTokens(longText);
    console.log(`✅ Long Text:`);
    console.log(`   Tokens: ${longTextCount.totalTokens}`);
    console.log(`   Characters: ${longText.length}`);
    console.log(`   Estimated Words: ~${Math.round(longTextCount.totalTokens * 0.7)}\n`);

    // Example 3: Count tokens for file + text
    console.log('3️⃣ Counting tokens for file + text...');
    const sampleFile = 'sample.txt';
    writeFileSync(sampleFile, 'This is a sample file for token counting.');

    const uploadedFile = await toolkit.uploadFile(sampleFile, {
      displayName: 'Sample File'
    });

    // Wait for file to be active
    let fileState = uploadedFile.state;
    while (fileState !== 'ACTIVE') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedFile = await toolkit.getFile(uploadedFile.name);
      fileState = updatedFile.state || 'PROCESSING';
    }

    const fileTextCount = await toolkit.countTokens([
      'Describe this file:',
      uploadedFile
    ]);
    console.log(`✅ File + Text:`);
    console.log(`   Tokens: ${fileTextCount.totalTokens}`);
    console.log(`   (Includes file tokens + text tokens)\n`);

    // Cleanup
    await toolkit.deleteFile(uploadedFile.name);
    unlinkSync(sampleFile);

    // Example 4: Count chat history tokens
    console.log('4️⃣ Counting chat history tokens...');
    const chat = toolkit.createChat();
    await chat.sendMessage({ message: 'Hello, how are you?' });
    await chat.sendMessage({ message: 'Tell me about AI.' });
    
    const history = chat.getHistory();
    const chatCount = await toolkit.countTokens(history);
    console.log(`✅ Chat History:`);
    console.log(`   Tokens: ${chatCount.totalTokens}`);
    console.log(`   Messages: 2\n`);

    // Example 5: Estimate costs
    console.log('5️⃣ Cost estimation example...');
    const prompt = 'Explain quantum computing in detail.';
    const promptCount = await toolkit.countTokens(prompt);
    
    // Example pricing (check current pricing at https://ai.google.dev/pricing)
    const inputPricePer1M = 0.075; // Example: $0.075 per 1M input tokens
    const outputPricePer1M = 0.30; // Example: $0.30 per 1M output tokens
    
    const estimatedInputCost = (promptCount.totalTokens / 1_000_000) * inputPricePer1M;
    const estimatedOutputCost = (500 / 1_000_000) * outputPricePer1M; // Assume ~500 output tokens
    const totalCost = estimatedInputCost + estimatedOutputCost;
    
    console.log(`✅ Cost Estimation:`);
    console.log(`   Input Tokens: ${promptCount.totalTokens}`);
    console.log(`   Estimated Output Tokens: ~500`);
    console.log(`   Estimated Input Cost: $${estimatedInputCost.toFixed(6)}`);
    console.log(`   Estimated Output Cost: $${estimatedOutputCost.toFixed(6)}`);
    console.log(`   Total Estimated Cost: $${totalCost.toFixed(6)}`);
    console.log(`   (Prices are examples - check current pricing)\n`);

    // Example 6: Token conversion guide
    console.log('6️⃣ Token conversion guide...');
    console.log(`✅ Token Equivalents:`);
    console.log(`   - 1 token ≈ 4 characters`);
    console.log(`   - 100 tokens ≈ 60-80 English words`);
    console.log(`   - 1,000 tokens ≈ 750 words`);
    console.log(`   - 1 page (single-spaced) ≈ 500 tokens`);
    console.log(`   - Images (Gemini 2.0): 258 tokens (≤384px) or variable`);
    console.log(`   - Video: 263 tokens per second`);
    console.log(`   - Audio: 32 tokens per second\n`);

    // Example 7: Check token limits
    console.log('7️⃣ Checking token limits...');
    const modelInfo = await (toolkit as any).client.models.get({ model: 'gemini-2.5-flash' });
    const inputLimit = (modelInfo as any).inputTokenLimit || 'Unknown';
    const outputLimit = (modelInfo as any).outputTokenLimit || 'Unknown';
    
    console.log(`✅ Model Limits (gemini-2.5-flash):`);
    console.log(`   Input Limit: ${inputLimit} tokens`);
    console.log(`   Output Limit: ${outputLimit} tokens`);
    console.log(`   Context Window: ${inputLimit} tokens\n`);

    console.log('✅ Token counting examples completed!');
    console.log('\n💡 Tips:');
    console.log('   - Count tokens before sending large requests');
    console.log('   - Use countTokens to estimate costs');
    console.log('   - Check model token limits before generating');
    console.log('   - System instructions and tools also count toward tokens');
    console.log('   - Cached content tokens are shown separately in usage_metadata');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);

