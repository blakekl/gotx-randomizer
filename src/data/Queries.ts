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

export const totalNomsBeforeWinByGame = `SELECT
  COUNT(*) AS nominations,
  gotm_games.title_usa,
  gotm_games.title_jap,
  gotm_games.title_other
FROM
  gotm_nominations
  INNER JOIN gotm_games ON gotm_games.id = gotm_nominations.game_id
WHERE
  gotm_nominations.game_id IN (
    SELECT
      gotm_nominations.game_id
    FROM
      gotm_winners
    INNER JOIN gotm_nominations ON gotm_nominations.id = gotm_winners.nomination_id
  )
GROUP BY
  gotm_nominations.game_id
ORDER BY
  nominations DESC;
`;

export const topTenNominators = `SELECT
    gotm_nominators.name
  , COUNT(*) AS wins
FROM gotm_winners
INNER JOIN gotm_nominations ON gotm_winners.nomination_id = gotm_nominations.id
INNER JOIN gotm_nominators ON gotm_nominators.id = gotm_nominations.user_id
GROUP BY
    gotm_nominations.user_id
ORDER BY
    wins DESC
LIMIT 10;
`;

export const nominationsByGame = `SELECT
  COUNT(*) AS nominations,
  gotm_games.id,
  gotm_games.title_usa,
  gotm_games.title_world,
  gotm_games.title_other,
  gotm_games.title_eu,
  gotm_games.title_jap
FROM
  gotm_nominations
  INNER JOIN gotm_games ON gotm_nominations.game_id = gotm_games.id
GROUP BY
  game_id
ORDER BY
  nominations DESC;`;

export const top10LongestMonthsByWinnerAvgTime = `
SELECT 
    gotm_themes.creation_date,
    gotm_themes.title,
    AVG(time_to_beat) AS 'average'
FROM gotm_games 
INNER JOIN gotm_nominations on gotm_games.id = gotm_nominations.game_id 
INNER JOIN gotm_winners ON gotm_nominations.id = gotm_winners.nomination_id 
INNER JOIN gotm_themes ON gotm_themes.id = gotm_nominations.theme_id
WHERE gotm_themes.id <> '36'
GROUP BY gotm_nominations.theme_id
ORDER BY average DESC
LIMIT 10`;

export const top10ShortestMonthsByWinnerAvgTime = `
SELECT 
    gotm_themes.creation_date,
    gotm_themes.title,
    AVG(time_to_beat) AS 'average'
FROM gotm_games 
INNER JOIN gotm_nominations on gotm_games.id = gotm_nominations.game_id 
INNER JOIN gotm_winners ON gotm_nominations.id = gotm_winners.nomination_id 
INNER JOIN gotm_themes ON gotm_themes.id = gotm_nominations.theme_id
WHERE gotm_themes.id <> '36'
GROUP BY gotm_nominations.theme_id
ORDER BY average ASC
LIMIT 10`;
