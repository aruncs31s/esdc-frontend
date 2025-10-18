# Pitch Black Theme System Documentation

## Overview

This website now uses a **unified pitch black theme system** with a centralized stylesheet architecture. All styling is driven by CSS custom properties (variables) defined in a single location, making it easy to maintain and modify the entire website's appearance.

## Theme Architecture

```
src/
├── styles/
│   ├── variables.css        ← CSS Custom Properties (Theme Variables)
│   ├── theme.css            ← Global Theme Styles (NEW - Main stylesheet)
│   ├── base.css             ← Reset & container styles
│   ├── animations.css       ← Global animations
│   ├── navbar.css           ← Navigation styles
│   ├── footer.css           ← Footer styles
│   ├── [feature].css        ← Feature-specific overrides
│   └── ...
├── index.css                ← Main CSS entry point (imports all)
└── App.tsx
```

## Color System

### Pitch Black Theme Variables

All colors are defined as CSS custom properties in `variables.css`:

```css
:root {
  /* Base Colors - Pure Black */
  --base: #000000;
  --mantle: #0a0a0a;
  --crust: #050505;

  /* Text Colors - Bright for contrast */
  --text: #ffffff;
  --subtext1: #e0e0e0;
  --subtext0: #b0b0b0;

  /* Surface Colors - Dark grays for depth */
  --surface0: #1a1a1a;
  --surface1: #2a2a2a;
  --surface2: #3a3a3a;

  /* Accent Colors - Vibrant */
  --blue: #7da6ff;
  --mauve: #da70d6;
  --green: #51cf66;
  --yellow: #ffd700;
  --red: #ff6b6b;
  --sky: #4da6ff;
  /* ... and more */
}
```

### Semantic Color Variables

Use semantic variables instead of raw colors:

```css
:root {
  /* Primary Actions */
  --color-primary: var(--blue);
  --color-secondary: var(--mauve);

  /* Status Colors */
  --color-success: var(--green);
  --color-warning: var(--yellow);
  --color-danger: var(--red);
  --color-info: var(--sky);

  /* Backgrounds */
  --color-bg-primary: var(--base); /* #000000 */
  --color-bg-secondary: var(--surface0); /* #1a1a1a */
  --color-bg-tertiary: var(--surface1); /* #2a2a2a */

  /* Text */
  --color-text-primary: var(--text); /* #ffffff */
  --color-text-secondary: var(--subtext1); /* #e0e0e0 */
  --color-text-muted: var(--subtext0); /* #b0b0b0 */

  /* Borders */
  --color-border: var(--surface2); /* #3a3a3a */
  --color-border-focus: var(--blue); /* #7da6ff */

  /* Components */
  --color-card-bg: var(--surface0); /* #1a1a1a */
  --color-input-bg: var(--mantle); /* #0a0a0a */
  --color-input-border: var(--surface1); /* #2a2a2a */
  --color-hover: var(--surface2); /* #3a3a3a */
}
```

## Using the Theme System

### In CSS Files

```css
/* ✅ CORRECT - Use semantic variables */
.my-component {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

/* ✅ ALSO CORRECT - Use accent colors */
.my-button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
}

/* ❌ AVOID - Hardcoded colors */
.my-old-component {
  background-color: #1a1a1a;
  color: white;
}
```

### In React/TSX Components

```tsx
// Using Tailwind utilities (preferred)
export function MyComponent() {
  return (
    <div className="bg-pitchblack-surface0 text-pitch-white border border-pitch-border">
      <button className="bg-primary text-pitch-black">Click Me</button>
    </div>
  );
}

// Or using CSS variables with inline styles (fallback)
export function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        color: 'var(--color-text-primary)',
      }}
    >
      Content
    </div>
  );
}
```

### Available Tailwind Classes

```tsx
// Background colors
<div className="bg-pitch-black">...</div>
<div className="bg-pitch-dark">...</div>
<div className="bg-pitch-surface">...</div>

// Text colors
<p className="text-pitch-white">...</p>
<p className="text-pitch-light">...</p>
<p className="text-pitch-muted">...</p>

// Primary semantic colors
<div className="bg-primary">...</div>
<div className="bg-success">...</div>
<div className="bg-warning">...</div>
<div className="bg-danger">...</div>

// Borders
<div className="border border-pitch-border">...</div>
<div className="border border-pitch-focus">...</div>
```

