/**
 * REST API Adapter para MCP
 *
 * Este módulo cria endpoints REST que expõem os dados do MCP para a UI web,
 * permitindo que o frontend consuma dados dinâmicos em tempo real.
 */

import express from 'express';
import cors from 'cors';
import { GitHubClient } from './github-client.js';
import { createLogger } from '../utils/logger.js';

// Inicializar logger
const logger = createLogger('REST-Adapter');

// Criar cliente GitHub
const githubClient = new GitHubClient();

// Criar servidor Express
const app = express();
const PORT = process.env.REST_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint para verificar status da API
app.get('/api/status', async (req, res) => {
  try {
    const status = {
      service: 'GitHub Mastery API',
      version: '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
    };

    res.json(status);
  } catch (error) {
    logger.error('Erro ao buscar status:', error);
    res.status(500).json({ error: 'Erro ao buscar status' });
  }
});

// Endpoint para estatísticas gerais do GitHub
app.get('/api/github/stats', async (req, res) => {
  try {
    // Dados reais poderiam vir da API do GitHub
    // Estamos usando valores aproximados mas realistas aqui
    const stats = {
      users: '100M+',
      repositories: '420M+',
      api_requests_per_min: '15K+',
      timestamp: new Date().toISOString(),
    };

    // Adicionar delay artificial para demonstrar loading
    setTimeout(() => {
      res.json(stats);
    }, 800);
  } catch (error) {
    logger.error('Erro ao buscar estatísticas do GitHub:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas do GitHub' });
  }
});

// Endpoint para dados de desempenho da API
app.get('/api/performance', async (req, res) => {
  try {
    // Buscar rate limit real
    const rateLimit = await githubClient.checkRateLimit();

    // Calcular uso de API com dados reais
    const performance = {
      api_uptime: '99.95%',
      api_latency: '~150ms',
      rate_limit: {
        limit: rateLimit.resources.core.limit,
        remaining: rateLimit.resources.core.remaining,
        reset: new Date(rateLimit.resources.core.reset * 1000).toISOString(),
        used: rateLimit.resources.core.used,
      },
      historical_data: [
        { year: '2019', value: 180 },
        { year: '2020', value: 165 },
        { year: '2021', value: 150 },
        { year: '2022', value: 145 },
        { year: '2023', value: 140 },
        { year: '2024', value: 135 },
      ],
    };

    res.json(performance);
  } catch (error) {
    logger.error('Erro ao buscar dados de desempenho:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de desempenho' });
  }
});

// Endpoint para dados de crescimento do ecossistema
app.get('/api/ecosystem/growth', async (req, res) => {
  try {
    const growth = {
      yearly_growth: '28%',
      new_orgs_per_year: '4.3M',
      historical_data: [
        { year: '2019', value: 40 },
        { year: '2020', value: 56 },
        { year: '2021', value: 73 },
        { year: '2022', value: 83 },
        { year: '2023', value: 90 },
        { year: '2024', value: 100 },
      ],
    };

    res.json(growth);
  } catch (error) {
    logger.error('Erro ao buscar dados de crescimento:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de crescimento' });
  }
});

// Endpoint para dados de automação DevOps
app.get('/api/devops/automation', async (req, res) => {
  try {
    const automation = {
      automation_rate: '73%',
      avg_deploy_time: '44min',
      chart_data: {
        labels: ['Automated', 'Manual'],
        values: [73, 27],
      },
    };

    res.json(automation);
  } catch (error) {
    logger.error('Erro ao buscar dados de automação:', error);
    res.status(500).json({ error: 'Erro ao buscar dados de automação' });
  }
});

// Endpoint para repositórios do usuário autenticado
app.get('/api/repositories', async (req, res) => {
  try {
    // Buscar repositórios reais do usuário
    const repos = await githubClient.listRepositories({ per_page: 10 });

    // Formatar para a UI
    const formattedRepos = repos.map(repo => ({
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      url: repo.html_url,
    }));

    res.json({
      count: formattedRepos.length,
      repositories: formattedRepos,
    });
  } catch (error) {
    logger.error('Erro ao buscar repositórios:', error);
    res.status(500).json({ error: 'Erro ao buscar repositórios' });
  }
});

// Iniciar servidor
function startServer() {
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      logger.info(`REST API adapter rodando na porta ${PORT}`);
      resolve(server);
    });

    server.on('error', error => {
      logger.error(`Erro ao iniciar servidor REST: ${error.message}`);
      reject(error);
    });
  });
}

// Executar o servidor se este arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await startServer();
  } catch (error) {
    process.exit(1);
  }
}

export { startServer };
