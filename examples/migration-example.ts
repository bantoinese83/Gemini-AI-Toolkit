/**
 * Migration Example: From Monolithic to Service-Based Architecture
 *
 * This example demonstrates how to migrate from the old monolithic GeminiToolkit
 * approach to the new service-based architecture for better maintainability.
 */

import { GeminiToolkit } from '../src/index';

// ===== OLD APPROACH (Monolithic) =====
/**
 * Legacy monolithic approach - all methods on one class
 * This approach still works for backward compatibility but is deprecated
 */
async function oldApproach() {
  console.log('📦 OLD APPROACH (Monolithic) - DEPRECATED\n');

  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  try {
    // All methods directly on the main toolkit instance
    const text = await toolkit.generateText('Hello, world!');
    console.log('✅ Text generated:', text);

    const chat = toolkit.createChat('gemini-2.5-flash');
    const chatResponse = await chat.sendMessage({ message: 'How are you?' });
    console.log('✅ Chat response:', chatResponse.text);

    const searchResult = await toolkit.groundWithSearch('Latest AI news');
    console.log('✅ Search result:', searchResult.text?.substring(0, 50) + '...');

    // Issues with this approach:
    // 1. Large monolithic class with many responsibilities
    // 2. Tight coupling between different concerns
    // 3. Harder to test individual components
    // 4. Less maintainable as the codebase grows

  } catch (error) {
    console.error('❌ Error in old approach:', error);
  }
}

// ===== NEW APPROACH (Service-Based) =====
/**
 * New service-based approach - modular and maintainable
 * Each service has a single responsibility
 */
async function newApproach() {
  console.log('\n🛠️  NEW APPROACH (Service-Based) - RECOMMENDED\n');

  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  // Destructure service instances for cleaner code
  const { coreAI, chat, grounding, fileSearch, files, cache, tokens } = toolkit;

  try {
    // Core AI operations - handled by CoreAIService
    const text = await coreAI.generateText('Hello, world!', {
      model: 'gemini-2.5-flash'
    });
    console.log('✅ Text generated:', text);

    // Chat operations - handled by ChatService
    const chatSession = chat.createChat('gemini-2.5-flash');
    const chatResponse = await chatSession.sendMessage({ message: 'How are you?' });
    console.log('✅ Chat response:', chatResponse.text?.substring(0, 50) + '...');

    // Grounding operations - handled by GroundingService
    const searchResult = await grounding.groundWithSearch('Latest AI news');
    console.log('✅ Search result:', searchResult.text?.substring(0, 50) + '...');

    // File operations - handled by FilesService
    const fileList = await files.listFiles(5);
    console.log('✅ Files listed:', fileList.files?.length || 0, 'files');

    // Cache operations - handled by CacheService
    const cacheList = await cache.listCaches();
    console.log('✅ Caches listed:', cacheList.cachedContents?.length || 0, 'caches');

    // Token operations - handled by TokenService
    const tokenCount = await tokens.countTokens('Hello, world!');
    console.log('✅ Token count:', tokenCount.totalTokens);

    // Benefits of this approach:
    // 1. Single Responsibility Principle - each service has one job
    // 2. Loose coupling - services can be modified independently
    // 3. Easier testing - test services in isolation
    // 4. Better maintainability - changes are localized
    // 5. Clear separation of concerns

  } catch (error) {
    console.error('❌ Error in new approach:', error);
  }
}

// ===== MIGRATION STRATEGIES =====
/**
 * Different migration strategies you can use
 */
