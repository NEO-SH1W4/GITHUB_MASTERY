const { execSync } = require('child_process');

// Extensões de arquivos a serem formatados
const extensions = ['js', 'jsx', 'ts', 'tsx', 'json', 'md', 'html', 'css'];

try {
  // Executa o Prettier
  const command = `npx prettier --write "**/*.{${extensions.join(',')}}" \
    --ignore-path .prettierignore`;
  console.log('🔍 Executando Prettier...');
  execSync(command, { stdio: 'inherit' });
  console.log('✅ Formatação concluída com sucesso!');
} catch (error) {
  console.error('❌ Erro ao formatar arquivos:', error.message);
  process.exit(1);
}
