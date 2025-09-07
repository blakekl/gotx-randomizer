# 🔧 **GotX Randomizer - Codebase Patterns Reference**

## **Quick Reference for Development**

This document provides copy-paste examples of established patterns in the codebase for consistent development.

---

## 📁 **Folder Structure & Organization**

### **🏗️ Component Architecture Patterns**

The codebase follows a **hierarchical component organization** based on DOM structure and usage patterns:

#### **✅ CORRECT: Hierarchical Structure (Theme Browser Pattern)**

```
src/pages/Themes/
├── Themes.tsx                              # Page entry point
├── ThemeBrowser.tsx                        # Main browser component
├── CurrentThemes.tsx                       # Dashboard component
└── ThemeDetail/                            # Feature-specific folder
    ├── ThemeDetail.tsx                     # Router component
    ├── GotmThemeDetail/
    │   └── GotmThemeDetail.tsx             # Theme-specific component
    ├── RetrobitsThemeDetail/
    │   └── RetrobitsThemeDetail.tsx        # Theme-specific component
    ├── GotyThemeDetail/
    │   └── GotyThemeDetail.tsx             # Theme-specific component
    ├── RpgThemeDetail/
    │   └── RpgThemeDetail.tsx              # Theme-specific component
    ├── GotwotypThemeDetail/
    │   └── GotwotypThemeDetail.tsx         # Theme-specific component
    ├── ThemeHeader/                        # Shared component
    │   └── ThemeHeader.tsx                 # Used by all theme types
    ├── WinnerCard/                         # Shared component
    │   └── WinnerCard.tsx                  # Used by multiple themes
    └── NominationsTable/                   # Shared component
        └── NominationsTable.tsx            # Used by multiple themes
```

#### **❌ WRONG: Flat Structure**

```
src/pages/Themes/
├── Themes.tsx
├── ThemeBrowser.tsx
├── CurrentThemes.tsx
├── ThemeDetail.tsx                         # ❌ Should be in subfolder
├── GotmThemeDetail.tsx                     # ❌ Should be in subfolder
├── RetrobitsThemeDetail.tsx                # ❌ Should be in subfolder
├── GotyThemeDetail.tsx                     # ❌ Should be in subfolder
├── ThemeHeader.tsx                         # ❌ Should be in subfolder
├── WinnerCard.tsx                          # ❌ Should be in subfolder
└── NominationsTable.tsx                    # ❌ Should be in subfolder
```

### **🎯 Folder Structure Rules**

#### **Rule 1: Mirror DOM Hierarchy**

- **Folder structure should match component usage hierarchy**
- **Parent components contain child component folders**
- **Shared components live at the common ancestor level**

```typescript
// ✅ CORRECT: ThemeDetail contains theme-specific components
<ThemeDetail>           // ThemeDetail/
  <ThemeHeader />       //   ├── ThemeHeader/
  <GotmThemeDetail>     //   ├── GotmThemeDetail/
    <WinnerCard />      //   │   └── (uses WinnerCard from ../WinnerCard/)
  </GotmThemeDetail>
</ThemeDetail>
```

#### **Rule 2: One Component Per Folder**

- **Each component gets its own folder**
- **Component file matches folder name exactly**
- **Future tests, styles, and utilities go in same folder**

```
ComponentName/
├── ComponentName.tsx                       # Main component file
├── ComponentName.test.tsx                  # Tests (future)
├── ComponentName.module.css               # Styles (future)
└── utils.ts                               # Component utilities (future)
```

#### **Rule 3: Shared Components at Common Ancestor**

- **Components used by multiple siblings live at parent level**
- **Don't duplicate shared components**
- **Import paths use relative navigation (../ patterns)**

```typescript
// ✅ CORRECT: WinnerCard shared between theme types
ThemeDetail/
├── WinnerCard/                            # Shared by multiple themes
│   └── WinnerCard.tsx
├── GotmThemeDetail/
│   └── GotmThemeDetail.tsx                # imports '../WinnerCard/WinnerCard'
└── GotyThemeDetail/
    └── GotyThemeDetail.tsx                # imports '../WinnerCard/WinnerCard'
```

#### **Rule 4: Feature-Based Top-Level Organization**

- **Pages represent major features**
- **Each page gets its own folder under `/pages/`**
- **Related components stay within feature folder**

```
src/pages/
├── Games/                                 # Games feature
│   ├── Games.tsx
│   └── GameDetail/
├── Users/                                 # Users feature
│   ├── Users.tsx
│   └── UserProfile/
├── Themes/                                # Themes feature
│   ├── Themes.tsx
│   ├── ThemeBrowser.tsx
│   └── ThemeDetail/
└── Statistics/                            # Statistics feature
    ├── Statistics.tsx
    └── Chart/
```

