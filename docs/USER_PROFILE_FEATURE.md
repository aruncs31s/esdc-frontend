# User Profile Feature Implementation Guide

## Overview

This guide documents the complete user profile feature implementation that allows users to view detailed information about team members including their projects, events, products, courses, and achievements.

## Features Implemented

### 1. User Profile Types (`src/types/userProfile.ts`)

Extended type definitions for comprehensive user profile data:

- **UserProject**: Projects created/worked on by the user
- **UserEvent**: Events the user participated in
- **UserProduct**: Products created/sold by the user
- **UserCourse**: Courses enrolled/completed
- **UserChallenge**: Coding challenges completed
- **UserAchievement**: Badges and achievements earned
- **UserLike**: Items the user has liked
- **UserActivity**: Recent activity timeline
- **UserStats**: Aggregated statistics
- **UserProfileComplete**: Complete user profile with all data

### 2. User Quick Modal (`src/components/modals/UserQuickModal.tsx`)

A lightweight preview modal that shows:

- User avatar and basic info
- Name, username, and role badge
- Bio (if available)
- Contact information (email, location, company, website, GitHub)
- Join date
- **"See Full Profile" button** to view complete history

**Props:**

```typescript
interface UserQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onViewFullProfile: (userId: string) => void;
}
```

### 3. User Profile Modal (`src/components/modals/UserProfileModal.tsx`)

A comprehensive modal displaying complete user history:

**Header Section:**

- Cover image with gradient
- Large profile avatar
- Streak badge (if user has an active streak)
- Name, username, role badge, and rank
- Bio
- Contact information
- Stats overview grid (8 stat cards)

**Tabs:**

1. **Overview**: Recent activity timeline
2. **Projects**: All user projects with status
3. **Events**: Events participated/organized
4. **Products**: Products created/sold
5. **Courses**: Courses enrolled/completed
6. **Achievements**: Badges and awards earned

**Props:**

```typescript
interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialUserData?: UserData;
}
```

### 4. Updated Team Component (`src/components/Team.tsx`)

Enhanced to make team members clickable:

**Features:**

- Click on any team member card to open User Quick Modal
- Click "See Full Profile" to view complete history
- GitHub link still opens in new tab (prevents modal trigger)
- Hover effect on team cards
- State management for modal visibility

**Implementation:**

```typescript
const handleMemberClick = (member: any) => {
  // Converts team member to UserData format
  // Opens UserQuickModal
};

const handleViewFullProfile = (userId: string) => {
  // Opens UserProfileModal with full history
};
```

## Styling

### UserQuickModal.css

- Glassmorphism design
- Responsive grid layout
- Role badges with gradient backgrounds
- Hover effects on contact items
- Mobile-friendly design

### UserProfileModal.css

- Full-screen modal with backdrop blur
- Animated gradient cover image
- Stats grid with 8 cards
- Tab navigation system
- Smooth animations and transitions
- Fully responsive (mobile, tablet, desktop)

### sections.css (Team section)

- Added `.team-card-clickable` class
- Hover effects with lift animation
- Cursor pointer on hover
- Active state for click feedback

## User Flow

1. **User visits Team section** on the homepage
2. **Clicks on a team member card**
   - UserQuickModal opens with basic info
3. **Reviews basic information**
   - Name, role, contact details, bio
4. **Clicks "See Full Profile" button**
   - UserQuickModal closes
   - UserProfileModal opens with complete history
5. **Explores user history**
   - Switches between tabs (Projects, Events, Products, etc.)
   - Views detailed statistics
   - Sees recent activity

## Data Structure

### Current UserData Interface (from user.ts)

```typescript
export interface UserData {
  id?: string;
  email: string;
  username: string;
  role: string;
  name?: string;
  login?: string;
  avatar?: string;
  avatar_url?: string;
  avatarUrl?: string;
  bio?: string;
  html_url?: string;
  created_at?: string;
  createdAt?: string;
  location?: string;
  company?: string;
  blog?: string;
  github_username?: string;
}
```

### Extended UserProfileComplete

Includes all fields from UserData plus:

