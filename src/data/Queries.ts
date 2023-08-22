/**
 * Get game list queries.
 */
export const getRetrobits = `SELECT
  * FROM games WHERE id in (SELECT game_id FROM nominations WHERE nomination_type = 1);
`;

export const getRpgRunnerup = `SELECT 
    * FROM games
WHERE id in (
  SELECT game_id FROM nominations WHERE nomination_type = 2 AND is_winner = 0
);`

export const getWinningRpg = `SELECT 
* FROM games
WHERE id in (
SELECT game_id FROM nominations WHERE nomination_type = 2 AND is_winner = 1
);`

export const getGotmRunnerup = `SELECT * 
FROM games
WHERE id in (
  SELECT game_id FROM nominations WHERE nomination_type = 0 AND is_winner = 0
);`

export const getWinningGotm = `SELECT * 
FROM games
WHERE id in (
  SELECT game_id FROM nominations WHERE nomination_type = 0 AND is_winner = 1
);`

export const getNominationData = (game_id: number) => {
return `SELECT 
  users.display_name, 
  nominations.description as game_description, 
  themes.title, themes.description, 
  themes.creation_date as 'date' 
FROM nominations 
INNER JOIN users on users.id = nominations.user_id 
INNER JOIN themes ON nominations.theme_id = themes.id 
WHERE game_id = ${game_id};`
};


/**
 * Statistical queries.
 */
export const mostCompletedGames = `SELECT 
  COUNT(*) as completions, games.title_world, games.title_usa, games.title_eu, games.title_jap 
FROM games 
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
FROM nominations
INNER JOIN games on game_id = games.id
WHERE game_id IN (SELECT game_id FROM nominations WHERE nominations.is_winner = 1 AND nominations.nomination_type = 0)
GROUP BY nominations.game_id
ORDER BY total DESC;`;

export const topNominationWinsByUser = `SELECT
  users.id,
  users.discord_name_original,
  users.discord_name,
  users.display_name,
  COUNT(*) AS wins
FROM nominations
INNER JOIN users ON nominations.user_id = users.id
WHERE game_id IN (SELECT game_id FROM nominations WHERE nominations.is_winner = 1 AND nominations.nomination_type = 0) AND user_id > 1
GROUP BY nominations.user_id
ORDER BY wins DESC
`;

export const mostNominatedGames = `SELECT
  COUNT(*) AS nominations,
  games.id,
  games.title_world,
  games.title_usa,
  games.title_other,
  games.title_eu,
  games.title_jap
FROM nominations
INNER JOIN games ON nominations.game_id = games.id
WHERE nominations.nomination_type = 0
GROUP BY game_id
ORDER BY nominations DESC;`;

export const longestMonthsByAvgTimeToBeat = `SELECT 
    themes.creation_date,
    themes.title,
    AVG(time_to_beat) AS 'average'
FROM games 
INNER JOIN nominations on games.id = nominations.game_id
INNER JOIN themes ON themes.id = nominations.theme_id
WHERE nominations.is_winner = 1 AND nomination_type = 0
GROUP BY nominations.theme_id
ORDER BY average DESC`;

export const shortestMonthsByAvgTimeToBeat = `SELECT 
  themes.creation_date,
  themes.title,
  AVG(time_to_beat) AS 'average'
FROM games 
INNER JOIN nominations on games.id = nominations.game_id
INNER JOIN themes ON themes.id = nominations.theme_id
WHERE nominations.is_winner = 1 AND nomination_type = 0
GROUP BY nominations.theme_id
ORDER BY average ASC`;

export const mostNominatedGamesByUser = `SELECT
  users.id,
  users.discord_name_original,
  users.discord_name,
  users.display_name,
  COUNT(*) AS nominations
FROM nominations
INNER JOIN users ON nominations.user_id = users.id
WHERE game_id IN (SELECT game_id FROM nominations WHERE nominations.nomination_type = 0) AND user_id > 1
GROUP BY nominations.user_id
ORDER BY nominations DESC`;