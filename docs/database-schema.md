# 🗄️ **GotX Randomizer Database Schema**

## **Overview**

The GotX Randomizer uses a **SQLite database** that manages the Game of the X (GotX) community programs including Game of the Month (GotM), Retrobit, RPG, Game of the Year (GotY), and Game of the Week of the Year (GotWotY). The database tracks games, users, nominations, themes, completions, and user streaks.

### **⚠️ Important Database Quirks**

**SQLite with PostgreSQL-style Prefixes:**

- All tables use `public.` prefix (e.g., `public.games`, `public.users`)
- This is unusual for SQLite but maintained for compatibility
- **Always include `public.` prefix in all queries**
- Queries without the prefix will fail silently or return no results

**Client-Side Database:**

- Runs entirely in the browser using **SQL.js**
- No server-side database connection
- Database file loaded into memory on application start
- All queries execute synchronously in JavaScript

---

## **Database Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   public.games  │    │ public.users    │    │ public.themes   │
│                 │    │                 │    │                 │
│ • id (PK)       │    │ • id (PK)       │    │ • id (PK)       │
│ • title_*       │    │ • name          │    │ • creation_date │
│ • year          │    │ • discord_id    │    │ • title         │
│ • system        │    │ • points        │    │ • description   │
│ • developer     │    │ • premium_sub   │    │ • nomination_   │
│ • genre         │    │                 │    │   type          │
│ • img_url       │    │                 │    │                 │
│ • time_to_beat  │    │                 │    │                 │
│ • screenscraper │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │public.nominations│
                    │                 │
                    │ • id (PK)       │
                    │ • nomination_   │
                    │   type          │
                    │ • description   │
                    │ • winner        │
                    │ • game_id (FK)  │
                    │ • user_id (FK)  │
                    │ • theme_id (FK) │
                    └─────────────────┘
                             │
                             │
                    ┌─────────────────┐    ┌─────────────────┐
                    │public.completions│    │ public.streaks  │
                    │                 │    │                 │
                    │ • id (PK)       │    │ • id (PK)       │
                    │ • completed_at  │    │ • user_id (FK)  │
                    │ • nomination_id │    │ • start_date    │
                    │   (FK)          │    │ • end_date      │
                    │ • user_id (FK)  │    │ • last_incr     │
                    │ • retroachieve  │    │ • streak_count  │
                    │   ments         │    │                 │
                    └─────────────────┘    └─────────────────┘
```

---

## 📋 **Table Definitions**

### **`public.games`**

Stores information about video games that can be nominated across all GotX programs.

| Column             | Type    | Nullable | Default | Description                         |
| ------------------ | ------- | -------- | ------- | ----------------------------------- |
| `id`               | INTEGER | NOT NULL | -       | Primary key, unique game identifier |
| `title_usa`        | TEXT    | NULL     | -       | Game title in USA region            |
| `title_eu`         | TEXT    | NULL     | -       | Game title in European region       |
| `title_jap`        | TEXT    | NULL     | -       | Game title in Japanese region       |
| `title_world`      | TEXT    | NULL     | -       | World/International game title      |
| `title_other`      | TEXT    | NULL     | -       | Alternative or other regional title |
| `year`             | INTEGER | NOT NULL | -       | Release year of the game            |
| `system`           | TEXT    | NOT NULL | -       | Gaming platform/console             |
| `developer`        | TEXT    | NULL     | -       | Game developer/studio               |
| `genre`            | TEXT    | NULL     | -       | Game genre classification           |
| `img_url`          | TEXT    | NULL     | -       | URL to game cover/screenshot image  |
| `time_to_beat`     | REAL    | NULL     | -       | Average completion time in hours    |
| `screenscraper_id` | INTEGER | NULL     | -       | External ScreenScraper database ID  |
| `created_at`       | TEXT    | NOT NULL | -       | Record creation timestamp           |
| `updated_at`       | TEXT    | NOT NULL | -       | Record last update timestamp        |

**⚠️ Critical Notes:**

- **Title Coalescing Required**: Use `COALESCE(title_world, title_usa, title_eu, title_jap, title_other)` for display
- **Not all games have all title fields** - always use coalescing in queries
- `title_world` is most commonly populated, but not guaranteed
- `year` is critical for theme categorization logic

**Example Query Pattern:**

```sql
SELECT
  id,
  COALESCE(title_world, title_usa, title_eu, title_jap, title_other) as display_title,
  year,
  system
