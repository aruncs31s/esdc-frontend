# Quick Start Guide - New Features

## 🚀 For Frontend Developers

### Testing New Pages

All new pages are accessible via these routes:

```bash
# Project Planning (GitHub-style)
http://localhost:5173/planning

# Blog System
http://localhost:5173/blog

# Mentorship
http://localhost:5173/mentorship

# Hackathons
http://localhost:5173/hackathons

# Workshops
http://localhost:5173/workshops

# Certifications
http://localhost:5173/certifications

# Job Board
http://localhost:5173/jobs

# Forum
http://localhost:5173/forum

# Documentation
http://localhost:5173/docs

# Code Review
http://localhost:5173/code-review

# Analytics
http://localhost:5173/analytics

# Teams
http://localhost:5173/teams

# Integrations
http://localhost:5173/integrations

# Roadmap
http://localhost:5173/roadmap
```

### Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 For Backend Developers

### Quick API Implementation Guide

#### 1. Project Planning API (Priority: HIGH)

**Start with these endpoints:**

```javascript
// 1. Get boards
GET /api/planning/boards

// 2. Create board
POST /api/planning/boards
{
  "name": "My Project",
  "template": "kanban"
}

// 3. Get tasks
GET /api/planning/boards/:boardId/tasks

// 4. Create task
POST /api/planning/boards/:boardId/tasks
{
  "title": "Task title",
  "status": "todo",
  "priority": "high"
}

// 5. Move task
POST /api/planning/tasks/:id/move
{
  "columnId": "new-column-id",
  "position": 0
}
```

**Database Setup:**

```sql
-- Run these in order
CREATE TABLE boards (...);
CREATE TABLE columns (...);
CREATE TABLE tasks (...);
CREATE TABLE task_assignees (...);
CREATE TABLE labels (...);
```

See `/docs/api/project-planning.md` for complete schema.

---

#### 2. Blog API (Priority: MEDIUM)

**Start with these endpoints:**

```javascript
// 1. Get posts
GET /api/blog/posts?page=1&limit=10

// 2. Get single post
GET /api/blog/posts/:slug

// 3. Create post
POST /api/blog/posts
{
  "title": "Post title",
  "content": "Markdown content",
  "tags": ["tag1", "tag2"]
}

// 4. Add comment
POST /api/blog/posts/:id/comments
{
  "content": "Comment text"
}
```

**Database Setup:**

```sql
CREATE TABLE posts (...);
CREATE TABLE comments (...);
CREATE TABLE post_likes (...);
```

See `/docs/api/blog.md` for complete schema.

---

#### 3. Other Features (Priority: LOW-MEDIUM)

All other features follow similar patterns. See `/docs/api/all-features-api.md` for complete documentation.

---

## 📁 Project Structure

```
esdc-frontend/
├── src/
│   ├── pages/              # All page components
│   │   ├── ProjectPlanning.tsx
│   │   ├── Blog.tsx
│   │   └── ...
│   │
│   ├── styles/             # Page-specific styles
│   │   ├── project-planning.css
│   │   ├── blog.css
│   │   └── ...
│   │
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   └── App.tsx             # Main app with routes
│
├── docs/
│   ├── api/                # API documentation
│   │   ├── project-planning.md
│   │   ├── blog.md
│   │   └── all-features-api.md
│   │
│   ├── FEATURES_OVERVIEW.md
│   ├── NEW_FEATURES_SUMMARY.md
│   └── QUICK_START_GUIDE.md (this file)
│
└── package.json
```

---

## 🎨 Styling Guide

All pages use the existing CSS variable system:

```css
/* Colors */
var(--base)       /* Page background */
var(--mantle)     /* Card background */
var(--surface0)   /* Input background */
var(--surface1)   /* Border color */

/* Text */
var(--text)       /* Primary text */
var(--subtext0)   /* Secondary text */
var(--subtext1)   /* Tertiary text */

/* Theme colors */
var(--blue)       /* Primary */
var(--green)      /* Success */
var(--yellow)     /* Warning */
var(--red)        /* Error */
var(--mauve)      /* Accent */
```

### Example Component:

```tsx
import '../styles/my-page.css';

export default function MyPage() {
  return (
    <div className="my-page">
      <div className="container">
        <h1>Page Title</h1>
        <p>Page description</p>

        <div className="content-grid">{/* Content here */}</div>
      </div>
    </div>
  );
}
```

### Example CSS:

```css
.my-page {
  min-height: 100vh;
  padding: 6rem 0 3rem;
  background: var(--base);
}

.my-page h1 {
  font-size: 2.5rem;
  color: var(--text);
  text-align: center;
  margin-bottom: 0.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

---

## 🔌 API Integration

### Setting up API calls:

```typescript
// src/services/planning.ts
export const planningService = {
  async getBoards() {
    const response = await fetch('/api/planning/boards');
    return response.json();
  },

  async createBoard(data: any) {
    const response = await fetch('/api/planning/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### Using in components:

```typescript
import { useState, useEffect } from 'react';
import { planningService } from '../services/planning';

export default function ProjectPlanning() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    planningService.getBoards()
      .then(data => setBoards(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {boards.map(board => (
        <div key={board.id}>{board.name}</div>
      ))}
    </div>
  );
}
```

---

## 🧪 Testing

### Manual Testing Checklist:

#### Project Planning:

- [ ] Can view boards
- [ ] Can create new board
- [ ] Can add tasks
- [ ] Can move tasks between columns
- [ ] Can assign users
- [ ] Can add labels
- [ ] Can filter tasks

#### Blog:

- [ ] Can view posts
- [ ] Can search posts
- [ ] Can filter by category
- [ ] Can view single post
- [ ] Can add comments

#### Other Pages:

- [ ] All routes load correctly
- [ ] Responsive on mobile
- [ ] Dark/light theme works
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Issue: Page not loading

**Solution:** Check if route is added in `App.tsx`

### Issue: Styles not applying

**Solution:** Verify CSS file is imported in component

### Issue: API calls failing

**Solution:** Check if backend is running and CORS is configured

### Issue: Theme not working

**Solution:** Ensure CSS variables are used, not hardcoded colors

---

## 📚 Documentation Links

- **Features Overview:** `/docs/FEATURES_OVERVIEW.md`
- **Implementation Summary:** `/docs/NEW_FEATURES_SUMMARY.md`
- **Project Planning API:** `/docs/api/project-planning.md`
- **Blog API:** `/docs/api/blog.md`
- **All Features API:** `/docs/api/all-features-api.md`

---

## 🎯 Next Steps

### For Frontend:

1. Test all new pages
2. Add loading states
3. Add error handling
4. Implement API integration
5. Add form validation

### For Backend:

1. Review API documentation
2. Set up database schema
3. Implement authentication
4. Create API endpoints
5. Test with frontend

---

## 💡 Tips

1. **Use existing components** when possible
2. **Follow naming conventions** from existing code
3. **Keep styles consistent** with design system
4. **Document your changes** in code comments
5. **Test on multiple devices** before committing

---

## 📞 Need Help?

- Check existing code for examples
- Review documentation in `/docs/`
- Ask team members
- Create GitHub issues

---

**Happy Coding! 🚀**