### **📂 Complete Application Structure**

```
src/
├── components/                            # Global shared components
│   ├── Navigation/
│   │   └── Navigation.tsx
│   ├── Settings/
│   │   └── Settings.tsx
│   └── Pagination/
│       └── Pagination.tsx
├── pages/                                 # Feature-based organization
│   ├── Games/
│   │   ├── Games.tsx                      # Page entry point
│   │   ├── GameDisplay/                   # Feature component
│   │   │   └── GameDisplay.tsx
│   │   └── GameDetails/                   # Feature component
│   │       └── GameDetails.tsx
│   ├── Users/
│   │   ├── Users.tsx                      # Page entry point
│   │   └── UserDisplay/                   # Feature component
│   │       └── UserDisplay.tsx
│   ├── Themes/                            # ✅ NEW: Theme browser feature
│   │   ├── Themes.tsx                     # Page entry point
│   │   ├── ThemeBrowser.tsx               # Feature component
│   │   ├── CurrentThemes.tsx              # Feature component
│   │   └── ThemeDetail/                   # Sub-feature
│   │       ├── ThemeDetail.tsx            # Router component
│   │       ├── [ThemeType]ThemeDetail/    # Theme-specific components
│   │       └── [Shared]/                  # Shared theme components
│   ├── Statistics/
│   │   ├── Statistics.tsx                 # Page entry point
│   │   └── Chart/                         # Feature component
│   │       └── Chart.tsx
│   └── Home/
│       └── Home.tsx                       # Simple page
├── stores/                                # MobX stores
│   ├── DbStore.ts
│   ├── SettingsStore.ts
│   └── RootStore.ts
├── models/                                # TypeScript interfaces
│   └── game.ts
├── data/                                  # Database layer
│   ├── Queries.ts
│   ├── initDbClient.ts
│   └── index.ts
└── test-utils/                            # Testing utilities
    └── test-utils.tsx
```

### **🔄 Import Path Patterns**

#### **Relative Imports (Preferred)**

```typescript
// ✅ CORRECT: Use relative paths within feature
import { ThemeHeader } from '../ThemeHeader/ThemeHeader';
import { WinnerCard } from '../WinnerCard/WinnerCard';
import { GotmThemeDetail } from './GotmThemeDetail/GotmThemeDetail';
```

#### **Absolute Imports (Cross-Feature)**

```typescript
// ✅ CORRECT: Use absolute paths across features
import { useStores } from '../../../stores/useStores';
import { NominationType } from '../../../models/game';
import { Navigation } from '../../../components/Navigation/Navigation';
```

### **🧪 Test File Organization**

#### **Co-located Tests (Future Pattern)**

```
ComponentName/
├── ComponentName.tsx                      # Component
├── ComponentName.test.tsx                 # Unit tests
└── ComponentName.integration.test.tsx     # Integration tests
```

#### **Current Test Structure**

```
src/__tests__/
├── integration/
│   ├── components/                        # Component integration tests
│   │   ├── GotmThemeDetail.test.tsx
│   │   ├── GotyThemeDetail.test.tsx
│   │   └── ThemeDetail.test.tsx
│   └── pages/                             # Page integration tests
│       ├── ThemeBrowser.test.tsx
│       └── CurrentThemes.test.tsx
└── unit/                                  # Unit tests
    ├── stores/
    ├── models/
    └── data/
```

### **📋 Folder Creation Checklist**

When creating new components, follow this checklist:

1. **✅ Determine hierarchy level** - Where does this component fit in the DOM?
2. **✅ Check for shared usage** - Will multiple components use this?
3. **✅ Create component folder** - One folder per component
4. **✅ Match folder and file names** - Exact case-sensitive match
5. **✅ Use relative imports** - For components within same feature
6. **✅ Plan for growth** - Leave room for tests, styles, utilities

### **🚨 Common Folder Structure Mistakes**

#### **❌ Mistake 1: Flat Organization**

```
// ❌ WRONG: Everything in one folder
src/pages/Themes/
├── Component1.tsx
├── Component2.tsx
├── Component3.tsx
└── Component4.tsx
```

#### **❌ Mistake 2: Wrong Hierarchy**

```
// ❌ WRONG: Child component contains parent
src/pages/Themes/
└── WinnerCard/
    ├── WinnerCard.tsx
    └── ThemeDetail/                       # ❌ Parent inside child
        └── ThemeDetail.tsx
```

#### **❌ Mistake 3: Duplicate Shared Components**

