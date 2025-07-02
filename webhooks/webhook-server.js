import express from 'express';
import crypto from 'crypto';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// Middleware para raw body (necessário para verificação de assinatura)
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

/**
 * Verificar assinatura do webhook GitHub
 */
function verifyGitHubSignature(payload, signature) {
    if (!WEBHOOK_SECRET) {
        console.log(chalk.yellow('⚠️  WEBHOOK_SECRET não configurado - pulando verificação'));
        return true;
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Processar evento de push
 */
function handlePushEvent(payload) {
    const { repository, pusher, commits, ref } = payload;
    
    console.log(chalk.blue('📤 Push Event Recebido:'));
    console.log(chalk.cyan(`   Repositório: ${repository.full_name}`));
    console.log(chalk.cyan(`   Autor: ${pusher.name} (${pusher.email})`));
    console.log(chalk.cyan(`   Branch: ${ref.replace('refs/heads/', '')}`));
    console.log(chalk.cyan(`   Commits: ${commits.length}`));
    
    commits.forEach((commit, index) => {
        console.log(chalk.gray(`   ${index + 1}. ${commit.message} - ${commit.author.name}`));
    });
}

/**
 * Processar evento de issues
 */
function handleIssuesEvent(payload) {
    const { action, issue, repository } = payload;
    
    console.log(chalk.green('🐛 Issues Event Recebido:'));
    console.log(chalk.cyan(`   Repositório: ${repository.full_name}`));
    console.log(chalk.cyan(`   Ação: ${action}`));
    console.log(chalk.cyan(`   Issue: #${issue.number} - ${issue.title}`));
    console.log(chalk.cyan(`   Autor: ${issue.user.login}`));
}

/**
 * Processar evento de pull request
 */
function handlePullRequestEvent(payload) {
    const { action, pull_request, repository } = payload;
    
    console.log(chalk.magenta('🔀 Pull Request Event Recebido:'));
    console.log(chalk.cyan(`   Repositório: ${repository.full_name}`));
    console.log(chalk.cyan(`   Ação: ${action}`));
    console.log(chalk.cyan(`   PR: #${pull_request.number} - ${pull_request.title}`));
    console.log(chalk.cyan(`   Autor: ${pull_request.user.login}`));
    console.log(chalk.cyan(`   Branch: ${pull_request.head.ref} → ${pull_request.base.ref}`));
}

/**
 * Processar evento de release
 */
function handleReleaseEvent(payload) {
    const { action, release, repository } = payload;
    
    console.log(chalk.yellow('🚀 Release Event Recebido:'));
    console.log(chalk.cyan(`   Repositório: ${repository.full_name}`));
    console.log(chalk.cyan(`   Ação: ${action}`));
    console.log(chalk.cyan(`   Release: ${release.tag_name} - ${release.name}`));
    console.log(chalk.cyan(`   Autor: ${release.author.login}`));
}

/**
 * Processar evento de star
 */
function handleStarEvent(payload) {
    const { action, repository, sender } = payload;
    
    console.log(chalk.yellow('⭐ Star Event Recebido:'));
    console.log(chalk.cyan(`   Repositório: ${repository.full_name}`));
    console.log(chalk.cyan(`   Ação: ${action}`));
    console.log(chalk.cyan(`   Usuário: ${sender.login}`));
    console.log(chalk.cyan(`   Total de stars: ${repository.stargazers_count}`));
}

/**
 * Endpoint principal do webhook
 */
app.post('/webhook', (req, res) => {
    const signature = req.get('X-Hub-Signature-256');
    const event = req.get('X-GitHub-Event');
    const delivery = req.get('X-GitHub-Delivery');
    
    console.log(chalk.blue(`\n🎣 Webhook recebido: ${event} (${delivery})`));
    
    // Verificar assinatura
    if (signature && !verifyGitHubSignature(req.body, signature)) {
        console.log(chalk.red('❌ Assinatura inválida'));
        return res.status(401).send('Unauthorized');
    }
    
    const payload = JSON.parse(req.body);
    
    try {
        // Processar evento baseado no tipo
        switch (event) {
            case 'push':
                handlePushEvent(payload);
                break;
                
            case 'issues':
                handleIssuesEvent(payload);
                break;
                
            case 'pull_request':
                handlePullRequestEvent(payload);
                break;
                
            case 'release':
                handleReleaseEvent(payload);
                break;
                
            case 'star':
                handleStarEvent(payload);
                break;
                
            case 'ping':
                console.log(chalk.green('🏓 Ping recebido - webhook configurado com sucesso!'));
                break;
                
            default:
                console.log(chalk.gray(`📝 Evento ${event} recebido (não processado)`));
        }
        
        res.status(200).send('OK');
        
    } catch (error) {
        console.error(chalk.red('❌ Erro ao processar webhook:'), error.message);
        res.status(500).send('Internal Server Error');
    }
});

/**
 * Endpoint de status
 */
app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * Endpoint de saúde
 */
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
    console.log(chalk.green(`🎣 Webhook server rodando na porta ${PORT}`));
    console.log(chalk.cyan(`📝 Status: http://localhost:${PORT}/status`));
    console.log(chalk.cyan(`💚 Health: http://localhost:${PORT}/health`));
    console.log(chalk.cyan(`🎯 Webhook: http://localhost:${PORT}/webhook`));
    
    if (!WEBHOOK_SECRET) {
        console.log(chalk.yellow('\n⚠️  Configure WEBHOOK_SECRET no arquivo .env para maior segurança'));
    }
    
    console.log(chalk.blue('\n📖 Para configurar no GitHub:'));
    console.log(chalk.gray('   1. Vá em Settings > Webhooks no seu repositório'));
    console.log(chalk.gray(`   2. Adicione URL: http://localhost:${PORT}/webhook`));
    console.log(chalk.gray('   3. Selecione eventos desejados'));
    console.log(chalk.gray('   4. Configure o secret (se disponível)'));
});

