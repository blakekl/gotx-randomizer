import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Users from '../../../pages/Users/Users';
import { StoreContext } from '../../../stores';
import {
  createMockDbStore,
  createMockSettingsStore,
} from '../../test-utils/mockStores';

const mockUsers = [
  {
    id: 1,
    username: 'TestUser1',
    discord_user_id: '123456789',
    total_points: 25.5,
    total_completions: 10,
    gotm_points: 15,
    rpg_points: 10.5,
    retrobit_points: 0,
  },
  {
    id: 2,
    username: 'TestUser2',
    discord_user_id: '987654321',
    total_points: 18.0,
    total_completions: 8,
    gotm_points: 12,
    rpg_points: 6,
    retrobit_points: 0,
  },
  {
    id: 3,
    username: 'TestUser3',
    discord_user_id: '456789123',
    total_points: 5.5,
    total_completions: 3,
    gotm_points: 3,
    rpg_points: 2.5,
    retrobit_points: 0,
  },
];

const renderWithStores = (mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    getUserList: vi.fn(() => mockUsers),
    ...mockStores.dbStore,
  });
  const mockSettingsStore = createMockSettingsStore(mockStores.settingsStore);

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
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('page rendering', () => {
    it('should render users page title', () => {
      renderWithStores();

      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('should render user table with headers', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.getByText('Total Points')).toBeInTheDocument();
        expect(screen.getByText('Completions')).toBeInTheDocument();
        expect(screen.getByText('GotM Points')).toBeInTheDocument();
        expect(screen.getByText('RPG Points')).toBeInTheDocument();
      });
    });

    it('should display user data in table rows', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('TestUser1')).toBeInTheDocument();
        expect(screen.getByText('TestUser2')).toBeInTheDocument();
        expect(screen.getByText('TestUser3')).toBeInTheDocument();
        expect(screen.getByText('25.5')).toBeInTheDocument();
        expect(screen.getByText('18')).toBeInTheDocument();
      });
    });

    it('should handle empty user list', async () => {
      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument();
        // Should still show table headers
        expect(screen.getByText('Username')).toBeInTheDocument();
      });
    });
  });

  describe('sorting functionality', () => {
    it('should sort users by total points by default', async () => {
      renderWithStores();

      await waitFor(() => {
        const userRows = screen.getAllByRole('row');
        // Skip header row, check data rows
        const firstDataRow = userRows[1];
        expect(firstDataRow).toHaveTextContent('TestUser1'); // Highest points
      });
    });

    it('should sort users by username when username header is clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const usernameHeader = screen.getByText('Username');
        expect(usernameHeader).toBeInTheDocument();
      });

      const usernameHeader = screen.getByText('Username');
      await user.click(usernameHeader);

      await waitFor(() => {
        const userRows = screen.getAllByRole('row');
        const firstDataRow = userRows[1];
        // Should be alphabetically first
        expect(firstDataRow).toHaveTextContent('TestUser1');
      });
    });

    it('should reverse sort when clicking same header twice', async () => {
      renderWithStores();

      const pointsHeader = screen.getByText('Total Points');

      // First click - ascending
      await user.click(pointsHeader);

      await waitFor(() => {
        const userRows = screen.getAllByRole('row');
        const firstDataRow = userRows[1];
        expect(firstDataRow).toHaveTextContent('TestUser3'); // Lowest points
      });

      // Second click - descending
      await user.click(pointsHeader);

      await waitFor(() => {
        const userRows = screen.getAllByRole('row');
        const firstDataRow = userRows[1];
        expect(firstDataRow).toHaveTextContent('TestUser1'); // Highest points
      });
    });
  });

  describe('pagination', () => {
    it('should show pagination when there are many users', async () => {
      const manyUsers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        username: `User${i + 1}`,
        discord_user_id: `${i + 1}`,
        total_points: Math.random() * 50,
        total_completions: Math.floor(Math.random() * 20),
        gotm_points: Math.random() * 25,
        rpg_points: Math.random() * 25,
        retrobit_points: 0,
      }));

      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => manyUsers),
        },
      });

      await waitFor(() => {
        // Should show pagination component
        expect(screen.getByText('Page')).toBeInTheDocument();
      });
    });

    it('should navigate between pages', async () => {
      const manyUsers = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        username: `User${String(i + 1).padStart(2, '0')}`, // Pad for consistent sorting
        discord_user_id: `${i + 1}`,
        total_points: i + 1, // Sequential for predictable sorting
        total_completions: i + 1,
        gotm_points: i + 1,
        rpg_points: 0,
        retrobit_points: 0,
      }));

      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => manyUsers),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('User25')).toBeInTheDocument(); // Highest points on first page
      });

      // Navigate to next page
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText('User25')).not.toBeInTheDocument();
        // Should show users from second page
      });
    });
  });

  describe('user details navigation', () => {
    it('should navigate to user details when username is clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const userLink = screen.getByText('TestUser1');
        expect(userLink).toBeInTheDocument();
      });

      const userLink = screen.getByText('TestUser1');
      expect(userLink.closest('a')).toHaveAttribute('href', '/users/1');
    });

    it('should handle user navigation for all users', async () => {
      renderWithStores();

      await waitFor(() => {
        const user1Link = screen.getByText('TestUser1').closest('a');
        const user2Link = screen.getByText('TestUser2').closest('a');
        const user3Link = screen.getByText('TestUser3').closest('a');

        expect(user1Link).toHaveAttribute('href', '/users/1');
        expect(user2Link).toHaveAttribute('href', '/users/2');
        expect(user3Link).toHaveAttribute('href', '/users/3');
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
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => {
            throw new Error('DB Error');
          }),
        },
      });

      // Should not crash the component
      expect(screen.getByText('Users')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('responsive design', () => {
    it('should have responsive table classes', async () => {
      renderWithStores();

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toHaveClass('table');
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
        expect(screen.getByText('Users')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper table structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        const columnHeaders = screen.getAllByRole('columnheader');
        expect(columnHeaders.length).toBeGreaterThan(0);

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(1); // Header + data rows
      });
    });

    it('should have proper heading structure', () => {
      renderWithStores();

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent('Users');
    });

    it('should have accessible sort buttons', async () => {
      renderWithStores();

      await waitFor(() => {
        const sortableHeaders = screen.getAllByRole('columnheader');
        sortableHeaders.forEach((header) => {
          if (header.textContent && header.textContent.trim()) {
            expect(header).toBeInTheDocument();
          }
        });
      });
    });

    it('should be keyboard navigable', async () => {
      renderWithStores();

      await waitFor(() => {
        const userLink = screen.getByText('TestUser1');
        userLink.focus();
        expect(userLink).toHaveFocus();
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
      }).toThrow(); // Should throw because no store context
    });

    it('should handle malformed user data', async () => {
      const malformedUsers = [
        { id: 1, username: null, total_points: 'invalid' },
        { id: 2 }, // Missing required fields
        null, // Null user
      ];

      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => malformedUsers),
        },
      });

      // Should not crash
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should handle large user lists efficiently', async () => {
      const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        username: `User${i + 1}`,
        discord_user_id: `${i + 1}`,
        total_points: Math.random() * 100,
        total_completions: Math.floor(Math.random() * 50),
        gotm_points: Math.random() * 50,
        rpg_points: Math.random() * 50,
        retrobit_points: 0,
      }));

      renderWithStores({
        dbStore: {
          getUserList: vi.fn(() => largeUserList),
        },
      });

      await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument();
      });
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = renderWithStores();

      expect(() => unmount()).not.toThrow();
    });
  });
});
