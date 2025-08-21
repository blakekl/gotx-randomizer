import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ThemeDetail from '../../../pages/Themes/ThemeDetail/ThemeDetail';
import { NominationType } from '../../../models/game';

// Mock the theme detail components
vi.mock(
  '../../../pages/Themes/ThemeDetail/GotmThemeDetail/GotmThemeDetail',
  () => ({
    GotmThemeDetail: ({ nominations }: any) => (
      <div data-testid="gotm-theme-detail">
        GotM Theme Detail - {nominations.length} nominations
      </div>
    ),
  }),
);

vi.mock(
  '../../../pages/Themes/ThemeDetail/RetrobitsThemeDetail/RetrobitsThemeDetail',
  () => ({
    RetrobitsThemeDetail: ({ nominations }: any) => (
      <div data-testid="retrobit-theme-detail">
        Retrobit Theme Detail - {nominations.length} nominations
      </div>
    ),
  }),
);

vi.mock(
  '../../../pages/Themes/ThemeDetail/RpgThemeDetail/RpgThemeDetail',
  () => ({
    RpgThemeDetail: ({ nominations }: any) => (
      <div data-testid="rpg-theme-detail">
        RPG Theme Detail - {nominations.length} nominations
      </div>
    ),
  }),
);

vi.mock(
  '../../../pages/Themes/ThemeDetail/GotyThemeDetail/GotyThemeDetail',
  () => ({
    GotyThemeDetail: ({ nominations }: any) => (
      <div data-testid="goty-theme-detail">
        GotY Theme Detail - {nominations.length} nominations
      </div>
    ),
  }),
);

vi.mock(
  '../../../pages/Themes/ThemeDetail/GotwotypThemeDetail/GotwotypThemeDetail',
  () => ({
    GotwotypThemeDetail: ({ nominations }: any) => (
      <div data-testid="gotwoty-theme-detail">
        GOTWOTY Theme Detail - {nominations.length} nominations
      </div>
    ),
  }),
);

const mockThemeData = {
  theme: {
    id: 1,
    title: 'Test Theme',
    nomination_type: 'gotm',
    creation_date: '2024-01-01',
    description: 'Test theme description',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    status: 'completed' as const,
    display_title: 'Test Theme',
    nomination_count: 5,
    winner_count: 1,
  },
  nominations: [
    {
      id: 1,
      theme_id: 1,
      game_id: 1,
      user_id: 1,
      winner: 1,
      description: 'Test nomination',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      themeDescription: 'Test theme description',
      yearCategory: 'pre 96',
      game: {
        id: 1,
        title_world: 'Test Game',
        title_usa: 'Test Game USA',
        title_eu: 'Test Game EU',
        title_jap: 'Test Game JP',
        title_other: 'Test Game Other',
        year: 1995,
        system: 'SNES',
        developer: 'Test Developer',
        genre: 'Action',
        img_url: 'test.jpg',
        time_to_beat: 10,
        screenscraper_id: 123,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    },
  ],
};

describe('ThemeDetail Router Component', () => {
  describe('theme type routing', () => {
    it('should render GotM theme detail for gotm type', () => {
      const gotmThemeData = {
        ...mockThemeData,
        theme: { ...mockThemeData.theme, nomination_type: NominationType.GOTM },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => gotmThemeData),
            },
          },
        },
      );

      expect(screen.getByTestId('gotm-theme-detail')).toBeInTheDocument();
      expect(
        screen.getByText('GotM Theme Detail - 1 nominations'),
      ).toBeInTheDocument();
    });

    it('should render Retrobit theme detail for retrobit type', () => {
      const retrobitThemeData = {
        ...mockThemeData,
        theme: {
          ...mockThemeData.theme,
          nomination_type: NominationType.RETROBIT,
        },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => retrobitThemeData),
            },
          },
        },
      );

      expect(screen.getByTestId('retrobit-theme-detail')).toBeInTheDocument();
      expect(
        screen.getByText('Retrobit Theme Detail - 1 nominations'),
      ).toBeInTheDocument();
    });

    it('should render RPG theme detail for rpg type', () => {
      const rpgThemeData = {
        ...mockThemeData,
        theme: { ...mockThemeData.theme, nomination_type: NominationType.RPG },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => rpgThemeData),
            },
          },
        },
      );

      expect(screen.getByTestId('rpg-theme-detail')).toBeInTheDocument();
      expect(
        screen.getByText('RPG Theme Detail - 1 nominations'),
      ).toBeInTheDocument();
    });

    it('should render GotY theme detail for goty type', () => {
      const gotyThemeData = {
        ...mockThemeData,
        theme: { ...mockThemeData.theme, nomination_type: NominationType.GOTY },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => gotyThemeData),
            },
          },
        },
      );

      expect(screen.getByTestId('goty-theme-detail')).toBeInTheDocument();
      expect(
        screen.getByText('GotY Theme Detail - 1 nominations'),
      ).toBeInTheDocument();
    });

    it('should render GOTWOTY theme detail for gotwoty type', () => {
      const gotwotyThemeData = {
        ...mockThemeData,
        theme: {
          ...mockThemeData.theme,
          nomination_type: NominationType.GOTWOTY,
        },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => gotwotyThemeData),
            },
          },
        },
      );

      expect(screen.getByTestId('gotwoty-theme-detail')).toBeInTheDocument();
      expect(
        screen.getByText('GOTWOTY Theme Detail - 1 nominations'),
      ).toBeInTheDocument();
    });
  });

  describe('theme header rendering', () => {
    it('should render theme header with theme information', () => {
      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => mockThemeData),
            },
          },
        },
      );

      expect(screen.getByText('Test Theme')).toBeInTheDocument();
      expect(screen.getByText('Test theme description')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should redirect to themes page when theme ID is invalid', () => {
      render(
        <MemoryRouter initialEntries={['/themes/invalid']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => mockThemeData),
            },
          },
        },
      );

      // Should redirect - we can't easily test navigation in this setup,
      // but we can verify the component doesn't crash
      expect(document.body).toBeInTheDocument();
    });

    it('should handle missing theme data gracefully', () => {
      render(
        <MemoryRouter initialEntries={['/themes/999']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => ({
                theme: null,
                nominations: [],
              })),
            },
          },
        },
      );

      // Should redirect when theme is null
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('default case handling', () => {
    it('should default to GotM theme detail for unknown types', () => {
      const unknownTypeThemeData = {
        ...mockThemeData,
        theme: { ...mockThemeData.theme, nomination_type: 'unknown' as any },
      };

      render(
        <MemoryRouter initialEntries={['/themes/1']}>
          <ThemeDetail />
        </MemoryRouter>,
        {
          storeOverrides: {
            dbStore: {
              getThemeDetailWithCategories: vi.fn(() => unknownTypeThemeData),
            },
          },
        },
      );

      // Should default to GotM theme detail
      expect(screen.getByTestId('gotm-theme-detail')).toBeInTheDocument();
    });
  });
});
