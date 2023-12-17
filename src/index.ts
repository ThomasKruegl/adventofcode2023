import { Command, Argument, InvalidArgumentError } from 'commander';

const program = new Command();

export type Part = 1 | 2;

program
    .name('aoc')
    .description('CLI to start different challenges of advent of code 2023');

program.command('run')
    .description('start different challenges of advent of code 2023')
    .argument('<day>', 'day to start', parseDay)
    .addArgument(new Argument('[part]', '1 or 2, the first or second part of the challenge of given day').choices(['1', '2']).default('1'))
    .action(async (day: number, part: string) => {
        console.log(typeof day);
        const moduleName = './day' + day + '/index.js';
        const module = await import(moduleName);
        module.run(+part);
    });

function parseDay(dayString: string): number {
    const day = parseInt(dayString, 10);
    if (isNaN(day) || day < 1 || day > 24) {
        throw new InvalidArgumentError('Day has to be between 1 and 24.');
    }
    return day;
}

program.parse();
