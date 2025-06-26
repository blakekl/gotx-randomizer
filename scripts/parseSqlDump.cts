import BetterSQLite3 from 'better-sqlite3';
type Database = BetterSQLite3.Database;
type Statement = BetterSQLite3.Statement;
import * as child from 'child_process';
import { readFileSync } from 'node:fs';
import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/../.env` });

const {
  RETRIEVE_DUMP,
  DUMP_PATH,
  SERVER_NAME,
  SERVER_HOST,
  PORT,
  DB_USER,
  DATABASE,
} = process.env;

const requiredEnvVars = {
  RETRIEVE_DUMP,
  DUMP_PATH,
  SERVER_NAME,
  SERVER_HOST,
  PORT,
  DB_USER,
  DATABASE,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(`Missing environment variables: ${missingVars.join(', ')}`);
  console.error('Please see .env.example');
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
const MAX_IDS = new Map<Tables, number>();

// First, get the latest postgres db dump.
console.log('Retrieving latest PostgreSQL dump...');
console.log('executing file: ', RETRIEVE_DUMP);
// Assert that RETRIEVE_DUMP is defined since we checked earlier
console.log(child.execFileSync(RETRIEVE_DUMP as string, { encoding: 'utf-8' }));

const db = new BetterSQLite3(dbPath);
process.on('exit', () => db.close());
process.on('SIGINT', () => db.close());
process.on('SIGHUP', () => db.close());
process.on('SIGTERM', () => db.close());

const queries: Map<Tables, BetterSQLite3.Statement> = new Map([
  [
    Tables.COMPLETIONS,
    db.prepare(`SELECT MAX(id) as max FROM [public.completions];`),
  ],
  [Tables.GAMES, db.prepare(`SELECT MAX(id) as max FROM [public.games];`)],
  [
    Tables.NOMINATIONS,
    db.prepare(`SELECT MAX(id) as max FROM [public.nominations];`),
  ],
  [Tables.THEMES, db.prepare(`SELECT MAX(id) as max FROM [public.themes];`)],
  [Tables.USERS, db.prepare(`SELECT MAX(id) as max FROM [public.users];`)],
]);

console.log('Getting current max IDs from local database...');
queries.forEach((query, table) => {
  const [{ max }] = query.all() as MaxQueryResult[];
  const maxValue = max || 0;
  MAX_IDS.set(table, maxValue);
  console.log(`${Tables[table].toLowerCase()}: ${maxValue}`);
});

const isIdGreater = (query: string, table: Tables): boolean => {
  if (idRegex.test(query)) {
    const max = MAX_IDS.get(table) ?? 0;
    const id = (query.match(idRegex) || ['0', '0'])[1];
    return parseInt(id, 10) > max;
  }
  return false;
};

const allNominationsQuery = db.prepare('SELECT id FROM [public.nominations]');
const currentNominationIds = (allNominationsQuery.all() as IdQueryResult[])
  .map((x) => x.id)
  .sort();

// Assert that DUMP_PATH is defined since we checked earlier
const dumpContent = readFileSync(DUMP_PATH as string, { encoding: 'utf-8' });
const inputData = dumpContent
  .substring(1) // Use substring instead of slice to avoid Buffer.slice deprecation
  .replace(/;\n+/g, ';\n')
  .split(';\n');

const filterTableData = (tableName: string, table: Tables) =>
  inputData
    .filter((x) => x && x.startsWith(`INSERT INTO [public.${tableName}`))
    .filter((x) => isIdGreater(x, table))
    .sort((a, b) => a.localeCompare(b));

const completions = filterTableData('completions', Tables.COMPLETIONS);
const games = filterTableData('games', Tables.GAMES);
const nominations = filterTableData('nominations', Tables.NOMINATIONS);
const themes = filterTableData('themes', Tables.THEMES);
const users = filterTableData('users', Tables.USERS);

const validNominationIds = inputData
  .filter((x) => x && x.startsWith('INSERT INTO [public.nominations'))
  .map((x) => (x.match(idRegex) || ['0', '0'])[1])
  .map((x) => parseInt(x, 10))
  .sort();
const removeNominations = currentNominationIds
  .filter((x) => !validNominationIds.includes(x))
  .sort();
const removeNominationsQuery =
  removeNominations.length > 0
    ? `DELETE FROM [public.nominations] WHERE ID IN (${removeNominations.join()})`
    : null;
console.log('\nProcessing dump data...');
console.log(
  `Found: ${users.length} users, ${games.length} games, ${themes.length} themes, ${nominations.length} nominations, ${completions.length} completions`,
);
if (removeNominations.length > 0) {
  console.log(`Will remove ${removeNominations.length} obsolete nominations`);
}

const toExecute = [
  ...users,
  ...games,
  ...themes,
  ...nominations,
  ...completions,
  removeNominationsQuery,
]
  .filter((x) => x !== null)
  .map((x) => `${x};`);

if (toExecute.length <= 0) {
  console.error('No queries to execute. Do not commit/publish.');
  process.exit(1);
}

console.log('\nExecuting queries...');
if (process.env.DEBUG) {
  toExecute.forEach((x) => console.log(x));
}

console.log(`Executing ${toExecute.length} queries in transaction...`);
const preparedQueries = toExecute.map((x) => db.prepare(x));
db.transaction((queries: BetterSQLite3.Statement[]) =>
  queries.forEach((query, index) => {
    try {
      return query.run();
    } catch (e) {
      console.error(`Error executing query ${index + 1}:`);
      console.error(toExecute[index]);
      console.error(e);
      db.close();
      process.exit(1);
    }
  }),
).deferred(preparedQueries);
console.log('Execution successful');
db.close();
process.exit();
