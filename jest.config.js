/**
 * Jest configuration for GitHub Mastery
 * 
 * @fileoverview Test configuration with ES modules support and coverage
 */

export default {
    // Test environment
    testEnvironment: 'node',
    
    // ES modules support
    preset: 'es6',
    extensionsToTreatAsEsm: ['.js'],
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    moduleNameMapping: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    
    // Test patterns
    testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)+(spec|test).js'
    ],
    
    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        'api/**/*.js',
        'cli-tools/**/*.js',
        'webhooks/**/*.js',
        'utils/**/*.js',
        '!**/__tests__/**',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    
    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    
    // Verbose output
    verbose: true,
    
    // Transform files
    transform: {}
};

