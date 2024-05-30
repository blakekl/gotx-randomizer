/**
 * Get game list queries.
 */
const coalescedTitle = `COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap, [public.games].title_other) AS title`;
export const getRetrobits = `SELECT
  *
FROM [public.games]
WHERE id in (SELECT game_id FROM [public.nominations] WHERE nomination_type = 'retro');`;

export const getRpgRunnerup = `SELECT
*
FROM [public.games]
WHERE id IN(SELECT game_id FROM [public.nominations] WHERE nomination_type = 'rpg') AND id NOT IN (
  SELECT game_id FROM [public.nominations] WHERE nomination_type = 'rpg' AND winner = 1
);`;

export const getWinningRpg = `SELECT
*
FROM [public.games]
WHERE id in (
  SELECT game_id FROM [public.nominations] WHERE nomination_type = 'rpg' AND winner = 1
);`;

export const getGotmRunnerup = `SELECT
*
FROM [public.games]
WHERE id IN(SELECT game_id FROM [public.nominations] WHERE nomination_type = 'gotm') AND id NOT IN (
  SELECT game_id FROM [public.nominations] WHERE nomination_type = 'gotm' AND winner = 1
);`;

export const getWinningGotm = `SELECT *
FROM [public.games]
WHERE id in (
  SELECT game_id FROM [public.nominations] WHERE nomination_type = 'gotm' AND winner = 1
);`;

export const getUserById = (id: number) => `SELECT *
FROM [public.users]
WHERE id = '${id}';`;

export const getNominations = `SELECT *
FROM [public.nominations];`;

export const getGotmNominations = `SELECT *
FROM [public.nominations]
WHERE nomination_type = 'gotm';`;

export const getRetrobitNominations = `SELECT *
FROM [public.nominations]
WHERE nomination_type = 'retro';`;

export const getRpgNominations = `SELECT *
FROM [public.nominations]
WHERE nomination_type = 'rpg';`;

export const getNominationData = `SELECT
  [public.nominations].nomination_type,
  game_id,
  [public.users].name as user_name,
  [public.nominations].description as game_description,
  [public.themes].title as theme_title,
  [public.themes].description as theme_description,
  date([public.themes].creation_date) as 'date',
  winner
FROM [public.nominations]
LEFT JOIN [public.users] ON [public.users].id = [public.nominations].user_id
LEFT JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
ORDER BY date([public.themes].creation_date) DESC;`;

export const getNominationDataByGameId = (game_id: number) => {
  return `SELECT
  ${coalescedTitle},
  [public.nominations].nomination_type,
  game_id,
  [public.users].name as user_name,
  [public.nominations].description as game_description,
  [public.themes].title as theme_title,
  [public.themes].description as theme_description,
  date([public.themes].creation_date) as 'date',
  winner
FROM [public.nominations]
INNER JOIN [public.users] ON [public.users].id = [public.nominations].user_id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
INNER JOIN [public.games] ON [public.games].id = [public.nominations].game_id
WHERE [public.nominations].game_id = ${game_id}
ORDER BY date([public.themes].creation_date) DESC;`;
};

export const getNominationDataByUserId = (user_id: number) => {
  return `SELECT
  ${coalescedTitle},
  [public.nominations].nomination_type,
  game_id,
  [public.users].name as user_name,
  [public.nominations].description as game_description,
  [public.themes].title as theme_title,
  [public.themes].description as theme_description,
  date([public.themes].creation_date) as 'date',
  winner
FROM [public.nominations]
INNER JOIN [public.users] on [public.users].id = [public.nominations].user_id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
INNER JOIN [public.games] ON [public.games].id = [public.nominations].game_id
WHERE [public.users].id = ${user_id}
ORDER BY date([public.themes].creation_date) DESC;`;
};

export const getCompletionsByUserId = (user_id: number) => {
  return `SELECT 
  [public.completions].id,
  title_world,
  title_usa,
  title_eu,
  title_jap,
  title_other,
  date(completed_at) as 'date',
  [public.nominations].nomination_type,
  [public.nominations].theme_id,
  [public.completions].retroachievements
FROM [public.completions]
INNER JOIN [public.users] ON [public.users].id = [public.completions].user_id
INNER JOIN [public.nominations] ON [public.nominations].id = [public.completions].nomination_id
INNER JOIN [public.games] ON [public.games].id = [public.nominations].game_id
WHERE [public.completions].user_id = ${user_id}
ORDER BY [public.completions].completed_at DESC;`;
};

/**
 * Statistical queries.
 */
