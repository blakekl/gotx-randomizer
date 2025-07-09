# Unit Testing Plan - GotX Randomizer

## Overview

This document outlines a comprehensive plan to implement unit tests for the gotx-randomizer project using Vitest. The goal is to achieve thorough coverage and test edge cases to ensure safe contributions from other developers.

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

## Testing Architecture

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

#### 3. MobX Stores (`src/stores/`)

**Test Coverage**: 95%+
**Files to Test**:

- `DbStore.ts` - Database operations and state management
- `SettingsStore.ts` - Settings persistence and state
- `RootStore.ts` - Store composition
- `useStores.ts` - Store hook

**Test Cases**:

```typescript
describe('DbStore', () => {
  describe('constructor', () => {
    it('should initialize with empty game collections');
    it('should load data from dbClient on construction');
    it('should handle dbClient errors gracefully');
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

describe('SettingsStore', () => {
  describe('localStorage persistence', () => {
    it('should load settings from localStorage on init');
    it('should save settings to localStorage on changes');
    it('should handle localStorage errors gracefully');
    it('should use defaults when localStorage is empty');
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

#### 5. Core Pages (`src/pages/`)

**Test Coverage**: 85%+
**Files to Test**:

- `Randomizer/Randomizer.tsx` - Core randomization logic
- `Randomizer/Settings/Settings.tsx` - Settings UI
- `Randomizer/GameDisplay/GameDisplay.tsx` - Game display logic
- `Home/Home.tsx` - Navigation and layout
- `Games/Games.tsx` - Game browsing
- `Users/Users.tsx` - User management
- `Statistics/Statistics.tsx` - Statistics display

**Test Cases**:

```typescript
describe('Randomizer', () => {
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

#### 6. Page Integration Tests

**Test Coverage**: 80%+
**Focus Areas**:

- Store integration with components
- Navigation between pages
- Data flow from stores to UI
- Error boundary behavior

**Test Cases**:

```typescript
describe('Randomizer Integration', () => {
  it('should load games and display randomizer');
  it('should update UI when settings change');
  it('should handle database loading errors');
  it('should persist settings across page reloads');
});

describe('Navigation Integration', () => {
  it('should navigate between all pages');
  it('should maintain store state across navigation');
  it('should handle invalid routes');
});
```

### Phase 4: Edge Cases & Error Handling (High Priority)

#### 7. Error Scenarios

**Test Coverage**: 90%+
**Focus Areas**:

- Database loading failures
- Invalid data handling
- Network errors
- LocalStorage failures
- SQL.js initialization errors

**Test Cases**:

```typescript
describe('Error Handling', () => {
  describe('Database Errors', () => {
    it('should handle SQLite file loading failure');
    it('should handle SQL.js initialization failure');
    it('should handle malformed database data');
  });

  describe('LocalStorage Errors', () => {
    it('should handle localStorage quota exceeded');
    it('should handle localStorage disabled');
    it('should handle corrupted localStorage data');
  });

  describe('Data Validation', () => {
    it('should handle missing required fields');
    it('should handle invalid data types');
    it('should handle null/undefined responses');
  });
});
```

## Mock Strategy

### 1. Database Mocking

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

### 2. SQL.js Mocking

```typescript
// src/test-utils/mocks/mockSqlJs.ts
export const mockSqlJs = {
  Database: vi.fn(() => ({
    exec: vi.fn(),
    close: vi.fn(),
  })),
};
```

### 3. LocalStorage Mocking

```typescript
// src/test-utils/mocks/mockLocalStorage.ts
export const createMockLocalStorage = () => {
  const store = new Map();
  return {
    getItem: vi.fn((key) => store.get(key) || null),
    setItem: vi.fn((key, value) => store.set(key, value)),
    removeItem: vi.fn((key) => store.delete(key)),
    clear: vi.fn(() => store.clear()),
  };
};
```

### 4. Test Fixtures

```typescript
// src/test-utils/fixtures/gameData.ts
export const mockGames = {
  gotmWinners: [
    {
      id: 1,
      title_usa: 'Test Game 1',
      year: 1990,
      system: 'NES',
      // ... complete game object
    },
  ],
  // ... other game categories
};
```

## Test Utilities

### Custom Render Function

```typescript
// src/test-utils/test-utils.tsx
export const renderWithProviders = (
  ui: React.ReactElement,
  options: {
    initialStores?: Partial<RootStore>;
    route?: string;
  } = {},
) => {
  // Custom render with MobX stores and React Router
};
```

### Test Helpers

```typescript
// src/test-utils/helpers.ts
export const waitForDbLoad = () => {
  // Helper to wait for database loading
};

export const mockUserInteraction = {
  clickRandomize: () => {
    // Helper for user interactions
  },
  toggleSetting: (setting: string) => {
    // Helper for settings changes
  },
};
```

## Coverage Targets

### Overall Coverage Goals

- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 90%+
- **Lines**: 85%+

### Priority Coverage

1. **Models/DTOs**: 95%+ (Critical business logic)
2. **Stores**: 95%+ (State management)
3. **Data Layer**: 90%+ (Database operations)
4. **Core Components**: 85%+ (User-facing functionality)
5. **Utility Components**: 80%+ (Supporting functionality)

## Implementation Phases

### Phase 1: Setup & Core Logic (Week 1)

1. Install and configure Vitest
2. Set up test utilities and mocks
3. Test models and DTOs
4. Test data layer functions
5. **Estimated Time**: 12-16 hours

### Phase 2: Store Testing (Week 2)

1. Test DbStore functionality
2. Test SettingsStore functionality
3. Test store integration
4. **Estimated Time**: 10-14 hours

### Phase 3: Component Testing (Week 3)

1. Test utility components (Pagination)
2. Test core page components
3. Test component integration with stores
4. **Estimated Time**: 16-20 hours

### Phase 4: Integration & Edge Cases (Week 4)

1. Integration tests
2. Error handling tests
3. Edge case coverage
4. Performance tests
5. **Estimated Time**: 8-12 hours

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --cache --fix", "vitest related --run"]
  }
}
```

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

## Success Metrics

### Quality Gates

1. **All tests pass** before merging PRs
2. **Coverage thresholds met** (85% overall)
3. **No critical bugs** in core randomization logic
4. **Performance tests pass** (database loading < 5s)

### Developer Experience

1. **Fast test execution** (< 30s for full suite)
2. **Clear error messages** for test failures
3. **Easy mock setup** for new contributors
4. **Good test documentation** and examples

## Maintenance Strategy

### Regular Tasks

1. **Update test fixtures** when database schema changes
2. **Review coverage reports** monthly
3. **Update mocks** when external APIs change
4. **Refactor tests** when components change

### Documentation

1. **Testing guidelines** for contributors
2. **Mock usage examples**
3. **Common testing patterns**
4. **Troubleshooting guide**

This comprehensive testing plan will ensure your project is well-covered and safe for external contributions while maintaining high code quality standards.
