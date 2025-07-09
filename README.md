# GitHub Mastery

## Status do Projeto

### Infraestrutura & DevOps

✅ Configuração SSH estabelecida e testada
✅ CI/CD com GitHub Actions configurado
✅ Ambiente de desenvolvimento padronizado

### Desenvolvimento

✅ Integração MCP implementada
✅ Testes unitários configurados (Jest)
✅ ESLint + Prettier (padrão AirBnB estendido)

### Documentação

✅ README trilíngue (EN/PT-BR/ES)
✅ Guias de contribuição atualizados
✅ Landing page com analytics

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**Complete GitHub mastery through API automation, integrations, webhooks, and advanced CLI tools**

_Domínio completo do GitHub através de API, automações, integrações e ferramentas avançadas_

[🌐 **Visit Homepage**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 Português](./docs/pt-br/README.md) | [🇪🇸 Español](./docs/es/README.md) | [🇨🇳 中文](./docs/zh/README.md) | [🇮🇳 हिंदी](./docs/hi/README.md) | [🇯🇵 日本語](./docs/ja/README.md) | [🌍 العربية](./docs/ar/README.md) | [🇩🇪 Deutsch](./docs/de/README.md) | 🇺🇸 English

</div>

## ✨ Key Features

🔌 **GitHub API Client**: Complete client with authentication and intelligent rate limiting  
⚡ **Interactive CLI**: Powerful command-line tools with intuitive prompts  
🔗 **Webhook Server**: Robust server for GitHub events with HMAC security  
🔄 **CI/CD Pipeline**: Automated workflows with GitHub Actions  
🤖 **GIDEN AI System**: Autonomous GitHub Intelligence with adaptive learning  
🛡️ **Security First**: HMAC verification, token management, and best practices  
🎨 **Rich UX**: Colorful outputs and user-friendly interfaces

## 🎯 **NEW: GitHub Agent v2.0 Landing Page**

