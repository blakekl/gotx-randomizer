import BetterSQLite3 from 'better-sqlite3';
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
  COMPLETIONS = 'completions',
  GAMES = 'games',
  NOMINATIONS = 'nominations',
  THEMES = 'themes',
  USERS = 'users',
}

const dbPath = './src/gotx-randomizer.sqlite';
const db = new BetterSQLite3(dbPath);

process.on('exit', () => db.close());
process.on('SIGINT', () => db.close());
process.on('SIGHUP', () => db.close());
process.on('SIGTERM', () => db.close());

// Retrieve latest dump
console.log('Retrieving latest PostgreSQL dump...');
console.log('executing file:', RETRIEVE_DUMP);
console.log(child.execFileSync(RETRIEVE_DUMP as string, { encoding: 'utf-8' }));

// Read dump and build full statements
const dumpContent = readFileSync(DUMP_PATH as string, { encoding: 'utf-8' });
const lines = dumpContent
  .replace(/\r\n/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('--') && !l.startsWith('/*'));

const allStatements: string[] = [];
let current = '';
for (const line of lines) {
  current += line + ' ';
  if (line.endsWith(');')) {
    allStatements.push(current.trim());
    current = '';
  }
}

// Filter to INSERT statements
const insertStatements = allStatements.filter(s => s.startsWith('INSERT INTO'));

console.log('Full statements detected:', allStatements.length);
console.log('INSERT statements detected:', insertStatements.length);
console.log('Sample INSERT:', insertStatements[0]?.substring(0, 200) + '...' || 'NONE');

// Helper: Get statements for a table
const getInsertStatements = (tableName: string) =>
  insertStatements
    .filter(line => line.includes(`[public.${tableName}]`))
    .sort((a, b) => a.localeCompare(b));

// Collect
const statementsByTable: Record<string, string[]> = {
  [Tables.COMPLETIONS]: getInsertStatements(Tables.COMPLETIONS),
  [Tables.GAMES]: getInsertStatements(Tables.GAMES),
  [Tables.NOMINATIONS]: getInsertStatements(Tables.NOMINATIONS),
  [Tables.THEMES]: getInsertStatements(Tables.THEMES),
  [Tables.USERS]: getInsertStatements(Tables.USERS),
};

console.log('Detected statements per table:', 
  Object.fromEntries(Object.entries(statementsByTable).map(([k, v]) => [k, v.length])));

// Extract IDs for deletes
const extractIdsFromDump = (lines: string[]): number[] => {
  const ids: Set<number> = new Set();
  lines.forEach(line => {
    const matches = line.matchAll(/VALUES\s*\(\s*(\d+)/g);
    Array.from(matches).forEach(m => ids.add(parseInt(m[1], 10)));
  });
  return Array.from(ids).sort((a, b) => a - b);
};

const getCurrentIds = (tableName: string): number[] => {
  try {
    const stmt = db.prepare(`SELECT id FROM [public.${tableName}]`);
    return (stmt.all() as { id: number }[]).map(r => r.id).sort((a, b) => a - b);
  } catch {
    return [];
  }
};

// Build deletes
const deleteQueries: string[] = [];
Object.values(Tables).forEach(tableName => {
  const dumpIds = extractIdsFromDump(statementsByTable[tableName]);
  const currentIds = getCurrentIds(tableName);
  const obsolete = currentIds.filter(id => !dumpIds.includes(id));
  if (obsolete.length > 0) {
    deleteQueries.push(`DELETE FROM [public.${tableName}] WHERE id IN (${obsolete.join(',')})`);
    console.log(`Will remove ${obsolete.length} obsolete rows from ${tableName}`);
  }
});

// Build upserts
const upsertStatements: string[] = [];
Object.entries(statementsByTable).forEach(([tableName, lines]) => {
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && trimmed.startsWith('INSERT INTO')) {
      const upsertLine = trimmed.replace(/^INSERT INTO/, 'INSERT OR REPLACE INTO');
      upsertStatements.push(`${upsertLine};`);
    }
  });
});

const allQueriesToRun = [...upsertStatements, ...deleteQueries];

console.log('\nProcessing dump data...');
console.log(`Will execute ${allQueriesToRun.length} queries (upserts + deletes)`);

if (allQueriesToRun.length === 0) {
  console.log('No changes detected in dump.');
  db.close();
  process.exit(0);
}

// Counts
const getCounts = () => ({
  nominations: db.prepare('SELECT COUNT(*) as count FROM [public.nominations]').get() as { count: number },
  games: db.prepare('SELECT COUNT(*) as count FROM [public.games]').get() as { count: number },
  themes: db.prepare('SELECT COUNT(*) as count FROM [public.themes]').get() as { count: number },
  users: db.prepare('SELECT COUNT(*) as count FROM [public.users]').get() as { count: number },
  winners: db.prepare('SELECT COUNT(*) as count FROM [public.nominations] WHERE winner = 1').get() as { count: number },
});

const beforeCounts = getCounts();
console.log('Before update:', beforeCounts);

console.log('\nExecuting in transaction...');

db.transaction(() => {
  allQueriesToRun.forEach(sql => {
    try {
      db.exec(sql);
    } catch (err) {
      console.error('Error executing:');
      console.error(sql.substring(0, 500) + '...');
      console.error(err);
      process.exit(1);
    }
  });
})();

const afterCounts = getCounts();
console.log('After update:', afterCounts);

// Integrity checks
const checks = [
  { name: 'nominations', before: beforeCounts.nominations.count, after: afterCounts.nominations.count, threshold: 0.8 },
  { name: 'games', before: beforeCounts.games.count, after: afterCounts.games.count, threshold: 0.95 },
  { name: 'themes', before: beforeCounts.themes.count, after: afterCounts.themes.count, threshold: 0.95 },
  { name: 'users', before: beforeCounts.users.count, after: afterCounts.users.count, threshold: 0.95 },
  { name: 'winners', before: beforeCounts.winners.count, after: afterCounts.winners.count, threshold: 0.7 },
];

let failed = false;
checks.forEach(({ name, before, after, threshold }) => {
  const ratio = after / (before || 1);
  if (ratio < threshold) {
    console.error(`❌ ${name} dropped too much: ${before} → ${after} (${(ratio * 100).toFixed(1)}%)`);
    failed = true;
  } else {
    console.log(`✅ ${name}: ${before} → ${after} (${(ratio * 100).toFixed(1)}%)`);
  }
});

if (failed) {
  console.error('🚨 Integrity check failed');
  db.close();
  process.exit(1);
}

console.log('✅ Integrity validation passed');
console.log('Sync completed successfully');

db.close();
process.exit(0);
