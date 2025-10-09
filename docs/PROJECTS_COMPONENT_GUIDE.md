# Projects Component Usage Guide

## Overview
The Projects component displays a grid of community projects with data fetched from the backend or fallback to mock data.

## Component Structure

### Main Component: `Projects.tsx`
Located at: `/src/pages/Projects.tsx`

**Features:**
- Fetches projects from backend via `applicationService`
- Falls back to mock data if backend is unavailable
- Shows loading state while fetching data
- Displays projects in a responsive grid

### Reusable Component: `ProjectCard.tsx`
Located at: `/src/components/ProjectCard.tsx`

**Features:**
- Displays individual project information
- Shows project image, title, description, and technologies
- Includes GitHub and Live Demo links (if available)

## Usage Examples

### 1. Use Projects Page in Router

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Projects from './pages/Projects';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Use ProjectCard Component Anywhere

```tsx
import ProjectCard from './components/ProjectCard';
import { Project } from './domain';

function MyComponent() {
  const project: Project = {
    id: '1',
    title: 'My Project',
    description: 'A cool project',
    technologies: ['React', 'TypeScript'],
    imageUrl: 'https://example.com/image.jpg',
    githubUrl: 'https://github.com/user/repo',
    liveUrl: 'https://example.com'
  };

  return <ProjectCard project={project} />;
}
```

### 3. Create a Custom Projects List

```tsx
import { useState, useEffect } from 'react';
import ProjectCard from './components/ProjectCard';
import { Project } from './domain';

function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Fetch or filter projects
    const featured = projects.filter(p => p.featured);
    setProjects(featured);
  }, []);

  return (
    <div className="featured-projects">
      <h2>Featured Projects</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

### 4. Create a Project Gallery with Filters

```tsx
import { useState } from 'react';
import ProjectCard from './components/ProjectCard';
import { Project } from './domain';

function ProjectGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('all');

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.technologies.includes(filter));

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('React')}>React</button>
        <button onClick={() => setFilter('AI')}>AI</button>
      </div>
      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

## Project Data Structure

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  createdBy?: string;
  createdAt?: string;
}
```

## Key Features

### Loading State
The component shows a loading message while fetching data:
```tsx
if (loading) {
  return <div>Loading projects...</div>;
}
```

### Error Handling
Automatically falls back to mock data if the API fails:
```tsx
try {
  const data = await applicationService.getAllProjects();
  setProjects(data);
} catch (error) {
  setProjects(mockProjects); // Fallback
}
```

### Responsive Design
- Projects are displayed in a responsive grid
- Cards adapt to screen size
- Images maintain aspect ratio with `object-fit: cover`

## Styling

The component uses these CSS classes:
- `.projects-section` - Main container
- `.projects-grid` - Grid layout for cards
- `.project-card` - Individual project card
- `.project-image` - Image container
- `.project-content` - Text content area
- `.project-tags` - Technology tags container
- `.tag` - Individual technology tag
- `.btn-primary` / `.btn-secondary` - Button styles

## Best Practices

1. **Always provide a key**: Use unique `project.id` as the key
2. **Handle missing data**: Provide fallback images and check for optional fields
3. **Use TypeScript types**: Import and use the `Project` type from domain
4. **Lazy loading**: Consider adding lazy loading for images
5. **Accessibility**: Ensure images have alt text and links are accessible

## Customization

### Change Grid Layout
Modify the CSS for `.projects-grid` to change columns:
```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
```

### Add More Project Information
Extend the `ProjectCard` component to show additional fields:
```tsx
// Add author info, date, etc.
<div className="project-meta">
  <span>By {project.createdBy}</span>
  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
</div>
```

### Custom Styling
Pass className prop to ProjectCard for different styles:
```tsx
<ProjectCard project={project} className="featured" />
```

## Testing

Example test for ProjectCard:
```tsx
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

test('renders project card with title', () => {
  const project = {
    id: '1',
    title: 'Test Project',
    description: 'Test description',
    technologies: ['React']
  };
  
  render(<ProjectCard project={project} />);
  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
```
