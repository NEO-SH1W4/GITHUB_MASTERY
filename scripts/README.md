# GitHub Agent PowerShell Integration

Sistema avançado de integração PowerShell com estratégias MCP para automação GitHub.

## 🚀 Funcionalidades

### Comandos Principais

- **`gco 'message'`** - Contribuição rápida com mensagem
- **`gcd`** - Contribuição diária automatizada
- **`gcw`** - Automação semanal com análise
- **`gcstats [days]`** - Estatísticas (padrão: 30 dias)
- **`gchelp`** - Sistema de ajuda completo

### Funcionalidades MCP Enhanced

- ✅ Sistema de cache inteligente
- ✅ Logging estruturado com níveis
- ✅ Validação automática de ambiente
- ✅ Métricas de uso em tempo real
- ✅ Error handling robusto

## 📋 Instalação

### 1. Carregar uma vez

```powershell
. "scripts/load-agent-in-profile.ps1"
```

### 2. Carregar automaticamente

Adicione ao seu perfil PowerShell (`$PROFILE`):

```powershell
. "C:\caminho\para\scripts\load-agent-in-profile.ps1"
```

### 3. Verificar instalação

```powershell
gchelp
```

## 🔧 Configuração

### Estrutura de Cache

- **Logs**: `$env:TEMP\GitHubAgent\logs\`
- **Cache**: `$env:TEMP\GitHubAgent\cache.json`
- **Config**: `$env:TEMP\GitHubAgent\config.json`

### Variáveis Globais

```powershell
$Global:GitHubAgentConfig = @{
    Version = "2.0.0"
    ProjectPath = "..."
    CachePath = "..."
    LogPath = "..."
    MCPEnabled = $true
}
```

## 🎯 Uso Avançado

### Logs Estruturados

```powershell
# Os logs são automaticamente categorizados:
# [2025-07-02 21:00:00] [INFO] GitHub Contribution functions loaded
# [2025-07-02 21:01:00] [WARN] É necessário fornecer uma mensagem
# [2025-07-02 21:02:00] [ERROR] Node.js não encontrado
```

### Cache Inteligente

- TTL configurável por item
- Invalidação automática
- Persistência entre sessões

### Métricas MCP

- Rastreamento de comandos executados
- Performance tracking
- Error rate monitoring

## 🔍 Troubleshooting

### Problemas Comuns

**Node.js não encontrado**

```powershell
# Verificar instalação
node --version

# Cache pode estar desatualizado
Remove-Item "$env:TEMP\GitHubAgent\cache.json" -Force
```

**Comandos não carregados**

```powershell
# Recarregar agente
. "scripts/load-agent-in-profile.ps1"
```

**Logs não aparecem**

```powershell
# Verificar permissões de escrita
Test-Path "$env:TEMP\GitHubAgent\logs" -PathType Container
```

## 📊 Monitoramento

### Visualizar Logs

```powershell
Get-Content "$env:TEMP\GitHubAgent\logs\agent-$(Get-Date -Format 'yyyy-MM-dd').log" | ConvertFrom-Json
```

### Verificar Cache

```powershell
Get-Content "$env:TEMP\GitHubAgent\cache.json" | ConvertFrom-Json
```

### Status do Agente

```powershell
$Global:GitHubAgentConfig
```

## 🔧 Desenvolvimento

### Estrutura do Código

```
scripts/
├── load-agent-in-profile.ps1  # Script principal
├── setup-github-token.ps1     # Configuração de token
└── README.md                   # Esta documentação
```

### Regras de Desenvolvimento

- **Logging**: Usar `Write-MCPLog` para todas as operações
- **Cache**: Implementar TTL apropriado para cada tipo de dado
- **Error Handling**: Capturar e logar todos os erros
- **Performance**: Usar cache para operações custosas

## 📝 Licença

Este projeto está licenciado sob a [Licença MIT](../LICENSE).

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Versão:** 2.0.0 - MCP Strategy Implementation  
**Compatibilidade:** PowerShell 5.1+, Windows 10+  
**Dependências:** Node.js 18+, Git 2.40+
