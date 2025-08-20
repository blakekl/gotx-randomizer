import { vi } from 'vitest';
import { mockGames, mockUsers, mockNominations } from '../fixtures/gameData';

export const createMockDbClient = (overrides: Record<string, any> = {}) => ({
  getGotmRunnerup: vi.fn(() => mockGames.gotmRunnerUp),
  getGotmWinners: vi.fn(() => mockGames.gotmWinners),
  getRetrobits: vi.fn(() => mockGames.retrobits),
  getRpgRunnerup: vi.fn(() => mockGames.rpgRunnerUp),
  getRpgWinners: vi.fn(() => mockGames.rpgWinners),
  getNominationsByUserId: vi.fn(() => mockNominations.byUser),
  getNominationsByGameId: vi.fn(() => mockNominations.byGame),
  getCompletionsByUserId: vi.fn(() => []),
  mostCompletedGames: vi.fn(() => [
    { label: 'Test Game 1', value: 10 },
    { label: 'Test Game 2', value: 8 },
  ]),
  mostCompletedGotmGames: vi.fn(() => [{ label: 'GotM Game 1', value: 5 }]),
  mostCompletedGotyGames: vi.fn(() => [{ label: 'GotY Game 1', value: 3 }]),
  mostCompletedRetrobitGames: vi.fn(() => [
    { label: 'Retrobit Game 1', value: 7 },
  ]),
  mostCompletedRetrobitYearGames: vi.fn(() => [
    { label: 'Retrobit Year Game 1', value: 4 },
  ]),
  mostCompletedRpgGames: vi.fn(() => [{ label: 'RPG Game 1', value: 6 }]),
  newestCompletions: vi.fn(() => [{ label: 'Recent Game 1', value: 1 }]),
  newestRetrobitCompletions: vi.fn(() => []),
  newestGotmCompletions: vi.fn(() => []),
  newestRpgCompletions: vi.fn(() => []),
  newestGotyCompletions: vi.fn(() => []),
  newestGotwotyCompletions: vi.fn(() => []),
  totalNomsBeforeWinByGame: vi.fn(() => []),
  avgNominationsBeforeWin: vi.fn(() => [2.5]),
  topNominationWinsByUser: vi.fn(() => []),
  mostNominatedGames: vi.fn(() => []),
  mostNominatedLoserGames: vi.fn(() => []),
  avgTimeToBeatByMonth: vi.fn(() => []),
  totalTimeToBeatByMonth: vi.fn(() => []),
  longestMonthsByAvgTimeToBeat: vi.fn(() => []),
  shortestMonthsByAvgTimeToBeat: vi.fn(() => []),
  mostNominatedGamesByUser: vi.fn(() => []),
  completionsCountByGame: vi.fn(() => []),
  getNominationSuccessPercentByUser: vi.fn(() => mockUsers.list),
  getGameById: vi.fn(
    (id: number) =>
      mockGames.gotmWinners.find((game) => game.id === id) || null,
  ),
  ...overrides,
});

export default createMockDbClient;
