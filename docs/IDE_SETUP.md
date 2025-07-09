# Guia de Configuração de IDEs

Este documento apresenta passos recomendados para configurar diferentes IDEs ao trabalhar com o projeto **GitHub Mastery**.

## JetBrains IDEs (WebStorm, IntelliJ, PyCharm)

1. Instale o plugin **GitHub** para integração com issues e pull requests.
2. Habilite o plugin **Node.js** para suporte completo a JavaScript/TypeScript.
3. Utilize o plugin **Docker** se precisar executar containers localmente.
4. Em `Editor > Code Style`, defina a indentação para **2 espaços**.
5. Ative a formatação automática com **Prettier** em `Preferences > Tools > Prettier`.

## Visual Studio

1. Instale o workload **Node.js development** via Visual Studio Installer.
2. Ative a **GitHub Extension for Visual Studio** para clonar e revisar PRs.
3. Configure `Tools > Options > Text Editor > JavaScript/TypeScript` para usar **Prettier** e **ESLint**.
4. Recomenda-se o plugin **Docker Tools** para gerenciamento de containers.

## Outros Editores

- Garanta formatação consistente com **Prettier** e **ESLint**.
- Habilite a formatação ao salvar para evitar divergências de estilo.
- Utilize integrações de Git disponíveis para agilizar o fluxo de trabalho.

---

_Documento criado em: 2025-07-02_
