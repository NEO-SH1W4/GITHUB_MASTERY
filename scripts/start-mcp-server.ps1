#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Inicia o servidor MCP consolidado do GitHub Mastery
.DESCRIPTION
    Este script configura o ambiente e inicia o servidor MCP consolidado
    com integração VIREON e todas as capacidades do agente.
.PARAMETER Token
    Token do GitHub para autenticação (opcional, usa variável de ambiente se não fornecido)
.PARAMETER Debug
    Ativa modo debug com logs detalhados
.EXAMPLE
    .\start-mcp-server.ps1
.EXAMPLE
    .\start-mcp-server.ps1 -Token "ghp_xxxxx" -Debug
#>

param(
    [string]$Token = $env:GITHUB_TOKEN,
    [switch]$Debug
)

Write-Host "🚀 GitHub Mastery MCP Consolidated Server Launcher" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Verificar se estamos no diretório correto
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path "$projectRoot\mcp\consolidated-mcp-server.js")) {
    Write-Host "❌ Erro: Servidor MCP não encontrado. Certifique-se de estar no diretório do projeto." -ForegroundColor Red
    exit 1
}

# Configurar variáveis de ambiente
Write-Host "`n📋 Configurando ambiente..." -ForegroundColor Yellow

# GitHub Token
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "⚠️  Token GitHub não fornecido. Tentando usar variável de ambiente..." -ForegroundColor Yellow
    if ([string]::IsNullOrEmpty($env:GITHUB_TOKEN)) {
        Write-Host "❌ Erro: GITHUB_TOKEN não configurado. Use -Token ou configure a variável de ambiente." -ForegroundColor Red
        Write-Host "   Exemplo: `$env:GITHUB_TOKEN='seu-token-aqui'" -ForegroundColor Gray
        exit 1
    }
} else {
    $env:GITHUB_TOKEN = $Token
    Write-Host "✅ Token GitHub configurado" -ForegroundColor Green
}

# Configurações VIREON
$env:VIREON_INTEGRATION = "true"
$env:RUST_AGENT_CORE = "true"
$env:PYTHON_AGENT_BRAIN = "true"
$env:MCP_SERVER_NAME = "github-mastery-consolidated"
$env:MCP_SERVER_VERSION = "2.0.0"

# Modo Debug
if ($Debug) {
    $env:DEBUG = "mcp:*"
    $env:LOG_LEVEL = "debug"
    Write-Host "🐛 Modo debug ativado" -ForegroundColor Magenta
}

# Mostrar configuração
Write-Host "`n📊 Configuração do Servidor:" -ForegroundColor Cyan
Write-Host "   Nome: $env:MCP_SERVER_NAME" -ForegroundColor Gray
Write-Host "   Versão: $env:MCP_SERVER_VERSION" -ForegroundColor Gray
Write-Host "   VIREON: $env:VIREON_INTEGRATION" -ForegroundColor Gray
Write-Host "   Rust Core: $env:RUST_AGENT_CORE" -ForegroundColor Gray
Write-Host "   Python Brain: $env:PYTHON_AGENT_BRAIN" -ForegroundColor Gray

# Verificar dependências
Write-Host "`n🔍 Verificando dependências..." -ForegroundColor Yellow

# Node.js
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js não encontrado. Instale o Node.js 18+ para continuar." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

# Verificar se as dependências npm estão instaladas
if (-not (Test-Path "$projectRoot\node_modules")) {
    Write-Host "📦 Instalando dependências npm..." -ForegroundColor Yellow
    Push-Location $projectRoot
    npm install
    Pop-Location
}

# Verificar Agent Core (Rust) - opcional
$cargoVersion = cargo --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Rust/Cargo encontrado: $cargoVersion" -ForegroundColor Green
    
    # Verificar se o Agent Core está compilado
    if (Test-Path "$projectRoot\github-agent-core\target\release") {
        Write-Host "✅ Agent Core (Rust) compilado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Agent Core não compilado. Compile com: cd github-agent-core && cargo build --release" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Rust não encontrado. Agent Core funcionará em modo simulado." -ForegroundColor Yellow
}

# Verificar Python - opcional
$pythonVersion = python --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
    
    # Verificar se o ambiente virtual existe
    if (Test-Path "$projectRoot\github-agent-brain\venv") {
        Write-Host "✅ Agent Brain (Python) ambiente virtual configurado" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Ambiente Python não configurado. Configure com: cd github-agent-brain && python -m venv venv" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Python não encontrado. Agent Brain funcionará em modo simulado." -ForegroundColor Yellow
}

# Criar diretório de logs se não existir
$logsDir = "$projectRoot\logs\mcp"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
    Write-Host "📁 Diretório de logs criado: $logsDir" -ForegroundColor Gray
}

# Iniciar o servidor
Write-Host "`n🚀 Iniciando servidor MCP consolidado..." -ForegroundColor Green
Write-Host "   Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
Write-Host "=" * 50 -ForegroundColor Green

# Mudar para o diretório do projeto
Push-Location $projectRoot

try {
    # Executar o servidor
    if ($Debug) {
        # Em modo debug, mostrar todos os logs
        node "mcp\consolidated-mcp-server.js" 2>&1 | Tee-Object -FilePath "$logsDir\server-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
    } else {
        # Modo normal
        node "mcp\consolidated-mcp-server.js"
    }
} catch {
    Write-Host "`n❌ Erro ao executar o servidor: $_" -ForegroundColor Red
} finally {
    Pop-Location
    Write-Host "`n👋 Servidor MCP finalizado" -ForegroundColor Yellow
}
