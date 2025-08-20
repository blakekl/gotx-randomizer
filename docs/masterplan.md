# 🎯 **GotX Theme Browser - Master Plan**

## **Feature Overview**

A dedicated page for browsing game themes across all GotX programs (GotM, Retrobit, RPG, GotY, GotWotY) with privacy-aware upcoming theme handling and comprehensive historical browsing.

**Key Requirements:**

- Browse themes by program type and time period
- Show current active themes with winners
- Display upcoming themes WITHOUT revealing theme names (privacy requirement)
- Categorize nominations by release year brackets
- Provide detailed theme views with category breakdowns

---

## 🔍 **Existing Codebase Analysis**

### **✅ Reusable Types & Interfaces**

The project already has excellent type definitions we can leverage:

**From `/src/models/game.ts`:**

```typescript
// Already exists - perfect for our needs!
export enum NominationType {
  GOTM = 'gotm',
  RETROBIT = 'retro',
  RPG = 'rpg',
  GOTWOTY = 'gotwoty',
  GOTY = 'goty',
}

export interface Theme {
  id: number;
  creation_date: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  nomination_type: NominationType;
}

export interface Game {
  id: number;
  title_usa?: string;
  title_eu?: string;
  title_jap?: string;
  title_world?: string;
  title_other?: string;
  year: number;
  system: string;
  developer: string;
  genre: string;
  img_url: string;
  time_to_beat?: number;
  screenscraper_id: number;
  created_at: string;
  updated_at: string;
}

export interface Nomination {
  id: number;
  nomination_type: NominationType;
  description: string;
  winner: boolean;
  game_id: number;
  user_id: number;
  theme_id: number;
  created_at: string;
  updated_at: string;
}

// Already exists - shows nominations with game details
export interface NominationListItem {
  game_title: string;
  nomination_type: NominationType;
  game_id: number;
  user_name: string;
  game_description: string;
  theme_title: string;
  theme_description: string;
  date: string;
  winner: boolean;
}
```

**Existing DTOs we can reuse:**

- `themeDto()` - Already converts DB results to Theme objects
- `gameDto()` - For game data conversion
- `nominationDto()` - For nomination data
- `nominationListItemDto()` - For rich nomination displays

### **✅ Existing Database Infrastructure**

- **SQL.js setup** in `initDbClient.ts` - Proven pattern to extend
- **Query execution** in `Queries.ts` - Add our theme queries here
- **DbStore pattern** - Follow existing MobX store architecture
- **Year categorization** already exists in `nominationCountByThemeByCategory` query

### **✅ Existing Queries to Leverage**

From `Queries.ts`:

```sql
-- Already has year categorization logic we can adapt!
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

-- Theme data with nominations
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
```

### **✅ Existing Component Patterns**

- **Navigation** from `Navigation.tsx` - Add theme browser link
- **Pagination** component - Recently fixed, ready to use
- **Game display** from Games page - Reuse for theme nominations
- **Settings** component pattern - For theme filtering
- **MobX stores** - Follow DbStore pattern for ThemeStore

---

## 🗄️ **Data Structure & Business Logic**

### **🆕 New Interfaces (Extending Existing)**

```typescript
// Extend existing Theme interface for theme browser needs
interface ThemeWithStatus extends Theme {
  status: 'current' | 'upcoming' | 'historical';
  displayTitle: string; // For privacy handling - "Upcoming GotM Theme" vs actual title
  nominationCount: number;
  winners: Game[]; // Multiple winners possible (GotM categories, GotY awards)
  categoryBreakdown: YearCategoryBreakdown;
  winnersByCategory?: { [category: string]: Game }; // For GotM year categories
}

interface YearCategoryBreakdown {
  'pre 96': number;
  '96-99'?: number; // Only for theme_id < 235 (from existing logic)
  '2k+'?: number; // Only for theme_id < 235 (from existing logic)
  '96-01'?: number; // Only for theme_id >= 235 (from existing logic)
  '02+'?: number; // Only for theme_id >= 235 (from existing logic)
}

// Extend existing Nomination for theme browser context
interface NominationWithGame extends Nomination {
  game: Game; // Full game object instead of just game_id
  yearCategory: string; // Computed category based on theme_id and year
  user_name?: string; // From user join
}

// For current active themes dashboard - updated for multiple winners
interface CurrentTheme {
  nominationType: NominationType;
  theme: ThemeWithStatus;
  winners: Game[]; // Array to handle multiple winners
  isMultiWinner: boolean; // Flag for special display logic
}

// For GotY program - multiple themes per year with same creation_date
interface GotyYearGroup {
  year: number;
  creation_date: string;
  themes: ThemeWithStatus[]; // Multiple award categories
  allWinners: Game[]; // All winners across categories
}

// Theme filtering options
interface ThemeFilters {
  programType?: NominationType | 'all';
  year?: number | 'all';
  status?: 'current' | 'upcoming' | 'historical' | 'all';
  searchTerm?: string; // Only searches historical themes (privacy)
}
```

