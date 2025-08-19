import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../../../Navigation';

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries = ['/'],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe('Navigation Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('navigation links', () => {
    it('should render all navigation links', () => {
      renderWithRouter(<Navigation />);

      expect(
        screen.getByRole('link', { name: /randomizer/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /games/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /users/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /statistics/i }),
      ).toBeInTheDocument();
    });

    it('should have correct href attributes', () => {
      renderWithRouter(<Navigation />);

      expect(screen.getByRole('link', { name: /randomizer/i })).toHaveAttribute(
        'href',
        '/',
      );
      expect(screen.getByRole('link', { name: /games/i })).toHaveAttribute(
        'href',
        '/games',
      );
      expect(screen.getByRole('link', { name: /users/i })).toHaveAttribute(
        'href',
        '/users',
      );
      expect(screen.getByRole('link', { name: /statistics/i })).toHaveAttribute(
        'href',
        '/stats',
      );
    });
  });

  describe('active link highlighting', () => {
    it('should not implement active link highlighting (feature not implemented)', () => {
      renderWithRouter(<Navigation />, ['/']);

      const randomizerLink = screen.getByRole('link', { name: /randomizer/i });
      // The Navigation component doesn't implement active link highlighting
      expect(randomizerLink).not.toHaveClass('is-active');
      expect(randomizerLink).toHaveClass('navbar-item');
    });

    it('should have consistent styling for all links', () => {
      renderWithRouter(<Navigation />, ['/games']);

      const gamesLink = screen.getByRole('link', { name: /games/i });
      const randomizerLink = screen.getByRole('link', { name: /randomizer/i });

      // All links should have the same navbar-item class
      expect(gamesLink).toHaveClass('navbar-item');
      expect(randomizerLink).toHaveClass('navbar-item');

      // No active state implemented
      expect(gamesLink).not.toHaveClass('is-active');
      expect(randomizerLink).not.toHaveClass('is-active');
    });
  });

  describe('accessibility', () => {
    it('should have proper navigation role', () => {
      renderWithRouter(<Navigation />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      renderWithRouter(<Navigation />);

      const randomizerLink = screen.getByRole('link', { name: /randomizer/i });

      randomizerLink.focus();
      expect(randomizerLink).toHaveFocus();
    });
  });

  describe('error handling', () => {
    it('should handle invalid routes gracefully', () => {
      renderWithRouter(<Navigation />, ['/invalid-route']);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
