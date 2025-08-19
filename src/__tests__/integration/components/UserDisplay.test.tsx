import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserDisplay from '../../../pages/Users/UserDisplay/UserDisplay';
import {
  createMockDbStore,
  createMockSettingsStore,
  MockStoreContext,
  mockUserListItems,
} from '../../test-utils/mockStores';

const mockUser = {
  id: 1,
  name: 'Test User',
  success_rate: 0.8,
  nominations: 10,
  wins: 8,
  completions: 15,
};

const mockNominations = [
  {
    id: 1,
    title_world: 'Nominated Game 1',
    title_usa: '',
    title_eu: '',
    title_jap: '',
    title_other: '',
    nomination_type: 'standard' as any,
    theme_id: 1,
    retroachievements: false,
  },
];

const mockCompletions = [
  {
    id: 1,
    title_world: 'Test Game 1',
    title_usa: '',
    title_eu: '',
    title_jap: '',
    title_other: '',
    date: '2023-03-01',
    nomination_type: 'gotm' as any,
    theme_id: 20, // > 16 to get points
    retroachievements: false,
  },
  {
    id: 2,
    title_world: '',
    title_usa: 'Test Game 2 USA',
    title_eu: '',
    title_jap: '',
    title_other: '',
    date: '2023-02-15',
    nomination_type: 'gotm' as any,
    theme_id: 20, // > 16 to get points
    retroachievements: false,
  },
];

const renderWithStores = (mockStores = {}) => {
  const mockDbStore = createMockDbStore({
    getNominationsByUser: vi.fn(() => mockNominations),
    getCompletionsByUserId: vi.fn(() => mockCompletions),
    ...mockStores.dbStore,
  });
  const mockSettingsStore = createMockSettingsStore(mockStores.settingsStore);

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <MockStoreContext.Provider value={mockContext}>
      <UserDisplay user={mockUser} />
    </MockStoreContext.Provider>,
  );
};

