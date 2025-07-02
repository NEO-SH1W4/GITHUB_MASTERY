import { GitHubClient } from '../api/github-client.js';
import chalk from 'chalk';

/**
 * Exemplo básico de uso da GitHub API
 */
async function basicApiUsage() {
    try {
        console.log(chalk.magenta('🚀 GitHub Mastery - Exemplo Básico de API\n'));

        // Inicializar cliente
        const client = new GitHubClient();

        // 1. Autenticar e verificar usuário
        console.log(chalk.yellow('=== 1. Autenticação ==='));
        await client.authenticate();
        console.log('\n');

        // 2. Verificar rate limit
        console.log(chalk.yellow('=== 2. Rate Limit ==='));
        await client.checkRateLimit();
        console.log('\n');

        // 3. Listar repositórios (primeiros 5)
        console.log(chalk.yellow('=== 3. Repositórios (Top 5) ==='));
        const repos = await client.listRepositories({ per_page: 5 });
        console.log('\n');

        // 4. Obter detalhes do primeiro repositório (se houver)
        if (repos.length > 0) {
            console.log(chalk.yellow('=== 4. Detalhes do Primeiro Repositório ==='));
            const firstRepo = repos[0];
            await client.getRepository(firstRepo.owner.login, firstRepo.name);
            console.log('\n');

            // 5. Listar issues do primeiro repositório (se houver)
            console.log(chalk.yellow('=== 5. Issues do Primeiro Repositório ==='));
            await client.listIssues(firstRepo.owner.login, firstRepo.name, {
                per_page: 3,
            });
        }

        console.log(chalk.green('✅ Exemplo concluído com sucesso!'));
    } catch (error) {
        console.error(chalk.red('❌ Erro no exemplo:'), error.message);

        if (error.message.includes('GitHub token')) {
            console.log(chalk.yellow('💡 Dica: Configure o token GitHub:'));
            console.log(chalk.cyan('   1. Copie .env.example para .env'));
            console.log(chalk.cyan('   2. Adicione seu token GitHub no arquivo .env'));
            console.log(chalk.cyan('   3. Execute o exemplo novamente'));
        }
    }
}

// Executar se for o arquivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    basicApiUsage();
}
