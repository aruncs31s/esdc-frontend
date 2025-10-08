# ProfileCard Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Import the Component
```jsx
import ProfileCard from './components/ProfileCard';
```

### Step 2: Get Your User Data
```jsx
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();
  // user object is now available
}
```

### Step 3: Render the ProfileCard
```jsx
return <ProfileCard user={user} />;
```

## 📸 See It in Action

Visit the demo page to see live examples:
```
http://localhost:5173/profile-card-demo
```

## 🎨 Common Use Cases

### 1. Simple Profile Display
```jsx
<ProfileCard user={user} />
```

### 2. Editable Profile
```jsx
<ProfileCard 
  user={user}
  editable={true}
  onEdit={() => navigate('/edit-profile')}
/>
```

### 3. Card Without Stats
```jsx
<ProfileCard 
  user={user}
  showStats={false}
/>
```

### 4. Custom Statistics
```jsx
<ProfileCard 
  user={user}
  stats={{ points: 1500, completedChallenges: 25 }}
/>
```

### 5. Multiple Cards in Grid
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

## 💡 Tips

1. **User Object**: The component works with various user object formats - it automatically detects and uses available fields.

2. **Avatar Fallback**: If no avatar is provided, it shows a placeholder with the first letter of the user's name.

3. **Responsive**: The card automatically adapts to mobile, tablet, and desktop screens.

4. **Dark Mode**: Fully supports your app's dark/light mode toggle.

## 📚 Need More Help?

- **Full Documentation**: `docs/ProfileCard.md`
- **Examples**: `src/components/ProfileCardExamples.jsx`
- **Demo Page**: `/profile-card-demo` route

## ✨ Features Included

- ✅ Beautiful gradient header
- ✅ Avatar with fallback
- ✅ GitHub integration
- ✅ Role badges
- ✅ Statistics display
- ✅ Edit functionality
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Smooth animations
- ✅ Accessible

## 🔧 Props Reference

| Prop | Type | Default | Required |
|------|------|---------|----------|
| user | Object | - | Yes |
| editable | Boolean | false | No |
| onEdit | Function | - | No |
| showStats | Boolean | true | No |
| stats | Object | {} | No |
| className | String | '' | No |

## 🎯 Minimal User Object

The minimum required user data:
```javascript
{
  username: 'johndoe',
  name: 'John Doe'
}
```

All other fields are optional and will be displayed if available:
- email
- bio
- avatar/avatar_url
- githubUsername
- role
- points
- completedChallenges
- joinedDate

Happy coding! 🚀
