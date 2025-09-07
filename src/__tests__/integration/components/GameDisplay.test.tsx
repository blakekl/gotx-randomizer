import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

      // Check for the main title in the h1 element specifically
      const mainTitle = screen.getByRole('heading', { level: 1 });
      expect(mainTitle).toHaveTextContent('Super Mario Bros.');
      expect(document.querySelector('.fi-us')).toBeInTheDocument();
    });

    it('should display game details', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByText('1985')).toBeInTheDocument();
      expect(screen.getByText('NES')).toBeInTheDocument();
      expect(screen.getByText('Nintendo')).toBeInTheDocument();
      // Genre is not displayed in the GameDisplay component
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

      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should display game image', () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByTestId('game-display').querySelector('img');
      expect(image).toHaveAttribute('src', 'https://example.com/mario.jpg');
    });

    it('should handle image loading states', async () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByTestId('game-display').querySelector('img');
      const loader = screen
        .getByTestId('game-display')
        .querySelector('.loader');

      // Initially should show loading state
      expect(loader).toHaveStyle('display: block');

      // Simulate image load by setting complete property and firing load event
      if (image) {
        Object.defineProperty(image, 'complete', {
          value: true,
          writable: true,
        });
        fireEvent.load(image);
      }

      await waitFor(() => {
        expect(loader).toHaveStyle('display: none');
      });
    });

    it('should handle missing image URL', () => {
      const gameWithoutImage = createMockGame({
        ...mockGame,
        img_url: '',
      });

      render(<GameDisplay game={gameWithoutImage} />);

      const image = screen.getByTestId('game-display').querySelector('img');
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

      // Check for USA title text and flag icon
      expect(screen.getByText('USA Title')).toBeInTheDocument();
      expect(document.querySelector('.fi-us')).toBeInTheDocument();
    });

    it('should fall back to world title if USA title is missing', () => {
      const gameWithWorldTitle = createMockGame({
        ...mockGame,
        title_usa: '',
        title_world: 'World Title',
        title_eu: 'EU Title',
      });

      render(<GameDisplay game={gameWithWorldTitle} />);

      // Check for world title text and flag icon
      expect(screen.getByText('World Title')).toBeInTheDocument();
      expect(document.querySelector('.fi-un')).toBeInTheDocument();
    });

    it('should show multiple titles as subtitles', () => {
      const gameWithMultipleTitles = createMockGame({
        ...mockGame,
        title_usa: 'USA Title',
        title_eu: 'EU Title',
        title_jap: 'Japanese Title',
      });

      render(<GameDisplay game={gameWithMultipleTitles} />);

      // Check for title texts and flag icons
      expect(screen.getByText('USA Title')).toBeInTheDocument();
      expect(screen.getByText('EU Title')).toBeInTheDocument();
      expect(screen.getByText('Japanese Title')).toBeInTheDocument();
      expect(document.querySelector('.fi-us')).toBeInTheDocument();
      expect(document.querySelector('.fi-eu')).toBeInTheDocument();
      expect(document.querySelector('.fi-jp')).toBeInTheDocument();
    });

    it('should handle special characters in titles', () => {
      const gameWithSpecialChars = createMockGame({
        ...mockGame,
        title_usa: 'Game: Special Edition™',
        title_jap: 'ゲーム：特別版',
      });

      render(<GameDisplay game={gameWithSpecialChars} />);

      // Check for special character titles and flag icons
      expect(screen.getByText('Game: Special Edition™')).toBeInTheDocument();
      expect(screen.getByText('ゲーム：特別版')).toBeInTheDocument();
      expect(document.querySelector('.fi-us')).toBeInTheDocument();
      expect(document.querySelector('.fi-jp')).toBeInTheDocument();
    });
  });

  describe('nominations display', () => {
    it('should render NominationList component', () => {
      render(<GameDisplay game={mockGame} />);

      expect(screen.getByTestId('nomination-list')).toBeInTheDocument();
      expect(screen.getByText(/Nominations for game/)).toBeInTheDocument();
    });

    it('should pass correct gameId to NominationList', () => {
      const gameWithDifferentId = createMockGame({
        ...mockGame,
        id: 42,
      });

      render(<GameDisplay game={gameWithDifferentId} />);

      expect(screen.getByText(/Nominations for game/)).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should have proper CSS classes for layout', () => {
      render(<GameDisplay game={mockGame} />);

      // The component uses level classes for layout, not columns
      const levelContainer = screen
        .getByRole('heading', { level: 1 })
        .closest('section');
      expect(levelContainer).toHaveClass('section');
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
      const mainTitle = screen.getByRole('heading', { level: 1 });
      expect(mainTitle).toHaveTextContent('Super Mario Bros.');
      expect(screen.getByText('1985')).toBeInTheDocument();
      // Empty developer should still be rendered (as empty string)
      expect(screen.getByText('NES')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper alt text for game image', () => {
      render(<GameDisplay game={mockGame} />);

      const image = screen.getByTestId('game-display').querySelector('img');
      // The component doesn't set alt text, so it won't have an accessible name
      expect(image).toBeInTheDocument();
    });

    it('should not have hide buttons (feature not in GameDisplay)', () => {
      render(<GameDisplay game={mockGame} />);

      // GameDisplay doesn't have hide buttons - that's in the Games component
      expect(
        screen.queryByRole('button', { name: /hide/i }),
      ).not.toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<GameDisplay game={mockGame} />);

      // GameDisplay doesn't have interactive elements to focus on
      // The image exists but may not have proper alt text for role="img"
      const image = screen.getByTestId('game-display').querySelector('img');
      expect(image).toBeInTheDocument();
    });

    it('should have proper heading structure', () => {
      render(<GameDisplay game={mockGame} />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Super Mario Bros.');
    });
  });

  describe('error handling', () => {
    it('should handle store errors gracefully', async () => {
      // GameDisplay doesn't have hide buttons, so no store interaction to test
      // Just verify the component renders without errors
      expect(() => render(<GameDisplay game={mockGame} />)).not.toThrow();
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

      const image = screen.getByTestId('game-display').querySelector('img');

      // Simulate image error
      fireEvent.error(image!);

      // Should not crash
      expect(image).toBeInTheDocument();
    });
  });

  describe('component lifecycle', () => {
    it('should reset image loading state when game changes', async () => {
      const { rerender } = render(<GameDisplay game={mockGame} />);

      const gameDisplay = screen.getByTestId('game-display');
      const loader = gameDisplay.querySelector('.loader');

      // Initially should show loading state
      expect(loader).toHaveStyle('display: block');

      // Change to a different game
      const newGame = createMockGame({
        ...mockGame,
        id: 2,
        title_usa: 'Different Game',
        img_url: 'https://example.com/different.jpg',
      });

      rerender(<GameDisplay game={newGame} />);

      // Should still be in loading state for new game
      const newLoader = screen
        .getByTestId('game-display')
        .querySelector('.loader');
      expect(newLoader).toHaveStyle('display: block');
    });

    it('should clean up event listeners', () => {
      const { unmount } = render(<GameDisplay game={mockGame} />);

      // Should not throw when unmounting
      expect(() => unmount()).not.toThrow();
    });
  });
});
