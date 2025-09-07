import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/test-utils';
import React from 'react';
import ThemeBrowser from '../../../pages/Themes/ThemeBrowser';

describe('ThemeBrowser Component Integration', () => {
  describe('basic rendering', () => {
    it('should render theme history page', () => {
      render(<ThemeBrowser />);

      expect(screen.getByText('Theme History')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Search themes...'),
      ).toBeInTheDocument();
    });

    it('should render filter buttons', () => {
      render(<ThemeBrowser />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('GotM')).toBeInTheDocument();
      expect(screen.getByText('Retrobit')).toBeInTheDocument();
      expect(screen.getByText('RPG')).toBeInTheDocument();
      expect(screen.getByText('GotY')).toBeInTheDocument();
    });

    it('should render search input', () => {
      render(<ThemeBrowser />);

      const searchInput = screen.getByPlaceholderText('Search themes...');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('type', 'text');
    });

    it('should render theme table headers', () => {
      render(<ThemeBrowser />);

      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Nominations')).toBeInTheDocument();
    });

    it('should render modal component', () => {
      render(<ThemeBrowser />);

      // Modal should be present but not active
      const modal = document.querySelector('.modal');
      expect(modal).toBeInTheDocument();
      expect(modal).not.toHaveClass('is-active');
    });
  });
});
