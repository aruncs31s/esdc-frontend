# ProfileCard Component

A modern, reusable profile card component for displaying user information in the ESDC React application.

## Features

- 🎨 Beautiful gradient header design
- 🖼️ Avatar display with fallback placeholder
- ⚡ Smooth hover animations
- 📱 Fully responsive design
- 🎭 Role badges (Admin, User, etc.)
- 📊 Optional statistics display
- ✏️ Optional edit functionality
- 🌓 Dark mode support (Catppuccin theme)
- ♿ Accessible and semantic HTML

## Installation

The ProfileCard component is already included in the project. No additional installation is required.

## Usage

### Basic Usage

```jsx
import ProfileCard from './components/ProfileCard';
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();

  return (
    <ProfileCard user={user} />
  );
}
```

### With Edit Functionality

```jsx
import ProfileCard from './components/ProfileCard';

function MyComponent() {
  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar_url: 'https://github.com/johndoe.png',
    bio: 'Software developer and open source enthusiast'
  };

  const handleEdit = () => {
    console.log('Edit profile');
    // Navigate to edit page or open modal
  };

  return (
    <ProfileCard 
      user={user} 
      editable={true}
      onEdit={handleEdit}
    />
  );
}
```

### Without Statistics

```jsx
<ProfileCard 
  user={user} 
  showStats={false}
/>
```

### With Custom Statistics

```jsx
<ProfileCard 
  user={user}
  stats={{
    points: 1500,
    completedChallenges: 25
  }}
/>
```

### Multiple Cards in Grid

```jsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '20px'
}}>
  {users.map(user => (
    <ProfileCard key={user.id} user={user} />
  ))}
</div>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | Object | Required | User object containing profile information |
| `editable` | Boolean | `false` | Whether to show the edit button |
| `onEdit` | Function | - | Callback function when edit button is clicked |
| `showStats` | Boolean | `true` | Whether to display user statistics |
| `stats` | Object | `{}` | Custom statistics object |
| `className` | String | `''` | Additional CSS classes to apply |

## User Object Structure

The `user` prop accepts an object with the following properties (all optional):

```javascript
{
  // Basic Info
  username: String,        // User's username
  name: String,           // Display name
  login: String,          // Alternative username field (GitHub)
  email: String,          // User's email address
  bio: String,            // User biography/description
  
  // Avatar
  avatar: String,         // Avatar URL
  avatar_url: String,     // Alternative avatar field (GitHub)
  avatarUrl: String,      // Camel case avatar field
  
  // GitHub Integration
  githubUsername: String, // GitHub username
  github_username: String,// Alternative GitHub username field
  html_url: String,       // GitHub profile URL
  
  // Metadata
  role: String,           // User role ('admin', 'user', 'moderator')
  points: Number,         // User points/score
  completedChallenges: Number,    // Number of completed challenges
  completed_challenges: Number,    // Alternative field name
  joinedDate: String,     // ISO date string when user joined
  joined_date: String,    // Alternative field name
  createdAt: String,      // Alternative date field
  created_at: String,     // Alternative date field
}
```

## Stats Object Structure

The optional `stats` prop accepts:

```javascript
{
  points: Number,              // User points/score
  completedChallenges: Number  // Number of completed challenges
}
```

## Examples

See `ProfileCardExamples.jsx` for complete working examples including:

1. Basic profile card
2. Editable profile card
3. Profile card without statistics
4. Profile card with custom statistics
5. Minimal user data profile card
6. GitHub-integrated profile card
7. Multiple cards in grid layout
8. Empty state handling

## Styling

The ProfileCard uses CSS classes defined in `index.css`. The component follows the Catppuccin color scheme with support for both light (Latte) and dark (Mocha) modes.

### Key CSS Classes

- `.profile-card` - Main container
- `.profile-card-header` - Gradient header section
- `.profile-card-avatar` - Avatar container
- `.profile-card-content` - Main content area
- `.profile-card-stats` - Statistics section
- `.profile-card-badge` - Role badges

### Customization

You can customize the appearance by:

1. **Adding custom classes:**
   ```jsx
   <ProfileCard user={user} className="my-custom-class" />
   ```

2. **Overriding CSS variables** in your stylesheet:
   ```css
   .my-custom-class {
     --custom-gradient: linear-gradient(135deg, #your-color 0%, #your-color2 100%);
   }
   ```

## Responsive Design

The ProfileCard is fully responsive and adapts to different screen sizes:

- **Desktop (> 768px):** Full-size card with all features
- **Tablet (768px):** Slightly reduced avatar size
- **Mobile (< 480px):** Stacked statistics layout

## Accessibility

The component includes:

- Semantic HTML elements
- ARIA labels for interactive elements
- Alt text for images
- Keyboard navigation support
- Proper color contrast ratios

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Integration with Existing Components

### Using in UserProfile.jsx

```jsx
import ProfileCard from './ProfileCard';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <ProfileCard 
              user={user}
              editable={true}
              onEdit={() => window.location.href = '/profile/edit'}
            />
          </div>
          <div className="col-md-8">
            {/* Other profile content */}
          </div>
        </div>
      </div>
    </section>
  );
};
```

### Using in Dashboard

```jsx
import ProfileCard from '../components/ProfileCard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <ProfileCard user={user} showStats={true} />
      </aside>
      <main className="content">
        {/* Dashboard content */}
      </main>
    </div>
  );
};
```

## Performance Considerations

- Images are lazy-loaded with error handling
- Smooth animations use CSS transforms for better performance
- Component memoization recommended for lists

## Troubleshooting

### Avatar not displaying

Make sure the user object has one of these properties:
- `avatar_url`
- `avatarUrl`
- `avatar`
- `username` or `login` (for GitHub fallback)

### Stats not showing

Ensure `showStats={true}` and provide either:
- Stats in the user object: `user.points`, `user.completedChallenges`
- Custom stats prop: `stats={{ points: 100, completedChallenges: 5 }}`

### Edit button not appearing

Make sure both props are set:
```jsx
<ProfileCard 
  editable={true}
  onEdit={yourFunction}
/>
```

## Future Enhancements

Potential improvements:
- [ ] Social media links integration
- [ ] Animated statistics counters
- [ ] QR code for profile sharing
- [ ] Achievement badges display
- [ ] Custom theme support
- [ ] Export profile as image

## License

This component is part of the ESDC React application.

## Contributing

To contribute improvements:
1. Make changes to `src/components/ProfileCard.jsx`
2. Update styles in `src/index.css`
3. Add examples to `src/components/ProfileCardExamples.jsx`
4. Update this documentation

## Support

For issues or questions, please contact the development team or create an issue in the repository.