- `stats`: UserStats object
- `projects`: Array of UserProject
- `events`: Array of UserEvent
- `products`: Array of UserProduct
- `courses`: Array of UserCourse
- `challenges`: Array of UserChallenge
- `achievements`: Array of UserAchievement
- `likes`: Array of UserLike
- `recent_activity`: Array of UserActivity

## Backend Integration

### Required API Endpoints

#### 1. Get User Profile

```
GET /api/users/:userId/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar_url": "https://...",
    "bio": "Developer at...",
    "stats": {
      "total_projects": 12,
      "completed_projects": 8,
      "total_events_attended": 15,
      "total_products": 3,
      "total_courses_completed": 5,
      "total_challenges_completed": 24,
      "total_achievements": 18,
      "total_likes_given": 156,
      "total_likes_received": 342,
      "total_points": 2450,
      "rank": 5,
      "streak_days": 14
    },
    "projects": [...],
    "events": [...],
    "products": [...],
    "courses": [...],
    "achievements": [...],
    "recent_activity": [...]
  }
}
```

#### 2. Get User Projects

```
GET /api/users/:userId/projects
```

#### 3. Get User Events

```
GET /api/users/:userId/events
```

#### 4. Get User Products

```
GET /api/users/:userId/products
```

#### 5. Get User Courses

```
GET /api/users/:userId/courses
```

#### 6. Get User Achievements

```
GET /api/users/:userId/achievements
```

### ApplicationService Integration

Add to `src/application/ApplicationService.ts`:

```typescript
async getUserProfile(userId: string): Promise<UserProfileComplete> {
  const response = await this.api.get(`/api/users/${userId}/profile`);
  return response.data.data;
}

async getUserProjects(userId: string): Promise<UserProject[]> {
  const response = await this.api.get(`/api/users/${userId}/projects`);
  return response.data.data;
}

async getUserEvents(userId: string): Promise<UserEvent[]> {
  const response = await this.api.get(`/api/users/${userId}/events`);
  return response.data.data;
}

// ... similar methods for products, courses, achievements
```

## Current Implementation Status

### ✅ Completed

- [x] Type definitions for all user profile data
- [x] UserQuickModal component with basic info
- [x] UserProfileModal component with tabs
- [x] Team component integration with click handlers
- [x] Complete styling for both modals
- [x] Responsive design for all screen sizes
- [x] Smooth animations and transitions
- [x] Role badges and rank display
- [x] Stats grid with 8 stat cards
- [x] Modal state management

### 🔄 To Be Implemented (Backend Dependent)

- [ ] API integration for fetching user profile data
- [ ] Projects tab content with actual data
- [ ] Events tab content with actual data
- [ ] Products tab content with actual data
- [ ] Courses tab content with actual data
- [ ] Achievements grid with actual achievements
- [ ] Activity timeline with real activities
- [ ] Like/unlike functionality
- [ ] User stats calculation on backend

### 🎯 Future Enhancements

- [ ] Share profile functionality
- [ ] Follow/Unfollow users
- [ ] Send direct message button
- [ ] Export profile data
- [ ] Profile customization options
- [ ] Privacy settings for profile visibility
- [ ] Social media integration
- [ ] Download certificates
- [ ] Print profile feature

## Mock Data

Currently, the UserProfileModal uses mock data:

```typescript
const mockProfile: UserProfileComplete = {
  ...user,
  ...initialUserData,
  stats: {
    total_projects: 12,
    completed_projects: 8,
    total_events_attended: 15,
    total_products: 3,
    total_courses_completed: 5,
    total_challenges_completed: 24,
    total_achievements: 18,
    total_likes_given: 156,
    total_likes_received: 342,
    total_points: 2450,
    rank: 5,
    streak_days: 14,
  },
  projects: [],
  events: [],
  products: [],
  courses: [],
  achievements: [],
  likes: [],
  recent_activity: [],
};
```

Replace this with actual API call when backend is ready:

```typescript
const profile = await applicationService.getUserProfile(userId);
setUserProfile(profile);
```

## Usage Examples

### 1. Using in Team Component (Already Implemented)

