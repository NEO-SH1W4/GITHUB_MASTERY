/**
 * Arquivo de carregamento de funções do GitHub Agent
 * Facilita o uso em perfis PowerShell ou outros contextos
 */

import chalk from 'chalk';
import {
    executeAutomatedContribution,
    executeDailyContribution,
    executeWeeklyContribution,
    showStatistics,
} from './commands.js';

// Registrar funções globalmente
global.gco = executeAutomatedContribution;
global.gcd = executeDailyContribution;
global.gcw = executeWeeklyContribution;
global.gcstats = showStatistics;

// Exibir mensagem de carregamento
console.log(chalk.green('GitHub Contribution functions loaded!'));
console.log('Available commands:');
console.log(`  ${chalk.cyan('gco')} 'message'  - Quick contribution`);
console.log(`  ${chalk.cyan('gcd')}            - Daily contribution`);
console.log(`  ${chalk.cyan('gcw')}            - Weekly automation`);
console.log(`  ${chalk.cyan('gcstats')}        - View statistics`);

// Exportar funções para uso em outros módulos
export {
    executeAutomatedContribution as gco,
    executeDailyContribution as gcd,
    executeWeeklyContribution as gcw,
    showStatistics as gcstats,
};
