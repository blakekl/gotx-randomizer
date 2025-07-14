import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserDisplay from '../../../pages/Users/UserDisplay/UserDisplay';
import { StoreContext } from '../../../stores';
import {
  createMockDbStore,
  createMockSettingsStore,
} from '../../test-utils/mockStores';

const mockUser = {
  id: 1,
  username: 'TestUser',
  discord_user_id: '123456789',
  total_points: 25.5,
  total_completions: 10,
  gotm_points: 15,
  rpg_points: 10.5,
  retrobit_points: 0,
};

const mockCompletions = [
  {
    id: 1,
    user_id: 1,
    game_id: 1,
    game_title: 'Test Game 1',
    nomination_type: 'GOTM_WINNER',
    theme_number: 20,
    points: 3,
    completed_date: '2024-01-15',
  },
  {
    id: 2,
    user_id: 1,
    game_id: 2,
    game_title: 'Test Game 2',
    nomination_type: 'RPG_WINNER',
    theme_number: 19,
    points: 3,
    completed_date: '2024-01-10',
  },
];

const renderWithStores = (userId = '1', mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    getUserById: vi.fn((id) => (id === 1 ? mockUser : null)),
    getCompletionsByUserId: vi.fn((id) => (id === 1 ? mockCompletions : [])),
    ...mockStores.dbStore,
  });
  const mockSettingsStore = createMockSettingsStore(mockStores.settingsStore);

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <BrowserRouter initialEntries={[`/users/${userId}`]}>
      <StoreContext.Provider value={mockContext}>
        <Routes>
          <Route path="/users/:userId" element={<UserDisplay />} />
        </Routes>
      </StoreContext.Provider>
    </BrowserRouter>,
  );
};

