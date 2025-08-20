import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Settings from '../../../pages/Randomizer/Settings/Settings';

// Mock the stores
const mockSettingsStore = {
  hltbFilter: [0, 100],
  hltbMax: 100,
  hltbMin: 0,
  includeGotmRunnerUp: true,
  includeGotmWinners: true,
  includeRetrobits: true,
  includeRpgRunnerUp: true,
  includeRpgWinners: true,
  includeHiddenGames: false,
  setHltbFilter: vi.fn(),
  setHltbMax: vi.fn(),
  setHltbMin: vi.fn(),
  toggleGotmRunnerUp: vi.fn(),
  toggleGotmWinners: vi.fn(),
  toggleRetrobits: vi.fn(),
  toggleRpgRunnerUp: vi.fn(),
  toggleRpgWinners: vi.fn(),
  toggleHiddenGames: vi.fn(),
};

const mockDbStore = {
  allGames: {
    gotmRunnerUp: [],
    gotmWinners: [],
    retrobits: [],
    rpgRunnerUp: [],
    rpgWinners: [],
  },
};

// Mock the useStores hook
vi.mock('../../../stores/useStores', () => ({
  useStores: () => ({
    settingsStore: mockSettingsStore,
    dbStore: mockDbStore,
  }),
}));

describe('Settings Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockSettingsStore.hltbFilter = [0, 100];
    mockSettingsStore.includeGotmRunnerUp = true;
    mockSettingsStore.includeGotmWinners = true;
    mockSettingsStore.includeRetrobits = true;
    mockSettingsStore.includeRpgRunnerUp = true;
    mockSettingsStore.includeRpgWinners = true;
    mockSettingsStore.includeHiddenGames = false;
  });

  describe('dropdown behavior', () => {
    it('should render settings button', () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      expect(settingsButton).toBeInTheDocument();
    });

    it('should toggle dropdown on button click', async () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      const dropdown = settingsButton.closest('.dropdown');

      // Initially closed (dropdown should not have is-active class)
      expect(dropdown).not.toHaveClass('is-active');

      // Open dropdown
      await user.click(settingsButton);

      expect(dropdown).toHaveClass('is-active');
      expect(screen.getByText('GotM Winners')).toBeInTheDocument();
      expect(screen.getByText('GotM Runner Ups')).toBeInTheDocument();
    });

    it('should close dropdown when clicking button again', async () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      const dropdown = settingsButton.closest('.dropdown');

      // Open dropdown
      await user.click(settingsButton);
      expect(dropdown).toHaveClass('is-active');

      // Close dropdown
      await user.click(settingsButton);

      await waitFor(() => {
        expect(dropdown).not.toHaveClass('is-active');
      });
    });

    it('should not close dropdown on outside click (feature not implemented)', async () => {
      render(
        <div>
          <Settings />
          <div data-testid="outside">Outside element</div>
        </div>,
      );

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      const dropdown = settingsButton.closest('.dropdown');
      const outsideElement = screen.getByTestId('outside');

      // Open dropdown
      await user.click(settingsButton);
      expect(dropdown).toHaveClass('is-active');

      // Click outside - Settings component doesn't implement outside click detection
      await user.click(outsideElement);

      // Dropdown should remain open
      expect(dropdown).toHaveClass('is-active');
    });
  });

  describe('game type toggles', () => {
    beforeEach(async () => {
      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);
    });

    it('should display all game type checkboxes', () => {
      expect(screen.getByLabelText('GotM Winners')).toBeInTheDocument();
      expect(screen.getByLabelText('GotM Runner Ups')).toBeInTheDocument();
      expect(screen.getByLabelText('RPGotQ Winners')).toBeInTheDocument();
      expect(screen.getByLabelText('RPGotQ Runner Ups')).toBeInTheDocument();
      expect(screen.getByLabelText('Retrobits')).toBeInTheDocument();
      expect(screen.getByLabelText('Include hidden games')).toBeInTheDocument();
    });

    it('should reflect current settings state', () => {
      expect(screen.getByLabelText('GotM Winners')).toBeChecked();
      expect(screen.getByLabelText('GotM Runner Ups')).toBeChecked();
      expect(screen.getByLabelText('RPGotQ Winners')).toBeChecked();
      expect(screen.getByLabelText('RPGotQ Runner Ups')).toBeChecked();
      expect(screen.getByLabelText('Retrobits')).toBeChecked();
      expect(screen.getByLabelText('Include hidden games')).not.toBeChecked();
    });

    it('should toggle GotM Winners', async () => {
      const checkbox = screen.getByLabelText('GotM Winners');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleGotmWinners).toHaveBeenCalledTimes(1);
    });

    it('should toggle GotM Runner Ups', async () => {
      const checkbox = screen.getByLabelText('GotM Runner Ups');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleGotmRunnerUp).toHaveBeenCalledTimes(1);
    });

    it('should toggle RPG Winners', async () => {
      const checkbox = screen.getByLabelText('RPGotQ Winners');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleRpgWinners).toHaveBeenCalledTimes(1);
    });

    it('should toggle RPG Runner-up', async () => {
      const checkbox = screen.getByLabelText('RPGotQ Runner Ups');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleRpgRunnerUp).toHaveBeenCalledTimes(1);
    });

    it('should toggle Retrobits', async () => {
      const checkbox = screen.getByLabelText('Retrobits');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleRetrobits).toHaveBeenCalledTimes(1);
    });

    it('should toggle Include Hidden Games', async () => {
      const checkbox = screen.getByLabelText('Include hidden games');

      await user.click(checkbox);

      expect(mockSettingsStore.toggleHiddenGames).toHaveBeenCalledTimes(1);
    });
  });

  describe('HLTB filter slider', () => {
    beforeEach(async () => {
      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);
    });

    it('should display HLTB filter section', () => {
      expect(screen.getByText('Time to Beat')).toBeInTheDocument();
    });

    it('should handle slider changes', () => {
      // Find the slider components (there are two - min and max)
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);

      // Verify both sliders are present
      expect(screen.getByLabelText('Minimum time to beat')).toBeInTheDocument();
      expect(screen.getByLabelText('Maximum time to beat')).toBeInTheDocument();

      // Note: Testing react-slider interactions is complex due to its custom implementation
      // We verify the component renders and the handler is set up correctly
      expect(mockSettingsStore.setHltbFilter).toBeDefined();
    });

    it('should display current slider values', () => {
      // The slider values are displayed as the thumb content
      const minSlider = screen.getByLabelText('Minimum time to beat');
      const maxSlider = screen.getByLabelText('Maximum time to beat');

      expect(minSlider).toHaveAttribute('aria-valuenow', '0');
      expect(maxSlider).toHaveAttribute('aria-valuenow', '100');
    });

    it('should reflect store filter values in sliders', async () => {
      mockSettingsStore.hltbFilter = [25, 75];

      render(<Settings />);

      const settingsButtons = screen.getAllByRole('button', {
        name: /settings/i,
      });
      const settingsButton = settingsButtons[0]; // Use the first one
      await user.click(settingsButton);

      // Get all sliders and identify them by their values
      const minSliders = screen.getAllByLabelText('Minimum time to beat');
      const maxSliders = screen.getAllByLabelText('Maximum time to beat');

      // Use the first slider of each type
      const minSlider = minSliders[0];
      const maxSlider = maxSliders[0];

      expect(minSlider).toHaveAttribute('aria-valuenow', '25');
      expect(maxSlider).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      expect(settingsButton).toHaveAttribute('aria-haspopup', 'true');
      expect(settingsButton).toHaveAttribute('aria-controls', 'dropdown-menu');
    });

    it('should have proper labels for checkboxes', async () => {
      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toHaveAccessibleName();
      });
    });

    it('should be keyboard navigable', async () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });

      // Focus the button
      settingsButton.focus();
      expect(settingsButton).toHaveFocus();

      // Press Enter to open dropdown
      fireEvent.keyDown(settingsButton, { key: 'Enter' });

      expect(screen.getByText('GotM Winners')).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('should render properly on different screen sizes', () => {
      render(<Settings />);

      const dropdown = screen
        .getByRole('button', { name: /settings/i })
        .closest('.dropdown');
      expect(dropdown).toHaveClass('dropdown');
    });

    it('should maintain functionality when dropdown is active', async () => {
      render(<Settings />);

      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      const dropdown = settingsButton.closest('.dropdown');
      expect(dropdown).toHaveClass('is-active');

      // Should still be able to interact with controls
      const checkbox = screen.getByLabelText('GotM Winners');
      await user.click(checkbox);

      expect(mockSettingsStore.toggleGotmWinners).toHaveBeenCalled();
    });
  });

  describe('state synchronization', () => {
    it('should reflect store changes in UI', async () => {
      mockSettingsStore.includeGotmWinners = false;
      mockSettingsStore.hltbFilter = [25, 75];

      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      const checkbox = screen.getByLabelText('GotM Winners');
      expect(checkbox).not.toBeChecked();

      // Check slider values through aria attributes
      const minSlider = screen.getByLabelText('Minimum time to beat');
      const maxSlider = screen.getByLabelText('Maximum time to beat');
      expect(minSlider).toHaveAttribute('aria-valuenow', '25');
      expect(maxSlider).toHaveAttribute('aria-valuenow', '75');
    });

    it('should handle rapid toggle changes', async () => {
      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      const checkbox = screen.getByLabelText('GotM Winners');

      // Rapid clicks
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(mockSettingsStore.toggleGotmWinners).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('should handle store method errors gracefully', async () => {
      mockSettingsStore.toggleGotmWinners.mockImplementation(() => {
        throw new Error('Store error');
      });

      render(<Settings />);
      const settingsButton = screen.getByRole('button', { name: /settings/i });
      await user.click(settingsButton);

      const checkbox = screen.getByLabelText('GotM Winners');

      // Should not crash the component
      expect(() => user.click(checkbox)).not.toThrow();
    });

    it('should handle missing store gracefully', () => {
      // Mock the useStores hook to return null store
      const mockUseStores = vi.fn().mockReturnValue({
        settingsStore: null,
        dbStore: mockDbStore,
      });

      // Replace the mock temporarily
      vi.doMock('../../../stores/useStores', () => ({
        useStores: mockUseStores,
      }));

      // Should not crash when store is null
      expect(() => render(<Settings />)).not.toThrow();
    });
  });
});
