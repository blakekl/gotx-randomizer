# Dependency Update Analysis - GotX Randomizer

## Current Status

- **Node.js**: v22.15.0 (LTS: Jod) ✅ **Up to date** (latest LTS is v22.17.0)
- **npm outdated packages**: 25 packages need updates

## Critical Updates (High Priority)

### 1. React Ecosystem

- **react**: `18.2.0` → `19.1.0` (Major version jump)
- **react-dom**: `18.2.0` → `19.1.0` (Major version jump)
- **@types/react**: `18.2.67` → `19.1.8` (Major version jump)
- **@types/react-dom**: `18.2.22` → `19.1.6` (Major version jump)

**⚠️ BREAKING CHANGES**: React 19 introduces significant changes. Consider staying on React 18.x for now.
**Recommended**: Update to latest React 18.x (`18.3.1`) instead of jumping to 19.

### 2. Build Tools & Bundler

- **vite**: `5.4.19` → `7.0.3` (Major version jump)
- **@vitejs/plugin-react-swc**: `3.6.0` → `3.10.2` (Safe update)
- **vite-tsconfig-paths**: `4.3.2` → `5.1.4` (Major version jump)
- **vite-plugin-node-polyfills**: `0.23.0` → `0.24.0` (Minor update)

**⚠️ BREAKING CHANGES**: Vite 7 has breaking changes. Consider updating to Vite 6.x first.

### 3. TypeScript & Linting

- **@typescript-eslint/eslint-plugin**: `7.18.0` → `8.36.0` (Major version jump)
- **@typescript-eslint/parser**: `7.18.0` → `8.36.0` (Major version jump)
- **eslint**: `8.57.0` → `9.30.1` (Major version jump)
- **eslint-plugin-react**: `7.34.1` → `7.37.5` (Safe update)
- **eslint-plugin-react-hooks**: `4.6.0` → `5.2.0` (Major version jump)
- **eslint-plugin-react-refresh**: `0.4.6` → `0.4.20` (Safe update)

**⚠️ BREAKING CHANGES**: ESLint 9 has significant configuration changes (flat config).

## Medium Priority Updates

### 4. Database & Core Libraries

- **better-sqlite3**: `9.4.3` → `12.2.0` (Major version jump)
- **sql.js**: `1.10.2` → `1.13.0` (Minor update - Safe)
- **mobx-react-lite**: `4.0.6` → `4.1.0` (Minor update - Safe)

### 5. UI & Charting

- **highcharts**: `11.4.0` → `12.3.0` (Major version jump)
- **highcharts-react-official**: `3.2.1` → `3.2.2` (Patch update - Safe)
- **react-responsive**: `9.0.2` → `10.0.1` (Major version jump)
- **react-router-dom**: `6.22.3` → `7.6.3` (Major version jump)

### 6. Utilities

- **dayjs**: `1.11.10` → `1.11.13` (Patch update - Safe)
- **@babel/runtime**: `7.24.1` → `7.27.6` (Minor update - Safe)

## Low Priority Updates

### 7. Development Tools

- **prettier**: `3.2.5` → `3.6.2` (Minor update - Safe)
- **lint-staged**: `15.5.2` → `16.1.2` (Major version jump)
- **dotenv**: `16.4.5` → `17.1.0` (Major version jump)
- **@types/better-sqlite3**: `7.6.9` → `7.6.13` (Patch update - Safe)

## Recommended Update Strategy

### Phase 1: Safe Updates (No Breaking Changes)

```bash
# Safe patch and minor updates
npm update dayjs @babel/runtime sql.js mobx-react-lite
npm update highcharts-react-official eslint-plugin-react eslint-plugin-react-refresh
npm update @types/better-sqlite3 prettier
```

### Phase 2: React 18 Latest (Recommended before React 19)

```bash
# Stay on React 18 but get latest patches
npm install react@^18.3.1 react-dom@^18.3.1
npm install @types/react@^18.3.23 @types/react-dom@^18.3.7
```

### Phase 3: Build Tools (Test Thoroughly)

```bash
# Update Vite to v6 first (not v7)
npm install vite@^6.0.0
npm install @vitejs/plugin-react-swc@latest
npm install vite-plugin-node-polyfills@latest
```

### Phase 4: Major Updates (Requires Code Changes)

These require careful testing and potentially code changes:

1. **ESLint 9**: New flat config format
2. **React Router 7**: New data loading patterns
3. **Highcharts 12**: Potential API changes
4. **better-sqlite3 12**: Node.js compatibility changes
5. **React 19**: New features and breaking changes

## Breaking Changes to Watch For

### React 19

- New JSX Transform requirements
- Changes to `useEffect` behavior
- New concurrent features
- Potential TypeScript compatibility issues

### ESLint 9

- Flat config format (no more `.eslintrc`)
- Plugin loading changes
- Rule changes

### Vite 7

- Node.js 18+ requirement
- Plugin API changes
- Build output changes

### React Router 7

- New data loading patterns
- Route configuration changes
- Breaking changes in navigation

## Node.js Status

✅ **Current**: v22.15.0 (LTS)
✅ **Latest LTS**: v22.17.0
**Recommendation**: Update to v22.17.0 for latest security patches

```bash
# Update Node.js
echo "v22.17.0" > .nvmrc
nvm install v22.17.0
nvm use v22.17.0
```

## Testing Strategy

For each phase:

1. **Create a branch** for the updates
2. **Update dependencies** in small batches
3. **Run tests** after each batch
4. **Test build process** (`npm run build`)
5. **Test in development** (`npm run dev`)
6. **Test production build** (`npm run preview`)
7. **Check for console errors**
8. **Test all major features**

## Estimated Time Investment

- **Phase 1** (Safe updates): 1-2 hours
- **Phase 2** (React 18 latest): 2-3 hours
- **Phase 3** (Build tools): 4-6 hours
- **Phase 4** (Major updates): 8-12 hours each

## Risk Assessment

**Low Risk**: dayjs, @babel/runtime, sql.js, mobx-react-lite, prettier
**Medium Risk**: React 18 updates, Vite 6, Highcharts 12
**High Risk**: ESLint 9, React 19, Vite 7, React Router 7, better-sqlite3 12

## Recommendation

Start with **Phase 1** safe updates, then **Phase 2** React 18 latest. Hold off on major version jumps (Phase 4) until you have more time to handle potential breaking changes.

The current setup is functional, so these updates are for security, performance, and future-proofing rather than fixing immediate issues.