[![Deploy to GitHub Pages](https://github.com/NEO-SH1W4/github_mastery/workflows/Deploy%20Landing%20Page%20to%20GitHub%20Pages/badge.svg)](https://github.com/NEO-SH1W4/github_mastery/actions)

**🚀 [Live Demo](https://neo-sh1w4.github.io/github_mastery/)** - Professional landing page with advanced lead scoring

### What's Included:

- 📄 **Professional Landing Page** with conversion optimization
- 🧠 **Advanced Lead Scoring System** with behavioral tracking
- 📧 **Email Marketing Sequences** for different user personas
- 📊 **Analytics Integration** (GA4, Mixpanel ready)
- 🔄 **A/B Testing Framework** built-in
- 🚀 **Auto-deploy via GitHub Pages**

📖 **[Complete Documentation](LANDING_PAGE.md)** | 📈 **[Go-to-Market Strategy](docs/GO_TO_MARKET_STRATEGY.md)**

## 📊 Development Potential

- **Target Market**: Developers, DevOps teams, GitHub power users
- **Use Cases**: Automation, bulk operations, custom integrations
- **Growth Path**: CLI → Web Dashboard → Enterprise Solutions

📋 [View complete project roadmap](#-roadmap)

## 🚀 Quick Installation

```bash
# Clone and setup (HTTPS)
git clone https://github.com/NEO-SH1W4/github-mastery.git

# Or using SSH
git clone git@github.com:NEO-SH1W4/github-mastery.git

# Install dependencies
cd github-mastery
npm install

# Configure environment
cp .env.example .env
# Add your GitHub token to .env

# View homepage (open in browser)
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# Start CLI
npm start
```

## 💡 Quick Start

### 1. Authentication Setup

```bash
# Verify GitHub authentication
node cli-tools/gh-cli.js auth

# Check account status
node cli-tools/gh-cli.js status
```

### 2. Repository Operations

```bash
# List repositories
node cli-tools/gh-cli.js repos --limit 10

# Get repo details
node cli-tools/gh-cli.js repo owner repo-name

# Create repository (interactive)
node cli-tools/gh-cli.js create-repo
```

### 3. Webhook Server

```bash
# Start webhook server
npm run webhook

# Development mode with auto-reload
npm run dev
```

## 🧩 Supported Operations

| Category          | Status      | Features                                             |
| ----------------- | ----------- | ---------------------------------------------------- |
| 🔌 **API Client** | ✅ Complete | Authentication, rate limiting, repositories, issues  |
| ⚡ **CLI Tools**  | ✅ Complete | Interactive commands, colorful output, user-friendly |
| 🔗 **Webhooks**   | ✅ Complete | Event handling, HMAC verification, monitoring        |
| 🔄 **CI/CD**      | ✅ Complete | GitHub Actions, automated testing, deployment        |
| 🧪 **Testing**    | 📋 Planned  | Unit tests, integration tests, coverage reports      |
| 🌐 **Dashboard**  | 📋 Planned  | Web interface, analytics, visual monitoring          |

## 📚 Documentation

- 🌐 [**Project Homepage**](./index.html) - Interactive project overview
- 🎯 [**Landing Page Demo**](https://neo-sh1w4.github.io/github_mastery/) - Live conversion-optimized page
- 📖 [**Landing Page Guide**](LANDING_PAGE.md) - Complete setup and customization
- 🏃‍♂️ [**Quick Start Guide**](./docs/en/QUICKSTART.md)
- 🔌 [**API Usage Examples**](./examples/)
- 🛠️ [**CLI Commands Reference**](./docs/en/CLI.md)
- 🔗 [**Webhook Setup Guide**](./docs/en/WEBHOOKS.md)
- 🤖 [**Model Routing Rules**](./MODEL_ROUTING_RULES.md) - Adaptive model selection
- 🤝 [**Contributing Guide**](./CONTRIBUTING.md)
- 📜 [**Code of Conduct**](./CODE_OF_CONDUCT.md)
- 📋 [**Changelog**](./CHANGELOG.md)

## 🛠️ For Developers

### Code Quality

```bash
# Linting and formatting
npm run lint && npm run format

# Validation pipeline
npm run validate

# Development server
npm run dev
```

### Project Structure

```
github-mastery/
├── index.html           # Project homepage
├── landing-page/        # Professional landing page
│   ├── index.html      # Landing page HTML
│   ├── js/lead-scoring.js # Advanced lead scoring
│   └── README.md       # Landing page documentation
├── styles.css           # Homepage styles
├── api/                 # GitHub API client
├── cli-tools/           # Command line interface
├── webhooks/            # Webhook server
├── examples/            # Usage examples
├── docs/                # Documentation
│   ├── GO_TO_MARKET_STRATEGY.md # Business strategy
│   ├── en/             # English docs
│   ├── pt-br/          # Portuguese docs
│   └── es/             # Spanish docs
├── .github/workflows/   # CI/CD pipelines
└── tests/               # Test suites (planned)
```

## 🤝 Contributing

Contributions are very welcome! This project aims to become the definitive toolkit for GitHub automation.

1. 🍴 Fork the project
2. 🌟 Create your feature branch
3. ✅ Add tests (when available)
4. 📝 Update documentation
5. 🚀 Open a Pull Request

See the [complete contribution guide](./CONTRIBUTING.md).

## 🎯 Roadmap

### v1.1.0 (✅ Released - July 2025)

- ✅ Professional trilingual documentation (EN/PT-BR/ES)
- ✅ DOCSYNC-style design with badges
- ✅ Comprehensive Quick Start guides
- ✅ Multilingual contributing system
- ✅ **Professional landing page with lead scoring**
- ✅ **Go-to-market strategy implementation**

### v1.2.0 (Q3 2025)

- 🧪 Automated testing suite
- 🔄 Advanced PR operations
- 📊 Analytics and metrics
- 🔧 Bulk operations
- 🎯 **Landing page A/B testing**

### v1.3.0 (Q4 2025)

- 🌐 Web dashboard
- 🤖 Advanced automations
- 🔗 Third-party integrations
- 📋 Project templates
- 💰 **Revenue optimization**

### v2.0.0 (2026)

- 🏢 Enterprise features
- 🧩 Plugin ecosystem
- ☁️ Cloud deployment
- 📱 Mobile interface
- 🎯 **Full product launch**

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


See our [Code of Conduct](./CODE_OF_CONDUCT.md) for community standards.
## 🌟 Acknowledgments

Built with ❤️ for the developer community. If this project helped you, consider giving it a ⭐!

---

<div align="center">

**[🌐 Local Homepage](./index.html) • [🎯 Landing Page](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 Docs](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 Issues](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 Discussions](https://github.com/NEO-SH1W4/github-mastery/discussions)**

</div>
