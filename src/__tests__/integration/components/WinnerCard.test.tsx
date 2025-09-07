import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { WinnerCard } from '../../../pages/Themes/ThemeDetail/WinnerCard/WinnerCard';
import { NominationWithGame } from '../../../models/game';

const mockWinner: NominationWithGame = {
  id: 1,
  theme_id: 1,
  game_id: 1,
  user_id: 1,
  winner: 1,
  description: '2024 GotY Winner, Best Art Style',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  themeDescription: 'GotY for 2024',
  yearCategory: 'pre 96',
  game: {
    id: 1,
    title_world: 'Test Game World',
    title_usa: 'Test Game USA',
    title_eu: 'Test Game EU',
    title_jap: 'Test Game JP',
    title_other: 'Test Game Other',
    year: 1995,
    system: 'SNES',
    developer: 'Test Developer',
    genre: 'Action',
    img_url: 'test-image.jpg',
    time_to_beat: 10,
    screenscraper_id: 123,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

describe('WinnerCard Component', () => {
  describe('basic rendering', () => {
    it('should render winner card with game information', () => {
      render(<WinnerCard winner={mockWinner} showCategory={false} />);

      expect(screen.getByText('Test Game World')).toBeInTheDocument();
      expect(screen.getByText('1995')).toBeInTheDocument();
      // WinnerCard doesn't display system or developer
      expect(screen.queryByText('SNES')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Developer')).not.toBeInTheDocument();
    });

    it('should show category when showCategory is true', () => {
      render(
        <WinnerCard
          winner={mockWinner}
          showCategory={true}
          categoryLabel="Best Art Style"
        />,
      );

      expect(screen.getByText('Best Art Style')).toBeInTheDocument();
    });

    it('should not show category when showCategory is false', () => {
      render(
        <WinnerCard
          winner={mockWinner}
          showCategory={false}
          categoryLabel="Best Art Style"
        />,
      );

      expect(screen.queryByText('Best Art Style')).not.toBeInTheDocument();
    });

    it('should render game image when img_url is provided', () => {
      render(<WinnerCard winner={mockWinner} showCategory={false} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'test-image.jpg');
      expect(image).toHaveAttribute('alt', 'Test Game World');
    });

    it('should handle missing game image gracefully', () => {
      const winnerWithoutImage = {
        ...mockWinner,
        game: { ...mockWinner.game, img_url: '' },
      };

      render(<WinnerCard winner={winnerWithoutImage} showCategory={false} />);

      // When img_url is empty, no image should be rendered
      const image = screen.queryByRole('img');
      expect(image).not.toBeInTheDocument();
    });
  });

  describe('game title handling', () => {
    it('should use title_world when available', () => {
      render(<WinnerCard winner={mockWinner} showCategory={false} />);

      expect(screen.getByText('Test Game World')).toBeInTheDocument();
    });

    it('should fallback to title_usa when title_world is empty', () => {
      const winnerWithUsaTitle = {
        ...mockWinner,
        game: { ...mockWinner.game, title_world: '', title_usa: 'USA Title' },
      };

      render(<WinnerCard winner={winnerWithUsaTitle} showCategory={false} />);

      expect(screen.getByText('USA Title')).toBeInTheDocument();
    });
  });

  describe('year category display', () => {
    it('should not display year category when showCategory is false', () => {
      render(<WinnerCard winner={mockWinner} showCategory={false} />);

      // Year category should not be shown when showCategory=false
      expect(screen.queryByText('pre 96')).not.toBeInTheDocument();
    });

    it('should display year category when showCategory is true', () => {
      render(<WinnerCard winner={mockWinner} showCategory={true} />);

      expect(screen.getByText('pre 96')).toBeInTheDocument();
    });
  });
});
