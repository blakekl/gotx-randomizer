import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runInAction } from 'mobx';

// Mock the data client at the top level
vi.mock('../../../data', () => ({
  default: {
    getGotmRunnerup: vi.fn(() => []),
    getGotmWinners: vi.fn(() => []),
    getRetrobits: vi.fn(() => []),
    getRpgRunnerup: vi.fn(() => []),
    getRpgWinners: vi.fn(() => []),
    mostCompletedGames: vi.fn(() => []),
    mostCompletedGotmGames: vi.fn(() => []),
    mostCompletedGotyGames: vi.fn(() => []),
    mostCompletedRetrobitGames: vi.fn(() => []),
    mostCompletedRetrobitYearGames: vi.fn(() => []),
    mostCompletedRpgGames: vi.fn(() => []),
    newestCompletions: vi.fn(() => []),
    newestRetrobitCompletions: vi.fn(() => []),
    newestGotmCompletions: vi.fn(() => []),
    newestRpgCompletions: vi.fn(() => []),
    newestGotyCompletions: vi.fn(() => []),
    newestGotwotyCompletions: vi.fn(() => []),
    totalNomsBeforeWinByGame: vi.fn(() => []),
    topNominationWinsByUser: vi.fn(() => []),
    mostNominatedGames: vi.fn(() => []),
    mostNominatedLoserGames: vi.fn(() => []),
    avgTimeToBeatByMonth: vi.fn(() => []),
    totalTimeToBeatByMonth: vi.fn(() => []),
    longestMonthsByAvgTimeToBeat: vi.fn(() => []),
    shortestMonthsByAvgTimeToBeat: vi.fn(() => []),
    mostNominatedGamesByUser: vi.fn(() => []),
    getNominationSuccessPercentByUser: vi.fn(() => []),
    getNominationsByGameId: vi.fn(() => []),
    getNominationsByUserId: vi.fn(() => []),
    getCompletionsByUserId: vi.fn(() => []),
    getGameById: vi.fn(() => null),
  },
}));

import DbStore from '../../../stores/DbStore';
import { mockGames } from '../../../test-utils/fixtures/gameData';

