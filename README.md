# ESDC React Application

A modern React application for the Embedded Systems Design Club (ESDC) built with Vite, featuring authentication, theme switching, and responsive design.

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** with strict layered architecture.

📖 **[Read the Architecture Documentation](./ARCHITECTURE.md)** - **MUST READ** for all developers

Key architectural documents:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete architecture overview and principles
- **[Architecture Guidelines](./docs/architecture/GUIDELINES.md)** - Strict rules and requirements
- **[Design Patterns](./docs/architecture/PATTERNS.md)** - Common patterns and examples
- **[DDD Quick Reference](./docs/DDD_QUICK_REFERENCE.md)** - Quick reference for daily work

## Features

- **Domain-Driven Design**: Clean architecture with proper separation of concerns
- **Modern React Setup**: Built with React 19 and TypeScript with Vite
- **Type Safety**: Full TypeScript implementation with strict mode
- **Authentication**: GitHub OAuth integration with login/logout functionality
- **Theme Switching**: Dark/Light mode toggle with persistent storage
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **React Router**: Client-side routing for navigation
- **TanStack Query**: Efficient data fetching and caching
- **Testing**: Comprehensive test suite with Vitest
- **LMS (Learning Management System)**: Complete course management platform - see [LMS Implementation Guide](./docs/LMS_IMPLEMENTATION_GUIDE.md)

## Documentation

📚 **[Complete Documentation Index](./docs/README.md)** - Browse all documentation

Key documentation:
- **[LMS Implementation Guide](./docs/LMS_IMPLEMENTATION_GUIDE.md)** - Complete guide for implementing and using the LMS
- **[Architecture](./ARCHITECTURE.md)** - System architecture
- **[DDD Quick Reference](./docs/DDD_QUICK_REFERENCE.md)** - Domain-Driven Design patterns
- **[Theme System](./docs/THEME_SYSTEM.md)** - Theming and styling guide
- **[Contributing](./docs/CONTRIBUTE.md)** - How to contribute

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── domain/              # 🟢 Domain Layer - Business Logic
│   ├── entities/        # Business entities (User, Challenge, Project, Event)
│   ├── value-objects/   # Value objects (Email, Points, Difficulty)
│   ├── services/        # Domain services
│   ├── events/          # Domain events & event bus
│   └── repositories/    # Repository interfaces
│
├── application/         # 🔵 Application Layer - Use Cases
│   ├── use-cases/       # Application use cases
│   ├── ApplicationService.ts  # Main facade for UI
│   └── Container.ts     # Dependency injection
│
├── infrastructure/      # 🟡 Infrastructure Layer - External Services
│   ├── api/            # API clients
│   └── repositories/   # Repository implementations
│
├── app/                # 🔴 Presentation Layer - Application Setup
│   ├── providers/      # React context providers
│   └── router/         # Route configuration
│
├── features/           # Feature modules (auth, admin, challenges, etc.)
├── components/         # Reusable UI components
├── pages/             # Page components
└── shared/            # Shared utilities and hooks
```

**Important**: Always use `ApplicationService` from UI components. Never access repositories or infrastructure directly.

```typescript
// ✅ Correct
import applicationService from '@/application/ApplicationService';
const users = await applicationService.getAllUsers();

// ❌ Wrong
import { userRepository } from '@/infrastructure';
const users = await userRepository.findAll();
```

## Authentication

The application includes a complete authentication system:

- **Login Page**: `/login` route with GitHub OAuth integration
- **Mock Authentication**: For development, uses mock data instead of real GitHub API
- **Persistent Sessions**: User authentication state stored in localStorage
- **Protected Routes**: Authentication state management

### Using Authentication

```jsx
import { useState, useEffect } from 'react';

const MyComponent = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('github_token');
    const userData = localStorage.getItem('github_user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  // Component logic...
};
```

## Theme System

The application supports dark and light themes:

- **Automatic Detection**: Respects system preference on first load
- **Persistent Storage**: Theme choice saved in localStorage
- **Smooth Transitions**: CSS transitions for theme changes
- **Global State**: Theme state managed at App level

## React Icons Integration

The project uses React Icons for consistent iconography:

```jsx
import { FaGithub, FaUser, FiSun, FiMoon } from 'react-icons/fa';

// Usage
<FaGithub size={24} />
<FiSun className="theme-icon" />
```

Available icon libraries:

- **FA** (Font Awesome)
- **FI** (Feather Icons)
- **MD** (Material Design)
- **AI** (Ant Design)
- And many more...

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Technologies Used

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **React Icons**: Icon library
- **Supabase**: Backend services
- **Bootstrap**: CSS framework
- **ESLint**: Code linting

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test your changes thoroughly
4. Update documentation as needed

## License

© 2025 ESDC. All rights reserved.
