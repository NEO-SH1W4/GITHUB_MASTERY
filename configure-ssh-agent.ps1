# Script para configurar e iniciar SSH Agent
Write-Host "=== Configurando SSH Agent ===" -ForegroundColor Cyan

# Verificar se está rodando como administrador
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "Abrindo nova janela com privilégios administrativos..." -ForegroundColor Yellow
    
    # Reexecutar como admin
    Start-Process PowerShell -Verb RunAs -ArgumentList "-NoProfile", "-ExecutionPolicy Bypass", "-File", $PSCommandPath
    exit
}

Write-Host "Executando com privilégios administrativos..." -ForegroundColor Green

# Configurar SSH Agent
try {
    Set-Service ssh-agent -StartupType Automatic -ErrorAction Stop
    Start-Service ssh-agent -ErrorAction Stop
    Write-Host "SSH Agent configurado e iniciado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "Erro ao configurar SSH Agent: $_" -ForegroundColor Red
}

Write-Host "`nPressione qualquer tecla para fechar..." -ForegroundColor White
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

