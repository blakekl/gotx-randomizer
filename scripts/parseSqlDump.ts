import Database, { RunResult, Statement } from 'better-sqlite3';
import * as child from 'child_process';
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
dotenv.config();
const { 
    RETRIEVE_DUMP,
    DUMP_PATH,
    SERVER_NAME,
    SERVER_HOST,
    PORT,
    USER: DB_USER,
    DATABASE,
} = process.env;

if (
    !RETRIEVE_DUMP 
    || !DUMP_PATH 
    || !SERVER_NAME
    || !SERVER_HOST
    || !PORT
    || !DB_USER
    || !DATABASE
){
    console.error('environment variables missing. Please see .env.example');
    process.exit(1);
}

enum Tables {
    COMPLETIONS,
    GAMES,
    NOMINATIONS,
    THEMES,
    USERS,
}

interface MaxQueryResult {
    max: number;
}

interface IdQueryResult {
    id: number;
}

const idRegex = /VALUES \((\d+)/;
const dbPath = './src/gotx-randomizer.sqlite';
const MAX_IDS = new Map<Tables, number>;

// First, get the latest postgres db dump.
console.log('executing file: ', RETRIEVE_DUMP);
console.log(child.execFileSync(RETRIEVE_DUMP, {encoding: 'utf-8'}));

const db = new Database(dbPath);
process.on('exit', () => db.close());
process.on('SIGINT', () => db.close());
process.on('SIGHUP', () => db.close());
process.on('SIGTERM', () => db.close());

const queries: Map<Tables, Statement<MaxQueryResult[]>> = new Map([
    [Tables.COMPLETIONS, db.prepare(`SELECT MAX(id) as max FROM [public.completions];`)],
    [Tables.GAMES, db.prepare(`SELECT MAX(id) as max FROM [public.games];`)],
    [Tables.NOMINATIONS, db.prepare(`SELECT MAX(id) as max FROM [public.nominations];`)],
    [Tables.THEMES, db.prepare(`SELECT MAX(id) as max FROM [public.themes];`)],
    [Tables.USERS, db.prepare(`SELECT MAX(id) as max FROM [public.users];`)],
])

queries.forEach((query, table) => {
    const [{max}] = query.all() as MaxQueryResult[];
    const maxValue = max || 0;
    MAX_IDS.set(table, maxValue);
})

const isIdGreater = (query: string, table: Tables): boolean => {
    if(idRegex.test(query)) {
        const max = MAX_IDS.get(table) ?? 0;
        const id = (query.match(idRegex) || ['0', '0'])[1];
        return parseInt(id, 10) > max;
    }
    return false;
}

const allNominationsQuery = db.prepare<IdQueryResult[]>('SELECT id FROM [public.nominations]');
const currentNominationIds = (allNominationsQuery.all() as IdQueryResult[]).map(x => x.id).sort();

const inputData = readFileSync(DUMP_PATH, {encoding:'utf-8'})
    .slice(1)
    .replace(/;\n+/g, ';\n')
    .split(';\n');
const completions = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.completions'))
    .filter(x => isIdGreater(x, Tables.COMPLETIONS))
    .sort((a, b) => a.localeCompare(b))
    .map(x => `${x};`)
    .map(x => db.prepare(x));
const games = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.games'))
    .filter(x => isIdGreater(x, Tables.GAMES))
    .sort((a, b) => a.localeCompare(b))
    .map(x => `${x};`)
    .map(x => db.prepare(x));
const nominations = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.nominations'))
    .filter(x => isIdGreater(x, Tables.NOMINATIONS))
    .sort((a, b) => a.localeCompare(b))
    .map(x => `${x};`)
    .map(x => db.prepare(x));
const validNominationIds = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.nominations'))
    .map(x => (x.match(idRegex) || ['0', '0'])[1])
    .map(x => parseInt(x, 10))
    .sort();
const themes = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.themes'))
    .filter(x => isIdGreater(x, Tables.THEMES))
    .sort((a, b) => a.localeCompare(b))
    .map(x => `${x};`)
    .map(x => db.prepare(x));
const users = inputData
    .filter(x => x && x.startsWith('INSERT INTO [public.users'))
    .filter(x => isIdGreater(x, Tables.USERS))
    .sort((a, b) => a.localeCompare(b))
    .map(x => `${x};`)
    .map(x => db.prepare(x));
const removeNominationIds = currentNominationIds.filter(x => validNominationIds.indexOf(x) === -1).sort();
const removeNominations = db.prepare(`DELETE FROM [public.nominations] WHERE ID IN (${removeNominationIds})`);
const toExecute = [
    ...users,
    ...games,
    ...themes,
    ...nominations,
    ...completions,
    removeNominations,
];

console.log(`Updating ${toExecute.length} records.`);
db.transaction((queries: Statement[]) => queries.forEach(query => query.run()))
    .deferred(toExecute);
console.log('Execution successful');
db.close();
process.exit();