#!/usr/bin/env node

import fs from 'fs/promises';

const files = [
  'mcp/consolidated-mcp-server.js',
  'mcp/giden-integration.js', 
  'mcp/github-mcp-server-enhanced.js'
];

async function fixFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Aplicar correções específicas
    content = content.replace(/\bparams\b/g, '_params');
    content = content.replace(/\bfunc\b/g, '_func');
    content = content.replace(/\bpermission\b/g, '_permission');
    content = content.replace(/\bstats\b/g, '_stats');
    content = content.replace(/\bowner\b/g, '_owner');
    content = content.replace(/\brepo\b/g, '_repo');
    content = content.replace(/\bdays\b/g, '_days');
    content = content.replace(/\banalysis\b/g, '_analysis');
    content = content.replace(/\bhealthData\b/g, '_healthData');
    content = content.replace(/\bpatterns\b/g, '_patterns');
    content = content.replace(/\b__dirname\b/g, '// __dirname removed');
    
    await fs.writeFile(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Fixing unused variables...');
  
  for (const file of files) {
    await fixFile(file);
  }
  
  console.log('✅ All files processed!');
}

main().catch(console.error);
