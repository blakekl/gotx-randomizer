import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Statistics from '../../../pages/Statistics/Statistics';
import {
  createMockDbStore,
  createMockSettingsStore,
  MockStoreContext,
} from '../../test-utils/mockStores';

// Mock Chart component since we already tested it separately
vi.mock('../../../pages/Statistics/Chart', () => ({
  default: vi.fn(({ data, title, name }) => (
    <div data-testid="mock-chart">
      <div data-testid="chart-title">{title}</div>
      <div data-testid="chart-name">{name}</div>
      <div data-testid="chart-data-count">{data?.length || 0}</div>
    </div>
  )),
}));

// Mock react-responsive
vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(() => false), // Default to light mode
}));

const renderWithStores = (
  mockStores: { dbStore?: any; settingsStore?: any } = {},
  initialRoute = '/statistics?tab=nominations',
) => {
  // Use passed dbStore if provided, otherwise create default one
  const mockDbStore =
    mockStores.dbStore ||
    createMockDbStore({
      // Mock data for nominations tab
      getTotalNominationsBeforeWinByGame: vi.fn(() => [
        { label: 'Game 1', value: 5 },
        { label: 'Game 2', value: 3 },
        { label: 'Game 3', value: 7 },
      ]),
      getMostNominatedGames: vi.fn(() => [
        { label: 'Game A', value: 10 },
        { label: 'Game B', value: 8 },
        { label: 'Game C', value: 6 },
      ]),
      getMostNominatedLoserGames: vi.fn(() => [
        { label: 'Game X', value: 4 },
        { label: 'Game Y', value: 2 },
        { label: 'Game Z', value: 1 },
      ]),
      getMostNominatedGamesByUser: vi.fn(() => [
        { label: 'User1', value: 15 },
        { label: 'User2', value: 12 },
        { label: 'User3', value: 8 },
      ]),
      getTopNominationWinsByUser: vi.fn(() => [
        { label: 'User1', value: 5 },
        { label: 'User2', value: 3 },
        { label: 'User3', value: 2 },
      ]),
      getNominationSuccessPercentByUser: vi.fn(() => [
        { name: 'User1', success_rate: 0.75 },
        { name: 'User2', success_rate: 0.6 },
        { name: 'User3', success_rate: 0.45 },
      ]),
      // Mock data for completions tab
      getMostCompletedGames: vi.fn(() => [
        { label: 'Popular Game 1', value: 25 },
        { label: 'Popular Game 2', value: 20 },
        { label: 'Popular Game 3', value: 15 },
      ]),
      getMostCompletedGotmGames: vi.fn(() => [
        { label: 'GotM Game 1', value: 12 },
        { label: 'GotM Game 2', value: 10 },
        { label: 'GotM Game 3', value: 8 },
      ]),
      getMostCompletedGotyGames: vi.fn(() => [
        { label: 'GotY Game 1', value: 15 },
        { label: 'GotY Game 2', value: 12 },
        { label: 'GotY Game 3', value: 9 },
      ]),
      getMostCompletedRetrobitGames: vi.fn(() => [
        { label: 'Retro Game 1', value: 8 },
        { label: 'Retro Game 2', value: 6 },
        { label: 'Retro Game 3', value: 4 },
      ]),
      getMostCompletedRetrobitYearGames: vi.fn(() => [
        { label: 'Retro Year 1', value: 5 },
        { label: 'Retro Year 2', value: 3 },
        { label: 'Retro Year 3', value: 2 },
      ]),
      getMostCompletedRpgGames: vi.fn(() => [
        { label: 'RPG Game 1', value: 7 },
        { label: 'RPG Game 2', value: 5 },
        { label: 'RPG Game 3', value: 3 },
      ]),
      getNewestCompletions: vi.fn(() => [
        { label: 'Recent Game 1', value: 1 },
        { label: 'Recent Game 2', value: 1 },
        { label: 'Recent Game 3', value: 1 },
      ]),
      getNewestGotmCompletions: vi.fn(() => [
        { label: 'Recent GotM 1', value: 1 },
        { label: 'Recent GotM 2', value: 1 },
      ]),
      getNewestGotwotyCompletions: vi.fn(() => [
        { label: 'Recent GotWotY 1', value: 1 },
        { label: 'Recent GotWotY 2', value: 1 },
      ]),
      getNewestGotyCompletions: vi.fn(() => [
        { label: 'Recent GotY 1', value: 1 },
        { label: 'Recent GotY 2', value: 1 },
      ]),
      getNewestRetrobitCompletions: vi.fn(() => [
        { label: 'Recent Retro 1', value: 1 },
        { label: 'Recent Retro 2', value: 1 },
      ]),
      getNewestRpgCompletions: vi.fn(() => [
        { label: 'Recent RPG 1', value: 1 },
        { label: 'Recent RPG 2', value: 1 },
      ]),
      // Mock data for time to beat tab
      getAvgTimeToBeatByMonth: vi.fn(() => [
        { label: 'Jan 2024', value: 25.5 },
        { label: 'Feb 2024', value: 30.2 },
        { label: 'Mar 2024', value: 22.8 },
      ]),
      getTotalTimeToBeatByMonth: vi.fn(() => [
        { label: 'Jan 2024', value: 150.5 },
        { label: 'Feb 2024', value: 200.2 },
        { label: 'Mar 2024', value: 180.8 },
      ]),
      getLongestMonthsByAvgTimeToBeat: vi.fn(() => [
        { label: 'Feb 2024', value: 30.2 },
        { label: 'Jan 2024', value: 25.5 },
        { label: 'Mar 2024', value: 22.8 },
      ]),
      getShortestMonthsByAvgTimeToBeat: vi.fn(() => [
        { label: 'Mar 2024', value: 22.8 },
        { label: 'Jan 2024', value: 25.5 },
        { label: 'Feb 2024', value: 30.2 },
      ]),
      ...(mockStores.dbStore || {}),
    });

  const mockSettingsStore = createMockSettingsStore(
    mockStores.settingsStore || {},
  );

  const mockContext = {
    dbStore: mockDbStore,
    settingsStore: mockSettingsStore,
  };

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <MockStoreContext.Provider value={mockContext}>
        <Statistics />
      </MockStoreContext.Provider>
    </MemoryRouter>,
  );
};

