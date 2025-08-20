import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import Home from '../../../pages/Home/Home';

describe('Home Page Integration', () => {
  describe('page structure', () => {
    it('should render the main title', () => {
      render(<Home />);

      expect(screen.getByText('GotX Dashboard')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'GotX Dashboard',
      );
    });

    it('should render all navigation cards', () => {
      render(<Home />);

      // Check for all four main navigation cards
      expect(screen.getByText('Randomizer')).toBeInTheDocument();
      expect(screen.getByText('Stats')).toBeInTheDocument();
      expect(screen.getByText('Games')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('should render welcome text and descriptions', () => {
      render(<Home />);

      expect(
        screen.getByText(/Welcome to the GotX Dashboard/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Your place for all the details/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Select a tool from the list above/),
      ).toBeInTheDocument();
    });

    it('should render feature descriptions', () => {
      render(<Home />);

      expect(
        screen.getByText(/Use Randomizer to find a random game/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Use stats to see what's being nominated/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Use games to search for a particular game/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Use users to see your own personal/),
      ).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should have correct links for all navigation cards', () => {
      render(<Home />);

      // Check that all links have correct href attributes
      const randomizerLink = screen.getByRole('link', { name: /randomizer/i });
      const statsLink = screen.getByRole('link', { name: /stats/i });
      const gamesLink = screen.getByRole('link', { name: /games/i });
      const usersLink = screen.getByRole('link', { name: /users/i });

      expect(randomizerLink).toHaveAttribute('href', '/randomizer');
      expect(statsLink).toHaveAttribute('href', '/stats?tab=nominations');
      expect(gamesLink).toHaveAttribute('href', '/games');
      expect(usersLink).toHaveAttribute('href', '/users');
    });

    it('should render FontAwesome icons for each card', () => {
      render(<Home />);

      // Check for FontAwesome icon classes
      expect(document.querySelector('.fa-shuffle')).toBeInTheDocument();
      expect(document.querySelector('.fa-chart-simple')).toBeInTheDocument();
      expect(document.querySelector('.fa-gamepad')).toBeInTheDocument();
      expect(document.querySelector('.fa-users')).toBeInTheDocument();
    });
  });

  describe('responsive design', () => {
    it('should have proper CSS classes for responsive grid', () => {
      render(<Home />);

      const gridContainer = document.querySelector('.fixed-grid');
      expect(gridContainer).toHaveClass('has-1-cols-mobile');
      expect(gridContainer).toHaveClass('has-2-cols-tablet');
      expect(gridContainer).toHaveClass('has-4-cols-desktop');
    });

    it('should have proper styling classes', () => {
      render(<Home />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('title', 'is-1', 'has-text-centered');

      const grid = document.querySelector('.grid');
      expect(grid).toHaveClass('is-size-3', 'has-text-centered');
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<Home />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('GotX Dashboard');
    });

    it('should have accessible navigation links', () => {
      render(<Home />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(4);

      // Each link should have accessible text
      links.forEach((link) => {
        expect(link).toHaveTextContent(/randomizer|stats|games|users/i);
      });
    });

    it('should have proper semantic structure', () => {
      render(<Home />);

      // Check for proper list structure for feature descriptions
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(4);

      listItems.forEach((item) => {
        expect(item.textContent).toMatch(/Use (Randomizer|stats|games|users)/);
      });
    });
  });

  describe('content accuracy', () => {
    it('should have correct stats link with tab parameter', () => {
      render(<Home />);

      const statsLink = screen.getByRole('link', { name: /stats/i });
      expect(statsLink).toHaveAttribute('href', '/stats?tab=nominations');
    });

    it('should describe all four main features', () => {
      render(<Home />);

      // Verify each feature has a description
      expect(
        screen.getByText(/find a random game featured in GotX/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/see what's being nominated, played/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/search for a particular game/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/see your own personal.*completed games/),
      ).toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('should render cards in proper grid cells', () => {
      render(<Home />);

      const cells = document.querySelectorAll('.cell');
      expect(cells).toHaveLength(4);

      // Each cell should contain a link with a box
      cells.forEach((cell) => {
        const link = cell.querySelector('a');
        const box = cell.querySelector('.box');
        expect(link).toBeInTheDocument();
        expect(box).toBeInTheDocument();
      });
    });

    it('should have proper spacing classes', () => {
      render(<Home />);

      const welcomeText = screen
        .getByText(/Welcome to the GotX Dashboard/)
        .closest('p');
      expect(welcomeText).toHaveClass('mt-6');
    });
  });
});
