# Settings Page - Quick Reference

## Quick Start

### Accessing Settings
```
Navigate to: /settings
Or click: Settings icon in navbar
```

## For Users

### Enable/Disable Features
1. Go to `/settings`
2. Find the feature card
3. Toggle the switch (blue = enabled, gray = disabled)
4. Click "Apply & Reload" to see changes

### Reset All Settings
1. Click "Reset to Defaults"
2. Confirm the action
3. All features will be enabled

## For Developers

### Use Settings in Components
```typescript
import { useSettings } from '../contexts/SettingsContext';

function MyComponent() {
  const { isFeatureEnabled } = useSettings();
  
  if (!isFeatureEnabled('myFeature')) {
    return null; // or redirect
  }
  
  return <div>Feature content</div>;
}
```

### Conditional Routing
```typescript
{isFeatureEnabled('events') && (
  <Route path="/events" element={<Events />} />
)}
```

### Conditional Navigation
```typescript
{isFeatureEnabled('shop') && (
  <Link to="/shop">Shop</Link>
)}
```

## Available Features

| Feature | Key | Default | Category |
|---------|-----|---------|----------|
| Chatbot | `chatbot` | ✅ | Core |
| Chat Room | `chatroom` | ✅ | Community |
| Games | `games` | ✅ | Content |
| Shop | `shop` | ✅ | Commerce |
| Blog | `blog` | ✅ | Content |
| Events | `events` | ✅ | Community |
| Challenges | `challenges` | ✅ | Community |
| Resources | `resources` | ✅ | Content |
| Leaderboard | `leaderboard` | ✅ | Community |
| Projects | `projects` | ✅ | Community |
| LMS | `lms` | ✅ | Content |
| Notifications | `notifications` | ✅ | Core |
| Products | `products` | ✅ | Commerce |

## API Reference

### useSettings Hook
```typescript
const {
  settings,              // All settings object
  updateSetting,         // (key, value) => void
  resetSettings,         // () => void
  isFeatureEnabled      // (key) => boolean
} = useSettings();
```

### Check Feature
```typescript
if (isFeatureEnabled('chatbot')) {
  // Feature is enabled
}
```

### Update Feature
```typescript
updateSetting('chatbot', false); // Disable chatbot
```

### Reset All
```typescript
resetSettings(); // Reset to defaults
```

## File Structure
```
src/
├── contexts/
│   └── SettingsContext.tsx    # Settings state management
├── pages/
│   └── Settings.tsx            # Settings UI
└── App.tsx                     # Route integration
```

## Common Patterns

### Protecting a Component
```typescript
function ProtectedFeature() {
  const { isFeatureEnabled } = useSettings();
  
  if (!isFeatureEnabled('myFeature')) {
    return <Navigate to="/" replace />;
  }
  
  return <FeatureContent />;
}
```

### Conditional Rendering
```typescript
{isFeatureEnabled('chatbot') && <Chatbot />}
```

### Multiple Features
```typescript
const hasCommerce = isFeatureEnabled('shop') || isFeatureEnabled('products');
```

## Storage Location
```
localStorage key: "appSettings"
```

## Tips
- 💡 Settings persist across sessions
- 🔄 Some changes require page reload
- 🎨 Dark mode compatible
- 📱 Mobile responsive
- ⚡ Type-safe with TypeScript