```
// ❌ WRONG: Duplicating shared components
src/pages/Themes/
├── GotmThemeDetail/
│   ├── GotmThemeDetail.tsx
│   └── WinnerCard.tsx                     # ❌ Duplicate
└── GotyThemeDetail/
    ├── GotyThemeDetail.tsx
    └── WinnerCard.tsx                     # ❌ Duplicate
```

#### **✅ Correct Solution: Shared at Common Ancestor**

```
// ✅ CORRECT: Shared component at parent level
src/pages/Themes/ThemeDetail/
├── WinnerCard/                            # Shared component
│   └── WinnerCard.tsx
├── GotmThemeDetail/
│   └── GotmThemeDetail.tsx                # imports '../WinnerCard/WinnerCard'
└── GotyThemeDetail/
    └── GotyThemeDetail.tsx                # imports '../WinnerCard/WinnerCard'
```

---

## 🗄️ **Database Patterns**

### **Query Definition (Queries.ts)**

```typescript
// Pattern: Export const with descriptive name
export const getExampleData = `SELECT 
  field1,
  field2,
  ${coalescedTitle}, -- Use existing patterns
  COUNT(*) as count
FROM [public.table_name]
WHERE condition = 'value'
GROUP BY field1
ORDER BY field2 DESC;`;

// Pattern: Parameterized query function
export const getExampleById = (id: number) => `SELECT 
  *
FROM [public.table_name] 
WHERE id = ${id}
LIMIT 1;`;
```

### **DTO Definition (models/game.ts)**

```typescript
// Pattern: Interface extending existing types
export interface ExampleWithExtras extends ExistingInterface {
  additionalField: string;
  computedField: number;
  optionalField?: string;
}

// Pattern: DTO function with array destructuring
export const exampleDto = (data: any[]): ExampleType => {
  const [
    field1,
    field2,
    field3,
    // ... match SQL SELECT order exactly
  ] = data;

  return {
    field1,
    field2,
    field3,
    // computed fields if needed
  } as ExampleType;
};
```

### **Database Client Method (initDbClient.ts)**

```typescript
// Pattern: Add to return object in initDbClient
return {
  // ... existing methods

  getExampleData: () => {
    return db?.exec(getExampleData)[0]?.values.map((x) => exampleDto(x)) ?? [];
  },

  getExampleById: (id: number) => {
    return (
      db?.exec(getExampleById(id))[0]?.values.map((x) => exampleDto(x))[0] ??
      null
    );
  },

  getExampleWithFallback: () => {
    return db?.exec(getExampleData)[0]?.values.map((x) => exampleDto(x)) ?? [];
  },
};
```

---

## 🏪 **Store Patterns**

### **Store Class (following DbStore.ts)**

```typescript
import { runInAction } from 'mobx';
import dbClient from '../data';
import { ExampleType } from '../models/game';
import { RootStore } from './RootStore';

class ExampleStore {
  exampleData: ExampleType[] = [];

  constructor(private rootStore: RootStore) {
    // Initialize data in constructor if needed
    const data = dbClient.getExampleData() || [];
    runInAction(() => {
      this.setExampleData(data);
    });
  }

  setExampleData(value: ExampleType[]) {
    this.exampleData = value;
  }

  getExampleById(id: number): ExampleType | null {
    return dbClient.getExampleById(id) ?? null;
  }

  getFilteredExamples(filter: string): ExampleType[] {
    return dbClient.getFilteredExamples(filter) ?? [];
  }
}

export default ExampleStore;
```

### **Store Integration (RootStore.ts)**

```typescript
// Add to RootStore constructor
this.exampleStore = new ExampleStore(this);

// Add to interface
exampleStore: ExampleStore;
```

---

## 🧩 **Component Patterns**

### **Page Component (following Games.tsx)**

```typescript
import React, { useState, useMemo } from 'react';
import { useStores } from '../stores/useStores';
import { ExampleType } from '../models/game';

export const ExamplePage: React.FC = () => {
  const { dbStore } = useStores(); // or exampleStore
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    search: ''
  });

  // Pattern: useMemo for filtered data with proper dependencies
  const filteredData = useMemo(() => {
    let data = dbStore.getExampleData();

    if (filters.type !== 'all') {
      data = data.filter(item => item.type === filters.type);
    }

    if (filters.search) {
      data = data.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return data;
  }, [dbStore.exampleData, filters.type, filters.search]); // Include ALL dependencies

  return (
    <div>
      <h1>Example Page</h1>
      {/* Component JSX */}
    </div>
  );
};
```

### **Component with Settings (following existing pattern)**

```typescript
// Pattern: Settings component integration
import { Settings } from './Settings/Settings';

const ExampleWithSettings: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div>
      <button onClick={() => setShowSettings(!showSettings)}>
        Settings
      </button>

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}

      {/* Main content */}
    </div>
  );
};
```

