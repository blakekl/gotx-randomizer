import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameDetails from '../../../pages/Games/GameDetails';
import {
  createMockDbStore,
  createMockSettingsStore,
  StoreContext,
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
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
      });
    });

    it('should display game details', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Developer')).toBeInTheDocument();
        expect(screen.getByText('Test Publisher')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
      });
    });

    it('should display HLTB information when available', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText(/10.*hours/i)).toBeInTheDocument();
        expect(screen.getByText(/25.*hours/i)).toBeInTheDocument();
      });
    });

    it('should display game image', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/game.jpg');
      });
    });

    it('should handle game not found', async () => {
      renderWithStores('999');

      await waitFor(() => {
        expect(screen.getByText(/game not found/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid game ID', async () => {
      renderWithStores('invalid');

      await waitFor(() => {
        expect(screen.getByText(/invalid game/i)).toBeInTheDocument();
      });
    });
  });

  describe('regional titles display', () => {
    it('should display all regional titles when available', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
        expect(screen.getByText('Test Game World')).toBeInTheDocument();
        expect(screen.getByText('テストゲーム')).toBeInTheDocument();
      });
    });

    it('should handle missing regional titles gracefully', async () => {
      const gameWithoutTitles = {
        ...mockGame,
        title_jap: null,
        title_eu: null,
      };
      renderWithStores('1', {
        dbStore: { getGameById: vi.fn(() => gameWithoutTitles) },
      });

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
        expect(screen.queryByText('テストゲーム')).not.toBeInTheDocument();
      });
    });
  });

  describe('data loading', () => {
    it('should call getGameById with correct game ID', async () => {
      const mockGetGameById = vi.fn(() => mockGame);
      renderWithStores('1', {
        dbStore: { getGameById: mockGetGameById },
      });

      await waitFor(() => {
        expect(mockGetGameById).toHaveBeenCalledWith(1);
      });
    });

    it('should handle database errors gracefully', async () => {
      const mockGetGameById = vi.fn(() => {
        throw new Error('Database error');
      });
      renderWithStores('1', {
        dbStore: { getGameById: mockGetGameById },
      });

      await waitFor(() => {
        expect(screen.getByText(/error loading game/i)).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      const mockGetGameById = vi.fn(() => new Promise(() => {})); // Never resolves
      renderWithStores('1', {
        dbStore: { getGameById: mockGetGameById, isLoading: true },
      });

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('navigation and routing', () => {
    it('should extract game ID from URL params', async () => {
      const mockGetGameById = vi.fn(() => mockGame);
      renderWithStores('123', {
        dbStore: { getGameById: mockGetGameById },
      });

      await waitFor(() => {
        expect(mockGetGameById).toHaveBeenCalledWith(123);
      });
    });

    it('should handle navigation back to games list', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to games/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/games');
      });
    });
  });

  describe('responsive design', () => {
    it('should have responsive layout classes', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const container = screen.getByTestId('game-details-container');
        expect(container).toHaveClass('columns', 'is-mobile');
      });
    });

    it('should handle mobile view appropriately', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithStores('1');

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveClass('is-mobile-friendly');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test Game');
      });
    });

    it('should have accessible image with alt text', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute(
          'alt',
          expect.stringContaining('Test Game'),
        );
      });
    });

    it('should have proper navigation links', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to games/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAccessibleName();
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to games/i });
        backLink.focus();
        expect(document.activeElement).toBe(backLink);
      });
    });
  });

  describe('data formatting', () => {
    it('should format HLTB times correctly', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText(/main story.*10.*hours/i)).toBeInTheDocument();
        expect(
          screen.getByText(/completionist.*25.*hours/i),
        ).toBeInTheDocument();
      });
    });

    it('should handle missing HLTB data', async () => {
      const gameWithoutHLTB = {
        ...mockGame,
        hltb_main: null,
        hltb_completionist: null,
      };
      renderWithStores('1', {
        dbStore: { getGameById: vi.fn(() => gameWithoutHLTB) },
      });

      await waitFor(() => {
        expect(screen.getByText(/no time data available/i)).toBeInTheDocument();
      });
    });

    it('should handle zero HLTB values', async () => {
      const gameWithZeroHLTB = {
        ...mockGame,
        hltb_main: 0,
        hltb_completionist: 0,
      };
      renderWithStores('1', {
        dbStore: { getGameById: vi.fn(() => gameWithZeroHLTB) },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/time data not available/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter>
            <Routes>
              <Route path="/games/:gameId" element={<GameDetails />} />
            </Routes>
          </BrowserRouter>,
        );
      }).toThrow();
    });

    it('should handle malformed game data', async () => {
      const malformedGame = { id: 1, title_usa: null, developer: undefined };
      renderWithStores('1', {
        dbStore: { getGameById: vi.fn(() => malformedGame) },
      });

      await waitFor(() => {
        expect(screen.getByText(/unknown game/i)).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', async () => {
      const { unmount } = renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });

    it('should render quickly', async () => {
      const startTime = performance.now();
      renderWithStores('1');
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);

      await waitFor(() => {
        expect(screen.getByText('Test Game')).toBeInTheDocument();
      });
    });
  });
});
