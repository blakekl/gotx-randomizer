# Unit Testing Plan - GotX Randomizer (Main Branch)

## Overview

This document outlines a comprehensive plan to implement unit tests for the gotx-randomizer project using Vitest, based on the **main branch** structure. The goal is to achieve thorough coverage and test edge cases to ensure safe contributions from other developers.

## Key Differences from Current Branch

The main branch has a different structure than the current `newHomePage` branch:

### Main Branch Structure:

- **No Home page** - Randomizer is the root route (`/`)
- **Different store setup** - Uses React Context instead of RootStore pattern
- **Simpler routing** - Router is inside main content, not wrapping Navigation
- **Store initialization** - Stores are created directly in context, not through RootStore

### Files That Don't Exist in Main:

- `src/pages/Home/Home.tsx`
- `src/stores/RootStore.ts`

### Different Store Pattern in Main:

```typescript
// main branch: src/stores/index.tsx
export default createContext({
  dbStore: new DbStore(),
  settingsStore: new SettingsStore(),
});

// vs current branch: RootStore pattern with dependency injection
```

## Testing Stack Setup

### Core Testing Dependencies

```json
{
  "devDependencies": {
    "vitest": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "jsdom": "^25.0.1",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.5.2",
    "msw": "^2.6.8",
    "happy-dom": "^15.11.6"
  }
}
```

### Configuration Files Needed

1. `vitest.config.ts` - Main Vitest configuration
2. `src/test-utils/setup.ts` - Test environment setup
3. `src/test-utils/test-utils.tsx` - Custom render utilities
4. `src/test-utils/mocks/` - Mock implementations

## Testing Architecture (Main Branch)

### Test File Structure

```
src/
├── __tests__/
│   ├── unit/
│   │   ├── models/
│   │   ├── stores/
│   │   ├── data/
│   │   └── utils/
│   ├── integration/
│   │   ├── pages/
│   │   └── components/
│   └── e2e/ (future consideration)
├── test-utils/
│   ├── setup.ts
│   ├── test-utils.tsx
│   ├── mocks/
│   │   ├── mockDbClient.ts
│   │   ├── mockSqlJs.ts
│   │   └── mockLocalStorage.ts
│   └── fixtures/
│       ├── gameData.ts
│       ├── userData.ts
│       └── nominationData.ts
```

## Testing Categories & Priorities

### Phase 1: Core Business Logic (High Priority)

#### 1. Models & DTOs (`src/models/game.ts`)

**Test Coverage**: 95%+
**Files to Test**:

- `gameDto()` function
- `nominationDto()` function
- `themeDto()` function
- `userDto()` function
- `nominationListItemDto()` function
- `completionsByUserIdDto()` function
- `labeledStatDto()` function
- `userListItemDto()` function
- `nominationTypeToPoints()` function

**Test Cases**:

```typescript
// Example test structure
describe('gameDto', () => {
  it('should convert array data to Game object correctly');
  it('should handle null/undefined values gracefully');
  it('should preserve all required fields');
  it('should handle missing optional fields');
  it('should throw error for invalid data structure');
});

describe('nominationTypeToPoints', () => {
  it('should return 3 points for RPG with retroachievements');
  it('should return 1 point for GOTM after theme 16');
  it('should return 0.5 points for RETROBIT after theme 16');
  it('should return 0 points for themes <= 16');
  it('should handle edge cases with invalid theme numbers');
});
```

#### 2. Data Layer (`src/data/`)

**Test Coverage**: 90%+
**Files to Test**:

- `Queries.ts` - SQL query string validation
- `initDbClient.ts` - Database client initialization
- `index.ts` - Data layer exports

**Test Cases**:

```typescript
describe('Database Queries', () => {
  it('should generate valid SQL for each query');
  it('should handle parameterized queries correctly');
  it('should escape special characters in user input');
});

describe('initDbClient', () => {
  it('should initialize database client successfully');
  it('should handle database loading errors gracefully');
  it('should return all expected query methods');
  it('should handle SQL.js initialization failures');
});
```

#### 3. MobX Stores (`src/stores/`) - **Main Branch Pattern**

**Test Coverage**: 95%+
**Files to Test**:

- `DbStore.ts` - Database operations and state management
- `SettingsStore.ts` - Settings persistence and state
- `index.tsx` - React Context store setup (**Main branch specific**)
- `useStores.ts` - Store hook

**Test Cases**:

