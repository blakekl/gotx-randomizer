import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { RetrobitsThemeDetail } from '../../../pages/Themes/ThemeDetail/RetrobitsThemeDetail/RetrobitsThemeDetail';
import { NominationWithGame } from '../../../models/game';

const mockNominations: NominationWithGame[] = [
  // Single winner
  {
    id: 1,
    theme_id: 1,
    game_id: 1,
    user_id: 1,
    winner: 1,
    description: 'Retrobit winner',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    themeDescription: 'Retrobit Theme - 33rd week of 2025',
    yearCategory: 'pre 96',
    game: {
      id: 1,
      title_world: 'Retrobit Winner Game',
      title_usa: 'Retrobit Winner Game USA',
      title_eu: 'Retrobit Winner Game EU',
      title_jap: 'Retrobit Winner Game JP',
      title_other: 'Retrobit Winner Game Other',
      year: 1995,
      system: 'SNES',
      developer: 'Retrobit Developer',
      genre: 'Action',
      img_url: 'retrobit-winner.jpg',
      time_to_beat: 12,
      screenscraper_id: 123,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
];

describe('RetrobitsThemeDetail Component', () => {
  describe('single winner display', () => {
    it('should render winner section with single centered winner', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('Winner')).toBeInTheDocument();
      expect(screen.getByText('Retrobit Winner Game')).toBeInTheDocument();
    });

    it('should display winner in centered layout', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      // Check for centered columns layout
      const centeredContainer = document.querySelector(
        '.columns.is-centered.is-vcentered',
      );
      expect(centeredContainer).toBeInTheDocument();

      // Winner should be in a single column
      const winnerColumn = document.querySelector('.column.is-one-third');
      expect(winnerColumn).toBeInTheDocument();
    });

    it('should display gamepad icon for winner section', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      const gamepadIcon = document.querySelector('.fas.fa-gamepad');
      expect(gamepadIcon).toBeInTheDocument();
    });

    it('should not show category label for single winner', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      // RetrobitsThemeDetail uses showCategory={false}
      // The year category should still be visible in the card but not as a separate category label
      expect(screen.getByText('pre 96')).toBeInTheDocument();
    });
  });

  describe('no nominations table', () => {
    it('should not render nominations table', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      // Retrobit themes don't show nominations table
      expect(screen.queryByText('Nominations')).not.toBeInTheDocument();
    });
  });

  describe('empty states', () => {
    it('should show empty state when no winner', () => {
      const nominationsWithoutWinner = mockNominations.map((nom) => ({
        ...nom,
        winner: 0,
      }));

      render(<RetrobitsThemeDetail nominations={nominationsWithoutWinner} />);

      expect(screen.getByText('No winner announced yet.')).toBeInTheDocument();
      expect(
        screen.getByText('This Retrobit theme is still in progress.'),
      ).toBeInTheDocument();
    });

    it('should show empty state when no nominations', () => {
      render(<RetrobitsThemeDetail nominations={[]} />);

      expect(screen.getByText('No winner announced yet.')).toBeInTheDocument();
      expect(
        screen.getByText('This Retrobit theme is still in progress.'),
      ).toBeInTheDocument();
    });

    it('should display info notification for empty state', () => {
      render(<RetrobitsThemeDetail nominations={[]} />);

      const notification = document.querySelector('.notification.is-info');
      expect(notification).toBeInTheDocument();
    });
  });

  describe('winner information display', () => {
    it('should display complete winner information', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('Retrobit Winner Game')).toBeInTheDocument();
      expect(screen.getByText('SNES')).toBeInTheDocument();
      expect(screen.getByText('1995')).toBeInTheDocument();
      expect(screen.getByText('Retrobit Developer')).toBeInTheDocument();
      expect(screen.getByText('pre 96')).toBeInTheDocument();
    });

    it('should render winner game image', () => {
      render(<RetrobitsThemeDetail nominations={mockNominations} />);

      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'retrobit-winner.jpg');
      expect(image).toHaveAttribute('alt', 'Retrobit Winner Game');
    });
  });

  describe('multiple winners handling', () => {
    it('should handle multiple winners by showing only the first one', () => {
      const multipleWinners = [
        ...mockNominations,
        {
          ...mockNominations[0],
          id: 2,
          game: {
            ...mockNominations[0].game,
            id: 2,
            title_world: 'Second Winner',
          },
        },
      ];

      render(<RetrobitsThemeDetail nominations={multipleWinners} />);

      // Should only show the first winner
      expect(screen.getByText('Retrobit Winner Game')).toBeInTheDocument();
      expect(screen.queryByText('Second Winner')).not.toBeInTheDocument();
    });
  });
});