### **Theme States & Status Logic**

**Leveraging existing database patterns with multi-winner considerations:**

**Winner Logic by Program Type:**

- **GotM**: Up to 3 winners per theme (one per year category: pre-96, 96-99/96-01, 2k+/02+)
- **Retrobit**: 1 winner per theme
- **RPG**: 1 winner per theme
- **GotY**: Multiple themes per year (same creation_date), 1 winner per theme/category
- **GotWotY**: 1 winner per theme

**Status Determination:**

- **Current**: `creation_date <= today AND has winner(s) AND is latest for program type`
- **Upcoming**: `creation_date > today OR (creation_date <= today AND no winners)`
- **Historical**: `creation_date < today AND has winner(s) AND not current`

**Special Cases:**

- **GotY grouping**: Themes with same creation_date grouped as "GotY 2025" with sub-categories
- **GotM exceptions**: Some themes allow "any previous winner" creating irregular data
- **Multi-winner display**: UI adapts based on program type and winner count

### **Year Category Logic (From Existing Code)**

**Adapting `nominationCountByThemeByCategory` logic:**

Categories change at theme_id 235 (significant milestone in existing codebase):

**For theme_id < 235:**

- pre 96: year < 1996
- 96-99: year 1996-1999
- 2k+: year >= 2000

**For theme_id >= 235:**

- pre 96: year < 1996
- 96-01: year 1996-2001
- 02+: year >= 2002

### **Privacy Requirements**

- Upcoming theme titles must NEVER be exposed in API responses
- Nominations for upcoming themes are allowed to be shown
- Theme detail pages for upcoming themes show nominations but hide theme name
- Only Discord server insiders should know upcoming theme names

---

## 🎨 **User Interface Design**

### **Main Dashboard Layout**

