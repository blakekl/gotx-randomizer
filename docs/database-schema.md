# 🗄️ **GotX Randomizer Database Schema**

## **Overview**

The GotX Randomizer database is a SQLite database that manages the Game of the X (GotX) community programs including Game of the Month (GotM), Retrobit, RPG, Game of the Year (GotY), and Game of the Week of the Year (GotWotY). The database tracks games, users, nominations, themes, completions, and user streaks.

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

**Notes:**

- Multiple title fields support regional variations
- `time_to_beat` used for statistics and theme planning
- `screenscraper_id` links to external game database for additional metadata

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

---

### **`public.themes`**

Defines monthly/periodic themes for each GotX program type.

| Column            | Type    | Nullable | Default | Description                                   |
| ----------------- | ------- | -------- | ------- | --------------------------------------------- |
| `id`              | INTEGER | NOT NULL | -       | Primary key, unique theme identifier          |
| `creation_date`   | TEXT    | NOT NULL | -       | Theme start/creation date                     |
| `title`           | TEXT    | NOT NULL | -       | Theme name/title                              |
| `description`     | TEXT    | NULL     | -       | Detailed theme description and rules          |
| `created_at`      | TEXT    | NOT NULL | -       | Record creation timestamp                     |
| `updated_at`      | TEXT    | NOT NULL | -       | Record last update timestamp                  |
| `nomination_type` | TEXT    | NOT NULL | -       | Program type: gotm, retro, rpg, goty, gotwoty |

**Notes:**

- Each theme belongs to one program type
- `creation_date` determines theme chronological order
- Future themes may have hidden titles for privacy

---

### **`public.nominations`**

Links games to themes with user nominations and winner status.

| Column            | Type    | Nullable | Default | Description                               |
| ----------------- | ------- | -------- | ------- | ----------------------------------------- |
| `id`              | INTEGER | NOT NULL | -       | Primary key, unique nomination identifier |
| `nomination_type` | INTEGER | NOT NULL | 0       | Program type (enum value)                 |
| `description`     | TEXT    | NULL     | -       | User's nomination reason/description      |
| `winner`          | INTEGER | NULL     | 0       | Winner flag (1 = winner, 0 = not winner)  |
| `game_id`         | INTEGER | NOT NULL | -       | Foreign key to games table                |
| `user_id`         | INTEGER | NULL     | -       | Foreign key to users table (nominator)    |
| `theme_id`        | INTEGER | NULL     | 0       | Foreign key to themes table               |
| `created_at`      | TEXT    | NOT NULL | -       | Nomination submission timestamp           |
| `updated_at`      | TEXT    | NOT NULL | -       | Nomination last update timestamp          |

**Notes:**

- Central junction table connecting games, users, and themes
- `winner` field determines monthly/theme winners
- `nomination_type` stored as integer enum for performance

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

## 🔗 **Relationships**

### **Primary Relationships:**

```sql
-- Games can have multiple nominations
games.id → nominations.game_id (1:N)

-- Users can make multiple nominations
users.id → nominations.user_id (1:N)

-- Themes can have multiple nominations
themes.id → nominations.theme_id (1:N)

-- Nominations can have multiple completions
nominations.id → completions.nomination_id (1:N)

-- Users can have multiple completions
users.id → completions.user_id (1:N)

-- Users can have multiple streaks
users.id → streaks.user_id (1:N)
```

### **Key Business Logic:**

- **Winners**: Only one nomination per theme can have `winner = 1`
- **Themes**: Each theme belongs to one `nomination_type` program
- **Completions**: Users complete specific nominations, not just games
- **Points**: Calculated from completions, wins, and premium status
- **Streaks**: Consecutive completion periods with gamification rewards

---

## 📊 **Data Patterns & Constraints**

### **Nomination Types:**

- `gotm` - Game of the Month
- `retro` - Retrobit (weekly retro games)
- `rpg` - RPG of the Quarter
- `goty` - Game of the Year
- `gotwoty` - Game of the Week of the Year

### **Year Categories (Historical Logic):**

Games are categorized by release year with logic that changed at theme_id 235:

**For theme_id < 235:**

- `pre 96`: year < 1996
- `96-99`: year 1996-1999
- `2k+`: year >= 2000

**For theme_id >= 235:**

- `pre 96`: year < 1996
- `96-01`: year 1996-2001
- `02+`: year >= 2002

### **Points System:**

- Base points for nominations and completions
- Bonus points for RetroAchievements
- Premium subscriber multipliers
- Winner bonuses

### **Privacy Considerations:**

- Future theme titles may be hidden until reveal date
- User Discord IDs are sensitive data
- Completion dates track user activity patterns

---

## 🔍 **Common Query Patterns**

### **Current Winners:**

```sql
SELECT * FROM nominations n
JOIN themes t ON n.theme_id = t.id
JOIN games g ON n.game_id = g.id
WHERE n.winner = 1
AND t.creation_date = (
  SELECT MAX(creation_date)
  FROM themes
  WHERE nomination_type = t.nomination_type
);
```

### **User Statistics:**

```sql
SELECT
  u.name,
  COUNT(n.id) as nominations,
  COUNT(CASE WHEN n.winner = 1 THEN 1 END) as wins,
  COUNT(c.id) as completions
FROM users u
LEFT JOIN nominations n ON u.id = n.user_id
LEFT JOIN completions c ON u.id = c.user_id
GROUP BY u.id;
```

### **Theme Nominations with Categories:**

```sql
SELECT
  g.title_world,
  g.year,
  CASE
    WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
    WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
    WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
    WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
    WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
  END as category
FROM nominations n
JOIN games g ON n.game_id = g.id
JOIN themes t ON n.theme_id = t.id
WHERE t.id = ?;
```

---

## 🛠️ **Development Notes**

### **Database Technology:**

- **SQLite** - Embedded database for client-side operation
- **SQL.js** - JavaScript SQLite implementation for web browsers
- **No foreign key constraints** - Managed at application level

### **Performance Considerations:**

- No indexes defined - queries rely on primary keys
- Text-based timestamps instead of native datetime
- Denormalized points calculations for performance

### **Migration History:**

- Theme categorization logic changed at theme_id 235
- Points system evolved over time
- Premium subscription tiers added later

### **Future Enhancements:**

- Add database indexes for common query patterns
- Implement foreign key constraints
- Consider date/time column types for better querying
- Add audit trails for sensitive operations

---

## 📝 **Usage in Application**

This database schema supports the GotX Randomizer application's core functionality:

- **Game Randomization**: Select random games from nomination pools
- **Theme Browsing**: Display current, upcoming, and historical themes
- **User Profiles**: Show nomination history, completions, and statistics
- **Leaderboards**: Calculate rankings based on wins, completions, and streaks
- **Points System**: Track and manage user reward points
- **Statistics**: Generate insights about games, themes, and user participation

The schema is designed for read-heavy workloads with occasional writes for new nominations, completions, and theme updates.
