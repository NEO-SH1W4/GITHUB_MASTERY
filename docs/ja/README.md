# GitHub Mastery

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**APIの自動化、統合、Webhook、高度なCLIツールによるGitHubの完全な習得**

[🌐 **ホームページ**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 ポルトガル語](../pt-br/README.md) | [🇪🇸 スペイン語](../es/README.md) | [🇨🇳 中国語](../zh/README.md) | [🇮🇳 ヒンディー語](../hi/README.md) | [🇯🇵 日本語](./README.md) | [🌍 アラビア語](../ar/README.md) | [🇩🇪 ドイツ語](../de/README.md) | [🇺🇸 英語](../../README.md)

</div>

## ✨ 主な機能

🔌 **GitHub APIクライアント**: 認証とスマートレート制限を備えた完全なクライアント  
⚡ **インタラクティブCLI**: 直感的なプロンプトを備えた強力なコマンドラインツール  
🔗 **Webhookサーバー**: HMAC セキュリティを備えた堅牢なGitHubイベントサーバー  
🔄 **CI/CDパイプライン**: GitHub Actionsによる自動化ワークフロー  
🛡️ **セキュリティ重視**: HMAC検証、トークン管理、ベストプラクティス  
🎨 **豊富なUX**: カラフルな出力とユーザーフレンドリーなインターフェース

## 🚀 クイックインストール

```bash
# クローンとセットアップ（HTTPS）
git clone https://github.com/NEO-SH1W4/github-mastery.git

# または SSH を使用
git clone git@github.com:NEO-SH1W4/github-mastery.git

# 依存関係のインストール
cd github-mastery
npm install

# 環境の設定
cp .env.example .env
# GitHubトークンを.envに追加

# ホームページを表示（ブラウザで開く）
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# CLIの起動
npm start
```

## 💡 クイックスタート

### 1. 認証設定

```bash
# GitHub認証の確認
node cli-tools/gh-cli.js auth

# アカウントステータスの確認
node cli-tools/gh-cli.js status
```

### 2. リポジトリ操作

```bash
# リポジトリの一覧表示
node cli-tools/gh-cli.js repos --limit 10

# リポジトリの詳細を取得
node cli-tools/gh-cli.js repo owner repo-name

# リポジトリの作成（インタラクティブ）
node cli-tools/gh-cli.js create-repo
```

## 📚 ドキュメント

- 🌐 [**プロジェクトホームページ**](../../index.html)
- 🎯 [**ランディングページデモ**](https://neo-sh1w4.github.io/github_mastery/)
- 📖 [**ランディングページガイド**](../../LANDING_PAGE.md)
- 🏃‍♂️ [**クイックスタートガイド**](./QUICKSTART.md)
- 🔌 [**API使用例**](../../examples/)
- 🛠️ [**CLIコマンドリファレンス**](./CLI.md)
- 🔗 [**Webhookセットアップガイド**](./WEBHOOKS.md)
- 🤝 [**貢献ガイド**](../../CONTRIBUTING.md)
- 📋 [**変更履歴**](../../CHANGELOG.md)

## 🤝 貢献

貢献を歓迎します！このプロジェクトはGitHub自動化の決定的なツールキットになることを目指しています。

1. 🍴 プロジェクトをフォーク
2. 🌟 機能ブランチを作成
3. ✅ テストを追加（利用可能な場合）
4. 📝 ドキュメントを更新
5. 🚀 プルリクエストを作成

[完全な貢献ガイド](../../CONTRIBUTING.md)をご覧ください。

## 📜 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](../../LICENSE)ファイルをご覧ください。

## 🌟 謝辞

開発者コミュニティのために❤️を込めて作られました。このプロジェクトが役立った場合は、⭐をつけることを検討してください！

---

<div align="center">

**[🌐 ローカルホームページ](../../index.html) • [🎯 ランディングページ](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 ドキュメント](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 課題](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 ディスカッション](https://github.com/NEO-SH1W4/github-mastery/discussions)**

</div>

