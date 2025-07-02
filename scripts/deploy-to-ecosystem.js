#!/usr/bin/env node

/**
 * Script de Deployment - GitHub Mastery para Ecossistema MCP
 *
 * Este script automatiza o processo de deployment e integração do GitHub Mastery
 * com o ecossistema MCP, incluindo validação, configuração e testes.
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Deployment');

class MCPEcosystemDeployment {
  constructor() {
    this.projectRoot = process.cwd();
    this.ecosystemPath = path.join(this.projectRoot, '..', 'MCP_ECOSYSTEM');
    this.integrationConfig = null;
    this.deploymentSteps = [];
  }

  /**
   * Executar deployment completo
   */
  async deploy() {
    try {
      logger.info('🚀 Iniciando deployment para ecossistema MCP...');

      // Pré-validações
      await this.validateEnvironment();
      await this.loadConfiguration();

      // Steps do deployment
      await this.backupCurrentConfig();
      await this.copyIntegrationFiles();
      await this.updateEcosystemConfig();
      await this.installDependencies();
      await this.runIntegrationTests();
      await this.registerWithEcosystem();

      logger.info('✅ Deployment concluído com sucesso!');
      await this.printDeploymentSummary();
    } catch (error) {
      logger.error('❌ Erro durante deployment:', error);
      await this.rollback();
      process.exit(1);
    }
  }

  /**
   * Validar ambiente antes do deployment
   */
  async validateEnvironment() {
    logger.info('🔍 Validando ambiente...');

    // Verificar se ecossistema MCP existe
    try {
      await fs.access(this.ecosystemPath);
      logger.info(`✅ Ecossistema MCP encontrado em: ${this.ecosystemPath}`);
    } catch (error) {
      throw new Error(`Ecossistema MCP não encontrado em: ${this.ecosystemPath}`);
    }

    // Verificar Node.js e npm
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      logger.info(`✅ Node.js: ${nodeVersion}, npm: ${npmVersion}`);
    } catch (error) {
      throw new Error('Node.js ou npm não encontrados');
    }

    // Verificar Git
    try {
      const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
      logger.info(`✅ ${gitVersion}`);
    } catch (error) {
      throw new Error('Git não encontrado');
    }

    // Verificar token GitHub
    if (!process.env.GITHUB_TOKEN) {
      logger.warn('⚠️  GITHUB_TOKEN não definido - configure antes de usar');
    } else {
      logger.info('✅ GITHUB_TOKEN configurado');
    }
  }

  /**
   * Carregar configuração de integração
   */
  async loadConfiguration() {
    logger.info('📋 Carregando configuração de integração...');

    try {
      const configPath = path.join(this.projectRoot, 'mcp-ecosystem-integration.json');
      const configData = await fs.readFile(configPath, 'utf8');
      this.integrationConfig = JSON.parse(configData);

      logger.info('✅ Configuração carregada:', {
        name: this.integrationConfig.integration.name,
        version: this.integrationConfig.integration.version,
        tools: this.integrationConfig.tools.length,
        resources: this.integrationConfig.resources.length,
      });
    } catch (error) {
      throw new Error(`Erro ao carregar configuração: ${error.message}`);
    }
  }

  /**
   * Backup da configuração atual
   */
  async backupCurrentConfig() {
    logger.info('💾 Fazendo backup da configuração atual...');

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(this.projectRoot, 'backups', timestamp);

      await fs.mkdir(backupDir, { recursive: true });

      // Backup dos arquivos de configuração
      const filesToBackup = ['mcp-config.json', 'package.json', '.env.example'];

      for (const file of filesToBackup) {
        try {
          const sourcePath = path.join(this.projectRoot, file);
          const targetPath = path.join(backupDir, file);
          await fs.copyFile(sourcePath, targetPath);
          logger.debug(`✅ Backup criado: ${file}`);
        } catch (error) {
          logger.warn(`⚠️  Arquivo não encontrado para backup: ${file}`);
        }
      }

      this.backupPath = backupDir;
      logger.info(`✅ Backup salvo em: ${backupDir}`);
    } catch (error) {
      throw new Error(`Erro ao criar backup: ${error.message}`);
    }
  }

  /**
   * Copiar arquivos de integração para o ecossistema
   */
  async copyIntegrationFiles() {
    logger.info('📁 Copiando arquivos de integração...');

    try {
      const integrationDir = path.join(
        this.ecosystemPath,
        'integrations',
        'github-mastery'
      );
      await fs.mkdir(integrationDir, { recursive: true });

      // Arquivos a serem copiados
      const filesToCopy = [
        {
          source: 'mcp-ecosystem-integration.json',
          target: 'integration-config.json',
        },
        {
          source: 'mcp/github-mcp-server.js',
          target: 'server.js',
        },
        {
          source: 'mcp/ecosystem-adapter.js',
          target: 'adapter.js',
        },
        {
          source: 'api/github-client.js',
          target: 'github-client.js',
        },
        {
          source: 'utils/logger.js',
          target: 'logger.js',
        },
      ];

      for (const file of filesToCopy) {
        const sourcePath = path.join(this.projectRoot, file.source);
        const targetPath = path.join(integrationDir, file.target);

        // Criar diretório se necessário
        await fs.mkdir(path.dirname(targetPath), { recursive: true });

        await fs.copyFile(sourcePath, targetPath);
        logger.debug(`✅ Copiado: ${file.source} → ${file.target}`);
      }

      logger.info(`✅ Arquivos copiados para: ${integrationDir}`);
    } catch (error) {
      throw new Error(`Erro ao copiar arquivos: ${error.message}`);
    }
  }

  /**
   * Atualizar configuração do ecossistema
   */
  async updateEcosystemConfig() {
    logger.info('⚙️  Atualizando configuração do ecossistema...');

    try {
      const ecosystemConfigPath = path.join(
        this.ecosystemPath,
        'config',
        'mcp-ecosystem.json'
      );

      // Ler configuração atual
      let ecosystemConfig;
      try {
        const configData = await fs.readFile(ecosystemConfigPath, 'utf8');
        ecosystemConfig = JSON.parse(configData);
      } catch (error) {
        // Se não existir, criar configuração básica
        ecosystemConfig = {
          servers: {},
          integrations: {},
          version: '0.1.0',
        };
      }

      // Adicionar configuração do GitHub Mastery
      ecosystemConfig.integrations = ecosystemConfig.integrations || {};
      ecosystemConfig.integrations['github-mastery'] = {
        name: this.integrationConfig.integration.name,
        version: this.integrationConfig.integration.version,
        path: './integrations/github-mastery',
        enabled: true,
        autoStart: true,
        config: this.integrationConfig.server,
      };

      // Salvar configuração atualizada
      await fs.writeFile(
        ecosystemConfigPath,
        JSON.stringify(ecosystemConfig, null, 2),
        'utf8'
      );

      logger.info('✅ Configuração do ecossistema atualizada');
    } catch (error) {
      throw new Error(`Erro ao atualizar configuração: ${error.message}`);
    }
  }

  /**
   * Instalar dependências
   */
  async installDependencies() {
    logger.info('📦 Instalando dependências...');

    try {
      // Instalar dependências no projeto atual
      logger.info('Instalando dependências do GitHub Mastery...');
      execSync('npm install', {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      // Instalar dependências no ecossistema se necessário
      logger.info('Verificando dependências do ecossistema...');
      const ecosystemPackageJson = path.join(this.ecosystemPath, 'package.json');

      try {
        await fs.access(ecosystemPackageJson);
        execSync('npm install', {
          cwd: this.ecosystemPath,
          stdio: 'pipe',
        });
        logger.info('✅ Dependências do ecossistema atualizadas');
      } catch (error) {
        logger.warn('⚠️  package.json do ecossistema não encontrado');
      }

      logger.info('✅ Dependências instaladas');
    } catch (error) {
      throw new Error(`Erro ao instalar dependências: ${error.message}`);
    }
  }

  /**
   * Executar testes de integração
   */
  async runIntegrationTests() {
    logger.info('🧪 Executando testes de integração...');

    try {
      // Teste básico: verificar se os arquivos existem
      const integrationDir = path.join(
        this.ecosystemPath,
        'integrations',
        'github-mastery'
      );
      const requiredFiles = ['server.js', 'adapter.js', 'integration-config.json'];

      for (const file of requiredFiles) {
        const filePath = path.join(integrationDir, file);
        await fs.access(filePath);
        logger.debug(`✅ Arquivo encontrado: ${file}`);
      }

      // Teste: validar JSON de configuração
      const configPath = path.join(integrationDir, 'integration-config.json');
      const configData = await fs.readFile(configPath, 'utf8');
      JSON.parse(configData); // Vai lançar erro se JSON inválido

      logger.info('✅ Testes de integração passaram');
    } catch (error) {
      throw new Error(`Testes de integração falharam: ${error.message}`);
    }
  }

  /**
   * Registrar com o ecossistema
   */
  async registerWithEcosystem() {
    logger.info('📝 Registrando com o ecossistema...');

    try {
      // Criar arquivo de registro
      const registryPath = path.join(
        this.ecosystemPath,
        'registry',
        'github-mastery.json'
      );
      await fs.mkdir(path.dirname(registryPath), { recursive: true });

      const registryEntry = {
        id: 'github-mastery',
        name: this.integrationConfig.integration.name,
        version: this.integrationConfig.integration.version,
        type: 'mcp-server',
        description: this.integrationConfig.integration.description,
        capabilities: this.integrationConfig.server.capabilities,
        tools: this.integrationConfig.tools.map(t => t.name),
        resources: this.integrationConfig.resources.map(r => r.uri),
        registered_at: new Date().toISOString(),
        status: 'active',
      };

      await fs.writeFile(registryPath, JSON.stringify(registryEntry, null, 2), 'utf8');

      logger.info('✅ Registrado no ecossistema');
    } catch (error) {
      throw new Error(`Erro ao registrar: ${error.message}`);
    }
  }

  /**
   * Imprimir resumo do deployment
   */
  async printDeploymentSummary() {
    const summary = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                          DEPLOYMENT CONCLUÍDO                               ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Projeto: ${this.integrationConfig.integration.name.padEnd(60)} ║
║ Versão:  ${this.integrationConfig.integration.version.padEnd(60)} ║
║ Ferramentas: ${String(this.integrationConfig.tools.length).padEnd(56)} ║
║ Recursos:    ${String(this.integrationConfig.resources.length).padEnd(56)} ║
║                                                                              ║
║ Localização no Ecossistema:                                                 ║
║ ${this.ecosystemPath.padEnd(76)} ║
║                                                                              ║
║ Próximos Passos:                                                             ║
║ 1. Configure GITHUB_TOKEN no ambiente                                       ║
║ 2. Inicie o ecossistema MCP                                                  ║
║ 3. Teste as ferramentas GitHub via MCP                                      ║
║                                                                              ║
║ Comandos Úteis:                                                              ║
║ • Iniciar adaptador: node mcp/ecosystem-adapter.js                          ║
║ • Testar servidor: node mcp/github-mcp-server.js                            ║
║ • Ver logs: npm run logs                                                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
`;

    console.log(summary);

    // Salvar resumo em arquivo
    const summaryPath = path.join(this.projectRoot, 'deployment-summary.txt');
    await fs.writeFile(summaryPath, summary, 'utf8');
    logger.info(`📄 Resumo salvo em: ${summaryPath}`);
  }

  /**
   * Rollback em caso de erro
   */
  async rollback() {
    logger.warn('🔄 Iniciando rollback...');

    try {
      if (this.backupPath) {
        // Restaurar arquivos do backup
        const filesToRestore = await fs.readdir(this.backupPath);

        for (const file of filesToRestore) {
          const backupFile = path.join(this.backupPath, file);
          const targetFile = path.join(this.projectRoot, file);

          await fs.copyFile(backupFile, targetFile);
          logger.debug(`✅ Restaurado: ${file}`);
        }

        logger.info('✅ Rollback concluído');
      }
    } catch (error) {
      logger.error('❌ Erro durante rollback:', error);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const deployment = new MCPEcosystemDeployment();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Uso: node scripts/deploy-to-ecosystem.js [opções]

Opções:
  --help, -h     Mostrar esta ajuda
  --dry-run      Simular deployment sem fazer alterações
  --verbose      Modo verboso
  --rollback     Restaurar backup mais recente

Exemplos:
  node scripts/deploy-to-ecosystem.js
  node scripts/deploy-to-ecosystem.js --dry-run
  node scripts/deploy-to-ecosystem.js --verbose
`);
    return;
  }

  if (args.includes('--dry-run')) {
    logger.info('🔍 Modo dry-run: simulando deployment...');
    // Implementar simulação se necessário
    return;
  }

  if (args.includes('--rollback')) {
    logger.info('🔄 Executando rollback...');
    await deployment.rollback();
    return;
  }

  // Configurar nível de log
  if (args.includes('--verbose')) {
    // Implementar modo verboso se necessário
  }

  // Executar deployment
  await deployment.deploy();
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
  });
}

export { MCPEcosystemDeployment };