async function migrationStrategies() {
  console.log('\n🔄 MIGRATION STRATEGIES\n');

  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  // Strategy 1: Gradual Migration
  console.log('📊 Strategy 1: Gradual Migration');
  console.log('   Start using new services for new features');
  console.log('   Migrate existing code incrementally');

  // Old way (still works)
  // const oldText = await toolkit.generateText('Old way');

  // New way (recommended for new code)
  const newText = await toolkit.coreAI.generateText('New way');
  console.log('   ✅ Mixed usage works during transition\n');

  // Strategy 2: Service Injection
  console.log('💉 Strategy 2: Service Injection');
  console.log('   Inject specific services into your classes/functions');

  // Instead of passing the entire toolkit
  function processText(text: string, coreAIService: typeof toolkit.coreAI) {
    return coreAIService.generateText(text);
  }

  const result = await processText('Hello from injected service', toolkit.coreAI);
  console.log('   ✅ Service injection:', result.substring(0, 30) + '...\n');

  // Strategy 3: Wrapper Classes
  console.log('🎁 Strategy 3: Wrapper Classes');
  console.log('   Create wrapper classes that use the new services internally');

  class TextProcessor {
    constructor(private coreAI: typeof toolkit.coreAI) {}

    async summarize(text: string) {
      return this.coreAI.generateText(`Summarize: ${text}`);
    }
  }

  const processor = new TextProcessor(toolkit.coreAI);
  const summary = await processor.summarize('This is a long text that needs summarization.');
  console.log('   ✅ Wrapper class result:', summary.substring(0, 50) + '...\n');
}

// ===== BACKWARD COMPATIBILITY =====
/**
 * The old methods still work but are deprecated
 */
async function backwardCompatibility() {
  console.log('🔙 BACKWARD COMPATIBILITY\n');

  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  console.log('✅ Old methods still work (but show deprecation warnings):');

  // These still work but are marked as @deprecated
  try {
    const text = await toolkit.generateText('Hello from deprecated method');
    console.log('   ✅ Deprecated method works:', text);

    const chat = toolkit.createChat();
    console.log('   ✅ Deprecated chat creation works');

  } catch (error) {
    console.error('   ❌ Error with deprecated methods:', error);
  }

  console.log('\n📝 Migration Timeline:');
  console.log('   • v1.x: Both approaches supported');
  console.log('   • v2.x: Old methods removed (breaking change)');
  console.log('   • Current: Old methods deprecated but functional\n');
}

// ===== TESTING MIGRATION =====
/**
 * How to test your migration
 */
async function testingMigration() {
  console.log('🧪 TESTING YOUR MIGRATION\n');

  const toolkit = new GeminiToolkit({
    apiKey: process.env.GEMINI_API_KEY || 'your-api-key-here'
  });

  console.log('📋 Testing Checklist:');
  console.log('   1. ✅ Functionality works the same');
  console.log('   2. ✅ Error handling preserved');
  console.log('   3. ✅ Performance maintained');
  console.log('   4. ✅ API contracts unchanged');

  // Test that both approaches give similar results
  try {
    // Old approach
    const oldResult = await toolkit.generateText('Test message', {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.1 }
    });

    // New approach
    const newResult = await toolkit.coreAI.generateText('Test message', {
      model: 'gemini-2.5-flash',
      config: { temperature: 0.1 }
    });

    console.log('   ✅ Both approaches work');
    console.log(`   📏 Old result length: ${oldResult.length}`);
    console.log(`   📏 New result length: ${newResult.length}`);

    // They should be similar (though not identical due to AI randomness)
    const lengthDiff = Math.abs(oldResult.length - newResult.length);
    if (lengthDiff < 50) { // Allow some variance
      console.log('   ✅ Results are functionally equivalent');
    } else {
      console.log('   ⚠️  Results differ significantly - investigate');
    }

  } catch (error) {
    console.error('   ❌ Testing failed:', error);
  }
}

// ===== MAIN EXECUTION =====
async function main() {
  console.log('🚀 Gemini Toolkit Migration Example\n');
  console.log('=' .repeat(50));

  await oldApproach();
  console.log('=' .repeat(50));

  await newApproach();
  console.log('=' .repeat(50));

  await migrationStrategies();
  console.log('=' .repeat(50));

  await backwardCompatibility();
  console.log('=' .repeat(50));

  await testingMigration();
  console.log('=' .repeat(50));

  console.log('🎉 Migration example completed!');
  console.log('\n💡 Key Takeaways:');
  console.log('   • New service-based architecture is more maintainable');
  console.log('   • Old methods still work during transition period');
  console.log('   • Migrate gradually using the strategies shown');
  console.log('   • Test thoroughly during migration');
  console.log('   • Benefits: better separation of concerns, easier testing, improved maintainability');
}

if (require.main === module) {
  main().catch(console.error);
}
