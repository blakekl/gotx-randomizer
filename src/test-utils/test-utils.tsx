import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { createContext } from 'react';
import DbStore from '../stores/DbStore';
import SettingsStore from '../stores/SettingsStore';
import { createMockDbClient } from './mocks/mockDbClient';

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
    },
    emptyGame: {
      id: 0,
      title_usa: '',
      year: 0,
      system: '',
      developer: '',
      genre: '',
      img_url: '',
      time_to_beat: 0,
      screenscraper_id: 0,
      created_at: '',
      updated_at: '',
    },
    setAllGames: vi.fn(),
    getMostCompletedGames: vi.fn(() => []),
    getMostCompletedGotmGames: vi.fn(() => []),
    getMostCompletedGotyGames: vi.fn(() => []),
    getMostCompletedRetrobitGames: vi.fn(() => []),
    getMostCompletedRetrobitYearGames: vi.fn(() => []),
    getMostCompletedRpgGames: vi.fn(() => []),
    getNewestCompletions: vi.fn(() => []),
    getNewestGotmCompletions: vi.fn(() => []),
    getNewestGotwotyCompletions: vi.fn(() => []),
    getNewestGotyCompletions: vi.fn(() => []),
    getNewestRetrobitCompletions: vi.fn(() => []),
    getNewestRpgCompletions: vi.fn(() => []),
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
    getNominationsByGame: vi.fn(() => []),
    getNominationsByUser: vi.fn(() => []),
    getCompletionsByUserId: vi.fn(() => []),
    getGameById: vi.fn(() => null),
    ...overrides.dbStore,
  };

  const mockSettingsStore = {
    hltbFilter: [0, Number.MAX_SAFE_INTEGER],
    hltbMax: Number.MAX_SAFE_INTEGER,
    hltbMin: 0,
    myUserName: '',
    hiddenGames: [],
    includeGotmRunnerUp: true,
    includeGotmWinners: true,
    includeHiddenGames: false,
    includeRetrobits: true,
    includeRpgRunnerUp: true,
    includeRpgWinners: true,
    setMyUserName: vi.fn(),
    setHltbFilter: vi.fn(),
    setHltbMax: vi.fn(),
    setHltbMin: vi.fn(),
    toggleGotmRunnerUp: vi.fn(),
    toggleGotmWinners: vi.fn(),
    toggleHiddenGame: vi.fn(),
    toggleHiddenGames: vi.fn(),
    toggleRetrobits: vi.fn(),
    toggleRpgRunnerUp: vi.fn(),
    toggleRpgWinners: vi.fn(),
    ...overrides.settingsStore,
  };

  return createContext({
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  });
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  mockStores?: {
    dbStore?: Partial<DbStore>;
    settingsStore?: Partial<SettingsStore>;
  };
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { initialEntries = ['/'], mockStores = {}, ...renderOptions } = options;

  const MockStoreContext = createMockStoreContext(mockStores);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <MockStoreContext.Provider value={MockStoreContext._currentValue}>
          {children}
        </MockStoreContext.Provider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { createMockStoreContext };
