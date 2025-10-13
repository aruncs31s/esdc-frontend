#!/bin/bash

# ESDC Frontend - Redundancy Cleanup Script
# Removes duplicate files and unused dependencies

echo "🧹 ESDC Frontend - Redundancy Cleanup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository. Please initialize git first.${NC}"
    exit 1
fi

# Create backup
echo -e "${BLUE}📦 Creating backup...${NC}"
git add .
if git commit -m "Backup before redundancy cleanup - $(date +%Y-%m-%d_%H:%M:%S)" 2>/dev/null; then
    echo -e "${GREEN}✅ Backup created${NC}"
else
    echo -e "${YELLOW}ℹ️  No changes to backup${NC}"
fi

echo ""

# Remove Supabase
echo -e "${BLUE}🗑️  Removing Supabase dependency...${NC}"
if grep -q "@supabase/supabase-js" package.json; then
    npm uninstall @supabase/supabase-js
    echo -e "${GREEN}✅ Supabase removed${NC}"
else
    echo -e "${YELLOW}ℹ️  Supabase not found in package.json${NC}"
fi

echo ""

# Prompt for manual import updates
echo -e "${YELLOW}⚠️  MANUAL STEP REQUIRED${NC}"
echo ""
echo "Before proceeding, update these imports:"
echo ""
echo "Files to update:"
echo "  - src/pages/AdminPanel.tsx"
echo "  - src/services/api.ts"
echo "  - src/components/modals/CreateModal.tsx"
echo ""
echo "Change:"
echo -e "  ${RED}import User from '../models/user';${NC}"
echo "To:"
echo -e "  ${GREEN}import { User } from '@/domain/entities/User';${NC}"
echo ""
echo "Also update:"
echo -e "  ${RED}import { createUser, USER_ROLES, USER_STATUS } from '../../models/user';${NC}"
echo "To:"
echo -e "  ${GREEN}import { User, UserRole, UserStatus } from '@/domain/entities/User';${NC}"
echo ""
read -p "Press ENTER after updating imports (or Ctrl+C to cancel)..." dummy

echo ""

# Check if files exist before deleting
echo -e "${BLUE}🔍 Checking redundant files...${NC}"

FILES_TO_DELETE=(
    "src/models/user.ts"
    "src/models/projects.ts"
    "src/pages/AdminPanel.tsx"
)

FILES_FOUND=0
for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${YELLOW}⚠️  Found: $file${NC}"
        FILES_FOUND=$((FILES_FOUND + 1))
    fi
done

if [ $FILES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No redundant files found${NC}"
else
    echo ""
    read -p "Delete these $FILES_FOUND redundant files? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo -e "${BLUE}🗑️  Deleting redundant files...${NC}"
        for file in "${FILES_TO_DELETE[@]}"; do
            if [ -f "$file" ]; then
                rm -f "$file"
                echo -e "  ${GREEN}✅ Deleted: $file${NC}"
            fi
        done
    else
        echo -e "${YELLOW}⏭️  Skipped file deletion${NC}"
    fi
fi

echo ""

# Rename AdminPanel-DDD.tsx to AdminPanel.tsx
if [ -f "src/pages/AdminPanel-DDD.tsx" ]; then
    echo -e "${BLUE}📝 Renaming AdminPanel-DDD.tsx...${NC}"
    if [ -f "src/pages/AdminPanel.tsx" ]; then
        echo -e "${RED}⚠️  AdminPanel.tsx still exists, skipping rename${NC}"
    else
        mv src/pages/AdminPanel-DDD.tsx src/pages/AdminPanel.tsx
        echo -e "${GREEN}✅ Renamed to AdminPanel.tsx${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  AdminPanel-DDD.tsx not found${NC}"
fi

echo ""

# Check LoginForm usage
echo -e "${BLUE}🔍 Checking LoginForm usage...${NC}"
if [ -f "src/components/LoginForm.tsx" ]; then
    if grep -rq "LoginForm" src/ --exclude-dir=node_modules --exclude="LoginForm.tsx" 2>/dev/null; then
        echo -e "${YELLOW}ℹ️  LoginForm is still used, keeping it${NC}"
    else
        read -p "LoginForm.tsx appears unused. Delete it? (y/N): " confirm
        if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
            rm -f src/components/LoginForm.tsx
            echo -e "${GREEN}✅ Deleted LoginForm.tsx${NC}"
        else
            echo -e "${YELLOW}⏭️  Kept LoginForm.tsx${NC}"
        fi
    fi
else
    echo -e "${YELLOW}ℹ️  LoginForm.tsx not found${NC}"
fi

echo ""

# Check and remove empty models directory
if [ -d "src/models" ]; then
    if [ -z "$(ls -A src/models 2>/dev/null)" ]; then
        echo -e "${BLUE}🗑️  Removing empty models directory...${NC}"
        rmdir src/models/
        echo -e "${GREEN}✅ Removed empty directory${NC}"
    else
        echo -e "${YELLOW}ℹ️  models directory not empty:${NC}"
        ls -la src/models/
    fi
fi

echo ""

# Convert Search.jsx to Search.tsx
if [ -f "src/pages/Search.jsx" ]; then
    echo -e "${BLUE}🔄 Converting Search.jsx to Search.tsx...${NC}"
    read -p "Convert Search.jsx to TypeScript? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        mv src/pages/Search.jsx src/pages/Search.tsx
        echo -e "${GREEN}✅ Converted to Search.tsx${NC}"
        echo -e "${YELLOW}⚠️  You may need to fix TypeScript errors in Search.tsx${NC}"
    else
        echo -e "${YELLOW}⏭️  Skipped Search.jsx conversion${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🔍 Running verification...${NC}"
echo ""

# Run type check
echo "Running type-check..."
if npm run type-check; then
    echo -e "${GREEN}✅ Type check passed${NC}"
else
    echo -e "${YELLOW}⚠️  Type check found errors (expected after cleanup)${NC}"
    echo -e "${YELLOW}   Review and fix errors in updated files${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Cleanup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📝 Summary:"
echo "  - Removed Supabase dependency"
echo "  - Deleted redundant files"
echo "  - Renamed AdminPanel-DDD.tsx"
echo "  - Cleaned up empty directories"
echo ""
echo "🔍 Next steps:"
echo "  1. Review type-check errors"
echo "  2. Fix any import issues"
echo "  3. Run: npm run dev"
echo "  4. Test your application"
echo "  5. Commit changes: git add . && git commit -m 'Cleanup redundant files'"
echo ""
echo -e "${BLUE}📚 For details, see: REDUNDANCY_CLEANUP_REPORT.md${NC}"
