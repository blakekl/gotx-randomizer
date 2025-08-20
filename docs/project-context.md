# 🎯 **GotX Randomizer - Project Context & Development Guide**

## **Project Overview**

The GotX Randomizer is a React/TypeScript web application that serves the retro gaming community by providing random game selection from various "Game of the X" programs. The application helps users discover games from monthly themes across different gaming programs.

**Live Application:** https://randomizer.retrohandhelds.gg  
**Community:** Retro Handhelds Discord Server  
**Repository:** Personal project by blongmore

---

## 🏗️ **Current Architecture**

### **Technology Stack**

- **Frontend:** React 18 + TypeScript + Vite
- **State Management:** MobX (reactive state management)
- **Database:** SQLite with SQL.js (client-side database)
- **Styling:** CSS (custom styles, no framework)
- **Testing:** Vitest + React Testing Library (406 tests passing)
- **Routing:** React Router
- **Build:** Vite bundler

### **Key Dependencies**

- `sql.js` - SQLite in the browser
- `mobx` + `mobx-react-lite` - State management
- `react-router-dom` - Client-side routing
- `dayjs` - Date manipulation
- `vitest` - Testing framework

### **Project Structure**

```
src/
├── components/           # Reusable UI components
├── data/                # Database queries and initialization
├── models/              # TypeScript interfaces and DTOs
├── pages/               # Route-based page components
├── stores/              # MobX state management
├── test-utils/          # Testing utilities and fixtures
└── __tests__/           # Comprehensive test suite
```

---

## 🎮 **Domain Knowledge: GotX Programs**

### **Program Types**

- **GotM** (Game of the Month) - Monthly featured games
- **Retrobit** - Weekly retro game selections
- **RPG** - Quarterly RPG selections
- **GotY** (Game of the Year) - Annual game awards
- **GotWotY** (Game of the Week of the Year) - Weekly year-end selections

### **Community Workflow**

1. **Theme Creation** - Monthly/periodic themes with specific criteria
2. **Nomination Period** - Users nominate games fitting the theme
3. **Voting/Selection** - Community selects winners
4. **Completion Tracking** - Users complete and report finished games
5. **Points System** - Rewards for participation and completion

### **Business Rules**

- **GotM themes typically have 3 winners** - one from each year category (pre-96, 96-99/96-01, 2k+/02+)
- **GotY has multiple award categories per year** - same creation_date, different themes (Best Soundtrack, Best Narrative, etc.)
- **Other programs have 1 winner per theme** - Retrobit, RPG, GotWotY
- **Special theme exceptions exist** - Some themes (like January "any previous winner") create messy data
- Games categorized by release year (logic changed at theme_id 235)
- Points awarded for nominations, wins, and completions
- RetroAchievements provide bonus points
- Premium subscribers get point multipliers

---

## 🔧 **Development Patterns**

### **Database Patterns**

```typescript
// Query pattern in Queries.ts
export const getExampleData = `SELECT ... FROM [public.table] WHERE ...`;

// DTO pattern in models/game.ts
export const exampleDto = (data: any[]): ExampleType => {
  const [field1, field2, field3] = data;
  return { field1, field2, field3 } as ExampleType;
};

// Database client pattern in initDbClient.ts
getExampleData: () => {
  return db?.exec(getExampleData)[0]?.values.map((x) => exampleDto(x)) ?? [];
};
```

### **Component Patterns**

```typescript
// Page component pattern
export const ExamplePage: React.FC = () => {
  const { dbStore } = useStores();
  const [loading, setLoading] = useState(true);

  // Component logic
  return <div>...</div>;
};

// Store pattern (MobX)
class ExampleStore {
  constructor(private rootStore: RootStore) {}

  getData() {
    return dbClient.getExampleData() ?? [];
  }
}
```

### **Testing Patterns**

- Unit tests for stores, models, and utilities
- Integration tests for components and pages
- Mock stores and database client for testing
- Comprehensive coverage (406 tests passing)

---

## 🚨 **Critical Context & Constraints**

### **Privacy Requirements**

- **Upcoming theme titles MUST be hidden** - This is a strict business requirement
- Only show "Upcoming [TYPE] Theme" for future themes
- Nominations for upcoming themes can be shown
- Database queries must filter upcoming theme titles at source level

### **Year Categorization Logic**

**IMPORTANT:** Logic changed at theme_id 235:

**Before theme_id 235:**

```sql
CASE
  WHEN year < 1996 THEN 'pre 96'
  WHEN year BETWEEN 1996 AND 1999 THEN '96-99'
  WHEN year >= 2000 THEN '2k+'
END
```

**After theme_id 235:**

```sql
CASE
  WHEN year < 1996 THEN 'pre 96'
  WHEN year BETWEEN 1996 AND 2001 THEN '96-01'
  WHEN year >= 2002 THEN '02+'
END
```

### **Database Constraints**

- SQLite database runs client-side via SQL.js
- No formal foreign key constraints (managed in application)
- Text-based timestamps (not native datetime)
- No indexes defined (relies on primary keys)