```
┌─────────────────────────────────────────────────────────┐
│ GotX Theme Browser                                      │
├─────────────────────────────────────────────────────────┤
│ Current Active Themes (August 2025)                    │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────────┐ │
│ │  GotM   │ Retrobit│   RPG   │  GotY   │  GotWotY    │ │
│ │"Abnormal│ Week 34 │ Q3 2025 │ 2025    │  2025       │ │
│ │ August" │ [Game]  │ [Game]  │ Awards  │   [Game]    │ │
│ │ 3 Winners│        │         │Multiple │             │ │
│ │ by Cat. │         │         │Categories│             │ │
│ └─────────┴─────────┴─────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Upcoming Themes                                         │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────────┐ │
│ │  GotM   │ Retrobit│   RPG   │  GotY   │  GotWotY    │ │
│ │ Sep 2025│   N/A   │   N/A   │ 2026    │    N/A      │ │
│ │ [Hidden]│         │         │ Awards  │             │ │
│ │ 15 noms │         │         │ [Hidden]│             │ │
│ └─────────┴─────────┴─────────┴─────────┴─────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Browse History: [All Programs ▼] [2025 ▼] [🔍 Search] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Theme               │ Type │ Date │ Status │Winners│ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ Abnormal August     │ GotM │08/25 │   🏆   │   3   │ │
│ │ July Platformers    │ GotM │07/25 │   ✅   │   3   │ │
│ │ [Upcoming Theme]    │ GotM │09/25 │   📅   │   0   │ │
│ │ GotY 2024 Awards    │ GotY │12/24 │   ✅   │   8   │ │
│ │ Retrobit Week 33    │ Retro│08/25 │   🏆   │   1   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Theme Detail View (GotM - Multiple Winners by Category)**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Themes                                        │
├─────────────────────────────────────────────────────────┤
│ Abnormal August (GotM) - August 2025          🏆 Active │
├─────────────────────────────────────────────────────────┤
│ Winners by Release Year Category                        │
│ ┌─────────────────┬─────────────────┬─────────────────┐ │
│ │    pre 96       │     96-01       │      02+        │ │
│ │ [Winner Card 1] │ [Winner Card 2] │ [Winner Card 3] │ │
│ │   🏆 WINNER     │   🏆 WINNER     │   🏆 WINNER     │ │
│ └─────────────────┴─────────────────┴─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Nominations by Release Year Category                    │
│ ┌─────────┬─────────┬─────────────────────────────────┐ │
│ │ pre 96  │ 96-01   │           02+                   │ │
│ │   (4)   │   (5)   │           (8)                   │ │
│ │ ████░░  │ █████░  │ ████████████████░░░░░░░░░░░░░░  │ │
│ └─────────┴─────────┴─────────────────────────────────┘ │
│                                                         │
│ All Nominations (17)                    [Filter ▼]     │
│ [Game Cards Grid with category badges and winner badges]│
└─────────────────────────────────────────────────────────┘
```

### **Theme Detail View (GotY - Multiple Award Categories)**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Themes                                        │
├─────────────────────────────────────────────────────────┤
│ Game of the Year 2024 Awards - December 2024  🏆 Complete│
├─────────────────────────────────────────────────────────┤
│ Award Categories & Winners                              │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏆 Best Soundtrack    │ [Winner Game Card]          │ │
│ │ 🏆 Best Narrative     │ [Winner Game Card]          │ │
│ │ 🏆 Best Gameplay      │ [Winner Game Card]          │ │
│ │ 🏆 Best Art Direction │ [Winner Game Card]          │ │
│ │ 🏆 Most Innovative    │ [Winner Game Card]          │ │
│ │ 🏆 Best Indie Game    │ [Winner Game Card]          │ │
│ │ 🏆 Best Retro Game    │ [Winner Game Card]          │ │
│ │ 🏆 Overall GotY       │ [Winner Game Card]          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ All Nominations by Category             [Filter ▼]     │
│ [Expandable sections for each award category]           │
└─────────────────────────────────────────────────────────┘
```

### **Theme Detail View (Single Winner Programs - Retrobit/RPG/GotWotY)**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Themes                                        │
├─────────────────────────────────────────────────────────┤
│ Retrobit Week 34 - August 2025            🏆 Active    │
├─────────────────────────────────────────────────────────┤
│ Winner: [Single Game Card with special highlighting]    │
├─────────────────────────────────────────────────────────┤
│ All Nominations (8)                     [Filter ▼]     │
│ [Game Cards Grid with winner badge on winning game]    │
└─────────────────────────────────────────────────────────┘
```

### **Theme Detail View (Upcoming - Privacy Protected)**

```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Themes                                        │
├─────────────────────────────────────────────────────────┤
│ Upcoming GotM Theme - September 2025          📅 Soon   │
├─────────────────────────────────────────────────────────┤
│ Winner: Not yet selected                               │
├─────────────────────────────────────────────────────────┤
│ Current Nominations by Release Year Category            │
│ ┌─────────┬─────────┬─────────────────────────────────┐ │
│ │ pre 96  │ 96-01   │           02+                   │ │
│ │   (3)   │   (5)   │           (7)                   │ │
│ │ ███░░░  │ █████░  │ ███████████████░░░░░░░░░░░░░░░  │ │
│ └─────────┴─────────┴─────────────────────────────────┘ │
│                                                         │
│ Current Nominations (15)                [Filter ▼]     │
│ [Game Cards Grid with category badges, no winner badge]│
└─────────────────────────────────────────────────────────┘
```

### **Status Icons**

