# GitHub Mastery - Setup Automatico do Ambiente
# Este script resolve todos os problemas de configuracao automaticamente

param(
    [string]$GitHubToken = $null,
    [string]$GitHubUsername = $null,
    [switch]$SkipTokenCheck,
    [switch]$Force
)

Write-Host "🚀 GitHub Mastery - Setup Automático" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# 1. Verificar se estamos no diretório correto
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectRoot\package.json")) {
    Write-Host "❌ Erro: Execute este script a partir do diretório do projeto" -ForegroundColor Red
    exit 1
}

# 2. Configurar encoding UTF-8
Write-Host "🔧 Configurando encoding UTF-8..." -ForegroundColor Yellow
chcp 65001 | Out-Null

# 3. Verificar e configurar .env
Write-Host "📝 Verificando configuração .env..." -ForegroundColor Yellow
$envFile = "$projectRoot\.env"
$envExampleFile = "$projectRoot\.env.example"

if (-not (Test-Path $envFile) -or $Force) {
    Write-Host "📄 Criando arquivo .env..." -ForegroundColor Blue
    Copy-Item $envExampleFile $envFile -Force
    
    # Configurar valores se fornecidos
    if ($GitHubToken) {
        (Get-Content $envFile) -replace 'ghp_configure_your_token_here', $GitHubToken | Set-Content $envFile
        Write-Host "✅ Token GitHub configurado" -ForegroundColor Green
    }
    
    if ($GitHubUsername) {
        (Get-Content $envFile) -replace 'configure_your_username', $GitHubUsername | Set-Content $envFile
        Write-Host "✅ Username GitHub configurado" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

# 4. Verificar Node.js e dependências
Write-Host "📦 Verificando Node.js e dependências..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado! Instale Node.js primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se node_modules existe
if (-not (Test-Path "$projectRoot\node_modules")) {
    Write-Host "📥 Instalando dependências..." -ForegroundColor Blue
    Push-Location $projectRoot
    npm install
    Pop-Location
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

# 5. Executar testes de validação
Write-Host "🧪 Executando validação..." -ForegroundColor Yellow
Push-Location $projectRoot

# Lint check
Write-Host "  - Verificando lint..." -ForegroundColor Gray
npm run lint --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Lint passou" -ForegroundColor Green
} else {
    Write-Host "    ⚠️ Problemas de lint encontrados" -ForegroundColor Yellow
    npm run lint:fix --silent
    Write-Host "    🔧 Tentativa de correção automática" -ForegroundColor Blue
}

# Format check
Write-Host "  - Verificando formatação..." -ForegroundColor Gray
npm run format:check --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "    🔧 Corrigindo formatação..." -ForegroundColor Blue
    npm run format --silent
    Write-Host "    ✅ Formatação corrigida" -ForegroundColor Green
} else {
    Write-Host "    ✅ Formatação OK" -ForegroundColor Green
}

# Tests
Write-Host "  - Executando testes..." -ForegroundColor Gray
npm test --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "    ✅ Todos os testes passaram" -ForegroundColor Green
} else {
    Write-Host "    ⚠️ Alguns testes falharam" -ForegroundColor Yellow
}

Pop-Location

# 6. Validar ambiente final
Write-Host "🔍 Validação final do ambiente..." -ForegroundColor Yellow
Push-Location $projectRoot
npm run validate-env --silent
Pop-Location

# 7. Configurar agente PowerShell
Write-Host "🤖 Configurando agente PowerShell..." -ForegroundColor Yellow
$profileScript = "$projectRoot\scripts\load-agent-in-profile.ps1"
if (Test-Path $profileScript) {
    . $profileScript
    Write-Host "✅ Agente PowerShell carregado" -ForegroundColor Green
} else {
    Write-Host "⚠️ Script do agente não encontrado" -ForegroundColor Yellow
}

# 8. Resumo final
Write-Host ""
Write-Host "🎉 Setup concluído!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos disponíveis:" -ForegroundColor Cyan
Write-Host "  gco 'message'  - Contribuição rápida" -ForegroundColor White
Write-Host "  gcd            - Contribuição diária" -ForegroundColor White  
Write-Host "  gcw            - Automação semanal" -ForegroundColor White
Write-Host "  gcstats        - Ver estatísticas" -ForegroundColor White
Write-Host ""

if (-not $SkipTokenCheck) {
    $envContent = Get-Content "$projectRoot\.env" -Raw
    if ($envContent -match "ghp_configure_your_token_here") {
        Write-Host "⚠️ ATENÇÃO: Configure seu GitHub token em .env" -ForegroundColor Yellow
        Write-Host "   Para obter um token: https://github.com/settings/tokens" -ForegroundColor Cyan
    } else {
        Write-Host "✅ Ambiente configurado e pronto para uso!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Para testar o ambiente, execute: npm run health" -ForegroundColor Cyan

