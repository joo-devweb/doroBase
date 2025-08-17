import chalk from 'chalk';

const log = console.log;

export function info(text) {
    log(chalk.blue.bold('[INFO]'), text);
}

export function success(text) {
    log(chalk.green.bold('[SUCCESS]'), text);
}

export function error(text) {
    log(chalk.red.bold('[ERROR]'), text);
}

export function warn(text) {
    log(chalk.yellow.bold('[WARNING]'), text);
}

export function custom(text, color = 'white') {
    log(chalk[color](text));
}
