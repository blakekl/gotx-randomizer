import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Add basic CSS for dropdown behavior in tests
const style = document.createElement('style');
style.textContent = `
  .dropdown:not(.is-active) .dropdown-menu {
    display: none;
  }
  .dropdown.is-active .dropdown-menu {
    display: block;
  }
`;
document.head.appendChild(style);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock SQL.js
vi.mock('sql.js', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      Database: vi.fn(() => ({
        exec: vi.fn(() => [{ values: [] }]),
        close: vi.fn(),
      })),
    }),
  ),
}));

// Mock the SQLite database file
vi.mock('../gotx-randomizer.sqlite?url', () => ({
  default: 'mock-database-url',
}));

// Mock the database initialization
vi.mock('../data/initDbClient', () => ({
  default: vi.fn().mockResolvedValue({
    exec: vi.fn(() => [{ values: [] }]),
    close: vi.fn(),
  }),
}));

// Mock data layer
vi.mock('../data/index', () => ({
  getAllGames: vi.fn(() => []),
  getAllUsers: vi.fn(() => []),
  getAllCompletions: vi.fn(() => []),
  getGameById: vi.fn(() => null),
  getUserById: vi.fn(() => null),
  searchGames: vi.fn(() => []),
  filterGamesByGenre: vi.fn(() => []),
  getGameStats: vi.fn(() => ({})),
  getUserStats: vi.fn(() => ({})),
}));

// Mock labeled stat data for charts
const mockLabeledStats = [
  { label: 'Game 1', value: 10 },
  { label: 'Game 2', value: 20 },
  { label: 'Game 3', value: 15 },
];

// Mock user list items
const mockUserListItems = [
  {
    id: 1,
    username: 'user1',
    display_name: 'User One',
    total_points: 1500,
    total_completions: 25,
    join_date: '2023-01-01',
    success_percentage: 85.5,
  },
];

// Mock DbStore class
vi.mock('../stores/DbStore', () => ({
  default: vi.fn().mockImplementation(() => ({
    games: [],
    users: [],
    completions: [],
    isLoading: false,
    error: null,

    // Basic CRUD methods
    getGameById: vi.fn(() => null),
    getUserById: vi.fn(() => null),
    getCompletionsByUserId: vi.fn(() => []),
    getCompletionsByGameId: vi.fn(() => []),

    // Search and filter methods
    searchGames: vi.fn(() => []),
    filterGamesByGenre: vi.fn(() => []),
    filterGamesBySystem: vi.fn(() => []),

    // User-specific methods for Users page
    getNominationSuccessPercentByUser: vi.fn(() => mockUserListItems),

    // Statistics methods needed by Statistics component
    getMostCompletedGames: vi.fn(() => mockLabeledStats),
    getMostCompletedGotmGames: vi.fn(() => mockLabeledStats),
    getMostCompletedGotyGames: vi.fn(() => mockLabeledStats),
    getMostCompletedRetrobitGames: vi.fn(() => mockLabeledStats),
    getMostCompletedRetrobitYearGames: vi.fn(() => mockLabeledStats),
    getMostCompletedRpgGames: vi.fn(() => mockLabeledStats),
    getNewestCompletions: vi.fn(() => mockLabeledStats),
    getNewestGotmCompletions: vi.fn(() => mockLabeledStats),
    getNewestGotwotyCompletions: vi.fn(() => mockLabeledStats),
    getNewestGotyCompletions: vi.fn(() => mockLabeledStats),
    getNewestRetrobitCompletions: vi.fn(() => mockLabeledStats),
    getNewestRetrobitYearCompletions: vi.fn(() => mockLabeledStats),
    getNewestRpgCompletions: vi.fn(() => mockLabeledStats),
    getHighestRatedGames: vi.fn(() => mockLabeledStats),
    getHighestRatedGotmGames: vi.fn(() => mockLabeledStats),
    getHighestRatedGotyGames: vi.fn(() => mockLabeledStats),
    getHighestRatedRetrobitGames: vi.fn(() => mockLabeledStats),
    getHighestRatedRetrobitYearGames: vi.fn(() => mockLabeledStats),
    getHighestRatedRpgGames: vi.fn(() => mockLabeledStats),
    getLowestRatedGames: vi.fn(() => mockLabeledStats),
    getLowestRatedGotmGames: vi.fn(() => mockLabeledStats),
    getLowestRatedGotyGames: vi.fn(() => mockLabeledStats),
    getLowestRatedRetrobitGames: vi.fn(() => mockLabeledStats),
    getLowestRatedRetrobitYearGames: vi.fn(() => mockLabeledStats),
    getLowestRatedRpgGames: vi.fn(() => mockLabeledStats),

    // General statistics methods
    getGameStats: vi.fn(() => ({
      totalGames: 0,
      totalCompletions: 0,
      averageRating: 0,
      mostPopularGenre: 'Action',
    })),
    getUserStats: vi.fn(() => ({
      totalUsers: 0,
      activeUsers: 0,
      averageCompletions: 0,
    })),

    // Data loading methods
    loadGames: vi.fn().mockResolvedValue([]),
    loadUsers: vi.fn().mockResolvedValue([]),
    loadCompletions: vi.fn().mockResolvedValue([]),
    refreshData: vi.fn().mockResolvedValue(undefined),

    // List methods
    getUserList: vi.fn(() => []),
    getGameList: vi.fn(() => []),
    getCompletionList: vi.fn(() => []),
  })),
}));

// Mock SettingsStore class
vi.mock('../stores/SettingsStore', () => ({
  default: vi.fn().mockImplementation(() => ({
    theme: 'light',
    language: 'en',
    itemsPerPage: 10,
    showCompletedGames: true,
    sortBy: 'name',
    sortOrder: 'asc',

    // Methods
    setTheme: vi.fn(),
    setLanguage: vi.fn(),
    setItemsPerPage: vi.fn(),
    setSortBy: vi.fn(),
    setSortOrder: vi.fn(),
    setShowCompletedGames: vi.fn(),

    // Persistence methods
    loadSettings: vi.fn().mockResolvedValue(undefined),
    saveSettings: vi.fn().mockResolvedValue(undefined),
    resetSettings: vi.fn(),

    // Computed properties
    get isDarkTheme() {
      return this.theme === 'dark';
    },
    get isLightTheme() {
      return this.theme === 'light';
    },

    // Validation methods
    validateSettings: vi.fn().mockReturnValue(true),
    getDefaultSettings: vi.fn().mockReturnValue({
      theme: 'light',
      language: 'en',
      itemsPerPage: 10,
      showCompletedGames: true,
      sortBy: 'name',
      sortOrder: 'asc',
    }),
  })),
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console warnings in tests unless explicitly testing them
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React Router Future Flag Warning')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
