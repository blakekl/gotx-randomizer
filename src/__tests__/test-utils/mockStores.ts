import React from 'react';
import { vi } from 'vitest';
import DbStore from '../../stores/DbStore';
import SettingsStore from '../../stores/SettingsStore';
import { Game, User, UserListItem, Subscription } from '../../models/game';

// Mock data
export const mockGames: Game[] = [
  {
    id: 1,
    title_usa: 'Test Game 1',
    system: 'Test System',
    year: 2023,
    developer: 'Test Developer',
    genre: 'Action',
    img_url: 'https://example.com/test-game-1.jpg',
    screenscraper_id: 12345,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
  },
  {
    id: 2,
    title_usa: 'Test Game 2',
    system: 'Test System 2',
    year: 2023,
    developer: 'Test Developer 2',
    genre: 'RPG',
    img_url: 'https://example.com/test-game-2.jpg',
    screenscraper_id: 12346,
    created_at: '2023-02-01',
    updated_at: '2023-02-01',
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'testuser1',
    discord_id: '123456789',
    old_discord_name: 'olduser1',
    current_points: 100,
    redeemed_points: 50,
    earned_points: 150,
    premium_points: 25,
    created_at: '2023-01-01',
    updated_at: '2023-01-01',
    premium_subscriber: Subscription.SUPPORTER,
  },
  {
    id: 2,
    name: 'testuser2',
    discord_id: '987654321',
    old_discord_name: 'olduser2',
    current_points: 75,
    redeemed_points: 25,
    earned_points: 100,
    premium_points: 10,
    created_at: '2023-02-01',
    updated_at: '2023-02-01',
    premium_subscriber: Subscription.CHAMPION,
  },
];

export const mockUserListItems: UserListItem[] = [
  {
    earned_points: 4,
    id: 1,
    name: 'testuser1',
    rank: 1,
    success_rate: 0.8,
    nominations: 10,
    wins: 8,
    completions: 15,
  },
  {
    earned_points: 3,
    id: 2,
    name: 'testuser2',
    rank: 2,
    success_rate: 0.6,
    nominations: 5,
    wins: 3,
    completions: 8,
  },
];

// Mock stores
export const createMockDbStore = (
  overrides: Partial<DbStore> = {},
): Partial<DbStore> => {
  return {
    allGames: {
      gotmRunnerUp: mockGames,
      gotmWinners: mockGames,
      retrobits: mockGames,
      rpgRunnerUp: mockGames,
      rpgWinners: mockGames,
    },
    emptyGame: mockGames[0],
    setAllGames: vi.fn(),
    getMostCompletedGames: vi.fn(() => []),
    getMostCompletedGotmGames: vi.fn(() => []),
    getMostCompletedGotyGames: vi.fn(() => []),
    getMostCompletedRetrobitGames: vi.fn(() => []),
    getMostCompletedRetrobitYearGames: vi.fn(() => []),
    getMostCompletedRpgGames: vi.fn(() => []),
    getNewestCompletions: vi.fn(() => []),
    getNewestRetrobitCompletions: vi.fn(() => []),
    getNewestGotmCompletions: vi.fn(() => []),
    getNewestRpgCompletions: vi.fn(() => []),
    getNewestGotyCompletions: vi.fn(() => []),
    getNewestGotwotyCompletions: vi.fn(() => []),
    getTotalNominationsBeforeWinByGame: vi.fn(() => []),
    getTopNominationWinsByUser: vi.fn(() => []),
    getMostNominatedGames: vi.fn(() => []),
    getMostNominatedLoserGames: vi.fn(() => []),
    getAvgTimeToBeatByMonth: vi.fn(() => []),
    getTotalTimeToBeatByMonth: vi.fn(() => []),
    getLongestMonthsByAvgTimeToBeat: vi.fn(() => []),
    getShortestMonthsByAvgTimeToBeat: vi.fn(() => []),
    getMostNominatedGamesByUser: vi.fn(() => []),
    getNominationSuccessPercentByUser: vi.fn(() => []),
    getCompletionsByUserId: vi.fn(() => []),
    getGameById: vi.fn(
      (id: number) => mockGames.find((game) => game.id === id) || null,
    ),
    ...overrides,
  };
};

export const createMockSettingsStore = (
  overrides: Partial<SettingsStore> = {},
): Partial<SettingsStore> => {
  return {
    hiddenGames: [],
    hltbFilter: [0, Number.MAX_SAFE_INTEGER],
    hltbMax: Number.MAX_SAFE_INTEGER,
    hltbMin: 0,
    includeGotmRunnerUp: true,
    includeGotmWinners: true,
    includeHiddenGames: false,
    includeRetrobits: true,
    includeRpgRunnerUp: true,
    includeRpgWinners: true,
    ...overrides,
  };
};

// Mock store context
export const mockStoreContext = {
  dbStore: createMockDbStore(),
  settingsStore: createMockSettingsStore(),
};

// Helper function to create a mock store context with overrides
export const createMockStoreContext = (
  dbStoreOverrides: Partial<DbStore> = {},
  settingsStoreOverrides: Partial<SettingsStore> = {},
) => ({
  dbStore: createMockDbStore(dbStoreOverrides),
  settingsStore: createMockSettingsStore(settingsStoreOverrides),
});

// Mock React context
export const MockStoreContext = React.createContext(mockStoreContext);

// Helper to get a game by name for tests
export const getGameByTitle = (title: string): Game | undefined => {
  return mockGames.find((game) => game.title_usa === title);
};

// Helper to get a user by name for tests
export const getUserByName = (name: string): User | undefined => {
  return mockUsers.find((user) => user.name === name);
};
