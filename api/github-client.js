import { Octokit } from '@octokit/rest';
// import { createTokenAuth } from '@octokit/auth-token';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Carregar variáveis de ambiente
dotenv.config();

/**
 * Cliente GitHub API com autenticação e operações básicas
 */
class GitHubClient {
  constructor(token = null) {
    this.token = token || process.env.GITHUB_TOKEN;

    if (!this.token || this.token.trim() === '') {
      throw new Error(
        'GitHub token is required. Set GITHUB_TOKEN environment variable.'
      );
    }

    // Configurar autenticação
    // const auth = createTokenAuth(this.token);

    // Inicializar cliente Octokit
    this.octokit = new Octokit({
      auth: this.token,
      userAgent: 'github-mastery-client v1.0.0',
    });

    this.rateLimitThreshold = process.env.RATE_LIMIT_THRESHOLD || 100;
  }

  /**
   * Verificar autenticação e obter informações do usuário
   */
  async authenticate() {
    try {
      console.log(chalk.blue('🔐 Verificando autenticação...'));

      const { data: user } = await this.octokit.rest.users.getAuthenticated();

      console.log(chalk.green('✅ Autenticação bem-sucedida!'));
      console.log(chalk.cyan(`👤 Usuário: ${user.login}`));
      console.log(chalk.cyan(`📧 Email: ${user.email || 'N/A'}`));
      console.log(chalk.cyan(`🏢 Empresa: ${user.company || 'N/A'}`));

      return user;
    } catch (error) {
      console.log(chalk.red('❌ Erro na autenticação:'), error.message);
      throw error;
    }
  }

  /**
   * Verificar rate limit atual
   */
  async checkRateLimit() {
    try {
      const { data: rateLimit } = await this.octokit.rest.rateLimit.get();

      const core = rateLimit.resources.core;
      const remaining = core.remaining;
      const limit = core.limit;
      const resetTime = new Date(core.reset * 1000);

      console.log(chalk.blue('📊 Rate Limit Status:'));
      console.log(chalk.cyan(`   Restantes: ${remaining}/${limit}`));
      console.log(chalk.cyan(`   Reset em: ${resetTime.toLocaleString()}`));

      if (remaining < this.rateLimitThreshold) {
        console.log(
          chalk.yellow(`⚠️  Rate limit baixo: ${remaining} requests restantes`)
        );
      }

      return rateLimit;
    } catch (error) {
      console.log(chalk.red('❌ Erro ao verificar rate limit:'), error.message);
      throw error;
    }
  }

  /**
   * Listar repositórios do usuário autenticado
   */
  async listRepositories(options = {}) {
    try {
      console.log(chalk.blue('📚 Listando repositórios...'));

      const defaultOptions = {
        sort: 'updated',
        direction: 'desc',
        per_page: 30,
        ...options,
      };

      const { data: repos } =
        await this.octokit.rest.repos.listForAuthenticatedUser(defaultOptions);

      console.log(chalk.green(`✅ Encontrados ${repos.length} repositórios:`));

      repos.forEach((repo, index) => {
        console.log(chalk.cyan(`${index + 1}. ${repo.full_name}`));
        console.log(
          chalk.gray(
            `   🌟 ${repo.stargazers_count} | 🍴 ${repo.forks_count} | ${repo.language || 'N/A'}`
          )
        );
        console.log(chalk.gray(`   📝 ${repo.description || 'Sem descrição'}`));
        console.log('');
      });

      return repos;
    } catch (error) {
      console.log(chalk.red('❌ Erro ao listar repositórios:'), error.message);
      throw error;
    }
  }

