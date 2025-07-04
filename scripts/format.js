const { execSync } = require('child_process');
const path = require('path');

// Extensões de arquivos a serem formatados
const extensions = ['js', 'jsx', 'ts', 'tsx', 'json', 'md', 'html', 'css'];

// Lista de diretórios a ignorar
const ignoreDirs = ['node_modules', 'dist', 'build', '.git'];

try {
  // Executa o Prettier
  const command = `npx prettier --write "**/*.{${extensions.join(',')}}" --ignore-path .prettierignore`;
  console.log('🔍 Executando Prettier...');
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Formatação concluída com sucesso!');
} catch (error) {
  console.error('❌ Erro ao formatar arquivos:', error.message);
  process.exit(1);
}
