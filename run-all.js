/**
 * Script para iniciar todos os servidores necessários
 * - Servidor de API REST simplificado (porta 3001)
 * - Servidor web para a homepage (porta 8080)
 */

import { spawn } from 'child_process';
import { join } from 'path';

// Função para iniciar um processo Node.js
function startNodeProcess(scriptPath, name) {
    console.log(`Iniciando ${name}...`);

    const process = spawn('node', [scriptPath], {
        stdio: 'inherit',
        shell: true,
    });

    process.on('error', error => {
        console.error(`Erro ao iniciar ${name}:`, error);
    });

    return process;
}

// Iniciar servidor API
const apiProcess = startNodeProcess(
    join(process.cwd(), 'api', 'simple-rest-server.js'),
    'Servidor API REST'
);

// Iniciar servidor Web
const webProcess = startNodeProcess(
    join(process.cwd(), 'serve-homepage.js'),
    'Servidor Web'
);

// Tratar encerramento gracioso
process.on('SIGINT', () => {
    console.log('\nEncerrando todos os serviços...');

    apiProcess.kill();
    webProcess.kill();

    setTimeout(() => {
        console.log('Todos os serviços encerrados.');
        process.exit(0);
    }, 1000);
});

console.log('\nPressione Ctrl+C para encerrar todos os serviços.');
console.log('\nAcesse a homepage dinâmica em: http://localhost:8080');
