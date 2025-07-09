import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Navigation from '../../../components/Navigation';

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries = ['/'],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe('Navigation Component Integration', () => {
  const user = userEvent.setup();

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
    it('should highlight randomizer link on root path', () => {
      renderWithRouter(<Navigation />, ['/']);

      const randomizerLink = screen.getByRole('link', { name: /randomizer/i });
      expect(randomizerLink).toHaveClass('is-active');
    });

    it('should highlight games link on games path', () => {
      renderWithRouter(<Navigation />, ['/games']);

      const gamesLink = screen.getByRole('link', { name: /games/i });
      expect(gamesLink).toHaveClass('is-active');
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