```typescript
import UserQuickModal from './modals/UserQuickModal';
import UserProfileModal from './modals/UserProfileModal';

const [selectedMember, setSelectedMember] = useState<UserData | null>(null);
const [showQuickModal, setShowQuickModal] = useState(false);
const [showFullProfileModal, setShowFullProfileModal] = useState(false);

// Click handler
const handleMemberClick = (member: any) => {
  const userData: UserData = { /* convert to UserData */ };
  setSelectedMember(userData);
  setShowQuickModal(true);
};

// Render modals
<UserQuickModal
  isOpen={showQuickModal}
  onClose={handleCloseQuickModal}
  user={selectedMember}
  onViewFullProfile={handleViewFullProfile}
/>

<UserProfileModal
  isOpen={showFullProfileModal}
  onClose={handleCloseFullProfileModal}
  userId={selectedUserId}
  initialUserData={selectedMember}
/>
```

### 2. Using in Other Components (Contributors, etc.)

```typescript
// In ContributorsModal or any list of users
<div className="contributor-card" onClick={() => handleViewUser(contributor)}>
  {/* contributor info */}
</div>

// Show profile
<UserProfileModal
  isOpen={showProfile}
  onClose={() => setShowProfile(false)}
  userId={contributor.id}
/>
```

## Responsive Breakpoints

### Mobile (< 480px)

- Stack elements vertically
- Single column layout
- Smaller fonts and spacing
- Touch-friendly button sizes

### Tablet (480px - 768px)

- Two-column stats grid
- Adjusted spacing
- Optimized tab buttons

### Desktop (> 768px)

- Full grid layouts
- Maximum content width
- Enhanced hover effects
- Multi-column stats

## Accessibility

### Keyboard Navigation

- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close modals

### Screen Readers

- Semantic HTML structure
- ARIA labels on buttons
- Alt text on images
- Role attributes

### Focus Management

- Visible focus indicators
- Focus trap in modals
- Return focus on close

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load tab content only when tab is active
2. **Pagination**: Paginate large lists (projects, events)
3. **Image Optimization**: Use optimized avatar images
4. **Caching**: Cache user profile data
5. **Debouncing**: Debounce API calls if needed

### Code Splitting

Consider splitting the modal components if bundle size is a concern:

```typescript
const UserProfileModal = lazy(() => import('./modals/UserProfileModal'));
```

## Testing Checklist

### Manual Testing

- [ ] Click team member opens quick modal
- [ ] Quick modal displays all user info correctly
- [ ] "See Full Profile" button opens full modal
- [ ] All tabs switch correctly
- [ ] Stats display proper values
- [ ] Modal closes with X button
- [ ] Modal closes with Escape key
- [ ] Modal closes when clicking backdrop
- [ ] Responsive design works on all screen sizes
- [ ] GitHub link opens in new tab without triggering modal

### Unit Tests (To Be Added)

- [ ] UserQuickModal renders correctly
- [ ] UserProfileModal renders correctly
- [ ] Tab switching logic works
- [ ] Click handlers function properly
- [ ] Data transformation is correct

## Troubleshooting

### Modal Not Opening

- Check if `isOpen` prop is being set to `true`
- Verify state management in parent component
- Check console for JavaScript errors

### Data Not Displaying

- Verify UserData structure matches expected format
- Check if userId is being passed correctly
- Review API response format

### Styling Issues

- Ensure CSS files are imported
- Check for CSS variable definitions
- Verify z-index values for overlays

## Related Files

- `/src/types/userProfile.ts` - Type definitions
- `/src/types/user.ts` - Base user types
- `/src/components/modals/UserQuickModal.tsx` - Quick preview modal
- `/src/components/modals/UserProfileModal.tsx` - Full profile modal
- `/src/components/modals/BaseModal.tsx` - Base modal component
- `/src/components/Team.tsx` - Updated team component
- `/src/styles/UserQuickModal.css` - Quick modal styles
- `/src/styles/UserProfileModal.css` - Full profile styles
- `/src/styles/sections.css` - Team section styles

## Support

For questions or issues:

1. Check this documentation
2. Review the code comments
3. Test with mock data first
4. Verify API integration when backend is ready

---

**Created**: October 15, 2025  
**Last Updated**: October 15, 2025  
**Version**: 1.0.0  
**Author**: GitHub Copilot