---

## 🧪 **Testing Patterns**

### **Component Test (following existing tests)**

```typescript
import { render, screen } from '@testing-library/react';
import { ExampleComponent } from './ExampleComponent';
import { createMockStores } from '../test-utils/mockStores';
import { StoreProvider } from '../stores/useStores';

describe('ExampleComponent', () => {
  it('renders example data correctly', () => {
    const mockStores = createMockStores();

    render(
      <StoreProvider value={mockStores}>
        <ExampleComponent />
      </StoreProvider>
    );

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    const mockStores = createMockStores();
    mockStores.dbStore.exampleData = [];

    render(
      <StoreProvider value={mockStores}>
        <ExampleComponent />
      </StoreProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### **Store Test (following DbStore.test.ts)**

```typescript
import ExampleStore from './ExampleStore';
import { createMockStores } from '../test-utils/mockStores';

describe('ExampleStore', () => {
  let exampleStore: ExampleStore;

  beforeEach(() => {
    const mockStores = createMockStores();
    exampleStore = mockStores.exampleStore;
  });

  it('initializes with empty data', () => {
    expect(exampleStore.exampleData).toEqual([]);
  });

  it('sets example data correctly', () => {
    const testData = [{ id: 1, name: 'test' }];
    exampleStore.setExampleData(testData);
    expect(exampleStore.exampleData).toEqual(testData);
  });
});
```

---

## 🛣️ **Routing Patterns**

### **Route Definition (main.tsx)**

```typescript
// Pattern: Add routes to existing router
const router = createBrowserRouter([
  // ... existing routes
  {
    path: '/example',
    element: <ExamplePage />,
  },
  {
    path: '/example/:id',
    element: <ExampleDetail />,
  },
]);
```

### **Navigation Integration (Navigation.tsx)**

```typescript
// Pattern: Add NavLink following existing pattern
<NavLink
  to="/example"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Example
</NavLink>
```

---

## 🎨 **Styling Patterns**

### **CSS Class Naming (following existing styles)**

```css
/* Pattern: Component-based class names */
.example-container {
  /* Container styles */
}

.example-header {
  /* Header styles */
}

.example-item {
  /* Item styles */
}

.example-item.active {
  /* Active state */
}

.example-loading {
  /* Loading state */
}
```

### **Conditional Classes (React)**

```typescript
// Pattern: Conditional className application
<div className={`example-item ${isActive ? 'active' : ''}`}>
  Content
</div>

// Pattern: Multiple conditions
<div className={`
  example-item
  ${isActive ? 'active' : ''}
  ${isLoading ? 'loading' : ''}
`.trim()}>
  Content
</div>
```

---

## 🔧 **Utility Patterns**

### **Error Handling**

```typescript
// Pattern: Safe database access with fallbacks
const getData = () => {
  try {
    return dbClient.getExampleData() ?? [];
  } catch (error) {
    console.error('Error fetching example data:', error);
    return [];
  }
};
```

### **Loading States**

```typescript
// Pattern: Loading state management
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await someAsyncOperation();
    // Handle data
  } finally {
    setLoading(false);
  }
};
```

### **Date Handling (using dayjs)**

```typescript
import dayjs from 'dayjs';

// Pattern: Date formatting following existing code
const formatDate = (dateString: string) => {
  return dayjs(`${dateString}T13:00:00.000Z`).toDate().toLocaleDateString();
};
```

---

## 🚨 **Critical Patterns to Follow**

### **Privacy-Aware Queries**

```sql
-- ALWAYS use CASE statements for upcoming themes
CASE
  WHEN condition_for_upcoming THEN NULL  -- Hide title
  ELSE t.title
END as display_title
```

### **Year Categorization**

```sql
-- ALWAYS check theme_id for category logic
CASE
  WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
  WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
  WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
  WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
  WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
  WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
  ELSE 'Unknown'
END AS year_category
```

### **useMemo Dependencies**

```typescript
// ALWAYS include ALL dependencies that affect the computation
const computedValue = useMemo(() => {
  return someComputation(dep1, dep2, dep3);
}, [dep1, dep2, dep3]); // Include ALL dependencies used inside
```

---

## 📋 **File Naming Conventions**

- **Components**: PascalCase (`ExampleComponent.tsx`)
- **Pages**: PascalCase (`ExamplePage.tsx`)
- **Stores**: PascalCase (`ExampleStore.ts`)
- **Tests**: Match component name + `.test.tsx`
- **Types**: Defined in `models/game.ts`
- **Queries**: camelCase exports in `Queries.ts`

This reference guide ensures consistency with existing codebase patterns and helps maintain the established architecture and conventions.
