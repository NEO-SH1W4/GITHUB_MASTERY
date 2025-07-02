/**
 * Jest configuration for GitHub Mastery
 * 
 * @fileoverview Test configuration with ES modules support and coverage
 */

export default {
    // Test environment
    testEnvironment: 'node',
    
    // Test patterns - foco apenas em testes simples
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    
    // Desabilitar coverage por enquanto
    collectCoverage: false,
    
    // Verbose output
    verbose: true
};

