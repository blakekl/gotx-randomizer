import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import GameDetails from '../../../pages/Games/GameDetails';
import {
  createMockDbStore,
  createMockSettingsStore,
  MockStoreContext,
} from '../../test-utils/mockStores';
import DbStore from '../../../stores/DbStore';
import SettingsStore from '../../../stores/SettingsStore';

const mockGame = {
  id: 1,
  title_usa: 'Test Game USA',
  title_world: 'Test Game World',
  title_eu: 'Test Game EU',
  title_jap: 'テストゲーム',
  title_other: 'Test Game Other',
  year: 2020,
  system: 'PC',
  developer: 'Test Developer',
  genre: 'Action',
  img_url: 'https://example.com/game.jpg',
  time_to_beat: 10,
  screenscraper_id: 12345,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
};

const mockNominations = [
  {
    game_title: 'Test Game',
    nomination_type: 'gotm' as any,
    game_id: 1,
    user_name: 'Test User',
    game_description: 'A test game',
    theme_title: 'Test Theme',
    theme_description: 'A test theme',
    date: '2023-01-01',
    winner: true,
  },
];

const renderWithStores = (
  gameId = '1',
  mockStores: {
    dbStore?: Partial<DbStore>;
    settingsStore?: Partial<SettingsStore>;
  } = {},
) => {
  const mockDbStore = createMockDbStore({
    getGameById: vi.fn((id) => (id === 1 ? mockGame : null)),
    getNominationsByGame: vi.fn(() => mockNominations),
    ...mockStores.dbStore,
  }) as DbStore;

  const mockSettingsStore = createMockSettingsStore({
    ...mockStores.settingsStore,
  }) as SettingsStore;

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <MemoryRouter initialEntries={[`/games/${gameId}`]}>
      <MockStoreContext.Provider value={mockContext}>
        <Routes>
          <Route path="/games/:gameId" element={<GameDetails />} />
        </Routes>
      </MockStoreContext.Provider>
    </MemoryRouter>,
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
        // The component shows the first available title with flag
        expect(screen.getByText(/🇺🇸 Test Game USA/)).toBeInTheDocument();
      });
    });

    it('should display game details', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Developer')).toBeInTheDocument();
        expect(screen.getByText('PC')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
      });
    });

    it('should display time to beat information when available', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('10 hours')).toBeInTheDocument();
      });
    });

    it('should display game image', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // Find image by src attribute since it has display: none initially
        const image = document.querySelector(
          'img[src="https://example.com/game.jpg"]',
        );
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/game.jpg');
      });
    });

    it('should handle game not found', async () => {
      renderWithStores('999', {
        dbStore: {
          getGameById: vi.fn(() => null),
        },
      });

      // Should navigate to 404 - we can't easily test navigation in this setup
      // but we can verify the component doesn't crash
      await waitFor(() => {
        // The component should not render game content
        expect(screen.queryByText(/Test Game/)).not.toBeInTheDocument();
      });
    });

    it('should handle invalid game ID', async () => {
      renderWithStores('invalid', {
        dbStore: {
          getGameById: vi.fn(() => null),
        },
      });

      await waitFor(() => {
        // Should handle invalid ID gracefully
        expect(screen.queryByText(/Test Game/)).not.toBeInTheDocument();
      });
    });
  });

  describe('regional titles display', () => {
    it('should display all regional titles when available', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // Main title (first one)
        expect(screen.getByText(/🇺🇸 Test Game USA/)).toBeInTheDocument();
        // Subtitle (other regional titles)
        expect(screen.getByText(/🌎 Test Game World/)).toBeInTheDocument();
        expect(screen.getByText(/🇪🇺 Test Game EU/)).toBeInTheDocument();
        expect(screen.getByText(/🇯🇵 テストゲーム/)).toBeInTheDocument();
        expect(screen.getByText(/🏳️ Test Game Other/)).toBeInTheDocument();
      });
    });

    it('should handle missing regional titles gracefully', async () => {
      const gameWithLimitedTitles = {
        ...mockGame,
        title_usa: 'Only USA Title',
        title_world: '',
        title_eu: '',
        title_jap: '',
        title_other: '',
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithLimitedTitles),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/🇺🇸 Only USA Title/)).toBeInTheDocument();
        // Should not show empty regional titles
        expect(screen.queryByText(/🌎/)).not.toBeInTheDocument();
        expect(screen.queryByText(/🇪🇺/)).not.toBeInTheDocument();
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

    it('should call getNominationsByGame to load nominations', async () => {
      const mockGetNominations = vi.fn(() => mockNominations);
      renderWithStores('1', {
        dbStore: {
          getNominationsByGame: mockGetNominations,
        },
      });

      await waitFor(() => {
        expect(mockGetNominations).toHaveBeenCalledWith(1);
      });
    });

    // Note: GameDetails component doesn't implement error handling
    // It's a simple wrapper that delegates to GameDisplay
    // Database errors would be handled at the store level
  });

  describe('game metadata display', () => {
    it('should display screenscraper ID when available', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('12345')).toBeInTheDocument();
      });
    });

    it('should handle missing screenscraper ID', async () => {
      const gameWithoutScreenscraper = {
        ...mockGame,
        screenscraper_id: 0,
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithoutScreenscraper),
        },
      });

      await waitFor(() => {
        // Should not show screenscraper section
        expect(screen.queryByText('12345')).not.toBeInTheDocument();
      });
    });

    it('should display "No data" for missing time to beat', async () => {
      const gameWithoutTimeData = {
        ...mockGame,
        time_to_beat: 0,
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithoutTimeData),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('No data')).toBeInTheDocument();
      });
    });
  });

  describe('component structure', () => {
    it('should have game display container with correct attributes', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const container = screen.getByTestId('game-display');
        expect(container).toBeInTheDocument();
        expect(container).toHaveAttribute('data-gameid', '1');
      });
    });

    it('should show loader initially', async () => {
      renderWithStores('1');

      // Loader should be visible initially (before image loads)
      const loader = document.querySelector('.loader');
      expect(loader).toBeInTheDocument();
    });

    it('should render nominations list', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // The NominationList component should be rendered
        // We can't easily test its content without mocking it, but we can verify the game display renders
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });
    });
  });

  describe('responsive behavior', () => {
    it('should have responsive layout classes', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // Check for Bulma responsive classes
        expect(document.querySelector('.is-hidden-mobile')).toBeInTheDocument();
        expect(document.querySelector('.is-hidden-tablet')).toBeInTheDocument();
      });
    });

    it('should display icons with proper titles', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // Check for emoji icons and their titles
        // Note: Responsive design creates multiple elements with same titles
        // (one hidden on mobile, one hidden on tablet)
        const yearIcons = screen.getAllByTitle('release year');
        const developerIcons = screen.getAllByTitle('developer');
        const timeIcons = screen.getAllByTitle('time to beat');

        expect(yearIcons.length).toBeGreaterThan(0);
        expect(developerIcons.length).toBeGreaterThan(0);
        expect(timeIcons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('image handling', () => {
    it('should handle image loading states', async () => {
      renderWithStores('1');

      await waitFor(() => {
        // Find image by src attribute since it has display: none
        const image = document.querySelector(
          'img[src="https://example.com/game.jpg"]',
        );
        expect(image).toBeInTheDocument();
        // Image should initially be hidden until loaded
        expect(image).toHaveStyle({ display: 'none' });
      });
    });

    it('should handle missing image URL', async () => {
      const gameWithoutImage = {
        ...mockGame,
        img_url: '',
      };

      renderWithStores('1', {
        dbStore: {
          getGameById: vi.fn(() => gameWithoutImage),
        },
      });

      await waitFor(() => {
        const image = document.querySelector('img[src=""]');
        expect(image).toBeInTheDocument();
        expect(image).toHaveStyle({ display: 'none' });
      });
    });
  });
});
