# 🏗️ ESDC Frontend - New Architecture

## 📁 Project Structure

The project has been restructured following modern best practices and feature-based architecture:

\`\`\`
src/
├── app/ # Application layer
│ ├── providers/ # All context providers
│ ├── router/ # Route configuration with lazy loading
│ └── App.tsx # Main app component
│
├── features/ # Feature-based modules
│ ├── auth/ # Authentication feature
│ │ ├── components/ # Auth-specific components
│ │ ├── hooks/ # useAuth hook
│ │ ├── services/ # Auth API calls
│ │ └── types/ # Auth types
│ ├── admin/ # Admin panel feature
│ ├── projects/ # Projects feature
│ ├── challenges/ # Challenges feature
│ └── users/ # Users feature
│
├── shared/ # Shared/reusable code
│ ├── components/  
│ │ ├── ui/ # UI components (Button, etc.)
│ │ └── layout/ # Layout components
│ ├── hooks/ # Shared custom hooks
│ ├── utils/ # Utility functions
│ ├── constants/ # Constants & config
│ └── types/ # Shared TypeScript types
│
├── domain/ # DDD Domain layer
├── infrastructure/ # DDD Infrastructure layer
├── application/ # DDD Application layer
└── **tests**/ # Test files
├── unit/ # Unit tests
└── integration/ # Integration tests
\`\`\`

## 🚀 Quick Start

### 1. Install Dependencies

Run the migration setup script:

\`\`\`bash
chmod +x setup-migration.sh
./setup-migration.sh
\`\`\`

Or install manually:

\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup

Copy the example environment file:

\`\`\`bash
cp .env.example .env
\`\`\`

Then edit \`.env\` with your configuration.

### 3. Development

\`\`\`bash
npm run dev
\`\`\`

## 📝 Available Scripts

\`\`\`bash
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run type-check # Check TypeScript errors
npm run lint # Run ESLint
npm run format # Format code with Prettier
npm run test # Run tests
npm run test:ui # Run tests with UI
npm run test:coverage # Run tests with coverage
\`\`\`

## 🎯 Key Improvements

### 1. **Path Aliases**

Use clean imports instead of relative paths:

\`\`\`typescript
// ❌ Old way
import { useAuth } from '../../../hooks/useAuth';

// ✅ New way
import { useAuth } from '@/features/auth';
\`\`\`

Available aliases:

- \`@/\` - src directory
- \`@/app\` - app layer
- \`@/features\` - feature modules
- \`@/shared\` - shared code
- \`@/domain\` - domain layer
- \`@/infrastructure\` - infrastructure layer
- \`@/application\` - application layer

### 2. **TypeScript Strict Mode**

Type safety is now enforced with strict mode enabled.

### 3. **Code Splitting**

All routes use lazy loading for better performance:

\`\`\`typescript
const Projects = lazy(() => import('@/pages/Projects'));
\`\`\`

### 4. **Testing Infrastructure**

Full testing setup with Vitest and Testing Library:

\`\`\`bash
npm run test
\`\`\`

### 5. **Code Formatting**

Automatic code formatting with Prettier:

\`\`\`bash
npm run format
\`\`\`

### 6. **Pre-commit Hooks**

Husky ensures code quality before commits.

## 📚 Documentation

- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration instructions
- [Architecture Analysis](./docs/DDD_ANALYSIS.md) - Architecture details
- [Feature Docs](./docs/features/) - Feature-specific documentation

## 🔧 Configuration Files

- **tsconfig.json** - TypeScript configuration with strict mode
- **vite.config.ts** - Vite configuration with path aliases
- **vitest.config.ts** - Testing configuration
- **.prettierrc** - Code formatting rules
- **.eslintrc** - Linting rules
- **.env.example** - Environment variables template

## 🌟 New Features

### Shared UI Components

\`\`\`typescript
import { Button, LoadingSpinner } from '@/shared/components/ui';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
\`\`\`

### Utility Functions

\`\`\`typescript
import { formatDate, truncateText, debounce } from '@/shared/utils';

const formatted = formatDate(new Date());
const short = truncateText('Long text...', 50);
\`\`\`

### Constants

\`\`\`typescript
import { ROUTES, API_CONFIG, STORAGE_KEYS } from '@/shared/constants';

navigate(ROUTES.DASHBOARD);
\`\`\`

## 🧪 Testing

### Unit Tests

\`\`\`typescript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
it('should render correctly', () => {
// test code
});
});
\`\`\`

### Component Tests

\`\`\`typescript
import { render, screen } from '@testing-library/react';

render(<Button>Click me</Button>);
expect(screen.getByText('Click me')).toBeInTheDocument();
\`\`\`

## 🔄 Migration Status

### ✅ Completed

- Path aliases configuration
- TypeScript strict mode
- Testing infrastructure
- Shared utilities and components
- Router with lazy loading
- Environment configuration

### 🚧 In Progress

- Moving components to feature modules
- Fixing TypeScript errors
- Adding comprehensive tests

### 📋 Todo

- Complete component migration
- Add integration tests
- Update all documentation
- Set up CI/CD pipeline

## 💡 Best Practices

1. **Use path aliases** for clean imports
2. **Keep features isolated** - each feature is self-contained
3. **Write tests** for new code
4. **Use TypeScript strictly** - no \`any\` types
5. **Format code** before committing
6. **Follow the DDD structure** for business logic

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: \`npm run test\`
4. Check types: \`npm run type-check\`
5. Format code: \`npm run format\`
6. Commit (pre-commit hooks will run automatically)
7. Create a pull request

## 📞 Support

- Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for migration help
- Review [docs/](./docs/) for detailed documentation
- Ask questions in team discussions

## 📄 License

See [LICENSE](./LICENSE) file for details.

---

**Note**: This architecture transformation is designed to improve:

- 📦 Code organization
- 🧪 Testability
- 🔄 Maintainability
- 🚀 Performance
- 👥 Developer experience

For questions or issues, please refer to the migration guide or reach out to the team.
\`\`\`
