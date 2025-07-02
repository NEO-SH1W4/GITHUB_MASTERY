// Simple CommonJS test file for CI/CD compatibility
const fs = require('fs');
const path = require('path');

describe('GitHub Mastery Project', () => {
  test('should have valid package.json', () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.name).toBe('github-mastery');
    expect(pkg.version).toBeDefined();
    expect(pkg.author).toBeDefined();
  });

  test('should have required scripts in package.json', () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.scripts).toBeDefined();
    expect(pkg.scripts.test).toBeDefined();
    expect(pkg.scripts.lint).toBeDefined();
    expect(pkg.scripts.format).toBeDefined();
  });

  test('should pass basic environment validation', () => {
    // Basic environment checks
    expect(process.version).toBeDefined();
    expect(typeof process.version).toBe('string');
    expect(process.platform).toBeDefined();
  });

  test('should have project structure', () => {
    const requiredDirs = ['api', 'agents', 'cli-tools'];

    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test('should have agent configuration files', () => {
    const agentFiles = ['scripts/load-agent-in-profile.ps1', 'agents/github-agent.js'];

    agentFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
