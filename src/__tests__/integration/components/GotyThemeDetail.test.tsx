import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { GotyThemeDetail } from '../../../pages/Themes/ThemeDetail/GotyThemeDetail/GotyThemeDetail';
import { NominationWithGame } from '../../../models/game';

const mockNominations: NominationWithGame[] = [
  // GotY Winner
  {
    id: 1,
    theme_id: 1,
    game_id: 1,
    user_id: 1,
    winner: 1,
    description: '2024 GotY Winner, Game of the Year',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    themeDescription: 'GotY for 2024',
    yearCategory: 'pre 96',
    game: {
      id: 1,
      title_world: 'The Legend of Zelda: A Link to the Past',
      title_usa: 'The Legend of Zelda: A Link to the Past',
      title_eu: 'The Legend of Zelda: A Link to the Past',
      title_jap: 'Zelda no Densetsu: Kamigami no Triforce',
      title_other: 'The Legend of Zelda: A Link to the Past',
      year: 1991,
      system: 'SNES',
      developer: 'Nintendo',
      genre: 'Action-Adventure',
      img_url: 'zelda-alttp.jpg',
      time_to_beat: 15,
      screenscraper_id: 123,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  },
  // GotY Runner Up - Best Platformer
  {
    id: 2,
    theme_id: 1,
    game_id: 2,
    user_id: 2,
    winner: 1,
    description: '2024 GotY Runner up, Best Platformer/ Action-Platformer',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
    themeDescription: 'GotY for 2024',
    yearCategory: '96-99',
    game: {
      id: 2,
      title_world: 'Super Metroid',
      title_usa: 'Super Metroid',
      title_eu: 'Super Metroid',
      title_jap: 'Super Metroid',
      title_other: 'Super Metroid',
      year: 1994,
      system: 'SNES',
      developer: 'Nintendo R&D1',
      genre: 'Action-Adventure',
      img_url: 'super-metroid.jpg',
      time_to_beat: 8,
      screenscraper_id: 456,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
  },
  // GotY Runner Up - Best RPG
  {
    id: 3,
    theme_id: 1,
    game_id: 3,
    user_id: 3,
    winner: 1,
    description: '2024 GotY Runner up, Best RPG/ARPG',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
    themeDescription: 'GotY for 2024',
    yearCategory: '96-99',
    game: {
      id: 3,
      title_world: 'Star Ocean: The Second Story',
      title_usa: 'Star Ocean: The Second Story',
      title_eu: 'Star Ocean: The Second Story',
      title_jap: 'Star Ocean: The Second Story',
      title_other: 'Star Ocean: The Second Story',
      year: 1998,
      system: 'PSX',
      developer: 'tri-Ace',
      genre: 'RPG',
      img_url: 'star-ocean-2.jpg',
      time_to_beat: 80,
      screenscraper_id: 789,
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  },
];

describe('GotyThemeDetail Component', () => {
  describe('multiple winners display', () => {
    it('should render winners section with all winners', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      expect(screen.getByText('Winners')).toBeInTheDocument();
      expect(
        screen.getByText('The Legend of Zelda: A Link to the Past'),
      ).toBeInTheDocument();
      expect(screen.getByText('Super Metroid')).toBeInTheDocument();
      expect(
        screen.getByText('Star Ocean: The Second Story'),
      ).toBeInTheDocument();
    });

    it('should display winners in horizontal layout', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      // Check for horizontal columns layout
      const winnersContainer = document.querySelector('.columns.is-multiline');
      expect(winnersContainer).toBeInTheDocument();

      // Each winner should be in a column
      const winnerColumns = document.querySelectorAll('.column.is-one-third');
      expect(winnerColumns.length).toBe(3);
    });

    it('should display crown icon for winners section', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      const crownIcon = document.querySelector('.fas.fa-crown');
      expect(crownIcon).toBeInTheDocument();
    });
  });

  describe('award categories display', () => {
    it('should show award categories for each winner', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      expect(
        screen.getByText('2024 GotY Winner, Game of the Year'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          '2024 GotY Runner up, Best Platformer/ Action-Platformer',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('2024 GotY Runner up, Best RPG/ARPG'),
      ).toBeInTheDocument();
    });

    it('should use nomination description for categories', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      // Categories come from nomination description, not theme description
      expect(screen.queryByText('GotY for 2024')).not.toBeInTheDocument();
      expect(
        screen.getByText('2024 GotY Winner, Game of the Year'),
      ).toBeInTheDocument();
    });
  });

  describe('no nominations table', () => {
    it('should not render nominations table', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      // GotY themes don't show nominations table
      expect(screen.queryByText('Nominations')).not.toBeInTheDocument();
    });
  });

  describe('empty states', () => {
    it('should handle no winners gracefully', () => {
      const nominationsWithoutWinners = mockNominations.map((nom) => ({
        ...nom,
        winner: 0,
      }));

      render(<GotyThemeDetail nominations={nominationsWithoutWinners} />);

      expect(screen.queryByText('Winners')).not.toBeInTheDocument();
    });

    it('should handle empty nominations array', () => {
      render(<GotyThemeDetail nominations={[]} />);

      expect(screen.queryByText('Winners')).not.toBeInTheDocument();
    });
  });

  describe('single winner scenario', () => {
    it('should handle single winner correctly', () => {
      const singleWinnerNominations = [mockNominations[0]]; // Only main winner

      render(<GotyThemeDetail nominations={singleWinnerNominations} />);

      expect(screen.getByText('Winners')).toBeInTheDocument();
      expect(
        screen.getByText('The Legend of Zelda: A Link to the Past'),
      ).toBeInTheDocument();
      expect(screen.queryByText('Super Metroid')).not.toBeInTheDocument();
    });
  });

  describe('winner information display', () => {
    it('should display complete winner information for each game', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      // Check first winner
      expect(
        screen.getByText('The Legend of Zelda: A Link to the Past'),
      ).toBeInTheDocument();
      expect(screen.getByText('Nintendo')).toBeInTheDocument();

      // Check second winner
      expect(screen.getByText('Super Metroid')).toBeInTheDocument();
      expect(screen.getByText('Nintendo R&D1')).toBeInTheDocument();

      // Check third winner
      expect(
        screen.getByText('Star Ocean: The Second Story'),
      ).toBeInTheDocument();
      expect(screen.getByText('tri-Ace')).toBeInTheDocument();
    });

    it('should render winner game images', () => {
      render(<GotyThemeDetail nominations={mockNominations} />);

      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(3);

      expect(images[0]).toHaveAttribute('src', 'zelda-alttp.jpg');
      expect(images[1]).toHaveAttribute('src', 'super-metroid.jpg');
      expect(images[2]).toHaveAttribute('src', 'star-ocean-2.jpg');
    });
  });
});
