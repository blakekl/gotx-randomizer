import { readFileSync, writeFileSync, rmSync } from 'node:fs';
const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const envPath = './scripts/.env'
require('dotenv').config({path: envPath});

const { MAX_COMPLETIONS, MAX_GAMES, MAX_NOMINATIONS, MAX_THEMES, MAX_USERS } = process.env;
const idRegex = /VALUES \((\d+)/;
const isIdGreater = (query: string, max: string = '0'): boolean => {
    const maxNumber = parseInt(max, 10);
    if(idRegex.test(query)) {
        const id = (query.match(idRegex) || ['0', '0'])[1];
        return parseInt(id, 10) > maxNumber;
    }
    return false;
}

const input = './dump.sql';
const output = './output.sql'

const result = readFileSync(input, {encoding:'utf-8'})
    .slice(1)
    .replace(/;\n+/g, ';\n')
    .split(';\n');
const initial = result
    .filter(x => x && !x.startsWith('INSERT'));
const streaks = result
    .filter(x => x && x.startsWith('INSERT INTO [public.streaks'));

const completions = result
    .filter(x => x && x.startsWith('INSERT INTO [public.completions'))
    .filter(x => isIdGreater(x, MAX_COMPLETIONS))
    .sort((a, b) => a.localeCompare(b));
const games = result
    .filter(x => x && x.startsWith('INSERT INTO [public.games'))
    .filter(x => isIdGreater(x, MAX_GAMES))
    .sort((a, b) => a.localeCompare(b));
const nominations = result
    .filter(x => x && x.startsWith('INSERT INTO [public.nominations'))
    .filter(x => isIdGreater(x, MAX_NOMINATIONS))
    .sort((a, b) => a.localeCompare(b));
const themes = result
    .filter(x => x && x.startsWith('INSERT INTO [public.themes'))
    .filter(x => isIdGreater(x, MAX_THEMES))
    .sort((a, b) => a.localeCompare(b));
const users = result
    .filter(x => x && x.startsWith('INSERT INTO [public.users'))
    .filter(x => isIdGreater(x, MAX_USERS))
    .sort((a, b) => a.localeCompare(b));


writeFileSync(output, 
[
    `-- Don't forget to update the gotm winners, if there are new winners.`,
    ...initial,
    ...users,
    ...games,
    ...themes,
    ...nominations,
    ...completions,
    ...streaks
].join(';\n'), {encoding: 'utf-8'});

console.log('Query generated. Please copy and execute the query on the DB to update.');
readline.question('Did it run successfully? Type \'yes\' to confirm.\n', (response: string) => {
    if (response.toLocaleLowerCase() === 'yes') {
        console.log('writing new env file.');
        const newMaxMap = new Map<string, number>();
        newMaxMap.set('MAX_COMPLETIONS', 
        completions.map(x => (x.match(idRegex) || ['0', '0'])[1])
            .map(x => parseInt(x, 10))
            .sort().pop() || 0);

        newMaxMap.set('MAX_GAMES', 
        games.map(x => (x.match(idRegex) || ['0', '0'])[1])
            .map(x => parseInt(x, 10))
            .sort().pop() || 0);

        newMaxMap.set('MAX_NOMINATIONS', 
        nominations.map(x => (x.match(idRegex) || ['0', '0'])[1])
            .map(x => parseInt(x, 10))
            .sort().pop() || 0);

        newMaxMap.set('MAX_THEMES', 
        themes.map(x => (x.match(idRegex) || ['0', '0'])[1])
            .map(x => parseInt(x, 10))
            .sort().pop() || 0);

        newMaxMap.set('MAX_USERS', 
        users.map(x => (x.match(idRegex) || ['0', '0'])[1])
            .map(x => parseInt(x, 10))
            .sort().pop() || 0);

        console.log('New Max Values:');
        const newEnv: string[] = [];
        newMaxMap.forEach((value, key) => newEnv.push(`${key}=${value}`));
        writeFileSync(`${envPath}-new`, newEnv.join('\n'));
        console.log('deleting files...');
        rmSync(output);
    }
    readline.close();
});