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
  COALESCE((100 * SUM(join_winner) / COUNT(join_id)), 0) as success_rate,
  COUNT(join_id) as nominations,
  COALESCE(SUM(join_winner), 0) as wins
FROM
  [public.users]
LEFT JOIN (
  SELECT 
    user_id as join_user_id,
    winner as join_winner,
    id as join_id,
    nomination_type as join_nomination_type
  FROM [public.nominations] 
  WHERE [public.nominations].nomination_type = 'gotm'
) ON [public.users].id = join_user_id
WHERE [public.users].id > 1
GROUP BY [public.users].id
ORDER BY success_rate DESC, nominations DESC, [public.users].name ASC;`;

export const nominationCountByThemeByCategory = `SELECT 
  [public.themes].title,
  CASE
    WHEN [public.games].year < 1996 THEN 'pre-96'
    WHEN [public.games].year > 1995 AND [public.games].year < 2000 THEN '96-99'
    WHEN [public.games].year > 1999 THEN '2k+'
  END category,
  COUNT(*) as count
 FROM [public.themes] INNER 
   JOIN [public.nominations] ON [public.themes].id = [public.nominations].theme_id
   INNER JOIN [public.games] ON [public.nominations].game_id = [public.games].id
 WHERE [public.themes].nomination_type = 'gotm'
 GROUP BY [public.themes].id, category;`;

export const getGameById = (id: number) =>
  `SELECT * FROM [public.games] WHERE id = "${id}" LIMIT 1;`;

/**
 * Theme browser queries.
 */

// Get all themes with status and privacy handling
export const getThemesWithStatus = `
SELECT 
  t.id,
  t.nomination_type,
  t.creation_date,
  t.description,
  t.created_at,
  t.updated_at,
  CASE 
    WHEN t.creation_date <= strftime('%Y-%m-%d', 'now') AND EXISTS(
      SELECT 1 FROM [public.nominations] n WHERE n.theme_id = t.id AND n.winner = 1
    ) AND t.creation_date = (
      SELECT MAX(creation_date) FROM [public.themes] t2 
      WHERE t2.nomination_type = t.nomination_type 
      AND t2.creation_date <= strftime('%Y-%m-%d', 'now')
      AND EXISTS(SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = t2.id AND n2.winner = 1)
    ) THEN 'current'
    WHEN t.creation_date > strftime('%Y-%m-%d', 'now') OR (
      t.creation_date <= strftime('%Y-%m-%d', 'now') AND NOT EXISTS(
        SELECT 1 FROM [public.nominations] n WHERE n.theme_id = t.id AND n.winner = 1
      )
    ) THEN 'upcoming'
    ELSE 'historical'
  END as status,
  CASE 
    WHEN t.creation_date > strftime('%Y-%m-%d', 'now') OR (
      t.creation_date <= strftime('%Y-%m-%d', 'now') AND NOT EXISTS(
        SELECT 1 FROM [public.nominations] n3 WHERE n3.theme_id = t.id AND n3.winner = 1
      )
    ) THEN NULL  -- Privacy: hide upcoming theme titles
    ELSE t.title
  END as display_title,
  COUNT(n.id) as nomination_count,
  COUNT(CASE WHEN n.winner = 1 THEN 1 END) as winner_count
FROM [public.themes] t
LEFT JOIN [public.nominations] n ON t.id = n.theme_id
GROUP BY t.id, t.title, t.nomination_type, t.creation_date, t.description, t.created_at, t.updated_at
ORDER BY t.creation_date DESC, t.nomination_type;`;

// Get current winners with category information (for multi-winner support)
export const getCurrentWinners = `
SELECT
  n.nomination_type,
  t.title as theme_title,
  t.id as theme_id,
  t.creation_date,
  ${coalescedTitle},
  g.id as game_id,
  g.screenscraper_id,
  g.year,
  g.system,
  g.developer,
  g.genre,
  g.img_url,
  g.time_to_beat,
  CASE 
    WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
    WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
    WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
    WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
    ELSE 'Unknown'
  END AS year_category
FROM [public.nominations] n 
INNER JOIN [public.games] g ON n.game_id = g.id
INNER JOIN [public.themes] t ON n.theme_id = t.id
WHERE n.winner = 1
AND n.theme_id IN (
    SELECT t2.id FROM [public.themes] t2
    WHERE t2.creation_date <= strftime('%Y-%m-%d', 'now')
    AND t2.creation_date = (
        SELECT MAX(t3.creation_date) 
        FROM [public.themes] t3 
        WHERE t3.nomination_type = t2.nomination_type 
        AND t3.creation_date <= strftime('%Y-%m-%d', 'now')
        AND EXISTS(SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = t3.id AND n2.winner = 1)
    )
)
ORDER BY CASE n.nomination_type
    WHEN 'gotm' THEN 1
    WHEN 'retro' THEN 2
    WHEN 'rpg' THEN 3
    WHEN 'goty' THEN 4
    WHEN 'gotwoty' THEN 5