- **🏆** = Current (active with winner)
- **📅** = Upcoming (future or no winner yet)
- **✅** = Historical (completed)

---

## 🏗️ **Component Architecture**

### **Leveraging Existing Patterns**

Following established patterns from current codebase:

**Store Pattern (like DbStore.ts):**

```typescript
// Extend existing DbStore or create ThemeStore following same pattern
class ThemeStore {
  themes: ThemeWithStatus[] = [];
  currentThemes: CurrentTheme[] = [];
  upcomingThemes: ThemeWithStatus[] = [];

  constructor(private rootStore: RootStore) {
    // Initialize like existing stores
  }

  // Follow existing query patterns
  getThemeById(id: number): ThemeWithStatus | null;
  getCurrentThemes(): CurrentTheme[];
  getUpcomingThemes(): ThemeWithStatus[];
  getHistoricalThemes(filters: ThemeFilters): ThemeWithStatus[];
}
```

**Database Extension (like initDbClient.ts):**

```typescript
// Add to existing initDbClient return object
return {
  // ... existing methods

  // New theme methods following existing patterns
  getThemeById: (id: number) => {
    /* use themeDto */
  },
  getCurrentThemes: () => {
    /* privacy-aware query */
  },
  getUpcomingThemes: () => {
    /* privacy-protected */
  },
  getThemeNominations: (themeId: number) => {
    /* use nominationListItemDto */
  },
  getThemesByFilters: (filters: ThemeFilters) => {
    /* filtered results */
  },
};
```

### **File Structure**

```
src/pages/Themes/
├── index.tsx                 # Route export (like existing pages)
├── ThemeBrowser.tsx          # Main page component
├── components/
│   ├── CurrentThemes.tsx     # Active themes dashboard
│   ├── UpcomingThemes.tsx    # Future themes (privacy-aware)
│   ├── ThemeHistory.tsx      # Historical themes table (like Games.tsx pattern)
│   ├── ThemeDetail.tsx       # Individual theme view (like GameDetails.tsx)
│   ├── ThemeCard.tsx         # Reusable theme card
│   ├── CategoryBreakdown.tsx # Year category visualization
│   ├── ThemeFilters.tsx      # Filtering controls (like Settings.tsx)
│   └── PrivacyWrapper.tsx    # Handles upcoming theme privacy
└── hooks/
    ├── useThemes.ts          # Theme data fetching
    ├── useCurrentThemes.ts   # Current active themes
    ├── useUpcomingThemes.ts  # Upcoming themes (privacy-aware)
    └── useThemeDetail.ts     # Individual theme details
```

### **Route Integration (Following Existing Pattern)**

```typescript
// Add to existing router in main.tsx
<Route path="/themes" element={<ThemeBrowser />} />
<Route path="/themes/:themeId" element={<ThemeDetail />} />

// Add to Navigation.tsx (following existing pattern)
<NavLink to="/themes" className={({ isActive }) => isActive ? 'active' : ''}>
  Themes
</NavLink>
```

### **Component Reuse Strategy**

- **Game Display**: Reuse existing game card components from Games page
- **Pagination**: Use recently fixed Pagination component
- **Settings Pattern**: Follow Settings.tsx for filtering UI
- **Navigation**: Extend existing Navigation.tsx
- **Store Pattern**: Follow DbStore.ts architecture
- **Query Pattern**: Extend Queries.ts with theme-specific queries

---

## 🔧 **Database Integration**

### **Extending Existing Query Infrastructure**

**Add to `/src/data/Queries.ts` (following existing patterns):**

