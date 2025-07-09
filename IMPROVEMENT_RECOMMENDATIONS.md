# GotX Randomizer - Improvement Recommendations

This document outlines recommended improvements for the gotx-randomizer project, organized by priority and impact.

## Current State Analysis

- **Bundle Size**: 689KB JS (233KB gzipped) + 2.6MB SQLite database
- **Architecture**: React + TypeScript + MobX + SQLite (client-side)
- **Performance Issues**: Large initial download, full database loaded in browser
- **Tech Stack**: Vite, Bulma CSS, Highcharts, React Router

## Performance Improvements

### 1. Bundle Size Optimization (High Priority)

**Problem**: 689KB JavaScript bundle is quite large for initial load.

**Solution**: Implement code splitting by route

```typescript
// src/main.tsx - Lazy load pages
import { lazy, Suspense } from 'react';

const Randomizer = lazy(() => import('./pages/Randomizer/Randomizer.tsx'));
const Statistics = lazy(() => import('./pages/Statistics/Statistics.tsx'));
const Games = lazy(() => import('./pages/Games/Games.tsx'));
const Users = lazy(() => import('./pages/Users/Users.tsx'));
const GameDetails = lazy(() => import('./pages/Games/GameDetails.tsx'));

// Wrap routes in Suspense
<Suspense fallback={<div className="loader">Loading...</div>}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/randomizer" element={<Randomizer />} />
    {/* ... other routes */}
  </Routes>
</Suspense>
```

**Expected Impact**: 30-50% reduction in initial bundle size

### 2. Tree-shake Highcharts (Medium Priority)

**Problem**: Importing entire Highcharts library when only using basic charts.

**Solution**: Import only needed modules

```typescript
// Instead of importing all of Highcharts
import Highcharts from 'highcharts/highcharts';
import HighchartsReact from 'highcharts-react-official';
// Only import what you need
```

### 3. Database Loading Optimization (High Priority)

**Problem**: Synchronous database initialization blocks UI.

**Solution**: Add async loading with proper states

```typescript
// src/stores/DbStore.ts - Add loading states and error handling
class DbStore {
  @observable isLoading = true;
  @observable loadError: string | null = null;

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.initializeData();
  }

  @action
  private async initializeData() {
    try {
      this.isLoading = true;
      this.loadError = null;

      // Load data asynchronously
      const [gotmRunnerUp, gotmWinners, retrobits, rpgRunnerUp, rpgWinners] =
        await Promise.all([
          dbClient.getGotmRunnerup(),
          dbClient.getGotmWinners(),
          dbClient.getRetrobits(),
          dbClient.getRpgRunnerup(),
          dbClient.getRpgWinners(),
        ]);

      this.setAllGames({
        gotmRunnerUp: gotmRunnerUp || [],
        gotmWinners: gotmWinners || [],
        retrobits: retrobits || [],
        rpgRunnerUp: rpgRunnerUp || [],
        rpgWinners: rpgWinners || [],
      });
    } catch (error) {
      this.loadError =
        error instanceof Error ? error.message : 'Failed to load data';
    } finally {
      this.isLoading = false;
    }
  }
}
```

### 4. Memoization and Performance (Medium Priority)

**Problem**: Expensive game pool calculations on every render.

**Solution**: Add React.memo and useMemo

```typescript
// src/pages/Randomizer/Randomizer.tsx
import { useMemo } from 'react';

const Randomizer = observer(() => {
  const { dbStore, settingsStore } = useStores();

  // Memoize expensive game pool calculation
  const gamePool = useMemo(() => {
    let newPoolArray: Game[] = [];
    if (settingsStore.includeGotmRunnerUp) {
      newPoolArray = [...newPoolArray, ...games.gotmRunnerUp];
    }
    // ... rest of filtering logic

    return newPoolArray
      .filter(/* your filters */)
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }, [
    settingsStore.includeGotmRunnerUp,
    settingsStore.includeGotmWinners,
    // ... other dependencies
  ]);

  // ... rest of component
});
```

## User Experience Improvements

### 5. Loading States and Error Handling (High Priority)

**Problem**: No feedback during loading, poor error handling.

**Solution**: Add comprehensive loading and error states

```typescript
// src/components/LoadingSpinner.tsx
export const LoadingSpinner = () => (
  <div className="has-text-centered">
    <div className="loader is-loading"></div>
    <p className="mt-4">Loading games...</p>
  </div>
);

// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="notification is-danger">
          <h4 className="title is-4">Something went wrong</h4>
          <p>Please refresh the page and try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### 6. Better Mobile Experience (Medium Priority)

**Problem**: Settings dropdown and slider difficult to use on mobile.

**Solution**: Mobile-specific CSS improvements

```css
/* src/index.css - Add mobile-specific improvements */
@media (max-width: 768px) {
  .dropdown-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.9);
  }

  .dropdown-content {
    max-height: 80vh;
    overflow-y: auto;
    margin: 10vh 5vw;
  }

  .horizontal-slider {
    height: 40px; /* Make slider easier to use on mobile */
  }
}
```

### 7. Keyboard Navigation (Low Priority)

**Problem**: No keyboard shortcuts for common actions.

**Solution**: Add keyboard shortcuts

```typescript
// src/pages/Randomizer/Randomizer.tsx
useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space' && gamePool.length > 1) {
      event.preventDefault();
      nextGame();
    }
    if (event.code === 'KeyH' && gamePool[currentGameIndex]) {
      event.preventDefault();
      settingsStore.toggleHiddenGame(gamePool[currentGameIndex].id);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [gamePool, currentGameIndex, nextGame, settingsStore]);
