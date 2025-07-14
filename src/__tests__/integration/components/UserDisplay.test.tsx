import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserDisplay from '../../../pages/Users/UserDisplay/UserDisplay';
import {
  createMockDbStore,
  createMockSettingsStore,
  StoreContext,
} from '../../test-utils/mockStores';

const mockUser = {
  id: 1,
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  join_date: '2023-01-01',
  total_points: 1500,
  total_completions: 25,
  favorite_genre: 'Action',
};

const mockCompletions = [
  {
    id: 1,
    user_id: 1,
    game_id: 1,
    game_title: 'Test Game 1',
    completed_date: '2023-03-01',
    points: 100,
    difficulty: 3,
    rating: 8,
  },
  {
    id: 2,
    user_id: 1,
    game_id: 2,
    game_title: 'Test Game 2',
    completed_date: '2023-02-15',
    points: 150,
    difficulty: 5,
    rating: 9,
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
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('1500')).toBeInTheDocument(); // total points
        expect(screen.getByText('25')).toBeInTheDocument(); // total completions
      });
    });

    it('should display user statistics breakdown', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText(/total points/i)).toBeInTheDocument();
        expect(screen.getByText(/total completions/i)).toBeInTheDocument();
        expect(screen.getByText(/favorite genre/i)).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
      });
    });

    it('should handle user not found', async () => {
      renderWithStores('999');

      await waitFor(() => {
        expect(screen.getByText(/user not found/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid user ID', async () => {
      renderWithStores('invalid');

      await waitFor(() => {
        expect(screen.getByText(/invalid user/i)).toBeInTheDocument();
      });
    });
  });

  describe('completions display', () => {
    it('should display user completions list', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test Game 1')).toBeInTheDocument();
        expect(screen.getByText('Test Game 2')).toBeInTheDocument();
      });
    });

    it('should display completion details', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('100')).toBeInTheDocument(); // points
        expect(screen.getByText('150')).toBeInTheDocument(); // points
        expect(screen.getByText(/2023-03-01/)).toBeInTheDocument();
        expect(screen.getByText(/2023-02-15/)).toBeInTheDocument();
      });
    });

    it('should handle empty completions list', async () => {
      renderWithStores('1', {
        dbStore: { getCompletionsByUserId: vi.fn(() => []) },
      });

      await waitFor(() => {
        expect(screen.getByText(/no completions found/i)).toBeInTheDocument();
      });
    });

    it('should sort completions by date (newest first)', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const completions = screen.getAllByText(/Test Game/);
        expect(completions[0]).toHaveTextContent('Test Game 1'); // March 1st (newer)
        expect(completions[1]).toHaveTextContent('Test Game 2'); // Feb 15th (older)
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
      const mockGetUserById = vi.fn(() => {
        throw new Error('Database error');
      });

      renderWithStores('1', {
        dbStore: { getUserById: mockGetUserById },
      });

      await waitFor(() => {
        expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      const mockGetUserById = vi.fn(() => new Promise(() => {})); // Never resolves

      renderWithStores('1', {
        dbStore: { getUserById: mockGetUserById, isLoading: true },
      });

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('navigation and routing', () => {
    it('should extract user ID from URL params', async () => {
      const mockGetUserById = vi.fn(() => mockUser);

      renderWithStores('123', {
        dbStore: { getUserById: mockGetUserById },
      });

      await waitFor(() => {
        expect(mockGetUserById).toHaveBeenCalledWith(123);
      });
    });

    it('should handle navigation back to users list', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to users/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/users');
      });
    });
  });

  describe('responsive design', () => {
    it('should have responsive layout classes', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const container = screen.getByTestId('user-display-container');
        expect(container).toHaveClass('columns', 'is-mobile');
      });
    });

    it('should handle mobile view appropriately', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithStores('1');

      await waitFor(() => {
        const avatar = screen.getByRole('img');
        expect(avatar).toHaveClass('is-mobile-friendly');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Test User');
      });
    });

    it('should have accessible table for completions', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        expect(table).toHaveAccessibleName();

        const headers = screen.getAllByRole('columnheader');
        expect(headers.length).toBeGreaterThan(0);
      });
    });

    it('should have proper navigation links', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to users/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAccessibleName();
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores('1');

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to users/i });
        backLink.focus();
        expect(document.activeElement).toBe(backLink);
      });
    });
  });

  describe('data formatting', () => {
    it('should format points correctly', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText(/1,500/)).toBeInTheDocument(); // Formatted with comma
      });
    });

    it('should format dates correctly', async () => {
      renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText(/march.*1.*2023/i)).toBeInTheDocument();
        expect(screen.getByText(/february.*15.*2023/i)).toBeInTheDocument();
      });
    });

    it('should handle zero values appropriately', async () => {
      const userWithZeros = {
        ...mockUser,
        total_points: 0,
        total_completions: 0,
      };
      renderWithStores('1', {
        dbStore: { getUserById: vi.fn(() => userWithZeros) },
      });

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText(/no completions yet/i)).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter>
            <Routes>
              <Route path="/users/:userId" element={<UserDisplay />} />
            </Routes>
          </BrowserRouter>,
        );
      }).toThrow();
    });

    it('should handle malformed completion data', async () => {
      const malformedCompletions = [
        { id: 1, game_title: null, completed_date: 'invalid-date' },
      ];

      renderWithStores('1', {
        dbStore: { getCompletionsByUserId: vi.fn(() => malformedCompletions) },
      });

      await waitFor(() => {
        expect(screen.getByText(/unknown game/i)).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should handle large completion lists efficiently', async () => {
      const largeCompletionsList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        user_id: 1,
        game_id: i + 1,
        game_title: `Game ${i + 1}`,
        completed_date: '2023-01-01',
        points: 100,
        difficulty: 3,
        rating: 8,
      }));

      const startTime = performance.now();
      renderWithStores('1', {
        dbStore: { getCompletionsByUserId: vi.fn(() => largeCompletionsList) },
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(2000); // Should render within 2 seconds

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });
    });

    it('should not cause memory leaks on unmount', async () => {
      const { unmount } = renderWithStores('1');

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });
  });
});
