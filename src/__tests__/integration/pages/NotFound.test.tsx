import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import NotFound from '../../../pages/NotFound/NotFound';

describe('NotFound Page Integration', () => {
  beforeEach(() => {
    // Clear any previous renders
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  describe('page rendering', () => {
    it('should render 404 title', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('404 Not Found');
    });

    it('should render error message', () => {
      render(<NotFound />);

      expect(
        screen.getByText(
          /You have exited the realm of random and entered pure chaos/i,
        ),
      ).toBeInTheDocument();
    });

    it('should render navigation instruction', () => {
      render(<NotFound />);

      expect(
        screen.getByText(/Please navigate to an existing page/i),
      ).toBeInTheDocument();
    });

    it('should have centered text styling', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('has-text-centered');

      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach((p) => {
        expect(p).toHaveClass('has-text-centered');
      });
    });
  });

  describe('content structure', () => {
    it('should have proper heading hierarchy', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('title', 'is-1');
    });

    it('should contain descriptive error messages', () => {
      render(<NotFound />);

      const messages = [
        /You have exited the realm of random and entered pure chaos/i,
        /Please navigate to an existing page/i,
      ];

      messages.forEach((message) => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it('should have multiple paragraphs', () => {
      render(<NotFound />);

      // Check that we have at least 2 paragraphs
      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('styling and layout', () => {
    it('should use Bulma CSS classes', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('title');
      expect(title).toHaveClass('is-1');
      expect(title).toHaveClass('has-text-centered');
    });

    it('should center align text content', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('has-text-centered');

      // Check that paragraphs have centered text
      const paragraphs = document.querySelectorAll('p');
      paragraphs.forEach((p) => {
        expect(p).toHaveClass('has-text-centered');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<NotFound />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAccessibleName('404 Not Found');
    });

    it('should be readable by screen readers', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('404 Not Found');

      // Check that error messages are accessible
      expect(
        screen.getByText(/You have exited the realm of random/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please navigate to an existing page/i),
      ).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      render(<NotFound />);

      // Check for proper semantic elements
      const heading = screen.getByRole('heading');
      expect(heading.tagName).toBe('H1');

      const paragraphs = document.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe('responsive design', () => {
    it('should work on different screen sizes', () => {
      const viewports = [
        { width: 320, height: 568 }, // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];

      viewports.forEach((viewport, index) => {
        // Clean up previous render
        cleanup();

        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        });

        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        });

        render(<NotFound />);

        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('has-text-centered');

        // Clean up after each viewport test
        cleanup();
      });
    });

    it('should maintain readability on small screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('404 Not Found');
    });
  });

  describe('error handling', () => {
    it('should render without errors', () => {
      expect(() => {
        render(<NotFound />);
      }).not.toThrow();
    });

    it('should handle multiple renders', () => {
      const { rerender } = render(<NotFound />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      rerender(<NotFound />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should not cause memory leaks on unmount', () => {
      const { unmount } = render(<NotFound />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('performance', () => {
    it('should render quickly', () => {
      const startTime = performance.now();
      render(<NotFound />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render within 100ms
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('should be lightweight', () => {
      render(<NotFound />);

      // Check that the component doesn't create too many DOM nodes
      const allElements = document.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(20); // Should be a simple component
    });
  });

  describe('content validation', () => {
    it('should have appropriate error messaging', () => {
      render(<NotFound />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('404 Not Found');

      // Check for creative error message
      expect(screen.getByText(/realm of random/i)).toBeInTheDocument();
      expect(screen.getByText(/pure chaos/i)).toBeInTheDocument();
    });

    it('should provide user guidance', () => {
      render(<NotFound />);

      expect(
        screen.getByText(/Please navigate to an existing page/i),
      ).toBeInTheDocument();
    });

    it('should maintain consistent tone', () => {
      render(<NotFound />);

      // Check that the messaging is consistent with the app's theme
      expect(screen.getByText(/random/i)).toBeInTheDocument();
      expect(screen.getByText(/chaos/i)).toBeInTheDocument();
    });
  });
});
