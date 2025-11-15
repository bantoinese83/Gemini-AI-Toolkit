/**
 * Example: Smart Utilities - Auto-Detection, Auto-Retry, and Smart Helpers
 * 
 * Demonstrates the new intelligent utilities that make the toolkit more dynamic:
 * - Auto-detection utilities (MIME types, file types, model selection)
 * - Auto-retry utilities (exponential backoff for transient errors)
 * - Smart helpers (simplified operations with automatic detection)
 * 
 * Set GEMINI_API_KEY environment variable before running.
 */

import {
  GeminiToolkit,
  // Auto-detection utilities
  detectMimeType,
  isImage,
  isVideo,
  isAudio,
  isDocument,
  suggestModel,
  detectAspectRatio,
  detectVideoAspectRatio,
  extractFileName,
  isBase64,
  detectMimeTypeFromDataUrl,
  // Auto-retry utilities
  withAutoRetry,
  withRetryConfig,
  type RetryConfig,
  // Smart helpers
  smartUploadFile,
  smartGenerateText,
  smartAnalyzeImage,
  smartGenerateImage,
  smartCreateChat,
  smartBatch,
  // Error types for retry examples
  ApiRequestError,
} from 'gemini-ai-toolkit';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  const toolkit = new GeminiToolkit({ apiKey });

  console.log('=== Smart Utilities Examples ===\n');

  // ============================================
  // AUTO-DETECTION UTILITIES
  // ============================================
  console.log('1. Auto-Detection Utilities:\n');

  // MIME type detection
  console.log('   MIME Type Detection:');
  console.log(`   detectMimeType('image.png'): ${detectMimeType('image.png')}`);
  console.log(`   detectMimeType('.jpg'): ${detectMimeType('.jpg')}`);
  console.log(`   detectMimeType('document.pdf'): ${detectMimeType('document.pdf')}`);
  console.log(`   detectMimeType('video.mp4'): ${detectMimeType('video.mp4')}`);
  console.log(`   detectMimeType('audio.mp3'): ${detectMimeType('audio.mp3')}`);
  console.log();

  // File type detection
  console.log('   File Type Detection:');
  console.log(`   isImage('photo.jpg'): ${isImage('photo.jpg')}`);
  console.log(`   isVideo('movie.mp4'): ${isVideo('movie.mp4')}`);
  console.log(`   isAudio('song.mp3'): ${isAudio('song.mp3')}`);
  console.log(`   isDocument('report.pdf'): ${isDocument('report.pdf')}`);
  console.log();

  // Model suggestion
  console.log('   Model Suggestion:');
  console.log(`   suggestModel('text-generation'): ${suggestModel('text-generation')}`);
  console.log(`   suggestModel('image-analysis', true): ${suggestModel('image-analysis', true)}`);
  console.log(`   suggestModel('complex-reasoning'): ${suggestModel('complex-reasoning')}`);
  console.log(`   suggestModel('chat', true, false): ${suggestModel('chat', true, false)}`);
  console.log();

  // Aspect ratio detection
  console.log('   Aspect Ratio Detection:');
  console.log(`   detectAspectRatio(1920, 1080): ${detectAspectRatio(1920, 1080)}`); // 16:9
  console.log(`   detectAspectRatio(1080, 1080): ${detectAspectRatio(1080, 1080)}`); // 1:1
  console.log(`   detectAspectRatio(1080, 1920): ${detectAspectRatio(1080, 1920)}`); // 9:16
  console.log(`   detectVideoAspectRatio(1920, 1080): ${detectVideoAspectRatio(1920, 1080)}`);
  console.log();

  // File name extraction
  console.log('   File Name Extraction:');
  console.log(`   extractFileName('/path/to/image.png'): ${extractFileName('/path/to/image.png')}`);
  console.log(`   extractFileName('image.png'): ${extractFileName('image.png')}`);
  console.log();

  // Base64 detection
  console.log('   Base64 Detection:');
  const base64Example = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  console.log(`   isBase64('${base64Example.substring(0, 30)}...'): ${isBase64(base64Example)}`);
  console.log(`   detectMimeTypeFromDataUrl('data:image/png;base64,...'): ${detectMimeTypeFromDataUrl('data:image/png;base64,...')}`);
  console.log();

  // ============================================
  // AUTO-RETRY UTILITIES
  // ============================================
  console.log('2. Auto-Retry Utilities:\n');

  // Basic retry
  console.log('   Basic Retry (with default settings):');
  try {
    const result = await withAutoRetry(
      () => toolkit.generateText('Hello, world!'),
      { maxRetries: 3, initialDelay: 1000 }
    );
    console.log(`   ✓ Success: ${result.substring(0, 50)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // Custom retry configuration
  console.log('   Custom Retry Configuration:');
  const retryConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    retryOnRateLimit: true,
    retryOnServerError: true,
    shouldRetry: (error, attempt) => {
      if (error instanceof ApiRequestError) {
        // Retry on rate limits and server errors
        if (error.statusCode === 429 || (error.statusCode && error.statusCode >= 500)) {
          return attempt < 3;
        }
      }
      return false;
    }
  };

  try {
    const result = await withAutoRetry(
      () => toolkit.generateText('Test retry mechanism'),
      retryConfig
    );
    console.log(`   ✓ Success with custom config: ${result.substring(0, 50)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // Retry wrapper
  console.log('   Retry Wrapper (pre-configured):');
  const retryableGenerate = withRetryConfig({ maxRetries: 3, initialDelay: 2000 });
  try {
    const result = await retryableGenerate(() => toolkit.generateText('Using retry wrapper'));
    console.log(`   ✓ Success with wrapper: ${result.substring(0, 50)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // ============================================
  // SMART HELPERS
  // ============================================
  console.log('3. Smart Helpers:\n');

  // Smart file upload (would work with actual file)
  console.log('   Smart File Upload:');
  console.log('   (Auto-detects MIME type, handles Node.js paths and browser File/Blob)');
  console.log('   Example: const file = await smartUploadFile(toolkit, "image.png");');
  console.log('   Example: const file = await smartUploadFile(toolkit, fileInput.files[0]);');
  console.log();

  // Smart text generation
  console.log('   Smart Text Generation (auto-model selection):');
  try {
    const text1 = await smartGenerateText(toolkit, 'Explain AI in simple terms');
    console.log(`   ✓ Text (auto-selected Flash): ${text1.substring(0, 100)}...`);
    console.log();

    const text2 = await smartGenerateText(toolkit, 'Solve this complex problem', undefined, true);
    console.log(`   ✓ Complex (auto-selected Pro): ${text2.substring(0, 100)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // Smart image analysis (would work with actual file)
  console.log('   Smart Image Analysis:');
  console.log('   (Auto-detects MIME type, handles file paths, base64, and File objects)');
  console.log('   Example: const analysis = await smartAnalyzeImage(toolkit, "photo.jpg", "What is this?");');
  console.log('   Example: const analysis = await smartAnalyzeImage(toolkit, base64Image, "Describe");');
  console.log();

  // Smart image generation
  console.log('   Smart Image Generation (with auto-retry):');
  try {
    const image = await smartGenerateImage(toolkit, 'A futuristic robot', '1:1', true);
    console.log(`   ✓ Image generated: ${image.substring(0, 50)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // Smart chat creation
  console.log('   Smart Chat Creation (auto-model selection):');
  try {
    const chat = smartCreateChat(toolkit); // Uses Flash
    const response = await chat.sendMessage({ message: 'Hello!' });
    console.log(`   ✓ Chat (Flash): ${response.text.substring(0, 100)}...`);
    console.log();

    const proChat = smartCreateChat(toolkit, true); // Uses Pro
    const proResponse = await proChat.sendMessage({ message: 'Hello!' });
    console.log(`   ✓ Chat (Pro): ${proResponse.text.substring(0, 100)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // Smart batch processing
  console.log('   Smart Batch Processing (with progress tracking):');
  try {
    const results = await smartBatch(
      toolkit,
      [
        () => toolkit.generateText('First prompt'),
        () => toolkit.generateText('Second prompt'),
        () => toolkit.generateText('Third prompt'),
      ],
      {
        concurrency: 2, // Process 2 at a time
        retry: true, // Auto-retry on errors
        onProgress: (completed, total) => {
          console.log(`   Progress: ${completed}/${total} completed`);
        }
      }
    );
    console.log(`   ✓ Batch complete: ${results.length} results`);
    results.forEach((result, index) => {
      console.log(`     ${index + 1}. ${result.substring(0, 50)}...`);
    });
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  console.log();

  // ============================================
  // COMBINED EXAMPLE
  // ============================================
  console.log('4. Combined Example (Using Multiple Utilities):\n');

  try {
    // Use auto-detection to suggest model
    const useCase = 'image-analysis';
    const suggestedModel = suggestModel(useCase, true);
    console.log(`   Suggested model for ${useCase}: ${suggestedModel}`);

    // Use smart helper with auto-retry
    const result = await smartGenerateText(
      toolkit,
      'Describe what you see in this image',
      undefined,
      false
    );
    console.log(`   ✓ Combined result: ${result.substring(0, 100)}...`);
  } catch (error) {
    console.log(`   ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log('\n=== Examples Complete ===');
}

// Run the example
main().catch((error) => {
  console.error('Error running example:', error);
  process.exit(1);
});

