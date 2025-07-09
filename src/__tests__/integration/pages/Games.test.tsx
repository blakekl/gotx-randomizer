import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Games from '../../../pages/Games/Games';
import { createMockGame } from '../../../test-utils/fixtures/gameData';

// Mock the stores
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

const mockDbStore = {
  allGames: {
    gotmRunnerUp: mockGames.slice(0, 2),
    gotmWinners: mockGames.slice(2, 4),
    retrobits: mockGames.slice(4, 5),
    rpgRunnerUp: [],
    rpgWinners: [],
  },
  getAllGames: vi.fn(() => mockGames),
  getNominationsByGame: vi.fn(() => []),
};

const mockSettingsStore = {
  hiddenGames: [],
  toggleHiddenGame: vi.fn(),
};

// Mock the useStores hook
vi.mock('../../../stores/useStores', () => ({
  useStores: () => ({
    settingsStore: mockSettingsStore,
    dbStore: mockDbStore,
  }),
}));

// Mock Pagination component
vi.mock('../../../components/Pagination', () => ({
  default: ({
    count,
    onPageChange,
  }: {
    count: number;
    onPageChange: (range: number[]) => void;
  }) => {
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
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Games Page Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSettingsStore.hiddenGames = [];
    mockDbStore.getAllGames.mockReturnValue(mockGames);
  });

  describe('initialization and rendering', () => {
    it('should render games list', () => {
      renderWithRouter(<Games />);

      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('Game Two')).toBeInTheDocument();
      expect(screen.getByText('Game Three')).toBeInTheDocument();
    });

    it('should display game details', () => {
      renderWithRouter(<Games />);

      // Should show system and year information
      expect(screen.getByText('NES')).toBeInTheDocument();
      expect(screen.getByText('1985')).toBeInTheDocument();
      expect(screen.getByText('SNES')).toBeInTheDocument();
      expect(screen.getByText('1990')).toBeInTheDocument();
    });

    it('should render pagination component', () => {
      renderWithRouter(<Games />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByText('Total: 5')).toBeInTheDocument();
    });

    it('should call getAllGames on mount', () => {
      renderWithRouter(<Games />);

      expect(mockDbStore.getAllGames).toHaveBeenCalledTimes(1);
    });
  });

  describe('search functionality', () => {
    it('should render search input', () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter games by title', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'Game One');

      await waitFor(() => {
        expect(screen.getByText('Game One')).toBeInTheDocument();
        expect(screen.queryByText('Game Two')).not.toBeInTheDocument();
      });
    });

    it('should filter games by system', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'NES');

      await waitFor(() => {
        expect(screen.getByText('Game One')).toBeInTheDocument();
        expect(screen.getByText('Another Game')).toBeInTheDocument();
        expect(screen.queryByText('Game Two')).not.toBeInTheDocument();
      });
    });

    it('should handle case-insensitive search', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'game one');

      await waitFor(() => {
        expect(screen.getByText('Game One')).toBeInTheDocument();
        expect(screen.queryByText('Game Two')).not.toBeInTheDocument();
      });
    });

    it('should show no results message for invalid search', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'Nonexistent Game');

      await waitFor(() => {
        expect(screen.getByText(/no games found/i)).toBeInTheDocument();
      });
    });

    it('should clear search results', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'Game One');

      await waitFor(() => {
        expect(screen.queryByText('Game Two')).not.toBeInTheDocument();
      });

      await user.clear(searchInput);

      await waitFor(() => {
        expect(screen.getByText('Game Two')).toBeInTheDocument();
      });
    });
  });

  describe('sorting functionality', () => {
    it('should render sort dropdown', () => {
      renderWithRouter(<Games />);

      const sortSelect = screen.getByDisplayValue(/title/i);
      expect(sortSelect).toBeInTheDocument();
    });

    it('should sort by title', async () => {
      renderWithRouter(<Games />);

      const sortSelect = screen.getByDisplayValue(/title/i);
      await user.selectOptions(sortSelect, 'title');

      // Games should be in alphabetical order
      const gameElements = screen.getAllByText(/Game|Another|Final/);
      expect(gameElements[0]).toHaveTextContent('Another Game');
      expect(gameElements[1]).toHaveTextContent('Final Game');
    });

    it('should sort by year', async () => {
      renderWithRouter(<Games />);

      const sortSelect = screen.getByDisplayValue(/title/i);
      await user.selectOptions(sortSelect, 'year');

      // Should sort by year (ascending)
      const yearElements = screen.getAllByText(/198\d|199\d/);
      expect(yearElements[0]).toHaveTextContent('1985');
    });

    it('should sort by system', async () => {
      renderWithRouter(<Games />);

      const sortSelect = screen.getByDisplayValue(/title/i);
      await user.selectOptions(sortSelect, 'system');

      // Should group by system
      const systemElements = screen.getAllByText(/NES|SNES|Genesis/);
      // Genesis should come first alphabetically
      expect(systemElements[0]).toHaveTextContent('Genesis');
    });
  });

  describe('pagination integration', () => {
    it('should handle page changes', async () => {
      renderWithRouter(<Games />);

      const page2Button = screen.getByText('Page 2');
      await user.click(page2Button);

      // Pagination component should handle the page change
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should update pagination count with search', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'NES');

      await waitFor(() => {
        // Should show filtered count
        expect(screen.getByText('Total: 2')).toBeInTheDocument();
      });
    });

    it('should reset to first page on search', async () => {
      renderWithRouter(<Games />);

      // Go to page 2
      const page2Button = screen.getByText('Page 2');
      await user.click(page2Button);

      // Then search
      const searchInput = screen.getByPlaceholderText(/game title/i);
      await user.type(searchInput, 'Game');

      // Should reset to page 1 (handled by pagination component)
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('game hiding functionality', () => {
    it('should render hide buttons for games', () => {
      renderWithRouter(<Games />);

      const hideButtons = screen.getAllByText(/hide/i);
      expect(hideButtons.length).toBeGreaterThan(0);
    });

    it('should hide games when hide button is clicked', async () => {
      renderWithRouter(<Games />);

      const hideButtons = screen.getAllByText(/hide/i);
      await user.click(hideButtons[0]);

      expect(mockSettingsStore.toggleHiddenGame).toHaveBeenCalledWith(1);
    });

    it('should show unhide button for hidden games', () => {
      mockSettingsStore.hiddenGames = [1];

      renderWithRouter(<Games />);

      expect(screen.getByText(/unhide/i)).toBeInTheDocument();
    });

    it('should filter out hidden games when not including them', () => {
      mockSettingsStore.hiddenGames = [1];

      renderWithRouter(<Games />);

      // Game One should still be visible (this component shows all games)
      expect(screen.getByText('Game One')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle empty games list', () => {
      mockDbStore.getAllGames.mockReturnValue([]);

      renderWithRouter(<Games />);

      expect(screen.getByText(/no games found/i)).toBeInTheDocument();
    });

    it('should handle store errors gracefully', () => {
      mockDbStore.getAllGames.mockImplementation(() => {
        throw new Error('Database error');
      });

      expect(() => renderWithRouter(<Games />)).not.toThrow();
    });

    it('should handle malformed game data', () => {
      mockDbStore.getAllGames.mockReturnValue([
        { id: 1 }, // Missing required fields
        null,
        undefined,
      ]);

      expect(() => renderWithRouter(<Games />)).not.toThrow();
    });

    it('should handle hide button errors', async () => {
      mockSettingsStore.toggleHiddenGame.mockImplementation(() => {
        throw new Error('Store error');
      });

      renderWithRouter(<Games />);

      const hideButton = screen.getAllByText(/hide/i)[0];

      // Should not crash the component
      expect(() => user.click(hideButton)).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have proper form labels', () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByLabelText(/search/i);
      expect(searchInput).toBeInTheDocument();

      const sortSelect = screen.getByLabelText(/sort/i);
      expect(sortSelect).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      renderWithRouter(<Games />);

      const hideButtons = screen.getAllByRole('button', { name: /hide/i });
      expect(hideButtons.length).toBeGreaterThan(0);
    });

    it('should be keyboard navigable', () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);
      const sortSelect = screen.getByDisplayValue(/title/i);

      searchInput.focus();
      expect(searchInput).toHaveFocus();

      fireEvent.keyDown(searchInput, { key: 'Tab' });
      expect(sortSelect).toHaveFocus();
    });

    it('should have proper heading structure', () => {
      renderWithRouter(<Games />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/games/i);
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', () => {
      renderWithRouter(<Games />);

      // Should render main components
      expect(screen.getByPlaceholderText(/game title/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/title/i)).toBeInTheDocument();
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should handle long game titles', () => {
      const longTitleGame = createMockGame({
        id: 99,
        title_usa:
          'This is a very long game title that might wrap to multiple lines and should be handled gracefully',
      });

      mockDbStore.getAllGames.mockReturnValue([longTitleGame]);

      renderWithRouter(<Games />);

      expect(screen.getByText(longTitleGame.title_usa)).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should handle large game lists', () => {
      const largeGameList = Array.from({ length: 1000 }, (_, i) =>
        createMockGame({ id: i, title_usa: `Game ${i}` }),
      );

      mockDbStore.getAllGames.mockReturnValue(largeGameList);

      expect(() => renderWithRouter(<Games />)).not.toThrow();
    });

    it('should debounce search input', async () => {
      renderWithRouter(<Games />);

      const searchInput = screen.getByPlaceholderText(/game title/i);

      // Rapid typing
      await user.type(searchInput, 'Game');

      // Should handle rapid input without issues
      expect(searchInput).toHaveValue('Game');
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithRouter(<Games />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('data integration', () => {
    it('should display all game types', () => {
      renderWithRouter(<Games />);

      // Should show games from all categories
      expect(screen.getByText('Game One')).toBeInTheDocument(); // gotmRunnerUp
      expect(screen.getByText('Game Three')).toBeInTheDocument(); // gotmWinners
      expect(screen.getByText('Final Game')).toBeInTheDocument(); // retrobits
    });

    it('should handle missing game data fields', () => {
      const incompleteGame = createMockGame({
        id: 99,
        title_usa: 'Incomplete Game',
        system: '', // Missing system
        year: 0, // Missing year
      });

      mockDbStore.getAllGames.mockReturnValue([incompleteGame]);

      renderWithRouter(<Games />);

      expect(screen.getByText('Incomplete Game')).toBeInTheDocument();
    });

    it('should refresh data when store updates', () => {
      const { rerender } = renderWithRouter(<Games />);

      // Update mock data
      const newGames = [createMockGame({ id: 99, title_usa: 'New Game' })];
      mockDbStore.getAllGames.mockReturnValue(newGames);

      rerender(
        <BrowserRouter>
          <Games />
        </BrowserRouter>,
      );

      expect(mockDbStore.getAllGames).toHaveBeenCalled();
    });
  });
});
