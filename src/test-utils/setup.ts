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
    name: 'User One',
    success_rate: 85.5,
    nominations: 30,
    wins: 26, // Changed from 25 to avoid duplicate with user2 nominations
  },
  {
    id: 2,
    name: 'User Two',
    success_rate: 78.2,
    nominations: 25,
    wins: 20,
  },
];

// Mock game data
const mockGame = {
  id: 1,
  title_usa: 'Test Game',
  year: 2020,
  system: 'PC',
  developer: 'Test Developer',
  genre: 'Action',
  img_url: 'https://example.com/game.jpg',
  time_to_beat: 10,
  screenscraper_id: 12345,
  created_at: '2023-01-01',
  updated_at: '2023-01-01',
};

// Mock the database initialization
vi.mock('../data/initDbClient', () => ({
  default: vi.fn().mockResolvedValue({
    exec: vi.fn(() => [{ values: [] }]),
    close: vi.fn(),
    // Add all the expected query methods
    getGotmRunnerup: vi.fn(() => []),
    getGotmWinners: vi.fn(() => []),
    getRetrobits: vi.fn(() => []),
    getRpgRunnerup: vi.fn(() => []),
    getRpgWinners: vi.fn(() => []),
    mostCompletedGames: vi.fn(() => mockLabeledStats),
    mostCompletedGotmGames: vi.fn(() => mockLabeledStats),
    mostCompletedGotyGames: vi.fn(() => mockLabeledStats),
    mostCompletedRetrobitGames: vi.fn(() => mockLabeledStats),
    mostCompletedRetrobitYearGames: vi.fn(() => mockLabeledStats),
    mostCompletedRpgGames: vi.fn(() => mockLabeledStats),
    newestCompletions: vi.fn(() => mockLabeledStats),
    newestGotmCompletions: vi.fn(() => mockLabeledStats),
    newestGotwotyCompletions: vi.fn(() => mockLabeledStats),
    newestGotyCompletions: vi.fn(() => mockLabeledStats),
    newestRetrobitCompletions: vi.fn(() => mockLabeledStats),
    newestRpgCompletions: vi.fn(() => mockLabeledStats),
    totalNomsBeforeWinByGame: vi.fn(() => mockLabeledStats),
    topNominationWinsByUser: vi.fn(() => mockLabeledStats),
    mostNominatedGames: vi.fn(() => mockLabeledStats),
    mostNominatedLoserGames: vi.fn(() => mockLabeledStats),
    avgTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
    totalTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
    longestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
    shortestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
    mostNominatedGamesByUser: vi.fn(() => mockLabeledStats),
    getNominationSuccessPercentByUser: vi.fn(() => mockUserListItems),
    getNominationsByGameId: vi.fn(() => []),
    getNominationsByUserId: vi.fn(() => []),
    getCompletionsByUserId: vi.fn(() => []),
    getGameById: vi.fn((id) => (id === 1 ? mockGame : null)),
  }),
}));

// Mock data layer
vi.mock('../data/index', () => ({
  default: {
    getGotmRunnerup: vi.fn(() => []),
    getGotmWinners: vi.fn(() => []),
    getRetrobits: vi.fn(() => []),
    getRpgRunnerup: vi.fn(() => []),
    getRpgWinners: vi.fn(() => []),
    mostCompletedGames: vi.fn(() => mockLabeledStats),
    mostCompletedGotmGames: vi.fn(() => mockLabeledStats),
    mostCompletedGotyGames: vi.fn(() => mockLabeledStats),
    mostCompletedRetrobitGames: vi.fn(() => mockLabeledStats),
    mostCompletedRetrobitYearGames: vi.fn(() => mockLabeledStats),
    mostCompletedRpgGames: vi.fn(() => mockLabeledStats),
    newestCompletions: vi.fn(() => mockLabeledStats),
    newestGotmCompletions: vi.fn(() => mockLabeledStats),
    newestGotwotyCompletions: vi.fn(() => mockLabeledStats),
    newestGotyCompletions: vi.fn(() => mockLabeledStats),
    newestRetrobitCompletions: vi.fn(() => mockLabeledStats),
    newestRpgCompletions: vi.fn(() => mockLabeledStats),
    totalNomsBeforeWinByGame: vi.fn(() => mockLabeledStats),
    topNominationWinsByUser: vi.fn(() => mockLabeledStats),
    mostNominatedGames: vi.fn(() => mockLabeledStats),
    mostNominatedLoserGames: vi.fn(() => mockLabeledStats),
    avgTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
    totalTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
    longestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
    shortestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
    mostNominatedGamesByUser: vi.fn(() => mockLabeledStats),
    getNominationSuccessPercentByUser: vi.fn(() => mockUserListItems),
    getNominationsByGameId: vi.fn(() => []),
    getNominationsByUserId: vi.fn(() => []),
    getCompletionsByUserId: vi.fn(() => []),
    getGameById: vi.fn((id) => (id === 1 ? mockGame : null)),
  },
  // Also export individual functions for named imports
  getGotmRunnerup: vi.fn(() => []),
  getGotmWinners: vi.fn(() => []),
  getRetrobits: vi.fn(() => []),
  getRpgRunnerup: vi.fn(() => []),
  getRpgWinners: vi.fn(() => []),
  mostCompletedGames: vi.fn(() => mockLabeledStats),
  mostCompletedGotmGames: vi.fn(() => mockLabeledStats),
  mostCompletedGotyGames: vi.fn(() => mockLabeledStats),
  mostCompletedRetrobitGames: vi.fn(() => mockLabeledStats),
  mostCompletedRetrobitYearGames: vi.fn(() => mockLabeledStats),
  mostCompletedRpgGames: vi.fn(() => mockLabeledStats),
  newestCompletions: vi.fn(() => mockLabeledStats),
  newestGotmCompletions: vi.fn(() => mockLabeledStats),
  newestGotwotyCompletions: vi.fn(() => mockLabeledStats),
  newestGotyCompletions: vi.fn(() => mockLabeledStats),
  newestRetrobitCompletions: vi.fn(() => mockLabeledStats),
  newestRpgCompletions: vi.fn(() => mockLabeledStats),
  totalNomsBeforeWinByGame: vi.fn(() => mockLabeledStats),
  topNominationWinsByUser: vi.fn(() => mockLabeledStats),
  mostNominatedGames: vi.fn(() => mockLabeledStats),
  mostNominatedLoserGames: vi.fn(() => mockLabeledStats),
  avgTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
  totalTimeToBeatByMonth: vi.fn(() => mockLabeledStats),
  longestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
  shortestMonthsByAvgTimeToBeat: vi.fn(() => mockLabeledStats),
  mostNominatedGamesByUser: vi.fn(() => mockLabeledStats),
  getNominationSuccessPercentByUser: vi.fn(() => mockUserListItems),
  getNominationsByGameId: vi.fn(() => []),
  getNominationsByUserId: vi.fn(() => []),
  getCompletionsByUserId: vi.fn(() => []),
  getGameById: vi.fn((id) => (id === 1 ? mockGame : null)),
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
