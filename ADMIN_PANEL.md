# Admin Panel Documentation

## 🔐 Overview
The Admin Panel is a protected area accessible only to users with the `admin` role. It provides comprehensive management capabilities for users, projects, and challenges.

## 🚀 Features

### 1. **Role-Based Access Control**
- **JWT Verification**: The system checks the JWT token for the `admin` role
- **Protected Routes**: Uses `ProtectedRoute` component to restrict access
- **Automatic Redirect**: Non-admin users are redirected to home page

### 2. **Dashboard Statistics**
Real-time statistics displayed in modern glass-morphism cards:
- Total Users
- Total Projects  
- Total Challenges
- Active Users

### 3. **User Management**
- View all registered users
- Search users by username or email
- Delete users (with confirmation)
- View user roles and status
- Color-coded badges for roles (admin/user)

### 4. **Project Management**
- View all projects
- Create new projects with:
  - Title
  - Description
  - GitHub URL
  - Status tracking
- Edit existing projects
- Delete projects (with confirmation)
- Search projects by title or description

### 5. **Challenge Management**
- View all challenges
- Create new challenges with:
  - Title
  - Description
  - Difficulty level (Easy/Medium/Hard)
  - Points reward
- Edit existing challenges
- Delete challenges (with confirmation)
- Color-coded difficulty badges

## 📁 File Structure

```
src/
├── pages/
│   └── AdminPanel.jsx          # Main admin panel component
├── components/
│   └── ProtectedRoute.jsx      # Route protection wrapper
├── contexts/
│   └── AuthContext.jsx         # Authentication context with role
└── services/
    └── api.js                  # Admin API endpoints
```

## 🔧 Implementation Details

### JWT Role Verification

The system verifies admin access through JWT token:

```javascript
// In AuthContext.jsx
const decoded = jwtDecode(token);
setUser({
  email: decoded.sub,
  username: decoded.user,
  role: decoded.role  // 'admin' or 'user'
});
```

### Protected Route Component

```javascript
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

### Admin API Endpoints

#### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

#### Users
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete a user
- `PUT /api/admin/users/:id` - Update a user

#### Projects
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create a project
- `PUT /api/admin/projects/:id` - Update a project
- `DELETE /api/admin/projects/:id` - Delete a project

#### Challenges
- `GET /api/admin/challenges` - Get all challenges
- `POST /api/admin/challenges` - Create a challenge
- `PUT /api/admin/challenges/:id` - Update a challenge
- `DELETE /api/admin/challenges/:id` - Delete a challenge

## 🎨 UI/UX Features

### Modern Design Elements
- **Glassmorphism**: Frosted glass effect on cards
- **Gradient Accents**: Colorful gradients for text and buttons
- **Smooth Animations**: Transitions and hover effects
- **Responsive Layout**: Works on all device sizes
- **Search Functionality**: Real-time filtering
- **Modal Forms**: Beautiful create/edit modals

### Color Coding
- **Admin Role**: Red badge
- **User Role**: Blue badge
- **Active Status**: Green badge
- **Inactive Status**: Yellow badge
- **Easy Difficulty**: Green badge
- **Medium Difficulty**: Yellow badge
- **Hard Difficulty**: Red badge

## 🔒 Security Features

### 1. **Route Protection**
```javascript
// Only admin users can access
if (requiredRole && user?.role !== requiredRole) {
  return <Navigate to="/" replace />;
}
```

### 2. **Token Verification**
- JWT token checked on every request
- Automatic logout on token expiration
- Role verification from decoded JWT

### 3. **API Authorization**
- Bearer token in request headers
- 401 response handling
- Automatic redirect to login

## 📱 Responsive Design

### Desktop View
- Full dashboard with all features
- Side-by-side layouts
- Large data tables

### Tablet View
- Optimized layouts
- Adjusted card sizes
- Readable tables

### Mobile View
- Stacked cards
- Hamburger menu
- Touch-friendly buttons
- Scrollable tables

## 🚀 Usage

### Accessing Admin Panel

1. **Login as Admin**:
   ```
   - Username: admin_user
   - Password: your_password
   ```

2. **Navigate to Admin Panel**:
   - Click "Admin Panel" in the navbar (only visible to admins)
   - Or visit: `http://localhost:5173/admin`

3. **Manage Resources**:
   - Switch between tabs: Users, Projects, Challenges
   - Use search to filter items
   - Click "Create" to add new items
   - Use Edit/Delete buttons for modifications

### Creating New Items

#### Create Project
1. Click "Create Project" button
2. Fill in form:
   - Title
   - Description
   - GitHub URL (optional)
3. Click "Create"

#### Create Challenge
1. Click "Create Challenge" button
2. Fill in form:
   - Title
   - Description
   - Difficulty (Easy/Medium/Hard)
   - Points
3. Click "Create"

## 🛠️ Backend Requirements

Your backend should implement these endpoints:

```javascript
// Admin Stats
GET /api/admin/stats
Response: {
  totalUsers: number,
  totalProjects: number,
  totalChallenges: number,
  activeUsers: number
}

// Get All Users
GET /api/admin/users
Response: [{
  id: number,
  username: string,
  email: string,
  role: 'admin' | 'user',
  status: 'active' | 'inactive'
}]

// Create Project
POST /api/admin/projects
Body: {
  title: string,
  description: string,
  githubUrl?: string
}

// Create Challenge
POST /api/admin/challenges
Body: {
  title: string,
  description: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  points: number
}
```

## 🔄 Mock Data Fallback

If backend APIs are not ready, the admin panel uses mock data:
- 45 total users
- 12 total projects
- 28 total challenges
- 32 active users

This allows frontend development without backend dependencies.

## 🎯 Best Practices

1. **Always verify role on backend**: Don't rely solely on frontend checks
2. **Validate all inputs**: Use form validation
3. **Confirm destructive actions**: Show confirmation dialogs for delete operations
4. **Provide feedback**: Show success/error messages
5. **Handle errors gracefully**: Show user-friendly error messages
6. **Log actions**: Keep audit trail of admin actions

## 🐛 Troubleshooting

### "Access Denied" Error
- Check if user has admin role in JWT
- Verify token is not expired
- Check JWT decoding in AuthContext

### API Errors
- Check backend is running
- Verify API endpoints match
- Check CORS settings
- Inspect network tab for errors

### Data Not Updating
- Check API responses
- Verify loadAdminData() is called after mutations
- Check console for errors

## 🚀 Future Enhancements

- [ ] Bulk operations (delete multiple items)
- [ ] Export data to CSV/Excel
- [ ] Advanced filtering and sorting
- [ ] Activity logs and audit trail
- [ ] User analytics and charts
- [ ] Email notifications
- [ ] Role management (create custom roles)
- [ ] Permissions management
- [ ] Theme customization for admin panel

## 📊 Performance

- Lazy loading for large datasets
- Optimistic UI updates
- Debounced search
- Efficient re-renders with React hooks
- Mock data fallback for development

---

**Created**: October 4, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
