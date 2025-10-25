# Style Cleanup Report

## Redundant Styles Identified

### 1. Duplicate Navbar Files

**Files:**

- `/src/components/navbar.css` - GitHub-style navbar (newer)
- `/src/styles/navbar.css` - Original navbar (older)

**Recommendation:** Remove `/src/components/navbar.css` and consolidate into `/src/styles/navbar.css`

### 2. Duplicate Profile Popup Files

**Files:**

- `/src/components/ProfilePopup.css` - Only quick links (68 lines)
- `/src/styles/profile-popup.css` - Complete popup (500+ lines)

**Recommendation:** Delete `/src/components/ProfilePopup.css` as it's redundant

### 3. Duplicate App Styles

**Files:**

- `/src/App.css` - Defines `.App` (6 lines)
- `/src/styles/base.css` - Also defines `.App` (35 lines)

**Recommendation:** Remove `/src/App.css` entirely

### 4. Local Color Variables in build.css

**Issue:** `build.css` redefines 30+ color variables that already exist in `variables.css`

**Lines:** 1050-1150 in build.css

**Recommendation:** Remove local color definitions and use global variables

### 5. Repeated Card Hover Effects

**Pattern Found:**

```css
.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(31, 38, 135, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}
```

**Locations:**

- `.about-card` (components.css)
- `.project-card` (components.css)
- `.team-card` (sections.css)
- `.event-card` (components.css)
- `.challenge-card` (components.css)

**Recommendation:** Create a shared `.card-hover-effect` class

### 6. Duplicate Button Definitions

**Issue:** `.btn`, `.btn-primary`, `.btn-secondary` defined multiple times

**Locations:**

- `components.css` (primary definition)
- Inline styles in LMS.tsx, Shop.tsx, etc.

**Recommendation:** Remove inline button styles, use classes from components.css

## Estimated Savings

- **Lines of Code:** ~800 lines
- **File Size:** ~25KB
- **Files to Remove:** 2 complete files

## Action Items

### High Priority

1. ✅ Delete `/src/components/ProfilePopup.css`
2. ✅ Delete `/src/App.css`
3. ✅ Remove color variables from `build.css` (lines 1050-1150)

### Medium Priority

4. Consolidate navbar files (choose one implementation)
5. Create shared card hover utility class
6. Remove inline button styles from components

### Low Priority

7. Audit all CSS files for unused selectors
8. Consider CSS modules for component-specific styles
9. Implement CSS-in-JS for truly component-scoped styles
