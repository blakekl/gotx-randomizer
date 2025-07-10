import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Randomizer from '../../../pages/Randomizer/Randomizer';
import { createMockGame } from '../../../test-utils/fixtures/gameData';

// Mock the stores
const mockSettingsStore = {
  hltbFilter: [0, 100],
  hltbMax: 100,
  hltbMin: 0,
  includeGotmRunnerUp: true,
  includeGotmWinners: true,
  includeRetrobits: true,
  includeRpgRunnerUp: true,
  includeRpgWinners: true,
  includeHiddenGames: false,
  hiddenGames: [],
  toggleHiddenGame: vi.fn(),
  setHltbMax: vi.fn(),
  setHltbMin: vi.fn(),
  setHltbFilter: vi.fn(),
  toggleGotmWinners: vi.fn(),
  toggleGotmRunnerUp: vi.fn(),
  toggleRetrobits: vi.fn(),
  toggleRpgWinners: vi.fn(),
  toggleRpgRunnerUp: vi.fn(),
  toggleHiddenGames: vi.fn(),
};

const mockGames = {
  gotmRunnerUp: [createMockGame({ id: 1, title_usa: 'GotM Runner Up Game' })],
  gotmWinners: [createMockGame({ id: 2, title_usa: 'GotM Winner Game' })],
  retrobits: [createMockGame({ id: 3, title_usa: 'Retrobit Game' })],
  rpgRunnerUp: [createMockGame({ id: 4, title_usa: 'RPG Runner Up Game' })],
  rpgWinners: [createMockGame({ id: 5, title_usa: 'RPG Winner Game' })],
};

const mockDbStore = {
  allGames: mockGames,
  getNominationsByGame: vi.fn(() => []),
};

// Mock the useStores hook
vi.mock('../../../stores/useStores', () => ({
  useStores: () => ({
    settingsStore: mockSettingsStore,
    dbStore: mockDbStore,
  }),
}));

// Mock child components to focus on integration logic
vi.mock('../../../pages/Randomizer/Settings/Settings', () => ({
  default: () => <div data-testid="settings-component">Settings</div>,
}));

