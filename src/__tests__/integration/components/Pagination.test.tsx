import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../../../components/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should render with default values', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      expect(screen.getByText('10 / page')).toBeInTheDocument();
      expect(screen.getByText('Previous')).toBeDisabled();
      expect(screen.getByText('Next')).toBeEnabled();
      expect(screen.getByText('1')).toHaveClass('is-current');
    });

    it('should call onPageChange with initial range on mount', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      expect(mockOnPageChange).toHaveBeenCalledWith([0, 10]);
    });

    it('should not render pagination for small counts', () => {
      const { container } = render(
        <Pagination count={5} onPageChange={mockOnPageChange} />,
      );

      // Should render a spacer div instead of pagination
      expect(container.firstChild).toHaveStyle({ minHeight: '45px' });
      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    });
  });

  describe('page navigation', () => {
    it('should navigate to next page', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith([10, 20]);
      expect(screen.getByText('2')).toHaveClass('is-current');
    });

    it('should navigate to previous page', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // Go to page 2 first
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Then go back to page 1
      const prevButton = screen.getByText('Previous');
      await user.click(prevButton);

      expect(mockOnPageChange).toHaveBeenLastCalledWith([0, 10]);
      expect(screen.getByText('1')).toHaveClass('is-current');
    });

    it('should navigate to specific page by clicking page number', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // Click on page 2 (which should be visible initially)
      const page2 = screen.getByText('2');
      await user.click(page2);

      expect(mockOnPageChange).toHaveBeenCalledWith([10, 20]);
      expect(screen.getByText('2')).toHaveClass('is-current');
    });

    it('should disable Previous button on first page', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('should disable Next button on last page', async () => {
      render(<Pagination count={25} onPageChange={mockOnPageChange} />);

      // Navigate to last page (page 3 for 25 items with 10 per page)
      const page3 = screen.getByText('3');
      await user.click(page3);

      expect(screen.getByText('Next')).toBeDisabled();
    });
  });

  describe('page size management', () => {
    it('should open page size dropdown', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const dropdown = screen.getByText('10 / page');
      await user.click(dropdown);

      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should change page size', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // Open dropdown
      const dropdown = screen.getByText('10 / page');
      await user.click(dropdown);

      // Select 20 items per page
      const option20 = screen.getByText('20');
      await user.click(option20);

      await waitFor(() => {
        expect(screen.getByText('20 / page')).toBeInTheDocument();
      });

      expect(mockOnPageChange).toHaveBeenCalledWith([0, 20]);
    });

    it('should reset to first page when page size changes', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // Go to page 2
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);

      // Change page size
      const dropdown = screen.getByText('10 / page');
      await user.click(dropdown);
      const option20 = screen.getByText('20');
      await user.click(option20);

      // Should be back on page 1
      await waitFor(() => {
        expect(screen.getByText('1')).toHaveClass('is-current');
      });
    });

    it('should close dropdown on blur', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const dropdown = screen.getByText('10 / page');
      await user.click(dropdown);

      expect(screen.getByText('20')).toBeInTheDocument();

      // Click outside or blur
      fireEvent.blur(dropdown);

      await waitFor(
        () => {
          expect(screen.queryByText('20')).not.toBeInTheDocument();
        },
        { timeout: 500 }, // Increased timeout to account for the 100ms delay in component
      );
    });
  });

  describe('page calculation', () => {
    it('should calculate correct page count', () => {
      render(<Pagination count={95} onPageChange={mockOnPageChange} />);

      // 95 items with 10 per page = 10 pages
      // Look for page 10 specifically in the pagination links
      const lastPageLink = screen.getByRole('link', { name: '10' });
      expect(lastPageLink).toBeInTheDocument();
    });

    it('should handle exact page divisions', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // 100 items with 10 per page = exactly 10 pages
      const lastPageLink = screen.getByRole('link', { name: '10' });
      expect(lastPageLink).toBeInTheDocument();
    });

    it('should update page count when count changes', () => {
      const { rerender } = render(
        <Pagination count={50} onPageChange={mockOnPageChange} />,
      );

      expect(screen.getByRole('link', { name: '5' })).toBeInTheDocument();

      rerender(<Pagination count={100} onPageChange={mockOnPageChange} />);

      expect(screen.getByRole('link', { name: '10' })).toBeInTheDocument();
    });
  });

  describe('ellipsis behavior', () => {
    it('should show ellipsis for large page counts', () => {
      render(<Pagination count={1000} onPageChange={mockOnPageChange} />);

      // Should show ellipsis between first pages and last page
      const ellipsis = screen.getAllByText('…');
      expect(ellipsis.length).toBeGreaterThan(0);
    });

    it('should not show ellipsis for small page counts', () => {
      render(<Pagination count={50} onPageChange={mockOnPageChange} />);

      // With only 5 pages, no ellipsis should be shown
      expect(screen.queryByText('…')).not.toBeInTheDocument();
    });

    it('should show correct pages around current page', async () => {
      render(<Pagination count={1000} onPageChange={mockOnPageChange} />);

      // Navigate to a middle page that should be visible (like page 2)
      const page2 = screen.getByText('2');
      await user.click(page2);

      // Should show current page and adjacent pages
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'pagination');
    });

    it('should have proper button roles', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const prevButton = screen.getByText('Previous');
      const nextButton = screen.getByText('Next');

      expect(prevButton).toHaveAttribute(
        'class',
        expect.stringContaining('button'),
      );
      expect(nextButton).toHaveAttribute(
        'class',
        expect.stringContaining('button'),
      );
    });

    it('should indicate current page for screen readers', () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      const currentPage = screen.getByText('1');
      expect(currentPage).toHaveClass('is-current');
    });
  });

  describe('edge cases', () => {
    it('should handle zero count', () => {
      const { container } = render(
        <Pagination count={0} onPageChange={mockOnPageChange} />,
      );

      // Should render spacer for zero items
      expect(container.firstChild).toHaveStyle({ minHeight: '45px' });
    });

    it('should handle single item', () => {
      const { container } = render(
        <Pagination count={1} onPageChange={mockOnPageChange} />,
      );

      // Should render spacer for single item
      expect(container.firstChild).toHaveStyle({ minHeight: '45px' });
    });

    it('should handle very large counts', () => {
      render(<Pagination count={10000} onPageChange={mockOnPageChange} />);

      // Should still render properly
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('1')).toHaveClass('is-current');
    });

    it('should handle rapid page changes', async () => {
      render(<Pagination count={100} onPageChange={mockOnPageChange} />);

      // Rapidly click next multiple times
      const nextButton = screen.getByText('Next');
      await user.click(nextButton);
      await user.click(nextButton);
      await user.click(nextButton);

      // Should end up on page 4
      expect(screen.getByText('4')).toHaveClass('is-current');
      expect(mockOnPageChange).toHaveBeenLastCalledWith([30, 40]);
    });
  });

  describe('props validation', () => {
    it('should handle showNextPreviousButtons=false', () => {
      render(
        <Pagination
          count={100}
          onPageChange={mockOnPageChange}
          showNextPreviousButtons={false}
        />,
      );

      expect(screen.queryByText('Previous')).not.toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('should still show page numbers without next/prev buttons', async () => {
      render(
        <Pagination
          count={100}
          onPageChange={mockOnPageChange}
          showNextPreviousButtons={false}
        />,
      );

      const page2 = screen.getByText('2');
      await user.click(page2);

      expect(mockOnPageChange).toHaveBeenCalledWith([10, 20]);
      expect(screen.getByText('2')).toHaveClass('is-current');
    });
  });
});
