# Script para configurar SSH Agent e GitHub
Write-Host "=== Configuração SSH para GitHub ===" -ForegroundColor Cyan

# Função para executar comandos como administrador
function Invoke-AdminCommand {
    param([string]$Command)
    
    $encodedCommand = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($Command))
    $scriptPath = "$env:TEMP\admin_ssh_setup.ps1"
    
    $scriptContent = @"
# Script gerado para execução administrativa
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    `$adminCommand = [System.Text.Encoding]::Unicode.GetString([Convert]::FromBase64String("$encodedCommand"))
    Start-Process PowerShell -Verb RunAs -ArgumentList "-NoProfile", "-ExecutionPolicy Bypass", "-Command `$adminCommand"
    exit
}
# Se já estiver como admin, executa diretamente
$Command
Write-Host "`nComando concluído. Pressione qualquer tecla para fechar..." -ForegroundColor Green
`$null = `$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
"@
    
    Set-Content -Path $scriptPath -Value $scriptContent
    
    # Executar o script criado
    powershell -ExecutionPolicy Bypass -File $scriptPath
}

# 1. Configurar SSH Agent para iniciar automaticamente
Write-Host "`n1. Configurando SSH Agent..." -ForegroundColor Yellow
$adminCmd = @"
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent
Write-Host 'SSH Agent configurado e iniciado com sucesso!' -ForegroundColor Green
"@

Write-Host "Este comando precisa de privilégios administrativos para configurar o SSH Agent."
Write-Host "Uma janela de PowerShell administrativo será aberta para executar a configuração."
$response = Read-Host "Deseja continuar? (S/N)"
if ($response -eq 'S' -or $response -eq 's') {
    Invoke-AdminCommand -Command $adminCmd
    Start-Sleep -Seconds 3
}

# 2. Adicionar a chave SSH ao agente
Write-Host "`n2. Adicionando chave SSH ao agente..." -ForegroundColor Yellow
ssh-add "$env:USERPROFILE\.ssh\symbeon_id_ed25519"

# 3. Copiar chave pública para clipboard
Write-Host "`n3. Copiando chave pública para área de transferência..." -ForegroundColor Yellow
Get-Content "$env:USERPROFILE\.ssh\symbeon_id_ed25519.pub" | Set-Clipboard
Write-Host "Chave pública copiada!" -ForegroundColor Green

# 4. Instruções para adicionar ao GitHub
Write-Host "`n=== PRÓXIMOS PASSOS ===" -ForegroundColor Cyan
Write-Host "1. Acesse: https://github.com/settings/keys" -ForegroundColor White
Write-Host "2. Clique em 'New SSH key'" -ForegroundColor White
Write-Host "3. Dê um título (ex: 'PC João - Windows')" -ForegroundColor White
Write-Host "4. Cole a chave (já está na área de transferência)" -ForegroundColor White
Write-Host "5. Clique em 'Add SSH key'" -ForegroundColor White
Write-Host "`nSua chave pública:" -ForegroundColor Yellow
Get-Content "$env:USERPROFILE\.ssh\symbeon_id_ed25519.pub"

Write-Host "`n5. Testando conexão com GitHub..." -ForegroundColor Yellow
Write-Host "Após adicionar a chave no GitHub, pressione Enter para testar a conexão"
Read-Host

ssh -T git@github.com

Write-Host "`n=== Configuração Concluída ===" -ForegroundColor Green
Write-Host "Pressione Enter para sair"
Read-Host

