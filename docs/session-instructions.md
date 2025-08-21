# 🎯 **Theme Browser Development - Session Instructions**

## **Quick Start for Any Development Session**

This document provides step-by-step instructions for maintaining context and progress tracking during theme browser development.

---

## 🚀 **Before Starting Development**

### **1. Context Review (5 minutes)**

Read these documents in order:

1. **`docs/theme-browser-progress.md`** - Current status and next priorities
2. **`docs/masterplan.md`** - Feature specification (if needed)
3. **`docs/project-context.md`** - Business rules and constraints (if needed)

### **2. Session Setup**

```bash
# Ensure you're on the correct branch
git checkout feature/theme-browser
git status

# Check current test status
npm test

# Start development server if needed
npm run dev
```

### **3. Create Session Notes**

- Copy `docs/session-template.md` to `docs/session-[YYYY-MM-DD].md`
- Fill in session info (date, duration, focus)
- Set 3-5 specific goals for the session

---

## 🔄 **During Development**

### **Track Progress Continuously:**

- ✅ Update session notes as you complete tasks
- 📝 Note any files created or modified
- 🐛 Record issues encountered and solutions
- 💡 Capture insights about business logic or technical decisions
- 🧪 Run tests frequently: `npm test`

### **Key Reminders:**

- **Privacy First:** Upcoming theme titles must NEVER be exposed
- **Multi-Winner Support:** GotM (3 winners), GotY (multiple categories)
- **Follow Existing Patterns:** 70% of infrastructure already exists
- **Year Logic:** Changes at theme_id 235 (different category boundaries)
- **Test Everything:** Maintain 406 test pass rate

---

## 📋 **Development Priorities (Current)**

### **Phase 1: Database & Store Foundation** ⏳ _Active_

**Next Tasks:**

1. Extend `/src/data/Queries.ts` with theme queries
2. Add theme methods to `/src/data/initDbClient.ts`
3. Extend `/src/models/game.ts` with new interfaces
4. Create new DTOs for theme data
5. Add theme methods to DbStore or create ThemeStore
6. Test database queries and privacy logic

### **Reference Patterns:**

- **Query Pattern:** Follow existing queries in `Queries.ts`
- **DTO Pattern:** Follow `gameDto`, `themeDto` in `models/game.ts`
- **Database Client:** Follow existing methods in `initDbClient.ts`
- **Store Pattern:** Follow `DbStore.ts` architecture

---

## 🔧 **Common Development Tasks**

### **Adding New Database Query:**

1. Add query to `/src/data/Queries.ts`
2. Add method to `/src/data/initDbClient.ts`
3. Add DTO if needed to `/src/models/game.ts`
4. Test query works correctly
5. Update session notes

### **Creating New Component:**

1. Follow existing patterns from `/src/pages/Games/`
2. Use existing hooks and stores
3. Add tests following existing test patterns
4. Ensure mobile responsive
5. Update session notes

### **Testing New Functionality:**

```bash
# Run all tests
npm test

# Run specific test file
npm test -- ComponentName.test.tsx

# Run tests in watch mode
npm test -- --watch
```

---

## 🚨 **Critical Constraints**

### **Privacy Requirements (NEVER VIOLATE):**

- Upcoming theme titles must be NULL in database responses
- Display "Upcoming [TYPE] Theme" instead of actual titles
- Search functionality must exclude upcoming themes
- Theme detail pages must hide upcoming theme names

### **Multi-Winner Business Logic:**

- **GotM:** Up to 3 winners per theme (one per year category)
- **GotY:** Multiple themes per year (same creation_date, different award categories)
- **Others:** Single winner per theme (Retrobit, RPG, GotWotY)

### **Year Categorization (Critical):**

```sql
-- ALWAYS use this logic for year categories
CASE
  WHEN t.id < 235 AND g.year < 1996 THEN 'pre 96'
  WHEN t.id < 235 AND g.year BETWEEN 1996 AND 1999 THEN '96-99'
  WHEN t.id < 235 AND g.year >= 2000 THEN '2k+'
  WHEN t.id >= 235 AND g.year < 1996 THEN 'pre 96'
  WHEN t.id >= 235 AND g.year BETWEEN 1996 AND 2001 THEN '96-01'
  WHEN t.id >= 235 AND g.year >= 2002 THEN '02+'
  ELSE 'Unknown'
END
```

---

## 🎯 **Session Goals Examples**

### **Good Session Goals:**

- ✅ "Add getThemesWithStatus query to Queries.ts"
- ✅ "Create ThemeWithStatus interface in models/game.ts"
- ✅ "Implement getCurrentWinners database method"
- ✅ "Test privacy filtering for upcoming themes"

### **Too Broad:**

- ❌ "Work on theme browser"
- ❌ "Add database stuff"
- ❌ "Create components"

---

## 📝 **End of Session Checklist**

### **Before Finishing:**

- [ ] All tests still passing: `npm test`
- [ ] Session notes completed with accomplishments
- [ ] Files created/modified documented
- [ ] Any issues or blockers noted
- [ ] Next session priorities identified

### **Update Progress Tracking:**

1. **Update `docs/theme-browser-progress.md`:**

   - Move completed tasks from "Next Tasks" to "Completed Tasks"
   - Add session summary to "Recent Session Notes"
   - Update "Next Tasks" with new priorities
   - Note any new issues or decisions

2. **Commit Progress:**

```bash
git add .
git commit -m "Theme browser: [brief description of work done]

- Specific change 1
- Specific change 2
- Tests: [status]"
```

---

## 🔍 **Troubleshooting**

### **Tests Failing:**

1. Check what changed: `git diff`
2. Run specific failing test: `npm test -- FailingTest.test.tsx`
3. Check mock data in `test-utils/fixtures/`
4. Ensure new interfaces don't break existing code

### **Database Query Issues:**

1. Check SQL syntax in browser console
2. Verify table/column names match schema
3. Test query in isolation
4. Check DTO matches query result structure

### **Component Not Rendering:**

1. Check imports and exports
2. Verify store integration
3. Check for TypeScript errors
4. Ensure proper routing setup

---

## 📚 **Quick Reference Files**

### **Always Keep Handy:**

- `docs/codebase-patterns.md` - Copy-paste development patterns
- `docs/database-schema.md` - Complete database structure
- `src/models/game.ts` - Existing interfaces and DTOs
- `src/data/Queries.ts` - Existing query patterns

### **For Business Logic Questions:**

- `docs/project-context.md` - Business rules and constraints
- `docs/masterplan.md` - Complete feature specification

---

## 💡 **Pro Tips**

### **Maintain Context:**

- Update session notes every 30 minutes
- Commit frequently with descriptive messages
- Test after each significant change
- Document decisions and rationale

### **Stay Consistent:**

- Follow existing naming conventions
- Use established component patterns
- Maintain existing code style
- Keep tests comprehensive

### **Avoid Common Pitfalls:**

- Don't expose upcoming theme titles (privacy violation)
- Don't forget multi-winner scenarios (GotM, GotY)
- Don't break existing functionality
- Don't skip testing new features

---

**Remember:** The goal is to build a theme browser that integrates seamlessly with the existing application while respecting all business rules and privacy constraints. When in doubt, follow existing patterns and prioritize privacy protection!
