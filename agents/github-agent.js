#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
// import { GitHubClient } from '../api/github-client.js';
import {
    initAgent,
    executeAutomatedContribution,
    executeWeeklyContribution,
    executeDailyContribution,
    showStatistics,
    setupGitHubProfile,
    syncAllRepositories,
    runRepoHealthCheck,
    generateRepoReport,
} from './commands.js';

/**
 * GitHub Agent - Automatizador inteligente para GitHub
 *
 * Este agente fornece funcionalidades avançadas para automatizar
 * contribuições, sincronizar repositórios e analisar perfis do GitHub.
 */

// Inicializar o programa CLI
const program = new Command();

program
    .name('github-agent')
    .description(chalk.cyan('GitHub Agent - Automatizador inteligente para GitHub'))
    .version('1.0.0');

// Inicializar o agente (validar token, ambiente, etc)
program
    .command('init')
    .description('Inicializar o GitHub Agent e verificar configurações')
    .action(async () => {
        try {
            await initAgent();
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando rápido para fazer uma contribuição automática
program
    .command('quick-contribution <message>')
    .alias('qc')
    .description('Fazer uma contribuição rápida com uma mensagem específica')
    .action(async message => {
        try {
            await executeAutomatedContribution(message);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para contribuição diária automática
program
    .command('daily')
    .description('Executar contribuição diária automática baseada em padrões')
    .action(async () => {
        try {
            await executeDailyContribution();
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para contribuição semanal automática
program
    .command('weekly')
    .description('Executar contribuição semanal com análise de tendências')
    .action(async () => {
        try {
            await executeWeeklyContribution();
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para visualizar estatísticas de contribuição
program
    .command('stats')
    .description('Mostrar estatísticas detalhadas de contribuições')
    .option('-d, --days <number>', 'Número de dias para analisar', '30')
    .option('-f, --format <format>', 'Formato de saída (console, json)', 'console')
    .action(async options => {
        try {
            await showStatistics(options.days, options.format);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para configuração otimizada de perfil GitHub
program
    .command('setup-profile')
    .description('Configurar perfil GitHub com otimizações para visibilidade')
    .option('-t, --template <name>', 'Template de perfil a usar', 'developer')
    .action(async options => {
        try {
            await setupGitHubProfile(options.template);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para sincronização de todos os repositórios
program
    .command('sync-all')
    .description('Sincronizar todos os repositórios locais com GitHub')
    .option('-p, --pull-only', 'Apenas pull, sem push', false)
    .action(async options => {
        try {
            await syncAllRepositories(options.pullOnly);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para análise de saúde de repositório
program
    .command('health-check <owner> <repo>')
    .description('Executar verificação de saúde em um repositório')
    .action(async (owner, repo) => {
        try {
            await runRepoHealthCheck(owner, repo);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comando para gerar relatório completo de repositório
program
    .command('repo-report <owner> <repo>')
    .description('Gerar relatório completo de repositório com métricas e insights')
    .option('-o, --output <path>', 'Caminho para salvar o relatório', './report.md')
    .action(async (owner, repo, options) => {
        try {
            await generateRepoReport(owner, repo, options.output);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Comandos de Monetização
program
    .command('subscription')
    .description('Gerenciar assinatura GHMAS')
    .option('-c, --check', 'Verificar status da assinatura')
    .option('-b, --buy <tier>', 'Comprar assinatura (developer, team, enterprise)')
    .option('-m, --months <number>', 'Número de meses', '1')
    .action(async (options) => {
        try {
            const { manageSubscription } = await import('./commands.js');
            await manageSubscription(options);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

program
    .command('stake')
    .description('Gerenciar staking de tokens GHMAS')
    .option('-a, --amount <number>', 'Quantidade de tokens para stake')
    .option('-r, --rewards', 'Ver recompensas pendentes')
    .option('-c, --claim', 'Reivindicar recompensas')
    .action(async (options) => {
        try {
            const { manageStaking } = await import('./commands.js');
            await manageStaking(options);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

program
    .command('wallet')
    .description('Gerenciar carteira GHMAS')
    .option('-b, --balance', 'Ver saldo de tokens')
    .option('-h, --history', 'Ver histórico de transações')
    .action(async (options) => {
        try {
            const { manageWallet } = await import('./commands.js');
            await manageWallet(options);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Executar CLI
program.parse();

// Se nenhum comando for fornecido, mostrar menu interativo
if (!process.argv.slice(2).length) {
    showInteractiveMenu();
}

/**
 * Exibe menu interativo para seleção de comando
 */
async function showInteractiveMenu() {
    console.log(chalk.cyan('\n🤖 GitHub Agent - Menu Interativo\n'));

    const { command } = await inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: 'Selecione uma ação:',
            choices: [
                { name: '🚀 Inicializar agente', value: 'init' },
                { name: '✨ Contribuição rápida', value: 'quick' },
                { name: '📅 Contribuição diária', value: 'daily' },
                { name: '📊 Visualizar estatísticas', value: 'stats' },
                { name: '👤 Configurar perfil', value: 'profile' },
                { name: '🔄 Sincronizar repositórios', value: 'sync' },
                { name: '🔍 Análise de saúde', value: 'health' },
                { name: '📝 Gerar relatório', value: 'report' },
                { name: '❌ Sair', value: 'exit' },
            ],
        },
    ]);

    switch (command) {
    case 'init':
        await initAgent();
        break;
    case 'quick': {
        const { message } = await inquirer.prompt([
            {
                type: 'input',
                name: 'message',
                message: 'Mensagem de commit:',
                default: `feat: automated update ${new Date().toISOString().split('T')[0]}`,
            },
        ]);
        await executeAutomatedContribution(message);
        break;
    }
    case 'daily':
        await executeDailyContribution();
        break;
    case 'stats':
        await showStatistics(30, 'console');
        break;
    case 'profile':
        await setupGitHubProfile('developer');
        break;
    case 'sync':
        await syncAllRepositories(false);
        break;
    case 'health': {
        const healthRepo = await inquirer.prompt([
            {
                type: 'input',
                name: 'owner',
                message: 'Proprietário do repositório:',
            },
            {
                type: 'input',
                name: 'repo',
                message: 'Nome do repositório:',
            },
        ]);
        await runRepoHealthCheck(healthRepo.owner, healthRepo.repo);
        break;
    }
    case 'report': {
        const reportRepo = await inquirer.prompt([
            {
                type: 'input',
                name: 'owner',
                message: 'Proprietário do repositório:',
            },
            {
                type: 'input',
                name: 'repo',
                message: 'Nome do repositório:',
            },
            {
                type: 'input',
                name: 'output',
                message: 'Caminho do arquivo de saída:',
                default: './report.md',
            },
        ]);
        await generateRepoReport(
            reportRepo.owner,
            reportRepo.repo,
            reportRepo.output
        );
        break;
    }
    case 'exit':
        console.log(chalk.green('👋 Até logo!'));
        process.exit(0);
    }
}