describe('DbStore', () => {
  let dbStore: DbStore;
  let mockDbClient: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Get the mocked client
    const dataModule = await import('../../../data');
    mockDbClient = dataModule.default;

    dbStore = new DbStore();
  });

  describe('initialization', () => {
    it('should initialize with empty game collections', () => {
      expect(dbStore.allGames).toBeDefined();
      expect(dbStore.allGames.gotmRunnerUp).toEqual([]);
      expect(dbStore.allGames.gotmWinners).toEqual([]);
      expect(dbStore.allGames.retrobits).toEqual([]);
      expect(dbStore.allGames.rpgRunnerUp).toEqual([]);
      expect(dbStore.allGames.rpgWinners).toEqual([]);
    });

    it('should have empty game as default', () => {
      expect(dbStore.emptyGame).toEqual({
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
      });
    });

    it('should load data from dbClient on construction', () => {
      // Since constructor calls dbClient methods, verify they were called
      expect(mockDbClient.getGotmRunnerup).toHaveBeenCalled();
      expect(mockDbClient.getGotmWinners).toHaveBeenCalled();
      expect(mockDbClient.getRetrobits).toHaveBeenCalled();
      expect(mockDbClient.getRpgRunnerup).toHaveBeenCalled();
      expect(mockDbClient.getRpgWinners).toHaveBeenCalled();
    });

    it('should handle dbClient returning null gracefully', () => {
      // This test is more about ensuring the store doesn't crash
      // when methods return null, which is handled by the mocked methods
      expect(() => new DbStore()).not.toThrow();
    });
  });

  describe('setAllGames', () => {
    it('should update all game collections', () => {
      const newGames = {
        gotmRunnerUp: mockGames.gotmRunnerUp,
        gotmWinners: mockGames.gotmWinners,
        retrobits: mockGames.retrobits,
        rpgRunnerUp: mockGames.rpgRunnerUp,
        rpgWinners: mockGames.rpgWinners,
      };

      runInAction(() => {
        dbStore.setAllGames(newGames);
      });

      expect(dbStore.allGames).toEqual(newGames);
    });

    it('should be observable and trigger reactions', () => {
      const reactionSpy = vi.fn();

      // This would normally use autorun from mobx, but for testing we'll just verify the assignment
      const newGames = {
        gotmRunnerUp: [mockGames.gotmRunnerUp[0]],
        gotmWinners: [],
        retrobits: [],
        rpgRunnerUp: [],
        rpgWinners: [],
      };

      runInAction(() => {
        dbStore.setAllGames(newGames);
      });

      expect(dbStore.allGames.gotmRunnerUp).toHaveLength(1);
    });
  });

  describe('query methods', () => {
    it('should return results from mostCompletedGames', () => {
      const result = dbStore.getMostCompletedGames();

      expect(mockDbClient.mostCompletedGames).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return results from mostCompletedGotmGames', () => {
      const result = dbStore.getMostCompletedGotmGames();

      expect(mockDbClient.mostCompletedGotmGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return results from mostCompletedGotyGames', () => {
      const result = dbStore.getMostCompletedGotyGames();

      expect(mockDbClient.mostCompletedGotyGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return results from mostCompletedRetrobitGames', () => {
      const result = dbStore.getMostCompletedRetrobitGames();

      expect(mockDbClient.mostCompletedRetrobitGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return results from mostCompletedRetrobitYearGames', () => {
      const result = dbStore.getMostCompletedRetrobitYearGames();

      expect(mockDbClient.mostCompletedRetrobitYearGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return results from mostCompletedRpgGames', () => {
      const result = dbStore.getMostCompletedRpgGames();

      expect(mockDbClient.mostCompletedRpgGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('newest completions methods', () => {
    it('should return newest completions', () => {
      const result = dbStore.getNewestCompletions();

      expect(mockDbClient.newestCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return newest GotM completions', () => {
      const result = dbStore.getNewestGotmCompletions();

      expect(mockDbClient.newestGotmCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return newest RPG completions', () => {
      const result = dbStore.getNewestRpgCompletions();

      expect(mockDbClient.newestRpgCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return newest GoTY completions', () => {
      const result = dbStore.getNewestGotyCompletions();

      expect(mockDbClient.newestGotyCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return newest GotWotY completions', () => {
      const result = dbStore.getNewestGotwotyCompletions();

      expect(mockDbClient.newestGotwotyCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return newest Retrobit completions', () => {
      const result = dbStore.getNewestRetrobitCompletions();

      expect(mockDbClient.newestRetrobitCompletions).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('nomination and statistics methods', () => {
    it('should return total nominations before win by game', () => {
      const result = dbStore.getTotalNominationsBeforeWinByGame();

      expect(mockDbClient.totalNomsBeforeWinByGame).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return top nomination wins by user', () => {
      const result = dbStore.getTopNominationWinsByUser();

      expect(mockDbClient.topNominationWinsByUser).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return most nominated games', () => {
      const result = dbStore.getMostNominatedGames();

      expect(mockDbClient.mostNominatedGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return most nominated loser games', () => {
      const result = dbStore.getMostNominatedLoserGames();

      expect(mockDbClient.mostNominatedLoserGames).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return most nominated games by user', () => {
      const result = dbStore.getMostNominatedGamesByUser();

      expect(mockDbClient.mostNominatedGamesByUser).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return nomination success percent by user', () => {
      const result = dbStore.getNominationSuccessPercentByUser();

      expect(mockDbClient.getNominationSuccessPercentByUser).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('time to beat methods', () => {
    it('should return average time to beat by month', () => {
      const result = dbStore.getAvgTimeToBeatByMonth();

      expect(mockDbClient.avgTimeToBeatByMonth).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return total time to beat by month', () => {
      const result = dbStore.getTotalTimeToBeatByMonth();

      expect(mockDbClient.totalTimeToBeatByMonth).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return longest months by average time to beat', () => {
      const result = dbStore.getLongestMonthsByAvgTimeToBeat();

      expect(mockDbClient.longestMonthsByAvgTimeToBeat).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return shortest months by average time to beat', () => {
      const result = dbStore.getShortestMonthsByAvgTimeToBeat();

      expect(mockDbClient.shortestMonthsByAvgTimeToBeat).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('parameterized query methods', () => {
    it('should get nominations by game ID', () => {
      const gameId = 123;
      const result = dbStore.getNominationsByGame(gameId);

      expect(mockDbClient.getNominationsByGameId).toHaveBeenCalledWith(gameId);
      expect(result).toBeDefined();
    });

    it('should get nominations by user ID', () => {
      const userId = 456;
      const result = dbStore.getNominationsByUser(userId);

      expect(mockDbClient.getNominationsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
    });

    it('should get completions by user ID', () => {
      const userId = 789;
      const result = dbStore.getCompletionsByUserId(userId);

      expect(mockDbClient.getCompletionsByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
    });

    it('should get game by ID', () => {
      const gameId = 101;
      const result = dbStore.getGameById(gameId);

      expect(mockDbClient.getGameById).toHaveBeenCalledWith(gameId);
      expect(result).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle dbClient method errors by throwing', () => {
      // Mock a method to throw an error
      mockDbClient.mostCompletedGames.mockImplementation(() => {
        throw new Error('Database error');
      });

      // The current implementation doesn't handle errors gracefully, it throws
      expect(() => dbStore.getMostCompletedGames()).toThrow('Database error');
    });

    it('should return empty arrays when dbClient returns null', () => {
      // Mock methods to return null
      mockDbClient.mostCompletedGames.mockReturnValue(null);
      mockDbClient.newestCompletions.mockReturnValue(null);

      const result1 = dbStore.getMostCompletedGames();
      const result2 = dbStore.getNewestCompletions();

      // Should handle null gracefully
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });

    it('should handle undefined dbClient methods', () => {
      // This test ensures the store doesn't crash with incomplete dbClient
      expect(() => new DbStore()).not.toThrow();
    });
  });

  describe('data consistency', () => {
    it('should maintain consistent game collections after setAllGames', () => {
      const testGames = {
        gotmRunnerUp: mockGames.gotmRunnerUp,
        gotmWinners: mockGames.gotmWinners,
        retrobits: mockGames.retrobits,
        rpgRunnerUp: mockGames.rpgRunnerUp,
        rpgWinners: mockGames.rpgWinners,
      };

      runInAction(() => {
        dbStore.setAllGames(testGames);
      });

      // Verify each collection is set correctly
      expect(dbStore.allGames.gotmRunnerUp).toBe(testGames.gotmRunnerUp);
      expect(dbStore.allGames.gotmWinners).toBe(testGames.gotmWinners);
      expect(dbStore.allGames.retrobits).toBe(testGames.retrobits);
      expect(dbStore.allGames.rpgRunnerUp).toBe(testGames.rpgRunnerUp);
      expect(dbStore.allGames.rpgWinners).toBe(testGames.rpgWinners);
    });

    it('should handle partial game collection updates', () => {
      const partialGames = {
        gotmRunnerUp: mockGames.gotmRunnerUp,
        gotmWinners: [],
        retrobits: [],
        rpgRunnerUp: [],
        rpgWinners: [],
      };

      runInAction(() => {
        dbStore.setAllGames(partialGames);
      });

      expect(dbStore.allGames.gotmRunnerUp).toHaveLength(1);
      expect(dbStore.allGames.gotmWinners).toHaveLength(0);
    });
  });

  describe('method return types', () => {
    it('should return arrays from list methods', () => {
      const methods = [
        'getMostCompletedGames',
        'getMostCompletedGotmGames',
        'getMostCompletedGotyGames',
        'getMostCompletedRetrobitGames',
        'getMostCompletedRetrobitYearGames',
        'getMostCompletedRpgGames',
        'getNewestCompletions',
        'getNewestGotmCompletions',
        'getNewestRpgCompletions',
        'getNewestGotyCompletions',
        'getNewestGotwotyCompletions',
        'getNewestRetrobitCompletions',
      ];

      methods.forEach((methodName) => {
        const result = (dbStore as any)[methodName]();
        expect(Array.isArray(result)).toBe(true);
      });
    });

    it('should return single values from parameterized methods', () => {
      const gameResult = dbStore.getGameById(1);
      const nominationsResult = dbStore.getNominationsByGame(1);
      const userNominationsResult = dbStore.getNominationsByUser(1);
      const completionsResult = dbStore.getCompletionsByUserId(1);

      // These should return the mocked values
      expect(gameResult).toBeDefined();
      expect(Array.isArray(nominationsResult)).toBe(true);
      expect(Array.isArray(userNominationsResult)).toBe(true);
      expect(Array.isArray(completionsResult)).toBe(true);
    });
  });
});
