#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { GitHubClient } from '../api/github-client.js';

const program = new Command();

program
    .name('gh-mastery')
    .description('GitHub Mastery CLI - Ferramenta para operações GitHub')
    .version('1.0.0');

/**
 * Comando: Autenticar
 */
program
    .command('auth')
    .description('Verificar autenticação GitHub')
    .action(async () => {
        try {
            const client = new GitHubClient();
            await client.authenticate();
            await client.checkRateLimit();
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

/**
 * Comando: Listar repositórios
 */
program
    .command('repos')
    .description('Listar repositórios do usuário')
    .option('-l, --limit <number>', 'Número máximo de repositórios', '10')
    .option('-s, --sort <field>', 'Campo para ordenação', 'updated')
    .action(async (options) => {
        try {
            const client = new GitHubClient();
            await client.listRepositories({
                per_page: parseInt(options.limit),
                sort: options.sort
            });
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

/**
 * Comando: Obter repositório
 */
program
    .command('repo <owner> <name>')
    .description('Obter detalhes de um repositório específico')
    .action(async (owner, name) => {
        try {
            const client = new GitHubClient();
            await client.getRepository(owner, name);
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

/**
 * Comando: Listar issues
 */
program
    .command('issues <owner> <repo>')
    .description('Listar issues de um repositório')
    .option('-s, --state <state>', 'Estado das issues (open/closed/all)', 'open')
    .option('-l, --limit <number>', 'Número máximo de issues', '10')
    .action(async (owner, repo, options) => {
        try {
            const client = new GitHubClient();
            await client.listIssues(owner, repo, {
                state: options.state,
                per_page: parseInt(options.limit)
            });
        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

/**
 * Comando: Criar repositório
 */
program
    .command('create-repo')
    .description('Criar um novo repositório (interativo)')
    .action(async () => {
        try {
            console.log(chalk.blue('🆕 Criação de Repositório - Modo Interativo\n'));

            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Nome do repositório:',
                    validate: (input) => input.length > 0 || 'Nome é obrigatório'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Descrição (opcional):'
                },
                {
                    type: 'confirm',
                    name: 'private',
                    message: 'Repositório privado?',
                    default: false
                },
                {
                    type: 'confirm',
                    name: 'has_issues',
                    message: 'Habilitar Issues?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'has_projects',
                    message: 'Habilitar Projects?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'has_wiki',
                    message: 'Habilitar Wiki?',
                    default: true
                },
                {
                    type: 'confirm',
                    name: 'auto_init',
                    message: 'Inicializar com README?',
                    default: true
                },
                {
                    type: 'list',
                    name: 'license_template',
                    message: 'Licença:',
                    choices: [
                        { name: 'Nenhuma', value: null },
                        { name: 'MIT', value: 'mit' },
                        { name: 'Apache 2.0', value: 'apache-2.0' },
                        { name: 'GPL v3', value: 'gpl-3.0' },
                        { name: 'BSD 3-Clause', value: 'bsd-3-clause' }
                    ]
                }
            ]);

            // Remover campos nulos/vazios
            const repoData = Object.fromEntries(
                Object.entries(answers).filter(([_, v]) => v !== null && v !== '')
            );

            const client = new GitHubClient();
            await client.createRepository(repoData);

        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

/**
 * Comando: Status geral
 */
program
    .command('status')
    .description('Mostrar status geral da conta GitHub')
    .action(async () => {
        try {
            console.log(chalk.magenta('📊 Status Geral da Conta GitHub\n'));

            const client = new GitHubClient();
            
            // Autenticação
            console.log(chalk.yellow('=== Autenticação ==='));
            const user = await client.authenticate();
            console.log('');

            // Rate Limit
            console.log(chalk.yellow('=== Rate Limit ==='));
            await client.checkRateLimit();
            console.log('');

            // Resumo dos repositórios
            console.log(chalk.yellow('=== Resumo dos Repositórios ==='));
            const repos = await client.listRepositories({ per_page: 100 });
            
            const stats = {
                total: repos.length,
                private: repos.filter(r => r.private).length,
                public: repos.filter(r => !r.private).length,
                totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
                totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
                languages: [...new Set(repos.map(r => r.language).filter(Boolean))]
            };

            console.log(chalk.cyan(`📦 Total de repositórios: ${stats.total}`));
            console.log(chalk.cyan(`🔒 Privados: ${stats.private}`));
            console.log(chalk.cyan(`🌍 Públicos: ${stats.public}`));
            console.log(chalk.cyan(`🌟 Total de stars: ${stats.totalStars}`));
            console.log(chalk.cyan(`🍴 Total de forks: ${stats.totalForks}`));
            console.log(chalk.cyan(`💻 Linguagens: ${stats.languages.join(', ')}`));

        } catch (error) {
            console.error(chalk.red('❌ Erro:'), error.message);
            process.exit(1);
        }
    });

// Executar CLI
program.parse();

