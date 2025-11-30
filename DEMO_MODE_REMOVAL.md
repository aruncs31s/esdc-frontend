# Demo Mode Removal Guide

## Quick Removal (3 Steps)

### Step 1: Delete Demo Module

```bash
rm -rf src/modules/demo
rm src/infrastructure/api/demoAxiosSetup.ts
```

### Step 2: Update App.tsx

Remove these lines:

```tsx
// Line ~60: Remove import
import { DemoModeToggle, DemoBanner, useDemoMode } from './modules/demo';

// Line ~65: Remove hook
const { isDemoMode } = useDemoMode();

// Line ~70-71: Remove components
<DemoModeToggle />;
{
  isDemoMode && <DemoBanner />;
}
```

### Step 3: Update main.tsx

Remove this line:

```tsx
// Line ~3: Remove import
import './infrastructure/api/demoAxiosSetup';
```

## Verification

After removal, verify:

```bash
# No demo references
grep -r "demo" src/ --exclude-dir=node_modules

# App builds successfully
npm run build

# App runs without errors
npm run dev
```

## What Gets Removed

- ❌ Demo toggle button
- ❌ Demo banner
- ❌ Mock data
- ❌ API interceptor
- ❌ Demo service
- ❌ Demo hooks

## What Stays

- ✅ All real features
- ✅ All components
- ✅ All API integrations
- ✅ All styling
- ✅ All functionality

## Zero Dependencies

The demo module has ZERO dependencies on the rest of the codebase.
Removing it will NOT break anything.

## File Checklist

Files to delete:

- [ ] `src/modules/demo/` (entire directory)
- [ ] `src/infrastructure/api/demoAxiosSetup.ts`

Files to update:

- [ ] `src/App.tsx` (3 changes)
- [ ] `src/main.tsx` (1 change)

## Automated Removal Script

```bash
#!/bin/bash
# save as remove-demo.sh

echo "Removing demo mode..."

# Delete files
rm -rf src/modules/demo
rm -f src/infrastructure/api/demoAxiosSetup.ts

# Update App.tsx
sed -i "/import.*modules\/demo/d" src/App.tsx
sed -i "/useDemoMode/d" src/App.tsx
sed -i "/<DemoModeToggle/d" src/App.tsx
sed -i "/{isDemoMode.*<DemoBanner/d" src/App.tsx

# Update main.tsx
sed -i "/demoAxiosSetup/d" src/main.tsx

echo "Demo mode removed successfully!"
echo "Run 'npm run build' to verify."
```

Usage:

```bash
chmod +x remove-demo.sh
./remove-demo.sh
```

## Rollback

If you need to restore demo mode, simply:

```bash
git checkout src/modules/demo
git checkout src/infrastructure/api/demoAxiosSetup.ts
git checkout src/App.tsx
git checkout src/main.tsx
```
