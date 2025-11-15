/**
 * Example: Context Caching
 * 
 * Demonstrates using context caching to reduce costs on repeated requests.
 * Ideal for:
 * - Chatbots with extensive system instructions
 * - Repetitive analysis of lengthy video files
 * - Recurring queries against large document sets
 * - Frequent code repository analysis
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';
import { writeFileSync, unlinkSync } from 'fs';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Context Caching Examples ===\n');

  try {
    // Example 1: Create a cache with system instruction and content
    console.log('1️⃣ Creating a cache with system instruction...');
    
    // Create a sample document
    const longDocument = `
This is a comprehensive document about artificial intelligence.
It contains multiple sections covering machine learning, deep learning,
neural networks, natural language processing, computer vision, and more.
The document is quite lengthy and would be expensive to send repeatedly.
By caching it, we can reuse it across multiple requests at a reduced cost.
    `.trim();
    
    const docFile = 'ai-document.txt';
    writeFileSync(docFile, longDocument);

    // Upload the document
    const uploadedDoc = await toolkit.uploadFile(docFile, {
      displayName: 'AI Document',
      mimeType: 'text/plain'
    });

    // Wait for file to be active
    let fileState = uploadedDoc.state;
    while (fileState !== 'ACTIVE') {
      console.log(`   Waiting for file processing... (state: ${fileState})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updatedFile = await toolkit.getFile(uploadedDoc.name);
      fileState = updatedFile.state || 'PROCESSING';
    }

    // Create cache with TTL
    const cache = await toolkit.createCache('gemini-2.0-flash-001', {
      displayName: 'ai-document-cache',
      systemInstruction: 'You are an expert AI researcher. Answer questions based on the provided document.',
      contents: [uploadedDoc],
      ttl: 300 // 5 minutes
    });

    console.log(`✅ Cache created: ${cache.name}`);
    console.log(`   Display Name: ${cache.displayName}`);
    console.log(`   Model: ${cache.model}`);
    console.log(`   Expires: ${cache.expireTime}`);
    if (cache.usageMetadata?.totalTokenCount) {
      console.log(`   Cached Tokens: ${cache.usageMetadata.totalTokenCount}`);
    }
    console.log();

    // Example 2: Use cache in multiple requests
    console.log('2️⃣ Using cache in multiple requests...');
    
    const question1 = 'What topics does this document cover?';
    const answer1 = await toolkit.generateText(question1, {
      cachedContent: cache.name,
      model: 'gemini-2.0-flash-001'
    });
    console.log(`✅ Question 1: ${question1}`);
    console.log(`   Answer: ${answer1.substring(0, 100)}...\n`);

    const question2 = 'Summarize the key points about machine learning.';
    const answer2 = await toolkit.generateText(question2, {
      cachedContent: cache.name,
      model: 'gemini-2.0-flash-001'
    });
    console.log(`✅ Question 2: ${question2}`);
    console.log(`   Answer: ${answer2.substring(0, 100)}...\n`);

    // Example 3: Get cache metadata
    console.log('3️⃣ Getting cache metadata...');
    const cacheInfo = await toolkit.getCache(cache.name);
    console.log(`✅ Cache Info:`);
    console.log(`   Name: ${cacheInfo.name}`);
    console.log(`   Display Name: ${cacheInfo.displayName}`);
    console.log(`   Created: ${cacheInfo.createTime}`);
    console.log(`   Updated: ${cacheInfo.updateTime}`);
    console.log(`   Expires: ${cacheInfo.expireTime}`);
    if (cacheInfo.usageMetadata) {
      console.log(`   Total Tokens: ${cacheInfo.usageMetadata.totalTokenCount || 'N/A'}`);
      console.log(`   Cached Content Tokens: ${cacheInfo.usageMetadata.cachedContentTokenCount || 'N/A'}`);
    }
    console.log();

    // Example 4: Update cache TTL
    console.log('4️⃣ Updating cache TTL...');
    const updatedCache = await toolkit.updateCache(cache.name, {
      ttl: 600 // Extend to 10 minutes
    });
    console.log(`✅ Cache TTL updated`);
    console.log(`   New expiration: ${updatedCache.expireTime}\n`);

    // Example 5: List all caches
    console.log('5️⃣ Listing all caches...');
    const caches = await toolkit.listCaches();
    let cacheCount = 0;
    for await (const cached of caches) {
      cacheCount++;
      const c = cached as any;
      console.log(`   ${cacheCount}. ${c.displayName || c.name} (expires: ${c.expireTime})`);
    }
    console.log(`✅ Listed ${cacheCount} cache(s)\n`);

    // Example 6: Delete cache
    console.log('6️⃣ Deleting cache...');
    await toolkit.deleteCache(cache.name);
    console.log(`✅ Cache deleted: ${cache.name}\n`);

    // Cleanup
    await toolkit.deleteFile(uploadedDoc.name);
    unlinkSync(docFile);

    console.log('✅ Context caching examples completed!');
    console.log('\n💡 Tips:');
    console.log('   - Minimum tokens: 2,048 (2.5 Flash) or 4,096 (2.5 Pro)');
    console.log('   - Cached tokens are billed at a reduced rate');
    console.log('   - Use explicit model versions (e.g., gemini-2.0-flash-001)');
    console.log('   - Cache expires after TTL or expireTime');
    console.log('   - Ideal for repeated queries against the same content');
    console.log('   - System instructions and files can be cached together');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);

