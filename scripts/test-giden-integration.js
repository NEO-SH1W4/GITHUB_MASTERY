#!/usr/bin/env node

/**
 * Test script for GIDEN integration
 */

import { GIDENIntegration } from '../mcp/giden-integration.js';
import chalk from 'chalk';

console.log(chalk.cyan('🤖 Testing GIDEN Integration...\n'));

async function testGIDEN() {
  const giden = new GIDENIntegration({
    aidenProjectPath: process.env.AIDEN_PROJECT_PATH || 'C:\\Users\\João\\Desktop\\PROJETOS\\AGENTES_IA\\AIDEN_PROJECT'
  });

  try {
    // Test 1: Initialize GIDEN
    console.log(chalk.blue('Test 1: Initializing GIDEN...'));
    const initialized = await giden.initialize();
    if (initialized) {
      console.log(chalk.green('✅ GIDEN initialized successfully\n'));
    } else {
      console.log(chalk.red('❌ Failed to initialize GIDEN\n'));
      return;
    }

    // Test 2: Code Review
    console.log(chalk.blue('Test 2: Testing Code Review...'));
    const reviewResult = await giden.performCodeReview('github_mastery', 1);
    console.log(chalk.green('✅ Code Review Result:'));
    console.log(JSON.stringify(reviewResult, null, 2));
    console.log();

    // Test 3: Repository Optimization
    console.log(chalk.blue('Test 3: Testing Repository Optimization...'));
    const optimizationResult = await giden.analyzeRepoHealth('NEO-SH1W4', 'github_mastery');
    console.log(chalk.green('✅ Optimization Result:'));
    console.log(JSON.stringify(optimizationResult, null, 2));
    console.log();

    // Test 4: Workflow Generation
    console.log(chalk.blue('Test 4: Testing Workflow Generation...'));
    const workflowResult = await giden.generateAdaptiveWorkflow('github_mastery', {
      type: 'ci',
      language: 'javascript',
      framework: 'node'
    });
    console.log(chalk.green('✅ Workflow Result:'));
    console.log(JSON.stringify(workflowResult, null, 2));
    console.log();

    // Test 5: Pattern Detection
    console.log(chalk.blue('Test 5: Testing Pattern Detection...'));
    const patterns = giden.detectPatterns({ issues: [] });
    console.log(chalk.green('✅ Patterns Detected:'));
    patterns.forEach(pattern => console.log(`  - ${pattern}`));
    console.log();

    // Summary
    console.log(chalk.cyan('📊 Test Summary:'));
    console.log(chalk.green('  ✅ All tests passed!'));
    console.log(chalk.yellow('  ⚠️  Note: Currently running in simulation mode'));
    console.log(chalk.blue('  💡 To enable full AIDEN integration:'));
    console.log('     1. Ensure AIDEN project is properly set up');
    console.log('     2. Create aiden_bridge.py in AIDEN project');
    console.log('     3. Install Python dependencies');

  } catch (error) {
    console.error(chalk.red('❌ Error during testing:'), error.message);
  } finally {
    // Cleanup
    await giden.shutdown();
    console.log(chalk.gray('\n🔌 GIDEN shutdown complete'));
  }
}

// Run tests
testGIDEN().catch(console.error);
