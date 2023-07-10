// Just creating this to store goo for now, so I don't lose it.
// total nominations before win by game
const totalNomsBeforeWinByGame = `
SELECT
    COUNT(*) AS nominations
  , gotm_games.title_usa
  , gotm_games.title_jap
  , gotm_games.title_other
FROM gotm_nominations
INNER JOIN gotm_games ON gotm_games.id = gotm_nominations.game_id
WHERE gotm_nominations.game_id IN (SELECT gotm_nominations.game_id FROM gotm_winners INNER JOIN gotm_nominations ON gotm_nominations.id = gotm_winners.nomination_id)
GROUP BY
    gotm_nominations.game_id
ORDER BY
    nominations DESC;
`;

const topTenNominators = `
SELECT
    gotm_nominators.name
  , COUNT(*) AS wins
FROM gotm_winners
INNER JOIN gotm_nominations ON gotm_winners.nomination_id = gotm_nominations.id
INNER JOIN gotm_nominators ON gotm_nominators.id = gotm_nominations.nominator_id
GROUP BY
    gotm_nominations.nominator_id
ORDER BY
    wins DESC
LIMIT 10;
`;

const topTenNominatedGames = `
--Top 10 most nominated games
SELECT
    COUNT(*) AS nominations
  , gotm_games.title_usa
  , gotm_games.title_jap
  , gotm_games.title_other
FROM gotm_games
INNER JOIN gotm_nominations ON gotm_games.id = gotm_nominations.game_id
GROUP BY
    gotm_nominations.game_id
ORDER BY
    nominations DESC
LIMIT 10;`;
