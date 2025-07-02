# GitHub Agent

Um agente inteligente para automatizar tarefas no GitHub, incluindo contribuições, sincronização de repositórios e análise de perfil.

## 🚀 Funcionalidades

- **Contribuições automatizadas** - Crie contribuições com um único comando
- **Análise de estatísticas** - Visualize estatísticas detalhadas de suas contribuições
- **Otimização de perfil** - Configure seu perfil GitHub para máxima visibilidade
- **Sincronização de repositórios** - Mantenha seus repositórios locais sincronizados
- **Análise de saúde** - Verifique a saúde de seus repositórios
- **Relatórios** - Gere relatórios detalhados de repositórios

## 📋 Pré-requisitos

- Node.js v18.x ou superior
- npm v9.x ou superior
- Um token de acesso pessoal do GitHub com as permissões adequadas

## 🔧 Instalação

1. Configure o token do GitHub em suas variáveis de ambiente:

```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN="seu-token-aqui"

# Linux/macOS
export GITHUB_TOKEN="seu-token-aqui"
```

2. Instale as dependências:

```bash
npm install
```

## 💻 Uso

### Interface de Linha de Comando

```bash
# Inicializar o agente e verificar configurações
npm run agent init

# Contribuição rápida
npm run agent quick-contribution "feat: adicionar nova funcionalidade"
# ou usando o alias
npm run gco "feat: adicionar nova funcionalidade"

# Contribuição diária automática
npm run gcd

# Contribuição semanal com análise
npm run gcw

# Visualizar estatísticas
npm run gcstats
```

### Integração com PowerShell

Para facilitar o uso, você pode integrar o GitHub Agent com seu perfil PowerShell:

1. Execute o script de carregamento:

```powershell
. "caminho\para\scripts\load-agent-in-profile.ps1"
```

2. Adicione ao seu perfil PowerShell para carregar automaticamente:

```powershell
# Adicione esta linha ao seu perfil ($PROFILE)
. "caminho\para\scripts\load-agent-in-profile.ps1"
```

3. Depois de carregado, use os comandos diretamente no PowerShell:

```powershell
# Contribuição rápida
gco "feat: adicionar nova funcionalidade"

# Contribuição diária
gcd

# Estatísticas (últimos 30 dias por padrão)
gcstats
# ou especifique os dias
gcstats 60
```

## 📊 Configuração

O GitHub Agent pode ser personalizado editando as variáveis de ambiente:

- `GITHUB_TOKEN` - Token de acesso pessoal do GitHub
- `RATE_LIMIT_THRESHOLD` - Limite para avisos de rate limit (padrão: 100)
- `GITHUB_USERNAME` - Seu nome de usuário do GitHub (para alguns recursos)

## 🔄 Fluxo de Trabalho Recomendado

1. **Início do dia**: Execute `gcd` para criar uma contribuição diária automática
2. **Durante o dia**: Use `gco` para contribuições específicas em seus projetos
3. **Fim da semana**: Execute `gcw` para análise semanal e planejamento
4. **Revisão mensal**: Use `gcstats 30` para analisar seu progresso mensal

## 📝 Licença

Este projeto está licenciado sob a [Licença MIT](../LICENSE).