FROM public.games
WHERE id = ?;
```

---

### **`public.users`**

Manages community members who participate in GotX programs.

| Column               | Type    | Nullable | Default | Description                                           |
| -------------------- | ------- | -------- | ------- | ----------------------------------------------------- |
| `id`                 | INTEGER | NOT NULL | -       | Primary key, unique user identifier                   |
| `name`               | TEXT    | NULL     | -       | Display name/username                                 |
| `discord_id`         | TEXT    | NULL     | -       | Discord user ID for integration                       |
| `old_discord_name`   | TEXT    | NULL     | -       | Previous Discord username (legacy)                    |
| `current_points`     | REAL    | NULL     | 0       | Current available points balance                      |
| `redeemed_points`    | REAL    | NOT NULL | 0       | Total points spent/redeemed                           |
| `earned_points`      | REAL    | NOT NULL | 0       | Total points earned from participation                |
| `premium_points`     | REAL    | NOT NULL | 0       | Premium subscription bonus points                     |
| `created_at`         | TEXT    | NOT NULL | -       | Account creation timestamp                            |
| `updated_at`         | TEXT    | NOT NULL | -       | Account last update timestamp                         |
| `premium_subscriber` | TEXT    | NULL     | -       | Premium subscription tier (supporter/champion/legend) |

**Notes:**

- Points system rewards participation and completion
- Premium subscribers get bonus points and features
- Discord integration enables bot interactions
- `name` field may be NULL - handle gracefully with "Unknown" fallback

---

### **`public.themes`**

Defines monthly/periodic themes for each GotX program type.

| Column            | Type    | Nullable | Default | Description                                   |
| ----------------- | ------- | -------- | ------- | --------------------------------------------- |
| `id`              | INTEGER | NOT NULL | -       | Primary key, unique theme identifier          |
| `creation_date`   | TEXT    | NOT NULL | -       | Theme start/creation date (YYYY-MM-DD format) |
| `title`           | TEXT    | NOT NULL | -       | Theme name/title                              |
| `description`     | TEXT    | NULL     | -       | Detailed theme description and rules          |
| `created_at`      | TEXT    | NOT NULL | -       | Record creation timestamp                     |
| `updated_at`      | TEXT    | NOT NULL | -       | Record last update timestamp                  |
| `nomination_type` | TEXT    | NOT NULL | -       | Program type: gotm, retro, rpg, goty, gotwoty |

**🚨 Privacy Critical Notes:**

- **Future themes must be filtered out** to prevent spoilers
- Always use `WHERE creation_date <= strftime('%Y-%m-%d', 'now')` for public queries
- `creation_date` is stored as TEXT in YYYY-MM-DD format
- **Never expose upcoming theme titles** - use NULL coalescing for privacy

**Privacy-Safe Query Pattern:**

```sql
SELECT
  id,
  CASE
    WHEN creation_date <= strftime('%Y-%m-%d', 'now') THEN title
    ELSE NULL
  END as safe_title,
  creation_date,
  nomination_type
