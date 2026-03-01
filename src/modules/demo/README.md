# Demo Mode Module

## Overview

Self-contained demo mode implementation that can be completely removed without affecting the application.

## Features

- ✅ Toggle demo mode on/off
- ✅ Visual banner when demo is active
- ✅ Intercepts all API calls with mock data
- ✅ Simulates realistic delays
- ✅ Complete mock data for all features
- ✅ Persistent demo state (localStorage)

## Architecture

```
modules/demo/
├── components/
│   ├── DemoModeToggle.tsx    # Floating toggle button
│   └── DemoBanner.tsx         # Info banner
├── hooks/
│   └── useDemoMode.ts         # Demo state management
├── services/
│   ├── DemoService.ts         # Mock data service
│   └── DemoApiInterceptor.ts # API call interceptor
├── data/
│   └── mockData.ts            # All mock data
└── index.ts                   # Public exports
```

## Usage

### Enable/Disable Demo Mode

```tsx
import { useDemoMode } from '@/modules/demo';

const MyComponent = () => {
  const { isDemoMode, enableDemo, disableDemo, toggleDemo } = useDemoMode();

  return <button onClick={toggleDemo}>{isDemoMode ? 'Disable' : 'Enable'} Demo</button>;
};
```

### Add Demo Toggle to UI

```tsx
import { DemoModeToggle } from '@/modules/demo';

<DemoModeToggle />;
```

### Show Demo Banner

```tsx
import { DemoBanner } from '@/modules/demo';

{
  isDemoMode && <DemoBanner />;
}
```

## How It Works

1. **Toggle Button**: Floating button in bottom-right corner
2. **State Management**: Stores demo mode in localStorage
3. **API Interceptor**: Axios interceptor catches all API calls
4. **Mock Service**: Returns realistic mock data with delays
5. **Visual Feedback**: Banner shows when demo is active

## Mock Data Includes

- Users (3 demo users)
- Projects (3 demo projects)
- Tasks (3 demo tasks)
- Milestones (3 demo milestones)
- Notifications (3 demo notifications)
- Templates (3 demo templates)
- Team Members (3 demo members)

## API Endpoints Covered

- `/projects/trending`
- `/projects/recommendations`
- `/projects/{id}/similar`
- `/projects/{id}/analytics`
- `/projects/{id}/export`
- `/projects/{id}/tasks`
- `/projects/{id}/milestones`
- `/projects/{id}/timeline`
- `/projects/{id}/team`
- `/projects/notifications`
- `/projects/templates`

## Removing Demo Mode

To completely remove demo mode:

1. Delete the entire `modules/demo` directory
2. Remove imports from `App.tsx`:
   ```tsx
   // Remove these lines
   import { DemoModeToggle, DemoBanner, useDemoMode } from './modules/demo';
   const { isDemoMode } = useDemoMode();
   <DemoModeToggle />;
   {
     isDemoMode && <DemoBanner />;
   }
   ```
3. Remove import from `main.tsx`:
   ```tsx
   // Remove this line
   import './infrastructure/api/demoAxiosSetup';
   ```
4. Delete `src/infrastructure/api/demoAxiosSetup.ts`

That's it! No other code depends on the demo module.

## Benefits

### For Development

- Test UI without backend
- Rapid prototyping
- Offline development
- Consistent test data

### For Demos

- Show features without real data
- Safe for presentations
- No database required
- Instant setup

### For Testing

- Predictable data
- Fast responses
- No API rate limits
- Isolated testing

## Customization

### Add More Mock Data

Edit `modules/demo/data/mockData.ts`:

```ts
export const demoProjects = [
  // Add more projects
];
```

### Add New API Endpoints

Edit `modules/demo/services/DemoApiInterceptor.ts`:

```ts
if (url.includes('/my-endpoint')) {
  return myMockData;
}
```

### Customize Delays

Edit `modules/demo/services/DemoService.ts`:

```ts
private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

## Example: Power of Demo Mode

```tsx
// Component works with both real and demo data
const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // This call is automatically intercepted in demo mode
    projectApi.getProjects().then(setProjects);
  }, []);

  return (
    <div>
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
};
```

No changes needed! The component works seamlessly in both modes.

## Best Practices

1. **Keep mock data realistic** - Use real-world examples
2. **Add delays** - Simulate network latency
3. **Handle errors** - Test error states too
4. **Update regularly** - Keep mock data in sync with API
5. **Document coverage** - List supported endpoints

## Future Enhancements

- [ ] Demo mode settings panel
- [ ] Custom mock data editor
- [ ] Record/replay real API calls
- [ ] Demo scenarios (success/error/loading)
- [ ] Export/import demo data
- [ ] Demo mode analytics