```sql
-- Reuse existing coalescedTitle pattern
const coalescedTitle = `COALESCE([public.games].title_world, [public.games].title_usa, [public.games].title_eu, [public.games].title_jap, [public.games].title_other) AS title`;

-- Theme status with privacy handling (extends existing theme queries)
export const getThemesWithStatus = `
SELECT
  t.id,
  t.nomination_type,
  t.creation_date,
  t.description,
  t.created_at,
  t.updated_at,
  CASE
    WHEN t.creation_date <= date('now') AND EXISTS(
      SELECT 1 FROM [public.nominations] n WHERE n.theme_id = t.id AND n.winner = 1
    ) AND t.creation_date = (
      SELECT MAX(creation_date) FROM [public.themes] t2
      WHERE t2.nomination_type = t.nomination_type
      AND t2.creation_date <= date('now')
      AND EXISTS(SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = t2.id AND n2.winner = 1)
    ) THEN 'current'
    WHEN t.creation_date > date('now') OR (
      t.creation_date <= date('now') AND NOT EXISTS(
        SELECT 1 FROM [public.nominations] n WHERE n.theme_id = t.id AND n.winner = 1
      )
    ) THEN 'upcoming'
    ELSE 'historical'
  END as status,
  CASE
    WHEN t.creation_date > date('now') OR (
      t.creation_date <= date('now') AND NOT EXISTS(
        SELECT 1 FROM [public.nominations] n3 WHERE n3.theme_id = t.id AND n3.winner = 1
      )
    ) THEN NULL  -- Privacy: hide upcoming theme titles
    ELSE t.title
  END as display_title,
  COUNT(n.id) as nomination_count,
  COUNT(CASE WHEN n.winner = 1 THEN 1 END) as winner_count
FROM [public.themes] t
LEFT JOIN [public.nominations] n ON t.id = n.theme_id
GROUP BY t.id, t.title, t.nomination_type, t.creation_date
ORDER BY t.creation_date DESC, t.nomination_type;`;

-- Current winners (updated for multiple winners per theme)
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
    WHERE t2.creation_date <= date('now')
    AND t2.creation_date = (
        SELECT MAX(t3.creation_date)
        FROM [public.themes] t3
        WHERE t3.nomination_type = t2.nomination_type
        AND t3.creation_date <= date('now')
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

-- GotY themes grouped by year (same creation_date, multiple themes)
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

-- Get all themes for a specific GotY year
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

-- Theme winners with category information (for GotM multiple winners)
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

-- Theme detail with categories (adapts existing nominationCountByThemeByCategory)
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

-- Upcoming themes (privacy-protected, extends existing patterns)
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
WHERE t.creation_date > date('now')
   OR (t.creation_date <= date('now') AND NOT EXISTS(
       SELECT 1 FROM [public.nominations] n2 WHERE n2.theme_id = t.id AND n2.winner = 1
   ))
GROUP BY t.id, t.nomination_type, t.creation_date, t.description, t.created_at, t.updated_at
ORDER BY t.creation_date ASC, t.nomination_type;`;
```

### **Extending Database Client (initDbClient.ts)**

**Add to existing return object:**

```typescript
// Following existing patterns like getGameById, getNominationsByGameId
getThemesWithStatus: () => {
  return db?.exec(getThemesWithStatus)[0]?.values.map((x) => themeWithStatusDto(x)) ?? [];
},
getCurrentWinners: () => {
  return db?.exec(getCurrentWinners)[0]?.values.map((x) => currentThemeDto(x)) ?? [];
},
getUpcomingThemes: () => {
  return db?.exec(getUpcomingThemes)[0]?.values.map((x) => themeWithStatusDto(x)) ?? [];
},
getThemeDetail: (themeId: number) => {
  return db?.exec(getThemeDetailWithCategories(themeId))[0]?.values.map((x) => nominationWithGameDto(x)) ?? [];
},
getThemeById: (id: number) => {
  return db?.exec(`SELECT * FROM [public.themes] WHERE id = ${id} LIMIT 1;`)[0]?.values.map((x) => themeDto(x))[0] ?? null;
}
```

### **New DTOs (Following Existing Patterns)**

```typescript
// Add to models/game.ts following existing DTO patterns
export const themeWithStatusDto = (data: any[]): ThemeWithStatus => {
  const [
    id,
    nomination_type,
    creation_date,
    description,
    created_at,
    updated_at,
    status,
    display_title,
    nomination_count,
    winner_count,
  ] = data;
  return {
    id,
    creation_date,
    title: display_title, // Privacy-aware title
    description,
    created_at,
    updated_at,
    nomination_type,
    status,
    displayTitle:
      display_title || `Upcoming ${nomination_type.toUpperCase()} Theme`,
    nominationCount: nomination_count,
    categoryBreakdown: {}, // Computed separately
  } as ThemeWithStatus;
};

