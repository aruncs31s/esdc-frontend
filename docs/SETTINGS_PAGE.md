# Settings Page Documentation

## Overview
The Settings page allows users to customize their experience by enabling or disabling various features in the application. All settings are persisted in the browser's localStorage and automatically applied across the application.

## Architecture

### 1. SettingsContext (`src/contexts/SettingsContext.tsx`)
A React Context that provides centralized state management for feature toggles.

#### Interfaces

```typescript
interface FeatureSettings {
  chatbot: boolean;
  chatroom: boolean;
  games: boolean;
  shop: boolean;
  blog: boolean;
  events: boolean;
  challenges: boolean;
  resources: boolean;
  leaderboard: boolean;
  projects: boolean;
  lms: boolean;
  notifications: boolean;
  products: boolean;
}

interface SettingsContextType {
  settings: FeatureSettings;
  updateSetting: (feature: keyof FeatureSettings, enabled: boolean) => void;
  resetSettings: () => void;
  isFeatureEnabled: (feature: keyof FeatureSettings) => boolean;
}
```

#### Provider Usage
Wrap your app with `SettingsProvider`:

```typescript
<SettingsProvider>
  <App />
</SettingsProvider>
```

#### Hook Usage
Access settings in any component:

```typescript
const { settings, isFeatureEnabled, updateSetting, resetSettings } = useSettings();

// Check if a feature is enabled
if (isFeatureEnabled('chatbot')) {
  // Render chatbot
}
```

### 2. Settings Page (`src/pages/Settings.tsx`)
User interface for managing feature settings.

#### Features
- **Category Filtering**: View features by category (All, Core, Content, Commerce, Community)
- **Toggle Switches**: Enable/disable features with visual feedback
- **Reset to Defaults**: Restore all settings to default values
- **Apply & Reload**: Apply changes and reload the page
- **Responsive Design**: Works on all screen sizes

#### Feature Categories

**Core Features:**
- Chatbot
- Notifications

**Content Features:**
- Games
- Blog
- Resources
- LMS (Learning Management System)

**Commerce Features:**
- Shop
- Products

**Community Features:**
- Chatroom
- Events
- Challenges
- Leaderboard
- Projects

### 3. Integration in App.tsx
Routes are conditionally rendered based on settings:

```typescript
const AppRoutes = () => {
  const { isFeatureEnabled } = useSettings();

  return (
    <div className="App">
      {isFeatureEnabled('chatbot') && <Chatbot />}
      <Routes>
        {isFeatureEnabled('events') && (
          <Route path="/events" element={<Events />} />
        )}
        {/* Other conditional routes */}
      </Routes>
    </div>
  );
};
```

### 4. Navigation Integration
The Navbar component conditionally displays menu items:

```typescript
{isFeatureEnabled('lms') && (
  <Link to="/lms">Courses</Link>
)}
{isFeatureEnabled('shop') && (
  <Link to="/shop">Shop</Link>
)}
```

## Usage Guide

### For End Users

1. **Access Settings**:
   - Navigate to `/settings` or click the Settings link in the navigation bar

2. **Enable/Disable Features**:
   - Toggle switches to enable or disable features
   - Disabled features will be hidden from navigation and inaccessible

3. **Filter by Category**:
   - Use category tabs to view specific types of features
   - Categories: All, Core, Content, Commerce, Community

4. **Reset Settings**:
   - Click "Reset to Defaults" to restore all settings
   - Confirmation dialog will appear

5. **Apply Changes**:
   - Click "Apply & Reload" to reload the page with new settings
   - Settings are auto-saved to localStorage

### For Developers

#### Adding a New Feature Setting

1. **Update FeatureSettings interface** in `SettingsContext.tsx`:
```typescript
interface FeatureSettings {
  // ... existing features
  newFeature: boolean;
}
```

2. **Update defaultSettings**:
```typescript
const defaultSettings: FeatureSettings = {
  // ... existing defaults
  newFeature: true,
};
```

3. **Add feature metadata** in `Settings.tsx`:
```typescript
const features: FeatureItem[] = [
  // ... existing features
  {
    key: 'newFeature',
    label: 'New Feature',
    description: 'Description of the new feature',
    icon: <FaIcon />,
    category: 'core' | 'content' | 'commerce' | 'community'
  }
];
```

4. **Conditionally render the feature** in `App.tsx`:
```typescript
{isFeatureEnabled('newFeature') && (
  <Route path="/new-feature" element={<NewFeature />} />
)}
```

5. **Update Navbar** if needed:
```typescript
{isFeatureEnabled('newFeature') && (
  <Link to="/new-feature">New Feature</Link>
)}
```

## Technical Details

### Storage
- Settings are stored in `localStorage` under the key `appSettings`
- Data is automatically serialized/deserialized as JSON
- Persists across browser sessions

### Performance
- Settings context uses React Context API for efficient updates
- Only components subscribed to settings re-render on changes
- localStorage operations are minimal and optimized

### Error Handling
- Graceful fallback to defaults if localStorage parsing fails
- Console logging for debugging storage issues
- Type-safe with TypeScript interfaces

## Styling
- Uses Tailwind CSS for responsive design
- Dark mode support through existing theme system
- Smooth transitions and hover effects
- Mobile-friendly toggle switches

## Routes

| Path | Description |
|------|-------------|
| `/settings` | Main settings page |

## Best Practices

1. **Always check feature availability** before rendering feature-specific components
2. **Use `isFeatureEnabled`** instead of directly accessing settings object
3. **Provide user feedback** when settings change
4. **Consider page reload** after significant setting changes
5. **Document new features** in this README when added

## Future Enhancements

Potential improvements:
- [ ] User-specific settings sync with backend
- [ ] Export/import settings
- [ ] Settings presets
- [ ] Advanced settings per feature
- [ ] Analytics on feature usage
- [ ] A/B testing integration

## Troubleshooting

**Settings not persisting:**
- Check browser localStorage is enabled
- Clear browser cache and try again

**Feature still showing after disabling:**
- Click "Apply & Reload" button
- Manually refresh the page

**Settings reset unexpectedly:**
- Check browser storage quota
- Verify no browser extensions clearing localStorage

## Support
For issues or questions, please refer to the main project documentation or contact the development team.
