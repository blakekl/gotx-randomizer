import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SQL.js - must be at top level
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

// Mock database URL
vi.mock('../../../gotx-randomizer.sqlite?url', () => ({
  default: 'mock-database-url',
}));

// Mock fetch for database file
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('initDbClient', () => {
  let mockExec: any;
  let mockDatabase: any;
  let mockSQL: any;
  let mockInitSqlJs: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Set up mocks
    mockExec = vi.fn();
    mockDatabase = {
      exec: mockExec,
      close: vi.fn(),
    };
    mockSQL = {
      Database: vi.fn(() => mockDatabase),
    };
    mockInitSqlJs = vi.fn(() => Promise.resolve(mockSQL));

    // Mock the sql.js module
    vi.doMock('sql.js', () => ({
      default: mockInitSqlJs,
    }));

    // Default successful mocks
    mockFetch.mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['mock database content'])),
    });

    mockExec.mockReturnValue([
      {
        values: [
          [
            1,
            'Test Game',
            '',
            '',
            '',
            '',
            2000,
            'Test System',
            'Test Dev',
            'Test Genre',
            '',
            5,
            12345,
            '2023-01-01',
            '2023-01-01',
          ],
        ],
      },
    ]);
  });

  describe('initialization', () => {
    it('should fetch the database file', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      await initDbClient();

      expect(mockFetch).toHaveBeenCalledWith('mock-database-url');
    });

    it('should handle database fetch errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to fetch database'));

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
    });
  });

  describe('client methods', () => {
    it('should return all expected query methods', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      const expectedMethods = [
        'getGotmRunnerup',
        'getGotmWinners',
        'getRetrobits',
        'getRpgRunnerup',
        'getRpgWinners',
        'getNominationsByUserId',
        'getNominationsByGameId',
        'getCompletionsByUserId',
        'mostCompletedGames',
        'mostCompletedGotmGames',
        'mostCompletedGotyGames',
        'mostCompletedRetrobitGames',
        'mostCompletedRetrobitYearGames',
        'mostCompletedRpgGames',
        'newestCompletions',
        'newestRetrobitCompletions',
        'newestGotmCompletions',
        'newestRpgCompletions',
        'newestGotyCompletions',
        'newestGotwotyCompletions',
        'totalNomsBeforeWinByGame',
        'avgNominationsBeforeWin',
        'topNominationWinsByUser',
        'mostNominatedGames',
        'mostNominatedLoserGames',
        'avgTimeToBeatByMonth',
        'totalTimeToBeatByMonth',
        'longestMonthsByAvgTimeToBeat',
        'shortestMonthsByAvgTimeToBeat',
        'mostNominatedGamesByUser',
        'completionsCountByGame',
        'getNominationSuccessPercentByUser',
        'getGameById',
      ];

      expectedMethods.forEach((method) => {
        expect(client).toHaveProperty(method);
        expect(typeof client[method]).toBe('function');
      });
    });

    it('should execute SQL queries and transform results', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      const result = client.getGotmWinners();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle parameterized queries', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      client.getNominationsByUserId(123);
      client.getCompletionsByUserId(456);
      client.getGameById(789);

      // These should not throw
      expect(true).toBe(true);
    });

    it('should handle empty query results', async () => {
      mockExec.mockReturnValue([]);

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();
      const result = client.mostCompletedGames();

      expect(result).toEqual([]);
    });
  });

  describe('data transformation', () => {
    it('should transform game data correctly', async () => {
      mockExec.mockReturnValue([
        {
          values: [
            [
              1,
              'Test Game',
              'Test Game EU',
              'テストゲーム',
              'Test Game World',
              '',
              2000,
              'Test System',
              'Test Dev',
              'Test Genre',
              'test.jpg',
              5,
              12345,
              '2023-01-01',
              '2023-01-01',
            ],
          ],
        },
      ]);

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();
      const result = client.getGotmWinners();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        title_usa: 'Test Game',
        title_eu: 'Test Game EU',
        title_jap: 'テストゲーム',
        title_world: 'Test Game World',
        year: 2000,
        system: 'Test System',
        developer: 'Test Dev',
        genre: 'Test Genre',
        time_to_beat: 5,
      });
    });

    it('should handle multiple result rows', async () => {
      mockExec.mockReturnValue([
        {
          values: [
            [
              1,
              'Game 1',
              '',
              '',
              '',
              '',
              2000,
              'System',
              'Dev',
              'Genre',
              '',
              5,
              1,
              '2023-01-01',
              '2023-01-01',
            ],
            [
              2,
              'Game 2',
              '',
              '',
              '',
              '',
              2001,
              'System',
              'Dev',
              'Genre',
              '',
              10,
              2,
              '2023-01-02',
              '2023-01-02',
            ],
          ],
        },
      ]);

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();
      const result = client.getGotmWinners();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should handle labeled stat data', async () => {
      mockExec.mockReturnValue([
        {
          values: [
            ['Game 1', 10],
            ['Game 2', 5],
          ],
        },
      ]);

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();
      const result = client.mostCompletedGames();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ label: 'Game 1', value: 10 });
      expect(result[1]).toEqual({ label: 'Game 2', value: 5 });
    });
  });

  describe('error handling', () => {
    it('should handle database not initialized', async () => {
      mockFetch.mockRejectedValue(new Error('Init failed'));

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      // Methods should exist but may throw when database is not available
      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
    });

    it('should handle malformed database responses', async () => {
      mockExec.mockReturnValue(null);

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      // Current implementation will throw on null responses - this is expected behavior
      expect(() => client.getGotmWinners()).toThrow();
    });
  });
});
