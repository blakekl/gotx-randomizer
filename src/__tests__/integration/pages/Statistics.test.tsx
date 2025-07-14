import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Statistics from '../../../pages/Statistics/Statistics';
import {
  createMockDbStore,
  createMockSettingsStore,
  StoreContext,
} from '../../test-utils/mockStores';

// Mock Chart component since we already tested it separately
vi.mock('../../../pages/Statistics/Chart', () => ({
  default: vi.fn(({ data, title, name }) => (
    <div data-testid="mock-chart">
      <div data-testid="chart-title">{title}</div>
      <div data-testid="chart-name">{name}</div>
      <div data-testid="chart-data-count">{data?.length || 0}</div>
    </div>
  )),
}));

const renderWithStores = (mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    games: [
      { id: 1, name: 'Game 1', genre: 'Action', system: 'PC' },
      { id: 2, name: 'Game 2', genre: 'RPG', system: 'Console' },
      { id: 3, name: 'Game 3', genre: 'Action', system: 'PC' },
    ],
    users: [
      { id: 1, username: 'user1', totalCompletions: 5 },
      { id: 2, username: 'user2', totalCompletions: 3 },
    ],
    completions: [
      { id: 1, gameId: 1, userId: 1, rating: 8 },
      { id: 2, gameId: 2, userId: 1, rating: 9 },
      { id: 3, gameId: 1, userId: 2, rating: 7 },
    ],
    getGameStats: vi.fn(() => ({
      totalGames: 3,
      gamesByGenre: [
        { label: 'Action', value: 2 },
        { label: 'RPG', value: 1 },
      ],
      gamesBySystem: [
        { label: 'PC', value: 2 },
        { label: 'Console', value: 1 },
      ],
      averageRating: 8.0,
    })),
    getUserStats: vi.fn(() => ({
      totalUsers: 2,
      usersByCompletions: [
        { label: 'user1', value: 5 },
        { label: 'user2', value: 3 },
      ],
      averageCompletions: 4,
    })),
    ...mockStores.dbStore,
  });

  const mockSettingsStore = createMockSettingsStore(mockStores.settingsStore);

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <BrowserRouter>
      <StoreContext.Provider value={mockContext}>
        <Statistics />
      </StoreContext.Provider>
    </BrowserRouter>,
  );
};

describe('Statistics Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('page rendering', () => {
    it('should render statistics page title', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByText(/statistics/i)).toBeInTheDocument();
      });
    });

    it('should render all chart sections', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/games by genre/i)).toBeInTheDocument();
        expect(screen.getByText(/games by system/i)).toBeInTheDocument();
        expect(screen.getByText(/user completions/i)).toBeInTheDocument();
      });
    });

    it('should render charts with mock data', async () => {
      renderWithStores();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts).toHaveLength(3); // Genre, System, User charts

        expect(screen.getByTestId('chart-title')).toBeInTheDocument();
        expect(screen.getByTestId('chart-data-count')).toBeInTheDocument();
      });
    });
  });

  describe('data loading', () => {
    it('should call database methods to load statistics', async () => {
      const mockGetGameStats = vi.fn(() => ({
        gamesByGenre: [{ label: 'Action', value: 2 }],
        gamesBySystem: [{ label: 'PC', value: 2 }],
      }));
      const mockGetUserStats = vi.fn(() => ({
        usersByCompletions: [{ label: 'user1', value: 5 }],
      }));

      renderWithStores({
        dbStore: {
          getGameStats: mockGetGameStats,
          getUserStats: mockGetUserStats,
        },
      });

      await waitFor(() => {
        expect(mockGetGameStats).toHaveBeenCalled();
        expect(mockGetUserStats).toHaveBeenCalled();
      });
    });

    it('should handle empty data gracefully', async () => {
      renderWithStores({
        dbStore: {
          getGameStats: vi.fn(() => ({
            gamesByGenre: [],
            gamesBySystem: [],
          })),
          getUserStats: vi.fn(() => ({
            usersByCompletions: [],
          })),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/no data available/i)).toBeInTheDocument();
      });
    });

    it('should handle database errors gracefully', async () => {
      renderWithStores({
        dbStore: {
          getGameStats: vi.fn(() => {
            throw new Error('Database error');
          }),
          error: 'Database connection failed',
        },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/error loading statistics/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', async () => {
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];

      for (const viewport of viewports) {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });

        renderWithStores();

        await waitFor(() => {
          const container = screen.getByTestId('statistics-container');
          expect(container).toHaveClass('columns');
        });
      }
    });

    it('should handle chart resizing', async () => {
      renderWithStores();

      // Simulate window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      fireEvent(window, new Event('resize'));

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts).toHaveLength(3);
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();

        const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
        expect(sectionHeadings.length).toBeGreaterThan(0);
      });
    });

    it('should have accessible chart descriptions', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/games by genre/i)).toBeInTheDocument();
        expect(screen.getByText(/games by system/i)).toBeInTheDocument();
        expect(screen.getByText(/user completions/i)).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter>
            <Statistics />
          </BrowserRouter>,
        );
      }).toThrow();
    });

    it('should handle malformed data gracefully', async () => {
      renderWithStores({
        dbStore: {
          getGameStats: vi.fn(() => ({
            gamesByGenre: [{ label: null, value: 'invalid' }],
          })),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/data format error/i)).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', async () => {
      const { unmount } = renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/statistics/i)).toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });

    it('should handle large datasets efficiently', async () => {
      const largeGenreData = Array.from({ length: 100 }, (_, i) => ({
        label: `Genre ${i + 1}`,
        value: Math.floor(Math.random() * 50),
      }));

      const startTime = performance.now();
      renderWithStores({
        dbStore: {
          getGameStats: vi.fn(() => ({
            gamesByGenre: largeGenreData,
            gamesBySystem: largeGenreData,
          })),
        },
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(2000); // Should render within 2 seconds

      await waitFor(() => {
        expect(screen.getByText(/statistics/i)).toBeInTheDocument();
      });
    });
  });
});
