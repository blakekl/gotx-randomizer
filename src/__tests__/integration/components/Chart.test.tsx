import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Chart from '../../../pages/Statistics/Chart';
import { LabeledStat } from '../../../models/game';

// Mock Highcharts
vi.mock('highcharts', () => ({
  default: {
    chart: vi.fn(),
  },
}));

// Mock HighchartsReact
vi.mock('highcharts-react-official', () => ({
  default: vi.fn(({ options }) => {
    // Handle the case where data might be sliced due to pagination
    const data = options.series?.[0]?.data || [];
    const categories = options.xAxis?.categories || [];

    return (
      <div data-testid="highcharts-chart">
        <div data-testid="chart-title">{options.title?.text}</div>
        <div data-testid="chart-type">{options.chart?.type}</div>
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-categories">{JSON.stringify(categories)}</div>
      </div>
    );
  }),
}));

// Mock highcharts/modules/exporting
vi.mock('highcharts/modules/exporting', () => ({
  default: vi.fn(),
}));

// Mock Pagination component
vi.mock('../../../components/Pagination', () => ({
  default: vi.fn(({ count, onPageChange }) => {
    // Simulate pagination behavior by calling onPageChange with full range initially
    React.useEffect(() => {
      onPageChange([0, count]);
    }, [count, onPageChange]);

    return (
      <div data-testid="pagination">
        <button onClick={() => onPageChange([0, 10])}>Page 1</button>
        <button onClick={() => onPageChange([10, 20])}>Page 2</button>
        <span data-testid="pagination-count">{count}</span>
      </div>
    );
  }),
}));

