# User Model Usage Guide

## Overview
The User model provides a consistent way to work with user data throughout the application, with built-in validation, type safety, and useful utility methods.

## Import

```javascript
import User, { 
  USER_ROLES, 
  USER_STATUS, 
  createUser,
  isValidRole,
  isValidStatus,
  getRoleDisplayName,
  getStatusDisplayName 
} from '../models/user';
```

---

## 1. In API Layer (`api.js`)

### ✅ Already Implemented

```javascript
// Automatically converts API responses to User instances
const users = await adminAPI.getUsers();
// Returns: Array<User>

const profile = await authAPI.getProfile();
// Returns: User instance

// Update user - accepts both User instance or plain object
await adminAPI.updateUser(userId, userInstance);
```

---

## 2. In Components (AdminPanel, UserTable, etc.)

### Basic Usage

```javascript
import User, { USER_ROLES, USER_STATUS } from '../models/user';

// Users from API are already User instances
const users = await adminAPI.getUsers();

// Access properties
users.forEach(user => {
  console.log(user.username);
  console.log(user.email);
  console.log(user.role);
});
```

### Using User Methods

```javascript
// Check user permissions
if (user.isAdmin()) {
  // Show admin controls
}

if (user.canPerformAdminActions()) {
  // Admin is active and can perform actions
}

if (user.isActive()) {
  // User is active
}

if (user.isSuspended()) {
  // Show suspension notice
}
```

### Display Methods

```javascript
// Get display name (falls back to email if no username)
const displayName = user.getDisplayName();

// Get formatted join date
const joinDate = user.getFormattedJoinDate();
// Returns: "Oct 5, 2025"

// Get avatar URL (with fallback to generated avatar)
const avatarUrl = user.getAvatarUrl();
// Returns: user's avatar or https://ui-avatars.com/api/...
```

### Validation

```javascript
const { valid, errors } = user.validate();

if (!valid) {
  console.log('Validation errors:', errors);
  // Show error messages to user
  errors.forEach(error => {
    console.error(error);
  });
}
```

---

## 3. In Forms (CreateModal, EditUserForm, etc.)

### Creating New Users

```javascript
import { createUser, USER_ROLES, USER_STATUS } from '../models/user';

const handleSubmit = (formData) => {
  // Create a new user instance
  const newUser = createUser({
    username: formData.username,
    email: formData.email,
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE
  });

  // Validate before sending
  const { valid, errors } = newUser.validate();
  
  if (!valid) {
    alert(errors.join('\n'));
    return;
  }

  // Convert to JSON for API
  await adminAPI.createUser(newUser.toJSON());
};
```

### Updating Users

```javascript
// Option 1: Using update method
const handleUpdate = (userId, updates) => {
  const user = users.find(u => u.id === userId);
  
  user.update({
    username: 'newUsername',
    status: USER_STATUS.SUSPENDED
  });

  // Validate
  const { valid, errors } = user.validate();
  if (valid) {
    await adminAPI.updateUser(userId, user);
  }
};

// Option 2: Create new instance with updated data
const handleUpdate = (userId, updates) => {
  const existingUser = users.find(u => u.id === userId);
  const updatedUser = new User({ ...existingUser, ...updates });
  
  await adminAPI.updateUser(userId, updatedUser);
};
```

---

## 4. In User Table Component

### Example: Enhanced UserTable.jsx

```javascript
import User, { getRoleDisplayName, getStatusDisplayName } from '../models/user';

const UserTable = ({ users, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Avatar</th>
          <th>Display Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Joined</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <img 
                src={user.getAvatarUrl()} 
                alt={user.getDisplayName()}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
            </td>
            <td>{user.getDisplayName()}</td>
            <td>{user.email}</td>
            <td>
              <span 
                className={`badge badge-${user.role}`}
                style={{
                  background: user.isAdmin() ? 'var(--red)' : 'var(--blue)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px'
                }}
              >
                {getRoleDisplayName(user.role)}
              </span>
            </td>
            <td>
              <span 
                className={`badge badge-${user.status}`}
                style={{
                  background: user.isActive() ? 'var(--green)' : 'var(--yellow)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px'
                }}
              >
                {getStatusDisplayName(user.status)}
              </span>
            </td>
            <td>{user.getFormattedJoinDate()}</td>
            <td>
              {!user.isAdmin() && (
                <button onClick={() => onDelete(user.id)}>
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## 5. Filtering & Searching

### Example: Enhanced Search in AdminPanel

```javascript
// Already implemented in AdminPanel.jsx
const filteredUsers = users.filter(user => {
  const searchLower = searchTerm.toLowerCase();
  
  if (user instanceof User) {
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.getDisplayName().toLowerCase().includes(searchLower)
    );
  }
  
  // Fallback for plain objects
  return (
    user.username?.toLowerCase().includes(searchLower) ||
    user.email?.toLowerCase().includes(searchLower)
  );
});

