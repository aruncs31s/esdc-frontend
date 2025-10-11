# Quick Start: Analytics Page

## Accessing the Analytics Page

The Analytics page is now available at the `/analytics` route.

### Prerequisites
- User must be logged in (any authenticated user, not just admins)

### Steps to Access
1. Login to the ESDC platform
2. Navigate to `http://your-domain/analytics`
3. View the Analytics Dashboard

## What You'll See

### 📊 Main Dashboard
- **Top Section**: 4 key metrics cards
  - Total Page Views
  - Total Downloads
  - Active Users
  - Server Uptime

### 🌐 Traffic Statistics
- Daily traffic (requests/day)
- Weekly traffic (requests/week)
- Monthly traffic (requests/month)

### 🖥️ Server Resources
- Total Resources count
- Total Projects count
- Total Challenges count

### 📈 Top Resources
- Table showing top 10 resources
- Ranked by total engagement (views + downloads)
- Shows individual view and download counts

## Adding a Navigation Link

To add the Analytics page to your navigation menu, add this link to your header/navbar component:

```tsx
<Link to="/analytics">Analytics</Link>
```

Or as a button:
```tsx
<button onClick={() => navigate('/analytics')}>
  <FaChartLine /> Analytics
</button>
```

## For Developers

### Backend Integration
If you have a backend, implement these endpoints:
- `GET /api/analytics/stats`
- `GET /api/analytics/resources/top?limit=10`
- `GET /api/analytics/traffic`

See `docs/ANALYTICS_PAGE.md` for detailed API specifications.

### Mock Data
If backend endpoints are not available, the page will display mock data automatically. This allows frontend development and testing without a backend.

## Customization

### Changing Mock Data
Edit `src/services/api.ts` in the `analyticsAPI` section to modify the fallback mock data.

### Styling
The page uses the same glass-morphism design as AdminPanel. Styles are inline but follow Catppuccin theme CSS variables.

### Adding More Metrics
1. Add new stat card in `src/pages/Analytics.tsx`
2. Update API service in `src/services/api.ts`
3. Implement corresponding backend endpoint

## Troubleshooting

### Page Shows Loading Forever
- Check browser console for errors
- Verify authentication token is valid
- Check network requests to API endpoints

### Mock Data Appears Instead of Real Data
- Backend endpoints may not be implemented
- Check API URL in `.env` file
- Verify CORS settings on backend

### Access Denied
- Ensure user is logged in
- Check authentication token in localStorage
- Verify ProtectedRoute is working correctly

## Related Documentation
- [Full Analytics Documentation](./ANALYTICS_PAGE.md)
- [Admin Panel Documentation](./ADMIN_PANEL.md)
- [Resources System](./features/resources-system.md)
