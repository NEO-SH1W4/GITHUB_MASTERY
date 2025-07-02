/**
 * Utilitário de validação de ambiente
 * Verifica se todas as dependências e configurações necessárias estão presentes
 */

import chalk from 'chalk';
import { existsSync } from 'fs';

/**
 * Validar variáveis de ambiente obrigatórias
 */
export function validateEnvironmentVariables() {
    const requiredVars = ['GITHUB_TOKEN'];

    const optionalVars = ['WEBHOOK_SECRET', 'WEBHOOK_PORT', 'RATE_LIMIT_THRESHOLD'];

    console.log(chalk.blue('🔍 Validando variáveis de ambiente...\n'));

    let hasErrors = false;

    // Verificar variáveis obrigatórias
    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            console.log(chalk.red(`❌ ${varName} - OBRIGATÓRIA`));
            hasErrors = true;
        } else {
            console.log(chalk.green(`✅ ${varName} - OK`));
        }
    });

    // Verificar variáveis opcionais
    optionalVars.forEach(varName => {
        if (!process.env[varName]) {
            console.log(chalk.yellow(`⚠️  ${varName} - OPCIONAL (usando padrão)`));
        } else {
            console.log(chalk.green(`✅ ${varName} - OK`));
        }
    });

    if (hasErrors) {
        console.log(chalk.red('\n❌ Algumas variáveis obrigatórias estão ausentes!'));
        console.log(
            chalk.cyan('💡 Copie .env.example para .env e configure suas credenciais')
        );
        return false;
    }

    console.log(chalk.green('\n✅ Todas as variáveis de ambiente estão configuradas!'));
    return true;
}

/**
 * Validar estrutura de arquivos do projeto
 */
export function validateProjectStructure() {
    const requiredFiles = [
        'package.json',
        '.env.example',
        'api/github-client.js',
        'cli-tools/gh-cli.js',
        'webhooks/webhook-server.js',
        'examples/basic-api-usage.js',
    ];

    const requiredDirs = ['api', 'cli-tools', 'webhooks', 'examples', 'docs'];

    console.log(chalk.blue('📁 Validando estrutura do projeto...\n'));

    let hasErrors = false;

    // Verificar arquivos
    requiredFiles.forEach(filePath => {
        if (existsSync(filePath)) {
            console.log(chalk.green(`✅ ${filePath}`));
        } else {
            console.log(chalk.red(`❌ ${filePath} - AUSENTE`));
            hasErrors = true;
        }
    });

    // Verificar diretórios
    requiredDirs.forEach(dirPath => {
        if (existsSync(dirPath)) {
            console.log(chalk.green(`✅ ${dirPath}/`));
        } else {
            console.log(chalk.red(`❌ ${dirPath}/ - AUSENTE`));
            hasErrors = true;
        }
    });

    if (hasErrors) {
        console.log(chalk.red('\n❌ Estrutura do projeto incompleta!'));
        return false;
    }

    console.log(chalk.green('\n✅ Estrutura do projeto está completa!'));
    return true;
}

/**
 * Verificar dependências do Node.js
 */
export function validateNodeDependencies() {
    console.log(chalk.blue('📦 Verificando dependências do Node.js...\n'));

    try {
        const packagePath = './package.json';
        if (!existsSync(packagePath)) {
            console.log(chalk.red('❌ package.json não encontrado!'));
            return false;
        }

        // Verificar se node_modules existe
        if (!existsSync('./node_modules')) {
            console.log(chalk.yellow('⚠️  node_modules não encontrado'));
            console.log(chalk.cyan('💡 Execute: npm install'));
            return false;
        }

        console.log(chalk.green('✅ Dependências instaladas'));
        return true;
    } catch (error) {
        console.log(chalk.red('❌ Erro ao verificar dependências:'), error.message);
        return false;
    }
}

/**
 * Executar validação completa
 */
export async function runFullValidation() {
    console.log(chalk.magenta('🔍 GITHUB MASTERY - Validação de Ambiente\n'));
    console.log('='.repeat(50));

    const results = {
        environment: validateEnvironmentVariables(),
        structure: validateProjectStructure(),
        dependencies: validateNodeDependencies(),
    };

    console.log('\n' + '='.repeat(50));
    console.log(chalk.magenta('📊 RESUMO DA VALIDAÇÃO\n'));

    Object.entries(results).forEach(([check, passed]) => {
        const status = passed ? chalk.green('✅ PASSOU') : chalk.red('❌ FALHOU');
        console.log(`${check.toUpperCase().padEnd(15)} ${status}`);
    });

    const allPassed = Object.values(results).every(Boolean);

    if (allPassed) {
        console.log(chalk.green('\n🎉 Ambiente validado com sucesso!'));
        console.log(chalk.cyan('💡 Você pode executar: npm start'));
    } else {
        console.log(chalk.red('\n⚠️  Resolva os problemas acima antes de continuar'));
    }

    return allPassed;
}
