import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('initDbClient', () => {
  let mockFetch: any;
  let mockExec: any;
  let mockDatabase: any;
  let mockSQL: any;
  let mockInitSqlJs: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Set up mocks
    mockFetch = vi.fn();
    mockExec = vi.fn();
    mockDatabase = {
      exec: mockExec,
      close: vi.fn(),
    };
    mockSQL = {
      Database: vi.fn(() => mockDatabase),
    };
    mockInitSqlJs = vi.fn(() => Promise.resolve(mockSQL));

    // Mock global fetch
    global.fetch = mockFetch;

    // Mock SQL.js
    vi.doMock('sql.js', () => ({
      default: mockInitSqlJs,
    }));

    // Mock database URL
    vi.doMock('../../../gotx-randomizer.sqlite?url', () => ({
      default: 'mock-database-url',
    }));

    // Default successful mocks
    mockFetch.mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['mock database content'])),
    });

    // Default mock data
    mockExec.mockReturnValue([
      {
        values: [
          ['Game 1', 10],
          ['Game 2', 20],
          ['Game 3', 15],
        ],
      },
    ]);
  });

  describe('initialization', () => {
    it('should initialize and return a client with all expected methods', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
      expect(typeof client.mostCompletedGames).toBe('function');
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
    it('should return a client object with database methods', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      // Test for some key methods that should exist
      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
      expect(typeof client.mostCompletedGames).toBe('function');
      expect(typeof client.getGameById).toBe('function');

      // Test that the client has a reasonable number of methods
      const clientMethods = Object.keys(client).filter(
        (key) => typeof client[key] === 'function',
      );
      expect(clientMethods.length).toBeGreaterThan(20);
    });

    it('should execute SQL queries and return results', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      const result = client.mostCompletedGames();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle parameterized queries without throwing', async () => {
      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      // These should not throw errors
      expect(() => client.getNominationsByUserId(123)).not.toThrow();
      expect(() => client.getCompletionsByUserId(456)).not.toThrow();
      expect(() => client.getGameById(789)).not.toThrow();
    });

    it('should handle methods that return empty arrays when database is not available', async () => {
      // When database initialization fails, methods with fallbacks should return empty arrays
      mockFetch.mockRejectedValue(new Error('Database fetch failed'));

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      // Methods with ?? [] fallback should return empty arrays
      const result = client.mostCompletedGames();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('data transformation', () => {
    it('should work with successful database initialization', async () => {
      // Ensure successful initialization
      mockFetch.mockResolvedValue({
        blob: () => Promise.resolve(new Blob(['mock database content'])),
      });

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

      // Test that the client can be called without errors
      expect(() => client.mostCompletedGames()).not.toThrow();

      const result = client.mostCompletedGames();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle game data transformation when database is available', async () => {
      // Mock successful database initialization
      mockFetch.mockResolvedValue({
        blob: () => Promise.resolve(new Blob(['mock database content'])),
      });

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

      // Test that methods can be called
      expect(() => client.getGotmWinners()).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle database initialization failure gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Init failed'));

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
      expect(typeof client.mostCompletedGames).toBe('function');
    });

    it('should handle SQL.js initialization failure', async () => {
      mockInitSqlJs.mockRejectedValue(new Error('SQL.js init failed'));

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');
    });

    it('should handle database creation failure', async () => {
      mockSQL.Database.mockImplementation(() => {
        throw new Error('Database creation failed');
      });

      const { default: initDbClient } = await import(
        '../../../data/initDbClient'
      );
      const client = await initDbClient();

      expect(client).toBeDefined();
      expect(typeof client.getGotmWinners).toBe('function');

      // Reset for other tests
      mockSQL.Database.mockImplementation(() => mockDatabase);
    });
  });
});
