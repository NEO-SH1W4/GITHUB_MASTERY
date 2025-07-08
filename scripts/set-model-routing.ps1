# set-model-routing.ps1
# Script para configurar roteamento automático de modelos de linguagem

param(
    [string]$Context = "auto",
    [string]$TaskType = "general",
    [int]$TokenLimit = 8192,
    [switch]$Debug
)

# Funcao para detectar tipo de tarefa baseado no contexto
function Get-TaskType {
    param([string]$Input)
    
    $taskPatterns = @{
        "code-review" = @("review", "analyze", "refactor", "bug", "security")
        "documentation" = @("document", "readme", "guide", "tutorial", "explain")
        "creative" = @("brainstorm", "ideate", "creative", "design", "concept")
        "technical" = @("implement", "build", "deploy", "configure", "setup")
        "quick" = @("status", "check", "list", "show", "get")
        "analysis" = @("analyze", "report", "metrics", "performance", "benchmark")
    }
    
    foreach ($type in $taskPatterns.Keys) {
        foreach ($pattern in $taskPatterns[$type]) {
            if ($Input -match $pattern) {
                return $type
            }
        }
    }
    
    return "general"
}

# Funcao para selecionar modelo baseado no tipo de tarefa
function Select-OptimalModel {
    param(
        [string]$TaskType,
        [int]$TokenCount
    )
    
    $modelMap = @{
        "code-review" = @{
            "small" = "claude-3.5-sonnet"
            "medium" = "gpt-4o"
            "large" = "claude-4-opus"
        }
        "documentation" = @{
            "small" = "claude-3.5-sonnet"
            "medium" = "gpt-4o"
            "large" = "gpt-4o"
        }
        "creative" = @{
            "small" = "claude-3.5-haiku"
            "medium" = "claude-3.5-haiku"
            "large" = "claude-4-opus"
        }
        "technical" = @{
            "small" = "o4-mini"
            "medium" = "gpt-4o"
            "large" = "o3"
        }
        "quick" = @{
            "small" = "gemini-2.0-flash"
            "medium" = "claude-3.5-sonnet"
            "large" = "claude-4-sonnet"
        }
        "analysis" = @{
            "small" = "gemini-2.5-pro"
            "medium" = "gpt-4o"
            "large" = "o3"
        }
        "general" = @{
            "small" = "claude-4-sonnet"
            "medium" = "claude-4-sonnet"
            "large" = "claude-4-opus"
        }
    }
    
    $sizeCategory = if ($TokenCount -lt 4000) { "small" }
                   elseif ($TokenCount -lt 16000) { "medium" }
                   else { "large" }
    
    if ($modelMap.ContainsKey($TaskType)) {
        return $modelMap[$TaskType][$sizeCategory]
    } else {
        return "claude-4-sonnet" # fallback
    }
}

# Funcao para criar configuracao do MCP
function Set-MCPModelConfiguration {
    param(
        [string]$Model,
        [string]$TaskType
    )
    
    $config = @{
        "model" = $Model
        "task_type" = $TaskType
        "timestamp" = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
        "routing_strategy" = "adaptive"
    }
    
    # Salvar configuracao em arquivo JSON
    $configPath = "$PWD\mcp-model-config.json"
    $config | ConvertTo-Json | Set-Content -Path $configPath
    
    if ($Debug) {
        Write-Host "Configuracao salva em: $configPath"
        Write-Host "Modelo selecionado: $Model"
        Write-Host "Tipo de tarefa: $TaskType"
    }
}

# Funcao principal
function Main {
    Write-Host "Configurando roteamento automatico de modelos..."
    
    # Detectar tipo de tarefa se nao especificado
    if ($TaskType -eq "general") {
        $TaskType = Get-TaskType $Context
    }
    
    # Selecionar modelo optimal
    $selectedModel = Select-OptimalModel -TaskType $TaskType -TokenCount $TokenLimit
    
    # Configurar MCP
    Set-MCPModelConfiguration -Model $selectedModel -TaskType $TaskType
    
    Write-Host "Modelo configurado: $selectedModel"
    Write-Host "Tipo de tarefa: $TaskType"
    Write-Host "Limite de tokens: $TokenLimit"
    
    # Verificar se MCP esta rodando
    $mcpProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -like "*mcp*" }
    
    if ($mcpProcess) {
        Write-Host "MCP detectado, aplicando configuracao..."
        # Aqui voce pode adicionar logica para recarregar configuracao do MCP
    } else {
        Write-Host "Warning: MCP nao esta rodando. Inicie com: npm run mcp:start"
    }
}

# Executar funcao principal
Main