export const mostCompletedGames = `SELECT
${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const mostCompletedGotmGames = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type in ('gotm')
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const mostCompletedRetrobitGames = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type IN ('retro')
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const mostCompletedRpgGames = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type IN ('rpg')
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const mostCompletedGotyGames = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type IN ('goty')
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const mostCompletedRetrobitYearGames = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.games]
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'gotwoty'
GROUP BY [public.nominations].game_id
ORDER BY completions DESC, title;`;

export const newestCompletions = `SELECT
 ${coalescedTitle},
  COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const newestRetrobitCompletions = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
WHERE [public.nominations].nomination_type = 'retro'
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const newestGotmCompletions = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
WHERE [public.nominations].nomination_type = 'gotm'
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const newestRpgCompletions = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
WHERE [public.nominations].nomination_type = 'rpg'
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const newestGotyCompletions = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
WHERE [public.nominations].nomination_type = 'goty'
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const newestGotwotyCompletions = `SELECT
 ${coalescedTitle},
COUNT(*) as completions
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.completions].nomination_id = [public.nominations].id
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
WHERE [public.nominations].nomination_type = 'gotwoty'
GROUP BY nomination_id
ORDER BY [public.themes].creation_date DESC;`;

export const totalNomsBeforeWinByGame = `SELECT
 ${coalescedTitle},
  COUNT(*) AS total
FROM [public.nominations]
INNER JOIN [public.games] on game_id = [public.games].id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm')
GROUP BY [public.nominations].game_id
ORDER BY total DESC, title;`;

export const avgNominationsBeforeWin = `
SELECT AVG(total) AS average FROM (SELECT
  SELECT ${coalescedTitle},
  COUNT(*) AS total
FROM [public.nominations]
INNER JOIN [public.games] on game_id = [public.games].id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm')
GROUP BY [public.nominations].game_id
ORDER BY total DESC);`;

export const topNominationWinsByUser = `SELECT
  [public.users].name,
  COUNT(*) AS wins
FROM [public.nominations]
INNER JOIN [public.users] ON [public.nominations].user_id = [public.users].id
WHERE nomination_type = 'gotm' AND winner = 1 AND user_id > 1
GROUP BY [public.nominations].user_id
ORDER BY wins DESC, [public.users].name ASC;`;

export const mostNominatedGames = `SELECT
  ${coalescedTitle},
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
WHERE [public.nominations].nomination_type = 'gotm'
GROUP BY game_id
ORDER BY nominations DESC, title;`;

export const mostNominatedLoserGames = `SELECT
 ${coalescedTitle},
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
WHERE [public.nominations].game_id NOT IN (SELECT [public.nominations].game_id FROM [public.nominations] WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm')
AND [public.nominations].nomination_type = 'gotm'
GROUP BY game_id
ORDER BY nominations DESC, title;`;

export const avgTimeToBeatByMonth = `SELECT
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  AVG(time_to_beat) AS average
FROM [public.games]
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY [public.themes].creation_date DESC;`;

export const totalTimeToBeatByMonth = `SELECT
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  SUM(time_to_beat) AS total
FROM [public.games]
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY [public.themes].creation_date DESC;`;

export const longestMonthsByAvgTimeToBeat = `SELECT
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  SUM(time_to_beat) AS total
FROM [public.games]
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY total DESC;`;

export const shortestMonthsByAvgTimeToBeat = `SELECT
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  SUM(time_to_beat) AS total
FROM [public.games]
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY total ASC;`;

export const mostNominatedGamesByUser = `SELECT
  [public.users].name,
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN [public.users] ON [public.nominations].user_id = [public.users].id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE [public.nominations].nomination_type = 'gotm') AND user_id > 1
GROUP BY [public.nominations].user_id
ORDER BY nominations DESC, name;`;

export const completionsCountByGame = `SELECT
 ${coalescedTitle},
  COUNT(*) AS completions,
  [public.nominations].theme_id,
  [public.nominations].nomination_type
FROM [public.completions]
INNER JOIN [public.nominations] ON [public.nominations].id = [public.completions].nomination_id
INNER JOIN [public.games] on [public.nominations].game_id = [public.games].id
GROUP BY [public.completions].nomination_id
ORDER BY [public.nominations].theme_id DESC, completions DESC;`;

export const nominationSuccessPercentByUser = `SELECT 
  [public.users].id,
  [public.users].name,
  (100 * SUM([public.nominations].winner) / COUNT([public.nominations].id)) as success_rate,
  COUNT([public.nominations].id) as nominations,
  SUM([public.nominations].winner) as wins
FROM
  [public.users]
INNER JOIN [public.nominations] ON [public.users].id = [public.nominations].user_id
WHERE [public.nominations].nomination_type='gotm' AND [public.users].id > 1
GROUP BY [public.users].id
ORDER BY success_rate DESC, [public.users].name ASC;`;
