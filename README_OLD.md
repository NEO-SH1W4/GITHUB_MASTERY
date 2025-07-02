# 🚀 GitHub Mastery - Domínio Total

## Objetivo
Dominar completamente o GitHub: API, automações, integrações, workflows e ferramentas avançadas.

## 🏗️ Estrutura do Projeto

### 📁 Organização
```
GITHUB_MASTERY/
├── 📂 api/                    # Scripts e exemplos da GitHub API
│   └── github-client.js      # Cliente GitHub com operações básicas
├── 📂 automations/           # Automações com GitHub Actions
├── 📂 cli-tools/            # Ferramentas de linha de comando
│   └── gh-cli.js            # CLI personalizada para GitHub
├── 📂 integrations/         # Integrações com outras plataformas
├── 📂 webhooks/             # Webhooks e eventos
│   └── webhook-server.js    # Servidor de webhooks
├── 📂 advanced-git/         # Técnicas avançadas de Git
├── 📂 security/             # Segurança e tokens
├── 📂 examples/             # Exemplos práticos
│   └── basic-api-usage.js   # Exemplo básico da API
├── 📂 docs/                 # Documentação e guias
├── 📂 .github/workflows/    # GitHub Actions
│   └── ci.yml              # Pipeline CI/CD
├── 📄 package.json         # Configuração do projeto
├── 📄 .env.example         # Exemplo de variáveis de ambiente
└── 📄 TASKS.md             # Lista de tarefas
```

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ 
- Token de acesso pessoal do GitHub
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd GITHUB_MASTERY
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com seus dados
```

4. **Configure o token GitHub**
- Vá em GitHub Settings > Developer settings > Personal access tokens
- Gere um novo token com as permissões necessárias
- Adicione o token no arquivo `.env`

### Exemplos de Uso

#### 🔌 API GitHub
```bash
# Exemplo básico
node examples/basic-api-usage.js
```

#### 🛠️ CLI Tool
```bash
# Verificar autenticação
node cli-tools/gh-cli.js auth

# Listar repositórios
node cli-tools/gh-cli.js repos

# Status geral da conta
node cli-tools/gh-cli.js status

# Criar repositório (interativo)
node cli-tools/gh-cli.js create-repo

# Ver ajuda
node cli-tools/gh-cli.js --help
```

#### 🎣 Webhook Server
```bash
# Iniciar servidor de webhooks
node webhooks/webhook-server.js

# Acesse http://localhost:3000/status para verificar
```

## 📚 Funcionalidades Implementadas

### ✅ GitHub API Client
- **Autenticação**: Verificação de token e informações do usuário
- **Rate Limiting**: Monitoramento de limites da API
- **Repositórios**: Listar, criar e obter detalhes
- **Issues**: Listar issues com filtros
- **Tratamento de Erros**: Logging colorido e informativo

### ✅ CLI Tool
- **Comandos disponíveis**:
  - `auth` - Verificar autenticação
  - `repos` - Listar repositórios
  - `repo <owner> <name>` - Detalhes de repositório
  - `issues <owner> <repo>` - Listar issues
  - `create-repo` - Criar repositório (modo interativo)
  - `status` - Status geral da conta

### ✅ Webhook Server
- **Eventos suportados**: push, issues, pull_request, release, star
- **Segurança**: Verificação de assinatura HMAC
- **Endpoints**: `/webhook`, `/status`, `/health`
- **Logging**: Processamento detalhado de eventos

### ✅ GitHub Actions
- **CI/CD Pipeline**: Testes, linting, build
- **Security Audit**: Verificação de vulnerabilidades
- **Multi-version**: Testa em Node.js 18 e 20
- **Artifacts**: Upload de builds

## 🎯 Metas de Desenvolvimento

### Concluídas ✅
- [x] Estrutura básica do projeto
- [x] Cliente GitHub API funcional
- [x] CLI básica com comandos essenciais
- [x] Servidor de webhook com eventos principais
- [x] GitHub Actions CI/CD
- [x] Documentação inicial

### Em Progresso 🔄
- [ ] Testes automatizados
- [ ] Integração com outras APIs
- [ ] Comandos Git avançados

### Planejadas 📋
- [ ] Dashboard web para monitoramento
- [ ] Automações avançadas
- [ ] Plugin para editores
- [ ] Templates de projeto
- [ ] Relatórios e análises

## 📖 Guias e Tutoriais

### Token GitHub
1. Acesse GitHub Settings > Developer settings > Personal access tokens
2. Clique em "Generate new token (classic)"
3. Selecione os escopos necessários:
   - `repo` - Acesso completo a repositórios
   - `user` - Informações do usuário
   - `admin:org` - Gestão de organizações (se necessário)
4. Copie o token e adicione no arquivo `.env`

### Configurar Webhook
1. Vá em Settings > Webhooks no seu repositório
2. Clique em "Add webhook"
3. URL: `http://localhost:3000/webhook`
4. Content type: `application/json`
5. Secret: Configure no arquivo `.env`
6. Selecione os eventos desejados

## 🔧 Scripts Disponíveis

```bash
npm start          # Executar projeto principal
npm run dev        # Modo desenvolvimento com watch
npm test           # Executar testes
npm run lint       # Verificar código
npm run format     # Formatar código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---
*Projeto GitHub Mastery - Desenvolvido com ❤️ para dominar o GitHub*

