/**
 * @file Example: URL Context - Analyze Content from URLs
 * 
 * This example demonstrates how to use the URL Context tool to analyze content
 * from web pages, PDFs, and other accessible URLs. The URL Context tool allows
 * the model to retrieve and analyze content from up to 20 URLs per request.
 * 
 * Features demonstrated:
 * - Analyzing content from single or multiple URLs
 * - Comparing content across different URLs
 * - Combining URL Context with Google Search
 * - Accessing URL retrieval metadata
 * - Extracting specific information from URLs
 */

import {
  GeminiToolkit,
  queryWithUrlContext,
  queryWithUrlContextAndSearch,
} from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Please set GEMINI_API_KEY environment variable');
    process.exit(1);
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('🌐 URL Context Example\n');
  console.log('=' .repeat(50));

  try {
    // Example 1: Compare content from multiple URLs
    console.log('\n1️⃣ Comparing recipes from different websites...');
    const url1 = 'https://www.foodnetwork.com/recipes/ina-garten/perfect-roast-chicken-recipe-1940592';
    const url2 = 'https://www.allrecipes.com/recipe/21151/simple-whole-roast-chicken/';
    
    const result1 = await toolkit.generateWithUrlContext(
      `Compare the ingredients and cooking times from the recipes at ${url1} and ${url2}`
    );

    console.log('📝 Comparison:');
    console.log(result1.text.substring(0, 500) + '...\n');

    // Access URL retrieval metadata
    const urlMetadata = (result1.candidates?.[0] as any)?.urlContextMetadata;
    if (urlMetadata?.urlMetadata) {
      console.log('📎 URLs Retrieved:');
      urlMetadata.urlMetadata.forEach((meta: any, index: number) => {
        console.log(`   ${index + 1}. ${meta.retrievedUrl}`);
        console.log(`      Status: ${meta.urlRetrievalStatus}`);
      });
      console.log();
    }

    // Example 2: Extract specific information from a URL
    console.log('2️⃣ Extracting specific information from a URL...');
    const techUrl = 'https://www.example.com/tech-article'; // Replace with real URL
    try {
      const result2 = await toolkit.generateWithUrlContext(
        `Extract the key findings and main conclusions from ${techUrl}`
      );
      console.log('📝 Extracted Information:');
      console.log(result2.text.substring(0, 400) + '...\n');
    } catch (error) {
      console.log('   (Skipping - requires valid accessible URL)\n');
    }

    // Example 3: Synthesize content from multiple sources
    console.log('3️⃣ Synthesizing content from multiple URLs...');
    const doc1 = 'https://www.example.com/report1'; // Replace with real URLs
    const doc2 = 'https://www.example.com/report2';
    
    try {
      const result3 = await toolkit.generateWithUrlContext(
        `Based on the information from ${doc1} and ${doc2}, create a comprehensive summary highlighting the main points, similarities, and differences.`
      );
      console.log('📝 Synthesized Summary:');
      console.log(result3.text.substring(0, 400) + '...\n');
    } catch (error) {
      console.log('   (Skipping - requires valid accessible URLs)\n');
    }

    // Example 4: Combine URL Context with Google Search
    console.log('4️⃣ Combining URL Context with Google Search...');
    const analysisUrl = 'https://www.example.com/ai-report'; // Replace with real URL
    
    try {
      const result4 = await toolkit.generateWithUrlContextAndSearch(
        `Find the latest information about AI developments and then provide a detailed analysis of the report at ${analysisUrl}. Also consider what needs to be taken care of regarding current trends.`
      );
      console.log('📝 Combined Analysis:');
      console.log(result4.text.substring(0, 500) + '...\n');
    } catch (error) {
      console.log('   (Skipping - requires valid accessible URL)\n');
    }

    // Example 5: Using quick functions
    console.log('5️⃣ Using quick functions...');
    const quickResult = await queryWithUrlContext(
      `Analyze the main topics discussed at ${url1}`,
      'gemini-2.5-flash'
    );
    console.log('📝 Quick Function Result:');
    console.log(quickResult.text.substring(0, 300) + '...\n');

    // Example 6: Analyze code/documentation from GitHub
    console.log('6️⃣ Analyzing code/documentation (example)...');
    const githubUrl = 'https://github.com/example/repo/blob/main/README.md'; // Replace with real URL
    
    try {
      const result6 = await toolkit.generateWithUrlContext(
        `Based on the README at ${githubUrl}, explain what this project does, how to set it up, and what are the key features.`
      );
      console.log('📝 Project Analysis:');
      console.log(result6.text.substring(0, 400) + '...\n');
    } catch (error) {
      console.log('   (Skipping - requires valid GitHub URL)\n');
    }

    // Example 7: Compare documents
    console.log('7️⃣ Comparing documents (example)...');
    const pdf1 = 'https://www.example.com/document1.pdf'; // Replace with real PDF URLs
    const pdf2 = 'https://www.example.com/document2.pdf';
    
    try {
      const result7 = await toolkit.generateWithUrlContext(
        `Compare the key points, methodologies, and conclusions from the PDFs at ${pdf1} and ${pdf2}. Identify differences and track trends.`
      );
      console.log('📝 Document Comparison:');
      console.log(result7.text.substring(0, 400) + '...\n');
    } catch (error) {
      console.log('   (Skipping - requires valid PDF URLs)\n');
    }

    console.log('✅ Example complete!');
    console.log('\n💡 Tips:');
    console.log('- Provide full URLs including https://');
    console.log('- Up to 20 URLs can be processed per request');
    console.log('- Maximum 34MB per URL');
    console.log('- Check urlContextMetadata for retrieval status');
    console.log('- URLs must be publicly accessible (no login/paywall)');

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

