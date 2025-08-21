import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import ThemeBrowser from '../../../pages/Themes/ThemeBrowser';
import { NominationType } from '../../../models/game';

describe('ThemeBrowser Component Integration', () => {
  describe('basic rendering', () => {
    it('should render theme browser page', () => {
      render(<ThemeBrowser />);

      expect(screen.getByText('Theme Browser')).toBeInTheDocument();
      expect(screen.getByText('Theme History')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search themes...'),
      ).toBeInTheDocument();
    });

    it('should render theme history section', () => {
      render(<ThemeBrowser />);

      expect(screen.getByText('Theme History')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<ThemeBrowser />);

      const searchInput = screen.getByPlaceholderText('Search themes...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should render empty state when no current themes', () => {
      render(<ThemeBrowser />);

      expect(
        screen.getByText(
          'No active themes at the moment. Check back soon for new themes!',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('with current themes', () => {
    const mockCurrentThemes = [
      {
        nominationType: NominationType.GOTM,
        theme: {
          id: 1,
          title: 'Test Theme',
          type: 'gotm',
          status: 'active',
          created_at: '2025-01-01',
          updated_at: '2025-01-01',
        },
        winners: [
          {
            id: 1,
            title_usa: 'Test Game',
            year: 2020,
            system: 'NES',
            developer: 'Test Dev',
            genre: 'Action',
            img_url: '',
            time_to_beat: 10,
            screenscraper_id: 1,
            created_at: '2025-01-01',
            updated_at: '2025-01-01',
          },
        ],
        isMultiWinner: false,
      },
    ];

    it('should render current themes section when themes available', () => {
      render(<ThemeBrowser />, {
        storeOverrides: {
          dbStore: {
            getCurrentWinners: () => mockCurrentThemes,
            getThemesWithStatus: () => [],
          },
        },
      });

      expect(screen.getByText('Current Themes')).toBeInTheDocument();
      expect(screen.getByText('Test Theme')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should handle empty themes list', () => {
      render(<ThemeBrowser />, {
        storeOverrides: {
          dbStore: {
            getThemesWithStatus: () => [],
            getCurrentWinners: () => [],
          },
        },
      });

      expect(screen.getByText('Theme Browser')).toBeInTheDocument();
      expect(
        screen.getByText(
          'No active themes at the moment. Check back soon for new themes!',
        ),
      ).toBeInTheDocument();
    });
  });
});
