import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import CurrentThemes from '../../../pages/Themes/CurrentThemes';
import { NominationType } from '../../../models/game';

describe('CurrentThemes Component Integration', () => {
  describe('basic rendering', () => {
    it('should render empty state when no current themes', () => {
      render(<CurrentThemes />, {
        storeOverrides: {
          dbStore: {
            getCurrentWinners: () => [],
          },
        },
      });

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
          nomination_type: NominationType.GOTM,
          creation_date: '2025-01-01',
          description: 'Test theme description',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          status: 'current' as const,
          displayTitle: 'Test Theme',
          nominationCount: 5,
          winners: [],
          categoryBreakdown: { 'pre 96': 0 },
        },
        winners: [
          {
            id: 1,
            title_world: 'Test Game',
            title_usa: 'Test Game',
            title_eu: 'Test Game',
            title_jap: 'Test Game',
            title_other: 'Test Game',
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

    it('should render current themes when available', () => {
      render(<CurrentThemes />, {
        storeOverrides: {
          dbStore: {
            getCurrentWinners: () => mockCurrentThemes,
          },
        },
      });

      expect(screen.getByText('Test Theme')).toBeInTheDocument();
      expect(screen.getByText('Game of the Month')).toBeInTheDocument();
      expect(screen.getByText('Test Game')).toBeInTheDocument();
    });
  });
});
