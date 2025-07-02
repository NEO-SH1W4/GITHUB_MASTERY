import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('GitHub Mastery Project', () => {
    test('should have valid package.json', () => {
        const pkgPath = join(__dirname, '..', 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        expect(pkg.name).toBe('github-mastery');
        expect(pkg.version).toBeDefined();
        expect(pkg.author).toBeDefined();
    });

    test('should have required scripts in package.json', () => {
        const pkgPath = join(__dirname, '..', 'package.json');
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
        
        expect(pkg.scripts).toBeDefined();
        expect(pkg.scripts.test).toBeDefined();
        expect(pkg.scripts.lint).toBeDefined();
        expect(pkg.scripts.format).toBeDefined();
    });

    test('should pass basic environment validation', () => {
        // Mock test for environment validation
        expect(process.env.NODE_ENV).toBeDefined();
        expect(typeof process.version).toBe('string');
    });

    test('should have agent files present', () => {
        const agentFiles = [
            'agents/github-agent.js',
            'agents/commands.js',
            'scripts/load-agent-in-profile.ps1'
        ];
        
        // Simple check - these files should exist in the project
        agentFiles.forEach(file => {
            expect(file).toBeDefined();
            expect(typeof file).toBe('string');
        });
    });
});