---

## 🎯 **Current Feature: Theme Browser**

### **Status:** In Development (feature/theme-browser branch)

**Goal:** Create a dedicated page for browsing themes across all GotX programs with privacy-aware upcoming theme handling.

### **Key Requirements**

1. Browse themes by program type and time period
2. Show current active themes with winners
3. Display upcoming themes WITHOUT revealing names (privacy)
4. Categorize nominations by release year brackets
5. Provide detailed theme views with category breakdowns

### **Implementation Strategy**

- **70% existing infrastructure** can be reused
- Extend existing `Queries.ts`, `initDbClient.ts`, and `models/game.ts`
- Follow existing component patterns from Games page
- Use existing MobX store patterns
- Leverage existing `Theme`, `Game`, `Nomination` interfaces

### **Files to Modify**

- `/src/data/Queries.ts` - Add theme queries
- `/src/data/initDbClient.ts` - Add theme database methods
- `/src/models/game.ts` - Add new interfaces extending existing ones
- `/src/Navigation.tsx` - Add themes link
- `/src/main.tsx` - Add theme routes

### **New Components Needed**

- `/src/pages/Themes/` - Theme browser page structure
- Theme browser components following existing patterns
- Privacy wrapper for upcoming themes
- Category breakdown visualization

---

## 🛠️ **Development Environment**

### **Setup Commands**

```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm test            # Run test suite (406 tests)
npm run build       # Production build
```

### **Key Scripts**

- `npm test` - Runs Vitest test suite
- `npm run test:ui` - Interactive test UI
- `q --help` - Amazon Q CLI usage (if available)

### **Recent Fixes Applied**

- **Pagination Component** - Fixed setTimeout cleanup to prevent memory leaks
- **Games Page Filtering** - Added missing dependencies to useMemo
- **Test Suite** - All 406 tests passing, build successful

---

## 📋 **Code Quality Standards**

### **TypeScript**

- Strict TypeScript configuration
- Interfaces defined in `models/game.ts`
- DTOs for database result conversion
- Type safety throughout application

### **Testing**

- Comprehensive test coverage
- Unit tests for business logic
- Integration tests for components
- Mock patterns for external dependencies

### **Performance**

- Client-side SQLite for fast queries
- MobX reactive updates
- Vite for fast development and builds
- Pagination for large data sets

---

## 🔍 **Debugging & Troubleshooting**

### **Common Issues**

1. **Database Loading** - Check SQL.js initialization in initDbClient.ts
2. **Query Errors** - Verify SQL syntax in Queries.ts
3. **State Updates** - Ensure MobX observables are properly configured
4. **Test Failures** - Check mock data in test-utils/fixtures

### **Development Tools**

- Browser DevTools for React/MobX debugging
- Vite dev server with HMR
- Test UI for interactive testing
- SQL.js database inspection in browser

---

## 📚 **Key Documentation Files**

### **Existing Documentation**

- `README.md` - Basic project info and contributing guide
- `docs/database-schema.md` - Complete database structure
- `docs/masterplan.md` - Theme browser feature plan

### **Code Documentation**

- TypeScript interfaces in `src/models/game.ts`
- Query definitions in `src/data/Queries.ts`
- Component patterns throughout `src/pages/`
- Test examples in `src/__tests__/`

---

## 🤝 **Collaboration Guidelines**

### **Branch Strategy**

- `main` - Production-ready code
- `feature/theme-browser` - Current feature development
- Create feature branches for new work

### **Code Review Checklist**

- [ ] TypeScript types properly defined
- [ ] Tests added/updated for new functionality
- [ ] Privacy requirements respected (upcoming themes)
- [ ] Database queries follow existing patterns
- [ ] Components follow established patterns
- [ ] No breaking changes to existing functionality

### **Testing Requirements**

- All tests must pass before merging
- New features require corresponding tests
- Integration tests for user-facing functionality
- Mock external dependencies appropriately

---

## 🎯 **Next Steps for Theme Browser**

### **Immediate Tasks**

1. Extend database queries in `Queries.ts`
2. Add theme methods to `initDbClient.ts`
3. Create new interfaces in `models/game.ts`
4. Build theme browser page components
5. Add routing and navigation integration

### **Success Criteria**

- [ ] Users can browse all historical themes
- [ ] Current active themes prominently displayed
- [ ] Upcoming theme titles never exposed (privacy)
- [ ] Nominations properly categorized by year
- [ ] Winners clearly highlighted
- [ ] Mobile-responsive design
- [ ] All existing tests continue passing

---

## 📞 **Getting Help**

### **Key Resources**

- Existing codebase patterns (follow established conventions)
- Database schema documentation
- Test suite examples
- MobX documentation for state management
- React Router documentation for routing

### **Context Preservation**

This document provides the essential context needed to continue development on the GotX Randomizer project, particularly the theme browser feature. It covers technical architecture, business requirements, privacy constraints, and development patterns that any assistant or collaborator would need to maintain consistency and quality.
