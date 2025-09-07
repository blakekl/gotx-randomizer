import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import { ThemeHeader } from '../../../pages/Themes/ThemeDetail/ThemeHeader/ThemeHeader';
import { ThemeWithStatus, NominationType } from '../../../models/game';

const mockTheme: ThemeWithStatus = {
  id: 1,
  title: 'Test Theme Title',
  nomination_type: NominationType.GOTM,
  creation_date: '2024-01-01',
  description: 'Test theme description',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  status: 'historical' as const,
  displayTitle: 'Test Theme Title',
  nominationCount: 25,
  winners: [],
  categoryBreakdown: { 'pre 96': 0 },
};

describe('ThemeHeader Component', () => {
  describe('basic rendering', () => {
    it('should render theme title and information', () => {
      render(<ThemeHeader theme={mockTheme} />);

      expect(screen.getByText('Test Theme Title')).toBeInTheDocument();
      expect(screen.getByText('Test theme description')).toBeInTheDocument();
      expect(screen.getByText('2024-01-01')).toBeInTheDocument(); // Raw date format
    });

    it('should display theme type with icon', () => {
      render(<ThemeHeader theme={mockTheme} />);

      expect(screen.getByText('Game of the Month')).toBeInTheDocument();
      // Check for trophy icon class
      const icon = document.querySelector('.fas.fa-trophy');
      expect(icon).toBeInTheDocument();
    });

    it('should show nomination count', () => {
      render(<ThemeHeader theme={mockTheme} />);

      expect(screen.getByText('25 Nominations')).toBeInTheDocument();
      // ThemeHeader doesn't show separate winner count
    });
  });

  describe('different theme types', () => {
    it('should render Retrobit theme correctly', () => {
      const retrobitTheme = {
        ...mockTheme,
        nomination_type: NominationType.RETROBIT,
      };

      render(<ThemeHeader theme={retrobitTheme} />);

      expect(screen.getByText('Retrobit')).toBeInTheDocument();
      // Check for gamepad icon
      const icon = document.querySelector('.fas.fa-gamepad');
      expect(icon).toBeInTheDocument();
    });

    it('should render RPG theme correctly', () => {
      const rpgTheme = {
        ...mockTheme,
        nomination_type: NominationType.RPG,
      };

      render(<ThemeHeader theme={rpgTheme} />);

      expect(screen.getByText('RPG')).toBeInTheDocument();
      // Check for dragon icon
      const icon = document.querySelector('.fas.fa-dragon');
      expect(icon).toBeInTheDocument();
    });

    it('should render GotY theme correctly', () => {
      const gotyTheme = {
        ...mockTheme,
        nomination_type: NominationType.GOTY,
      };

      render(<ThemeHeader theme={gotyTheme} />);

      expect(screen.getByText('Game of the Year')).toBeInTheDocument();
      // Check for crown icon
      const icon = document.querySelector('.fas.fa-crown');
      expect(icon).toBeInTheDocument();
    });

    it('should render GOTWOTY theme correctly', () => {
      const gotwotyTheme = {
        ...mockTheme,
        nomination_type: NominationType.GOTWOTY,
      };

      render(<ThemeHeader theme={gotwotyTheme} />);

      expect(
        screen.getByText('Game of the Week of the Year'),
      ).toBeInTheDocument();
      // Check for calendar-week icon
      const icon = document.querySelector('.fas.fa-calendar-week');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle missing title gracefully', () => {
      const themeWithoutTitle = {
        ...mockTheme,
        title: '',
        display_title: '',
      };

      render(<ThemeHeader theme={themeWithoutTitle} />);

      // Should still render other information
      expect(screen.getByText('Test theme description')).toBeInTheDocument();
      expect(screen.getByText('Game of the Month')).toBeInTheDocument();
    });

    it('should handle zero counts', () => {
      const themeWithZeroCounts = {
        ...mockTheme,
        nominationCount: 0,
        winner_count: 0,
      };

      render(<ThemeHeader theme={themeWithZeroCounts} />);

      expect(screen.getByText('0 Nominations')).toBeInTheDocument();
    });
  });
});
