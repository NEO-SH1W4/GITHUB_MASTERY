# Script para carregar o GitHub Agent no perfil PowerShell
# Adiciona as funções do agente diretamente no ambiente interativo

# Caminho base do projeto
$projectPath = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Função para verificar se o Node.js está instalado
function Verify-NodeJs {
    try {
        $nodeVersion = node --version
        Write-Host "Node.js $nodeVersion encontrado." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Node.js não encontrado. Por favor, instale o Node.js para usar o GitHub Agent." -ForegroundColor Red
        return $false
    }
}

# Função para carregar as funções do GitHub Agent
function Load-GitHubAgent {
    if (-not (Verify-NodeJs)) {
        return
    }

    # Define os aliases para as funções do agente
    function global:gco {
        param([string]$message)
        if (-not $message) {
            Write-Host "É necessário fornecer uma mensagem para o commit." -ForegroundColor Yellow
            Write-Host "Uso: gco 'mensagem de commit'" -ForegroundColor Yellow
            return
        }
        node "$projectPath\agents\github-agent.js" quick-contribution $message
    }

    function global:gcd {
        node "$projectPath\agents\github-agent.js" daily
    }

    function global:gcw {
        node "$projectPath\agents\github-agent.js" weekly
    }

    function global:gcstats {
        param([int]$days = 30)
        node "$projectPath\agents\github-agent.js" stats -d $days
    }

    # Exibe mensagem de sucesso
    Write-Host "GitHub Contribution functions loaded!" -ForegroundColor Green
    Write-Host "Available commands:"
    Write-Host "  gco 'message'  - Quick contribution" -ForegroundColor Cyan
    Write-Host "  gcd            - Daily contribution" -ForegroundColor Cyan
    Write-Host "  gcw            - Weekly automation" -ForegroundColor Cyan
    Write-Host "  gcstats        - View statistics" -ForegroundColor Cyan
}

# Carregar o agente
Load-GitHubAgent

