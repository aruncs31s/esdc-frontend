# Backend Integration Guide

This React application is integrated with a Go backend that provides authentication and user management features.

## Backend Routes

The following Go backend routes are integrated:

- `POST /user/login` - User authentication
- `POST /user/register` - User registration
- `POST /user/logout` - User logout
- `GET /user/profile` - Get user profile
- `GET /user/challenges` - Get user challenges
- `GET /user/submissions` - Get user submissions
- `POST /user/sync-repo` - Sync repository data

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:8080
```

## API Integration

### Authentication Flow

1. **Login**: Users can log in using email/password
2. **Registration**: New users can register with name, email, password, and optional GitHub username
3. **Token Storage**: JWT tokens are stored in localStorage as `auth_token`
4. **User Data**: User information is stored in localStorage as `user_data`

### API Service

The `src/services/api.js` file handles:
- Axios configuration with base URL
- Request interceptors for adding auth tokens
- Response interceptors for handling 401 errors
- Organized API methods for auth and user operations

### Authentication Context

The `src/contexts/AuthContext.jsx` provides:
- Global authentication state management
- Login/logout functions
- User data management
- Authentication status checking

## Components

### Updated Components

1. **LoginForm** (`src/components/LoginForm.jsx`)
   - Email/password login form
   - Integrates with backend authentication
   - Redirects to profile on success

2. **Register** (`src/components/Register.jsx`)
   - User registration form
   - Form validation
   - Success/error handling

3. **UserProfile** (`src/components/UserProfile.jsx`)
   - Displays user information
   - Shows challenges and submissions
   - Repository sync functionality

4. **Navbar** (`src/components/Navbar.jsx`)
   - Authentication-aware navigation
   - Login/logout buttons based on auth state

## Development Setup

1. Start your Go backend server on port 8080
2. Install dependencies: `npm install`
3. Start the React development server: `npm run dev`
4. The Vite proxy will forward `/api/*` requests to your backend

## Production Setup

1. Set `VITE_BACKEND_URL` to your production backend URL
2. Build the application: `npm run build`
3. Serve the built files from the `dist/` directory

## CORS Configuration

For production, ensure your Go backend allows CORS requests from your frontend domain.

## Error Handling

- Network errors are caught and displayed to users
- 401 responses automatically clear auth data and redirect to login
- Form validation prevents invalid submissions
- Loading states provide user feedback

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- All API requests include the Authorization header when authenticated
- Form inputs are validated both client-side and should be validated server-side
- HTTPS should be used in production