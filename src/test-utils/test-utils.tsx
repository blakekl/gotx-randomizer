import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { createContext } from 'react';
import { vi } from 'vitest';
import DbStore from '../stores/DbStore';
import SettingsStore from '../stores/SettingsStore';

// Create mock store context
const createMockStoreContext = (
  overrides: {
    dbStore?: Partial<DbStore>;
    settingsStore?: Partial<SettingsStore>;
  } = {},
) => {
  const mockDbStore = {
    allGames: {
      gotmRunnerUp: [],
      gotmWinners: [],
      retrobits: [],
      rpgRunnerUp: [],
      rpgWinners: [],
      mostCompletedGames: [],
      mostCompletedGotmGames: [],
      mostCompletedGotyGames: [],
      mostCompletedRetrobitGames: [],
      mostCompletedRetrobitYearGames: [],
      mostCompletedRpgGames: [],
      newestCompletions: [],
      newestRetrobitCompletions: [],
      newestGotmCompletions: [],
      newestRpgCompletions: [],
      newestGotyCompletions: [],
      newestGotwotyCompletions: [],
      totalNomsBeforeWinByGame: [],
      avgNominationsBeforeWin: [],
      topNominationWinsByUser: [],
      mostNominatedGames: [],
      mostNominatedLoserGames: [],
      avgTimeToBeatByMonth: [],
      totalTimeToBeatByMonth: [],
      longestMonthsByAvgTimeToBeat: [],
      shortestMonthsByAvgTimeToBeat: [],
      mostNominatedGamesByUser: [],
      nominationSuccessPercentByUser: [],
      games: [],
      filteredGames: [],
      searchTerm: '',
      selectedGenre: '',
      selectedSystem: '',
      currentPage: 1,
      gamesPerPage: 10,
      totalPages: 1,
      isLoading: false,
      error: null,
      setSearchTerm: vi.fn(),
      setSelectedGenre: vi.fn(),
      setSelectedSystem: vi.fn(),
      setCurrentPage: vi.fn(),
      setGamesPerPage: vi.fn(),
      loadGames: vi.fn(),
      clearFilters: vi.fn(),
    },
    emptyGame: {
      id: 0,
      title_usa: '',
      year: 0,
      system: '',
      developer: '',
      genre: '',
      img_url: '',
      screenscraper_id: 0,
      created_at: '',
      updated_at: '',
    },
    setAllGames: vi.fn(),
    getMostCompletedGames: vi.fn(),
    getMostCompletedGotmGames: vi.fn(),
    getMostCompletedGotyGames: vi.fn(),
    getMostCompletedRetrobitGames: vi.fn(),
    getMostCompletedRetrobitYearGames: vi.fn(),
    getMostCompletedRpgGames: vi.fn(),
    getNewestCompletions: vi.fn(),
    getNewestRetrobitCompletions: vi.fn(),
    getNewestGotmCompletions: vi.fn(),
    getNewestRpgCompletions: vi.fn(),
    getNewestGotyCompletions: vi.fn(),
    getNewestGotwotyCompletions: vi.fn(),
    getTotalNominationsBeforeWinByGame: vi.fn(),
    getAvgNominationsBeforeWin: vi.fn(),
    getTopNominationWinsByUser: vi.fn(),
    getMostNominatedGames: vi.fn(),
    getMostNominatedLoserGames: vi.fn(),
    getAvgTimeToBeatByMonth: vi.fn(),
    getTotalTimeToBeatByMonth: vi.fn(),
    getLongestMonthsByAvgTimeToBeat: vi.fn(),
    getShortestMonthsByAvgTimeToBeat: vi.fn(),
    getMostNominatedGamesByUser: vi.fn(),
    getNominationSuccessPercentByUser: vi.fn(),
    getGotmRunnerup: vi.fn(),
    getGotmWinners: vi.fn(),
    getRetrobits: vi.fn(),
    getRpgRunnerup: vi.fn(),
    getRpgWinners: vi.fn(),
    getNominationsByGameId: vi.fn(),
    getNominationsByUserId: vi.fn(),
    getCompletionsByUserId: vi.fn(),
    getGameById: vi.fn(),
    ...overrides.dbStore,
  };

  const mockSettingsStore = {
    HIDDEN_KEY: 'hidden_games',
    hiddenGames: [],
    hideGame: vi.fn(),
    showGame: vi.fn(),
    isGameHidden: vi.fn(),
    clearHiddenGames: vi.fn(),
    getHiddenGames: vi.fn(),
    ...overrides.settingsStore,
  };

  return {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };
};

// Create the mock context
const MockStoreContext = createContext(createMockStoreContext());

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialEntries?: string[];
    storeOverrides?: {
      dbStore?: Partial<DbStore>;
      settingsStore?: Partial<SettingsStore>;
    };
  },
) => {
  const {
    initialEntries = ['/'],
    storeOverrides = {},
    ...renderOptions
  } = options || {};

  const mockContext = createMockStoreContext(storeOverrides);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <MockStoreContext.Provider value={mockContext}>
        {children}
      </MockStoreContext.Provider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { MockStoreContext };
export { createMockStoreContext };
