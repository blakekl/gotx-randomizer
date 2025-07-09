module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    // "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-type-checked",
    // 'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:react-hooks/recommended',
    `plugin:react/recommended`,
    `plugin:react/jsx-runtime`,
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'scripts/**'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // "@typescript-eslint/no-unnecessary-condition": "error"
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['**/__tests__/**/*', '**/*.test.*', '**/test-utils/**/*'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['vitest.config.ts'],
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
