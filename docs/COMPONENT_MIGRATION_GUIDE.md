# Component Migration Guide - Pitch Black Theme

## Overview

This guide helps update existing components to use the new unified pitch black theme system.

## Steps to Migrate a Component

### Step 1: Identify Hardcoded Colors

Look for:

```tsx
// ❌ Hardcoded in inline styles
style={{ backgroundColor: '#1a1a1a' }}

// ❌ Hardcoded in CSS files
background-color: white;
color: #333;
border: 1px solid #ccc;

// ✅ Using CSS variables
background-color: var(--color-bg-secondary);
```

### Step 2: Replace with Theme Variables

| Old                  | New                           | Use Case         |
| -------------------- | ----------------------------- | ---------------- |
| `#000000` or `black` | `var(--color-bg-primary)`     | Main background  |
| `#1a1a1a`            | `var(--color-bg-secondary)`   | Cards, panels    |
| `#2a2a2a`            | `var(--color-bg-tertiary)`    | Hover states     |
| `#ffffff` or `white` | `var(--color-text-primary)`   | Main text        |
| `#e0e0e0`            | `var(--color-text-secondary)` | Secondary text   |
| `#b0b0b0`            | `var(--color-text-muted)`     | Muted text       |
| `#7da6ff`            | `var(--color-primary)`        | Primary action   |
| `#da70d6`            | `var(--color-secondary)`      | Secondary action |
| `#51cf66`            | `var(--color-success)`        | Success state    |
| `#ffd700`            | `var(--color-warning)`        | Warning state    |
| `#ff6b6b`            | `var(--color-danger)`         | Error state      |
| `#4da6ff`            | `var(--color-info)`           | Info state       |

### Step 3: Update CSS Files

**Before:**

```css
.my-card {
  background-color: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: white;
}

.my-button {
  background-color: #7da6ff;
  color: black;
}
```

**After:**

```css
.my-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.my-button {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
}
```

### Step 4: Update React Components

**Before (Inline Styles):**

```tsx
<div
  style={{
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
  }}
>
  Content
</div>
```

**After (Tailwind Classes):**

```tsx
<div className="bg-pitch-surface text-pitch-white">Content</div>
```

Or with CSS variables:

```tsx
<div
  style={{
    backgroundColor: 'var(--color-bg-secondary)',
    color: 'var(--color-text-primary)',
  }}
>
  Content
</div>
```

### Step 5: Test & Verify

1. Visual appearance matches previous version
2. All states work (hover, focus, disabled)
3. Responsive design still works
4. Accessibility is maintained
5. No console errors

## Component-by-Component Examples

### Example 1: Card Component

**Original:**

```tsx
export const Card = ({ title, children }) => {
  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <h3 style={{ color: 'white' }}>{title}</h3>
      {children}
    </div>
  );
};
```

**Migrated (Option 1 - Tailwind):**

```tsx
export const Card = ({ title, children }) => {
  return (
    <div className="bg-pitch-surface border border-pitch-border rounded-lg p-4">
      <h3 className="text-pitch-white">{title}</h3>
      {children}
    </div>
  );
};
```

**Migrated (Option 2 - CSS File):**

```css
/* card.css */
.card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
}

.card-title {
  color: var(--color-text-primary);
}
```

```tsx
export const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      {children}
    </div>
  );
};
```

### Example 2: Button Component

**Original:**

```tsx
export const Button = ({ onClick, children, variant = 'primary' }) => {
  const styles = {
    primary: {
      backgroundColor: '#7da6ff',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
    },
  };

  return (
    <button style={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
};
```

**Migrated:**