```

**Shortcuts**:

- `Space`: Reroll game
- `H`: Hide/unhide current game

## Code Quality Improvements

### 8. Better TypeScript Usage (Medium Priority)

**Problem**: Using @ts-expect-error comments, loose typing.

**Solution**: Fix TypeScript issues

```typescript
// src/stores/DbStore.ts - Remove @ts-expect-error
class DbStore {
  constructor(private rootStore?: RootStore) {
    // Make rootStore optional if not used
  }
}

// src/stores/SettingsStore.ts - Add proper types
interface SettingsStoreState {
  hltbFilter: [number, number]; // Tuple instead of number[]
  hltbMax: number;
  hltbMin: number;
  // ... other properties
}
```

### 9. Settings Persistence (Medium Priority)

**Problem**: Only some settings are persisted, no error handling.

**Solution**: Comprehensive settings persistence

```typescript
// src/stores/SettingsStore.ts
class SettingsStore {
  private readonly SETTINGS_KEY = 'gotx-settings';

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem(this.SETTINGS_KEY);
      if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(this, settings);
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }

  private saveSettings() {
    try {
      const settings = {
        includeGotmRunnerUp: this.includeGotmRunnerUp,
        includeGotmWinners: this.includeGotmWinners,
        includeRetrobits: this.includeRetrobits,
        includeRpgRunnerUp: this.includeRpgRunnerUp,
        includeRpgWinners: this.includeRpgWinners,
        includeHiddenGames: this.includeHiddenGames,
        hltbFilter: this.hltbFilter,
      };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  // Call saveSettings() in all toggle methods
}
```

## Feature Enhancements

### 10. PWA Support (Low Priority)

**Problem**: Not installable as a mobile app.

**Solution**: Add PWA capabilities

```typescript
// vite.config.ts - Add PWA plugin
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    // ... existing plugins
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,sqlite}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
      manifest: {
        name: 'GotX Randomizer',
        short_name: 'GotX',
        description: 'Random game selector for Retro Handhelds GotX program',
        theme_color: '#00d1b2',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
```

### 11. Analytics and Monitoring (Low Priority)

**Problem**: No insight into how users interact with the app.

**Solution**: Add simple analytics

```typescript
// src/utils/analytics.ts
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
) => {
  // Simple console logging for now, can be replaced with real analytics
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics:', eventName, properties);
  }

  // Could add Google Analytics, Plausible, or other analytics here
};

// Usage in Randomizer
const nextGame = () => {
  trackEvent('game_reroll', {
    poolSize: gamePool.length,
    filters: {
      gotmWinners: settingsStore.includeGotmWinners,
      retrobits: settingsStore.includeRetrobits,
      // ... other filters
    },
  });

  // ... existing logic
};
```

## Future Architecture Considerations

### Long-term Solution: API-First Architecture

**Current Problem**: 2.6MB SQLite database loaded entirely in browser, 15-minute sync delays.

**Recommended Solution**: Replace client-side SQLite with lightweight API backend.

**Benefits**:

- Real-time data (no 15-minute delay)
- Faster initial page loads
- Reduced bandwidth usage
- Better caching strategies
- Easier to scale

**Implementation Options**:

- Vercel Functions (if using Vercel)
- Netlify Functions (if using Netlify)
- AWS Lambda with API Gateway
- Simple VPS with Express server

This would be a significant architectural change but would solve the fundamental performance issues.

## Implementation Priority

### Phase 1 (Quick Wins - 1-2 days)

1. Code splitting by route
2. Loading states and error handling
3. Mobile CSS improvements
4. TypeScript fixes

### Phase 2 (Medium Effort - 3-5 days)

1. Database loading optimization
2. Memoization improvements
3. Settings persistence
4. Tree-shake Highcharts

### Phase 3 (Nice to Have - 1-2 days each)

1. PWA support
2. Keyboard navigation
3. Analytics
4. Additional UX improvements

### Phase 4 (Future - Major Effort)

1. API-first architecture migration

## Expected Results

After implementing Phase 1 & 2 improvements:

- **30-50% smaller initial bundle size**
- **Better mobile experience**
- **Improved loading performance**
- **Better error handling**
- **Cleaner, more maintainable code**

The improvements are designed to be incremental and non-breaking, allowing you to implement them gradually without disrupting the current functionality.
