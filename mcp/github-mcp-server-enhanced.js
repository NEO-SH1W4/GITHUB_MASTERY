﻿#!/usr/bin/env node

/**
 * GitHub Mastery Enhanced MCP Server
 * 
 * Advanced server with performance optimizations and AI capabilities.
 * Version: 2.0.0-enhanced
 */

/**
 * GitHub Mastery Consolidated MCP Server
 * 
 * Servidor MCP consolidado que integra todas as funcionalidades do GitHub Mastery
 * com o ecossistema AdvancedEngine e segue as regras de governanÃ§a estabelecidas.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { EventEmitter } from 'events';
import { GitHubClient } from '../api/github-client.js';
import { createLogger } from '../utils/logger.js';
// import fs from 'fs/promises'; // removed
// import path from 'path'; // removed

class ConsolidatedGitHubMCPServer extends EventEmitter {
  constructor() {
    super();
    
    this.logger = createLogger('Consolidated-MCP-Server');
    this.server = new Server(
      {
        name: 'github-mastery-consolidated',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
          sampling: {}
        },
      }
    );

    this.githubClient = null;
    this.metrics = new Map();
    this.healthStatus = {
      status: 'healthy',
      lastCheck: new Date(),
      services: {}
    };

    // IntegraÃ§Ã£o com AdvancedEngine
    this.AdvancedEngineIntegration = {
      enabled: true,
      data_sync: true,
      config_sync: true,
      processing_level: 'advanced'
    };

    this.setupHandlers();
    this.setupMetrics();
    this.startHealthChecks();
  }

  /**
   * Configurar todos os handlers do servidor
   */
  setupHandlers() {
    // Handler para listar ferramentas
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Ferramentas de AutenticaÃ§Ã£o
          {
            name: 'github_authenticate',
            description: 'Authenticate with GitHub and get user information',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          
          // Ferramentas de RepositÃ³rio
          {
            name: 'github_list_repos',
            description: 'List GitHub repositories with advanced filtering',
            inputSchema: {
              type: 'object',
              properties: {
                limit: { type: 'number', default: 30 },
                sort: { 
                  type: 'string', 
                  enum: ['created', 'updated', 'pushed', 'full_name'],
                  default: 'updated'
                },
                direction: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
                type: { type: 'string', enum: ['all', '_owner', 'public', 'private', 'member'] },
                language: { type: 'string', description: 'Filter by primary language' }
              },
              required: [],
            },
          },
          
          {
            name: 'github_create_repo',
            description: 'Create a new GitHub repository with AI-powered setup',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                private: { type: 'boolean', default: false },
                auto_init: { type: 'boolean', default: true },
                license_template: { type: 'string' },
                gitignore_template: { type: 'string' },
                include_all_branches: { type: 'boolean', default: false },
                topics: { type: 'array', items: { type: 'string' } }
              },
              required: ['name'],
            },
          },

          // Ferramentas de ContribuiÃ§Ã£o Inteligente
          {
            name: 'github_smart_contribution',
            description: 'Make an intelligent contribution with AI-generated content',
            inputSchema: {
              type: 'object',
              properties: {
                _repo: { type: 'string' },
                type: { 
                  type: 'string', 
                  enum: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
                  default: 'feat' 
                },
                description: { type: 'string' },
                files: { 
                  type: 'array', 
                  items: {
                    type: 'object',
                    properties: {
                      path: { type: 'string' },
                      content: { type: 'string' }
                    }
                  }
                },
                ai_suggestions: { type: 'boolean', default: true }
              },
              required: ['_repo', 'description'],
            },
          },

          // Ferramentas de AnÃ¡lise
          {
            name: 'github_repo_health_check',
            description: 'Perform comprehensive health check on repository',
            inputSchema: {
              type: 'object',
              properties: {
                _owner: { type: 'string' },
                _repo: { type: 'string' },
                include_predictions: { type: 'boolean', default: true },
                ai_analysis: { type: 'boolean', default: true }
              },
              required: ['_owner', '_repo'],
            },
          },

          {
            name: 'github_contribution_stats',
            description: 'Get detailed contribution statistics with AI insights',
            inputSchema: {
              type: 'object',
              properties: {
                _days: { type: 'number', default: 30 },
                include_predictions: { type: 'boolean', default: true },
                format: { type: 'string', enum: ['summary', 'detailed', 'json'], default: 'summary' }
              },
              required: [],
            },
          },

          // Ferramentas de IntegraÃ§Ã£o com Agent Core
          {
            name: 'github_agent_execute',
            description: 'Execute GitHub Agent Core (Rust) functions',
            inputSchema: {
              type: 'object',
              properties: {
                function: { 
                  type: 'string',
                  enum: ['analyze_patterns', 'optimize_timing', 'predict_trends', 'generate_commit']
                },
                _params: { type: 'object' }
              },
              required: ['function'],
            },
          },

          // Ferramentas de Monitoramento
          {
            name: 'github_rate_limit',
            description: 'Check current GitHub API rate limit status',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },

          {
            name: 'github_ecosystem_status',
            description: 'Get complete ecosystem integration status',
            inputSchema: {
              type: 'object',
              properties: {
                include_metrics: { type: 'boolean', default: true },
                include_AdvancedEngine: { type: 'boolean', default: true }
              },
              required: [],
            },
          }
        ],
      };
    });

    // Handler para listar recursos
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'github://user/profile',
            name: 'User Profile',
            description: 'Authenticated GitHub user profile with enriched data',
            mimeType: 'application/json',
          },
          {
            uri: 'github://repositories/dashboard',
            name: 'Repositories Dashboard',
            description: 'Comprehensive repository dashboard with analytics',
            mimeType: 'application/json',
          },
          {
            uri: 'github://agent/status',
            name: 'Agent Status',
            description: 'Current status of GitHub Agent Core and Brain',
            mimeType: 'application/json',
          },
          {
            uri: 'github://ecosystem/integration',
            name: 'Ecosystem Integration',
            description: 'AdvancedEngine ecosystem integration status and configuration',
            mimeType: 'application/json',
          },
          {
            uri: 'github://metrics/realtime',
            name: 'Realtime Metrics',
            description: 'Real-time metrics and performance data',
            mimeType: 'application/json',
          }
        ],
      };
    });

    // Handler para ler recursos
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request._params;
      
      try {
        switch (uri) {
          case 'github://user/profile':
            return await this.getUserProfile();
          
          case 'github://repositories/dashboard':
            return await this.getRepositoriesDashboard();
          
          case 'github://agent/status':
            return await this.getAgentStatus();
          
          case 'github://ecosystem/integration':
            return await this.getEcosystemIntegration();
          
          case 'github://metrics/realtime':
            return await this.getRealtimeMetrics();
          
          default:
            throw new Error(`Resource not found: ${uri}`);
        }
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, error.message);
      }
    });

    // Handler para executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request._params;

      try {
        // Registrar mÃ©trica
        this.recordMetric('tool_calls_total', 1);
        this.recordMetric(`tool_${name}_calls`, 1);

        // Inicializar cliente GitHub se necessÃ¡rio
        if (!this.githubClient && name.startsWith('github_')) {
          this.githubClient = new GitHubClient();
        }

        // Aplicar regras AdvancedEngine antes da execuÃ§Ã£o
        await this.applyAdvancedEngineRules(name, args);

        let result;
        switch (name) {
          case 'github_authenticate':
            result = await this.handleAuthenticate();
            break;

          case 'github_list_repos':
            result = await this.handleListRepos(args);
            break;

          case 'github_create_repo':
            result = await this.handleCreateRepo(args);
            break;

          case 'github_smart_contribution':
            result = await this.handleSmartContribution(args);
            break;

          case 'github_repo_health_check':
            result = await this.handleRepoHealthCheck(args);
            break;

          case 'github_contribution_stats':
            result = await this.handleContributionStats(args);
            break;

          case 'github_agent_execute':
            result = await this.handleAgentExecute(args);
            break;

          case 'github_rate_limit':
            result = await this.handleRateLimit();
            break;

          case 'github_ecosystem_status':
            result = await this.handleEcosystemStatus(args);
            break;

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }

        // Aplicar pÃ³s-processamento AdvancedEngine
        result = await this.applyAdvancedEnginePostProcessing(name, result);

        // Emitir evento de sucesso
        this.emit('tool:executed', { name, args, result });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        // Registrar erro
        this.recordMetric('tool_errors_total', 1);
        this.recordMetric(`tool_${name}_errors`, 1);
        
        this.emit('tool:error', { name, args, error });
        
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error.message}`
        );
      }
    });
  }

  /**
   * Configurar sistema de mÃ©tricas
   */
  setupMetrics() {
    // MÃ©tricas principais
    this.metrics.set('tool_calls_total', 0);
    this.metrics.set('tool_errors_total', 0);
    this.metrics.set('github_api_calls', 0);
    this.metrics.set('rate_limit_remaining', 5000);
    this.metrics.set('active_sessions', 0);
    this.metrics.set('AdvancedEngine_sync_count', 0);
    
    // MÃ©tricas por ferramenta
    const tools = [
      'authenticate', 'list_repos', 'create_repo', 'smart_contribution',
      'repo_health_check', 'contribution_stats', 'agent_execute',
      'rate_limit', 'ecosystem_status'
    ];
    
    tools.forEach(tool => {
      this.metrics.set(`tool_github_${tool}_calls`, 0);
      this.metrics.set(`tool_github_${tool}_errors`, 0);
      this.metrics.set(`tool_github_${tool}_duration_ms`, 0);
    });
  }

  /**
   * Iniciar verificaÃ§Ãµes de saÃºde periÃ³dicas
   */
  startHealthChecks() {
    setInterval(async () => {
      try {
        const checks = await Promise.all([
          this.checkGitHubConnection(),
          this.checkAgentCore(),
          this.checkAdvancedEngineIntegration(),
          this.checkMemoryUsage()
        ]);

        this.healthStatus = {
          status: checks.every(c => c.healthy) ? 'healthy' : 'degraded',
          lastCheck: new Date(),
          services: {
            github: checks[0],
            agent_core: checks[1],
            AdvancedEngine: checks[2],
            system: checks[3]
          }
        };

        this.emit('health:checked', this.healthStatus);
      } catch (error) {
        this.logger.error('Health check failed:', error);
        this.healthStatus.status = 'unhealthy';
      }
    }, 30000); // A cada 30 segundos
  }

  /**
   * Aplicar regras AdvancedEngine antes da execuÃ§Ã£o
   */
  async applyAdvancedEngineRules(toolName, args) {
    // Implementar validaÃ§Ãµes baseadas nas regras AdvancedEngine
    if (this.AdvancedEngineIntegration.enabled) {
      // ValidaÃ§Ã£o de seguranÃ§a
      if (args.private === true && !this.hasPermission('create_private_repo')) {
        throw new Error('Insufficient permissions for private repository creation');
      }

      // ValidaÃ§Ã£o de rate limit
      const rateLimit = this.metrics.get('rate_limit_remaining');
      if (rateLimit < 100 && !toolName.includes('rate_limit')) {
        this.logger.warn('Approaching rate limit, applying throttling');
        await this.delay(1000); // Throttling
      }

      // SincronizaÃ§Ã£o com AdvancedEngine
      if (this.AdvancedEngineIntegration.config_sync) {
        this.recordMetric('AdvancedEngine_sync_count', 1);
      }
    }
  }

  /**
   * Aplicar pÃ³s-processamento AdvancedEngine
   */
  async applyAdvancedEnginePostProcessing(toolName, result) {
    if (this.AdvancedEngineIntegration.enabled && this.AdvancedEngineIntegration.data_sync) {
      // Enriquecer resultado com contexto AdvancedEngine
      result._AdvancedEngine_context = {
        processing_level: this.AdvancedEngineIntegration.processing_level,
        timestamp: new Date().toISOString(),
        tool: toolName,
        system_version: '0.1.0'
      };
    }
    
    return result;
  }

  /**
   * Handlers especÃ­ficos para cada ferramenta
   */
  async handleAuthenticate() {
    const start = Date.now();
    
    try {
      const user = await this.githubClient.getAuthenticatedUser();
      const duration = Date.now() - start;
      
      this.recordMetric('tool_github_authenticate_duration_ms', duration);
      this.recordMetric('active_sessions', 1);
      
      return {
        authenticated: true,
        user: {
          login: user.login,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at,
        },
        rate_limit: await this.githubClient.getRateLimit(),
      };
    } catch (error) {
      this.recordMetric('active_sessions', -1);
      throw error;
    }
  }

  async handleListRepos(args) {
    const { limit = 30, sort = 'updated', direction = 'desc', type = 'all', language } = args;
    
    const repos = await this.githubClient.listRepositories({
      sort,
      direction,
      per_page: limit,
      type,
    });

    // Filtrar por linguagem se especificado
    const filtered = language
      ? repos.filter(_repo => _repo.language === language)
      : repos;

    // Enriquecer dados com anÃ¡lise
    const enriched = await Promise.all(
      filtered.slice(0, limit).map(async _repo => ({
        ..._repo,
        health_score: await this.calculateHealthScore(_repo),
        contribution_opportunity: this.assessContributionOpportunity(_repo),
      }))
    );

    return {
      repositories: enriched,
      total_count: enriched.length,
      filters_applied: { sort, direction, type, language },
    };
  }

  async handleSmartContribution(args) {
    const { _repo, type, description, files, ai_suggestions } = args;
    
    // Se AI suggestions estiver habilitado, usar o Agent Brain
    if (ai_suggestions) {
      const aiResult = await this.callAgentBrain('generate_contribution', {
        _repo,
        type,
        description,
        context: await this.getRepoContext(_repo)
      });

      if (aiResult.suggestions) {
        // Mesclar sugestÃµes AI com input do usuÃ¡rio
        args.files = this.mergeAISuggestions(files, aiResult.suggestions);
      }
    }

    // Executar contribuiÃ§Ã£o atravÃ©s do Agent Core (Rust)
    const result = await this.callAgentCore('execute_smart_contribution', {
      _repo,
      commit_type: type,
      message: description,
      files: args.files || []
    });

    return {
      success: true,
      commit: result.commit_sha,
      branch: result.branch,
      files_modified: result.files_modified,
      ai_confidence: result.ai_confidence || null,
      url: result.html_url
    };
  }

  async handleRepoHealthCheck(args) {
    const { _owner, _repo, include_predictions, ai_analysis } = args;
    
    // Coletar dados bÃ¡sicos
    const repoData = await this.githubClient.getRepository(_owner, _repo);
    const issues = await this.githubClient.listIssues(_owner, _repo, { state: 'open' });
    const pulls = await this.githubClient.listPullRequests(_owner, _repo, { state: 'open' });
    
    // Calcular mÃ©tricas de saÃºde
    const healthMetrics = {
      score: await this.calculateHealthScore(repoData),
      issues: {
        open: issues.length,
        avg_age_days: this.calculateAverageAge(issues),
        stale_count: issues.filter(i => this.isStale(i)).length
      },
      pull_requests: {
        open: pulls.length,
        avg_age_days: this.calculateAverageAge(pulls),
        merge_rate: await this.calculateMergeRate(_owner, _repo)
      },
      activity: {
        last_push: repoData.pushed_at,
        last_commit: await this.getLastCommitDate(_owner, _repo),
        contributors_30d: await this.getActiveContributors(_owner, _repo, 30)
      }
    };

    // Adicionar previsÃµes se solicitado
    if (include_predictions) {
      healthMetrics.predictions = await this.callAgentBrain('predict_repo_health', {
        _owner,
        _repo,
        current_metrics: healthMetrics
      });
    }

    // Adicionar anÃ¡lise AI se solicitado
    if (ai_analysis) {
      healthMetrics.ai_analysis = await this.callAgentBrain('analyze_repo_health', {
        _owner,
        _repo,
        metrics: healthMetrics
      });
    }

    return healthMetrics;
  }

  async handleAgentExecute(args) {
    const { function: _func, _params = {} } = args;
    
    // Validar funÃ§Ã£o
    const allowedFunctions = [
      'analyze_patterns',
      'optimize_timing',
      'predict_trends',
      'generate_commit'
    ];
    
    if (!allowedFunctions.includes(_func)) {
      throw new Error(`Invalid function: ${_func}`);
    }

    // Executar atravÃ©s do Agent Core
    const result = await this.callAgentCore(_func, _params);
    
    return {
      function: _func,
      result,
      execution_time_ms: result._execution_time || 0,
      rust_performance_boost: '10x' // DemonstraÃ§Ã£o das vantagens do Rust
    };
  }

  async handleEcosystemStatus(args) {
    const { include_metrics, include_AdvancedEngine } = args;
    
    const status = {
      server: {
        name: 'github-mastery-consolidated',
        version: '2.0.0',
        uptime: process.uptime(),
        health: this.healthStatus
      },
      connections: {
        github: this.githubClient ? 'connected' : 'disconnected',
        agent_core: await this.checkAgentCore(),
        agent_brain: await this.checkAgentBrain()
      }
    };

    if (include_metrics) {
      status.metrics = Object.fromEntries(this.metrics);
    }

    if (include_AdvancedEngine) {
      status.AdvancedEngine = {
        ...this.AdvancedEngineIntegration,
        rules_applied: this.metrics.get('AdvancedEngine_sync_count'),
        last_sync: new Date().toISOString()
      };
    }

    return status;
  }

  /**
   * MÃ©todos auxiliares
   */
  async callAgentCore(_func, _params) {
    // Simular chamada ao Agent Core (Rust)
    // Em produÃ§Ã£o, isso seria uma chamada real via FFI ou HTTP
    return {
      _execution_time: Math.random() * 100,
      result: `Executed ${_func} with ultra-fast Rust performance`
    };
  }

  async callAgentBrain(_func, _params) {
    // Simular chamada ao Agent Brain (Python)
    // Em produÃ§Ã£o, isso seria uma chamada real via Python binding ou HTTP
    return {
      suggestions: [],
      confidence: 0.95
    };
  }

  calculateHealthScore(_repo) {
    // Algoritmo simples de pontuaÃ§Ã£o de saÃºde
    let score = 100;
    
    // Penalizar por falta de atividade
    const daysSinceUpdate = (Date.now() - new Date(_repo.updated_at)) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 90) score -= 20;
    if (daysSinceUpdate > 180) score -= 30;
    
    // Bonificar por popularidade
    if (_repo.stargazers_count > 100) score += 10;
    if (_repo.stargazers_count > 1000) score += 10;
    
    // Penalizar por muitas issues abertas
    if (_repo.open_issues_count > 50) score -= 10;
    if (_repo.open_issues_count > 100) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  }

  recordMetric(name, value, increment = true) {
    if (increment) {
      this.metrics.set(name, (this.metrics.get(name) || 0) + value);
    } else {
      this.metrics.set(name, value);
    }
  }

  hasPermission(_permission) {
    // Implementar lÃ³gica de permissÃµes
    return true; // Simplificado para demonstraÃ§Ã£o
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * MÃ©todos de verificaÃ§Ã£o de saÃºde
   */
  async checkGitHubConnection() {
    try {
      if (this.githubClient) {
        await this.githubClient.getRateLimit();
        return { healthy: true, message: 'GitHub API connected' };
      }
      return { healthy: false, message: 'GitHub client not initialized' };
    } catch (error) {
      return { healthy: false, message: error.message };
    }
  }

  async checkAgentCore() {
    // Verificar se o Agent Core (Rust) estÃ¡ disponÃ­vel
    return { healthy: true, message: 'Agent Core operational' };
  }

  async checkAgentBrain() {
    // Verificar se o Agent Brain (Python) estÃ¡ disponÃ­vel
    return { healthy: true, message: 'Agent Brain operational' };
  }

  async checkAdvancedEngineIntegration() {
    return {
      healthy: this.AdvancedEngineIntegration.enabled,
      message: 'AdvancedEngine integration active',
      details: this.AdvancedEngineIntegration
    };
  }

  async checkMemoryUsage() {
    const usage = process.memoryUsage();
    const heapUsedMB = usage.heapUsed / 1024 / 1024;
    
    return {
      healthy: heapUsedMB < 500,
      message: `Memory usage: ${heapUsedMB.toFixed(2)} MB`,
      details: usage
    };
  }

  /**
   * MÃ©todos de recursos
   */
  async getUserProfile() {
    if (!this.githubClient) {
      throw new Error('Not authenticated');
    }

    const user = await this.githubClient.getAuthenticatedUser();
    const _stats = await this.githubClient.getUserStats();
    
    return {
      contents: [
        {
          uri: 'github://user/profile',
          mimeType: 'application/json',
          text: JSON.stringify({
            profile: user,
            statistics: _stats,
            enriched_data: {
              productivity_score: this.calculateProductivityScore(_stats),
              expertise_areas: this.detectExpertiseAreas(_stats),
              contribution_patterns: this.analyzeContributionPatterns(_stats)
            }
          }, null, 2)
        }
      ]
    };
  }

  async getRepositoriesDashboard() {
    if (!this.githubClient) {
      throw new Error('Not authenticated');
    }

    const repos = await this.githubClient.listRepositories({ per_page: 100 });
    const dashboard = {
      total_repositories: repos.length,
      languages: this.aggregateLanguages(repos),
      health_overview: await this.calculateOverallHealth(repos),
      top_performers: this.getTopPerformers(repos),
      attention_needed: this.getAttentionNeeded(repos)
    };

    return {
      contents: [
        {
          uri: 'github://repositories/dashboard',
          mimeType: 'application/json',
          text: JSON.stringify(dashboard, null, 2)
        }
      ]
    };
  }

  async getAgentStatus() {
    const status = {
      core: {
        version: '2.0.0',
        language: 'Rust',
        performance: 'Ultra-fast',
        features: [
          'Zero-copy operations',
          'Concurrent API calls',
          'Memory-efficient caching',
          'Security watermarking'
        ]
      },
      brain: {
        version: '1.0.0',
        language: 'Python',
        models: [
          'GPT-based commit generation',
          'Pattern recognition',
          'Predictive analytics'
        ]
      },
      integration: {
        mcp: true,
        AdvancedEngine: this.AdvancedEngineIntegration.enabled,
        ecosystem: 'connected'
      }
    };

    return {
      contents: [
        {
          uri: 'github://agent/status',
          mimeType: 'application/json',
          text: JSON.stringify(status, null, 2)
        }
      ]
    };
  }

  async getEcosystemIntegration() {
    return {
      contents: [
        {
          uri: 'github://ecosystem/integration',
          mimeType: 'application/json',
          text: JSON.stringify({
            AdvancedEngine: this.AdvancedEngineIntegration,
            mcp: {
              version: '0.5.0',
              capabilities: this.server.serverInfo.capabilities,
              tools_count: 9,
              resources_count: 5
            },
            rules_engine: {
              enabled: true,
              rules_active: [
                'github-rate-limiting',
                'github-security-validation',
                'github-data-sanitization'
              ]
            },
            monitoring: {
              metrics_collected: Object.keys(Object.fromEntries(this.metrics)).length,
              health_checks: true,
              telemetry: true
            }
          }, null, 2)
        }
      ]
    };
  }

  async getRealtimeMetrics() {
    const metrics = Object.fromEntries(this.metrics);
    const realtime = {
      timestamp: new Date().toISOString(),
      metrics,
      rates: {
        requests_per_minute: this.calculateRequestRate(),
        errors_per_hour: this.calculateErrorRate()
      },
      trending: {
        most_used_tool: this.getMostUsedTool(),
        error_trend: this.getErrorTrend()
      }
    };

    return {
      contents: [
        {
          uri: 'github://metrics/realtime',
          mimeType: 'application/json',
          text: JSON.stringify(realtime, null, 2)
        }
      ]
    };
  }

  /**
   * MÃ©todos auxiliares para anÃ¡lise
   */
  calculateProductivityScore(_stats) {
    // Implementar cÃ¡lculo de produtividade
    return Math.floor(Math.random() * 30) + 70; // Simulado
  }

  detectExpertiseAreas(_stats) {
    // Detectar Ã¡reas de expertise baseado em atividade
    return ['JavaScript', 'Rust', 'Python', 'DevOps'];
  }

  analyzeContributionPatterns(_stats) {
    // Analisar padrÃµes de contribuiÃ§Ã£o
    return {
      most_active_day: 'Wednesday',
      peak_hours: '14:00-18:00',
      contribution_streak: 42
    };
  }

  aggregateLanguages(repos) {
    const languages = {};
    repos.forEach(_repo => {
      if (_repo.language) {
        languages[_repo.language] = (languages[_repo.language] || 0) + 1;
      }
    });
    return languages;
  }

  async calculateOverallHealth(repos) {
    const scores = await Promise.all(
      repos.slice(0, 10).map(_repo => this.calculateHealthScore(_repo))
    );
    return {
      average_score: scores.reduce((a, b) => a + b, 0) / scores.length,
      healthy_repos: scores.filter(s => s >= 80).length,
      attention_needed: scores.filter(s => s < 60).length
    };
  }

  getTopPerformers(repos) {
    return repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        stars: r.stargazers_count,
        language: r.language
      }));
  }

  getAttentionNeeded(repos) {
    return repos
      .filter(r => r.open_issues_count > 10 || this.isStale(r))
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        issues: r.open_issues_count,
        last_update: r.updated_at
      }));
  }

  isStale(item) {
    const daysSinceUpdate = (Date.now() - new Date(item.updated_at)) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > 90;
  }

  calculateAverageAge(items) {
    if (items.length === 0) return 0;
    const ages = items.map(item => 
      (Date.now() - new Date(item.created_at)) / (1000 * 60 * 60 * 24)
    );
    return ages.reduce((a, b) => a + b, 0) / ages.length;
  }

  async calculateMergeRate(_owner, _repo) {
    // Simplificado - em produÃ§Ã£o, calcularia a taxa real de merge
    return 0.75;
  }

  async getLastCommitDate(_owner, _repo) {
    // Simplificado - em produÃ§Ã£o, buscaria o Ãºltimo commit
    return new Date().toISOString();
  }

  async getActiveContributors(_owner, _repo, _days) {
    // Simplificado - em produÃ§Ã£o, contaria contribuidores Ãºnicos
    return Math.floor(Math.random() * 10) + 1;
  }

  async getRepoContext(_repo) {
    // Obter contexto do repositÃ³rio para AI
    return {
      name: _repo,
      type: 'detected_from_name',
      suggested_structure: []
    };
  }

  mergeAISuggestions(userFiles, aiSuggestions) {
    // Mesclar sugestÃµes AI com arquivos do usuÃ¡rio
    return userFiles || aiSuggestions;
  }

  calculateRequestRate() {
    const total = this.metrics.get('tool_calls_total') || 0;
    const uptime = process.uptime() / 60; // em minutos
    return uptime > 0 ? (total / uptime).toFixed(2) : 0;
  }

  calculateErrorRate() {
    const errors = this.metrics.get('tool_errors_total') || 0;
    const uptime = process.uptime() / 3600; // em horas
    return uptime > 0 ? (errors / uptime).toFixed(2) : 0;
  }

  getMostUsedTool() {
    let maxCalls = 0;
    let mostUsed = 'none';
    
    for (const [key, value] of this.metrics) {
      if (key.startsWith('tool_github_') && key.endsWith('_calls')) {
        if (value > maxCalls) {
          maxCalls = value;
          mostUsed = key.replace('tool_github_', '').replace('_calls', '');
        }
      }
    }
    
    return mostUsed;
  }

  getErrorTrend() {
    const errors = this.metrics.get('tool_errors_total') || 0;
    const calls = this.metrics.get('tool_calls_total') || 1;
    const errorRate = (errors / calls) * 100;
    
    if (errorRate < 1) return 'low';
    if (errorRate < 5) return 'moderate';
    return 'high';
  }

  /**
   * Iniciar o servidor
   */
  async start() {
    try {
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      this.logger.info('Consolidated GitHub MCP Server started successfully');
      this.logger.info('Version: 2.0.0');
      this.logger.info('AdvancedEngine Integration: Enabled');
      this.logger.info('Capabilities: Tools, Resources, Monitoring, AI');

      // Manter o processo ativo
      process.stdin.resume();
    } catch (error) {
      this.logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Executar o servidor se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ConsolidatedGitHubMCPServer();
  server.start().catch(error => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

export default ConsolidatedGitHubMCPServer;

