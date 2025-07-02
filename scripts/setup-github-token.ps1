# Script para configurar o token GitHub de forma segura
# Este script ajuda a configurar o token GitHub sem expô-lo no terminal

param(
    [string]$Token,
    [string]$Username,
    [switch]$Interactive
)

$projectPath = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envPath = Join-Path $projectPath ".env"
$envExamplePath = Join-Path $projectPath ".env.example"

Write-Host "🔐 GitHub Token Setup - GitHub Mastery Project" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Função para validar formato do token
function Test-GitHubToken {
    param([string]$TokenToTest)
    
    if (-not $TokenToTest) {
        return $false
    }
    
    # Verificar se o token tem o formato correto (ghp_, gho_, ghu_, ghs_, ghr_)
    if ($TokenToTest -match '^gh[pousr]_[A-Za-z0-9_]{36,255}$') {
        return $true
    }
    
    return $false
}

# Função para testar conexão com GitHub
function Test-GitHubConnection {
    param([string]$TokenToTest)
    
    try {
        Write-Host "🔍 Testando conexão com GitHub..." -ForegroundColor Yellow
        
        $headers = @{
            "Authorization" = "token $TokenToTest"
            "User-Agent" = "GitHub-Mastery-Setup/1.0"
        }
        
        $response = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers -ErrorAction Stop
        
        Write-Host "✅ Conexão bem-sucedida!" -ForegroundColor Green
        Write-Host "👤 Usuário: $($response.login)" -ForegroundColor Cyan
        Write-Host "📧 Email: $($response.email)" -ForegroundColor Cyan
        
        return @{
            Success = $true
            Username = $response.login
            Email = $response.email
        }
    }
    catch {
        Write-Host "❌ Erro ao conectar com GitHub: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false }
    }
}

# Modo interativo
if ($Interactive -or (-not $Token)) {
    Write-Host ""
    Write-Host "📋 Como obter um token GitHub:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://github.com/settings/tokens" -ForegroundColor Gray
    Write-Host "2. Clique em 'Generate new token (classic)'" -ForegroundColor Gray
    Write-Host "3. Selecione os escopos: repo, user, admin:org" -ForegroundColor Gray
    Write-Host "4. Copie o token gerado" -ForegroundColor Gray
    Write-Host ""
    
    # Solicitar token de forma segura
    $Token = Read-Host "Digite seu token GitHub" -AsSecureString
    $Token = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Token))
}

# Validar token
if (-not (Test-GitHubToken $Token)) {
    Write-Host "❌ Formato de token inválido!" -ForegroundColor Red
    Write-Host "O token deve começar com ghp_, gho_, ghu_, ghs_, ou ghr_" -ForegroundColor Yellow
    exit 1
}

# Testar conexão
$connectionTest = Test-GitHubConnection $Token
if (-not $connectionTest.Success) {
    Write-Host "❌ Não foi possível conectar com GitHub usando este token" -ForegroundColor Red
    exit 1
}

# Se username não foi fornecido, usar o do GitHub
if (-not $Username) {
    $Username = $connectionTest.Username
}

# Criar arquivo .env
Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow

$envContent = @"
# GitHub Configuration
GITHUB_TOKEN=$Token
GITHUB_USERNAME=$Username

# Webhook Configuration  
WEBHOOK_SECRET=github_mastery_webhook_secret_$(Get-Random -Minimum 1000 -Maximum 9999)
WEBHOOK_PORT=3000

# API Configuration
API_BASE_URL=https://api.github.com
RATE_LIMIT_THRESHOLD=100

# Agent Configuration
AGENT_NAME=GitHub-Mastery-Agent
AGENT_VERSION=1.0.0
"@

try {
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
    
    # Testar se o GitHub Agent funciona agora
    Write-Host ""
    Write-Host "🧪 Testando GitHub Agent..." -ForegroundColor Yellow
    
    $testResult = & node "$projectPath\agents\github-agent.js" init 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub Agent configurado e funcionando!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ GitHub Agent configurado, mas houve um problema:" -ForegroundColor Yellow
        Write-Host $testResult -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Erro ao criar arquivo .env: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuração concluída!" -ForegroundColor Green
Write-Host "Agora você pode usar:" -ForegroundColor Cyan
Write-Host "  npm run agent init    - Inicializar agente" -ForegroundColor Gray
Write-Host "  npm run gcd          - Contribuição diária" -ForegroundColor Gray
Write-Host "  npm run gcstats      - Ver estatísticas" -ForegroundColor Gray

# Segurança: limpar variável do token da memória
$Token = $null
[System.GC]::Collect()

