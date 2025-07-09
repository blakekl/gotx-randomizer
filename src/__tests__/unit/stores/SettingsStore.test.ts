import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsStore from '../../../stores/SettingsStore';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('SettingsStore', () => {
  let settingsStore: SettingsStore;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset localStorage mocks
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {});

    settingsStore = new SettingsStore();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(settingsStore.hltbFilter).toEqual([0, Number.MAX_SAFE_INTEGER]);
      expect(settingsStore.hltbMax).toBe(Number.MAX_SAFE_INTEGER);
      expect(settingsStore.hltbMin).toBe(0);
      expect(settingsStore.hiddenGames).toEqual([]);
      expect(settingsStore.includeGotmRunnerUp).toBe(true);
      expect(settingsStore.includeGotmWinners).toBe(true);
      expect(settingsStore.includeHiddenGames).toBe(false);
      expect(settingsStore.includeRetrobits).toBe(true);
      expect(settingsStore.includeRpgRunnerUp).toBe(true);
      expect(settingsStore.includeRpgWinners).toBe(true);
    });

    it('should load hidden games from localStorage on initialization', () => {
      const mockHiddenGames = [1, 2, 3];
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'completed') return JSON.stringify(mockHiddenGames);
        return null;
      });

      const store = new SettingsStore();

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('completed');
      expect(store.hiddenGames).toEqual(mockHiddenGames);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'completed') return 'invalid json';
        return null;
      });

      expect(() => new SettingsStore()).toThrow();
    });

    it('should handle missing localStorage data', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const store = new SettingsStore();

      expect(store.hiddenGames).toEqual([]);
    });
  });

  describe('HLTB filter management', () => {
    beforeEach(() => {
      settingsStore.setHltbMin(0);
      settingsStore.setHltbMax(100);
    });

    it('should set HLTB filter within valid range', () => {
      const newFilter = [10, 50];

      settingsStore.setHltbFilter(newFilter);

      expect(settingsStore.hltbFilter).toEqual(newFilter);
    });

    it('should reject filter values outside min/max range', () => {
      const originalFilter = settingsStore.hltbFilter;
      const invalidFilter = [-10, 200]; // Outside 0-100 range

      settingsStore.setHltbFilter(invalidFilter);

      expect(settingsStore.hltbFilter).toEqual(originalFilter);
    });

    it('should set minimum HLTB value', () => {
      settingsStore.setHltbMin(5);

      expect(settingsStore.hltbMin).toBe(5);
    });

    it('should adjust filter when min is increased above current filter', () => {
      settingsStore.setHltbFilter([10, 50]);
      settingsStore.setHltbMin(20);

      expect(settingsStore.hltbMin).toBe(20);
      expect(settingsStore.hltbFilter[0]).toBe(20);
    });

    it('should set maximum HLTB value', () => {
      settingsStore.setHltbMax(80);

      expect(settingsStore.hltbMax).toBe(80);
    });

    it('should adjust filter when max is decreased below current filter', () => {
      settingsStore.setHltbFilter([10, 50]);
      settingsStore.setHltbMax(30);

      expect(settingsStore.hltbMax).toBe(30);
      expect(settingsStore.hltbFilter[1]).toBe(30);
    });
  });

  describe('game type toggles', () => {
    it('should toggle GotM runner up inclusion', () => {
      const original = settingsStore.includeGotmRunnerUp;

      settingsStore.toggleGotmRunnerUp();

      expect(settingsStore.includeGotmRunnerUp).toBe(!original);
    });

    it('should toggle GotM winners inclusion', () => {
      const original = settingsStore.includeGotmWinners;

      settingsStore.toggleGotmWinners();

      expect(settingsStore.includeGotmWinners).toBe(!original);
    });

    it('should toggle Retrobits inclusion', () => {
      const original = settingsStore.includeRetrobits;

      settingsStore.toggleRetrobits();

      expect(settingsStore.includeRetrobits).toBe(!original);
    });

    it('should toggle RPG runner up inclusion', () => {
      const original = settingsStore.includeRpgRunnerUp;

      settingsStore.toggleRpgRunnerUp();

      expect(settingsStore.includeRpgRunnerUp).toBe(!original);
    });

    it('should toggle RPG winners inclusion', () => {
      const original = settingsStore.includeRpgWinners;

      settingsStore.toggleRpgWinners();

      expect(settingsStore.includeRpgWinners).toBe(!original);
    });

    it('should toggle hidden games inclusion', () => {
      const original = settingsStore.includeHiddenGames;

      settingsStore.toggleHiddenGames();

      expect(settingsStore.includeHiddenGames).toBe(!original);
    });
  });

  describe('hidden games management', () => {
    it('should add game to hidden list', () => {
      const gameId = 123;

      settingsStore.toggleHiddenGame(gameId);

      expect(settingsStore.hiddenGames).toContain(gameId);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'completed',
        JSON.stringify([gameId]),
      );
    });

    it('should remove game from hidden list if already present', () => {
      const gameId = 123;
      settingsStore.hiddenGames = [gameId, 456];

      settingsStore.toggleHiddenGame(gameId);

      expect(settingsStore.hiddenGames).not.toContain(gameId);
      expect(settingsStore.hiddenGames).toContain(456);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'completed',
        JSON.stringify([456]),
      );
    });

    it('should handle multiple games in hidden list', () => {
      const gameIds = [1, 2, 3];

      gameIds.forEach((id) => settingsStore.toggleHiddenGame(id));

      expect(settingsStore.hiddenGames).toEqual(gameIds);
    });

    it('should persist hidden games to localStorage on each change', () => {
      settingsStore.toggleHiddenGame(1);
      settingsStore.toggleHiddenGame(2);

      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(
        1,
        'completed',
        JSON.stringify([1]),
      );
      expect(mockLocalStorage.setItem).toHaveBeenNthCalledWith(
        2,
        'completed',
        JSON.stringify([1, 2]),
      );
    });

    it('should handle duplicate game IDs gracefully', () => {
      const gameId = 123;

      settingsStore.toggleHiddenGame(gameId);
      settingsStore.toggleHiddenGame(gameId);

      expect(settingsStore.hiddenGames).toEqual([]);
    });
  });

  describe('localStorage error handling', () => {
    it('should handle localStorage setItem errors by throwing', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage full');
      });

      // The current implementation doesn't handle localStorage errors gracefully
      expect(() => settingsStore.toggleHiddenGame(123)).toThrow(
        'localStorage full',
      );
    });

    it('should handle localStorage getItem errors by throwing', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      // The current implementation doesn't handle localStorage errors gracefully
      expect(() => new SettingsStore()).toThrow('localStorage error');
    });
  });

  describe('edge cases', () => {
    it('should handle very large HLTB values', () => {
      const largeValue = Number.MAX_SAFE_INTEGER;

      settingsStore.setHltbMax(largeValue);
      settingsStore.setHltbFilter([0, largeValue]);

      expect(settingsStore.hltbMax).toBe(largeValue);
      expect(settingsStore.hltbFilter[1]).toBe(largeValue);
    });

    it('should handle negative HLTB values', () => {
      settingsStore.setHltbMin(-10);

      expect(settingsStore.hltbMin).toBe(-10);
    });

    it('should handle zero HLTB values', () => {
      settingsStore.setHltbMin(0);
      settingsStore.setHltbMax(0);
      settingsStore.setHltbFilter([0, 0]);

      expect(settingsStore.hltbMin).toBe(0);
      expect(settingsStore.hltbMax).toBe(0);
      expect(settingsStore.hltbFilter).toEqual([0, 0]);
    });
  });
});
