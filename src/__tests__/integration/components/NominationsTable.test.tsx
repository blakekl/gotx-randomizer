import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { NominationsTable } from '../../../pages/Themes/ThemeDetail/NominationsTable/NominationsTable';
import { NominationWithGame } from '../../../models/game';

const mockNominations: NominationWithGame[] = [
  {
    id: 1,
    theme_id: 1,
    game_id: 1,
    user_id: 1,
    winner: 0,
    description: 'Great game nomination',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    themeDescription: 'GotM for January 2024',
    yearCategory: 'pre 96',
    game: {
      id: 1,
      title_world: 'Game One',
      title_usa: 'Game One USA',
      title_eu: 'Game One EU',
      title_jap: 'Game One JP',
      title_other: 'Game One Other',
      year: 1995,
      system: 'SNES',
      developer: 'Developer One',
      genre: 'Action',
      img_url: 'game1.jpg',
      time_to_beat: 10,
      screenscraper_id: 123,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  {
    id: 2,
    theme_id: 1,
    game_id: 2,
    user_id: 2,
    winner: 0,
    description: 'Another great nomination',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    themeDescription: 'GotM for January 2024',
    yearCategory: '96-99',
    game: {
      id: 2,
      title_world: 'Game Two',
      title_usa: 'Game Two USA',
      title_eu: 'Game Two EU',
      title_jap: 'Game Two JP',
      title_other: 'Game Two Other',
      year: 1997,
      system: 'PSX',
      developer: 'Developer Two',
      genre: 'RPG',
      img_url: 'game2.jpg',
      time_to_beat: 40,
      screenscraper_id: 456,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  },
];

describe('NominationsTable Component', () => {
  describe('basic rendering', () => {
    it('should render nominations table with headers', () => {
      render(<NominationsTable nominations={mockNominations} />);

      expect(screen.getByText('Nominations')).toBeInTheDocument();
      expect(screen.getByText('Game')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should render all nominations in the table', () => {
      render(<NominationsTable nominations={mockNominations} />);

      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('Game Two')).toBeInTheDocument();
      expect(screen.getByText('SNES')).toBeInTheDocument();
      expect(screen.getByText('PSX')).toBeInTheDocument();
      expect(screen.getByText('1995')).toBeInTheDocument();
      expect(screen.getByText('1997')).toBeInTheDocument();
    });

    it('should group nominations by year category', () => {
      render(<NominationsTable nominations={mockNominations} />);

      // Should show category headers
      expect(screen.getByText('pre 96')).toBeInTheDocument();
      expect(screen.getByText('96-99')).toBeInTheDocument();
    });
  });

  describe('empty states', () => {
    it('should handle empty nominations array', () => {
      render(<NominationsTable nominations={[]} />);

      expect(screen.getByText('Nominations')).toBeInTheDocument();
      // Should still show headers but no content
      expect(screen.getByText('Game')).toBeInTheDocument();
    });
  });

  describe('category grouping', () => {
    it('should properly group nominations by year category', () => {
      render(<NominationsTable nominations={mockNominations} />);

      // Check that games appear under correct category sections
      const pre96Section = screen.getByText('pre 96').closest('div');
      const category96Section = screen.getByText('96-99').closest('div');

      expect(pre96Section).toBeInTheDocument();
      expect(category96Section).toBeInTheDocument();
    });

    it('should handle nominations with same year category', () => {
      const sameYearNominations = [
        { ...mockNominations[0] },
        {
          ...mockNominations[0],
          id: 3,
          game: {
            ...mockNominations[0].game,
            id: 3,
            title_world: 'Game Three',
          },
        },
      ];

      render(<NominationsTable nominations={sameYearNominations} />);

      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('Game Three')).toBeInTheDocument();
      // Should only show one category header
      const categoryHeaders = screen.getAllByText('pre 96');
      expect(categoryHeaders).toHaveLength(1);
    });
  });

  describe('game information display', () => {
    it('should display complete game information', () => {
      render(<NominationsTable nominations={mockNominations} />);

      // Check first game
      expect(screen.getByText('Game One')).toBeInTheDocument();
      expect(screen.getByText('SNES')).toBeInTheDocument();
      expect(screen.getByText('1995')).toBeInTheDocument();
      expect(screen.getByText('Developer One')).toBeInTheDocument();

      // Check second game
      expect(screen.getByText('Game Two')).toBeInTheDocument();
      expect(screen.getByText('PSX')).toBeInTheDocument();
      expect(screen.getByText('1997')).toBeInTheDocument();
      expect(screen.getByText('Developer Two')).toBeInTheDocument();
    });

    it('should handle missing game information gracefully', () => {
      const nominationWithMissingInfo = [
        {
          ...mockNominations[0],
          game: {
            ...mockNominations[0].game,
            title_world: '',
            title_usa: 'Fallback Title',
            developer: '',
          },
        },
      ];

      render(<NominationsTable nominations={nominationWithMissingInfo} />);

      expect(screen.getByText('Fallback Title')).toBeInTheDocument();
    });
  });
});
