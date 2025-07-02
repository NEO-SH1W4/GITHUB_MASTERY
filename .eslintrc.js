module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Estilo de código
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        
        // Boas práticas
        'no-unused-vars': 'error',
        'no-console': 'warn',
        'prefer-const': 'error',
        'no-var': 'error',
        
        // Complexidade
        'max-len': ['warn', { 'code': 100 }],
        'complexity': ['warn', 10],
        'max-depth': ['warn', 4],
        
        // Documentação
        'require-jsdoc': ['warn', {
            'require': {
                'FunctionDeclaration': true,
                'MethodDefinition': true,
                'ClassDeclaration': true
            }
        }]
    }
};