  /**
   * Obter detalhes de um repositório específico
   */
  async getRepository(owner, repo) {
    try {
      console.log(chalk.blue(`🔍 Buscando repositório ${owner}/${repo}...`));

      const { data: repository } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      console.log(chalk.green('✅ Repositório encontrado:'));
      console.log(chalk.cyan(`📦 Nome: ${repository.full_name}`));
      console.log(chalk.cyan(`🌟 Stars: ${repository.stargazers_count}`));
      console.log(chalk.cyan(`🍴 Forks: ${repository.forks_count}`));
      console.log(chalk.cyan(`🔄 Issues: ${repository.open_issues_count}`));
      console.log(
        chalk.cyan(`📅 Criado: ${new Date(repository.created_at).toLocaleDateString()}`)
      );
      console.log(
        chalk.cyan(
          `🔄 Atualizado: ${new Date(repository.updated_at).toLocaleDateString()}`
        )
      );

      return repository;
    } catch (error) {
      console.log(
        chalk.red(`❌ Erro ao buscar repositório ${owner}/${repo}:`),
        error.message
      );
      throw error;
    }
  }

  /**
   * Criar um novo repositório
   */
  async createRepository(repoData) {
    try {
      // Validar se o nome do repositório foi fornecido
      if (!repoData.name || repoData.name.trim() === '') {
        throw new Error('Repository name is required');
      }

      console.log(chalk.blue(`🆕 Criando repositório ${repoData.name}...`));

      const { data: newRepo } =
        await this.octokit.rest.repos.createForAuthenticatedUser(repoData);

      console.log(chalk.green('✅ Repositório criado com sucesso!'));
      console.log(chalk.cyan(`📦 Nome: ${newRepo.full_name}`));
      console.log(chalk.cyan(`🔗 URL: ${newRepo.html_url}`));
      console.log(chalk.cyan(`📋 Clone: ${newRepo.clone_url}`));

      return newRepo;
    } catch (error) {
      console.log(chalk.red('❌ Erro ao criar repositório:'), error.message);
      throw error;
    }
  }

  /**
   * Listar issues de um repositório
   */
  async listIssues(owner, repo, options = {}) {
    try {
      console.log(chalk.blue(`🐛 Listando issues de ${owner}/${repo}...`));

      const defaultOptions = {
        state: 'open',
        sort: 'updated',
        direction: 'desc',
        per_page: 30,
        ...options,
      };

      const { data: issues } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        ...defaultOptions,
      });

      console.log(chalk.green(`✅ Encontradas ${issues.length} issues:`));

      issues.forEach((issue, index) => {
        const labels = issue.labels.map(label => label.name).join(', ');
        console.log(chalk.cyan(`${index + 1}. #${issue.number} - ${issue.title}`));
        console.log(
          chalk.gray(
            `   👤 ${issue.user.login} | 📅 ${new Date(issue.created_at).toLocaleDateString()}`
          )
        );
        if (labels) {
          console.log(chalk.gray(`   🏷️  ${labels}`));
        }
        console.log('');
      });

      return issues;
    } catch (error) {
      console.log(chalk.red('❌ Erro ao listar issues:'), error.message);
      throw error;
    }
  }

  /**
   * Criar uma nova issue
   */
  async createIssue(owner, repo, issueData) {
    try {
      const { data: issue } = await this.octokit.rest.issues.create({
        owner,
        repo,
        ...issueData,
      });

      return issue;
    } catch (error) {
      console.error(chalk.red('❌ Erro ao criar issue:'), error.message);
      throw error;
    }
  }

  /**
   * Obter informações de rate limit
   */
  async getRateLimit() {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      return data;
    } catch (error) {
      console.error(chalk.red('❌ Erro ao obter rate limit:'), error.message);
      throw error;
    }
  }

  /**
   * Validar token de autenticação
   */
  async validateToken() {
    try {
      await this.octokit.rest.users.getAuthenticated();
      return true;
    } catch (error) {
      console.error(chalk.red('❌ Token inválido:'), error.message);
      return false;
    }
  }

  /**
   * Obter informações de um pull request
   */
  async getPullRequest(owner, repo, prNumber) {
    try {
      const { data } = await this.octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      });
      return data;
    } catch (error) {
      console.error(chalk.red('❌ Erro ao obter PR:'), error.message);
      throw error;
    }
  }
}

export { GitHubClient };
