# ESDC React Application

A modern React application for the Embedded Systems Design Club (ESDC) built with Vite, featuring authentication, theme switching, and responsive design.

## Features

- **Modern React Setup**: Built with React 19 and Vite for fast development
- **Authentication**: GitHub OAuth integration with login/logout functionality
- **Theme Switching**: Dark/Light mode toggle with persistent storage
- **Responsive Design**: Mobile-first design with Bootstrap integration
- **React Router**: Client-side routing for navigation
- **React Icons**: Beautiful icon library integration

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
├── components/
│   ├── Navbar.jsx          # Navigation component with theme toggle
│   ├── Login.jsx           # Authentication component with GitHub OAuth
│   ├── Contact.jsx         # Contact information component
│   ├── Footer.jsx          # Footer component
│   └── ...
├── pages/
│   └── Home.jsx           # Main landing page
├── App.jsx                # Main application component with routing
└── main.jsx              # Application entry point
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