FROM public.themes
WHERE creation_date <= strftime('%Y-%m-%d', 'now')
ORDER BY creation_date DESC;
```

---

### **`public.nominations`**

Links games to themes with user nominations and winner status.

| Column            | Type    | Nullable | Default | Description                               |
| ----------------- | ------- | -------- | ------- | ----------------------------------------- |
| `id`              | INTEGER | NOT NULL | -       | Primary key, unique nomination identifier |
| `nomination_type` | INTEGER | NOT NULL | 0       | Program type (enum integer value)         |
| `description`     | TEXT    | NULL     | -       | User's nomination reason/description      |
| `winner`          | INTEGER | NULL     | 0       | Winner flag (1 = winner, 0 = not winner)  |
| `game_id`         | INTEGER | NOT NULL | -       | Foreign key to games table                |
| `user_id`         | INTEGER | NULL     | -       | Foreign key to users table (nominator)    |
| `theme_id`        | INTEGER | NULL     | 0       | Foreign key to themes table               |
| `created_at`      | TEXT    | NOT NULL | -       | Nomination submission timestamp           |
| `updated_at`      | TEXT    | NOT NULL | -       | Nomination last update timestamp          |

**⚠️ Critical Notes:**

- **`nomination_type` is stored as INTEGER**, not TEXT (unlike themes table)
- **`winner` is INTEGER**: 1 = winner, 0 = not winner (use `winner = 1` in WHERE clauses)
- **Multiple winners possible** per theme (GotM has 3 categories, GotY has multiple awards)
- `user_id` can be NULL for system-generated nominations
- `description` field contains award category info for GotY themes

**Nomination Type Mapping:**

```typescript
// Integer values stored in database
enum NominationType {
  GOTM = 0, // Game of the Month
  RETROBIT = 1, // Retrobit
  RPG = 2, // RPG
  GOTY = 3, // Game of the Year
  GOTWOTY = 4, // Game of the Week of the Year
}
```

---

### **`public.completions`**

Tracks when users complete nominated games.

| Column              | Type     | Nullable | Default | Description                               |
| ------------------- | -------- | -------- | ------- | ----------------------------------------- |
| `id`                | INTEGER  | NOT NULL | -       | Primary key, unique completion identifier |
| `completed_at`      | datetime | NOT NULL | -       | Completion date and time                  |
| `nomination_id`     | INTEGER  | NOT NULL | -       | Foreign key to nominations table          |
| `user_id`           | INTEGER  | NOT NULL | -       | Foreign key to users table                |
| `created_at`        | TEXT     | NOT NULL | -       | Record creation timestamp                 |
| `updated_at`        | TEXT     | NOT NULL | -       | Record last update timestamp              |
| `retroachievements` | INTEGER  | NOT NULL | 0       | RetroAchievements completion flag         |

**Notes:**

- Links to nominations rather than games directly for theme context
- `retroachievements` flag provides bonus points for achievement completion
- Used for statistics, leaderboards, and points calculation

---

### **`public.streaks`**

Manages user completion streaks for gamification.

| Column             | Type    | Nullable | Default | Description                               |
| ------------------ | ------- | -------- | ------- | ----------------------------------------- |
| `id`               | INTEGER | NOT NULL | -       | Primary key, unique streak identifier     |
| `user_id`          | INTEGER | NOT NULL | -       | Foreign key to users table                |
| `start_date`       | TEXT    | NOT NULL | -       | Streak start date                         |
| `end_date`         | TEXT    | NULL     | -       | Streak end date (NULL for active streaks) |
| `last_incremented` | TEXT    | NOT NULL | -       | Last streak increment date                |
| `streak_count`     | INTEGER | NOT NULL | -       | Current/final streak count                |
| `created_at`       | TEXT    | NOT NULL | -       | Record creation timestamp                 |
| `updated_at`       | TEXT    | NOT NULL | -       | Record last update timestamp              |

**Notes:**

- Tracks consecutive completion periods
- Active streaks have NULL `end_date`
- Used for leaderboards and achievement systems

---

## 🔗 **Relationships & Business Logic**

### **Primary Relationships:**

```sql
-- Games can have multiple nominations
public.games.id → public.nominations.game_id (1:N)

-- Users can make multiple nominations
public.users.id → public.nominations.user_id (1:N)

-- Themes can have multiple nominations
public.themes.id → public.nominations.theme_id (1:N)

-- Nominations can have multiple completions
public.nominations.id → public.completions.nomination_id (1:N)

-- Users can have multiple completions
public.users.id → public.completions.user_id (1:N)

-- Users can have multiple streaks
public.users.id → public.streaks.user_id (1:N)
```

### **Multi-Winner Business Logic:**

**Game of the Month (GotM):**

- **3 winners per theme** (one per year category)
- Categories determined by game release year and theme ID
- Year category logic changed at `theme_id = 235`

**Game of the Year (GotY):**

- **Multiple themes per calendar year** (different award categories)
- Each theme represents a different award (Best RPG, Best Platformer, etc.)
- Award category stored in `nominations.description` field
- Grouped by `themes.creation_date` for yearly display

**Other Programs:**

- **Single winner per theme** (Retrobit, RPG, GotWotY)

---

## 📊 **Year Categorization Logic**

### **Critical Business Rule Change at Theme ID 235:**

```sql
-- Year categorization function
CASE
  WHEN theme_id <= 235 THEN
    CASE
      WHEN game_year < 1996 THEN 'pre 96'
      WHEN game_year BETWEEN 1996 AND 1999 THEN '96-99'
      WHEN game_year >= 2000 THEN '00+'
    END
  WHEN theme_id > 235 THEN
    CASE
      WHEN game_year < 1996 THEN 'pre 96'
      WHEN game_year BETWEEN 1996 AND 1999 THEN '96-99'
      WHEN game_year >= 2000 THEN '00+'
    END
