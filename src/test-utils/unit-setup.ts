import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage for unit tests
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock SQL.js for unit tests that might need it
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

// Export the localStorage mock for tests to use
export { localStorageMock };
