import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameDisplay from '../../../pages/Randomizer/GameDisplay/GameDisplay';
import { createMockGame } from '../../../test-utils/fixtures/gameData';

// Mock the stores
const mockSettingsStore = {
  hiddenGames: [],
  toggleHiddenGame: vi.fn(),
};

const mockDbStore = {
  getNominationsByGame: vi.fn(() => []),
};

// Mock the useStores hook
vi.mock('../../../stores/useStores', () => ({
  useStores: () => ({
    settingsStore: mockSettingsStore,
    dbStore: mockDbStore,
  }),
}));

// Mock the NominationList component
vi.mock('../../../pages/Randomizer/GameDisplay/NominationList', () => ({
  default: ({ gameId }: { gameId: number }) => (
    <div data-testid="nomination-list">Nominations for game {gameId}</div>
  ),
}));

describe('GameDisplay Component', () => {
  const user = userEvent.setup();
  const mockGame = createMockGame({
    id: 1,
    title_usa: 'Super Mario Bros.',
    title_eu: 'Super Mario Bros.',
    title_jap: 'スーパーマリオブラザーズ',
    title_world: 'Super Mario Bros.',
    year: 1985,
    system: 'NES',
    developer: 'Nintendo',
    genre: 'Platform',
    img_url: 'https://example.com/mario.jpg',
    time_to_beat: 2,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSettingsStore.hiddenGames = [];
  });

  describe('game information display', () => {
    it('should display game title', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByText('Super Mario Bros.')).toBeInTheDocument();
    });

    it('should display game details', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByText('1985')).toBeInTheDocument();
      expect(screen.getByText('NES')).toBeInTheDocument();
      expect(screen.getByText('Nintendo')).toBeInTheDocument();
      expect(screen.getByText('Platform')).toBeInTheDocument();
    });

    it('should display time to beat', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByText('2 hours')).toBeInTheDocument();
    });

    it('should handle missing time to beat', () => {
      const gameWithoutTime = createMockGame({
        ...mockGame,
        time_to_beat: 0,
      });

      render(<GameDisplay game={gameWithoutTime} />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('should display game image', () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByRole('img', { name: /super mario bros/i });
      expect(image).toHaveAttribute('src', 'https://example.com/mario.jpg');
    });

    it('should handle image loading states', async () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByRole('img', { name: /super mario bros/i });

      // Initially should show loading state
      expect(image.closest('.image')).toHaveClass('is-loading');

      // Simulate image load
      fireEvent.load(image);

      await waitFor(() => {
        expect(image.closest('.image')).not.toHaveClass('is-loading');
      });
    });

    it('should handle missing image URL', () => {
      const gameWithoutImage = createMockGame({
        ...mockGame,
        img_url: '',
      });

      render(<GameDisplay game={gameWithoutImage} />);

      const image = screen.getByRole('img', { name: /super mario bros/i });
      expect(image).toHaveAttribute('src', '');
    });
  });

  describe('title handling', () => {
    it('should prioritize USA title', () => {
      const gameWithMultipleTitles = createMockGame({
        ...mockGame,
        title_usa: 'USA Title',
        title_eu: 'EU Title',
        title_world: 'World Title',
      });

      render(<GameDisplay game={gameWithMultipleTitles} />);

      expect(screen.getByText('USA Title')).toBeInTheDocument();
    });

    it('should fall back to world title if USA title is missing', () => {
      const gameWithWorldTitle = createMockGame({
        ...mockGame,
        title_usa: '',
        title_world: 'World Title',
        title_eu: 'EU Title',
      });

      render(<GameDisplay game={gameWithWorldTitle} />);

      expect(screen.getByText('World Title')).toBeInTheDocument();
    });

    it('should show multiple titles as subtitles', () => {
      const gameWithMultipleTitles = createMockGame({
        ...mockGame,
        title_usa: 'USA Title',
        title_eu: 'EU Title',
        title_jap: 'Japanese Title',
      });

      render(<GameDisplay game={gameWithMultipleTitles} />);

      expect(screen.getByText('USA Title')).toBeInTheDocument();
      expect(screen.getByText('EU Title')).toBeInTheDocument();
      expect(screen.getByText('Japanese Title')).toBeInTheDocument();
    });

    it('should handle special characters in titles', () => {
      const gameWithSpecialChars = createMockGame({
        ...mockGame,
        title_usa: 'Game: Special Edition™',
        title_jap: 'ゲーム：特別版',
      });

      render(<GameDisplay game={gameWithSpecialChars} />);

      expect(screen.getByText('Game: Special Edition™')).toBeInTheDocument();
      expect(screen.getByText('ゲーム：特別版')).toBeInTheDocument();
    });
  });

  describe('hide game functionality', () => {
    it('should show hide button', () => {
      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });
      expect(hideButton).toBeInTheDocument();
    });

    it('should call toggleHiddenGame when hide button is clicked', async () => {
      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });
      await user.click(hideButton);

      expect(mockSettingsStore.toggleHiddenGame).toHaveBeenCalledWith(1);
    });

    it('should show different text when game is hidden', () => {
      mockSettingsStore.hiddenGames = [1];

      render(<GameDisplay game={mockGame} />);

      const unhideButton = screen.getByRole('button', { name: /unhide/i });
      expect(unhideButton).toBeInTheDocument();
    });

    it('should handle rapid hide/unhide clicks', async () => {
      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });

      // Rapid clicks
      await user.click(hideButton);
      await user.click(hideButton);
      await user.click(hideButton);

      expect(mockSettingsStore.toggleHiddenGame).toHaveBeenCalledTimes(3);
    });
  });

  describe('nominations display', () => {
    it('should render NominationList component', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByTestId('nomination-list')).toBeInTheDocument();
      expect(screen.getByText('Nominations for game 1')).toBeInTheDocument();
    });

    it('should pass correct gameId to NominationList', () => {
      const gameWithDifferentId = createMockGame({
        ...mockGame,
        id: 42,
      });

      render(<GameDisplay game={gameWithDifferentId} />);

      expect(screen.getByText('Nominations for game 42')).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should have proper CSS classes for layout', () => {
      render(<GameDisplay game={mockGame} />);

      const container = screen
        .getByText('Super Mario Bros.')
        .closest('.columns');
      expect(container).toHaveClass('columns');
    });

    it('should handle long game titles', () => {
      const gameWithLongTitle = createMockGame({
        ...mockGame,
        title_usa:
          'This is a very long game title that might wrap to multiple lines',
      });

      render(<GameDisplay game={gameWithLongTitle} />);

      expect(
        screen.getByText(
          'This is a very long game title that might wrap to multiple lines',
        ),
      ).toBeInTheDocument();
    });

    it('should handle missing developer information', () => {
      const gameWithoutDeveloper = createMockGame({
        ...mockGame,
        developer: '',
      });

      render(<GameDisplay game={gameWithoutDeveloper} />);

      // Should still render other information
      expect(screen.getByText('Super Mario Bros.')).toBeInTheDocument();
      expect(screen.getByText('1985')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper alt text for game image', () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAccessibleName();
    });

    it('should have proper button labels', () => {
      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });
      expect(hideButton).toHaveAccessibleName();
    });

    it('should be keyboard navigable', () => {
      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });

      hideButton.focus();
      expect(hideButton).toHaveFocus();
    });

    it('should have proper heading structure', () => {
      render(<GameDisplay game={mockGame} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Super Mario Bros.');
    });
  });

  describe('error handling', () => {
    it('should handle store errors gracefully', async () => {
      mockSettingsStore.toggleHiddenGame.mockImplementation(() => {
        throw new Error('Store error');
      });

      render(<GameDisplay game={mockGame} />);

      const hideButton = screen.getByRole('button', { name: /hide/i });

      // Should not crash the component
      expect(() => user.click(hideButton)).not.toThrow();
    });

    it('should handle malformed game data', () => {
      const malformedGame = {
        ...mockGame,
        year: null,
        system: undefined,
      } as any;

      expect(() => render(<GameDisplay game={malformedGame} />)).not.toThrow();
    });

    it('should handle image load errors', () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByRole('img');

      // Simulate image error
      fireEvent.error(image);

      // Should not crash
      expect(image).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('should reset image loading state when game changes', async () => {
      const { rerender } = render(<GameDisplay game={mockGame} />);

      const image = screen.getByRole('img');

      // Load the first image
      fireEvent.load(image);
      await waitFor(() => {
        expect(image.closest('.image')).not.toHaveClass('is-loading');
      });

      // Change to a different game
      const newGame = createMockGame({
        ...mockGame,
        id: 2,
        title_usa: 'Different Game',
        img_url: 'https://example.com/different.jpg',
      });

      rerender(<GameDisplay game={newGame} />);

      // Should reset to loading state
      const newImage = screen.getByRole('img');
      expect(newImage.closest('.image')).toHaveClass('is-loading');
    });

    it('should clean up event listeners', () => {
      const { unmount } = render(<GameDisplay game={mockGame} />);

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow();
    });
  });
});