// Filter by role
const adminUsers = users.filter(user => user.isAdmin());
const activeUsers = users.filter(user => user.isActive());

// Filter by status
const suspendedUsers = users.filter(user => user.isSuspended());
```

---

## 6. Using Constants

```javascript
import { USER_ROLES, USER_STATUS } from '../models/user';

// In dropdowns/selects
const RoleSelector = () => (
  <select>
    <option value={USER_ROLES.USER}>User</option>
    <option value={USER_ROLES.ADMIN}>Admin</option>
    <option value={USER_ROLES.MODERATOR}>Moderator</option>
  </select>
);

const StatusSelector = () => (
  <select>
    <option value={USER_STATUS.ACTIVE}>Active</option>
    <option value={USER_STATUS.INACTIVE}>Inactive</option>
    <option value={USER_STATUS.SUSPENDED}>Suspended</option>
    <option value={USER_STATUS.PENDING}>Pending</option>
  </select>
);

// In conditional logic
if (user.role === USER_ROLES.ADMIN) {
  // Admin-specific logic
}

if (user.status === USER_STATUS.SUSPENDED) {
  // Suspended user logic
}
```

---

## 7. Helper Functions

```javascript
import { 
  isValidRole, 
  isValidStatus, 
  getRoleDisplayName, 
  getStatusDisplayName 
} from '../models/user';

// Validate role before setting
if (isValidRole(formData.role)) {
  user.role = formData.role;
}

// Validate status before setting
if (isValidStatus(formData.status)) {
  user.status = formData.status;
}

// Get display names
const roleDisplay = getRoleDisplayName(USER_ROLES.ADMIN);
// Returns: "Administrator"

const statusDisplay = getStatusDisplayName(USER_STATUS.ACTIVE);
// Returns: "Active"
```

---

## 8. Advanced Usage

### Bulk Operations

```javascript
// Convert all users to admin
const makeAllAdmin = () => {
  users.forEach(user => {
    user.update({ role: USER_ROLES.ADMIN });
  });
  
  // Bulk update API call
  await Promise.all(
    users.map(user => adminAPI.updateUser(user.id, user))
  );
};

// Get all admin users
const admins = users.filter(user => user.isAdmin());

// Get statistics
const stats = {
  totalUsers: users.length,
  activeUsers: users.filter(u => u.isActive()).length,
  suspendedUsers: users.filter(u => u.isSuspended()).length,
  adminUsers: users.filter(u => u.isAdmin()).length
};
```

### Sorting

```javascript
// Sort by username
const sortedByName = [...users].sort((a, b) => 
  a.username.localeCompare(b.username)
);

// Sort by join date
const sortedByDate = [...users].sort((a, b) => 
  new Date(b.joinedDate) - new Date(a.joinedDate)
);

// Sort by points
const sortedByPoints = [...users].sort((a, b) => 
  b.points - a.points
);
```

---

## Benefits

✅ **Type Safety**: All user objects have consistent structure  
✅ **Validation**: Built-in validation logic  
✅ **Transformation**: Automatic camelCase ↔ snake_case conversion  
✅ **Utility Methods**: Common operations built-in  
✅ **Maintainability**: Centralized user logic  
✅ **Reusability**: Use across all components  
✅ **Error Prevention**: Fallback values prevent undefined errors

---

## Quick Reference

```javascript
// Import
import User, { USER_ROLES, USER_STATUS } from '../models/user';

// Create
const user = new User(data);
const user = User.fromAPI(apiData);
const users = User.fromAPIArray(apiDataArray);

// Access
user.username, user.email, user.role, user.status

// Methods
user.isAdmin()
user.isActive()
user.isSuspended()
user.getDisplayName()
user.getFormattedJoinDate()
user.getAvatarUrl()
user.canPerformAdminActions()

// Modify
user.update({ username: 'new' })

// Validate
const { valid, errors } = user.validate()

// Convert
user.toJSON() // For API calls
```
