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

export const getRetrobits = `SELECT
  * FROM retrobits;
`;

export const getRpgRunnerup = `SELECT 
    rpg_games.id, 
    rpg_games.screenscraper_id, 
    rpg_games.img, 
    rpg_games.year, 
    rpg_games.system, 
    rpg_games.developer, 
    rpg_games.genre, 
    rpg_games.time_to_beat, 
    rpg_games.title_usa, 
    rpg_games.title_eu, 
    rpg_games.title_jap, 
    rpg_games.title_world, 
    rpg_games.title_other,
    rpg_nominations.description
  FROM rpg_games 
  INNER JOIN rpg_nominations ON rpg_games.id = rpg_nominations.game_id
  WHERE rpg_games.id NOT IN (
    SELECT rpg_games.id FROM rpg_games
    INNER JOIN rpg_nominations ON rpg_games.id = rpg_nominations.game_id 
    INNER JOIN rpg_winners ON rpg_nominations.id = rpg_winners.nomination_id);`;

export const getWinningRpg = `SELECT 
  rpg_games.id, 
  rpg_games.screenscraper_id, 
  rpg_games.img, 
  rpg_games.year, 
  rpg_games.system, 
  rpg_games.developer, 
  rpg_games.genre, 
  rpg_games.time_to_beat, 
  rpg_games.title_usa, 
  rpg_games.title_eu, 
  rpg_games.title_jap, 
  rpg_games.title_world, 
  rpg_games.title_other,
  rpg_nominations.description
FROM rpg_games 
INNER JOIN rpg_nominations ON rpg_games.id = rpg_nominations.game_id 
INNER JOIN rpg_winners ON rpg_nominations.id = rpg_winners.nomination_id;
`;

export const getGotmRunnerup = `SELECT 
  gotm_games.id, 
  gotm_games.screenscraper_id, 
  gotm_games.img, 
  gotm_games.year, 
  gotm_games.system, 
  gotm_games.developer, 
  gotm_games.genre, 
  gotm_games.time_to_beat, 
  gotm_games.title_usa, 
  gotm_games.title_eu, 
  gotm_games.title_jap, 
  gotm_games.title_world, 
  gotm_games.title_other,
  gotm_nominations.description
FROM gotm_games 
INNER JOIN gotm_nominations ON gotm_games.id = gotm_nominations.game_id
WHERE gotm_games.id NOT IN (
  SELECT gotm_games.id FROM gotm_games
  INNER JOIN gotm_nominations ON gotm_games.id = gotm_nominations.game_id 
  INNER JOIN gotm_winners ON gotm_nominations.id = gotm_winners.nomination_id);`;

export const getWinningGotm = `SELECT 
    gotm_games.id, 
    gotm_games.screenscraper_id, 
    gotm_games.img, 
    gotm_games.year, 
    gotm_games.system, 
    gotm_games.developer, 
    gotm_games.genre, 
    gotm_games.time_to_beat, 
    gotm_games.title_usa, 
    gotm_games.title_eu, 
    gotm_games.title_jap, 
    gotm_games.title_world, 
    gotm_games.title_other,
    gotm_nominations.description
  FROM gotm_games 
  INNER JOIN gotm_nominations ON gotm_games.id = gotm_nominations.game_id 
  INNER JOIN gotm_winners ON gotm_nominations.id = gotm_winners.nomination_id;
`;

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
