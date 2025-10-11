# Analytics Page Documentation

## Overview

The Analytics page provides comprehensive server statistics, traffic metrics, and performance insights for the ESDC platform.

## Features

### 1. **Server Statistics Dashboard**
Real-time statistics displayed in modern glass-morphism cards:
- **Total Page Views** - Cumulative page views across the platform
- **Total Downloads** - Total resource downloads
- **Active Users** - Currently active users on the platform
- **Server Uptime** - Server availability duration

### 2. **Traffic Statistics**
Traffic metrics over different time periods:
- **Daily Traffic** - Requests per day
- **Weekly Traffic** - Requests per week
- **Monthly Traffic** - Requests per month

### 3. **Server Resources**
Overview of platform content:
- **Total Resources** - Number of available resources
- **Total Projects** - Number of projects on the platform
- **Total Challenges** - Number of coding challenges

### 4. **Top Resources Table**
Interactive table showing:
- Resource ranking
- Resource title
- View count with icon
- Download count with icon
- Total engagement (views + downloads)

## Access Control

- **URL**: `/analytics`
- **Authentication**: Required (any authenticated user)
- **Authorization**: All authenticated users can access (not restricted to admins)

## Technical Details

### Component Location
- **File**: `src/pages/Analytics.tsx`
- **Type**: React Functional Component with TypeScript

### API Endpoints

The Analytics page uses three API endpoints:

1. **GET `/api/analytics/stats`**
   - Returns general platform statistics
   - Response structure:
   ```javascript
   {
     total_page_views: number,
     total_downloads: number,
     total_views: number,
     active_users: number,
     server_uptime: number,
     total_resources: number,
     total_projects: number,
     total_challenges: number
   }
   ```

2. **GET `/api/analytics/resources/top?limit=10`**
   - Returns top performing resources
   - Response structure:
   ```javascript
   [
     {
       title: string,
       view_count: number,
       download_count: number
     }
   ]
   ```

3. **GET `/api/analytics/traffic`**
   - Returns traffic statistics
   - Response structure:
   ```javascript
   {
     daily: number,
     weekly: number,
     monthly: number
   }
   ```

### Fallback Data

If the backend APIs are not available, the component displays mock data to demonstrate functionality:
- Total Page Views: 15,420
- Total Downloads: 3,240
- Active Users: 127
- Server Uptime: 30 days
- Sample top resources with realistic metrics

## UI Design

### Style Features
- **Glass-morphism cards** - Consistent with AdminPanel design
- **Responsive grid layout** - Adapts to different screen sizes
- **Color-coded icons** - Visual distinction for different metrics
- **Formatted numbers** - Large numbers shown with K/M suffixes
- **Clean table design** - Easy to read top resources list

### Color Scheme
Following the Catppuccin theme variables:
- Blue icons for views/page traffic
- Green icons for downloads
- Lavender icons for users
- Yellow icons for uptime
- Peach, Teal, Mauve for resources

### Layout
```
┌─────────────────────────────────────┐
│     Analytics Dashboard Header      │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Views│ │Down │ │Users│ │Time │  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
├─────────────────────────────────────┤
│         Traffic Statistics          │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │Daily│ │Week │ │Month│          │
│  └─────┘ └─────┘ └─────┘          │
├─────────────────────────────────────┤
│         Server Resources            │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Rsrcs │ │Prjct │ │Chlng │       │
│  └──────┘ └──────┘ └──────┘       │
├─────────────────────────────────────┤
│         Top Resources Table         │
│  #  │ Title │ Views │ Down │ Total │
└─────────────────────────────────────┘
```

## Usage

### Navigating to Analytics
1. User must be logged in
2. Navigate to `/analytics` URL
3. Or add a navigation link in the header/menu

### Example Navigation Link
```tsx
<Link to="/analytics">Analytics</Link>
```

## Integration with Existing Code

### Route Configuration
Added in `src/App.tsx`:
```tsx
<Route path="/analytics" element={
  <ProtectedRoute>
    <>
      <Header />
      <Analytics />
      <Footer />
    </>
  </ProtectedRoute>
} />
```

### API Service
Added in `src/services/api.ts`:
```typescript
export const analyticsAPI = {
  getStats: async() => { /* ... */ },
  getTopResources: async(limit = 10) => { /* ... */ },
  getTrafficStats: async() => { /* ... */ }
};
```

## Future Enhancements

Potential improvements for the Analytics page:

1. **Charts and Graphs**
   - Line charts for traffic trends
   - Pie charts for resource distribution
   - Bar charts for top resources

2. **Date Range Filters**
   - Custom date range selection
   - Compare different time periods

3. **Export Functionality**
   - Export data as CSV/Excel
   - Generate PDF reports

4. **Real-time Updates**
   - WebSocket integration for live data
   - Auto-refresh at intervals

5. **More Metrics**
   - User engagement rates
   - Popular pages/routes
   - Resource categories breakdown
   - User registration trends

6. **Role-based Views**
   - Admin-specific advanced analytics
   - User-specific personal analytics

## Related Documentation

- [Admin Panel Documentation](./ADMIN_PANEL.md)
- [Resources System](./features/resources-system.md)
- [API Documentation](./API.md)

## Backend Implementation Requirements

For full functionality, the backend should implement the following endpoints:

```javascript
// GET /api/analytics/stats
app.get('/api/analytics/stats', requireAuth, async (req, res) => {
  // Return platform statistics
  // Similar to /api/admin/stats but with additional analytics data
});

// GET /api/analytics/resources/top
app.get('/api/analytics/resources/top', requireAuth, async (req, res) => {
  const { limit = 10 } = req.query;
  // Return top resources by view_count + download_count
  // Query from resources table, order by engagement
});

// GET /api/analytics/traffic
app.get('/api/analytics/traffic', requireAuth, async (req, res) => {
  // Return traffic statistics from access logs
  // Aggregate by time periods (daily, weekly, monthly)
});
```

## Notes

- The page requires authentication but not admin privileges
- All data displays gracefully handle empty/missing data
- Loading states are implemented for better UX
- Number formatting makes large numbers readable (1.2K, 3.5M)
- Responsive design works on mobile, tablet, and desktop