END, year_category;`;

// Get upcoming themes (privacy-protected)
export const getUpcomingThemes = `
SELECT
  t.id,
  t.nomination_type,
  t.creation_date,
  t.description,
  t.created_at,
  t.updated_at,
  NULL as title, -- Privacy: hide theme titles
  COUNT(n.id) as nomination_count
FROM [public.themes] t
LEFT JOIN [public.nominations] n ON t.id = n.theme_id
WHERE t.creation_date > strftime('%Y-%m-%d', 'now') 
   OR (t.creation_date <= strftime('%Y-%m-%d', 'now') AND NOT EXISTS(
       SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = t.id AND n2.winner = 1
   ))
GROUP BY t.id, t.nomination_type, t.creation_date, t.description, t.created_at, t.updated_at
ORDER BY t.creation_date ASC, t.nomination_type;`;

// Get theme detail with categories (parameterized function)
export const getThemeDetailWithCategories = (themeId: number) => `
SELECT 
  t.id,
  CASE 
    WHEN t.creation_date > date('now') OR (
      t.creation_date <= date('now') AND NOT EXISTS(
        SELECT 1 FROM [public.nominations] n3 WHERE n3.theme_id = t.id AND n3.winner = 1
      )
    ) THEN NULL  -- Privacy: hide upcoming theme titles
    ELSE t.title
  END as title,
  t.nomination_type,
  t.creation_date,
  t.description,
  ${coalescedTitle},
  g.id as game_id,
  g.year,
  g.screenscraper_id,
  g.system,
  g.developer,
  g.genre,
  g.img_url,
  g.time_to_beat,
  n.winner,
  n.description as nomination_description,
  u.name as user_name,
  CASE 
    WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
    WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
    WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
    WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
    ELSE 'Unknown'
  END AS year_category
FROM [public.themes] t
INNER JOIN [public.nominations] n ON t.id = n.theme_id
INNER JOIN [public.games] g ON n.game_id = g.id
LEFT JOIN [public.users] u ON n.user_id = u.id
WHERE t.id = ${themeId}
ORDER BY n.winner DESC, g.year ASC;`;

// GotY themes grouped by year (same creation_date, multiple themes)
export const getGotyThemesByYear = `
SELECT 
  t.creation_date,
  strftime('%Y', t.creation_date) as year,
  COUNT(DISTINCT t.id) as theme_count,
  COUNT(CASE WHEN n.winner = 1 THEN 1 END) as total_winners,
  GROUP_CONCAT(DISTINCT t.title) as category_titles
FROM [public.themes] t
LEFT JOIN [public.nominations] n ON t.id = n.theme_id
WHERE t.nomination_type = 'goty'
GROUP BY t.creation_date
ORDER BY t.creation_date DESC;`;

// Get all themes for a specific GotY year
export const getGotyThemesForYear = (creation_date: string) => `
SELECT 
  t.id,
  t.title,
  t.description,
  t.creation_date,
  COUNT(n.id) as nomination_count,
  COUNT(CASE WHEN n.winner = 1 THEN 1 END) as winner_count,
  ${coalescedTitle} as winner_title,
  g.id as winner_game_id,
  g.screenscraper_id as winner_screenscraper_id
FROM [public.themes] t
LEFT JOIN [public.nominations] n ON t.id = n.theme_id
LEFT JOIN [public.games] g ON n.game_id = g.id AND n.winner = 1
WHERE t.nomination_type = 'goty' 
AND t.creation_date = '${creation_date}'
GROUP BY t.id, t.title, t.description, t.creation_date, g.id
ORDER BY t.title;`;

// Get theme winners with category information (for GotM multiple winners)
export const getThemeWinners = (themeId: number) => `
SELECT 
  ${coalescedTitle},
  g.id as game_id,
  g.year,
  g.screenscraper_id,
  g.system,
  g.developer,
  g.genre,
  g.img_url,
  g.time_to_beat,
  n.description as nomination_description,
  u.name as user_name,
  CASE 
    WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
    WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
    WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
    WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
    ELSE 'Unknown'
  END AS year_category
FROM [public.nominations] n
INNER JOIN [public.games] g ON n.game_id = g.id
INNER JOIN [public.themes] t ON n.theme_id = t.id
LEFT JOIN [public.users] u ON n.user_id = u.id
WHERE n.theme_id = ${themeId} 
AND n.winner = 1
ORDER BY year_category, g.year ASC;`;
