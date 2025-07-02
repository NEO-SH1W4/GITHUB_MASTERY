# GitHub Agent PowerShell Integration - MCP Enhanced
# Implementação completa das estratégias MCP para máxima robustez e integração
# Version: 2.0.0 - MCP Strategy Implementation

# Configuração global do agente
$Global:GitHubAgentConfig = @{
    Version = "2.0.0"
    ProjectPath = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
    CachePath = "$env:TEMP\GitHubAgent"
    LogPath = "$env:TEMP\GitHubAgent\logs"
    ConfigFile = "$env:TEMP\GitHubAgent\config.json"
    MetricsFile = "$env:TEMP\GitHubAgent\metrics.json"
    LastCheck = $null
    MCPEnabled = $true
}

# Criar diretórios necessários
if (-not (Test-Path $Global:GitHubAgentConfig.CachePath)) {
    New-Item -Path $Global:GitHubAgentConfig.CachePath -ItemType Directory -Force | Out-Null
}
if (-not (Test-Path $Global:GitHubAgentConfig.LogPath)) {
    New-Item -Path $Global:GitHubAgentConfig.LogPath -ItemType Directory -Force | Out-Null
}

# Sistema de Logging Estruturado MCP
function Write-MCPLog {
    param(
        [string]$Message,
        [ValidateSet('INFO', 'WARN', 'ERROR', 'DEBUG', 'METRIC')]$Level = 'INFO',
        [hashtable]$Data = @{}
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = @{
        timestamp = $timestamp
        level = $Level
        message = $Message
        data = $Data
        session_id = $PID
    }
    
    $logFile = Join-Path $Global:GitHubAgentConfig.LogPath "agent-$(Get-Date -Format 'yyyy-MM-dd').log"
    $logEntry | ConvertTo-Json -Compress | Add-Content -Path $logFile
    
    # Console output with colors
    $color = switch ($Level) {
        'INFO' { 'White' }
        'WARN' { 'Yellow' }
        'ERROR' { 'Red' }
        'DEBUG' { 'Gray' }
        'METRIC' { 'Cyan' }
    }
    
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

# Cache Management System
function Get-MCPCache {
    param([string]$Key)
    
    $cacheFile = Join-Path $Global:GitHubAgentConfig.CachePath "cache.json"
    if (Test-Path $cacheFile) {
        try {
            $cache = Get-Content $cacheFile | ConvertFrom-Json
            if ($cache.$Key -and $cache.$Key.expiry -gt (Get-Date)) {
                return $cache.$Key.value
            }
        } catch {
            Write-MCPLog "Cache read error: $($_.Exception.Message)" -Level ERROR
        }
    }
    return $null
}

function Set-MCPCache {
    param(
        [string]$Key,
        $Value,
        [int]$TTLMinutes = 30
    )
    
    $cacheFile = Join-Path $Global:GitHubAgentConfig.CachePath "cache.json"
    $cache = @{}
    
    if (Test-Path $cacheFile) {
        try {
            $cache = Get-Content $cacheFile | ConvertFrom-Json -AsHashtable
        } catch {
            Write-MCPLog "Cache write error: $($_.Exception.Message)" -Level ERROR
        }
    }
    
    $cache[$Key] = @{
        value = $Value
        expiry = (Get-Date).AddMinutes($TTLMinutes)
        created = Get-Date
    }
    
    $cache | ConvertTo-Json -Depth 10 | Set-Content $cacheFile
}

# Função para verificar se o Node.js está instalado
function Test-NodeJs {
    $cached = Get-MCPCache "nodejs_version"
    if ($cached) {
        Write-MCPLog "Node.js $cached encontrado (cached)." -Level INFO
        return $true
    }
    
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Set-MCPCache "nodejs_version" $nodeVersion -TTLMinutes 60
            Write-MCPLog "Node.js $nodeVersion encontrado." -Level INFO
            return $true
        }
    }
    catch {
        Write-MCPLog "Node.js não encontrado. Por favor, instale o Node.js para usar o GitHub Agent." -Level ERROR
        return $false
    }
    return $false
}

# Função para carregar as funções do GitHub Agent
function Load-GitHubAgent {
    if (-not (Test-NodeJs)) {
        return
    }

    # Define os aliases para as funções do agente
    function global:gco {
        param([string]$message)
        if (-not $message) {
            Write-MCPLog "É necessário fornecer uma mensagem para o commit." -Level WARN
            Write-Host "Uso: gco 'mensagem de commit'" -ForegroundColor Yellow
            return
        }
        Write-MCPLog "Executando contribuição rápida: $message" -Level INFO
        node "$Global:GitHubAgentConfig.ProjectPath\agents\github-agent.js" quick-contribution $message
    }

    function global:gcd {
        Write-MCPLog "Executando contribuição diária" -Level INFO
        node "$Global:GitHubAgentConfig.ProjectPath\agents\github-agent.js" daily
    }

    function global:gcw {
        Write-MCPLog "Executando automação semanal" -Level INFO
        node "$Global:GitHubAgentConfig.ProjectPath\agents\github-agent.js" weekly
    }

    function global:gcstats {
        param([int]$days = 30)
        Write-MCPLog "Visualizando estatísticas para $days dias" -Level INFO
        node "$Global:GitHubAgentConfig.ProjectPath\agents\github-agent.js" stats -d $days
    }

    # Help system
    function global:gchelp {
        Write-Host "** GitHub Agent - MCP Enhanced Help **" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Comandos disponíveis:"
        Write-Host "  gco 'message'  - Realiza uma contribuição rápida com a mensagem especificada"
        Write-Host "  gcd            - Executa a contribuição diária automatizada"
        Write-Host "  gcw            - Executa a automação semanal com análise de tendências"
        Write-Host "  gcstats [days] - Exibe estatísticas de contribuições (padrão: 30 dias)"
        Write-Host "  gchelp         - Exibe esta mensagem de ajuda"
        Write-Host ""
        Write-Host "Configuração:"
        Write-Host "  `$Global:GitHubAgentConfig - Contém as configurações do agente"
        Write-Host "  Logs em: $($Global:GitHubAgentConfig.LogPath)"
        Write-Host "  Cache em: $($Global:GitHubAgentConfig.CachePath)"
        Write-Host ""
    }

    # Exibe mensagem de sucesso
    Write-MCPLog "GitHub Contribution functions loaded" -Level INFO
    Write-Host "GitHub Contribution functions loaded!" -ForegroundColor Green
    Write-Host "Available commands:"
    Write-Host "  gco 'message'  - Quick contribution" -ForegroundColor Cyan
    Write-Host "  gcd            - Daily contribution" -ForegroundColor Cyan
    Write-Host "  gcw            - Weekly automation" -ForegroundColor Cyan
    Write-Host "  gcstats        - View statistics" -ForegroundColor Cyan
    Write-Host "  gchelp         - Show help" -ForegroundColor Cyan
}

# Carregar o agente
Load-GitHubAgent

# Finalizando...
Write-MCPLog "Agente PowerShell iniciado com sucesso" -Level METRIC

$Global:GitHubAgentConfig.LastCheck = Get-Date

