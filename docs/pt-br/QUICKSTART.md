# Guia de Início Rápido 🚀

<div align="center">

**Comece com GitHub Mastery em minutos**

_Get started with GitHub Mastery in minutes_

🇧🇷 Português | [🇺🇸 English](../en/QUICKSTART.md) | [🇪🇸 Español](../es/QUICKSTART.md)

</div>

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** ou **yarn** (vem com Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Conta GitHub** com Personal Access Token

## 🔑 Configuração do Token GitHub

### 1. Criar Personal Access Token

1. Acesse [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Clique em **"Generate new token (classic)"**
3. Dê um nome descritivo: `GitHub Mastery CLI`
4. Selecione os escopos necessários:
   - ✅ `repo` (Controle total de repositórios privados)
   - ✅ `user` (Atualizar dados do usuário)
   - ✅ `notifications` (Acessar notificações)
   - ✅ `workflow` (Atualizar workflows do GitHub Actions)
5. Clique em **"Generate token"**
6. **Copie o token imediatamente** (você não verá novamente!)

### 2. Permissões do Token Explicadas

| Escopo          | Propósito                                           | Obrigatório |
| --------------- | --------------------------------------------------- | ----------- |
| `repo`          | Operações de repositório (criar, listar, gerenciar) | ✅ Sim      |
| `user`          | Informações do perfil do usuário                    | ✅ Sim      |
| `notifications` | Acesso a notificações                               | 🔶 Opcional |
| `workflow`      | Gerenciamento do GitHub Actions                     | 🔶 Opcional |
| `gist`          | Gerenciamento de gists                              | 🔶 Opcional |

## 🚀 Instalação

### Opção 1: Configuração Rápida (Recomendada)

```bash
# Clone o repositório
git clone https://github.com/NEO-SH1W4/GITHUB_MASTERY.git
cd GITHUB_MASTERY

# Instale dependências
npm install

# Configure o ambiente
cp .env.example .env
```

### Opção 2: Fork e Clone

```bash
# Faça fork do repositório no GitHub primeiro, depois:
git clone https://github.com/SEU_USUARIO/GITHUB_MASTERY.git
cd GITHUB_MASTERY
npm install
cp .env.example .env
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Edite seu arquivo `.env`:

```bash
# Configuração do GitHub
GITHUB_TOKEN=ghp_seu_personal_access_token_aqui
GITHUB_USERNAME=seu_usuario_github

# Configuração de Webhook (opcional)
WEBHOOK_SECRET=seu_webhook_secret_aqui
WEBHOOK_PORT=3000

# Configuração da API
API_BASE_URL=https://api.github.com
RATE_LIMIT_THRESHOLD=100
```

### 2. Verificar Instalação

```bash
# Testar instalação da CLI
npm start -- --help

# Deve exibir:
# Usage: gh-mastery [options] [command]
# GitHub Mastery CLI - Ferramenta para operações GitHub
```

## 🎯 Primeiros Passos

### 1. Autenticar

```bash
# Verificar autenticação do GitHub
node cli-tools/gh-cli.js auth

# Saída esperada:
# ✅ Authentication successful!
# 👤 User: seu-usuario
# 🔑 Rate limit: 5000/5000
```

### 2. Verificar Status da Conta

```bash
# Obter visão geral da conta
node cli-tools/gh-cli.js status

# Mostra:
# - Informações do usuário
# - Contagem de repositórios
# - Limites de taxa
# - Conectividade da API
```

### 3. Listar Seus Repositórios

```bash
# Listar seus repositórios
node cli-tools/gh-cli.js repos --limit 10

# Com filtros
node cli-tools/gh-cli.js repos --type public --sort updated
```

## 💡 Casos de Uso Comuns

### Gerenciamento de Repositórios

```bash
# Obter detalhes do repositório
node cli-tools/gh-cli.js repo owner nome-repo

# Criar novo repositório (interativo)
node cli-tools/gh-cli.js create-repo
```

### Gerenciamento de Issues

```bash
# Listar issues de um repositório
node cli-tools/gh-cli.js issues owner nome-repo

# Filtrar apenas issues abertas
node cli-tools/gh-cli.js issues owner nome-repo --state open
```

### Servidor de Webhook

```bash
# Iniciar servidor de webhook para eventos em tempo real
npm run webhook

# Em modo desenvolvimento (auto-reload)
npm run dev
```

## 🔧 Comandos de Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar CLI
npm start

# Executar servidor de webhook
npm run webhook

# Modo desenvolvimento
npm run dev

# Executar exemplo
npm run example

# Qualidade de código
npm run lint
npm run format
npm run validate
```

### Referência de Comandos CLI

| Comando       | Descrição               | Exemplo                       |
| ------------- | ----------------------- | ----------------------------- |
| `auth`        | Verificar autenticação  | `npm start auth`              |
| `status`      | Visão geral da conta    | `npm start status`            |
| `repos`       | Listar repositórios     | `npm start repos --limit 10`  |
| `repo`        | Detalhes do repositório | `npm start repo owner nome`   |
| `issues`      | Listar issues           | `npm start issues owner repo` |
| `create-repo` | Criar repositório       | `npm start create-repo`       |

## 🐛 Solução de Problemas

### Problemas Comuns

#### ❌ Falha na Autenticação

```bash
# Erro: Request failed with status code 401
```

**Solução**: Verifique seu token GitHub no arquivo `.env`

#### ❌ Limite de Taxa Excedido

```bash
# Erro: API rate limit exceeded
```

**Solução**: Aguarde o reset do limite de taxa ou use solicitações autenticadas

#### ❌ Comando Não Encontrado

```bash
# Erro: node: command not found
```

**Solução**: Instale Node.js de [nodejs.org](https://nodejs.org/)

#### ❌ Permissão Negada

```bash
# Erro: EACCES: permission denied
```

**Solução**: Verifique permissões de arquivo ou execute com privilégios apropriados

### Modo Debug

```bash
# Habilitar logging detalhado
DEBUG=* node cli-tools/gh-cli.js auth

# Verificar variáveis de ambiente
node -e "console.log(process.env.GITHUB_TOKEN ? 'Token configurado' : 'Token ausente')"
```

## 📚 Próximos Passos

Agora que você está configurado, explore mais recursos:

1. 📖 [**Referência de Comandos CLI**](./CLI.md)
2. 🔗 [**Guia de Configuração de Webhooks**](./WEBHOOKS.md)
3. 🔌 [**Exemplos de Uso da API**](../../examples/)
4. 🤝 [**Guia de Contribuição**](../../CONTRIBUTING.md)

## 💬 Precisa de Ajuda?

- 🐛 [Reportar problemas](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues)
- 💬 [Iniciar uma discussão](https://github.com/NEO-SH1W4/GITHUB_MASTERY/discussions)
- 📖 [Verificar documentação](../../README.md)
- 🔍 [Pesquisar issues existentes](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues?q=is%3Aissue)

---

<div align="center">

**Pronto para dominar a automação do GitHub?** 🚀

[🏠 Homepage](https://github.com/NEO-SH1W4/GITHUB_MASTERY) • [📖 Documentação Completa](../../README.md)

</div>
