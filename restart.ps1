# Script simplificado para reiniciar o sistema

# Parar processos Node.js
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  Terminating process $($_.Id)..." -ForegroundColor DarkYellow
    Stop-Process -Id $_.Id -Force
}
Write-Host "Node.js processes stopped" -ForegroundColor Green

# Limpar cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force | Out-Null

# Aplicar configuração otimizada
Write-Host "Applying optimized configuration..." -ForegroundColor Yellow
$sourceConfig = "mcp-config-optimized.json"
$targetConfig = "mcp-config.json"

if (Test-Path $sourceConfig) {
    Copy-Item -Path $sourceConfig -Destination $targetConfig -Force
    Write-Host "Optimized configuration applied" -ForegroundColor Green
} else {
    Write-Host "Optimized configuration not found: $sourceConfig" -ForegroundColor Red
}

# Carregar variáveis de ambiente
if ([string]::IsNullOrEmpty($env:GITHUB_TOKEN)) {
    Write-Host "Loading GitHub token from .env file..." -ForegroundColor Yellow
    if (Test-Path ".env") {
        $envContent = Get-Content ".env" | Where-Object { $_ -match "GITHUB_TOKEN=" }
        if ($envContent) {
            $env:GITHUB_TOKEN = $envContent -replace "GITHUB_TOKEN=", ""
            Write-Host "GitHub token loaded" -ForegroundColor Green
        }
    }
}

# Iniciar servidor MCP
Write-Host "Starting MCP server..." -ForegroundColor Yellow
$configPath = "mcp-config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath | ConvertFrom-Json
    if ($config.mcpServers) {
        $serverName = $config.mcpServers.PSObject.Properties.Name | Select-Object -First 1
        $serverConfig = $config.mcpServers.$serverName
        
        # Definir variáveis de ambiente
        foreach ($envVar in $serverConfig.env.PSObject.Properties) {
            if ($envVar.Name -eq "GITHUB_TOKEN" -and [string]::IsNullOrEmpty($envVar.Value)) {
                # Usar token carregado
                Set-Item -Path "env:$($envVar.Name)" -Value $env:GITHUB_TOKEN
            } else {
                Set-Item -Path "env:$($envVar.Name)" -Value $envVar.Value
            }
        }
        
        # Iniciar servidor
        $serverScript = $serverConfig.args[0]
        if (Test-Path $serverScript) {
            Write-Host "Starting server $serverName ($serverScript)..." -ForegroundColor Cyan
            Start-Process powershell.exe -ArgumentList "-Command", "node '$serverScript'"
            Write-Host "Server started successfully" -ForegroundColor Green
        } else {
            Write-Host "Server script not found: $serverScript" -ForegroundColor Red
        }
    } else {
        Write-Host "No MCP servers defined in configuration" -ForegroundColor Red
    }
} else {
    Write-Host "Configuration file not found: $configPath" -ForegroundColor Red
}

Write-Host "System restart process completed" -ForegroundColor Green
Write-Host "Run 'node test-system.js' to verify system status" -ForegroundColor Cyan
