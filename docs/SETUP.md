# Guia de Configuração - GitHub Mastery

Este documento detalha o processo de configuração do ambiente de desenvolvimento para o projeto GitHub Mastery, seguindo as regras definidas para o ambiente de desenvolvimento.

## Pré-requisitos

### Hardware Recomendado
- 8 GB RAM (mínimo)
- SSD com pelo menos 20 GB de espaço livre
- Processador multi-core recente

### Software Necessário
- **Git ≥2.40**
- **Node.js ≥18** (LTS recomendado)
- **Python ≥3.10**
- **VS Code** com extensões recomendadas
- **Docker Desktop** (opcional, para ambientes isolados)

## Passos para Configuração

### 1. Clone do Repositório

```bash
git clone https://github.com/usuario/github-mastery.git
cd github-mastery
```

### 2. Instalação de Dependências

Execute o script de setup fornecido:

```bash
# No Windows
pwsh -File .\scripts\setup.ps1

# No Linux/macOS
bash ./scripts/setup.sh
```

Ou instale manualmente:

```bash
# Instalar dependências Node.js
npm install

# Instalar dependências Python (se aplicável)
pip install -r requirements.txt
```

### 3. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
# Configurações da API do GitHub
GITHUB_CLIENT_ID=seu_client_id
GITHUB_CLIENT_SECRET=seu_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback

# Configurações do servidor
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

### 4. Verificação da Instalação

Execute o script de diagnóstico para validar sua configuração:

```bash
pwsh -File health.ps1
```

O script verificará:
- Versões corretas de software
- Disponibilidade de portas
- Configurações de ambiente
- Permissões de acesso

### 5. Configuração de Git Hooks

Os hooks do Git são instalados automaticamente pelo script de setup, mas você pode reinstalá-los:

```bash
npx husky install
```

## Executando o Projeto

### Servidor MCP

```bash
npm run mcp:server
```

### Servidor REST API

```bash
npm run api:rest
```

### Interface Web

```bash
npm run serve
```

### Todos os Serviços Simultaneamente

```bash
npm run start:all
```

## Estrutura do Projeto

```
github-mastery/
├── api/                # Implementação da API REST
├── cli/                # Interface de linha de comando
├── docs/               # Documentação
├── mcp/                # Implementação do Model Context Protocol
│   ├── server/         # Servidor MCP
│   ├── handlers/       # Manipuladores de contexto
│   └── client/         # Cliente para acesso ao MCP
├── public/             # Arquivos estáticos da interface web
├── scripts/            # Scripts de automação e setup
├── tests/              # Testes automatizados
└── web/                # Frontend web
```

## Ferramentas de Qualidade

| Ferramenta | Propósito | Configuração |
|------------|-----------|--------------|
| ESLint     | Linting JS/TS | AirBnB + TypeScript |
| Prettier   | Formatação de código | 2 espaços, sem ponto-e-vírgula |
| Jest       | Testes unitários | `jest.config.js` |
| Black      | Formatação Python | 88 caracteres |
| isort      | Organização de imports | Configurado com Black |

## Resolução de Problemas

### Erro: "Selecionar uma aplicação para abrir 'git'"

Execute o script de correção Git:

```bash
# Com privilégios administrativos
pwsh -File C:\Users\<usuario>\fix-git-admin.ps1 -Description "Correção Git"
```

### Comando "node" não encontrado

Verifique se Node.js está instalado e adicionado ao PATH:

```bash
# Verificar variável PATH
$env:Path -split ';'
```

## Checklist de Primeiro Dia

1. [  ] Acessar repositório (verificar acesso ao GitHub Org)
2. [  ] Clonar e rodar `./scripts/setup.ps1`
3. [  ] Executar `pwsh -File health.ps1` para validar ambiente
4. [  ] Criar primeiro PR (simulação de correção no README)

## Próximos Passos

Após a configuração, consulte:
- `README.md` para visão geral do projeto
- `docs/CONTRIBUTING.md` para diretrizes de contribuição
- `docs/ARCHITECTURE.md` para detalhes da arquitetura MCP

---

*Documento atualizado em: 2025-07-02*