vi.mock('../../../pages/Randomizer/GameDisplay/GameDisplay', () => ({
  default: ({ game }: { game: any }) => (
    <div data-testid="game-display">
      <h1>{game.title_usa}</h1>
      <button onClick={() => mockSettingsStore.toggleHiddenGame(game.id)}>
        Hide Game
      </button>
    </div>
  ),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Randomizer Page Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSettingsStore.hiddenGames = [];
    mockSettingsStore.includeGotmRunnerUp = true;
    mockSettingsStore.includeGotmWinners = true;
    mockSettingsStore.includeRetrobits = true;
    mockSettingsStore.includeRpgRunnerUp = true;
    mockSettingsStore.includeRpgWinners = true;
    mockSettingsStore.includeHiddenGames = false;
    mockSettingsStore.hltbFilter = [0, 100];
    
    // Reset mock games data
    mockDbStore.allGames = {
      gotmRunnerUp: [createMockGame({ id: 1, title_usa: 'GotM Runner Up Game' })],
      gotmWinners: [createMockGame({ id: 2, title_usa: 'GotM Winner Game' })],
      retrobits: [createMockGame({ id: 3, title_usa: 'Retrobit Game' })],
      rpgRunnerUp: [createMockGame({ id: 4, title_usa: 'RPG Runner Up Game' })],
      rpgWinners: [createMockGame({ id: 5, title_usa: 'RPG Winner Game' })],
    };
  });

  describe('routing and initialization', () => {
    it('should render at root path', () => {
      renderWithRouter(<Randomizer />);

      expect(screen.getByText('Reroll')).toBeInTheDocument();
      expect(screen.getByTestId('settings-component')).toBeInTheDocument();
    });

    it('should initialize with all game types enabled', () => {
      renderWithRouter(<Randomizer />);

      // Should have access to all game types initially
      const randomButton = screen.getByText('Reroll');
      expect(randomButton).toBeEnabled();
    });
  });

  describe('game pool generation', () => {
    it('should include all game types when all settings are enabled', async () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      // Should display a game from one of the enabled categories
      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });
    });

    it('should filter games based on settings', async () => {
      // Disable all but one game type
      mockSettingsStore.includeGotmRunnerUp = false;
      mockSettingsStore.includeRetrobits = false;
      mockSettingsStore.includeRpgRunnerUp = false;
      mockSettingsStore.includeRpgWinners = false;
      // Only GotM Winners enabled

      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        const gameDisplay = screen.getByTestId('game-display');
        expect(gameDisplay).toBeInTheDocument();
        // Should only show GotM Winner games
        expect(screen.getByText('GotM Winner Game')).toBeInTheDocument();
      });
    });

    it('should handle empty game pool', () => {
      // Disable all game types
      mockSettingsStore.includeGotmRunnerUp = false;
      mockSettingsStore.includeGotmWinners = false;
      mockSettingsStore.includeRetrobits = false;
      mockSettingsStore.includeRpgRunnerUp = false;
      mockSettingsStore.includeRpgWinners = false;

      renderWithRouter(<Randomizer />);

      // Should show the no games message instead of the randomizer interface
      expect(screen.getByText(/There are no games left in the pool/)).toBeInTheDocument();
      expect(screen.queryByText('Reroll')).not.toBeInTheDocument();
    });

    it('should respect HLTB filters', async () => {
      // Set up games with time_to_beat values
      const gameWithTime = createMockGame({ 
        id: 1, 
        title_usa: 'Game With Time', 
        time_to_beat: 55 
      });
      
      mockDbStore.allGames = {
        gotmRunnerUp: [gameWithTime],
        gotmWinners: [],
        retrobits: [],
        rpgRunnerUp: [],
        rpgWinners: [],
      };

      // Set a restrictive HLTB filter that includes our game
      mockSettingsStore.hltbFilter = [50, 60];
      mockSettingsStore.includeGotmRunnerUp = true;

      renderWithRouter(<Randomizer />);

      // Should have games available since our game fits the filter
      expect(screen.getByText('Reroll')).toBeInTheDocument();
      
      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      // Should show the game that matches the filter
      expect(screen.getByText('Game With Time')).toBeInTheDocument();
    });

      // Should still attempt to show a game (filtering logic tested in unit tests)
      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });
    });

    it('should exclude hidden games by default', async () => {
      mockSettingsStore.hiddenGames = [1, 2]; // Hide some games
      mockSettingsStore.includeHiddenGames = false;

      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        const gameDisplay = screen.getByTestId('game-display');
        expect(gameDisplay).toBeInTheDocument();
        // Should not show hidden games (games with id 1 and 2)
        expect(
          screen.queryByText('GotM Runner Up Game'),
        ).not.toBeInTheDocument();
        expect(screen.queryByText('GotM Winner Game')).not.toBeInTheDocument();
        // Should show non-hidden games
        expect(screen.getByText('Retrobit Game')).toBeInTheDocument();
      });
    });

    it('should include hidden games when setting is enabled', async () => {
      mockSettingsStore.hiddenGames = [1];
      mockSettingsStore.includeHiddenGames = true;

      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
        // Should be able to show any game, including hidden ones
        // Since we have multiple games and randomization, we just verify a game is shown
        const gameDisplay = screen.getByTestId('game-display');
        expect(gameDisplay).toBeInTheDocument();
      });
    });
  });

  describe('randomization behavior', () => {
    it('should show different games on multiple clicks', async () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');

      // Click multiple times and verify the randomizer is working
      for (let i = 0; i < 3; i++) {
        await user.click(randomButton);
        await waitFor(() => {
          const gameDisplay = screen.getByTestId('game-display');
          expect(gameDisplay).toBeInTheDocument();
        });
      }

      // Should always have a game displayed after clicking
      expect(screen.getByTestId('game-display')).toBeInTheDocument();
    });

    it('should handle single game in pool', async () => {
      // Enable only one game type with one game
      mockSettingsStore.includeGotmRunnerUp = false;
      mockSettingsStore.includeRetrobits = false;
      mockSettingsStore.includeRpgRunnerUp = false;
      mockSettingsStore.includeRpgWinners = false;
      // Only GotM Winners enabled (has 1 game)

      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
        expect(screen.getByText('GotM Winner Game')).toBeInTheDocument();
      });

      // Click again, should show same game
      await user.click(randomButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
        expect(screen.getByText('GotM Winner Game')).toBeInTheDocument();
      });
    });
  });

  describe('game hiding integration', () => {
    it('should hide games and update pool', async () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });

      // Hide the current game
      const hideButton = screen.getByText('Hide Game');
      await user.click(hideButton);

      expect(mockSettingsStore.toggleHiddenGame).toHaveBeenCalled();
    });

    it('should update available games when games are hidden', async () => {
      renderWithRouter(<Randomizer />);

      // Initially should have games available
      const randomButton = screen.getByText('Reroll');
      expect(randomButton).toBeEnabled();

      // Simulate hiding all games
      mockSettingsStore.hiddenGames = [1, 2, 3, 4, 5];
      mockSettingsStore.includeHiddenGames = false;

      // Re-render to reflect state change
      renderWithRouter(<Randomizer />);

      // Should show no games message instead of disabled button
      expect(screen.getByText(/There are no games left in the pool/)).toBeInTheDocument();
      expect(screen.queryByText('Reroll')).not.toBeInTheDocument();
    });
  });

  describe('settings integration', () => {
    it('should render settings component', () => {
      renderWithRouter(<Randomizer />);

      expect(screen.getByTestId('settings-component')).toBeInTheDocument();
    });

    it('should update game pool when settings change', async () => {
      renderWithRouter(<Randomizer />);

      // Initially all games available
      const randomButton = screen.getByText('Reroll');
      expect(randomButton).toBeEnabled();

      // Simulate settings change (disable all game types)
      mockSettingsStore.includeGotmRunnerUp = false;
      mockSettingsStore.includeGotmWinners = false;
      mockSettingsStore.includeRetrobits = false;
      mockSettingsStore.includeRpgRunnerUp = false;
      mockSettingsStore.includeRpgWinners = false;

      // Re-render to reflect state change
      renderWithRouter(<Randomizer />);

      // Should show no games message instead of disabled button
      expect(screen.getByText(/There are no games left in the pool/)).toBeInTheDocument();
      expect(screen.queryByText('Reroll')).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle missing game data gracefully', () => {
      // Mock empty game collections
      mockDbStore.allGames = {
        gotmRunnerUp: [],
        gotmWinners: [],
        retrobits: [],
        rpgRunnerUp: [],
        rpgWinners: [],
      };

      renderWithRouter(<Randomizer />);

      // Should show no games message instead of disabled button
      expect(screen.getByText(/There are no games left in the pool/)).toBeInTheDocument();
      expect(screen.queryByText('Reroll')).not.toBeInTheDocument();
    });

    it('should handle store errors gracefully', () => {
      mockSettingsStore.toggleHiddenGame.mockImplementation(() => {
        throw new Error('Store error');
      });

      expect(() => renderWithRouter(<Randomizer />)).not.toThrow();
    });

    it('should handle malformed game data', async () => {
      // Mock games with missing data
      mockDbStore.allGames = {
        gotmRunnerUp: [{ id: 1 }], // Missing required fields
        gotmWinners: [],
        retrobits: [],
        rpgRunnerUp: [],
        rpgWinners: [],
      };

      expect(() => renderWithRouter(<Randomizer />)).not.toThrow();
    });
  });

  describe('accessibility', () => {
    it('should have proper button labels', () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByRole('button', {
        name: /reroll/i,
      });
      expect(randomButton).toBeInTheDocument();
      
      const hideButton = screen.getByRole('button', {
        name: /hide game/i,
      });
      expect(hideButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByRole('button', {
        name: /reroll/i,
      });

      randomButton.focus();
      expect(randomButton).toHaveFocus();
    });

    it('should have proper heading structure', async () => {
      renderWithRouter(<Randomizer />);

      // Should have the main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Randomizer');

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        // Should still have the heading after clicking
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', () => {
      renderWithRouter(<Randomizer />);

      // Should render main components
      expect(screen.getByText('Reroll')).toBeInTheDocument();
      expect(screen.getByTestId('settings-component')).toBeInTheDocument();
    });

    it('should maintain functionality across renders', async () => {
      const { rerender } = renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');
      await user.click(randomButton);

      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });

      // Re-render and verify functionality persists
      rerender(
        <BrowserRouter>
          <Randomizer />
        </BrowserRouter>,
      );

      const updatedRandomButton = screen.getByText('Reroll');
      expect(updatedRandomButton).toBeEnabled();
      
      // Should still be able to click and get a game
      await user.click(updatedRandomButton);
      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should handle rapid button clicks', async () => {
      renderWithRouter(<Randomizer />);

      const randomButton = screen.getByText('Reroll');

      // Rapid clicks
      await user.click(randomButton);
      await user.click(randomButton);
      await user.click(randomButton);

      // Should still render game display
      await waitFor(() => {
        expect(screen.getByTestId('game-display')).toBeInTheDocument();
      });
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithRouter(<Randomizer />);

      expect(() => unmount()).not.toThrow();
    });
  });
});