```typescript
describe('DbStore (Main Branch)', () => {
  describe('constructor', () => {
    it('should initialize with empty game collections');
    it('should load data from dbClient on construction');
    it('should handle dbClient errors gracefully');
    it('should work without RootStore dependency injection'); // Main branch specific
  });

  describe('setAllGames', () => {
    it('should update all game collections');
    it('should trigger MobX reactions');
  });

  describe('query methods', () => {
    it('should return empty arrays when dbClient fails');
    it('should pass through dbClient results correctly');
    it('should handle null/undefined responses');
  });
});

describe('SettingsStore (Main Branch)', () => {
  describe('constructor', () => {
    it('should initialize without RootStore dependency'); // Main branch specific
    it('should load settings from localStorage on init');
    it('should use default values when localStorage is empty');
  });

  describe('localStorage persistence', () => {
    it('should save settings to localStorage on changes');
    it('should handle localStorage errors gracefully');
  });

  describe('filter settings', () => {
    it('should toggle game type inclusions correctly');
    it('should validate HLTB filter ranges');
    it('should handle invalid filter values');
  });

  describe('hidden games', () => {
    it('should add/remove games from hidden list');
    it('should persist hidden games to localStorage');
    it('should handle duplicate additions gracefully');
  });
});

describe('Store Context (Main Branch)', () => {
  describe('context creation', () => {
    it('should create stores correctly');
    it('should provide both dbStore and settingsStore');
    it('should handle store initialization errors');
  });
});

describe('useStores hook (Main Branch)', () => {
  it('should return store context');
  it('should throw error when used outside provider');
  it('should provide access to both stores');
});
```

### Phase 2: React Components (Medium Priority)

#### 4. Utility Components (`src/components/`)

**Test Coverage**: 90%+
**Files to Test**:

- `Pagination.tsx` - Pagination logic and UI

**Test Cases**:

```typescript
describe('Pagination', () => {
  describe('page calculation', () => {
    it('should calculate correct page count');
    it('should handle edge cases (0 items, 1 item)');
    it('should update page count when pageSize changes');
  });

  describe('page navigation', () => {
    it('should call onPageChange with correct range');
    it('should disable previous button on first page');
    it('should disable next button on last page');
    it('should handle page size dropdown changes');
  });

  describe('ellipsis logic', () => {
    it('should show ellipsis when needed');
    it('should hide ellipsis for small page counts');
    it('should handle current page at boundaries');
  });
});
```

#### 5. Core Pages (`src/pages/`) - **Main Branch Routes**

**Test Coverage**: 85%+
**Files to Test**:

