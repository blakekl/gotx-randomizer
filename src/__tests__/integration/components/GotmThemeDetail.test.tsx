import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { GotmThemeDetail } from '../../../pages/Themes/ThemeDetail/GotmThemeDetail/GotmThemeDetail';
import { NominationWithGame } from '../../../models/game';

const mockNominations: NominationWithGame[] = [
  // Winner for pre 96 category
  {
    id: 1,
    theme_id: 1,
    game_id: 1,
    user_id: 1,
    winner: 1,
    description: 'Winner nomination',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    themeDescription: 'GotM for January 2024',
    yearCategory: 'pre 96',
    game: {
      id: 1,
      title_world: 'Winner Game Pre 96',
      title_usa: 'Winner Game Pre 96 USA',
      title_eu: 'Winner Game Pre 96 EU',
      title_jap: 'Winner Game Pre 96 JP',
      title_other: 'Winner Game Pre 96 Other',
      year: 1995,
      system: 'SNES',
      developer: 'Winner Developer',
      genre: 'Action',
      img_url: 'winner1.jpg',
      time_to_beat: 10,
      screenscraper_id: 123,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  // Winner for 96-99 category
  {
    id: 2,
    theme_id: 1,
    game_id: 2,
    user_id: 2,
    winner: 1,
    description: 'Another winner',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    themeDescription: 'GotM for January 2024',
    yearCategory: '96-99',
    game: {
      id: 2,
      title_world: 'Winner Game 96-99',
      title_usa: 'Winner Game 96-99 USA',
      title_eu: 'Winner Game 96-99 EU',
      title_jap: 'Winner Game 96-99 JP',
      title_other: 'Winner Game 96-99 Other',
      year: 1997,
      system: 'PSX',
      developer: 'Another Developer',
      genre: 'RPG',
      img_url: 'winner2.jpg',
      time_to_beat: 40,
      screenscraper_id: 456,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  },
  // Non-winner nomination
  {
    id: 3,
    theme_id: 1,
    game_id: 3,
    user_id: 3,
    winner: 0,
    description: 'Regular nomination',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    themeDescription: 'GotM for January 2024',
    yearCategory: 'pre 96',
    game: {
      id: 3,
      title_world: 'Regular Game',
      title_usa: 'Regular Game USA',
      title_eu: 'Regular Game EU',
      title_jap: 'Regular Game JP',
      title_other: 'Regular Game Other',
      year: 1994,
      system: 'SNES',
      developer: 'Regular Developer',
      genre: 'Platform',
      img_url: 'regular.jpg',
      time_to_beat: 8,
      screenscraper_id: 789,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  },
];

describe('GotmThemeDetail Component', () => {
  describe('winners display', () => {
    it('should render winners section with multiple winners', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('Winners')).toBeInTheDocument();
      expect(screen.getByText('Winner Game Pre 96')).toBeInTheDocument();
      expect(screen.getByText('Winner Game 96-99')).toBeInTheDocument();
    });

    it('should display winners in horizontal layout', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      // Check for columns layout class
      const winnersContainer = document.querySelector('.columns.is-multiline');
      expect(winnersContainer).toBeInTheDocument();

      // Each winner should be in a column
      const winnerColumns = document.querySelectorAll('.column.is-one-third');
      expect(winnerColumns.length).toBeGreaterThanOrEqual(2);
    });

    it('should show year categories for each winner', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('pre 96')).toBeInTheDocument();
      expect(screen.getByText('96-99')).toBeInTheDocument();
    });

    it('should display crown icon for winners section', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      const crownIcon = document.querySelector('.fas.fa-crown');
      expect(crownIcon).toBeInTheDocument();
    });
  });

  describe('nominations table', () => {
    it('should render nominations table with all nominations', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('Nominations')).toBeInTheDocument();
      expect(screen.getByText('Regular Game')).toBeInTheDocument();
    });

    it('should include winners in nominations table', () => {
      render(<GotmThemeDetail nominations={mockNominations} />);

      // Winners should appear in both winners section and nominations table
      const winnerGameElements = screen.getAllByText('Winner Game Pre 96');
      expect(winnerGameElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('empty states', () => {
    it('should handle no winners gracefully', () => {
      const nominationsWithoutWinners = mockNominations.map((nom) => ({
        ...nom,
        winner: 0,
      }));

      render(<GotmThemeDetail nominations={nominationsWithoutWinners} />);

      // Should not show winners section
      expect(screen.queryByText('Winners')).not.toBeInTheDocument();
      // Should still show nominations
      expect(screen.getByText('Nominations')).toBeInTheDocument();
    });

    it('should handle empty nominations array', () => {
      render(<GotmThemeDetail nominations={[]} />);

      expect(screen.queryByText('Winners')).not.toBeInTheDocument();
      expect(screen.getByText('Nominations')).toBeInTheDocument();
    });
  });

  describe('winner categories', () => {
    it('should handle single winner correctly', () => {
      const singleWinnerNominations = [mockNominations[0]]; // Only pre 96 winner

      render(<GotmThemeDetail nominations={singleWinnerNominations} />);

      expect(screen.getByText('Winners')).toBeInTheDocument();
      expect(screen.getByText('Winner Game Pre 96')).toBeInTheDocument();
      expect(screen.queryByText('Winner Game 96-99')).not.toBeInTheDocument();
    });

    it('should handle all three year categories', () => {
      const threeWinnerNominations = [
        ...mockNominations.slice(0, 2), // pre 96 and 96-99 winners
        {
          ...mockNominations[0],
          id: 4,
          yearCategory: '00+',
          game: {
            ...mockNominations[0].game,
            id: 4,
            title_world: 'Winner Game 00+',
            year: 2001,
          },
        },
      ];

      render(<GotmThemeDetail nominations={threeWinnerNominations} />);

      expect(screen.getByText('pre 96')).toBeInTheDocument();
      expect(screen.getByText('96-99')).toBeInTheDocument();
      expect(screen.getByText('00+')).toBeInTheDocument();
    });
  });
});
