# Pitch Black Theme - Visual Guide

## Color Palette Visualization

### Base Colors

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Pure Black - #000000          Main Background     │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Mantle - #0a0a0a              Very Dark Gray      │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Crust - #050505               Darkest Shade       │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Surface0 - #1a1a1a            Cards, Panels       │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Surface1 - #2a2a2a            Hover States        │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Surface2 - #3a3a3a            Borders             │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Accent Colors

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Blue - #7da6ff                Primary Action      │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Mauve - #da70d6               Secondary Action    │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Green - #51cf66               Success State       │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Yellow - #ffd700              Warning State       │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Red - #ff6b6b                 Error State         │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ███████  Sky - #4da6ff                 Info State          │
│  ███████                                                      │
│  ███████                                                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Text Colors

```
┌─────────────────────────────────────────────────────────────┐
│  FFFFFFFFFFFFFFFFFFFFF   Text - #ffffff                     │
│  FFFFFFFFFFFFFFFFFFFFF                Primary Text (White)  │
│  FFFFFFFFFFFFFFFFFFFFF                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  DDDDDDDDDDDDDDDDDDD    SubText1 - #e0e0e0                 │
│  DDDDDDDDDDDDDDDDDDD                Secondary Text          │
│  DDDDDDDDDDDDDDDDDDD                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  BBBBBBBBBBBBBBBBBB     SubText0 - #b0b0b0                 │
│  BBBBBBBBBBBBBBBBBB                Muted Text              │
│  BBBBBBBBBBBBBBBBBB                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Examples

### Button States

```
┌──────────────────────────────────────────────────┐
│                                                   │
│  ┌─────────────┐   ┌─────────────┐              │
│  │  BUTTON     │   │  BUTTON     │              │
│  │  Normal     │   │  Hovered    │              │
│  │  #7da6ff    │   │  opacity:85 │              │
│  └─────────────┘   └─────────────┘              │
│                                                   │
│  ┌─────────────┐   ┌─────────────┐              │
│  │  BUTTON     │   │ [BUTTON]    │              │
│  │  Active     │   │  Disabled   │              │
│  │  pressed    │   │  opacity:50 │              │
│  └─────────────┘   └─────────────┘              │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Card Component

```
┌────────────────────────────────────────┐
│                                         │
│  Card Title (Primary Text)              │
│  #e0e0e0                                │
│                                         │
│  Card content goes here with            │
│  secondary text color                   │
│  #e0e0e0                                │
│                                         │
│  Background: #1a1a1a (Surface0)        │
│  Border: 1px solid #3a3a3a (Surface2)  │
│                                         │
└────────────────────────────────────────┘
```

### Input Field

```
┌──────────────────────────────────────────┐
│  Label Text                              │
│  ┌────────────────────────────────────┐  │
│  │ Type here...                       │  │
│  │ Background: #0a0a0a (Mantle)       │  │
│  │ Text: #ffffff (White)              │  │
│  │ Border: 1px solid #2a2a2a          │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Focused field                      │  │
│  │ Border: 2px solid #7da6ff (Blue)   │  │
│  │ Shadow: Blue glow effect           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Alert Messages

```
┌─ Primary ─────────────────────────────────┐
│ ◆ Primary message with semantic color    │
│   Background: rgba(125, 166, 255, 0.1)   │
└───────────────────────────────────────────┘

┌─ Success ──────────────────────────────────┐
│ ✓ Success message with green accent       │
│   Background: rgba(81, 207, 102, 0.1)     │
└────────────────────────────────────────────┘

┌─ Warning ──────────────────────────────────┐
│ ⚠ Warning message with yellow accent      │
│   Background: rgba(255, 215, 0, 0.1)      │
└────────────────────────────────────────────┘