END as year_category
```

**Why This Matters:**

- Determines which games can win in which categories
- Affects historical data analysis and statistics
- Must be applied consistently in all GotM-related queries

---

## 🔍 **Proven Query Patterns**

### **1. Privacy-Safe Theme List:**

```sql
SELECT
  t.id,
  CASE
    WHEN t.creation_date <= strftime('%Y-%m-%d', 'now') THEN t.title
    ELSE NULL
  END as title,
  t.creation_date,
  t.nomination_type,
  t.description
FROM public.themes t
WHERE t.creation_date <= strftime('%Y-%m-%d', 'now')
ORDER BY t.creation_date DESC;
```

### **2. Current Theme Winners with Categories:**

```sql
SELECT
  t.id as theme_id,
  t.title as theme_title,
  t.nomination_type,
  n.id as nomination_id,
  COALESCE(g.title_world, g.title_usa, g.title_eu, g.title_jap, g.title_other) as game_title,
  g.year as game_year,
  g.img_url,
  COALESCE(u.name, 'Unknown') as nominator,
  CASE
    WHEN t.id <= 235 THEN
      CASE
        WHEN g.year < 1996 THEN 'pre 96'
        WHEN g.year BETWEEN 1996 AND 1999 THEN '96-99'
        WHEN g.year >= 2000 THEN '00+'
      END
    ELSE
      CASE
        WHEN g.year < 1996 THEN 'pre 96'
        WHEN g.year BETWEEN 1996 AND 1999 THEN '96-99'
        WHEN g.year >= 2000 THEN '00+'
      END
  END as year_category
FROM public.themes t
JOIN public.nominations n ON t.id = n.theme_id
JOIN public.games g ON n.game_id = g.id
LEFT JOIN public.users u ON n.user_id = u.id
WHERE n.winner = 1
  AND t.creation_date <= strftime('%Y-%m-%d', 'now')
  AND t.creation_date = (
    SELECT MAX(creation_date)
    FROM public.themes
    WHERE nomination_type = t.nomination_type
      AND creation_date <= strftime('%Y-%m-%d', 'now')
  )
ORDER BY t.nomination_type, year_category;
```

### **3. Theme Detail with All Nominations:**

```sql
SELECT
  n.id as nomination_id,
  COALESCE(g.title_world, g.title_usa, g.title_eu, g.title_jap, g.title_other) as game_title,
  g.year as game_year,
  g.system,
  g.developer,
  g.img_url,
  n.winner,
  n.description as nomination_description,
  COALESCE(u.name, 'Unknown') as nominator,
  CASE
    WHEN ? <= 235 THEN -- theme_id parameter
      CASE
        WHEN g.year < 1996 THEN 'pre 96'
        WHEN g.year BETWEEN 1996 AND 1999 THEN '96-99'
        WHEN g.year >= 2000 THEN '00+'
      END
    ELSE
      CASE
        WHEN g.year < 1996 THEN 'pre 96'
        WHEN g.year BETWEEN 1996 AND 1999 THEN '96-99'
        WHEN g.year >= 2000 THEN '00+'
      END
  END as year_category
FROM public.nominations n
JOIN public.games g ON n.game_id = g.id
LEFT JOIN public.users u ON n.user_id = u.id
WHERE n.theme_id = ?
ORDER BY n.winner DESC, year_category, game_title;
```

### **4. GotY Themes by Year:**

```sql
SELECT
  strftime('%Y', t.creation_date) as year,
  COUNT(DISTINCT t.id) as theme_count,
  COUNT(DISTINCT CASE WHEN n.winner = 1 THEN n.id END) as winner_count