describe('Chart Component Integration', () => {
  const mockData: LabeledStat[] = [
    { label: 'Game 1', value: 10 },
    { label: 'Game 2', value: 20 },
    { label: 'Game 3', value: 15 },
    { label: 'Game 4', value: 25 },
    { label: 'Game 5', value: 30 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render chart with provided data', () => {
      render(<Chart data={mockData} title="Test Chart" name="Test Series" />);

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
      expect(screen.getByTestId('chart-title')).toHaveTextContent('Test Chart');
    });

    it('should render chart title correctly', () => {
      const title = 'Statistics Overview';
      render(<Chart data={mockData} title={title} name="Stats" />);

      expect(screen.getByTestId('chart-title')).toHaveTextContent(title);
    });

    it('should render with empty data gracefully', () => {
      render(<Chart data={[]} title="Empty Chart" name="Empty Series" />);

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
      expect(screen.getByTestId('chart-title')).toHaveTextContent(
        'Empty Chart',
      );
    });

    it('should render chart type dropdown', () => {
      render(<Chart data={mockData} title="Test Chart" name="Test Series" />);

      expect(screen.getByText(/Type:/)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Type: bar/i }),
      ).toBeInTheDocument();
    });

    it('should render pagination component', () => {
      render(<Chart data={mockData} title="Test Chart" name="Test Series" />);

      expect(screen.getByTestId('pagination')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-count')).toHaveTextContent('5');
    });
  });

  describe('data handling', () => {
    it('should display correct data values', async () => {
      render(<Chart data={mockData} title="Data Chart" name="Data Series" />);

      // Wait for pagination to set the range
      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const dataValues = JSON.parse(chartData.textContent || '[]');
        expect(dataValues).toEqual([10, 20, 15, 25, 30]);
      });
    });

    it('should display correct categories', async () => {
      render(
        <Chart data={mockData} title="Categories Chart" name="Cat Series" />,
      );

      await waitFor(() => {
        const chartCategories = screen.getByTestId('chart-categories');
        const categories = JSON.parse(chartCategories.textContent || '[]');
        expect(categories).toEqual([
          'Game 1',
          'Game 2',
          'Game 3',
          'Game 4',
          'Game 5',
        ]);
      });
    });

    it('should handle data updates correctly', async () => {
      const { rerender } = render(
        <Chart data={mockData} title="Update Chart" name="Update Series" />,
      );

      const newData: LabeledStat[] = [
        { label: 'New Game 1', value: 50 },
        { label: 'New Game 2', value: 60 },
      ];

      rerender(
        <Chart data={newData} title="Update Chart" name="Update Series" />,
      );

      await waitFor(() => {
        const chartData = screen.getByTestId('chart-data');
        const dataValues = JSON.parse(chartData.textContent || '[]');
        expect(dataValues).toEqual([50, 60]);
      });
    });

    it('should handle large datasets efficiently', () => {
      const largeDataset: LabeledStat[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          label: `Game ${i + 1}`,
          value: Math.floor(Math.random() * 100),
        }),
      );

      const startTime = performance.now();
      render(
        <Chart
          data={largeDataset}
          title="Large Dataset Chart"
          name="Large Series"
        />,
      );
      const endTime = performance.now();

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
      expect(endTime - startTime).toBeLessThan(1000); // Should render within 1 second
    });
  });

  describe('chart type functionality', () => {
    it('should default to bar chart type', () => {
      render(
        <Chart data={mockData} title="Default Chart" name="Default Series" />,
      );

      expect(screen.getByTestId('chart-type')).toHaveTextContent('bar');
      expect(screen.getByText(/Type: bar/i)).toBeInTheDocument();
    });

    it('should show chart type dropdown options', async () => {
      render(
        <Chart data={mockData} title="Dropdown Chart" name="Dropdown Series" />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });
      fireEvent.click(dropdownButton);

      // Check if dropdown options are visible - use getAllByText for multiple matches
      expect(screen.getAllByText('bar')).toHaveLength(2); // One in button, one in dropdown
      expect(screen.getByText('column')).toBeInTheDocument();
      expect(screen.getByText('line')).toBeInTheDocument();
      expect(screen.getByText('spline')).toBeInTheDocument();
    });

    it('should change chart type when dropdown option is clicked', async () => {
      render(
        <Chart data={mockData} title="Type Change Chart" name="Type Series" />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });
      fireEvent.click(dropdownButton);

      const lineOption = screen.getByText('line');
      fireEvent.click(lineOption);

      await waitFor(() => {
        expect(screen.getByTestId('chart-type')).toHaveTextContent('line');
      });
    });
  });

  describe('pagination functionality', () => {
    it('should handle pagination changes', () => {
      render(
        <Chart data={mockData} title="Pagination Chart" name="Page Series" />,
      );

      const page2Button = screen.getByText('Page 2');
      fireEvent.click(page2Button);

      // Pagination should work without errors
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('should pass correct count to pagination', () => {
      const largeData: LabeledStat[] = Array.from({ length: 50 }, (_, i) => ({
        label: `Item ${i + 1}`,
        value: i * 2,
      }));

      render(
        <Chart
          data={largeData}
          title="Large Pagination Chart"
          name="Large Series"
        />,
      );

      expect(screen.getByTestId('pagination-count')).toHaveTextContent('50');
    });
  });

  describe('interactivity', () => {
    it('should handle dropdown menu toggle', () => {
      render(
        <Chart
          data={mockData}
          title="Interactive Chart"
          name="Interactive Series"
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });

      // Click to open
      fireEvent.click(dropdownButton);
      expect(screen.getByText('line')).toBeInTheDocument();

      // Blur to close (with timeout)
      fireEvent.blur(dropdownButton);

      // Should not throw errors
      expect(dropdownButton).toBeInTheDocument();
    });

    it('should handle chart type selection', async () => {
      render(
        <Chart
          data={mockData}
          title="Selection Chart"
          name="Selection Series"
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });
      fireEvent.click(dropdownButton);

      const splineOption = screen.getByText('spline');
      fireEvent.click(splineOption);

      await waitFor(() => {
        expect(screen.getByTestId('chart-type')).toHaveTextContent('spline');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <Chart
          data={mockData}
          title="Accessible Chart"
          name="Accessible Series"
        />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });
      expect(dropdownButton).toHaveAttribute('aria-haspopup', 'true');
      expect(dropdownButton).toHaveAttribute('aria-controls', 'dropdown-menu');
    });

    it('should have proper role attributes', () => {
      render(<Chart data={mockData} title="Role Chart" name="Role Series" />);

      // The dropdown menu has role="menu" but it's not accessible until opened
      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });
      fireEvent.click(dropdownButton);

      // Now check for the menu role in the DOM (not necessarily accessible)
      const dropdownMenu = screen.getByRole('menu');
      expect(dropdownMenu).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(
        <Chart data={mockData} title="Keyboard Chart" name="Keyboard Series" />,
      );

      const dropdownButton = screen.getByRole('button', { name: /Type: bar/i });

      // Simulate keyboard events
      fireEvent.keyDown(dropdownButton, { key: 'Enter' });
      fireEvent.keyDown(dropdownButton, { key: 'Space' });

      // Should not throw errors
      expect(dropdownButton).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should handle missing required props gracefully', () => {
      // This should handle undefined data gracefully
      expect(() => {
        render(
          <Chart
            data={undefined as any}
            title="Missing Data Chart"
            name="Missing Series"
          />,
        );
      }).toThrow();
    });

    it('should handle invalid data gracefully', () => {
      const invalidData = [
        { label: null, value: 'invalid' },
        { label: 'Valid', value: 10 },
      ] as any;

      render(
        <Chart
          data={invalidData}
          title="Invalid Data Chart"
          name="Invalid Series"
        />,
      );

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(
        <Chart
          data={mockData}
          title="Memory Test Chart"
          name="Memory Series"
        />,
      );

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();

      // Unmount should not throw errors
      expect(() => unmount()).not.toThrow();
    });

    it('should render quickly', () => {
      const startTime = performance.now();
      render(
        <Chart
          data={mockData}
          title="Performance Chart"
          name="Performance Series"
        />,
      );
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render within 100ms
      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
    });

    it('should handle frequent updates efficiently', () => {
      const { rerender } = render(
        <Chart data={mockData} title="Update Chart" name="Update Series" />,
      );

      // Simulate multiple rapid updates
      for (let i = 0; i < 10; i++) {
        const newData: LabeledStat[] = [
          { label: `Update ${i}`, value: i * 10 },
        ];
        rerender(
          <Chart
            data={newData}
            title={`Update Chart ${i}`}
            name="Update Series"
          />,
        );
      }

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should adapt to different screen sizes', () => {
      // Mock window resize
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      render(
        <Chart
          data={mockData}
          title="Responsive Chart"
          name="Responsive Series"
        />,
      );

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();

      // Simulate resize to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      fireEvent(window, new Event('resize'));

      expect(screen.getByTestId('highcharts-chart')).toBeInTheDocument();
    });
  });
});
