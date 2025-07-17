import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Users from '../../../pages/Users/Users';
import {
  createMockDbStore,
  createMockSettingsStore,
  StoreContext,
} from '../../test-utils/mockStores';

// Mock Pagination component since we already tested it separately
vi.mock('../../../components/Pagination', () => ({
  default: vi.fn(({ count, onPageChange }) => {
    // Call onPageChange on mount to set initial page range (like the real component does)
    React.useEffect(() => {
      onPageChange([0, Math.min(10, count)]);
    }, [count, onPageChange]);

    return (
      <div data-testid="mock-pagination">
        <button onClick={() => onPageChange([0, 10])}>Page 1</button>
        <button onClick={() => onPageChange([10, 20])}>Page 2</button>
        <span data-testid="pagination-count">{count}</span>
      </div>
    );
  }),
}));

const mockUsers = [
  {
    id: 1,
    name: 'user1', // Match test expectations
    success_rate: 85.5,
    nominations: 30,
    wins: 26, // Changed from 25 to avoid duplicate with user2 nominations
  },
  {
    id: 2,
    name: 'user2',
    success_rate: 78.2,
    nominations: 25,
    wins: 20,
  },
  {
    id: 3,
    name: 'user3',
    success_rate: 92.1,
    nominations: 35,
    wins: 32, // Changed from 30 to avoid duplicate with user1 nominations
  },
];

const renderWithStores = (mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    getNominationSuccessPercentByUser: vi.fn(() => mockUsers), // This is the correct method name
    isLoading: false,
    error: null,
    ...mockStores.dbStore,
  });

  const mockSettingsStore = createMockSettingsStore({
    itemsPerPage: 10,
    sortBy: 'total_points',
    sortOrder: 'desc',
    ...mockStores.settingsStore,
  });

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <BrowserRouter>
      <StoreContext.Provider value={mockContext}>
        <Users />
      </StoreContext.Provider>
    </BrowserRouter>,
  );
};

