#!/usr/bin/env node

/**
 * Script para verificar o status do MCP
 */

import { createLogger } from './utils/logger.js';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const logger = createLogger('mcp-check');

async function checkMCP() {
  try {
    logger.info('🔍 Verificando status do MCP...');
    
    // Verificar configuração
    logger.info('📄 Verificando arquivo de configuração...');
    if (fs.existsSync('mcp-config.json')) {
      const mcpConfig = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
      logger.info(`✅ Configuração MCP - OK (${Object.keys(mcpConfig.mcpServers || {}).length} servidores definidos)`);
      
      // Listar servidores configurados
      if (mcpConfig.mcpServers) {
        for (const serverName of Object.keys(mcpConfig.mcpServers)) {
          const server = mcpConfig.mcpServers[serverName];
          const enabled = server.enabled !== false;
          if (enabled) {
            logger.info(`📡 Servidor: ${serverName} - ATIVO`);
          } else {
            logger.warn(`📡 Servidor: ${serverName} - DESATIVADO`);
          }
        }
      }
    } else {
      logger.error('❌ Configuração MCP - NÃO ENCONTRADA');
    }
    
    // Verificar processos Node.js em execução
    logger.info('🔄 Verificando processos Node.js...');
    try {
      const { stdout } = await execPromise('tasklist /FI "IMAGENAME eq node.exe" /FO CSV');
      const lines = stdout.trim().split('\n');
      
      if (lines.length > 1) {
        logger.info(`✅ Processos Node.js - OK (${lines.length - 1} processos em execução)`);
      } else {
        logger.warn('⚠️ Processos Node.js - NENHUM EM EXECUÇÃO');
        logger.info('💡 Execute o script restart.ps1 para iniciar o servidor MCP');
      }
    } catch (error) {
      logger.error(`❌ Erro ao verificar processos: ${error.message}`);
    }
    
    // Verificar status do VIREON
    logger.info('🧠 Verificando integração VIREON...');
    if (fs.existsSync('mcp-config.json')) {
      const mcpConfig = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
      if (mcpConfig.vireonIntegration && mcpConfig.vireonIntegration.enabled) {
        logger.info('✅ Integração VIREON - ATIVA');
        logger.info(`📊 Nível de consciência: ${mcpConfig.vireonIntegration.consciousnessLevel || 'basic'}`);
      } else {
        logger.warn('⚠️ Integração VIREON - DESATIVADA');
      }
    }
    
    // Verificar status do GIDEN
    logger.info('🤖 Verificando integração GIDEN...');
    if (fs.existsSync('mcp-config.json')) {
      const mcpConfig = JSON.parse(fs.readFileSync('mcp-config.json', 'utf8'));
      if (mcpConfig.gidenIntegration && mcpConfig.gidenIntegration.enabled) {
        logger.info('✅ Integração GIDEN - ATIVA');
        
        // Verificar pasta do projeto AIDEN
        const aidenPath = mcpConfig.gidenIntegration.aidenProjectPath;
        if (aidenPath && fs.existsSync(aidenPath)) {
          logger.info(`✅ Caminho AIDEN - VÁLIDO (${aidenPath})`);
        } else {
          logger.warn(`⚠️ Caminho AIDEN - INVÁLIDO (${aidenPath || 'não definido'})`);
        }
      } else {
        logger.warn('⚠️ Integração GIDEN - DESATIVADA');
      }
    }
    
    logger.info('✅ Verificação concluída!');
    
  } catch (error) {
    logger.error(`❌ Erro na verificação: ${error.message}`);
    process.exit(1);
  }
}

// Executar verificação
checkMCP();
