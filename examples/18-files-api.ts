/**
 * Example: Files API
 * 
 * Demonstrates uploading, managing, and using files with the Gemini API.
 * Files API is useful when request size exceeds 20MB or when you need
 * to reuse files across multiple requests.
 */

import { GeminiToolkit } from 'gemini-ai-toolkit';
import { writeFileSync, unlinkSync } from 'fs';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Files API Examples ===\n');

  try {
    // Example 1: Upload a file
    console.log('1️⃣ Uploading a file...');
    const sampleContent = 'This is a sample text file for demonstration.';
    const sampleFile = 'sample-document.txt';
    writeFileSync(sampleFile, sampleContent);

    const uploadedFile = await toolkit.uploadFile(sampleFile, {
      displayName: 'Sample Document',
      mimeType: 'text/plain'
    });
    console.log(`✅ File uploaded: ${uploadedFile.name}`);
    console.log(`   URI: ${uploadedFile.uri}`);
    console.log(`   State: ${uploadedFile.state}`);
    console.log(`   Size: ${uploadedFile.sizeBytes} bytes\n`);

    // Example 2: Get file metadata
    console.log('2️⃣ Getting file metadata...');
    const fileMetadata = await toolkit.getFile(uploadedFile.name);
    console.log(`✅ File metadata retrieved:`);
    console.log(`   Name: ${fileMetadata.name}`);
    console.log(`   Display Name: ${fileMetadata.displayName}`);
    console.log(`   MIME Type: ${fileMetadata.mimeType}`);
    console.log(`   State: ${fileMetadata.state}`);
    console.log(`   Created: ${fileMetadata.createTime}`);
    console.log(`   Expires: ${fileMetadata.expireTime}\n`);

    // Example 3: Use file in generateText
    console.log('3️⃣ Using file in generateText...');
    const result = await toolkit.generateText('Summarize this document', {
      files: [uploadedFile]
    });
    console.log(`✅ Generated text:\n${result}\n`);

    // Example 4: List all files
    console.log('4️⃣ Listing all files...');
    const files = await toolkit.listFiles(10);
    let fileCount = 0;
    for await (const file of files) {
      fileCount++;
      console.log(`   ${fileCount}. ${(file as any).name} - ${(file as any).displayName || 'No name'}`);
    }
    console.log(`✅ Listed ${fileCount} file(s)\n`);

    // Example 5: Delete file
    console.log('5️⃣ Deleting file...');
    await toolkit.deleteFile(uploadedFile.name);
    console.log(`✅ File deleted: ${uploadedFile.name}\n`);

    // Cleanup
    unlinkSync(sampleFile);

    // Example 6: Upload image and analyze
    console.log('6️⃣ Uploading and analyzing an image...');
    console.log('   (This example shows the pattern - you would use an actual image file)');
    console.log(`
    const imageFile = await toolkit.uploadFile('photo.jpg', {
      displayName: 'My Photo',
      mimeType: 'image/jpeg'
    });
    
    // Wait for processing if needed
    while (imageFile.state !== 'ACTIVE') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      imageFile = await toolkit.getFile(imageFile.name);
    }
    
    const analysis = await toolkit.generateText('Describe this image in detail', {
      files: [imageFile],
      model: 'gemini-2.5-flash-image'
    });
    `);

    console.log('\n✅ Files API examples completed!');
    console.log('\n💡 Tips:');
    console.log('   - Files are automatically deleted after 48 hours');
    console.log('   - Use Files API when request size exceeds 20MB');
    console.log('   - Files can be reused across multiple requests');
    console.log('   - Check file.state before using (should be "ACTIVE")');
    console.log('   - Browser: Use File/Blob objects instead of file paths');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main().catch(console.error);

