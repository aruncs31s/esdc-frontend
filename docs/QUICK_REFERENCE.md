# 🚀 ESDC Frontend - Quick Reference Card

## 📦 Path Aliases (Use These!)

\`\`\`typescript
@/ → src/
@/app → src/app/
@/features → src/features/
@/shared → src/shared/
@/domain → src/domain/
@/infrastructure → src/infrastructure/
@/application → src/application/
\`\`\`

## 🎯 Common Imports

\`\`\`typescript
// Auth
import { useAuth } from '@/features/auth';

// UI Components
import { Button, LoadingSpinner } from '@/shared/components/ui';

// Layout
import Header from '@/shared/components/layout/Header';
import Footer from '@/shared/components/layout/Footer';

// Utils
import { formatDate, truncateText, debounce, storage } from '@/shared/utils';

// Constants
import { ROUTES, API_CONFIG, STORAGE_KEYS, FEATURE_FLAGS } from '@/shared/constants';

// Domain
import { User } from '@/domain/entities/User';
import { Project } from '@/domain/entities/Project';
\`\`\`

## ⚡ Quick Commands

\`\`\`bash

# Development

npm run dev # Start dev server
npm run build # Build for production
npm run preview # Preview build

# Quality

npm run type-check # Check TypeScript
npm run lint # Lint code
npm run format # Format code
npm run format:check # Check formatting

# Testing

npm run test # Run tests
npm run test:ui # Tests with UI
npm run test:coverage # With coverage

# Setup

./setup-migration.sh # Install all deps
\`\`\`

## 🧩 Component Examples

### Button

\`\`\`typescript
<Button
variant="primary|secondary|danger|ghost"
size="sm|md|lg"
isLoading={false}
onClick={handler}

> Click me
> </Button>
> \`\`\`

### Loading Spinner

\`\`\`typescript
<LoadingSpinner size="sm|md|lg" />
\`\`\`

## 🔧 Utility Examples

\`\`\`typescript
// Date formatting
formatDate(new Date()) // "October 11, 2025"

// Text truncation
truncateText(longText, 100) // "Text..."

// Email validation
isValidEmail("test@example.com") // true

// Initials
getInitials("John Doe") // "JD"

// Debounce
const debounced = debounce(() => {}, 300);

// Storage
storage.auth.setToken(token);
storage.auth.getToken();
storage.auth.removeToken();
\`\`\`

## 📁 Feature Structure

\`\`\`
features/my-feature/
├── components/ # Feature components
├── hooks/ # Feature hooks
├── services/ # API calls
├── types/ # TypeScript types
└── index.ts # Barrel export
\`\`\`

## 🎨 Creating New Features

1. Create folder: \`features/my-feature/\`
2. Add structure: \`components/\`, \`hooks/\`, \`types/\`
3. Create \`index.ts\` for exports
4. Add routes in \`app/router/routes.tsx\`

## 🧪 Writing Tests

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('MyComponent', () => {
it('should render', () => {
render(<MyComponent />);
expect(screen.getByText('Text')).toBeInTheDocument();
});
});
\`\`\`

## 🔐 Environment Variables

\`\`\`bash
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_CHATBOT=true
\`\`\`

Access in code:
\`\`\`typescript
import.meta.env.VITE_API_BASE_URL
// or use API_CONFIG from constants
\`\`\`

## 📊 Constants

\`\`\`typescript
// Routes
ROUTES.HOME // '/'
ROUTES.LOGIN // '/login'
ROUTES.DASHBOARD // '/dashboard'

// Storage Keys
STORAGE_KEYS.AUTH_TOKEN
STORAGE_KEYS.USER_DATA

// Feature Flags
FEATURE_FLAGS.CHATBOT
FEATURE_FLAGS.EVENTS
\`\`\`

## 🚨 Common Patterns

### Protected Route

\`\`\`typescript
<ProtectedRoute>
<AdminPanel />
</ProtectedRoute>
\`\`\`

### Lazy Loading

\`\`\`typescript
const Page = lazy(() => import('@/pages/Page'));

<Suspense fallback={<LoadingSpinner />}>
<Page />
</Suspense>
\`\`\`

### Error Handling

\`\`\`typescript
try {
await api.call();
} catch (error) {
if (error instanceof ApiError) {
// Handle API error
}
throw error;
}
\`\`\`

## 📝 TypeScript Tips

\`\`\`typescript
// Use interfaces for objects
interface User {
id: string;
name: string;
}

// Use types for unions
type Status = 'active' | 'inactive';

// Use generics
function get<T>(key: string): T | null { }

// Avoid 'any' - use 'unknown'
const data: unknown = JSON.parse(str);
\`\`\`

## 🎯 Code Style

\`\`\`typescript
// ✅ Good
import { Button } from '@/shared/components/ui';
const MyComponent = () => { };
export { MyComponent };

// ❌ Bad
import { Button } from '../../../shared/components/ui/Button';
export default MyComponent;
\`\`\`

## 🔄 Migration Checklist

- [ ] Run setup script
- [ ] Configure .env
- [ ] Fix import paths
- [ ] Move components to features
- [ ] Update main.tsx
- [ ] Add tests
- [ ] Remove duplicates
- [ ] Update docs

## 📚 Resources

- **TRANSFORMATION_SUMMARY.md** - Complete overview
- **MIGRATION_GUIDE.md** - Step-by-step guide
- **NEW_ARCHITECTURE_README.md** - Architecture details
- **docs/** - Feature documentation

## 💡 Pro Tips

1. Use VSCode's "Organize Imports" (Shift+Alt+O)
2. Enable "Format on Save" in VSCode
3. Use TypeScript's "Go to Definition" (F12)
4. Run \`type-check\` before committing
5. Write tests alongside features

## 🆘 Troubleshooting

**Imports not working?**

- Restart IDE
- Check tsconfig.json paths
- Run \`npm install\`

**TypeScript errors?**

- Run \`npm run type-check\`
- Fix errors gradually
- Use \`// @ts-expect-error\` temporarily

**Tests failing?**

- Install deps: \`./setup-migration.sh\`
- Check setup.ts
- Verify test syntax

**Build failing?**

- Clear cache: \`rm -rf node_modules/.vite\`
- Reinstall: \`npm ci\`
- Check for circular deps

---

**Keep this card handy! 📌**
