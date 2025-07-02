# Quick Start Guide 🚀

<div align="center">

**Get started with GitHub Mastery in minutes**

*Comece com GitHub Mastery em minutos*

[🇧🇷 Português](../pt-br/QUICKSTART.md) | 🇺🇸 English

</div>

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **GitHub Account** with Personal Access Token

## 🔑 GitHub Token Setup

### 1. Create Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name: `GitHub Mastery CLI`
4. Select required scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `user` (Update user data)
   - ✅ `notifications` (Access notifications)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### 2. Token Permissions Explained

| Scope | Purpose | Required |
|-------|---------|----------|
| `repo` | Repository operations (create, list, manage) | ✅ Yes |
| `user` | User profile information | ✅ Yes |
| `notifications` | Access to notifications | 🔶 Optional |
| `workflow` | GitHub Actions management | 🔶 Optional |
| `gist` | Gist management | 🔶 Optional |

## 🚀 Installation

### Option 1: Quick Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/NEO-SH1W4/GITHUB_MASTERY.git
cd GITHUB_MASTERY

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### Option 2: Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/GITHUB_MASTERY.git
cd GITHUB_MASTERY
npm install
cp .env.example .env
```

## ⚙️ Configuration

### 1. Environment Variables

Edit your `.env` file:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_USERNAME=your_github_username

# Webhook Configuration (optional)
WEBHOOK_SECRET=your_webhook_secret_here
WEBHOOK_PORT=3000

# API Configuration
API_BASE_URL=https://api.github.com
RATE_LIMIT_THRESHOLD=100
```

### 2. Verify Installation

```bash
# Test CLI installation
npm start -- --help

# Should output:
# Usage: gh-mastery [options] [command]
# GitHub Mastery CLI - Ferramenta para operações GitHub
```

## 🎯 First Steps

### 1. Authenticate

```bash
# Verify your GitHub authentication
node cli-tools/gh-cli.js auth

# Expected output:
# ✅ Authentication successful!
# 👤 User: your-username
# 🔑 Rate limit: 5000/5000
```

### 2. Check Account Status

```bash
# Get account overview
node cli-tools/gh-cli.js status

# Shows:
# - User information
# - Repository count
# - Rate limits
# - API connectivity
```

### 3. List Your Repositories

```bash
# List your repositories
node cli-tools/gh-cli.js repos --limit 10

# With filters
node cli-tools/gh-cli.js repos --type public --sort updated
```

## 💡 Common Use Cases

### Repository Management

```bash
# Get repository details
node cli-tools/gh-cli.js repo owner repo-name

# Create new repository (interactive)
node cli-tools/gh-cli.js create-repo
```

### Issue Management

```bash
# List issues from a repository
node cli-tools/gh-cli.js issues owner repo-name

# Filter open issues only
node cli-tools/gh-cli.js issues owner repo-name --state open
```

### Webhook Server

```bash
# Start webhook server for real-time events
npm run webhook

# In development mode (auto-reload)
npm run dev
```

## 🔧 Development Commands

### Available Scripts

```bash
# Start CLI
npm start

# Run webhook server
npm run webhook

# Development mode
npm run dev

# Run example
npm run example

# Code quality
npm run lint
npm run format
npm run validate
```

### CLI Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `auth` | Verify authentication | `npm start auth` |
| `status` | Account overview | `npm start status` |
| `repos` | List repositories | `npm start repos --limit 10` |
| `repo` | Repository details | `npm start repo owner name` |
| `issues` | List issues | `npm start issues owner repo` |
| `create-repo` | Create repository | `npm start create-repo` |

## 🐛 Troubleshooting

### Common Issues

#### ❌ Authentication Failed
```bash
# Error: Request failed with status code 401
```
**Solution**: Check your GitHub token in `.env` file

#### ❌ Rate Limit Exceeded
```bash
# Error: API rate limit exceeded
```
**Solution**: Wait for rate limit reset or use authenticated requests

#### ❌ Command Not Found
```bash
# Error: node: command not found
```
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

#### ❌ Permission Denied
```bash
# Error: EACCES: permission denied
```
**Solution**: Check file permissions or run with appropriate privileges

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* node cli-tools/gh-cli.js auth

# Check environment variables
node -e "console.log(process.env.GITHUB_TOKEN ? 'Token set' : 'Token missing')"
```

## 📚 Next Steps

Now that you're set up, explore more features:

1. 📖 [**CLI Commands Reference**](./CLI.md)
2. 🔗 [**Webhook Setup Guide**](./WEBHOOKS.md)
3. 🔌 [**API Usage Examples**](../../examples/)
4. 🤝 [**Contributing Guide**](../../CONTRIBUTING.md)

## 💬 Need Help?

- 🐛 [Report issues](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues)
- 💬 [Start a discussion](https://github.com/NEO-SH1W4/GITHUB_MASTERY/discussions)
- 📖 [Check documentation](../../README.md)
- 🔍 [Search existing issues](https://github.com/NEO-SH1W4/GITHUB_MASTERY/issues?q=is%3Aissue)

---

<div align="center">

**Ready to master GitHub automation?** 🚀

[🏠 Homepage](https://github.com/NEO-SH1W4/GITHUB_MASTERY) • [📖 Full Documentation](../../README.md)

</div>

