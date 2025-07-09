# restart-system.ps1
# Script para reiniciar o sistema com configurações otimizadas

param(
    [switch]$UseOptimized = $true,
    [switch]$CleanCache = $true,
    [switch]$Debug
)

# Função para escrever mensagens coloridas
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    Write-Host $Message -ForegroundColor $Color
}

# Função para matar processos Node
function Stop-NodeProcesses {
    Write-ColorOutput "🛑 Parando processos Node.js..." "Yellow"
    Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-ColorOutput "  Terminando processo $($_.Id)..." "DarkYellow"
        Stop-Process -Id $_.Id -Force
    }
    Write-ColorOutput "✅ Processos Node.js parados" "Green"
}

# Função para limpar cache e arquivos temporários
function Clear-CacheFiles {
    if ($CleanCache) {
        Write-ColorOutput "🧹 Limpando cache e arquivos temporários..." "Yellow"
        
        # Limpar cache do npm
        Write-ColorOutput "  Limpando cache do npm..." "DarkYellow"
        npm cache clean --force | Out-Null
        
        # Limpar logs antigos
        if (Test-Path "$PSScriptRoot\..\logs") {
            Write-ColorOutput "  Limpando logs antigos..." "DarkYellow"
            Get-ChildItem -Path "$PSScriptRoot\..\logs" -Filter "*.log" | ForEach-Object {
                if ($_.Name -ne "exceptions.log") {
                    Clear-Content $_.FullName
                }
            }
        }
        
        Write-ColorOutput "✅ Cache e arquivos temporários limpos" "Green"
    }
}

# Função para copiar configuração otimizada
function Use-OptimizedConfig {
    if ($UseOptimized) {
        Write-ColorOutput "🔄 Aplicando configuração otimizada..." "Yellow"
        
        $sourceConfig = "$PSScriptRoot\..\mcp-config-optimized.json"
        $targetConfig = "$PSScriptRoot\..\mcp-config.json"
        
        if (Test-Path $sourceConfig) {
            Copy-Item -Path $sourceConfig -Destination $targetConfig -Force
            Write-ColorOutput "✅ Configuração otimizada aplicada" "Green"
        } else {
            Write-ColorOutput "❌ Configuração otimizada não encontrada: $sourceConfig" "Red"
            return $false
        }
        
        return $true
    }
    
    return $true
}

# Função para verificar dependências
function Test-Dependencies {
    Write-ColorOutput "🔍 Verificando dependências..." "Yellow"
    
    $missingDeps = $false
    
    # Verificar node.js
    try {
        $nodeVersion = node -v
        Write-ColorOutput "  ✅ Node.js: $nodeVersion" "Green"
    } catch {
        Write-ColorOutput "  ❌ Node.js não encontrado" "Red"
        $missingDeps = $true
    }
    
    # Verificar npm
    try {
        $npmVersion = npm -v
        Write-ColorOutput "  ✅ npm: $npmVersion" "Green"
    } catch {
        Write-ColorOutput "  ❌ npm não encontrado" "Red"
        $missingDeps = $true
    }
    
    # Verificar variáveis de ambiente
    if ([string]::IsNullOrEmpty($env:GITHUB_TOKEN)) {
        Write-ColorOutput "  ⚠️ Variável GITHUB_TOKEN não definida" "Yellow"
        
        # Tentar carregar do .env
        if (Test-Path "$PSScriptRoot\..\.env") {
            $envContent = Get-Content "$PSScriptRoot\..\.env" | Where-Object { $_ -match "GITHUB_TOKEN=" }
            if ($envContent) {
                $env:GITHUB_TOKEN = $envContent -replace "GITHUB_TOKEN=", ""
                Write-ColorOutput "  ✅ GITHUB_TOKEN carregado do arquivo .env" "Green"
            }
        }
    } else {
        Write-ColorOutput "  ✅ GITHUB_TOKEN definido" "Green"
    }
    
    return !$missingDeps
}

# Função para iniciar servidor MCP
function Start-McpServer {
    param(
        [string]$ConfigPath = "$PSScriptRoot\..\mcp-config.json"
    )
    
    Write-ColorOutput "🚀 Iniciando servidor MCP..." "Yellow"
    
    # Carregar configuração
    if (Test-Path $ConfigPath) {
        $config = Get-Content $ConfigPath | ConvertFrom-Json
        
        # Verificar se há pelo menos um servidor definido
        if ($config.mcpServers -and $config.mcpServers.PSObject.Properties.Count -gt 0) {
            $serverName = $config.mcpServers.PSObject.Properties.Name | Select-Object -First 1
            $serverConfig = $config.mcpServers.$serverName
            
            # Preparar variáveis de ambiente
            foreach ($envVar in $serverConfig.env.PSObject.Properties) {
                if ($envVar.Name -eq "GITHUB_TOKEN" -and [string]::IsNullOrEmpty($envVar.Value)) {
                    # Usar o token já carregado
                    Set-Item -Path "env:$($envVar.Name)" -Value $env:GITHUB_TOKEN
                } else {
                    Set-Item -Path "env:$($envVar.Name)" -Value $envVar.Value
                }
            }
            
            # Iniciar servidor
            $serverScript = $serverConfig.args[0]
            $fullPath = "$PSScriptRoot\..\$serverScript"
            
            if (Test-Path $fullPath) {
                Write-ColorOutput "  Iniciando servidor $serverName ($serverScript)..." "Cyan"
                
                # Iniciar em novo processo
                if ($Debug) {
                    Start-Process powershell.exe -ArgumentList "-Command", "cd '$PSScriptRoot\..'; node '$serverScript'"
                } else {
                    Start-Process powershell.exe -ArgumentList "-Command", "cd '$PSScriptRoot\..'; node '$serverScript'" -WindowStyle Hidden
                }
                
                Write-ColorOutput "✅ Servidor MCP iniciado" "Green"
                return $true
            } else {
                Write-ColorOutput "❌ Script do servidor não encontrado: $fullPath" "Red"
                return $false
            }
        } else {
            Write-ColorOutput "❌ Nenhum servidor MCP definido na configuração" "Red"
            return $false
        }
    } else {
        Write-ColorOutput "❌ Arquivo de configuração não encontrado: $ConfigPath" "Red"
        return $false
    }
}

# Função principal
function Main {
    Write-ColorOutput "🔄 Iniciando processo de reinicialização do sistema..." "Cyan"
    
    # Parar processos node existentes
    Stop-NodeProcesses
    
    # Limpar cache e arquivos temporários
    Clear-CacheFiles
    
    # Aplicar configuração otimizada
    $configOk = Use-OptimizedConfig
    if (-not $configOk) {
        Write-ColorOutput "⚠️ Continuando com configuração atual" "Yellow"
    }
    
    # Verificar dependências
    $depsOk = Test-Dependencies
    if (-not $depsOk) {
        Write-ColorOutput "❌ Dependências ausentes, abortando" "Red"
        return
    }
    
    # Iniciar servidor MCP
    $serverStarted = Start-McpServer
    if ($serverStarted) {
        Write-ColorOutput "✨ Sistema reiniciado com sucesso!" "Green"
        Write-ColorOutput "💡 Use o comando node test-system.js para verificar o estado do sistema" "Cyan"
    } else {
        Write-ColorOutput "❌ Falha ao iniciar o servidor MCP" "Red"
    }
}

# Executar função principal
Main
