# Guia de Configuração do GitHub

## Status Atual ✅

1. **Git Local**: Configurado
   - Nome: NEO-SH1W4
   - Email: joao.oliveirax@icloud.com

2. **Chave SSH**: Gerada e pronta
   - Arquivo: `~/.ssh/symbeon_id_ed25519`
   - Chave pública copiada para área de transferência

## Próximos Passos

### 1. Adicionar Chave SSH ao GitHub

**Sua chave pública (já copiada):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPEBafTQJ3IlDxsSlom+ZXLgXsXSnD4Z1IT9NJV5Vu3j symbeon@local
```

**Passos:**
1. Acesse: https://github.com/settings/keys
2. Clique em "New SSH key"
3. Título sugerido: "PC João - Windows"
4. Cole a chave (Ctrl+V)
5. Clique em "Add SSH key"

### 2. Configurar SSH Agent (Windows)

Execute este comando PowerShell como Administrador:
```powershell
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent
```

Depois, no PowerShell normal:
```powershell
ssh-add "$env:USERPROFILE\.ssh\symbeon_id_ed25519"
```

### 3. Testar Conexão

```bash
ssh -T git@github.com
```

Deve retornar: "Hi NEO-SH1W4! You've successfully authenticated..."

### 4. Configurar Perfil do GitHub

Acesse: https://github.com/settings/profile

**Sugestões de configuração:**

#### Informações Básicas
- **Name**: João Oliveira (ou seu nome completo)
- **Bio**: Sugestões:
  - "🚀 Full Stack Developer | 💻 DevOps Enthusiast | 🔧 Automation Expert"
  - "Building innovative solutions with modern tech stacks"
  - "Passionate about clean code and efficient systems"
- **Company**: Sua empresa ou "@freelancer"
- **Location**: Sua cidade/país
- **Website**: Seu portfolio ou LinkedIn

#### Informações Adicionais
- **Twitter/X**: @seuusername
- **LinkedIn**: linkedin.com/in/seuusername

#### README do Perfil
Crie um repositório com seu username: `NEO-SH1W4/NEO-SH1W4`

Exemplo de `README.md`:
```markdown
# Olá, eu sou João! 👋

## 🚀 Sobre Mim
Desenvolvedor Full Stack apaixonado por criar soluções inovadoras e automatizar processos.

## 🛠️ Tecnologias & Ferramentas
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

## 📊 GitHub Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=NEO-SH1W4&show_icons=true&theme=dark)

## 🌟 Projetos em Destaque
- [GitHub Mastery](https://github.com/NEO-SH1W4/github-mastery) - Sistema de gestão de projetos
- [GuarDrive](https://github.com/NEO-SH1W4/guardrive) - Solução de backup automatizado
- [MCP Ecosystem](https://github.com/NEO-SH1W4/mcp-ecosystem) - Ferramentas MCP

## 📫 Como me encontrar
- LinkedIn: [João Oliveira](https://linkedin.com/in/seuusername)
- Email: joao.oliveirax@icloud.com
```

### 5. Configurações Recomendadas do Repositório

#### Para novos repositórios:
1. **Acesse**: https://github.com/settings/repositories
2. Configure:
   - Default branch name: `main`
   - Automatically delete head branches: ✓

#### Segurança:
1. **Acesse**: https://github.com/settings/security
2. Ative:
   - Two-factor authentication (2FA)
   - Vigilant mode para commits verificados

### 6. Tokens de Acesso Pessoal (PAT)

Para CI/CD e automações:
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Configure:
   - Note: "GitHub Mastery CI/CD"
   - Expiration: 90 days
   - Scopes: `repo`, `workflow`, `write:packages`

### 7. Verificar Email

Certifique-se que seu email está verificado:
https://github.com/settings/emails

## Comandos Úteis

### Clonar com SSH
```bash
git clone git@github.com:NEO-SH1W4/repositorio.git
```

### Configurar upstream para fork
```bash
git remote add upstream git@github.com:original-owner/original-repo.git
```

### Assinar commits com GPG (opcional)
```bash
gpg --gen-key
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true
```

## Checklist Final

- [ ] Chave SSH adicionada ao GitHub
- [ ] SSH Agent configurado e rodando
- [ ] Teste SSH funcionando
- [ ] Perfil atualizado com informações
- [ ] Foto de perfil adicionada
- [ ] Bio escrita
- [ ] README do perfil criado
- [ ] 2FA ativado
- [ ] Email verificado

## Troubleshooting

### SSH não funciona?
```powershell
# Verificar se o agente está rodando
Get-Service ssh-agent

# Reiniciar o agente
Stop-Service ssh-agent
Start-Service ssh-agent

# Re-adicionar a chave
ssh-add "$env:USERPROFILE\.ssh\symbeon_id_ed25519"
```

### Git pede senha?
Certifique-se de usar URLs SSH:
```bash
# Mudar de HTTPS para SSH
git remote set-url origin git@github.com:NEO-SH1W4/repositorio.git
```

