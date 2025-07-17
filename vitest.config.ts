/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    nodePolyfills({
      exclude: [
        'assert',
        'child_process',
        'console',
        'constants',
        'crypto',
        'dgram',
        'dns',
        'events',
        'fs',
        'http',
        'http2',
        'https',
        'net',
        'os',
        'path',
        'process',
        'querystring',
        'readline',
        'repl',
        'stream',
        'string_decoder',
        'timers',
        'tls',
        'tty',
        'url',
        'util',
        'vm',
        'zlib',
      ],
      globals: {
        Buffer: true,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      // Use different setup files based on test type
      './src/test-utils/setup.ts', // For integration tests
    ],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test-utils/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'scripts/',
        'src/gotx-randomizer.sqlite',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 90,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
  assetsInclude: ['**/*.sqlite'],
});
