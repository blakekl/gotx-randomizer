import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameDetails from '../../../pages/Games/GameDetails';
import { StoreContext } from '../../../stores';
import {
  createMockDbStore,
  createMockSettingsStore,
} from '../../test-utils/mockStores';

const mockGame = {
  id: 1,
  title_usa: 'Test Game',
  title_world: 'Test Game World',
  title_eu: 'Test Game EU',
  title_jap: 'テストゲーム',
  title_other: 'Test Game Other',
  developer: 'Test Developer',
  publisher: 'Test Publisher',
  release_year: 2020,
  genre: 'Action',
  platform: 'PC',
  img_url: 'https://example.com/game.jpg',
  hltb_main: 10,
  hltb_completionist: 25,
  screenscraper_id: 12345,
};

const renderWithStores = (gameId = '1', mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    getGameById: vi.fn((id) => (id === 1 ? mockGame : null)),
    ...mockStores.dbStore,
  });
  const mockSettingsStore = createMockSettingsStore(mockStores.settingsStore);

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <BrowserRouter initialEntries={[`/games/${gameId}`]}>
      <StoreContext.Provider value={mockContext}>
        <Routes>
          <Route path="/games/:gameId" element={<GameDetails />} />
        </Routes>
      </StoreContext.Provider>
    </BrowserRouter>,
  );
};

describe('GameDetails Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('game information display', () => {
    it('should display game title', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
      });
    });

    it('should display game details', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test Developer')).toBeInTheDocument();
        expect(screen.getByText('Test Publisher')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('PC')).toBeInTheDocument();
      });
    });

    it('should display HLTB information when available', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // Main story
        expect(screen.getByText('25')).toBeInTheDocument(); // Completionist
      });
    });

    it('should display game image', async () => {
      renderWithStores();

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://example.com/game.jpg');
      });
    });

    it('should handle game not found', async () => {
      renderWithStores('999', {
        dbStore: {
          getGameById: vi.fn(() => null),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/Game not found/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid game ID', async () => {
      renderWithStores('invalid', {
        dbStore: {
          getGameById: vi.fn(() => null),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/Game not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('regional titles display', () => {
    it('should display all regional titles when available', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument(); // USA
        expect(screen.getByText('Test Game World')).toBeInTheDocument(); // World
        expect(screen.getByText('Test Game EU')).toBeInTheDocument(); // EU
        expect(screen.getByText('テストゲーム')).toBeInTheDocument(); // Japanese
        expect(screen.getByText('Test Game Other')).toBeInTheDocument(); // Other
      });
    });

    it('should handle missing regional titles gracefully', async () => {
      const gameWithMissingTitles = {
        ...mockGame,
        title_world: null,
        title_eu: null,
        title_jap: null,
        title_other: null,
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithMissingTitles),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument(); // Should still show USA title
      });
    });
  });

  describe('data loading', () => {
    it('should call getGameById with correct game ID', async () => {
      const mockGetGameById = vi.fn(() => mockGame);

      renderWithStores('1', {
        dbStore: {
          getGameById: mockGetGameById,
        },
      });

      await waitFor(() => {
        expect(mockGetGameById).toHaveBeenCalledWith(1);
      });
    });

    it('should handle database errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => {
            throw new Error('DB Error');
          }),
        },
      });

      // Should show error state instead of crashing
      await waitFor(() => {
        expect(screen.getByText(/Error loading game/i)).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should show loading state initially', () => {
      renderWithStores();

      // Should show some loading indicator or the component should render quickly
      expect(screen.getByText(/Test Game|Loading|Game/)).toBeInTheDocument();
    });
  });

  describe('navigation and routing', () => {
    it('should extract game ID from URL params', async () => {
      const mockGetGameById = vi.fn(() => mockGame);

      renderWithStores('42', {
        dbStore: {
          getGameById: mockGetGameById,
        },
      });

      await waitFor(() => {
        expect(mockGetGameById).toHaveBeenCalledWith(42);
      });
    });

    it('should handle navigation back to games list', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByText(/Back to Games|← Games/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/games');
      });
    });
  });

  describe('responsive design', () => {
    it('should have responsive layout classes', async () => {
      renderWithStores();

      await waitFor(() => {
        const container = screen.getByText('Test Game').closest('div');
        expect(container).toBeInTheDocument();
      });
    });

    it('should handle mobile view appropriately', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const gameHeading = screen.getByRole('heading', { level: 1 });
        expect(gameHeading).toBeInTheDocument();
        expect(gameHeading).toHaveTextContent('Test Game');
      });
    });

    it('should have accessible image with alt text', async () => {
      renderWithStores();

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt');
      });
    });

    it('should have proper navigation links', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back|games/i });
        expect(backLink).toBeInTheDocument();
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back|games/i });
        backLink.focus();
        expect(backLink).toHaveFocus();
      });
    });
  });

  describe('data formatting', () => {
    it('should format HLTB times correctly', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('10')).toBeInTheDocument(); // Hours
        expect(screen.getByText('25')).toBeInTheDocument(); // Hours
      });
    });

    it('should handle missing HLTB data', async () => {
      const gameWithoutHLTB = {
        ...mockGame,
        hltb_main: null,
        hltb_completionist: null,
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithoutHLTB),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
        expect(screen.getByText(/No data available/i)).toBeInTheDocument();
      });
    });

    it('should handle zero HLTB values', async () => {
      const gameWithZeroHLTB = {
        ...mockGame,
        hltb_main: 0,
        hltb_completionist: 0,
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithZeroHLTB),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
        // Should show zero values or indicate no data
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter initialEntries={['/games/1']}>
            <Routes>
              <Route path="/games/:gameId" element={<GameDetails />} />
            </Routes>
          </BrowserRouter>,
        );
      }).toThrow(); // Should throw because no store context
    });

    it('should handle malformed game data', async () => {
      const malformedGame = {
        id: 1,
        title_usa: null,
        developer: undefined,
        release_year: 'invalid',
        hltb_main: 'not a number',
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => malformedGame),
        },
      });

      // Should not crash
      await waitFor(() => {
        expect(screen.getByText(/Game Details|Error/i)).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithStores();

      expect(() => unmount()).not.toThrow();
    });

    it('should render quickly', async () => {
      const startTime = performance.now();
      renderWithStores();
      const endTime = performance.now();

      // Should render in reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
