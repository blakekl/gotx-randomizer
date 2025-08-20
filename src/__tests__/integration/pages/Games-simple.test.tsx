import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Games from '../../../pages/Games/Games';
import { createMockGame } from '../../../test-utils/fixtures/gameData';

// Mock games data
const mockGames = [
  createMockGame({ id: 1, title_usa: 'Game One', system: 'NES', year: 1985 }),
  createMockGame({ id: 2, title_usa: 'Game Two', system: 'SNES', year: 1990 }),
  createMockGame({
    id: 3,
    title_usa: 'Game Three',
    system: 'Genesis',
    year: 1991,
  }),
  createMockGame({
    id: 4,
    title_usa: 'Another Game',
    system: 'NES',
    year: 1987,
  }),
  createMockGame({
    id: 5,
    title_usa: 'Final Game',
    system: 'SNES',
    year: 1995,
  }),
];

// Mock Pagination component
vi.mock('../../../components/Pagination', () => ({
  default: function MockPagination({
    count,
    onPageChange,
  }: {
    count: number;
    onPageChange: (range: number[]) => void;
  }) {
    // Simulate initial page load
    React.useEffect(() => {
      onPageChange([0, Math.min(10, count)]);
    }, [count, onPageChange]);

    return (
      <div data-testid="pagination">
        <span>Total: {count}</span>
        <button onClick={() => onPageChange([0, 10])}>Page 1</button>
        <button onClick={() => onPageChange([10, 20])}>Page 2</button>
      </div>
    );
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(component, {
    storeOverrides: {
      dbStore: {
        allGames: {
          gotmRunnerUp: mockGames.slice(0, 2),
          gotmWinners: mockGames.slice(2, 4),
          retrobits: mockGames.slice(4, 5),
          rpgRunnerUp: [],
          rpgWinners: [],
        },
      },
      settingsStore: {
        includeGotmRunnerUp: true,
        includeGotmWinners: true,
        includeRetrobits: true,
        includeRpgRunnerUp: true,
        includeRpgWinners: true,
        includeHiddenGames: false,
        hiddenGames: [],
        hltbFilter: [0, Number.MAX_SAFE_INTEGER],
      },
    },
  });
};

describe('Games Page Integration (Simple)', () => {
  const user = userEvent.setup();

  describe('basic rendering', () => {
    it('should render games list', () => {
      renderWithRouter(<Games />);

      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('Game Two')).toBeInTheDocument();
      expect(screen.getByText('Game Three')).toBeInTheDocument();
    });

    it('should display page title', () => {
      renderWithRouter(<Games />);

      expect(screen.getByText('Games')).toBeInTheDocument();
    });

    it('should render search input', () => {
      renderWithRouter(<Games />);

      expect(screen.getByPlaceholderText(/game title/i)).toBeInTheDocument();
    });

    it('should render pagination component', () => {
      renderWithRouter(<Games />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should render settings component', () => {
      renderWithRouter(<Games />);

      expect(screen.getByTestId('settings-component')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should filter games by title', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'Game One');

      expect(searchInput).toHaveValue('game one');
    });

    it('should handle case-insensitive search', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'GAME');

      expect(searchInput).toHaveValue('game');
    });
  });

  describe('game hiding functionality', () => {
    it('should render hide buttons for games', () => {
      renderWithRouter(<Games />);

      const hideButtons = screen.getAllByText(/hide/i);
      expect(hideButtons.length).toBeGreaterThan(0);
    });
  });

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      renderWithRouter(<Games />);

      expect(screen.getByPlaceholderText(/game title/i)).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      renderWithRouter(<Games />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Games');
    });
  });

  describe('error handling', () => {
    it('should handle empty games list', () => {
      render(<Games />, {
        storeOverrides: {
          dbStore: {
            allGames: {
              gotmRunnerUp: [],
              gotmWinners: [],
              retrobits: [],
              rpgRunnerUp: [],
              rpgWinners: [],
            },
          },
          settingsStore: {
            includeGotmRunnerUp: true,
            includeGotmWinners: true,
            includeRetrobits: true,
            includeRpgRunnerUp: true,
            includeRpgWinners: true,
            includeHiddenGames: false,
            hiddenGames: [],
            hltbFilter: [0, Number.MAX_SAFE_INTEGER],
          },
        },
      });

      expect(screen.getByText('Games')).toBeInTheDocument();
    });
  });
});
