/**
 * @file Example: File Search (RAG) - Retrieval Augmented Generation
 * 
 * This example demonstrates how to use File Search (RAG) to upload documents
 * and query them with the Gemini API. File Search enables semantic search
 * over your documents for accurate, context-aware answers.
 * 
 * Features demonstrated:
 * - Creating File Search stores
 * - Uploading files to File Search stores
 * - Querying documents with File Search
 * - Using metadata filters
 * - Custom chunking configuration
 * - Polling operations for completion
 */

import {
  GeminiToolkit,
  createFileSearchStore,
  uploadToFileSearchStore,
  queryFileSearch,
} from 'gemini-ai-toolkit';
import { writeFileSync } from 'fs';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Please set GEMINI_API_KEY environment variable');
    process.exit(1);
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('📚 File Search (RAG) Example\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Create a File Search store
    console.log('\n1️⃣ Creating File Search store...');
    const store = await toolkit.createFileSearchStore('my-documents-store');
    const storeName = (store as { name: string }).name;
    console.log(`✅ Created store: ${storeName}`);

    // Step 2: Create a sample document
    console.log('\n2️⃣ Creating sample document...');
    const sampleContent = `
Robert Graves was a British poet, novelist, and scholar, born in 1895.
He is best known for his historical novels, particularly "I, Claudius" (1934)
and "Claudius the God" (1935), which were later adapted into a BBC television series.

Graves also wrote "Goodbye to All That" (1929), an autobiography of his experiences
during World War I. He was a prolific writer, producing over 140 books in his lifetime.

Graves lived much of his life in Majorca, Spain, where he continued writing until
his death in 1985. His work continues to influence literature and historical fiction.
    `.trim();

    const sampleFile = 'sample-document.txt';
    writeFileSync(sampleFile, sampleContent);
    console.log(`✅ Created sample file: ${sampleFile}`);

    // Step 3: Upload file directly to File Search store
    console.log('\n3️⃣ Uploading file to File Search store...');
    console.log('   (This may take a moment as the file is chunked and indexed)');
    
    const uploadOperation = await toolkit.uploadToFileSearchStore(
      sampleFile,
      storeName,
      {
        displayName: 'Robert Graves Biography',
        customMetadata: [
          { key: 'author', stringValue: 'Robert Graves' },
          { key: 'year', numericValue: 1934 },
          { key: 'category', stringValue: 'biography' },
        ],
        chunkingConfig: {
          whiteSpaceConfig: {
            maxTokensPerChunk: 200,
            maxOverlapTokens: 20,
          },
        },
      }
    );

    // Step 4: Poll for operation completion
    console.log('\n4️⃣ Waiting for file import to complete...');
    let operation = uploadOperation;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (!(operation as { done?: boolean }).done && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      operation = await toolkit.getClient().operations.get({ operation });
      attempts++;
      if (attempts % 6 === 0) {
        console.log(`   Still processing... (${attempts * 5}s)`);
      }
    }

    if (!(operation as { done?: boolean }).done) {
      throw new Error('File import timed out');
    }

    console.log('✅ File imported successfully!');

    // Step 5: Query with File Search
    console.log('\n5️⃣ Querying with File Search...');
    const query1 = 'Tell me about Robert Graves';
    console.log(`   Query: "${query1}"`);
    
    const result1 = await toolkit.queryWithFileSearch(
      query1,
      { fileSearchStoreNames: [storeName] }
    );

    console.log('\n📝 Response:');
    console.log(result1.text);
    console.log('\n📎 Citations available in result.candidates[0].groundingMetadata');

    // Step 6: Query with metadata filter
    console.log('\n6️⃣ Querying with metadata filter...');
    const query2 = "Tell me about the book 'I, Claudius'";
    console.log(`   Query: "${query2}"`);
    console.log('   Filter: author="Robert Graves"');

    const result2 = await toolkit.queryWithFileSearch(
      query2,
      {
        fileSearchStoreNames: [storeName],
        metadataFilter: 'author="Robert Graves"',
      }
    );

    console.log('\n📝 Filtered Response:');
    console.log(result2.text);

    // Step 7: Using quick functions
    console.log('\n7️⃣ Using quick functions...');
    const quickStore = await createFileSearchStore('quick-store');
    const quickStoreName = (quickStore as { name: string }).name;
    console.log(`✅ Created store with quick function: ${quickStoreName}`);

    // Step 8: Cleanup (optional)
    console.log('\n8️⃣ Cleanup...');
    // Note: In production, you might want to keep the stores
    // await toolkit.deleteFileSearchStore(storeName);
    // await toolkit.deleteFileSearchStore(quickStoreName);
    console.log('✅ Example complete! (stores kept for demonstration)');

    // Clean up sample file
    const { unlinkSync } = require('fs');
    try {
      unlinkSync(sampleFile);
    } catch (err) {
      // Ignore if file doesn't exist
    }

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