export const nominationWithGameDto = (data: any[]): NominationWithGame => {
  // Combines existing nominationDto and gameDto patterns
  const [
    theme_id,
    title,
    nomination_type,
    creation_date,
    description,
    game_title,
    game_id,
    year,
    screenscraper_id,
    system,
    developer,
    genre,
    img_url,
    time_to_beat,
    winner,
    nomination_description,
    user_name,
    year_category,
  ] = data;

  return {
    // Nomination fields
    id: 0, // Will be set separately
    nomination_type,
    description: nomination_description,
    winner,
    game_id,
    user_id: 0, // Will be set separately
    theme_id,
    created_at: '',
    updated_at: '',

    // Game fields
    game: {
      id: game_id,
      title_world: game_title,
      year,
      system,
      developer,
      genre,
      img_url,
      time_to_beat,
      screenscraper_id,
      created_at: '',
      updated_at: '',
    } as Game,

    // Additional fields
    yearCategory: year_category,
    user_name,
  } as NominationWithGame;
};
```

---

## 🚀 **Implementation Phases (Updated)**

### **Phase 1: Database & Store Foundation** (Week 1)

**Leveraging existing infrastructure:**

- [ ] Extend `/src/data/Queries.ts` with theme queries (following existing patterns)
- [ ] Add theme methods to `/src/data/initDbClient.ts` (like existing getGameById pattern)
- [ ] Extend `/src/models/game.ts` with new interfaces (ThemeWithStatus, etc.)
- [ ] Create new DTOs following existing patterns (themeWithStatusDto, etc.)
- [ ] Extend DbStore or create ThemeStore following existing MobX patterns
- [ ] Test database queries and privacy logic

### **Phase 2: Core Components** (Week 2)

**Following existing component patterns:**

- [ ] Create `/src/pages/Themes/` directory structure
- [ ] Build ThemeBrowser.tsx main page (following Games.tsx pattern)
- [ ] Create CurrentThemes.tsx dashboard (reuse game display components)
- [ ] Build ThemeHistory.tsx table (following existing table patterns)
- [ ] Implement basic routing (following existing route patterns)
- [ ] Add theme browser link to Navigation.tsx

### **Phase 3: Detail Views & Privacy** (Week 3)

**Reusing existing components:**

- [ ] Create ThemeDetail.tsx (following GameDetails.tsx pattern)
- [ ] Implement PrivacyWrapper.tsx for upcoming themes
- [ ] Build CategoryBreakdown.tsx visualization
- [ ] Create ThemeCard.tsx (reuse existing card patterns)
- [ ] Add winner highlighting using existing game display components
- [ ] Implement theme-to-game navigation (reuse existing links)

### **Phase 4: Filtering & Polish** (Week 4)

**Following existing patterns:**

- [ ] Create ThemeFilters.tsx (following Settings.tsx pattern)
- [ ] Add search functionality (historical themes only)
- [ ] Implement URL state management (following existing patterns)
- [ ] Add Pagination component integration (recently fixed)
- [ ] Mobile responsive design (following existing responsive patterns)
- [ ] Comprehensive testing using existing test patterns

---

## 🔄 **Integration Points with Existing Code**

### **Files to Modify:**

1. **`/src/Navigation.tsx`** - Add themes link following existing pattern
2. **`/src/main.tsx`** - Add theme routes to existing router
3. **`/src/data/Queries.ts`** - Add theme queries following existing patterns
4. **`/src/data/initDbClient.ts`** - Add theme methods following existing patterns
5. **`/src/stores/DbStore.ts`** - Add theme methods or create separate ThemeStore
6. **`/src/models/game.ts`** - Add new interfaces extending existing ones

### **Existing Components to Reuse:**

- **Game display components** from Games page for showing nominations
- **Pagination component** for theme lists (recently fixed)
- **Settings component pattern** for filtering UI
- **Navigation patterns** for routing and links
- **Card components** for theme display
- **Table patterns** for theme history

### **Existing Queries to Adapt:**

- **`nominationCountByThemeByCategory`** - Already has year categorization logic
- **`getNominationData`** - Shows nominations with theme context
- **`coalescedTitle`** pattern - For consistent game title display
- **Existing winner queries** - Pattern for current theme winners

### **Testing Strategy:**

- Follow existing test patterns in `__tests__` directory
- Unit tests for new DTOs and interfaces
- Integration tests for theme components
- Database query tests following existing patterns
- Privacy protection tests for upcoming themes

---

## 🎛️ **User Experience Flow**

### **Navigation Flow**

1. **Landing**: `/themes` - Shows current active themes + upcoming + history table
2. **Filter by Program**: `/themes?type=gotm` - Filter to specific program
3. **Filter by Year**: `/themes?year=2025` - Filter to specific year
4. **Theme Detail**: `/themes/123` - Individual theme with nominations
5. **Game Detail**: `/games/456` - Existing game detail page (from theme)

### **Privacy Handling**

- Upcoming theme titles are never exposed in API responses
- Display titles use generic format: "Upcoming [TYPE] Theme"
- Nominations for upcoming themes are still visible (this is allowed)
- Theme detail pages for upcoming themes show nominations but no theme name

### **Filtering Options**

- **Program Type**: All, GotM, Retrobit, RPG, GotY, GotWotY
- **Year**: Dropdown with available years
- **Status**: All, Current, Upcoming, Historical
- **Search**: Text search through historical theme titles only (no upcoming themes)

---

## 📋 **Development Advantages from Existing Codebase**

### **🎯 Significant Time Savings:**

- **Theme interface already exists** - No need to create from scratch
- **NominationType enum perfect** - Covers all program types
- **Database infrastructure solid** - Just extend existing patterns
- **Year categorization logic exists** - Adapt `nominationCountByThemeByCategory`
- **Game display components ready** - Reuse for theme nominations
- **Navigation patterns established** - Easy integration
- **Testing patterns proven** - Follow existing test structure

### **🔒 Privacy Implementation:**

- Database-level privacy filtering (upcoming themes)
- Client-side display name generation
- Search exclusion for upcoming themes
- API response validation

### **📱 Responsive Design:**

Following existing responsive patterns from Games and other pages

### **⚡ Performance:**

- Leverage existing SQL.js caching
- Reuse existing query optimization patterns
- Follow established component performance patterns

---

## 🎯 **Success Criteria (Updated)**

### **Functional Requirements**

- [ ] Users can browse all historical themes using existing UI patterns
- [ ] Current active themes prominently displayed (reusing game components)
- [ ] Upcoming theme titles never exposed (database-level protection)
- [ ] Nominations properly categorized using existing year logic
- [ ] Winners clearly highlighted using existing game display
- [ ] Filtering works using existing Settings patterns
- [ ] Mobile experience follows existing responsive patterns

### **Privacy Requirements**

- [ ] Upcoming theme names never visible in UI or API
- [ ] Search excludes upcoming themes
- [ ] Theme detail pages protect upcoming theme names
- [ ] Database queries filter at source level

### **Integration Requirements**

- [ ] Seamless navigation using existing patterns
- [ ] Consistent with existing design system
- [ ] Works with existing game detail functionality
- [ ] Maintains existing accessibility standards
- [ ] Follows existing testing patterns

### **Performance Requirements**

- [ ] Page loads match existing page performance
- [ ] Filtering responsive using existing patterns
- [ ] Mobile experience smooth like existing pages
- [ ] Large theme lists paginated using existing Pagination component

---

## 📋 **Next Steps**

1. **Immediate**: Begin Phase 1 - extend existing database infrastructure
2. **Database**: Add theme queries to existing Queries.ts
3. **Models**: Extend existing interfaces in models/game.ts
4. **Store**: Add theme methods to existing DbStore or create ThemeStore
5. **Components**: Create theme browser following existing page patterns
6. **Integration**: Add routing and navigation following existing patterns

This updated plan leverages approximately **70% existing codebase infrastructure**, significantly reducing development time while ensuring consistency with established patterns and maintaining the privacy requirements for upcoming themes.