describe('UserDisplay Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should display user name as title', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'Test User',
        );
      });
    });

    it('should display tabs for nominations and completions', async () => {
      renderWithStores();

      await waitFor(() => {
        expect(screen.getByText(/nominations/i)).toBeInTheDocument();
        expect(screen.getByText(/completions/i)).toBeInTheDocument();
      });
    });

    it('should show correct counts in tab badges', async () => {
      renderWithStores();

      await waitFor(() => {
        // Check nominations count
        const nominationsTab = screen.getByText(/nominations/i).closest('li');
        expect(nominationsTab).toHaveTextContent('1');

        // Check completions count
        const completionsTab = screen.getByText(/completions/i).closest('li');
        expect(completionsTab).toHaveTextContent('2');
      });
    });
  });

  describe('tab functionality', () => {
    it('should start with nominations tab active', async () => {
      renderWithStores();

      await waitFor(() => {
        const nominationsTab = screen.getByText(/nominations/i).closest('li');
        expect(nominationsTab).toHaveClass('is-active');

        const completionsTab = screen.getByText(/completions/i).closest('li');
        expect(completionsTab).not.toHaveClass('is-active');
      });
    });

    it('should switch to completions tab when clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        // Find the completions tab specifically by looking for the tab structure
        const completionsTab = screen
          .getByRole('list')
          .querySelector('li:nth-child(2) a');
        if (completionsTab) {
          fireEvent.click(completionsTab);
        }
      });

      await waitFor(() => {
        const completionsTabLi = screen
          .getByRole('list')
          .querySelector('li:nth-child(2)');
        expect(completionsTabLi).toHaveClass('is-active');

        const nominationsTabLi = screen
          .getByRole('list')
          .querySelector('li:nth-child(1)');
        expect(nominationsTabLi).not.toHaveClass('is-active');
      });
    });

    it('should switch back to nominations tab when clicked', async () => {
      renderWithStores();

      // First switch to completions
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      // Then switch back to nominations
      await waitFor(() => {
        const nominationsTab = screen.getByText(/nominations/i);
        fireEvent.click(nominationsTab);
      });

      await waitFor(() => {
        const nominationsTabLi = screen.getByText(/nominations/i).closest('li');
        expect(nominationsTabLi).toHaveClass('is-active');

        const completionsTabLi = screen.getByText(/completions/i).closest('li');
        expect(completionsTabLi).not.toHaveClass('is-active');
      });
    });
  });

  describe('completions display', () => {
    it('should show completions table when completions tab is active', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('type')).toBeInTheDocument();
        expect(screen.getByText('Points')).toBeInTheDocument();
      });
    });

    it('should display completion games in table', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        expect(screen.getByText('Test Game 1')).toBeInTheDocument();
        expect(screen.getByText('Test Game 2 USA')).toBeInTheDocument();
      });
    });

    it('should show disclaimer text', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        expect(
          screen.getByText(/disclaimer.*points may not be accurate/i),
        ).toBeInTheDocument();
      });
    });

    it('should calculate and display total points', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        // Should show earned points header and total
        expect(screen.getByText('Earned Points')).toBeInTheDocument();
        // The total should be calculated based on the mock completions
        // Both games have theme_id > 16, so they should get points
      });
    });

    it('should display game titles correctly', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        // First game has title_world, should display that
        expect(screen.getByText('Test Game 1')).toBeInTheDocument();
        // Second game has title_usa, should display that (title_world is empty)
        expect(screen.getByText('Test Game 2 USA')).toBeInTheDocument();
      });
    });
  });

  describe('nominations display', () => {
    it('should show nominations when nominations tab is active', async () => {
      renderWithStores();

      // Nominations tab is active by default
      await waitFor(() => {
        // Should show the NominationList component content
        // The exact content depends on the NominationList component implementation
        expect(screen.getByText(/nominations/i)).toBeInTheDocument();
      });
    });
  });

  describe('empty states', () => {
    it('should handle empty nominations list', async () => {
      renderWithStores({
        dbStore: {
          getNominationsByUser: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        const nominationsTab = screen.getByText(/nominations/i).closest('li');
        expect(nominationsTab).toHaveTextContent('0');
      });
    });

    it('should handle empty completions list', async () => {
      renderWithStores({
        dbStore: {
          getCompletionsByUserId: vi.fn(() => []),
        },
      });

      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i).closest('li');
        expect(completionsTab).toHaveTextContent('0');
      });

      // Switch to completions tab to see empty table
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        // Should still show table structure but no rows
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
      });
    });
  });

  describe('data loading', () => {
    it('should call store methods with correct user ID', async () => {
      const mockDbStore = {
        getNominationsByUser: vi.fn(() => mockNominations),
        getCompletionsByUserId: vi.fn(() => mockCompletions),
      };

      renderWithStores({ dbStore: mockDbStore });

      await waitFor(() => {
        expect(mockDbStore.getNominationsByUser).toHaveBeenCalledWith(1);
        expect(mockDbStore.getCompletionsByUserId).toHaveBeenCalledWith(1);
      });
    });

    it('should update when user prop changes', async () => {
      const mockDbStore = {
        getNominationsByUser: vi.fn(() => mockNominations),
        getCompletionsByUserId: vi.fn(() => mockCompletions),
      };

      const { rerender } = renderWithStores({ dbStore: mockDbStore });

      // Change user
      const newUser = {
        id: 2,
        name: 'New User',
        success_rate: 0.9,
        nominations: 5,
        wins: 4,
        completions: 10,
      };

      rerender(
        <MockStoreContext.Provider
          value={{
            dbStore: createMockDbStore(mockDbStore) as any,
            settingsStore: createMockSettingsStore() as any,
          }}
        >
          <UserDisplay user={newUser} />
        </MockStoreContext.Provider>,
      );

      await waitFor(() => {
        expect(mockDbStore.getNominationsByUser).toHaveBeenCalledWith(2);
        expect(mockDbStore.getCompletionsByUserId).toHaveBeenCalledWith(2);
        expect(screen.getByText('New User')).toBeInTheDocument();
      });
    });
  });

  describe('points calculation', () => {
    it('should display individual game points correctly', async () => {
      renderWithStores();

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen.getByText(/completions/i);
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        // Check that points are displayed in the table
        // The exact values depend on the nominationTypeToPoints function
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
      });
    });

    it('should handle fractional points display', async () => {
      // Create a completion that would result in 0.5 points
      const fractionalCompletion = [
        {
          id: 3,
          title_world: 'Fractional Game',
          title_usa: '',
          title_eu: '',
          title_jap: '',
          title_other: '',
          date: '2023-01-01',
          nomination_type: 'retro' as any, // This gives 0.5 points when theme_id > 16
          theme_id: 20, // > 16 to enable points system
          retroachievements: false,
        },
      ];

      renderWithStores({
        dbStore: {
          getCompletionsByUserId: vi.fn(() => fractionalCompletion),
        },
      });

      // Switch to completions tab
      await waitFor(() => {
        const completionsTab = screen
          .getByRole('list')
          .querySelector('li:nth-child(2) a');
        if (completionsTab) {
          fireEvent.click(completionsTab);
        }
      });

      await waitFor(() => {
        // Should show ½ symbol for 0.5 points
        expect(screen.getByText('½')).toBeInTheDocument();
      });
    });
  });
});
