# Users Page Documentation

## Overview

The Users page displays all community members in a beautiful grid or list layout using the ProfileCard component. It includes search, filtering, sorting capabilities, and community statistics.

## Location

**File:** `src/pages/Users.jsx`  
**Route:** `/users`  
**Navigation:** Available in the main navbar

## Features

### 🎨 View Modes
- **Grid View**: Cards displayed in responsive grid (default)
- **List View**: Cards displayed in horizontal list layout

### 🔍 Search & Filter
- **Search**: Search users by name, username, or email
- **Role Filter**: Filter by user role (All, Admin, User, Moderator)
- **Sort Options**:
  - By Name (A-Z)
  - By Points (highest first)
  - By Challenges Completed (most first)
  - By Join Date (most recent first)

### 📊 Statistics
- Total Members count
- Total Points earned by all users
- Total Challenges Solved
- Number of Admins

### 📱 Responsive Design
- Desktop: Multi-column grid layout
- Tablet: Adjusted column count
- Mobile: Single column, stacked layout

## Usage

### Basic Access

Simply navigate to `/users` in your browser:
```
http://localhost:5173/users
```

Or click "Users" in the navigation menu.

### Component Structure

```jsx
import Users from './pages/Users';

// In your routes
<Route path="/users" element={
  <>
    <Navbar />
    <Users />
    <Footer />
  </>
} />
```

## User Data Source

The page fetches users from two sources:

1. **API Call**: `adminAPI.getUsers()` - Primary data source
2. **Mock Data**: Fallback data if API fails (8 sample users)

### Mock Users

When the API is unavailable, the page displays 8 mock users with:
- Profile pictures (from pravatar.cc)
- Realistic names and usernames
- Email addresses
- Bio descriptions
- Points and challenge completion stats
- Role assignments (1 admin, 7 regular users)
- Join dates

## Features Breakdown

### 1. Search Bar
```jsx
// Search by name, username, or email
<input
  type="text"
  placeholder="Search users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

### 2. Role Filter
```jsx
<select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
  <option value="all">All Roles</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
  <option value="moderator">Moderator</option>
</select>
```

### 3. Sort Options
- **Name**: Alphabetical sorting
- **Points**: Descending by points
- **Challenges**: Descending by completed challenges
- **Recent**: Descending by join date

### 4. View Toggle
- Grid icon: Switch to grid view (3-4 columns)
- List icon: Switch to list view (horizontal cards)

## ProfileCard Integration

Each user is displayed using the ProfileCard component:

```jsx
<ProfileCard
  user={user}
  showStats={true}
  stats={{
    points: user.points,
    completedChallenges: user.completedChallenges
  }}
/>
```

### Clickable Cards

Cards are clickable and trigger `handleUserClick`:
```jsx
const handleUserClick = (user) => {
  console.log('User clicked:', user);
  // Future: Navigate to user detail page
};
```

## Empty State

When no users match the filters:
- Displays magnifying glass emoji 🔍
- Shows "No users found" message
- Provides "Clear Filters" button
- Resets search and filters

## Loading State

While fetching data:
- Shows loading spinner
- Displays "Loading users..." message
- Centers content on screen

## Statistics Dashboard

Bottom section shows community stats:

```jsx
<div className="statistics">
  <div>Total Members: {users.length}</div>
  <div>Total Points: {sum of all points}</div>
  <div>Challenges Solved: {sum of all challenges}</div>
  <div>Admins: {count of admin users}</div>
</div>
```

## Responsive Breakpoints

### Desktop (> 992px)
- Grid: 3-4 columns
- Full features visible

### Tablet (768px - 992px)
- Grid: 2-3 columns
- Adjusted spacing

### Mobile (< 768px)
- Grid: 1-2 columns
- List view converts to card view
- Stacked statistics

### Small Mobile (< 576px)
- Grid: 1 column
- Compact cards
- Touch-optimized spacing

## CSS Classes

### Main Container
- `.users-grid`: Grid layout container
- `.users-list`: List layout container

### Grid Specific
```css
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}
```

### List Specific
```css
.users-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.users-list .profile-card {
  max-width: 100%;
  flex-direction: row;
}
```

## Admin Features

If the current user is an admin, additional features are available:

```jsx
{currentUser?.role === 'admin' && (
  <button className="btn btn-primary">
    <BsPersonPlus /> Add User
  </button>
)}
```

## Integration with API

### Get Users
```javascript
const fetchedUsers = await adminAPI.getUsers();
```

### User Object Structure
```javascript
{
  id: Number,
  username: String,
  name: String,
  email: String,
  avatar_url: String,
  bio: String,
  role: String,
  points: Number,
  completedChallenges: Number,
  joinedDate: String (ISO date)
}
```

## Future Enhancements

Planned features:
- [ ] User detail modal/page on click
- [ ] Pagination for large user lists
- [ ] Export user list to CSV
- [ ] Bulk actions for admins
- [ ] User status indicators (online/offline)
- [ ] Follow/unfollow functionality
- [ ] User achievements display
- [ ] Advanced filters (by points range, date range)
- [ ] User comparison feature

## Performance Considerations

- Uses `useEffect` hooks for efficient data loading
- Memoizes filtered results
- Lazy loads user avatars
- Optimized re-renders with proper state management

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Screen reader friendly
- ✅ High contrast mode compatible
- ✅ Focus indicators on inputs

## Browser Support

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Users not loading
- Check API endpoint: `GET /api/admin/users`
- Verify authentication token
- Check console for errors
- Mock data should appear as fallback

### Search not working
- Verify search term is updating state
- Check filter logic in `useEffect`
- Ensure user objects have searchable fields

### Cards not displaying correctly
- Verify ProfileCard styles are loaded
- Check `src/styles/profile.css` import
- Ensure user objects have required fields

### View toggle not working
- Check `viewMode` state updates
- Verify CSS classes for grid/list
- Ensure responsive styles are applied

## Related Files

- **Component**: `src/pages/Users.jsx`
- **Styles**: `src/styles/profile.css`
- **ProfileCard**: `src/components/ProfileCard.jsx`
- **API**: `src/services/api.js` (adminAPI.getUsers)
- **Routes**: `src/App.jsx`
- **Navbar**: `src/components/Navbar.jsx`

## Quick Start

1. **Navigate to Users page:**
   ```
   http://localhost:5173/users
   ```

2. **Try searching:**
   - Type a name in the search box
   - Results update in real-time

3. **Change views:**
   - Click grid/list icons to toggle layouts

4. **Apply filters:**
   - Select role from dropdown
   - Choose sort option

5. **Click on a card:**
   - Opens user details (coming soon)

## Example Screenshots

### Grid View
```
┌────────┐  ┌────────┐  ┌────────┐
│ Alice  │  │  Bob   │  │Charlie │
│  Card  │  │  Card  │  │  Card  │
└────────┘  └────────┘  └────────┘
```

### List View
```
┌─────────────────────────────────┐
│ Alice  │  Details  │  Stats    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  Bob   │  Details  │  Stats    │
└─────────────────────────────────┘
```

## Support

For issues or questions:
- Check console for error messages
- Verify API endpoints are accessible
- Review ProfileCard documentation
- Contact development team

---

**Created:** October 5, 2025  
**Version:** 1.0.0  
**Status:** ✅ Ready for production
