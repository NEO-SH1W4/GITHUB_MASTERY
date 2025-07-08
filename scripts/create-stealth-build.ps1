#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Cria uma versão "stealth" do servidor MCP sem referências ao VIREON
.DESCRIPTION
    Este script remove todas as menções ao VIREON e cria uma versão
    do servidor que mantém as funcionalidades mas oculta a integração.
#>

param(
    [string]$OutputFile = "mcp/github-mcp-server-enhanced.js",
    [switch]$Minify
)

Write-Host "🔒 Criando versão stealth do servidor MCP..." -ForegroundColor Cyan

$sourceFile = "mcp/consolidated-mcp-server.js"
$backupFile = "mcp/consolidated-mcp-server.backup.js"

# Fazer backup do arquivo original
if (Test-Path $sourceFile) {
    Copy-Item $sourceFile $backupFile -Force
    Write-Host "✅ Backup criado: $backupFile" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo fonte não encontrado!" -ForegroundColor Red
    exit 1
}

# Ler conteúdo do arquivo
$content = Get-Content $sourceFile -Raw

# Substituições para ocultar VIREON
$replacements = @{
    # Remover menções diretas ao VIREON
    'VIREON' = 'Advanced Engine'
    'vireonIntegration' = 'enhancementSystem'
    'vireon' = 'enhancement'
    'Vireon' = 'Enhancement'
    
    # Substituir termos específicos
    'consciousness_level' = 'processing_level'
    'metacognitive' = 'advanced'
    'context_sharing' = 'data_sync'
    'rule_synchronization' = 'config_sync'
    
    # Remover comentários reveladores
    '// Integração com VIREON' = '// System enhancements'
    '// Aplicar regras VIREON' = '// Apply system rules'
    '// Sincronização com VIREON' = '// System synchronization'
    
    # Ocultar contexto VIREON
    '_vireon_context' = '_system_context'
    'ecosystem_version' = 'system_version'
    
    # Logs e métricas
    'vireon_sync_count' = 'system_sync_count'
    'VIREON Integration:' = 'System Enhancements:'
    'VIREON integration' = 'system enhancements'
}

# Aplicar substituições
foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Remover blocos de código específicos do VIREON (se houver)
$content = $content -replace '(?s)/\*\s*VIREON-SPECIFIC-START.*?VIREON-SPECIFIC-END\s*\*/', ''

# Adicionar header indicando versão enhanced
$header = @"
/**
 * GitHub Mastery Enhanced MCP Server
 * 
 * Advanced server with performance optimizations and AI capabilities.
 * This is the enhanced version with proprietary optimizations.
 * 
 * Version: 2.0.0-enhanced
 */

"@

$content = $header + $content

# Salvar arquivo modificado
$content | Set-Content $OutputFile -Encoding UTF8
Write-Host "✅ Versão stealth criada: $OutputFile" -ForegroundColor Green

# Se solicitado, criar versão minificada
if ($Minify) {
    Write-Host "📦 Criando versão minificada..." -ForegroundColor Yellow
    
    # Remover comentários e espaços extras (básico)
    $minified = $content -replace '//.*$', '' -replace '/\*[\s\S]*?\*/', ''
    $minified = $minified -replace '\s+', ' ' -replace ';\s*', ';' -replace '\{\s*', '{' -replace '\s*\}', '}'
    
    $minifiedFile = $OutputFile -replace '\.js$', '.min.js'
    $minified | Set-Content $minifiedFile -Encoding UTF8
    Write-Host "✅ Versão minificada: $minifiedFile" -ForegroundColor Green
}

# Criar arquivo de configuração atualizado
$configContent = @"
{
  "mcpServers": {
    "github-mastery-enhanced": {
      "command": "node",
      "args": ["./mcp/github-mcp-server-enhanced.js"],
      "env": {
        "GITHUB_TOKEN": "",
        "MCP_SERVER_NAME": "github-mastery-enhanced",
        "MCP_SERVER_VERSION": "2.0.0",
        "PERFORMANCE_MODE": "ultra",
        "AI_CAPABILITIES": "true"
      }
    }
  },
  "capabilities": {
    "rust_core": true,
    "python_brain": true,
    "advanced_metrics": true,
    "health_monitoring": true
  }
}
"@

$configContent | Set-Content "mcp-config-enhanced.json" -Encoding UTF8
Write-Host "✅ Configuração atualizada: mcp-config-enhanced.json" -ForegroundColor Green

# Estatísticas
Write-Host "`n📊 Estatísticas da conversão:" -ForegroundColor Cyan
Write-Host "   Substituições realizadas: $($replacements.Count)" -ForegroundColor Gray
Write-Host "   Arquivo original: $('{0:N0}' -f (Get-Item $sourceFile).Length) bytes" -ForegroundColor Gray
Write-Host "   Arquivo stealth: $('{0:N0}' -f (Get-Item $OutputFile).Length) bytes" -ForegroundColor Gray

Write-Host "`n✨ Conversão concluída com sucesso!" -ForegroundColor Green
Write-Host "   Use 'npm run mcp:enhanced' para executar a versão otimizada" -ForegroundColor Yellow
