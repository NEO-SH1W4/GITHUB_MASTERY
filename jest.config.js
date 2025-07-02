/**
 * Jest configuration for GitHub Mastery
 *
 * @fileoverview Test configuration with ES modules support and coverage
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',

    // Test patterns - foco apenas em testes simples
    testMatch: ['**/tests/**/*.test.js'],

    // Habilitar coverage
    collectCoverage: true,

    // Verbose output
    verbose: true,

    // Suporte a ES Modules com Babel
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
};