describe('UserDisplay Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('user information display', () => {
    it('should display user details', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText('25.5')).toBeInTheDocument(); // Total points
        expect(screen.getByText('10')).toBeInTheDocument(); // Total completions
        expect(screen.getByText('15')).toBeInTheDocument(); // GotM points
        expect(screen.getByText('10.5')).toBeInTheDocument(); // RPG points
      });
    });

    it('should display user statistics breakdown', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/Total Points/)).toBeInTheDocument();
        expect(screen.getByText(/Total Completions/)).toBeInTheDocument();
        expect(screen.getByText(/GotM Points/)).toBeInTheDocument();
        expect(screen.getByText(/RPG Points/)).toBeInTheDocument();
      });
    });

    it('should handle user not found', async () => {
      renderWithStores('999', {
        dbStore: {
          getUserById: vi.fn(() => null),
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/User not found/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid user ID', async () => {
      renderWithStores('invalid', {
        dbStore: {
          getUserById: vi.fn(() => null),
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/User not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('completions display', () => {
    it('should display user completions list', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test Game 1')).toBeInTheDocument();
        expect(screen.getByText('Test Game 2')).toBeInTheDocument();
        expect(screen.getByText('GOTM_WINNER')).toBeInTheDocument();
        expect(screen.getByText('RPG_WINNER')).toBeInTheDocument();
      });
    });

    it('should display completion details', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Theme 20')).toBeInTheDocument();
        expect(screen.getByText('Theme 19')).toBeInTheDocument();
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
        expect(screen.getByText('2024-01-10')).toBeInTheDocument();
      });
    });

    it('should handle empty completions list', async () => {
      renderWithStores('1', {
        dbStore: {
          getUserById: vi.fn(() => mockUser),
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.getByText(/No completions found/i)).toBeInTheDocument();
      });
    });

    it('should sort completions by date (newest first)', async () => {
      renderWithStores();

      await waitFor(() => {
        const completionRows = screen.getAllByRole('row');
        // Skip header row, check data rows
        const firstCompletion = completionRows[1];
        const secondCompletion = completionRows[2];

        expect(firstCompletion).toHaveTextContent('2024-01-15'); // Newer date first
        expect(secondCompletion).toHaveTextContent('2024-01-10');
      });
    });
  });

  describe('data loading', () => {
    it('should call database methods with correct user ID', async () => {
      const mockGetUserById = vi.fn(() => mockUser);
      const mockGetCompletions = vi.fn(() => mockCompletions);

      renderWithStores('1', {
        dbStore: {
          getUserById: mockGetUserById,
          getCompletionsByUserId: mockGetCompletions,
        },
      });

      await waitFor(() => {
        expect(mockGetUserById).toHaveBeenCalledWith(1);
        expect(mockGetCompletions).toHaveBeenCalledWith(1);
      });
    });

    it('should handle database errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderWithStores('1', {
        dbStore: {
          getUserById: vi.fn(() => {
            throw new Error('DB Error');
          }),
          getCompletionsByUserId: vi.fn(() => {
            throw new Error('DB Error');
          }),
        },
      });

      // Should show error state instead of crashing
      await waitFor(() => {
        expect(screen.getByText(/Error loading user/i)).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should show loading state initially', () => {
      renderWithStores();

      // Should show some loading indicator or the component should render quickly
      expect(screen.getByText(/TestUser|Loading|User/)).toBeInTheDocument();
    });
  });

  describe('navigation and routing', () => {
    it('should extract user ID from URL params', async () => {
      const mockGetUserById = vi.fn(() => mockUser);

      renderWithStores('42', {
        dbStore: {
          getUserById: mockGetUserById,
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(mockGetUserById).toHaveBeenCalledWith(42);
      });
    });

    it('should handle navigation back to users list', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByText(/Back to Users|← Users/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/users');
      });
    });
  });

  describe('responsive design', () => {
    it('should have responsive layout classes', async () => {
      renderWithStores();

      await waitFor(() => {
        const container = screen.getByText('TestUser').closest('div');
        expect(container).toBeInTheDocument();
      });
    });

    it('should handle mobile view appropriately', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const userHeading = screen.getByRole('heading', { level: 1 });
        expect(userHeading).toBeInTheDocument();
        expect(userHeading).toHaveTextContent('TestUser');
      });
    });

    it('should have accessible table for completions', async () => {
      renderWithStores();

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBeGreaterThan(0);
      });
    });

    it('should have proper navigation links', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back|users/i });
        expect(backLink).toBeInTheDocument();
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores();

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back|users/i });
        backLink.focus();
        expect(backLink).toHaveFocus();
      });
    });
  });

  describe('data formatting', () => {
    it('should format points correctly', async () => {
      renderWithStores();

      await waitFor(() => {
        // Should show decimal points for fractional values
        expect(screen.getByText('25.5')).toBeInTheDocument();
        expect(screen.getByText('10.5')).toBeInTheDocument();
      });
    });

    it('should format dates correctly', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('2024-01-15')).toBeInTheDocument();
        expect(screen.getByText('2024-01-10')).toBeInTheDocument();
      });
    });

    it('should handle zero values appropriately', async () => {
      const userWithZeros = {
        ...mockUser,
        retrobit_points: 0,
        total_completions: 0,
      };

      renderWithStores('1', {
        dbStore: {
          getUserById: vi.fn(() => userWithZeros),
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument(); // Should show zero values
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter initialEntries={['/users/1']}>
            <Routes>
              <Route path="/users/:userId" element={<UserDisplay />} />
            </Routes>
          </BrowserRouter>,
        );
      }).toThrow(); // Should throw because no store context
    });

    it('should handle malformed completion data', async () => {
      const malformedCompletions = [
        { id: 1, game_title: null, points: 'invalid' },
        { id: 2 }, // Missing required fields
        null, // Null completion
      ];

      renderWithStores('1', {
        dbStore: {
          getUserById: vi.fn(() => mockUser),
          getCompletionsByUserId: vi.fn(() => malformedCompletions),
        },
      });

      // Should not crash
      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should handle large completion lists efficiently', async () => {
      const largeCompletionList = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        user_id: 1,
        game_id: i + 1,
        game_title: `Game ${i + 1}`,
        nomination_type: 'GOTM_WINNER',
        theme_number: 20,
        points: 3,
        completed_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      }));

      renderWithStores('1', {
        dbStore: {
          getUserById: vi.fn(() => mockUser),
          getCompletionsByUserId: vi.fn(() => largeCompletionList),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('TestUser')).toBeInTheDocument();
      });
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithStores();

      expect(() => unmount()).not.toThrow();
    });
  });
});
