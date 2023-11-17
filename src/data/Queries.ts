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
  nomination_type,
  game_id,
  users.display_name as user_name, 
  nominations.description as game_description, 
  themes.title as theme_title,
  themes.description as them_description, 
  themes.creation_date as 'date',
  winner
FROM [public.nominations] 
LEFT JOIN users on users.id = nominations.user_id 
LEFT JOIN themes ON nominations.theme_id = themes.id;`;

export const getNominationDataByGameId = (game_id: number) => {
  return `SELECT 
  users.display_name, 
  nominations.description as game_description, 
  themes.title, themes.description, 
  themes.creation_date as 'date' 
FROM [public.nominations] 
INNER JOIN users on users.id = nominations.user_id 
INNER JOIN themes ON nominations.theme_id = themes.id 
WHERE game_id = ${game_id};`;
};

/**
 * Statistical queries.
 */
export const mostCompletedGames = `SELECT 
  COUNT(*) as completions, games.title_world, games.title_usa, games.title_eu, games.title_jap 
FROM [public.games] 
INNER JOIN nominations on nominations.game_id = games.id
INNER JOIN completions on completions.nomination_id = nominations.id 
GROUP BY nomination_id 
ORDER BY completions DESC;`;

export const totalNomsBeforeWinByGame = `SELECT
  COUNT(*) AS total,
  title_world,
  title_usa,
  title_eu,
  title_jap,
  title_other
FROM [public.nominations]
INNER JOIN games on game_id = games.id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE nominations.winner = 1 AND nominations.nomination_type = 'gotm')
GROUP BY nominations.game_id
ORDER BY total DESC;`;

export const topNominationWinsByUser = `SELECT
  users.id,
  users.old_discord_name,
  users.discord_id,
  users.name,
  COUNT(*) AS wins
FROM [public.nominations]
INNER JOIN users ON nominations.user_id = users.id
WHERE nomination_type = 'gotm' AND winner = 1 AND user_id > 1
GROUP BY nominations.user_id
ORDER BY wins DESC;`;

export const mostNominatedGames = `SELECT
  COUNT(*) AS nominations,
  games.id,
  games.title_world,
  games.title_usa,
  games.title_other,
  games.title_eu,
  games.title_jap
FROM [public.nominations]
INNER JOIN games ON nominations.game_id = games.id
WHERE nominations.nomination_type = 'gotm'
GROUP BY game_id
ORDER BY nominations DESC;`;

export const longestMonthsByAvgTimeToBeat = `SELECT 
    themes.creation_date,
    themes.title,
    AVG(time_to_beat) AS 'average'
FROM [public.games] 
INNER JOIN nominations on games.id = nominations.game_id
INNER JOIN themes ON themes.id = nominations.theme_id
WHERE nominations.winner = 1 AND nomination_type = 'gotm'
GROUP BY nominations.theme_id
ORDER BY average DESC;`;

export const shortestMonthsByAvgTimeToBeat = `SELECT 
  themes.creation_date,
  themes.title,
  AVG(time_to_beat) AS 'average'
FROM [public.games] 
INNER JOIN nominations on games.id = nominations.game_id
INNER JOIN themes ON themes.id = nominations.theme_id
WHERE nominations.winner = 1 AND nomination_type = 'gotm'
GROUP BY nominations.theme_id
ORDER BY average ASC;`;

export const mostNominatedGamesByUser = `SELECT
  users.id,
  users.discord_name_original,
  users.discord_name,
  users.display_name,
  COUNT(*) AS nominations
FROM [public.nominations]
INNER JOIN users ON nominations.user_id = users.id
WHERE game_id IN (SELECT game_id FROM [public.nominations] WHERE nominations.nomination_type = 'gotm') AND user_id > 1
GROUP BY nominations.user_id
ORDER BY nominations DESC;`;