- `Randomizer/Randomizer.tsx` - Core randomization logic (**Root route in main**)
- `Randomizer/Settings/Settings.tsx` - Settings UI
- `Randomizer/GameDisplay/GameDisplay.tsx` - Game display logic
- `Games/Games.tsx` - Game browsing
- `Users/Users.tsx` - User management
- `Statistics/Statistics.tsx` - Statistics display
- **NOT TESTING**: `Home/Home.tsx` (doesn't exist in main)

**Test Cases**:

```typescript
describe('Randomizer (Main Branch - Root Route)', () => {
  describe('routing', () => {
    it('should render at root path (/)'); // Main branch specific
    it('should be the default page');
  });

  describe('game pool generation', () => {
    it('should filter games based on settings');
    it('should handle empty game pools');
    it('should remove duplicates from pool');
    it('should apply HLTB filters correctly');
    it('should respect hidden games setting');
  });

  describe('randomization', () => {
    it('should select random games from pool');
    it('should handle single game in pool');
    it('should cycle through pool when exhausted');
  });

  describe('game hiding', () => {
    it('should toggle game hidden state');
    it('should update pool when game is hidden');
    it('should persist hidden state');
  });
});

describe('Settings', () => {
  describe('dropdown behavior', () => {
    it('should toggle dropdown visibility');
    it('should close dropdown on outside click');
  });

  describe('filter controls', () => {
    it('should update store when checkboxes change');
    it('should update HLTB slider correctly');
    it('should validate slider ranges');
  });
});
```

### Phase 3: Integration Tests (Medium Priority)

#### 6. Page Integration Tests - **Main Branch Routing**

**Test Coverage**: 80%+
**Focus Areas**:

- Store integration with components
- Navigation between pages (no Home page)
- Data flow from stores to UI
- Error boundary behavior

**Test Cases**:

```typescript
describe('Randomizer Integration (Main Branch)', () => {
  it('should load games and display randomizer at root');
  it('should update UI when settings change');
  it('should handle database loading errors');
  it('should persist settings across page reloads');
});

describe('Navigation Integration (Main Branch)', () => {
  it('should navigate from root (/) to other pages');
  it('should navigate between /stats, /games, /users');
  it('should maintain store state across navigation');
  it('should handle invalid routes');
  it("should not have /randomizer route (since it's at root)"); // Main branch specific
});
```

## Mock Strategy - **Main Branch Context Pattern**

### 1. Store Context Mocking

```typescript
// src/test-utils/mocks/mockStoreContext.ts
export const createMockStoreContext = (overrides = {}) => {
  const mockDbStore = createMockDbStore();
  const mockSettingsStore = createMockSettingsStore();

  return createContext({
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
    ...overrides,
  });
};
```

### 2. Database Mocking

```typescript
// src/test-utils/mocks/mockDbClient.ts
export const createMockDbClient = (overrides = {}) => ({
  getGotmRunnerup: vi.fn(() => mockGames.gotmRunnerUp),
  getGotmWinners: vi.fn(() => mockGames.gotmWinners),
  getRetrobits: vi.fn(() => mockGames.retrobits),
  // ... all other methods
  ...overrides,
});
```

### 3. Test Utilities - **Main Branch Context**

```typescript
// src/test-utils/test-utils.tsx
export const renderWithStores = (
  ui: React.ReactElement,
  options: {
    mockStores?: {
      dbStore?: Partial<DbStore>;
      settingsStore?: Partial<SettingsStore>;
    };
    route?: string;
  } = {}
) => {
  const mockContext = createMockStoreContext(options.mockStores);

  return render(
    <Router initialEntries={[options.route || '/']}>
      <mockContext.Provider value={mockContext._currentValue}>
        {ui}
      </mockContext.Provider>
    </Router>
  );
};
```

## Key Adjustments for Main Branch

### 1. Store Testing Differences

- **No RootStore class** to test
- **Test React Context creation** instead
- **Test store initialization** without dependency injection
- **Different useStores hook** behavior

### 2. Routing Testing Differences

- **Randomizer is at root (`/`)** not `/randomizer`
- **No Home page** to test
- **Different navigation flow** testing

### 3. Component Testing Adjustments

- **Test Randomizer as root component**
- **No Home page navigation** tests
- **Different default route** behavior

## Implementation Phases - **Main Branch**

### Phase 1: Setup & Core Logic (Week 1)

1. Install and configure Vitest
2. Set up test utilities and mocks (Context-based)
3. Test models and DTOs
4. Test data layer functions
5. **Estimated Time**: 12-16 hours

### Phase 2: Store Testing (Week 2)

1. Test DbStore functionality (no RootStore)
2. Test SettingsStore functionality (no RootStore)
3. Test Context creation and useStores hook
4. **Estimated Time**: 8-12 hours (simpler than RootStore pattern)

### Phase 3: Component Testing (Week 3)

1. Test utility components (Pagination)
2. Test core page components (Randomizer as root)
3. Test component integration with Context stores
4. **Estimated Time**: 14-18 hours

### Phase 4: Integration & Edge Cases (Week 4)

1. Integration tests (Context-based)
2. Error handling tests
3. Edge case coverage
4. Performance tests
5. **Estimated Time**: 8-12 hours

## Coverage Targets - **Main Branch**

### Overall Coverage Goals

- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 90%+
- **Lines**: 85%+

### Priority Coverage

1. **Models/DTOs**: 95%+ (Critical business logic)
2. **Stores**: 95%+ (State management - simpler without RootStore)
3. **Data Layer**: 90%+ (Database operations)
4. **Core Components**: 85%+ (User-facing functionality)
5. **Utility Components**: 80%+ (Supporting functionality)

## Testing Commands

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:related": "vitest related"
  }
}
```

## Summary of Main Branch Adjustments

### Simpler Architecture = Easier Testing

- **No RootStore complexity** - Direct Context testing
- **Fewer files to test** - No Home page, no RootStore
- **Simpler store initialization** - Direct instantiation in Context
- **Clearer routing** - Randomizer at root is straightforward

### Estimated Time Reduction

- **Total Time**: 42-58 hours (vs 46-62 hours for newHomePage branch)
- **Phase 2 reduced** by 2-4 hours due to simpler store pattern
- **Phase 3 reduced** by 2-4 hours due to no Home page testing

This plan is specifically tailored to the main branch structure and will provide comprehensive test coverage for the current stable codebase, making it safe for external contributions.