FROM public.themes t
LEFT JOIN public.nominations n ON t.id = n.theme_id
WHERE t.nomination_type = 'goty'
  AND t.creation_date <= strftime('%Y-%m-%d', 'now')
GROUP BY strftime('%Y', t.creation_date)
ORDER BY year DESC;
```

---

## ⚠️ **Common Pitfalls & Solutions**

### **1. Missing `public.` Prefix**

```sql
-- ❌ WRONG - Will fail silently
SELECT * FROM themes WHERE id = 1;

-- ✅ CORRECT - Always use public. prefix
SELECT * FROM public.themes WHERE id = 1;
```

### **2. Game Title Handling**

```sql
-- ❌ WRONG - May return NULL unexpectedly
SELECT title_world FROM public.games WHERE id = 1;

-- ✅ CORRECT - Use coalescing for reliable titles
SELECT COALESCE(title_world, title_usa, title_eu, title_jap, title_other) as title
FROM public.games WHERE id = 1;
```

### **3. Privacy Violations**

```sql
-- ❌ WRONG - Exposes upcoming themes
SELECT * FROM public.themes ORDER BY creation_date DESC;

-- ✅ CORRECT - Privacy-safe filtering
SELECT * FROM public.themes
WHERE creation_date <= strftime('%Y-%m-%d', 'now')
ORDER BY creation_date DESC;
```

### **4. Winner Flag Confusion**

```sql
-- ❌ WRONG - winner is INTEGER, not BOOLEAN
SELECT * FROM public.nominations WHERE winner = true;

-- ✅ CORRECT - Use integer comparison
SELECT * FROM public.nominations WHERE winner = 1;
```

### **5. Date Comparison Issues**

```sql
-- ❌ WRONG - String comparison may fail
SELECT * FROM public.themes WHERE creation_date <= '2025-08-21';

-- ✅ CORRECT - Use SQLite date functions
SELECT * FROM public.themes
WHERE creation_date <= strftime('%Y-%m-%d', 'now');
```

---

## 🛠️ **Development Guidelines**

### **Query Development Checklist:**

1. **✅ Always use `public.` prefix** on all table names
2. **✅ Use title coalescing** for game display names
3. **✅ Apply privacy filtering** for theme queries
4. **✅ Handle NULL user names** with 'Unknown' fallback
5. **✅ Use integer comparison** for winner flags (= 1, not = true)
6. **✅ Apply year categorization logic** correctly for GotM themes
7. **✅ Use SQLite date functions** for date comparisons

### **Performance Considerations:**

- **No indexes defined** - queries rely on primary keys and table scans
- **Text-based timestamps** instead of native datetime types
- **Denormalized data** for performance (points calculations)
- **Client-side execution** - all queries run in browser memory

### **Testing Strategies:**

- **Test with empty results** - handle NULL and empty arrays gracefully
- **Test privacy filtering** - ensure upcoming themes never appear
- **Test multi-winner scenarios** - GotM and GotY edge cases
- **Test title coalescing** - games with missing title fields
- **Test year boundaries** - theme_id 235 categorization logic

---

## 📝 **Integration Notes**

### **Application Usage:**

This database schema supports the GotX Randomizer's core functionality:

- **Game Randomization**: Select random games from nomination pools
- **Theme Browsing**: Display current, upcoming, and historical themes
- **User Profiles**: Show nomination history, completions, and statistics
- **Leaderboards**: Calculate rankings based on wins, completions, and streaks
- **Points System**: Track and manage user reward points
- **Statistics**: Generate insights about games, themes, and user participation

### **Data Flow Patterns:**

1. **Theme Creation** → **Nominations** → **Winner Selection** → **Completions**
2. **Privacy Filtering** applied at query level for all public-facing data
3. **Multi-winner logic** handled in application layer with database support
4. **Year categorization** computed dynamically based on theme_id boundaries

### **Future Considerations:**

- **Add database indexes** for common query patterns (theme dates, winner flags)
- **Implement foreign key constraints** for data integrity
- **Consider native date/time types** for better querying performance
- **Add audit trails** for sensitive operations (theme reveals, winner changes)
- **Optimize for larger datasets** as community grows

---

**Last Updated:** August 21, 2025  
**Schema Version:** Production (Theme Browser Complete)  
**Database Type:** SQLite with SQL.js (Client-side)
