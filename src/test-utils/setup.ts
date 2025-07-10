import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Add basic CSS for dropdown behavior in tests
const style = document.createElement('style');
style.textContent = `
  .dropdown:not(.is-active) .dropdown-menu {
    display: none;
  }
  .dropdown.is-active .dropdown-menu {
    display: block;
  }
`;
document.head.appendChild(style);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock SQL.js
vi.mock('sql.js', () => ({
  default: vi.fn(() =>
    Promise.resolve({
      Database: vi.fn(() => ({
        exec: vi.fn(() => [{ values: [] }]),
        close: vi.fn(),
      })),
    }),
  ),
}));

// Mock the SQLite database file
vi.mock('../gotx-randomizer.sqlite?url', () => ({
  default: 'mock-database-url',
}));

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console warnings in tests unless explicitly testing them
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('React Router Future Flag Warning')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
