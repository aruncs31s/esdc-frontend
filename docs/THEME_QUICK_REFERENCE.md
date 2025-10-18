# Pitch Black Theme - Quick Reference

## Color Variables Quick Lookup

### Semantic Colors (USE THESE)

```css
--color-primary       /* #7da6ff - Main actions & links */
--color-secondary     /* #da70d6 - Secondary actions */
--color-success       /* #51cf66 - Success states */
--color-warning       /* #ffd700 - Warning states */
--color-danger        /* #ff6b6b - Error states */
--color-info          /* #4da6ff - Info messages */

--color-bg-primary    /* #000000 - Main background */
--color-bg-secondary  /* #1a1a1a - Secondary bg (cards) */
--color-bg-tertiary   /* #2a2a2a - Tertiary bg */

--color-text-primary   /* #ffffff - Main text */
--color-text-secondary /* #e0e0e0 - Secondary text */
--color-text-muted     /* #b0b0b0 - Muted text */

--color-border         /* #3a3a3a - Default border */
--color-border-focus   /* #7da6ff - Focused border */

--color-card-bg        /* #1a1a1a - Card background */
--color-input-bg       /* #0a0a0a - Input background */
--color-input-border   /* #2a2a2a - Input border */
```

## Common CSS Patterns

### Basic Component

```css
.my-component {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}
```

### Interactive Element

```css
.my-button {
  background-color: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.my-button:hover {
  opacity: 0.85;
}
```

### Input Field

```css
.my-input {
  background-color: var(--color-input-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-input-border);
  padding: 8px 12px;
  border-radius: 4px;
}

.my-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(125, 166, 255, 0.1);
}
```

### Status Badge

```css
.badge-success {
  background-color: rgba(81, 207, 102, 0.2);
  color: var(--color-success);
  padding: 4px 8px;
  border-radius: 12px;
}
```

## Tailwind Classes

### Quick Usage

```tsx
// Backgrounds
<div className="bg-pitch-black">Pure black</div>
<div className="bg-pitch-dark">Dark (#0a0a0a)</div>
<div className="bg-pitch-surface">Surface (#1a1a1a)</div>

// Text
<p className="text-pitch-white">White text</p>
<p className="text-pitch-light">Light gray</p>
<p className="text-pitch-muted">Muted gray</p>

// Semantic
<button className="bg-primary text-pitch-white">Primary</button>
<button className="bg-success">Success</button>
<button className="bg-danger">Danger</button>

// Borders
<div className="border border-pitch-border">Normal</div>
<div className="border-2 border-pitch-focus">Focused</div>
```

## When Styling

### For a New Component

1. **Create CSS file** (if complex): `src/styles/my-feature.css`
2. **Use semantic variables**: `var(--color-bg-secondary)`
3. **Import in index.css**
4. **Test in browser**

### For Updating Existing Component

1. **Find the CSS file**
2. **Replace hardcoded colors** with CSS variables
3. **Use semantic names** where possible
4. **Test all states** (hover, focus, disabled)

## Color Swatches

| Variable     | Hex     | Usage            |
| ------------ | ------- | ---------------- |
| `--base`     | #000000 | Main background  |
| `--surface0` | #1a1a1a | Cards, panels    |
| `--surface1` | #2a2a2a | Hover states     |
| `--surface2` | #3a3a3a | Borders          |
| `--text`     | #ffffff | Primary text     |
| `--subtext1` | #e0e0e0 | Secondary text   |
| `--subtext0` | #b0b0b0 | Muted text       |
| `--blue`     | #7da6ff | Primary action   |
| `--mauve`    | #da70d6 | Secondary action |
| `--green`    | #51cf66 | Success          |
| `--yellow`   | #ffd700 | Warning          |
| `--red`      | #ff6b6b | Danger           |
| `--sky`      | #4da6ff | Info             |

## Globally Styled Elements

These elements automatically use the theme:

- ✅ All headings (`<h1>` - `<h6>`)
- ✅ Paragraphs (`<p>`)
- ✅ Links (`<a>`)
- ✅ Forms (`<input>`, `<textarea>`, `<select>`, `<button>`)
- ✅ Tables
- ✅ Alerts & notifications
- ✅ Badges & tags

No extra CSS needed!

## File Locations

```
src/
├── styles/
│   ├── variables.css    ← All color definitions
│   ├── theme.css        ← Global styles (main)
│   ├── base.css         ← Reset & containers
│   ├── navbar.css       ← Navigation
│   ├── footer.css       ← Footer
│   └── [feature].css    ← Feature-specific
└── index.css            ← Main entry point
```

## Common Tasks

### Change primary color

```css
/* In variables.css */
:root {
  --blue: #your-new-color;
}
```

### Add new accent color

```css
/* In variables.css */
:root {
  --custom: #your-color;
  --color-custom: var(--custom);
}

/* In tailwind.config.ts */
colors: {
  custom: {
    default: '#your-color';
  }
}
```

### Create light variant

```css
/* In variables.css */
.light-mode {
  --base: #ffffff;
  --text: #000000;
  /* ... */
}
```

### Style disabled state

```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Tips & Tricks

1. **Use opacity for hover**: `opacity: 0.85` instead of changing color
2. **Shadows**: Use `var(--shadow)` for consistency
3. **Transitions**: Add `transition: all 0.2s ease` for smoothness
4. **Focus rings**: Use `box-shadow: 0 0 0 3px rgba(125, 166, 255, 0.1)`
5. **Don't hardcode colors**: Always use variables

## Debug

If colors look wrong:

1. Check browser DevTools: F12 → Elements
2. Look for computed color in Styles tab
3. Verify `variables.css` is imported first
4. Clear cache: `Ctrl+Shift+Delete`
5. Restart dev server: `npm run dev`

---

**Last Updated**: October 16, 2025
**Theme**: Pitch Black v1.0
