#!/usr/bin/env node

/**
 * GitHub Mastery MCP Server
 * 
 * Este servidor MCP (Model Context Protocol) expõe funcionalidades do GitHub
 * para agentes de IA e outras aplicações que suportam MCP.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError 
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubClient } from '../api/github-client.js';
import { createLogger } from '../utils/logger.js';

class GitHubMCPServer {
  constructor() {
    this.logger = createLogger('MCP-Server');
    this.server = new Server(
      {
        name: 'github-mastery',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.githubClient = null;
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  /**
   * Configurar handlers para as ferramentas MCP
   */
  setupToolHandlers() {
    // Handler para listar ferramentas disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'github_authenticate',
            description: 'Authenticate with GitHub and get user information',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'github_list_repos',
            description: 'List GitHub repositories for the authenticated user',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Maximum number of repositories to return',
                  default: 30
                },
                sort: {
                  type: 'string',
                  enum: ['created', 'updated', 'pushed', 'full_name'],
                  description: 'Sort order for repositories',
                  default: 'updated'
                },
                direction: {
                  type: 'string',
                  enum: ['asc', 'desc'],
                  description: 'Sort direction',
                  default: 'desc'
                }
              },
              required: []
            }
          },
          {
            name: 'github_get_repo',
            description: 'Get detailed information about a specific repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)'
                },
                repo: {
                  type: 'string',
                  description: 'Repository name'
                }
              },
              required: ['owner', 'repo']
            }
          },
          {
            name: 'github_list_issues',
            description: 'List issues for a specific repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner'
                },
                repo: {
                  type: 'string',
                  description: 'Repository name'
                },
                state: {
                  type: 'string',
                  enum: ['open', 'closed', 'all'],
                  description: 'Issue state filter',
                  default: 'open'
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of issues to return',
                  default: 30
                }
              },
              required: ['owner', 'repo']
            }
          },
          {
            name: 'github_create_repo',
            description: 'Create a new GitHub repository',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Repository name'
                },
                description: {
                  type: 'string',
                  description: 'Repository description'
                },
                private: {
                  type: 'boolean',
                  description: 'Whether the repository is private',
                  default: false
                },
                auto_init: {
                  type: 'boolean',
                  description: 'Initialize with README',
                  default: true
                },
                license_template: {
                  type: 'string',
                  description: 'License template to use'
                }
              },
              required: ['name']
            }
          },
          {
            name: 'github_rate_limit',
            description: 'Check current GitHub API rate limit status',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          }
        ]
      };
    });

    // Handler para executar ferramentas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Inicializar cliente GitHub se necessário
        if (!this.githubClient) {
          this.githubClient = new GitHubClient();
        }

        switch (name) {
          case 'github_authenticate':
            return await this.handleAuthenticate();

          case 'github_list_repos':
            return await this.handleListRepos(args);

          case 'github_get_repo':
            return await this.handleGetRepo(args);

          case 'github_list_issues':
            return await this.handleListIssues(args);

          case 'github_create_repo':
            return await this.handleCreateRepo(args);

          case 'github_rate_limit':
            return await this.handleRateLimit();

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        this.logger.error(`Error executing tool ${name}:`, error);
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  /**
   * Handler para autenticação GitHub
   */
  async handleAuthenticate() {
    const user = await this.githubClient.authenticate();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            user: {
              login: user.login,
              name: user.name,
              email: user.email,
              company: user.company,
              public_repos: user.public_repos,
              followers: user.followers,
              following: user.following
            }
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handler para listar repositórios
   */
  async handleListRepos(args = {}) {
    const options = {
      per_page: args.limit || 30,
      sort: args.sort || 'updated',
      direction: args.direction || 'desc'
    };

    const repos = await this.githubClient.listRepositories(options);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: repos.length,
            repositories: repos.map(repo => ({
              name: repo.name,
              full_name: repo.full_name,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              open_issues: repo.open_issues_count,
              private: repo.private,
              html_url: repo.html_url,
              clone_url: repo.clone_url,
              created_at: repo.created_at,
              updated_at: repo.updated_at
            }))
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handler para obter repositório específico
   */
  async handleGetRepo(args) {
    const { owner, repo } = args;
    const repository = await this.githubClient.getRepository(owner, repo);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            repository: {
              name: repository.name,
              full_name: repository.full_name,
              description: repository.description,
              language: repository.language,
              stars: repository.stargazers_count,
              forks: repository.forks_count,
              open_issues: repository.open_issues_count,
              private: repository.private,
              html_url: repository.html_url,
              clone_url: repository.clone_url,
              default_branch: repository.default_branch,
              topics: repository.topics,
              license: repository.license,
              created_at: repository.created_at,
              updated_at: repository.updated_at,
              pushed_at: repository.pushed_at
            }
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handler para listar issues
   */
  async handleListIssues(args) {
    const { owner, repo, state = 'open', limit = 30 } = args;
    const issues = await this.githubClient.listIssues(owner, repo, {
      state,
      per_page: limit
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: issues.length,
            issues: issues.map(issue => ({
              number: issue.number,
              title: issue.title,
              body: issue.body,
              state: issue.state,
              user: issue.user.login,
              labels: issue.labels.map(label => label.name),
              assignees: issue.assignees.map(assignee => assignee.login),
              html_url: issue.html_url,
              created_at: issue.created_at,
              updated_at: issue.updated_at
            }))
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handler para criar repositório
   */
  async handleCreateRepo(args) {
    const repository = await this.githubClient.createRepository(args);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            repository: {
              name: repository.name,
              full_name: repository.full_name,
              description: repository.description,
              private: repository.private,
              html_url: repository.html_url,
              clone_url: repository.clone_url,
              created_at: repository.created_at
            }
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Handler para verificar rate limit
   */
  async handleRateLimit() {
    const rateLimit = await this.githubClient.checkRateLimit();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            rate_limit: {
              limit: rateLimit.resources.core.limit,
              remaining: rateLimit.resources.core.remaining,
              reset: new Date(rateLimit.resources.core.reset * 1000).toISOString(),
              used: rateLimit.resources.core.used
            }
          }, null, 2)
        }
      ]
    };
  }

  /**
   * Configurar tratamento de erros
   */
  setupErrorHandling() {
    this.server.onerror = (error) => {
      this.logger.error('MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      this.logger.info('Shutting down MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Iniciar o servidor MCP
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('GitHub Mastery MCP Server started');
  }
}

// Inicializar e executar o servidor
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new GitHubMCPServer();
  server.start().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

export { GitHubMCPServer };

