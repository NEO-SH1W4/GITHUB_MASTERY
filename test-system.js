#!/usr/bin/env node

/**
 * Script de teste para verificar o funcionamento básico do sistema
 */

import { GitHubClient } from './api/github-client.js';
import { createLogger } from './utils/logger.js';
import fs from 'fs';
import path from 'path';

const logger = createLogger('system-test');

async function testSystem() {
  try {
    logger.info('🔄 Iniciando teste do sistema...');
    
    // Verificar arquivos essenciais
    const essentialFiles = [
      'package.json',
      'mcp-config.json',
      '.env',
      'api/github-client.js',
      'utils/logger.js'
    ];
    
    logger.info('📁 Verificando arquivos essenciais...');
    for (const file of essentialFiles) {
      if (fs.existsSync(file)) {
        logger.info(`✅ ${file} - OK`);
      } else {
        logger.error(`❌ ${file} - MISSING`);
      }
    }
    
    // Verificar variáveis de ambiente
    logger.info('🔐 Verificando variáveis de ambiente...');
    const envVars = ['GITHUB_TOKEN', 'GITHUB_USERNAME'];
    for (const envVar of envVars) {
      if (process.env[envVar]) {
        logger.info(`✅ ${envVar} - SET`);
      } else {
        logger.warn(`⚠️ ${envVar} - NOT SET`);
      }
    }
    
    // Testar cliente GitHub
    logger.info('🐙 Testando cliente GitHub...');
    try {
      const githubClient = new GitHubClient();
      const user = await githubClient.authenticate();
      logger.info(`✅ GitHub Client - OK (User: ${user.login})`);
    } catch (error) {
      logger.error(`❌ GitHub Client - ERROR: ${error.message}`);
    }
    
    // Verificar dependências
    logger.info('📦 Verificando dependências...');
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      logger.info(`✅ Dependencies - ${dependencies.length} found`);
    } catch (error) {
      logger.error(`❌ Dependencies - ERROR: ${error.message}`);
    }
    
    logger.info('✅ Teste do sistema concluído!');
    
  } catch (error) {
    logger.error(`❌ Erro no teste do sistema: ${error.message}`);
    process.exit(1);
  }
}

// Executar teste
testSystem();
