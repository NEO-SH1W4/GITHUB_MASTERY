# GitHub Mastery

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**通过API自动化、集成、Webhook和高级CLI工具实现GitHub完全掌控**

[🌐 **访问主页**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 葡萄牙语](../pt-br/README.md) | [🇪🇸 西班牙语](../es/README.md) | [🇨🇳 中文](./README.md) | [🇮🇳 印地语](../hi/README.md) | [🇯🇵 日语](../ja/README.md) | [🌍 阿拉伯语](../ar/README.md) | [🇩🇪 德语](../de/README.md) | [🇺🇸 英语](../../README.md)

</div>

## ✨ 主要特性

🔌 **GitHub API客户端**: 具有身份验证和智能速率限制的完整客户端  
⚡ **交互式CLI**: 具有直观提示的强大命令行工具  
🔗 **Webhook服务器**: 具有HMAC安全性的GitHub事件服务器  
🔄 **CI/CD管道**: 使用GitHub Actions的自动化工作流  
🛡️ **安全优先**: HMAC验证、令牌管理和最佳实践  
🎨 **丰富的用户体验**: 彩色输出和用户友好界面

## 🚀 快速安装

```bash
# 克隆并设置（HTTPS）
git clone https://github.com/NEO-SH1W4/github-mastery.git

# 或使用SSH
git clone git@github.com:NEO-SH1W4/github-mastery.git

# 安装依赖
cd github-mastery
npm install

# 配置环境
cp .env.example .env
# 将您的GitHub令牌添加到.env

# 查看主页（在浏览器中打开）
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# 启动CLI
npm start
```

## 💡 快速入门

### 1. 身份验证设置

```bash
# 验证GitHub身份验证
node cli-tools/gh-cli.js auth

# 检查账户状态
node cli-tools/gh-cli.js status
```

### 2. 仓库操作

```bash
# 列出仓库
node cli-tools/gh-cli.js repos --limit 10

# 获取仓库详情
node cli-tools/gh-cli.js repo owner repo-name

# 创建仓库（交互式）
node cli-tools/gh-cli.js create-repo
```

## 📚 文档

- 🌐 [**项目主页**](../../index.html)
- 🎯 [**落地页演示**](https://neo-sh1w4.github.io/github_mastery/)
- 📖 [**落地页指南**](../../LANDING_PAGE.md)
- 🏃‍♂️ [**快速入门指南**](./QUICKSTART.md)
- 🔌 [**API使用示例**](../../examples/)
- 🛠️ [**CLI命令参考**](./CLI.md)
- 🔗 [**Webhook设置指南**](./WEBHOOKS.md)
- 🤝 [**贡献指南**](../../CONTRIBUTING.md)
- 📋 [**更新日志**](../../CHANGELOG.md)

## 🤝 贡献

欢迎贡献！本项目旨在成为GitHub自动化的权威工具包。

1. 🍴 Fork项目
2. 🌟 创建您的功能分支
3. ✅ 添加测试（当可用时）
4. 📝 更新文档
5. 🚀 提交Pull Request

查看[完整贡献指南](../../CONTRIBUTING.md)。

## 📜 许可证

本项目采用MIT许可证 - 详见[LICENSE](../../LICENSE)文件。

## 🌟 致谢

为开发者社区用❤️构建。如果这个项目对您有帮助，请考虑给它一个⭐！

---

<div align="center">

**[🌐 本地主页](../../index.html) • [🎯 落地页](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 文档](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 问题](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 讨论](https://github.com/NEO-SH1W4/github-mastery/discussions)**

</div>
