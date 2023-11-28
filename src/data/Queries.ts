/**
 * Get game list queries.
 */
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
LEFT JOIN [public.users] on [public.users].id = [public.nominations].user_id 
LEFT JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id
ORDER BY date([public.themes].creation_date) DESC;`;

export const getNominationDataByGameId = (game_id: number) => {
  return `SELECT 
  [public.users].name, 
  [public.nominations].description as game_description, 
  [public.themes].title,
  [public.themes].description, 
  date([public.themes].creation_date) as 'date' 
FROM [public.nominations] 
INNER JOIN [public.users] on [public.users].id = [public.nominations].user_id 
INNER JOIN [public.themes] ON [public.nominations].theme_id = [public.themes].id 
WHERE [public.nominations].game_id = ${game_id}
ORDER BY date([public.themes].creation_date) DESC;`;
};

/**
 * Statistical queries.
 */
export const mostCompletedGames = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id 
GROUP BY nomination_id 
ORDER BY completions DESC, title;`;

export const newestCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id 
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const newestRetrobitCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'retro'
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const newestGotmCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'gotm'
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const newestRpgCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'rpg'
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const newestGotyCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'goty'
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const newestGotwotyCompletions = `SELECT 
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) as completions
FROM [public.games] 
INNER JOIN [public.nominations] on [public.nominations].game_id = [public.games].id
INNER JOIN [public.completions] on [public.completions].nomination_id = [public.nominations].id
WHERE [public.nominations].nomination_type = 'gotwoty'
GROUP BY nomination_id 
ORDER BY [public.nominations].theme_id DESC;`;

export const totalNomsBeforeWinByGame = `SELECT
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) AS total
FROM [public.nominations]
INNER JOIN [public.games] on game_id = [public.games].id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm')
GROUP BY [public.nominations].game_id
ORDER BY total DESC, title;`;

export const avgNominationsBeforeWin = `
SELECT AVG(total) AS average FROM (SELECT
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
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
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
WHERE [public.nominations].nomination_type = 'gotm'
GROUP BY game_id
ORDER BY nominations DESC, title;`;

export const mostNominatedLoserGames = `SELECT
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
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

export const longestMonthsByAvgTimeToBeat = `SELECT 
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  AVG(time_to_beat) AS average
FROM [public.games] 
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY average DESC;`;

export const shortestMonthsByAvgTimeToBeat = `SELECT 
  [public.themes].creation_date || ' - ' || [public.themes].title AS theme,
  AVG(time_to_beat) AS average
FROM [public.games] 
INNER JOIN [public.nominations] on [public.games].id = [public.nominations].game_id
INNER JOIN [public.themes] ON [public.themes].id = [public.nominations].theme_id
WHERE [public.nominations].winner = 1 AND [public.nominations].nomination_type = 'gotm'
GROUP BY [public.nominations].theme_id
ORDER BY average ASC;`;

export const mostNominatedGamesByUser = `SELECT
  [public.users].name,
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN [public.users] ON [public.nominations].user_id = [public.users].id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE [public.nominations].nomination_type = 'gotm') AND user_id > 1
GROUP BY [public.nominations].user_id
ORDER BY nominations DESC, name;`;

export const completionsCountByGame = `SELECT
  COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap) AS title,
  COUNT(*) AS completions,
  [public.nominations].theme_id,
  [public.nominations].nomination_type
FROM [public.completions] 
INNER JOIN [public.nominations] ON [public.nominations].id = [public.completions].nomination_id
INNER JOIN [public.games] on [public.nominations].game_id = [public.games].id
GROUP BY [public.completions].nomination_id
ORDER BY [public.nominations].theme_id DESC, completions DESC;`;