┌─ Danger ───────────────────────────────────┐
│ ✗ Error message with red accent           │
│   Background: rgba(255, 107, 107, 0.1)    │
└────────────────────────────────────────────┘
```

### Badge/Tag Component

```
┌──────────────────────────────────────┐
│  ▪ Default     ▪ Primary    ▪ Success │
│    #3a3a3a       #7da6ff     #51cf66  │
│                                        │
│  ▪ Warning     ▪ Danger     ▪ Info    │
│    #ffd700       #ff6b6b     #4da6ff  │
│                                        │
└──────────────────────────────────────┘
```

### Table Layout

```
┌─────────────┬──────────────┬──────────────┐
│ Header 1    │ Header 2     │ Header 3     │ ← Background: #1a1a1a
│ Bold Text   │ Bold Text    │ Bold Text    │ ← Border-bottom: 2px
├─────────────┼──────────────┼──────────────┤
│ Row 1 Data  │ Row 1 Data   │ Row 1 Data   │
│ Normal Text │ Normal Text  │ Normal Text  │ ← Background: transparent
├─────────────┼──────────────┼──────────────┤
│ Row 2 Data  │ Row 2 Data   │ Row 2 Data   │ ← Hover: #1a1a1a
│ Normal Text │ Normal Text  │ Normal Text  │
├─────────────┼──────────────┼──────────────┤
└─────────────┴──────────────┴──────────────┘
```

---

## Layout Examples

### Typical Page Layout

```
┌──────────────────────────────────────────┐
│  NAVBAR                                  │  Background: #1a1a1a
│  Logo  | Nav Items | User Menu           │  Border: 1px solid #3a3a3a
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │  HERO/CONTENT SECTION              │ │  Background: #000000
│  │  Main Content Area                 │ │  Text: #ffffff
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────┐                │
│  │  Card 1             │                │
│  │  Content...         │  ┌─────────┐   │
│  │  #1a1a1a bg        │  │ Card 2  │   │
│  └─────────────────────┘  │ Content │   │
│                           │ #1a1a1a │   │
│                           └─────────┘   │
│                                          │
├──────────────────────────────────────────┤
│  FOOTER                                  │  Background: #1a1a1a
│  Links | Copyright | Social              │  Border: 1px solid #3a3a3a
└──────────────────────────────────────────┘
```

### Dark Mode Comparison

```
BEFORE (Light Theme)              AFTER (Pitch Black Theme)
┌──────────────────┐             ┌──────────────────┐
│ Light Background │             │ ███████████████  │
│ Dark Text        │   ────→     │ ███████████████  │
│ Subtle Accents   │             │ Vibrant Accents  │
└──────────────────┘             └──────────────────┘
```

---

## Contrast Examples

### Text Contrast

```
Excellent Contrast (WCAG AAA)
────────────────────────────────────
White Text (#ffffff) on Black (#000000)
Ratio: 21:1 ✓ Perfect

Good Contrast (WCAG AA)
────────────────────────────────────
Light Gray (#e0e0e0) on Black (#000000)
Ratio: 15.3:1 ✓ Excellent

Secondary Contrast (WCAG AA)
────────────────────────────────────
Muted Gray (#b0b0b0) on Black (#000000)
Ratio: 9.3:1 ✓ Good
```

### Color Accents

```
Primary Action (Blue)
────────────────────────────────────
#7da6ff on #000000 = 5.8:1 ✓ Good

Status Colors
────────────────────────────────────
Success (#51cf66): Contrast 7.2:1 ✓
Warning (#ffd700): Contrast 9.0:1 ✓
Danger (#ff6b6b): Contrast 5.1:1 ✓
```

---

## Typography Hierarchy

```
H1 - Heading Level 1
    Large, Bold, Primary Text Color
    Used for page titles, main sections

H2 - Heading Level 2
    Medium-Large, Bold, Primary Text Color
    Used for section headers, sub-sections

H3 - Heading Level 3
    Medium, Semi-Bold, Primary Text Color
    Used for subsection titles

P - Paragraph
    Regular size, Regular weight
    Primary or Secondary Text Color
    Line height: 1.6 for readability

Small/Muted Text
    Smaller size, lighter color (#b0b0b0)
    For supplementary information

Links
    Primary Color (#7da6ff)
    Underlined when possible
    Hover: Reduced opacity
```

---

## Interactive States

### Button States Flow

```
NORMAL
  ↓
HOVER (opacity: 0.85, raised effect)
  ↓
ACTIVE (pressed effect)
  ↓
DISABLED (opacity: 0.5, cursor: not-allowed)
```

### Link States Flow

```
DEFAULT
  Color: #7da6ff
  ↓
VISITED
  Color: #7da6ff (same as default)
  ↓
HOVER
  Color: #7da6ff (opacity: 0.8)
  ↓
ACTIVE/FOCUS
  Box-shadow: glow effect
  Outline: focus ring
```

### Form Input States

```
NORMAL
  Border: 1px solid #2a2a2a
  Background: #0a0a0a
  ↓
FOCUS
  Border: 1px solid #7da6ff
  Box-shadow: 0 0 0 3px rgba(125, 166, 255, 0.1)
  ↓
ERROR
  Border: 1px solid #ff6b6b
  Background: rgba(255, 107, 107, 0.05)
  ↓
DISABLED
  Border: 1px solid #2a2a2a
  Background: #0a0a0a
  Opacity: 0.5
```

---

## Spacing & Layout Grid

```
Base Unit: 8px

Spacing Scale:
  xs: 4px    (0.5 × base)
  sm: 8px    (1 × base)
  md: 16px   (2 × base)
  lg: 24px   (3 × base)
  xl: 32px   (4 × base)
  2xl: 48px  (6 × base)
  3xl: 64px  (8 × base)

Component Padding:
  Small:   8px
  Medium:  12px
  Large:   16px
  XLarge:  24px

Component Border Radius:
  Subtle:  4px
  Default: 8px
  Large:   12px
  Full:    50% (circles)
```

---

## Shadow Hierarchy

```
No Shadow (Flat)
  Elements on the base background

sm-shadow (Subtle)
  box-shadow: 0 1px 2px var(--shadow)
  For: Slightly elevated elements

shadow (Default)
  box-shadow: 0 4px 12px var(--shadow)
  For: Cards, containers, modals

lg-shadow (Pronounced)
  box-shadow: 0 10px 28px var(--shadow)
  For: Important modals, overlays

xl-shadow (Dramatic)
  box-shadow: 0 20px 40px var(--shadow)
  For: Full-screen modals, overlays
```

---

## Animation Guidelines

```
Duration:
  Quick interactions:    0.2s
  Standard transitions:  0.3s
  Entrance animations:   0.6s
  Complex animations:    0.8s - 1s

Timing Function:
  ease              - Standard smooth
  ease-out          - Smooth start, fast end
  ease-in-out       - Smooth both ends
  cubic-bezier()    - Custom curves

Common Animations:
  Fade:             opacity transitions
  Slide:            transform: translateX/Y
  Scale:            transform: scale()
  Rotate:           transform: rotate()
  Shadow:           box-shadow transitions
```

---

## Responsive Breakpoints

```
Mobile:    320px - 767px  (xs, sm, md)
Tablet:    768px - 1023px (lg, xl)
Desktop:   1024px+        (2xl, 3xl)

Typical Layout Changes:
  Mobile:   Single column
  Tablet:   Two columns
  Desktop:  Three+ columns
```

---

## Accessibility Features

```
✓ Sufficient Contrast
  Text: 4.5:1 minimum (AA standard)
  Large Text: 3:1 minimum

✓ Focus States
  Visible focus ring on all interactive elements
  Clear keyboard navigation

✓ Color + Text
  Don't rely on color alone
  Always add icons or text labels

✓ Reduced Motion
  Respect prefers-reduced-motion
  Disable animations if user requests

✓ Semantic HTML
  Proper heading hierarchy (h1 → h6)
  Link text is descriptive
  Form labels associated with inputs
```

---

**Visual Guide Complete** ✨

Use this guide for:

- Designing new components
- Verifying color usage
- Checking contrast ratios
- Understanding spacing
- Planning layouts
- Creating mockups
