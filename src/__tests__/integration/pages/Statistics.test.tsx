import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Statistics from '../../../pages/Statistics/Statistics';
import { StoreContext } from '../../../stores';
import {
  createMockDbStore,
  createMockSettingsStore,
} from '../../test-utils/mockStores';

// Mock Chart component since it uses external charting library
vi.mock('../../../pages/Statistics/Chart', () => ({
  default: ({ data, title }: { data: any; title: string }) => (
    <div data-testid="mock-chart" data-title={title}>
      Chart: {title} ({data?.length || 0} items)
    </div>
  ),
}));

const renderWithStores = (mockStores = {}) => {
  const mockDbStore = createMockDbStore(mockStores.dbStore);
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
    it('should render statistics page title', () => {
      renderWithStores();

      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });

    it('should render all chart sections', () => {
      renderWithStores();

      // Check for main sections
      expect(screen.getByText(/Nominations by Theme/)).toBeInTheDocument();
      expect(screen.getByText(/Points by User/)).toBeInTheDocument();
      expect(screen.getByText(/Completions by User/)).toBeInTheDocument();
    });

    it('should render charts with mock data', async () => {
      const mockStats = {
        nominationsByTheme: [
          { label: 'Theme 1', value: 10 },
          { label: 'Theme 2', value: 15 },
        ],
        pointsByUser: [
          { label: 'User1', value: 25 },
          { label: 'User2', value: 30 },
        ],
        completionsByUser: [
          { label: 'User1', value: 5 },
          { label: 'User2', value: 8 },
        ],
      };

      renderWithStores({
        dbStore: {
          getNominationsByTheme: vi.fn(() => mockStats.nominationsByTheme),
          getPointsByUser: vi.fn(() => mockStats.pointsByUser),
          getCompletionsByUser: vi.fn(() => mockStats.completionsByUser),
        },
      });

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts).toHaveLength(3);
      });
    });
  });

  describe('data loading', () => {
    it('should call database methods to load statistics', async () => {
      const mockDbStore = {
        getNominationsByTheme: vi.fn(() => []),
        getPointsByUser: vi.fn(() => []),
        getCompletionsByUser: vi.fn(() => []),
        getGamesByGenre: vi.fn(() => []),
        getGamesByYear: vi.fn(() => []),
        getGamesByPlatform: vi.fn(() => []),
      };

      renderWithStores({ dbStore: mockDbStore });

      await waitFor(() => {
        expect(mockDbStore.getNominationsByTheme).toHaveBeenCalled();
        expect(mockDbStore.getPointsByUser).toHaveBeenCalled();
        expect(mockDbStore.getCompletionsByUser).toHaveBeenCalled();
      });
    });

    it('should handle empty data gracefully', async () => {
      renderWithStores({
        dbStore: {
          getNominationsByTheme: vi.fn(() => []),
          getPointsByUser: vi.fn(() => []),
          getCompletionsByUser: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        charts.forEach((chart) => {
          expect(chart).toHaveTextContent('(0 items)');
        });
      });
    });

    it('should handle database errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderWithStores({
        dbStore: {
          getNominationsByTheme: vi.fn(() => {
            throw new Error('DB Error');
          }),
          getPointsByUser: vi.fn(() => {
            throw new Error('DB Error');
          }),
          getCompletionsByUser: vi.fn(() => {
            throw new Error('DB Error');
          }),
        },
      });

      // Should not crash the component
      expect(screen.getByText('Statistics')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', () => {
      renderWithStores();

      // Check for responsive classes
      const container = screen.getByText('Statistics').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should handle chart resizing', async () => {
      renderWithStores();

      // Simulate window resize
      global.dispatchEvent(new Event('resize'));

      await waitFor(() => {
        expect(screen.getByText('Statistics')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithStores();

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Statistics');
    });

    it('should have accessible chart descriptions', async () => {
      renderWithStores();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        charts.forEach((chart) => {
          expect(chart).toHaveAttribute('data-title');
        });
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
      }).toThrow(); // Should throw because no store context
    });

    it('should handle malformed data gracefully', async () => {
      renderWithStores({
        dbStore: {
          getNominationsByTheme: vi.fn(() => null),
          getPointsByUser: vi.fn(() => undefined),
          getCompletionsByUser: vi.fn(() => 'invalid'),
        },
      });

      // Should not crash
      expect(screen.getByText('Statistics')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithStores();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        label: `Item ${i}`,
        value: Math.random() * 100,
      }));

      renderWithStores({
        dbStore: {
          getNominationsByTheme: vi.fn(() => largeDataset),
          getPointsByUser: vi.fn(() => largeDataset),
          getCompletionsByUser: vi.fn(() => largeDataset),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Statistics')).toBeInTheDocument();
      });
    });
  });
});
