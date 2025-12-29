# Project Structure - New Architecture

## Overview

The project has been reorganized following a feature-based architecture with clear separation of concerns.

## Directory Structure

```
src/
├── app/                    # Application bootstrap & configuration
│   ├── providers/          # Context providers (Auth, Theme, Shop, Settings)
│   ├── store/              # Global state management
│   ├── index.tsx          # Application entry point (was main.tsx)
│   └── router.tsx         # Route definitions (was App.tsx)
│
├── features/              # Business domain features
│   ├── auth/
│   │   ├── components/    # Login, Register, ProtectedRoute, AuthContext
│   │   ├── hooks/         # useAuth
│   │   ├── services/      # authService (API calls)
│   │   ├── types.ts       # Auth-specific types
│   │   └── index.ts       # Public API exports
│   │
│   ├── projects/
│   │   ├── components/    # Project-related UI components
│   │   ├── hooks/         # Project-specific hooks
│   │   ├── services/      # Project API services
│   │   └── index.ts
│   │
│   ├── issues/
│   │   ├── components/    # Issue tracking UI
│   │   ├── hooks/         # useIssues
│   │   ├── services/      # Issue API services
│   │   └── index.ts
│   │
│   ├── planning/
│   │   ├── components/    # Agile/planning components
│   │   ├── hooks/         # useAgile
│   │   ├── services/      # Planning API services
│   │   └── index.ts
│   │
│   └── games/
│       ├── components/    # Game components (Snake, Tetris, etc.)
│       ├── hooks/
│       ├── services/
│       └── index.ts
│
├── shared/                # Reusable utilities & components
│   ├── components/
│   │   ├── ui/           # Presentational components
│   │   │   ├── modals/   # Modal components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProfileCard.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Layout.tsx
│   │   └── Navbar.tsx
│   │
│   ├── api/              # HTTP client & base API setup
│   │   ├── ApiClient.ts  # Axios instance
│   │   └── index.ts
│   │
│   ├── hooks/            # Generic reusable hooks
│   ├── utils/            # Utility functions
│   └── constants/        # App-wide constants
│
├── pages/                # Route components (thin wrappers)
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Login.tsx (redirects to feature)
│   └── ...
│
├── types/                # Global TypeScript type definitions
├── assets/               # Static assets (images, fonts, etc.)
└── styles/               # Global styles

## Migration Notes

### Updated Files
- `/index.html` - Updated script src to `/src/app/index.tsx`
- `app/index.tsx` - Entry point (was main.tsx)
- `app/router.tsx` - Router setup (was App.tsx)

### Import Path Changes
- `@/features/auth` - Auth components and hooks
- `@/shared/components` - Shared UI components
- `@/shared/api` - API client
- `@/pages/*` - Page components

### Old Folders to Remove (after verification)
- `/src/modules` (moved to features)
- `/src/components` (split to features & shared)
- `/src/contexts` (moved to app/providers)
- `/src/hooks` (split to features & shared)
- `/src/infrastructure` (moved to shared/api)
- `/src/application`
- `/src/domain`
- `/src/dto`
- `/src/services`

## Benefits
1. **Feature Isolation** - Each feature is self-contained
2. **Clear Boundaries** - Shared vs feature-specific code
3. **Easier Testing** - Test features in isolation
4. **Better Scalability** - Add new features without affecting others
5. **Improved Developer Experience** - Clear where to find/add code
```