```tsx
export const Button = ({ onClick, children, variant = 'primary' }) => {
  const classes = {
    primary: 'bg-primary text-pitch-black hover:opacity-85',
    secondary: 'bg-pitch-surface text-pitch-white hover:opacity-85',
  };

  return (
    <button className={`px-4 py-2 rounded transition ${classes[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### Example 3: Alert Component

**Original:**

```tsx
export const Alert = ({ type, message }) => {
  const colors = {
    success: { bg: '#1a3a1a', text: '#51cf66' },
    warning: { bg: '#3a3a1a', text: '#ffd700' },
    error: { bg: '#3a1a1a', text: '#ff6b6b' },
  };

  const style = colors[type];

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: '12px',
        borderRadius: '4px',
      }}
    >
      {message}
    </div>
  );
};
```

**Migrated:**

```css
/* alert.css */
.alert {
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid;
  background-color: var(--color-bg-secondary);
  transition: all 0.2s ease;
}

.alert-success {
  background-color: rgba(81, 207, 102, 0.1);
  border-left-color: var(--color-success);
  color: var(--color-success);
}

.alert-warning {
  background-color: rgba(255, 215, 0, 0.1);
  border-left-color: var(--color-warning);
  color: var(--color-warning);
}

.alert-error {
  background-color: rgba(255, 107, 107, 0.1);
  border-left-color: var(--color-danger);
  color: var(--color-danger);
}
```

```tsx
export const Alert = ({ type, message }) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};
```

## Checklist for Migration

- [ ] Identified all hardcoded colors
- [ ] Replaced with corresponding CSS variables
- [ ] Updated all inline styles to use Tailwind classes
- [ ] Created/updated CSS files with theme variables
- [ ] Tested component appearance
- [ ] Tested hover/focus/disabled states
- [ ] Checked responsive behavior
- [ ] Verified accessibility
- [ ] No console warnings/errors
- [ ] Committed changes with descriptive message

## Common Patterns

### Hover State

```css
/* Before */
.button:hover {
  background-color: #6d95ee;
}

/* After */
.button:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}
```

### Focus State

```css
/* Before */
.input:focus {
  outline: 2px solid #7da6ff;
}

/* After */
.input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(125, 166, 255, 0.1);
}
```

### Disabled State

```css
/* Before & After - Same */
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Files to Update Priority

### High Priority (UI Components)

1. ✅ Navbar.tsx / navbar.css
2. ✅ Footer.tsx / footer.css
3. ✅ Cards / card components
4. ✅ Buttons / button variants
5. ✅ Forms / form elements

### Medium Priority (Feature Pages)

1. Dashboard components
2. Admin panel components
3. User profile components
4. Leaderboard components

### Low Priority (Special Cases)

1. Game components (keep game-specific colors)
2. Canvas-based components
3. Third-party integrations

## Exceptions

### Components to Keep As-Is

1. **Game Components** - Tetris, Snake, Simon, etc.
   - These have intentional color schemes
   - Game colors serve a specific purpose

2. **Canvas/WebGL Components**
   - Three.js scenes
   - Charts with specific color coding

3. **Third-party Integrations**
   - Embedded widgets
   - External iframes

## Testing Checklist

```tsx
// Test in multiple scenarios
- [ ] Light theme (if applicable)
- [ ] Dark theme
- [ ] Mobile view
- [ ] Tablet view
- [ ] Desktop view
- [ ] With keyboard navigation
- [ ] With screen reader
- [ ] With high contrast mode
- [ ] Print view
```

## Rollback

If a component breaks during migration:

```bash
# Revert the file
git checkout HEAD -- src/components/MyComponent.tsx

# Or revert the entire migration
git revert <commit-hash>
```

## Support

Need help?

1. Check `docs/THEME_SYSTEM.md` for variable reference
2. Look at `src/styles/theme.css` for examples
3. Review completed migrations in Git history
4. Check color palette: `docs/THEME_QUICK_REFERENCE.md`

## Git Commit Message Template

```
refactor: migrate [ComponentName] to theme system

- Replaced hardcoded colors with CSS variables
- Updated inline styles to Tailwind classes
- Added component CSS file
- Tested on mobile, tablet, desktop

Related to: pitch-black-theme
```

---

**Migration Status Tracker**

Track completion in your project:

| Component | Status | Reviewer | Notes |
| --------- | ------ | -------- | ----- |
| Navbar    | ⏳     | -        | -     |
| Footer    | ⏳     | -        | -     |
| Cards     | ⏳     | -        | -     |
| Buttons   | ⏳     | -        | -     |
| Forms     | ⏳     | -        | -     |

(✅ Done, ⏳ In Progress, 🔲 To Do)
