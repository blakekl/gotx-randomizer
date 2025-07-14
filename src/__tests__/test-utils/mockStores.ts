import React from 'react';
import { vi } from 'vitest';
import { DbStore } from '../../stores/DbStore';
import { SettingsStore } from '../../stores/SettingsStore';
import { Game, User, Completion } from '../../models/game';

// Mock data
export const mockGames: Game[] = [
  {
    id: 1,
    name: 'Test Game 1',
    system: 'Test System',
    region: 'US',
    regionalTitles: { US: 'Test Game 1', JP: 'テストゲーム1' },
    genre: 'Action',
    developer: 'Test Developer',
    publisher: 'Test Publisher',
    releaseDate: '2023-01-01',
    description: 'A test game for testing purposes',
    imageUrl: 'https://example.com/test-game-1.jpg',
    tags: ['test', 'action'],
    difficulty: 3,
    playtime: 10,
    rating: 8.5,
    completions: [],
  },
  {
    id: 2,
    name: 'Test Game 2',
    system: 'Test System 2',
    region: 'EU',
    regionalTitles: { EU: 'Test Game 2', US: 'Test Game 2 US' },
    genre: 'RPG',
    developer: 'Test Developer 2',
    publisher: 'Test Publisher 2',
    releaseDate: '2023-02-01',
    description: 'Another test game',
    imageUrl: 'https://example.com/test-game-2.jpg',
    tags: ['test', 'rpg'],
    difficulty: 5,
    playtime: 50,
    rating: 9.0,
    completions: [],
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'testuser1',
    displayName: 'Test User 1',
    avatar: 'https://example.com/avatar1.jpg',
    joinDate: '2023-01-01',
    completions: [],
    stats: {
      totalCompletions: 5,
      totalPlaytime: 100,
      averageRating: 8.0,
      favoriteGenre: 'Action',
    },
  },
  {
    id: 2,
    username: 'testuser2',
    displayName: 'Test User 2',
    avatar: 'https://example.com/avatar2.jpg',
    joinDate: '2023-02-01',
    completions: [],
    stats: {
      totalCompletions: 3,
      totalPlaytime: 75,
      averageRating: 7.5,
      favoriteGenre: 'RPG',
    },
  },
];

export const mockCompletions: Completion[] = [
  {
    id: 1,
    userId: 1,
    gameId: 1,
    completedAt: '2023-03-01',
    rating: 8,
    review: 'Great game!',
    playtime: 10,
    difficulty: 3,
    screenshots: ['https://example.com/screenshot1.jpg'],
  },
  {
    id: 2,
    userId: 2,
    gameId: 2,
    completedAt: '2023-03-15',
    rating: 9,
    review: 'Amazing RPG!',
    playtime: 50,
    difficulty: 5,
    screenshots: ['https://example.com/screenshot2.jpg'],
  },
];

// Mock labeled stat data for charts
const mockLabeledStats = [
  { label: 'Game 1', value: 10 },
  { label: 'Game 2', value: 20 },
  { label: 'Game 3', value: 15 },
];

// Mock user list items for Users page
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
  {
    id: 2,
    username: 'user2',
    display_name: 'User Two',
    total_points: 1200,
    total_completions: 20,
    join_date: '2023-02-01',
    success_percentage: 78.2,
  },
];

export function createMockDbStore(overrides: any = {}): Partial<DbStore> {
  const defaultMock = {
    games: mockGames,
    users: mockUsers,
    completions: mockCompletions,
    isLoading: false,
    error: null,

    // Basic CRUD methods
    getGameById: vi.fn((id: number) => mockGames.find((g) => g.id === id)),
    getUserById: vi.fn((id: number) => mockUsers.find((u) => u.id === id)),
    getCompletionsByUserId: vi.fn((userId: number) =>
      mockCompletions.filter((c) => c.userId === userId),
    ),
    getCompletionsByGameId: vi.fn((gameId: number) =>
      mockCompletions.filter((c) => c.gameId === gameId),
    ),

    // Search and filter methods
    searchGames: vi.fn((query: string) =>
      mockGames.filter(
        (g) =>
          g.name.toLowerCase().includes(query.toLowerCase()) ||
          g.genre.toLowerCase().includes(query.toLowerCase()),
      ),
    ),
    filterGamesByGenre: vi.fn((genre: string) =>
      mockGames.filter((g) => g.genre === genre),
    ),
    filterGamesBySystem: vi.fn((system: string) =>
      mockGames.filter((g) => g.system === system),
    ),

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
      totalGames: mockGames.length,
      totalCompletions: mockCompletions.length,
      averageRating: 8.5,
      mostPopularGenre: 'Action',
    })),
    getUserStats: vi.fn(() => ({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.length,
      averageCompletions: 4,
    })),

    // Data loading methods
    loadGames: vi.fn().mockResolvedValue(mockGames),
    loadUsers: vi.fn().mockResolvedValue(mockUsers),
    loadCompletions: vi.fn().mockResolvedValue(mockCompletions),
    refreshData: vi.fn().mockResolvedValue(undefined),

    // List methods
    getUserList: vi.fn(() => mockUsers),
    getGameList: vi.fn(() => mockGames),
    getCompletionList: vi.fn(() => mockCompletions),

    // CRUD operations
    addGame: vi.fn().mockResolvedValue(mockGames[0]),
    updateGame: vi.fn().mockResolvedValue(mockGames[0]),
    deleteGame: vi.fn().mockResolvedValue(undefined),

    addUser: vi.fn().mockResolvedValue(mockUsers[0]),
    updateUser: vi.fn().mockResolvedValue(mockUsers[0]),
    deleteUser: vi.fn().mockResolvedValue(undefined),

    addCompletion: vi.fn().mockResolvedValue(mockCompletions[0]),
    updateCompletion: vi.fn().mockResolvedValue(mockCompletions[0]),
    deleteCompletion: vi.fn().mockResolvedValue(undefined),
  };

  return { ...defaultMock, ...overrides };
}

export function createMockSettingsStore(
  overrides: any = {},
): Partial<SettingsStore> {
  const defaultMock = {
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
  };

  return { ...defaultMock, ...overrides };
}

// Helper function to create mock store context
export function createMockStoreContext(overrides: any = {}) {
  return {
    dbStore: createMockDbStore(overrides.dbStore),
    settingsStore: createMockSettingsStore(overrides.settingsStore),
  };
}

// Create a mock context that matches the actual store structure
export const MockStoreContext = React.createContext(createMockStoreContext());

// Helper function to wrap components with mock store context
export function withMockStores(component: React.ReactElement, stores?: any) {
  const mockStores = stores || createMockStoreContext();

  return React.createElement(
    MockStoreContext.Provider,
    { value: mockStores },
    component,
  );
}

// Export the actual store context for tests to use
// This matches the default export from stores/index.tsx
export { default as StoreContext } from '../../stores/index';
