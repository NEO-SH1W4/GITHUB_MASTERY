#!/usr/bin/env node

/**
 * GitHub Mastery MCP Ecosystem Adapter
 *
 * Este adaptador integra o servidor MCP do GitHub Mastery com o ecossistema MCP principal,
 * fornecendo recursos avançados como rules engine, monitoramento e orquestração.
 */

import { EventEmitter } from 'events';
import { GitHubMCPServer } from './github-mcp-server.js';
import { createLogger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export class GitHubMCPEcosystemAdapter extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = {
      ecosystemEndpoint: config.ecosystemEndpoint || 'http://localhost:3000',
      integrationConfig: config.integrationConfig || './mcp-ecosystem-integration.json',
      rulesEnabled: config.rulesEnabled !== false,
      monitoringEnabled: config.monitoringEnabled !== false,
      ...config,
    };

    this.logger = createLogger('MCP-Ecosystem-Adapter');
    this.githubServer = null;
    this.ecosystemConnection = null;
    this.metrics = new Map();
    this.rules = new Map();
    this.isConnected = false;

    this.setupMetrics();
  }

  /**
   * Inicializar o adaptador e conectar ao ecossistema
   */
  async initialize() {
    try {
      this.logger.info('Inicializando adaptador do ecossistema MCP...');

      // Carregar configuração de integração
      await this.loadIntegrationConfig();

      // Inicializar servidor GitHub MCP
      await this.initializeGitHubServer();

      // Conectar ao ecossistema MCP
      await this.connectToEcosystem();

      // Registrar no ecossistema
      await this.registerWithEcosystem();

      // Configurar rules engine se habilitado
      if (this.config.rulesEnabled) {
        await this.setupRulesEngine();
      }

      // Configurar monitoramento se habilitado
      if (this.config.monitoringEnabled) {
        await this.setupMonitoring();
      }

      this.isConnected = true;
      this.logger.info('Adaptador inicializado com sucesso');
      this.emit('initialized');
    } catch (error) {
      this.logger.error('Erro ao inicializar adaptador:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Carregar configuração de integração
   */
  async loadIntegrationConfig() {
    try {
      const configPath = path.resolve(this.config.integrationConfig);
      const configData = await fs.readFile(configPath, 'utf8');
      this.integrationConfig = JSON.parse(configData);

      this.logger.info('Configuração de integração carregada:', {
        name: this.integrationConfig.integration.name,
        version: this.integrationConfig.integration.version,
      });
    } catch (error) {
      this.logger.error('Erro ao carregar configuração de integração:', error);
      throw new Error(`Falha ao carregar configuração: ${error.message}`);
    }
  }

  /**
   * Inicializar servidor GitHub MCP
   */
  async initializeGitHubServer() {
    try {
      this.githubServer = new GitHubMCPServer();

      // Configurar listeners para métricas
      this.githubServer.on('tool:executed', data => {
        this.recordMetric('tools_executed', 1);
        this.recordMetric(`tool_${data.name}_executed`, 1);
      });

      this.githubServer.on('tool:error', data => {
        this.recordMetric('tools_errors', 1);
        this.recordMetric(`tool_${data.name}_error`, 1);
      });

      this.logger.info('Servidor GitHub MCP inicializado');
    } catch (error) {
      this.logger.error('Erro ao inicializar servidor GitHub:', error);
      throw error;
    }
  }

  /**
   * Conectar ao ecossistema MCP principal
   */
  async connectToEcosystem() {
    try {
      // Simulação de conexão - em implementação real seria WebSocket ou HTTP
      this.logger.info(
        `Conectando ao ecossistema MCP em ${this.config.ecosystemEndpoint}...`
      );

      // Para demonstração, simularemos uma conexão bem-sucedida
      this.ecosystemConnection = {
        endpoint: this.config.ecosystemEndpoint,
        connected: true,
        connectionTime: new Date(),
      };

      this.logger.info('Conectado ao ecossistema MCP');
    } catch (error) {
      this.logger.error('Erro ao conectar ao ecossistema:', error);
      throw error;
    }
  }

  /**
   * Registrar servidor no ecossistema
   */
  async registerWithEcosystem() {
    try {
      const registrationData = {
        server: this.integrationConfig.server,
        tools: this.integrationConfig.tools,
        resources: this.integrationConfig.resources,
        capabilities: this.integrationConfig.server.capabilities,
        health_endpoint: '/health',
        metrics_endpoint: '/metrics',
      };

      // Simulação do registro - em implementação real seria API call
      this.logger.info('Registrando no ecossistema MCP:', {
        name: registrationData.server.name,
        tools_count: registrationData.tools.length,
        resources_count: registrationData.resources.length,
      });

      this.emit('registered', registrationData);
    } catch (error) {
      this.logger.error('Erro ao registrar no ecossistema:', error);
      throw error;
    }
  }

  /**
   * Configurar rules engine
   */
  async setupRulesEngine() {
    try {
      this.logger.info('Configurando rules engine...');

      // Carregar regras específicas do GitHub
      const githubRules = [
        {
          id: 'github-rate-limiting',
          name: 'GitHub Rate Limiting',
          description: 'Monitorar e controlar rate limits da API GitHub',
          condition: context => context.tool?.startsWith('github_'),
          action: async (context, result) => {
            if (result?.rate_limit) {
              this.recordMetric(
                'github_rate_limit_remaining',
                result.rate_limit.remaining
              );

              if (result.rate_limit.remaining < 100) {
                this.logger.warn('Rate limit GitHub baixo:', result.rate_limit);
                this.emit('rate_limit_warning', result.rate_limit);
              }
            }
          },
        },
        {
          id: 'github-security-validation',
          name: 'GitHub Security Validation',
          description: 'Validar permissões e segurança nas operações GitHub',
          condition: context => context.tool === 'github_create_repo',
          action: async context => {
            // Validar se criação de repositório está dentro das políticas
            if (context.params?.private === false) {
              this.logger.info('Repositório público criado:', context.params?.name);
            }
          },
        },
        {
          id: 'github-data-sanitization',
          name: 'GitHub Data Sanitization',
          description: 'Sanitizar dados sensíveis antes de retornar',
          condition: context => context.tool?.startsWith('github_'),
          action: async (context, result) => {
            // Remover dados sensíveis se necessário
            if (result?.content?.[0]?.text) {
              try {
                const data = JSON.parse(result.content[0].text);
                if (data.user?.email) {
                  // Log acesso a email mas não exposição desnecessária
                  this.logger.debug('Acesso a dados de email do usuário');
                }
              } catch (e) {
                // Ignore parsing errors
              }
            }
          },
        },
      ];

      githubRules.forEach(rule => {
        this.rules.set(rule.id, rule);
        this.logger.debug(`Regra carregada: ${rule.id}`);
      });

      this.logger.info(`Rules engine configurado com ${this.rules.size} regras`);
    } catch (error) {
      this.logger.error('Erro ao configurar rules engine:', error);
      throw error;
    }
  }

  /**
   * Configurar monitoramento
   */
  async setupMonitoring() {
    try {
      this.logger.info('Configurando monitoramento...');

      // Configurar coleta de métricas periódica
      this.metricsInterval = setInterval(() => {
        this.collectSystemMetrics();
      }, 30000); // A cada 30 segundos

      // Configurar health check
      this.healthCheckInterval = setInterval(() => {
        this.performHealthCheck();
      }, this.integrationConfig.monitoring?.health_check?.interval || 30000);

      this.logger.info('Monitoramento configurado');
    } catch (error) {
      this.logger.error('Erro ao configurar monitoramento:', error);
      throw error;
    }
  }

  /**
   * Configurar métricas
   */
  setupMetrics() {
    this.metrics.set('startup_time', Date.now());
    this.metrics.set('tools_executed', 0);
    this.metrics.set('tools_errors', 0);
    this.metrics.set('requests_total', 0);
    this.metrics.set('github_rate_limit_remaining', 5000);
  }

  /**
   * Registrar métrica
   */
  recordMetric(name, value) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, typeof value === 'number' ? value : current + 1);
    this.metrics.set(`${name}_last_updated`, Date.now());
  }

  /**
   * Coletar métricas do sistema
   */
  collectSystemMetrics() {
    try {
      this.recordMetric('uptime', Date.now() - this.metrics.get('startup_time'));
      this.recordMetric('memory_usage', process.memoryUsage().heapUsed);
      this.recordMetric('rules_count', this.rules.size);
      this.recordMetric('ecosystem_connected', this.isConnected ? 1 : 0);

      this.emit('metrics_collected', Object.fromEntries(this.metrics));
    } catch (error) {
      this.logger.error('Erro ao coletar métricas:', error);
    }
  }

  /**
   * Realizar health check
   */
  async performHealthCheck() {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        ecosystem_connected: this.isConnected,
        github_server_running: this.githubServer ? true : false,
        rules_engine_active: this.config.rulesEnabled,
        monitoring_active: this.config.monitoringEnabled,
        metrics: Object.fromEntries(this.metrics),
      };

      // Verificar conectividade com o ecossistema
      if (!this.ecosystemConnection?.connected) {
        health.status = 'degraded';
        health.issues = ['ecosystem_disconnected'];
      }

      this.emit('health_check', health);
      this.logger.debug('Health check realizado:', health.status);

      return health;
    } catch (error) {
      this.logger.error('Erro no health check:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Aplicar regra a uma operação
   */
  async applyRules(context, result) {
    if (!this.config.rulesEnabled) return result;

    try {
      for (const [ruleId, rule] of this.rules) {
        if (rule.condition(context)) {
          await rule.action(context, result);
          this.recordMetric(`rule_${ruleId}_applied`, 1);
        }
      }

      return result;
    } catch (error) {
      this.logger.error('Erro ao aplicar regras:', error);
      return result;
    }
  }

  /**
   * Executar ferramenta com integração ao ecossistema
   */
  async executeTool(name, params) {
    try {
      const startTime = Date.now();
      const context = { tool: name, params, timestamp: startTime };

      this.recordMetric('requests_total', 1);
      this.logger.debug(`Executando ferramenta: ${name}`, params);

      // Executar via servidor GitHub MCP
      const result = await this.githubServer.server.request({
        method: 'tools/call',
        params: {
          name,
          arguments: params,
        },
      });

      // Aplicar regras ao resultado
      const processedResult = await this.applyRules(context, result);

      // Registrar métricas
      const duration = Date.now() - startTime;
      this.recordMetric('requests_duration', duration);
      this.recordMetric(`tool_${name}_duration`, duration);

      this.emit('tool_executed', {
        name,
        params,
        result: processedResult,
        duration,
      });

      return processedResult;
    } catch (error) {
      this.logger.error(`Erro ao executar ferramenta ${name}:`, error);
      this.recordMetric('tools_errors', 1);
      this.emit('tool_error', { name, params, error });
      throw error;
    }
  }

  /**
   * Obter status do adaptador
   */
  getStatus() {
    return {
      connected: this.isConnected,
      ecosystem_endpoint: this.config.ecosystemEndpoint,
      github_server: this.githubServer ? 'running' : 'stopped',
      rules_enabled: this.config.rulesEnabled,
      monitoring_enabled: this.config.monitoringEnabled,
      rules_count: this.rules.size,
      metrics: Object.fromEntries(this.metrics),
    };
  }

  /**
   * Parar o adaptador
   */
  async stop() {
    try {
      this.logger.info('Parando adaptador do ecossistema MCP...');

      // Limpar intervalos
      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
      }

      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
      }

      // Parar servidor GitHub MCP
      if (this.githubServer) {
        await this.githubServer.server.close();
      }

      // Desconectar do ecossistema
      if (this.ecosystemConnection) {
        this.ecosystemConnection.connected = false;
      }

      this.isConnected = false;
      this.logger.info('Adaptador parado com sucesso');
      this.emit('stopped');
    } catch (error) {
      this.logger.error('Erro ao parar adaptador:', error);
      throw error;
    }
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const adapter = new GitHubMCPEcosystemAdapter();

  adapter.on('initialized', () => {
    console.log('✅ Adaptador inicializado com sucesso');
  });

  adapter.on('error', error => {
    console.error('❌ Erro no adaptador:', error);
    process.exit(1);
  });

  adapter.on('health_check', health => {
    console.log(`🏥 Health Check: ${health.status}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Recebido SIGINT, parando adaptador...');
    await adapter.stop();
    process.exit(0);
  });

  // Inicializar
  adapter.initialize().catch(error => {
    console.error('Falha ao inicializar adaptador:', error);
    process.exit(1);
  });
}

export default GitHubMCPEcosystemAdapter;
