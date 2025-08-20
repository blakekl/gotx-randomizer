# 🔧 **GotX Randomizer - Codebase Patterns Reference**

## **Quick Reference for Development**

This document provides copy-paste examples of established patterns in the codebase for consistent development.

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
