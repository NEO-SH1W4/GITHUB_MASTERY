# GitHub Mastery

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-stable-brightgreen.svg)
![GitHub Release](https://img.shields.io/badge/release-v1.1.0-orange.svg)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

**Vollständige GitHub-Beherrschung durch API-Automatisierung, Integrationen, Webhooks und fortgeschrittene CLI-Tools**

[🌐 **Homepage besuchen**](https://neo-sh1w4.github.io/github_mastery/) | [🇧🇷 Portugiesisch](../pt-br/README.md) | [🇪🇸 Spanisch](../es/README.md) | [🇨🇳 Chinesisch](../zh/README.md) | [🇮🇳 Hindi](../hi/README.md) | [🇯🇵 Japanisch](../ja/README.md) | [🌍 Arabisch](../ar/README.md) | [🇩🇪 Deutsch](./README.md) | [🇺🇸 Englisch](../../README.md)

</div>

## ✨ Hauptfunktionen

🔌 **GitHub API-Client**: Vollständiger Client mit Authentifizierung und intelligenter Ratenbegrenzung  
⚡ **Interaktive CLI**: Leistungsstarke Kommandozeilen-Tools mit intuitiven Prompts  
🔗 **Webhook-Server**: Robuster GitHub-Event-Server mit HMAC-Sicherheit  
🔄 **CI/CD-Pipeline**: Automatisierte Workflows mit GitHub Actions  
🛡️ **Sicherheit zuerst**: HMAC-Verifizierung, Token-Management und Best Practices  
🎨 **Reichhaltige UX**: Farbige Ausgaben und benutzerfreundliche Schnittstellen

## 🚀 Schnellinstallation

```bash
# Klonen und Einrichten (HTTPS)
git clone https://github.com/NEO-SH1W4/github-mastery.git

# Oder mit SSH
git clone git@github.com:NEO-SH1W4/github-mastery.git

# Abhängigkeiten installieren
cd github-mastery
npm install

# Umgebung konfigurieren
cp .env.example .env
# Fügen Sie Ihren GitHub-Token zu .env hinzu

# Homepage anzeigen (im Browser öffnen)
start index.html  # Windows
# open index.html  # macOS
# xdg-open index.html  # Linux

# CLI starten
npm start
```

## 💡 Schnellstart

### 1. Authentifizierung einrichten

```bash
# GitHub-Authentifizierung überprüfen
node cli-tools/gh-cli.js auth

# Kontostatus überprüfen
node cli-tools/gh-cli.js status
```

### 2. Repository-Operationen

```bash
# Repositories auflisten
node cli-tools/gh-cli.js repos --limit 10

# Repository-Details abrufen
node cli-tools/gh-cli.js repo owner repo-name

# Repository erstellen (interaktiv)
node cli-tools/gh-cli.js create-repo
```

## 📚 Dokumentation

- 🌐 [**Projekt-Homepage**](../../index.html)
- 🎯 [**Landing Page Demo**](https://neo-sh1w4.github.io/github_mastery/)
- 📖 [**Landing Page Anleitung**](../../LANDING_PAGE.md)
- 🏃‍♂️ [**Schnellstart-Anleitung**](./QUICKSTART.md)
- 🔌 [**API-Nutzungsbeispiele**](../../examples/)
- 🛠️ [**CLI-Befehlsreferenz**](./CLI.md)
- 🔗 [**Webhook-Einrichtungsanleitung**](./WEBHOOKS.md)
- 🤝 [**Beitragsrichtlinien**](../../CONTRIBUTING.md)
- 📋 [**Änderungsprotokoll**](../../CHANGELOG.md)

## 🤝 Mitwirken

Beiträge sind willkommen! Dieses Projekt strebt danach, das ultimative Toolkit für GitHub-Automatisierung zu werden.

1. 🍴 Projekt forken
2. 🌟 Feature-Branch erstellen
3. ✅ Tests hinzufügen (wenn verfügbar)
4. 📝 Dokumentation aktualisieren
5. 🚀 Pull Request öffnen

Siehe die [vollständige Beitragsanleitung](../../CONTRIBUTING.md).

## 📜 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](../../LICENSE)-Datei für Details.

## 🌟 Danksagung

Mit ❤️ für die Entwickler-Community gebaut. Wenn dieses Projekt Ihnen geholfen hat, erwägen Sie bitte, ihm einen ⭐ zu geben!

---

<div align="center">

**[🌐 Lokale Homepage](../../index.html) • [🎯 Landing Page](https://neo-sh1w4.github.io/github_mastery/) • [🏠 GitHub](https://github.com/NEO-SH1W4/github-mastery) • [📖 Dokumentation](https://github.com/NEO-SH1W4/github-mastery#readme) • [🐛 Probleme](https://github.com/NEO-SH1W4/github-mastery/issues) • [💬 Diskussionen](https://github.com/NEO-SH1W4/github-mastery/discussions)**

</div>