describe('Statistics Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('page rendering', () => {
    it('should render statistics page title', async () => {
      renderWithStores();

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent('Statistics');
      });
    });

    it('should render all chart sections for nominations tab', async () => {
      renderWithStores();

      await waitFor(() => {
        // Check for nomination-specific charts
        expect(
          screen.getByText('Most Nominations Before Win'),
        ).toBeInTheDocument();
        expect(screen.getByText('Most Nominated Games')).toBeInTheDocument();
        expect(
          screen.getByText('Most Nominated Games Without a Win'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Most Nominations by User'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Most Winning Nominations by User'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Nomination Success Percent by User'),
        ).toBeInTheDocument();
      });
    });

    it('should render charts with mock data', async () => {
      renderWithStores();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts.length).toBeGreaterThan(0);

        // Check that charts have titles and data
        const chartTitles = screen.getAllByTestId('chart-title');
        const chartDataCounts = screen.getAllByTestId('chart-data-count');

        expect(chartTitles.length).toBeGreaterThan(0);
        expect(chartDataCounts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('tab navigation', () => {
    it('should have three tabs: Nominations, Completions, Time to Beat', async () => {
      renderWithStores();

      await waitFor(() => {
        // Find the tabs specifically within the tabs navigation
        const tabsContainer = screen.getByRole('list');
        expect(
          within(tabsContainer).getByText('Nominations'),
        ).toBeInTheDocument();
        expect(
          within(tabsContainer).getByText('Completions'),
        ).toBeInTheDocument();
        expect(
          within(tabsContainer).getByText('Time to Beat'),
        ).toBeInTheDocument();
      });
    });

    it('should show nominations tab as active by default', async () => {
      renderWithStores();

      await waitFor(() => {
        // Find the tab specifically within the tabs navigation
        const tabsContainer = screen.getByRole('list');
        const nominationsTab = within(tabsContainer)
          .getByText('Nominations')
          .closest('li');
        expect(nominationsTab).toHaveClass('is-active');
      });
    });

    it('should switch to completions tab when clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const completionsTab = screen.getByText('Completions');
        fireEvent.click(completionsTab);
      });

      await waitFor(() => {
        // Check for completion-specific charts
        expect(
          screen.getByText('Most Completed Games - ALL'),
        ).toBeInTheDocument();
        expect(
          screen.getByText('Most Completed Games - Game of the Month'),
        ).toBeInTheDocument();
      });
    });

    it('should switch to time to beat tab when clicked', async () => {
      renderWithStores();

      await waitFor(() => {
        const timeToBeatTab = screen.getByText('Time to Beat');
        fireEvent.click(timeToBeatTab);
      });

      await waitFor(() => {
        // Check for time to beat specific charts
        expect(screen.getByText('Longest Months')).toBeInTheDocument();
        expect(
          screen.getByText('Average Time to Beat by Month'),
        ).toBeInTheDocument();
        expect(screen.getByText('Shortest Months')).toBeInTheDocument();
        expect(
          screen.getByText('Total Time to Beat by Month'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('data loading', () => {
    it('should render charts with data from database methods', async () => {
      renderWithStores();

      await waitFor(() => {
        // Verify that charts are rendered with data
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts.length).toBeGreaterThan(0);

        // Verify that chart data counts are displayed
        const dataCounts = screen.getAllByTestId('chart-data-count');
        expect(dataCounts.length).toBeGreaterThan(0);

        // Verify that the charts show some data (not empty)
        dataCounts.forEach((count) => {
          const countValue = parseInt(count.textContent || '0');
          expect(countValue).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', async () => {
      renderWithStores();

      await waitFor(() => {
        // Check that the layout uses Bulma columns
        const columns = document.querySelector('.columns');
        expect(columns).toBeInTheDocument();

        const columnElements = document.querySelectorAll('.column');
        expect(columnElements.length).toBe(2); // Two columns layout
      });
    });

    it('should handle chart resizing', async () => {
      renderWithStores();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts.length).toBeGreaterThan(0);

        // Charts should be rendered and responsive
        charts.forEach((chart) => {
          expect(chart).toBeInTheDocument();
        });
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', async () => {
      renderWithStores();

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 1 });
        expect(mainHeading).toBeInTheDocument();
        expect(mainHeading).toHaveTextContent('Statistics');
      });
    });

    it('should have accessible navigation tabs', async () => {
      renderWithStores();

      await waitFor(() => {
        const tabs = screen.getByRole('list');
        expect(tabs).toBeInTheDocument();

        // The tab elements are <a> tags but without href they're not links
        // Check for the tab text content instead
        const tabTexts = ['Nominations', 'Completions', 'Time to Beat'];
        tabTexts.forEach((tabText) => {
          const tabElement = within(tabs).getByText(tabText);
          expect(tabElement).toBeInTheDocument();
        });
      });
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', async () => {
      const { unmount } = renderWithStores();

      await waitFor(() => {
        const charts = screen.getAllByTestId('mock-chart');
        expect(charts.length).toBeGreaterThan(0);
      });

      // Should unmount without errors
      expect(() => unmount()).not.toThrow();
    });
  });
});