## Global Theme Styles

### Automatically Styled Elements

The following elements are automatically styled using theme variables:

- **Typography**: `h1-h6`, `p`, `a`, `code`
- **Forms**: `input`, `textarea`, `select`, `button`
- **Cards**: `.card`, `.component-card`, `.modal`, `.panel`
- **Navigation**: `nav`, `.navbar`, `.nav-link`
- **Tables**: `table`, `thead`, `th`, `td`
- **Alerts**: `.alert`, `.notification`, `.toast`
- **Badges**: `.badge`, `.tag`
- **Utilities**: `.text-primary`, `.bg-secondary`, `.border-primary`, etc.

### Example: Automatic Button Styling

```tsx
// ✅ Automatically styled with pitch black theme
<button>Submit</button>

// Results in:
// - Background: var(--color-primary) = #7da6ff
// - Color: var(--color-bg-primary) = #000000
// - Hover effect with reduced opacity
```

## Customizing the Theme

### To Change a Single Color

Edit `src/styles/variables.css`:

```css
:root {
  --blue: #7da6ff; /* Change this value */
}
```

All components using `var(--color-primary)` will update automatically.

### To Add a New Theme Color

1. Add to `:root` in `variables.css`:

   ```css
   :root {
     --custom-color: #your-hex-code;
   }
   ```

2. Add semantic variable:

   ```css
   --color-custom: var(--custom-color);
   ```

3. Add Tailwind color in `tailwind.config.ts`:
   ```typescript
   colors: {
     custom: {
       DEFAULT: '#your-hex-code',
     }
   }
   ```

### To Create a Variant Theme

Create a new CSS class (e.g., for a light theme):

```css
/* src/styles/variables.css */
.light-theme {
  --base: #ffffff;
  --text: #000000;
  /* ... override other variables */
}
```

Toggle with JavaScript:

```tsx
document.documentElement.classList.toggle('light-theme');
```

## Best Practices

### ✅ DO

- Use semantic variables: `var(--color-primary)`, `var(--color-bg-secondary)`
- Use Tailwind utilities when possible: `className="bg-primary text-pitch-white"`
- Keep styles in CSS files, not inline
- Use descriptive class names: `.card`, `.button-primary`

### ❌ DON'T

- Hardcode colors: `background-color: #1a1a1a;`
- Mix old and new color systems
- Use `--base`, `--text`, etc. directly; use semantic variables instead
- Create component-specific color variables

## File Organization

### When to Create Component-Specific Styles

Create a new CSS file only if:

- Styles are complex and feature-specific
- Multiple components need the same styles
- File will exceed 500 lines

Example: `src/styles/user-profile.css` for all user profile styles

### Import Order in `index.css`

```css
/* 1. Theme foundation */
@import './styles/variables.css';
@import './styles/theme.css';

/* 2. Global utilities */
@import './styles/animations.css';

/* 3. Layout components */
@import './styles/navbar.css';
@import './styles/footer.css';

/* 4. Feature modules */
@import './styles/dashboard.css';
```

## Responsive Design

Global responsive utilities are included in `theme.css`:

```css
@media (max-width: 768px) {
  /* Mobile adjustments */
  body {
    font-size: 14px;
  }
  h1 {
    font-size: 1.8rem;
  }
  /* ... */
}
```

For component-specific responsive styles, add to respective CSS file.

## Accessibility

The theme system includes:

- High contrast colors for text readability
- Sufficient color differentiation for color-blind users
- Focus styles for keyboard navigation
- Reduced motion support

## Migration Guide (from Old System)

If migrating from hardcoded colors:

### Before:

```css
.my-component {
  background-color: #1a1a1a;
  color: white;
  border: 1px solid #3a3a3a;
}
```

### After:

```css
.my-component {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

## Troubleshooting

### Colors not applying?

1. Check that `variables.css` is imported first
2. Ensure you're using `var(--variable-name)` syntax
3. Clear browser cache and rebuild

### Tailwind colors not working?

1. Restart dev server
2. Check `tailwind.config.ts` for typos
3. Run `npm run build` to regenerate Tailwind CSS

### Need fallback colors?

The theme system includes fallbacks in `theme.css` for all globally styled elements.

## Support

For questions or contributions:

1. Check this documentation
2. Review `src/styles/theme.css` for examples
3. Check component-specific CSS files for patterns