describe('Users Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('page rendering', () => {
    it('should render users page title', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(screen.getByText(/users/i)).toBeInTheDocument();
      });
    });

    it('should render user table with headers', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText(/username/i)).toBeInTheDocument();
        expect(screen.getByText(/total points/i)).toBeInTheDocument();
        expect(screen.getByText(/completions/i)).toBeInTheDocument();
        expect(screen.getByText(/join date/i)).toBeInTheDocument();
      });
    });

    it('should display user data in table rows', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.getByText('user3')).toBeInTheDocument();

        // Check for unique values to avoid duplicates
        expect(screen.getByText('26')).toBeInTheDocument(); // user1 wins
        expect(screen.getByText('25')).toBeInTheDocument(); // user2 nominations
        expect(screen.getByText('20')).toBeInTheDocument(); // user2 wins
        expect(screen.getByText('35')).toBeInTheDocument(); // user3 nominations
        expect(screen.getByText('32')).toBeInTheDocument(); // user3 wins
        expect(screen.getByText('85.5%')).toBeInTheDocument(); // user1 success rate
        expect(screen.getByText('78.2%')).toBeInTheDocument(); // user2 success rate
        expect(screen.getByText('92.1%')).toBeInTheDocument(); // user3 success rate
      });
    });

    it('should handle empty user list', async () => {
      renderWithStores({
        dbStore: {
          users: [],
          getUserList: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/no users found/i)).toBeInTheDocument();
      });
    });
  });

  describe('sorting functionality', () => {
    it('should sort users by total points by default', async () => {
      renderWithStores();

      await waitFor(() => {
        const userRows = screen.getAllByText(/user\d/);
        // Should be sorted by points descending: user3 (1800), user1 (1500), user2 (1200)
        expect(userRows[0]).toHaveTextContent('user3');
        expect(userRows[1]).toHaveTextContent('user1');
        expect(userRows[2]).toHaveTextContent('user2');
      });
    });

    it('should sort users by username when username header is clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const usernameHeader = screen.getByText(/username/i);
        fireEvent.click(usernameHeader);
      });

      await waitFor(() => {
        const userRows = screen.getAllByText(/user\d/);
        // Should be sorted alphabetically: user1, user2, user3
        expect(userRows[0]).toHaveTextContent('user1');
        expect(userRows[1]).toHaveTextContent('user2');
        expect(userRows[2]).toHaveTextContent('user3');
      });
    });

    it('should reverse sort when clicking same header twice', async () => {
      renderWithStores();

      await waitFor(() => {
        const pointsHeader = screen.getByText(/total points/i);
        fireEvent.click(pointsHeader); // First click - ascending
        fireEvent.click(pointsHeader); // Second click - descending
      });

      await waitFor(() => {
        const userRows = screen.getAllByText(/user\d/);
        // Should be sorted by points ascending: user2 (1200), user1 (1500), user3 (1800)
        expect(userRows[0]).toHaveTextContent('user2');
        expect(userRows[1]).toHaveTextContent('user1');
        expect(userRows[2]).toHaveTextContent('user3');
      });
    });
  });

  describe('pagination', () => {
    it('should show pagination when there are many users', async () => {
      const manyUsers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        display_name: `User ${i + 1}`,
        total_points: 1000 + i * 100,
        total_completions: 10 + i,
        join_date: '2023-01-01',
      }));

      renderWithStores({
        dbStore: {
          users: manyUsers,
          getUserList: vi.fn(() => manyUsers),
        },
      });

      await waitFor(() => {
        expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
        expect(screen.getByTestId('pagination-count')).toHaveTextContent('25');
      });
    });

    it('should navigate between pages', async () => {
      const manyUsers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        display_name: `User ${i + 1}`,
        total_points: 1000 + i * 100,
        total_completions: 10 + i,
        join_date: '2023-01-01',
      }));

      renderWithStores({
        dbStore: {
          users: manyUsers,
          getUserList: vi.fn(() => manyUsers),
        },
      });

      await waitFor(() => {
        const page2Button = screen.getByText('Page 2');
        fireEvent.click(page2Button);
      });

      // Should not throw errors and pagination should work
      expect(screen.getByTestId('mock-pagination')).toBeInTheDocument();
    });
  });

  describe('user details navigation', () => {
    it('should navigate to user details when username is clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const userLink = screen.getByRole('link', { name: /user1/i });
        expect(userLink).toBeInTheDocument();
        expect(userLink).toHaveAttribute('href', '/users/1');
      });
    });

    it('should handle user navigation for all users', async () => {
      renderWithStores();

      await waitFor(() => {
        const userLinks = screen.getAllByRole('link');
        const userSpecificLinks = userLinks.filter((link) =>
          link.getAttribute('href')?.startsWith('/users/'),
        );

        expect(userSpecificLinks).toHaveLength(3); // One for each user
      });
    });
  });

  describe('data loading', () => {
    it('should call getUserList on component mount', async () => {
      const mockGetUserList = vi.fn(() => mockUsers);

      renderWithStores({
        dbStore: {
          getUserList: mockGetUserList,
        },
      });

      await waitFor(() => {
        expect(mockGetUserList).toHaveBeenCalled();
      });
    });

    it('should handle database errors gracefully', async () => {
      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => {
            throw new Error('Database error');
          }),
          error: 'Failed to load users',
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
      });
    });
  });

  describe('responsive design', () => {
    it('should have responsive table classes', async () => {
      renderWithStores();

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toHaveClass('table', 'is-striped', 'is-hoverable');
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
        const container = screen.getByTestId('users-container');
        expect(container).toHaveClass('is-mobile-friendly');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper table structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        const headers = screen.getAllByRole('columnheader');
        expect(headers.length).toBeGreaterThan(0);

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1); // Header + data rows
      });
    });

    it('should have proper heading structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
        expect(mainHeading).toHaveTextContent(/users/i);
      });
    });

    it('should have accessible sort buttons', async () => {
      renderWithStores();

      await waitFor(() => {
        const sortButtons = screen.getAllByRole('button');
        sortButtons.forEach((button) => {
          expect(button).toHaveAccessibleName();
        });
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores();

      await waitFor(() => {
        const firstUserLink = screen.getByRole('link', { name: /user1/i });
        firstUserLink.focus();
        expect(document.activeElement).toBe(firstUserLink);
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing store gracefully', () => {
      expect(() => {
        render(
          <BrowserRouter>
            <Users />
          </BrowserRouter>,
        );
      }).toThrow();
    });

    it('should handle malformed user data', async () => {
      const malformedUsers = [
        { id: 1, username: null, total_points: 'invalid' },
        { id: 2, username: 'validuser', total_points: 1000 },
      ];

      renderWithStores({
        dbStore: {
          users: malformedUsers,
          getUserList: vi.fn(() => malformedUsers),
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/unknown user/i)).toBeInTheDocument();
        expect(screen.getByText('validuser')).toBeInTheDocument();
      });
    });
  });

  describe('performance', () => {
    it('should handle large user lists efficiently', async () => {
      const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        username: `user${i + 1}`,
        display_name: `User ${i + 1}`,
        total_points: 1000 + i,
        total_completions: 10 + i,
        join_date: '2023-01-01',
      }));

      const startTime = performance.now();
      renderWithStores({
        dbStore: {
          users: largeUserList,
          getUserList: vi.fn(() => largeUserList),
        },
      });
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(2000); // Should render within 2 seconds

      await waitFor(() => {
        expect(screen.getByText(/users/i)).toBeInTheDocument();
      });
    });

    it('should not cause memory leaks on unmount', async () => {
      const { unmount } = renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/users/i)).toBeInTheDocument();
      });

      expect(() => unmount()).not.toThrow();
    });
  });
});
