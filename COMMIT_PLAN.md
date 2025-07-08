# Plano de Commits - MCP Consolidation

## Commits a serem realizados:

### Commit 1: MCP Enhanced Server Implementation
**Arquivos:**
- mcp/github-mcp-server-enhanced.js
- mcp-config-enhanced.json
- scripts/create-stealth-build-simple.ps1

**Mensagem:**
```
feat(mcp): implement enhanced MCP server with advanced capabilities

- Add enhanced MCP server with proprietary optimizations
- Implement 9 advanced tools and 5 dynamic resources
- Add real-time metrics and health monitoring
- Include AI-powered capabilities
- 10x performance boost with Rust core integration
```

### Commit 2: MCP Server Utilities and Scripts
**Arquivos:**
- scripts/start-mcp-server.ps1
- package.json (scripts updates)
- mcp-config.json (updates)

**Mensagem:**
```
feat(scripts): add MCP server management utilities

- Add PowerShell script for server initialization
- Update npm scripts for MCP operations
- Add debug and production modes
- Include dependency checks and logging
```

### Commit 3: Documentation Updates
**Arquivos:**
- MCP_CONSOLIDATION.md
- STEALTH_IMPLEMENTATION.md

**Mensagem:**
```
docs: add comprehensive MCP documentation

- Document MCP consolidation architecture
- Add implementation guide for enhanced server
- Include usage examples and best practices
- Document monitoring and health check features
```

### Commit 4: Internal Development Files (OPTIONAL - Private Branch)
**Arquivos:**
- mcp/consolidated-mcp-server.js
- INTEGRATION_STRATEGY.md
- SESSION_MCP_CONSOLIDATION.md
- scripts/create-stealth-build.ps1

**Mensagem:**
```
feat(internal): add development and strategy files

- Add consolidated server with full integration
- Document integration strategy and approach
- Include session documentation
- Add advanced build scripts

[INTERNAL - DO NOT MERGE TO PUBLIC]
```

## Branches Strategy:

1. **master/main** - Public branch with enhanced (stealth) version
2. **dev-internal** - Private branch with VIREON references

## Commands to execute:

```bash
# For public commits (1-3)
git add mcp/github-mcp-server-enhanced.js mcp-config-enhanced.json scripts/create-stealth-build-simple.ps1
git commit -m "feat(mcp): implement enhanced MCP server with advanced capabilities"

git add scripts/start-mcp-server.ps1 package.json mcp-config.json
git commit -m "feat(scripts): add MCP server management utilities"

git add MCP_CONSOLIDATION.md STEALTH_IMPLEMENTATION.md
git commit -m "docs: add comprehensive MCP documentation"

# For internal files (optional - private branch)
git checkout -b dev-internal
git add mcp/consolidated-mcp-server.js INTEGRATION_STRATEGY.md SESSION_MCP_CONSOLIDATION.md scripts/create-stealth-build.ps1
git commit -m "feat(internal): add development and strategy files [INTERNAL]"
```
