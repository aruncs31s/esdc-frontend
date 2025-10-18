# Go Backend Implementation Guide for Projects System

This document provides a comprehensive guide to implementing the Projects system in a Go backend following Domain-Driven Design (DDD) and Clean Architecture principles.

## Table of Contents

1. [Homescreen Features](#homescreen-features)
2. [Architecture Overview](#architecture-overview)
3. [Domain Layer](#domain-layer)
4. [Application Layer](#application-layer)
5. [Infrastructure Layer](#infrastructure-layer)
6. [API Endpoints](#api-endpoints)
7. [Database Models](#database-models)
8. [Dependency Injection](#dependency-injection)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

## Homescreen Features

The homescreen (home page) displays multiple sections that showcase the platform's core features. Below is a detailed breakdown of each section and the backend implementation requirements:

### 1. **Hero Section**

**Frontend Component**: `Hero.tsx`  
**Display**: Full-width banner with title, tagline, and CTAs

**Backend Requirements**: ❌ None required

- This is a static component
- No data fetching needed
- Contains branding and navigation links

---

### 2. **About Section**

**Frontend Component**: `About.tsx`  
**Display**: Information about the organization and mission

**Backend Requirements**: ✅ Optional CMS/Content API

```go
// Domain: About Section Entity
type AboutSection struct {
    ID          string    `json:"id"`
    Title       string    `json:"title"`
    Description string    `json:"description"`
    Image       string    `json:"image_url"`
    Features    []string  `json:"features"`
    UpdatedAt   time.Time `json:"updated_at"`
}

// API Endpoint: GET /api/about
// Returns the about section content
```

---

### 3. **Projects Section** ⭐ (Primary)

**Frontend Component**: `Projects.tsx`  
**Display**: Grid of project cards with filtering and pagination

**Backend Requirements**: ✅ Full API with multiple endpoints

#### Key Data Structure:

```json
{
  "id": "project-uuid",
  "title": "Embedded Systems Project",
  "description": "A comprehensive IoT solution",
  "image": "https://cdn.example.com/project.jpg",
  "status": "in_progress",
  "category": "embedded-systems",
  "github_link": "https://github.com/...",
  "live_url": "https://project.live",
  "technologies": [
    {
      "id": "tech-uuid",
      "name": "Go",
      "category": "Backend",
      "icon": "go"
    },
    {
      "id": "tech-uuid-2",
      "name": "PostgreSQL",
      "category": "Database",
      "icon": "postgres"
    }
  ],
  "contributors": [
    {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Lead Developer",
      "image": "https://cdn.example.com/user.jpg"
    }
  ],
  "tags": [
    {
      "id": "tag-uuid",
      "name": "IoT",
      "color": "#FF6B6B"
    }
  ],
  "likes": 42,
  "views": 1250,
  "cost": 15000.5,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-10-18T14:22:00Z",
  "completed_at": null,
  "created_by": "user-uuid",
  "user_id": "user-uuid"
}
```

#### Required API Endpoints:

| Endpoint                            | Method | Purpose             | Query Parameters                                                         |
| ----------------------------------- | ------ | ------------------- | ------------------------------------------------------------------------ |
| `/api/projects`                     | GET    | Fetch all projects  | `status`, `category`, `search`, `sortBy`, `sortOrder`, `limit`, `offset` |
| `/api/projects`                     | POST   | Create new project  | None                                                                     |
| `/api/projects/{id}`                | GET    | Get project details | None                                                                     |
| `/api/projects/{id}`                | PUT    | Update project      | None                                                                     |
| `/api/projects/{id}`                | DELETE | Delete project      | None                                                                     |
| `/api/projects/{id}/like`           | POST   | Increment likes     | None                                                                     |
| `/api/projects/status/{status}`     | GET    | Filter by status    | `limit`, `offset`                                                        |
| `/api/projects/category/{category}` | GET    | Filter by category  | `limit`, `offset`                                                        |

#### Usage in Frontend:

```typescript
// Fetch all projects on component mount
const response = await apiClient.get('/api/projects?limit=10&offset=0');
const projects: Project[] = response.data.data;

// Search/filter projects
const filtered = await apiClient.get(
  '/api/projects?search=IoT&status=completed&sortBy=likes&sortOrder=desc'
);
```

---

### 4. **Team Section**

**Frontend Component**: `Team.tsx`  
**Display**: Team members/contributors showcase

**Backend Requirements**: ✅ User/Team Management API

```go
// Domain: Team Member Entity
type TeamMember struct {
    ID          string   `json:"id"`
    Name        string   `json:"name"`
    Title       string   `json:"title"`
    Image       string   `json:"image"`
    Bio         string   `json:"bio"`
    Role        string   `json:"role"` // "lead", "member", "contributor"
    Email       string   `json:"email"`
    Social      Social   `json:"social"`
    Skills      []string `json:"skills"`
    Projects    []string `json:"project_ids"`
    CreatedAt   time.Time `json:"created_at"`
}

type Social struct {
    LinkedIn   string `json:"linkedin"`
    GitHub     string `json:"github"`
    Twitter    string `json:"twitter"`
}

// API Endpoint: GET /api/team-members
// Returns list of team members
```

---

### 5. **Contact Section**

**Frontend Component**: `Contact.tsx`  
**Display**: Contact form and information

**Backend Requirements**: ✅ Contact/Message API

```go
// Domain: Contact Message Entity
type ContactMessage struct {
    ID        string    `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    Subject   string    `json:"subject"`
    Message   string    `json:"message"`
    Phone     string    `json:"phone,omitempty"`
    CreatedAt time.Time `json:"created_at"`
    Status    string    `json:"status"` // "new", "responded", "resolved"
    ReadAt    *time.Time `json:"read_at"`
}

// API Endpoints:
// POST /api/contact/messages - Submit contact form
// GET /api/contact/messages - Get all messages (admin only)
// PUT /api/contact/messages/{id} - Update message status
```

---

### Complete Homescreen Backend Architecture

```
Frontend (React)
├── Hero Section
│   └── Static Content
├── About Section
│   └── GET /api/about
├── Projects Section ⭐
│   ├── GET /api/projects (filtered, paginated)
│   ├── GET /api/projects/{id}
│   ├── POST /api/projects (create)
│   ├── PUT /api/projects/{id} (update)
│   ├── DELETE /api/projects/{id}
│   └── POST /api/projects/{id}/like
├── Team Section
│   └── GET /api/team-members
└── Contact Section
    ├── POST /api/contact/messages
    ├── GET /api/contact/messages (admin)
    └── PUT /api/contact/messages/{id}
```

### Implementation Priority

1. **Phase 1 (Essential)**:
   - Projects API ⭐ (most important - home page depends on it)
   - Contact API

2. **Phase 2 (Important)**:
   - Team Members API
   - About Section API

3. **Phase 3 (Optional)**:
   - Advanced filtering
   - Analytics/statistics endpoints
   - Caching layer

### Database Tables Needed

```sql
-- Core Projects Table (detailed in section 6)
CREATE TABLE projects (...)

-- Team Members Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    image VARCHAR(500),
    bio TEXT,
    role VARCHAR(50),
    email VARCHAR(255),
    linkedin VARCHAR(500),
    github VARCHAR(500),
    twitter VARCHAR(500),
    skills JSONB DEFAULT '[]'::jsonb,
    project_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new',
    read_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT valid_status CHECK (status IN ('new', 'responded', 'resolved'))
);

-- About Section Table
CREATE TABLE about_sections (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    features JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Architecture Overview

The Go backend follows the same DDD and Clean Architecture principles as the TypeScript frontend:

```
┌─────────────────────────────────────────────────────┐
│                  API Layer (HTTP)                    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Application Layer (Services)            │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Domain Layer (Entities)                 │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│        Infrastructure Layer (DB, Repositories)      │
└─────────────────────────────────────────────────────┘
```

## Domain Layer

### 1. Project Entity

**File**: `domain/entities/project.go`

```go
package entities

import (
    "time"
    "errors"
)

// ProjectStatus represents the status of a project
type ProjectStatus string

const (
    ProjectStatusDraft      ProjectStatus = "draft"
    ProjectStatusPlanning   ProjectStatus = "planning"
    ProjectStatusInProgress ProjectStatus = "in_progress"
    ProjectStatusCompleted  ProjectStatus = "completed"
    ProjectStatusArchived   ProjectStatus = "archived"
)

// TagDetails represents a tag associated with a project
type TagDetails struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Color string `json:"color,omitempty"`
}

// ContributorDetails represents a project contributor
type ContributorDetails struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
    Role  string `json:"role"`
    Image string `json:"image,omitempty"`
}

// TechnologyDetails represents a technology used in a project
type TechnologyDetails struct {
    ID       string `json:"id"`
    Name     string `json:"name"`
    Category string `json:"category,omitempty"`
    Icon     string `json:"icon,omitempty"`
}

// Project represents a project entity
type Project struct {
    ID          string                `json:"id"`
    Title       string                `json:"title"`
    Description string                `json:"description"`
    Image       string                `json:"image"`
    Status      ProjectStatus         `json:"status"`
    Category    string                `json:"category"`
    Tags        []TagDetails          `json:"tags"`
    GithubLink  string                `json:"github_link"`
    LiveURL     string                `json:"live_url"`
    UserID      *string               `json:"user_id"`
    Likes       int                   `json:"likes"`
    Views       int                   `json:"views"`
    CreatedAt   time.Time             `json:"created_at"`
    UpdatedAt   time.Time             `json:"updated_at"`
    CompletedAt *time.Time            `json:"completed_at"`
    Contributors []ContributorDetails `json:"contributors"`
    Technologies []TechnologyDetails  `json:"technologies"`
    CreatedBy   string                `json:"created_by"`
    ModifiedBy  string                `json:"modified_by"`
    Cost        float64               `json:"cost"`
}

// NewProject creates a new project instance
func NewProject(
    title, description, image, category, createdBy string,
    status ProjectStatus,
) *Project {
    now := time.Now()
    return &Project{
        Title:       title,
        Description: description,
        Image:       image,
        Category:    category,
        Status:      status,
        CreatedAt:   now,
        UpdatedAt:   now,
        CreatedBy:   createdBy,
        ModifiedBy:  createdBy,
        Likes:       0,
        Views:       0,
        Cost:        0,
        Tags:        []TagDetails{},
        Contributors: []ContributorDetails{},
        Technologies: []TechnologyDetails{},
    }
}

// Validation Methods

// Validate ensures the project has all required fields
func (p *Project) Validate() error {
    if p.Title == "" {
        return errors.New("project title is required")
    }
    if p.Category == "" {
        return errors.New("project category is required")
    }
    if p.Status == "" {
        return errors.New("project status is required")
    }
    return nil
}

// Business Methods

// Start transitions project from draft to planning
func (p *Project) Start() error {
    if p.Status != ProjectStatusDraft {
        return errors.New("can only start projects in draft status")
    }
    p.Status = ProjectStatusPlanning
    p.UpdatedAt = time.Now()
    return nil
}

// Begin transitions project to in_progress
func (p *Project) Begin() error {
    if p.Status != ProjectStatusPlanning {
        return errors.New("can only begin projects in planning status")
    }
    p.Status = ProjectStatusInProgress
    p.UpdatedAt = time.Now()
    return nil
}

// Complete transitions project to completed
func (p *Project) Complete() error {
    if p.Status != ProjectStatusInProgress {
        return errors.New("can only complete projects in progress")
    }
    p.Status = ProjectStatusCompleted
    now := time.Now()
    p.CompletedAt = &now
    p.UpdatedAt = now
    return nil
}

// Archive transitions project to archived
func (p *Project) Archive() error {
    p.Status = ProjectStatusArchived
    p.UpdatedAt = time.Now()
    return nil
}

// IncrementLikes increments the project likes count
func (p *Project) IncrementLikes() {
    p.Likes++
    p.UpdatedAt = time.Now()
}

// IncrementViews increments the project views count
func (p *Project) IncrementViews() {
    p.Views++
    p.UpdatedAt = time.Now()
}

// AddContributor adds a contributor to the project
func (p *Project) AddContributor(contributor ContributorDetails) {
    p.Contributors = append(p.Contributors, contributor)
    p.UpdatedAt = time.Now()
}

// AddTechnology adds a technology to the project
func (p *Project) AddTechnology(tech TechnologyDetails) {
    p.Technologies = append(p.Technologies, tech)
    p.UpdatedAt = time.Now()
}

// AddTag adds a tag to the project
func (p *Project) AddTag(tag TagDetails) {
    p.Tags = append(p.Tags, tag)
    p.UpdatedAt = time.Now()
}

// Update updates project metadata
func (p *Project) Update(title, description, image, category, modifiedBy string) error {
    if title != "" {
        p.Title = title
    }
    if description != "" {
        p.Description = description
    }
    if image != "" {
        p.Image = image
    }
    if category != "" {
        p.Category = category
    }
    p.ModifiedBy = modifiedBy
    p.UpdatedAt = time.Now()
    return p.Validate()
}
```

### 2. Project Repository Interface

**File**: `domain/repositories/project_repository.go`

```go
package repositories

import (
    "context"
    "github.com/aruncs31s/esdc-backend/domain/entities"
)

// ProjectRepository defines the interface for project data access
type ProjectRepository interface {
    // Create creates a new project
    Create(ctx context.Context, project *entities.Project) error

    // FindByID finds a project by ID
    FindByID(ctx context.Context, id string) (*entities.Project, error)

    // FindAll finds all projects with optional filters
    FindAll(ctx context.Context, filters ProjectFilters) ([]entities.Project, error)

    // Update updates a project
    Update(ctx context.Context, project *entities.Project) error

    // Delete deletes a project
    Delete(ctx context.Context, id string) error

    // FindByStatus finds all projects with a specific status
    FindByStatus(ctx context.Context, status entities.ProjectStatus) ([]entities.Project, error)

    // FindByCategory finds all projects in a category
    FindByCategory(ctx context.Context, category string) ([]entities.Project, error)

    // FindByUserID finds all projects created by a user
    FindByUserID(ctx context.Context, userID string) ([]entities.Project, error)
}

// ProjectFilters represents filter options for project queries
type ProjectFilters struct {
    Status       *entities.ProjectStatus `json:"status,omitempty"`
    Category     string                  `json:"category,omitempty"`
    UserID       string                  `json:"user_id,omitempty"`
    SearchTerm   string                  `json:"search_term,omitempty"`
    SortBy       string                  `json:"sort_by,omitempty"` // "created_at", "likes", "views"
    SortOrder    string                  `json:"sort_order,omitempty"` // "asc", "desc"
    Limit        int                     `json:"limit,omitempty"`
    Offset       int                     `json:"offset,omitempty"`
}
```

## Application Layer

### 3. Project Use Case Service

**File**: `application/services/project_service.go`

```go
package services

import (
    "context"
    "fmt"
    "github.com/google/uuid"
    "github.com/aruncs31s/esdc-backend/domain/entities"
    "github.com/aruncs31s/esdc-backend/domain/repositories"
)

// ProjectService handles project-related use cases
type ProjectService struct {
    projectRepo repositories.ProjectRepository
}

// NewProjectService creates a new instance of ProjectService
func NewProjectService(projectRepo repositories.ProjectRepository) *ProjectService {
    return &ProjectService{
        projectRepo: projectRepo,
    }
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(
    ctx context.Context,
    title, description, image, category, createdBy string,
    status entities.ProjectStatus,
) (*entities.Project, error) {
    project := entities.NewProject(title, description, image, category, createdBy, status)
    project.ID = uuid.New().String()

    if err := project.Validate(); err != nil {
        return nil, fmt.Errorf("project validation failed: %w", err)
    }

    if err := s.projectRepo.Create(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to create project: %w", err)
    }

    return project, nil
}

// GetProjectByID retrieves a project by ID and increments views
func (s *ProjectService) GetProjectByID(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    // Increment views
    project.IncrementViews()
    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project views: %w", err)
    }

    return project, nil
}

// GetAllProjects retrieves all projects with optional filters
func (s *ProjectService) GetAllProjects(
    ctx context.Context,
    filters repositories.ProjectFilters,
) ([]entities.Project, error) {
    projects, err := s.projectRepo.FindAll(ctx, filters)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch projects: %w", err)
    }
    return projects, nil
}

// UpdateProject updates an existing project
func (s *ProjectService) UpdateProject(
    ctx context.Context,
    id, title, description, image, category, modifiedBy string,
) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    if err := project.Update(title, description, image, category, modifiedBy); err != nil {
        return nil, fmt.Errorf("project update failed: %w", err)
    }

    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// DeleteProject deletes a project
func (s *ProjectService) DeleteProject(ctx context.Context, id string) error {
    if err := s.projectRepo.Delete(ctx, id); err != nil {
        return fmt.Errorf("failed to delete project: %w", err)
    }
    return nil
}

// StartProject transitions a project to planning status
func (s *ProjectService) StartProject(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    if err := project.Start(); err != nil {
        return nil, fmt.Errorf("failed to start project: %w", err)
    }

    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// BeginProject transitions a project to in_progress status
func (s *ProjectService) BeginProject(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    if err := project.Begin(); err != nil {
        return nil, fmt.Errorf("failed to begin project: %w", err)
    }

    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// CompleteProject transitions a project to completed status
func (s *ProjectService) CompleteProject(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    if err := project.Complete(); err != nil {
        return nil, fmt.Errorf("failed to complete project: %w", err)
    }

    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// ArchiveProject archives a project
func (s *ProjectService) ArchiveProject(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    if err := project.Archive(); err != nil {
        return nil, fmt.Errorf("failed to archive project: %w", err)
    }

    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// LikeProject increments likes and returns updated project
func (s *ProjectService) LikeProject(ctx context.Context, id string) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, id)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    project.IncrementLikes()
    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// AddContributorToProject adds a contributor to a project
func (s *ProjectService) AddContributorToProject(
    ctx context.Context,
    projectID string,
    contributor entities.ContributorDetails,
) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, projectID)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    project.AddContributor(contributor)
    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// AddTechnologyToProject adds a technology to a project
func (s *ProjectService) AddTechnologyToProject(
    ctx context.Context,
    projectID string,
    technology entities.TechnologyDetails,
) (*entities.Project, error) {
    project, err := s.projectRepo.FindByID(ctx, projectID)
    if err != nil {
        return nil, fmt.Errorf("failed to find project: %w", err)
    }

    project.AddTechnology(technology)
    if err := s.projectRepo.Update(ctx, project); err != nil {
        return nil, fmt.Errorf("failed to update project: %w", err)
    }

    return project, nil
}

// GetProjectsByStatus retrieves projects by status
func (s *ProjectService) GetProjectsByStatus(
    ctx context.Context,
    status entities.ProjectStatus,
) ([]entities.Project, error) {
    projects, err := s.projectRepo.FindByStatus(ctx, status)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch projects by status: %w", err)
    }
    return projects, nil
}

// GetProjectsByCategory retrieves projects by category
func (s *ProjectService) GetProjectsByCategory(
    ctx context.Context,
    category string,
) ([]entities.Project, error) {
    projects, err := s.projectRepo.FindByCategory(ctx, category)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch projects by category: %w", err)
    }
    return projects, nil
}
```

## Infrastructure Layer

### 4. PostgreSQL Repository Implementation

**File**: `infrastructure/repositories/postgres_project_repository.go`

```go
package repositories

import (
    "context"
    "database/sql"
    "encoding/json"
    "fmt"
    "strings"
    "github.com/aruncs31s/esdc-backend/domain/entities"
    "github.com/aruncs31s/esdc-backend/domain/repositories"
    "github.com/lib/pq"
)

// PostgresProjectRepository implements ProjectRepository using PostgreSQL
type PostgresProjectRepository struct {
    db *sql.DB
}

// NewPostgresProjectRepository creates a new PostgreSQL project repository
func NewPostgresProjectRepository(db *sql.DB) *PostgresProjectRepository {
    return &PostgresProjectRepository{db: db}
}

// Create inserts a new project into the database
func (r *PostgresProjectRepository) Create(ctx context.Context, project *entities.Project) error {
    query := `
        INSERT INTO projects (
            id, title, description, image, status, category,
            github_link, live_url, user_id, likes, views,
            created_at, updated_at, created_by, modified_by, cost,
            contributors, technologies, tags
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        )
    `

    contributorsJSON, _ := json.Marshal(project.Contributors)
    technologiesJSON, _ := json.Marshal(project.Technologies)
    tagsJSON, _ := json.Marshal(project.Tags)

    _, err := r.db.ExecContext(ctx, query,
        project.ID,
        project.Title,
        project.Description,
        project.Image,
        project.Status,
        project.Category,
        project.GithubLink,
        project.LiveURL,
        project.UserID,
        project.Likes,
        project.Views,
        project.CreatedAt,
        project.UpdatedAt,
        project.CreatedBy,
        project.ModifiedBy,
        project.Cost,
        contributorsJSON,
        technologiesJSON,
        tagsJSON,
    )

    if err != nil {
        return fmt.Errorf("failed to insert project: %w", err)
    }
    return nil
}

// FindByID retrieves a project by its ID
func (r *PostgresProjectRepository) FindByID(ctx context.Context, id string) (*entities.Project, error) {
    query := `
        SELECT id, title, description, image, status, category,
               github_link, live_url, user_id, likes, views,
               created_at, updated_at, completed_at, created_by, modified_by, cost,
               contributors, technologies, tags
        FROM projects
        WHERE id = $1
    `

    project := &entities.Project{}
    var (
        contributorsJSON sql.NullString
        technologiesJSON sql.NullString
        tagsJSON         sql.NullString
    )

    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &project.ID,
        &project.Title,
        &project.Description,
        &project.Image,
        &project.Status,
        &project.Category,
        &project.GithubLink,
        &project.LiveURL,
        &project.UserID,
        &project.Likes,
        &project.Views,
        &project.CreatedAt,
        &project.UpdatedAt,
        &project.CompletedAt,
        &project.CreatedBy,
        &project.ModifiedBy,
        &project.Cost,
        &contributorsJSON,
        &technologiesJSON,
        &tagsJSON,
    )

    if err == sql.ErrNoRows {
        return nil, fmt.Errorf("project not found")
    }
    if err != nil {
        return nil, fmt.Errorf("failed to query project: %w", err)
    }

    // Unmarshal JSON fields
    if contributorsJSON.Valid {
        json.Unmarshal([]byte(contributorsJSON.String), &project.Contributors)
    }
    if technologiesJSON.Valid {
        json.Unmarshal([]byte(technologiesJSON.String), &project.Technologies)
    }
    if tagsJSON.Valid {
        json.Unmarshal([]byte(tagsJSON.String), &project.Tags)
    }

    return project, nil
}

// FindAll retrieves all projects with optional filters
func (r *PostgresProjectRepository) FindAll(ctx context.Context, filters repositories.ProjectFilters) ([]entities.Project, error) {
    query := `
        SELECT id, title, description, image, status, category,
               github_link, live_url, user_id, likes, views,
               created_at, updated_at, completed_at, created_by, modified_by, cost,
               contributors, technologies, tags
        FROM projects
        WHERE 1=1
    `

    args := []interface{}{}
    argCount := 1

    // Apply filters
    if filters.Status != nil {
        query += fmt.Sprintf(" AND status = $%d", argCount)
        args = append(args, *filters.Status)
        argCount++
    }

    if filters.Category != "" {
        query += fmt.Sprintf(" AND category = $%d", argCount)
        args = append(args, filters.Category)
        argCount++
    }

    if filters.UserID != "" {
        query += fmt.Sprintf(" AND user_id = $%d", argCount)
        args = append(args, filters.UserID)
        argCount++
    }

    if filters.SearchTerm != "" {
        query += fmt.Sprintf(" AND (title ILIKE $%d OR description ILIKE $%d)", argCount, argCount+1)
        searchTerm := "%" + filters.SearchTerm + "%"
        args = append(args, searchTerm, searchTerm)
        argCount += 2
    }

    // Apply sorting
    sortBy := "created_at"
    if filters.SortBy != "" && isValidSortField(filters.SortBy) {
        sortBy = filters.SortBy
    }

    sortOrder := "DESC"
    if filters.SortOrder == "asc" {
        sortOrder = "ASC"
    }

    query += fmt.Sprintf(" ORDER BY %s %s", sortBy, sortOrder)

    // Apply pagination
    if filters.Limit > 0 {
        query += fmt.Sprintf(" LIMIT $%d", argCount)
        args = append(args, filters.Limit)
        argCount++
    }

    if filters.Offset > 0 {
        query += fmt.Sprintf(" OFFSET $%d", argCount)
        args = append(args, filters.Offset)
        argCount++
    }

    rows, err := r.db.QueryContext(ctx, query, args...)
    if err != nil {
        return nil, fmt.Errorf("failed to query projects: %w", err)
    }
    defer rows.Close()

    projects := []entities.Project{}

    for rows.Next() {
        project := entities.Project{}
        var (
            contributorsJSON sql.NullString
            technologiesJSON sql.NullString
            tagsJSON         sql.NullString
        )

        err := rows.Scan(
            &project.ID,
            &project.Title,
            &project.Description,
            &project.Image,
            &project.Status,
            &project.Category,
            &project.GithubLink,
            &project.LiveURL,
            &project.UserID,
            &project.Likes,
            &project.Views,
            &project.CreatedAt,
            &project.UpdatedAt,
            &project.CompletedAt,
            &project.CreatedBy,
            &project.ModifiedBy,
            &project.Cost,
            &contributorsJSON,
            &technologiesJSON,
            &tagsJSON,
        )

        if err != nil {
            return nil, fmt.Errorf("failed to scan project: %w", err)
        }

        // Unmarshal JSON fields
        if contributorsJSON.Valid {
            json.Unmarshal([]byte(contributorsJSON.String), &project.Contributors)
        }
        if technologiesJSON.Valid {
            json.Unmarshal([]byte(technologiesJSON.String), &project.Technologies)
        }
        if tagsJSON.Valid {
            json.Unmarshal([]byte(tagsJSON.String), &project.Tags)
        }

        projects = append(projects, project)
    }

    return projects, rows.Err()
}

// Update updates an existing project
func (r *PostgresProjectRepository) Update(ctx context.Context, project *entities.Project) error {
    query := `
        UPDATE projects SET
            title = $1,
            description = $2,
            image = $3,
            status = $4,
            category = $5,
            github_link = $6,
            live_url = $7,
            likes = $8,
            views = $9,
            updated_at = $10,
            completed_at = $11,
            modified_by = $12,
            cost = $13,
            contributors = $14,
            technologies = $15,
            tags = $16
        WHERE id = $17
    `

    contributorsJSON, _ := json.Marshal(project.Contributors)
    technologiesJSON, _ := json.Marshal(project.Technologies)
    tagsJSON, _ := json.Marshal(project.Tags)

    result, err := r.db.ExecContext(ctx, query,
        project.Title,
        project.Description,
        project.Image,
        project.Status,
        project.Category,
        project.GithubLink,
        project.LiveURL,
        project.Likes,
        project.Views,
        project.UpdatedAt,
        project.CompletedAt,
        project.ModifiedBy,
        project.Cost,
        contributorsJSON,
        technologiesJSON,
        tagsJSON,
        project.ID,
    )

    if err != nil {
        return fmt.Errorf("failed to update project: %w", err)
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return fmt.Errorf("failed to get rows affected: %w", err)
    }

    if rowsAffected == 0 {
        return fmt.Errorf("project not found")
    }

    return nil
}

// Delete removes a project from the database
func (r *PostgresProjectRepository) Delete(ctx context.Context, id string) error {
    result, err := r.db.ExecContext(ctx, "DELETE FROM projects WHERE id = $1", id)
    if err != nil {
        return fmt.Errorf("failed to delete project: %w", err)
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return fmt.Errorf("failed to get rows affected: %w", err)
    }

    if rowsAffected == 0 {
        return fmt.Errorf("project not found")
    }

    return nil
}

// FindByStatus retrieves all projects with a specific status
func (r *PostgresProjectRepository) FindByStatus(ctx context.Context, status entities.ProjectStatus) ([]entities.Project, error) {
    filters := repositories.ProjectFilters{
        Status: &status,
    }
    return r.FindAll(ctx, filters)
}

// FindByCategory retrieves all projects in a category
func (r *PostgresProjectRepository) FindByCategory(ctx context.Context, category string) ([]entities.Project, error) {
    filters := repositories.ProjectFilters{
        Category: category,
    }
    return r.FindAll(ctx, filters)
}

// FindByUserID retrieves all projects created by a user
func (r *PostgresProjectRepository) FindByUserID(ctx context.Context, userID string) ([]entities.Project, error) {
    filters := repositories.ProjectFilters{
        UserID: userID,
    }
    return r.FindAll(ctx, filters)
}

// Helper function to validate sort fields
func isValidSortField(field string) bool {
    validFields := map[string]bool{
        "created_at": true,
        "updated_at": true,
        "likes":      true,
        "views":      true,
        "title":      true,
        "status":     true,
    }
    return validFields[field]
}
```

## API Endpoints

### 5. HTTP Handlers

**File**: `interface/handlers/project_handler.go`

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    "github.com/gorilla/mux"
    "github.com/aruncs31s/esdc-backend/application/services"
    "github.com/aruncs31s/esdc-backend/domain/entities"
    "github.com/aruncs31s/esdc-backend/domain/repositories"
)

// ProjectHandler handles HTTP requests for projects
type ProjectHandler struct {
    projectService *services.ProjectService
}

// NewProjectHandler creates a new project handler
func NewProjectHandler(projectService *services.ProjectService) *ProjectHandler {
    return &ProjectHandler{
        projectService: projectService,
    }
}

// ErrorResponse represents an error response
type ErrorResponse struct {
    Error string `json:"error"`
}

// SuccessResponse represents a success response
type SuccessResponse struct {
    Data interface{} `json:"data"`
}

// PaginatedResponse represents a paginated response
type PaginatedResponse struct {
    Data  interface{} `json:"data"`
    Total int         `json:"total"`
    Page  int         `json:"page"`
    Limit int         `json:"limit"`
}

// CreateProjectRequest represents the request to create a project
type CreateProjectRequest struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Image       string `json:"image"`
    Category    string `json:"category"`
    Status      string `json:"status"`
}

// UpdateProjectRequest represents the request to update a project
type UpdateProjectRequest struct {
    Title       string `json:"title"`
    Description string `json:"description"`
    Image       string `json:"image"`
    Category    string `json:"category"`
}

// GetAllProjects handles GET /api/projects
func (h *ProjectHandler) GetAllProjects(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()

    // Parse query parameters
    status := r.URL.Query().Get("status")
    category := r.URL.Query().Get("category")
    search := r.URL.Query().Get("search")
    sortBy := r.URL.Query().Get("sortBy")
    sortOrder := r.URL.Query().Get("sortOrder")
    limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
    offset, _ := strconv.Atoi(r.URL.Query().Get("offset"))

    if limit == 0 {
        limit = 10
    }

    var statusFilter *entities.ProjectStatus
    if status != "" {
        s := entities.ProjectStatus(status)
        statusFilter = &s
    }

    filters := repositories.ProjectFilters{
        Status:     statusFilter,
        Category:   category,
        SearchTerm: search,
        SortBy:     sortBy,
        SortOrder:  sortOrder,
        Limit:      limit,
        Offset:     offset,
    }

    projects, err := h.projectService.GetAllProjects(ctx, filters)
    if err != nil {
        h.respondError(w, http.StatusInternalServerError, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, projects)
}

// GetProjectByID handles GET /api/projects/:id
func (h *ProjectHandler) GetProjectByID(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.GetProjectByID(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusNotFound, "Project not found")
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// CreateProject handles POST /api/projects
func (h *ProjectHandler) CreateProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()

    var req CreateProjectRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        h.respondError(w, http.StatusBadRequest, "Invalid request body")
        return
    }

    createdBy := r.Header.Get("X-User-ID") // Get from auth middleware
    if createdBy == "" {
        createdBy = "system"
    }

    status := entities.ProjectStatusDraft
    if req.Status != "" {
        status = entities.ProjectStatus(req.Status)
    }

    project, err := h.projectService.CreateProject(
        ctx,
        req.Title,
        req.Description,
        req.Image,
        req.Category,
        createdBy,
        status,
    )
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusCreated, project)
}

// UpdateProject handles PUT /api/projects/:id
func (h *ProjectHandler) UpdateProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    var req UpdateProjectRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        h.respondError(w, http.StatusBadRequest, "Invalid request body")
        return
    }

    modifiedBy := r.Header.Get("X-User-ID")
    if modifiedBy == "" {
        modifiedBy = "system"
    }

    project, err := h.projectService.UpdateProject(ctx, id, req.Title, req.Description, req.Image, req.Category, modifiedBy)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// DeleteProject handles DELETE /api/projects/:id
func (h *ProjectHandler) DeleteProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    if err := h.projectService.DeleteProject(ctx, id); err != nil {
        h.respondError(w, http.StatusNotFound, "Project not found")
        return
    }

    w.WriteHeader(http.StatusNoContent)
}

// StartProject handles POST /api/projects/:id/start
func (h *ProjectHandler) StartProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.StartProject(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// BeginProject handles POST /api/projects/:id/begin
func (h *ProjectHandler) BeginProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.BeginProject(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// CompleteProject handles POST /api/projects/:id/complete
func (h *ProjectHandler) CompleteProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.CompleteProject(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// ArchiveProject handles POST /api/projects/:id/archive
func (h *ProjectHandler) ArchiveProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.ArchiveProject(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// LikeProject handles POST /api/projects/:id/like
func (h *ProjectHandler) LikeProject(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    vars := mux.Vars(r)
    id := vars["id"]

    project, err := h.projectService.LikeProject(ctx, id)
    if err != nil {
        h.respondError(w, http.StatusBadRequest, err.Error())
        return
    }

    h.respondSuccess(w, http.StatusOK, project)
}

// Helper methods

func (h *ProjectHandler) respondSuccess(w http.ResponseWriter, statusCode int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(SuccessResponse{Data: data})
}

func (h *ProjectHandler) respondError(w http.ResponseWriter, statusCode int, message string) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}
```

## Database Models

### 6. Database Schema (PostgreSQL)

**File**: `migrations/001_create_projects_table.sql`

```sql
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    category VARCHAR(100) NOT NULL,
    github_link VARCHAR(500),
    live_url VARCHAR(500),
    user_id UUID,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255) NOT NULL,
    modified_by VARCHAR(255),
    cost DECIMAL(10, 2) DEFAULT 0,
    contributors JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,

    CONSTRAINT valid_status CHECK (status IN ('draft', 'planning', 'in_progress', 'completed', 'archived')),
    CONSTRAINT valid_likes CHECK (likes >= 0),
    CONSTRAINT valid_views CHECK (views >= 0),
    CONSTRAINT valid_cost CHECK (cost >= 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_title_search ON projects USING GIN(to_tsvector('english', title));
CREATE INDEX idx_projects_description_search ON projects USING GIN(to_tsvector('english', description));
```

## Dependency Injection

### 7. Service Container Setup

**File**: `infrastructure/container/container.go`

```go
package container

import (
    "database/sql"
    "github.com/aruncs31s/esdc-backend/application/services"
    "github.com/aruncs31s/esdc-backend/infrastructure/repositories"
    "github.com/aruncs31s/esdc-backend/interface/handlers"
)

// ServiceContainer manages application services
type ServiceContainer struct {
    db *sql.DB

    // Repositories
    projectRepo repositories.ProjectRepository

    // Services
    projectService *services.ProjectService

    // Handlers
    projectHandler *handlers.ProjectHandler
}

// NewServiceContainer creates a new service container
func NewServiceContainer(db *sql.DB) *ServiceContainer {
    container := &ServiceContainer{
        db: db,
    }

    // Initialize repositories
    container.projectRepo = repositories.NewPostgresProjectRepository(db)

    // Initialize services
    container.projectService = services.NewProjectService(container.projectRepo)

    // Initialize handlers
    container.projectHandler = handlers.NewProjectHandler(container.projectService)

    return container
}

// GetProjectHandler returns the project handler
func (c *ServiceContainer) GetProjectHandler() *handlers.ProjectHandler {
    return c.projectHandler
}

// GetProjectService returns the project service
func (c *ServiceContainer) GetProjectService() *services.ProjectService {
    return c.projectService
}
```

## Error Handling

### 8. Custom Error Types

**File**: `domain/errors/project_errors.go`

```go
package errors

import "fmt"

// ProjectNotFoundError is returned when a project is not found
type ProjectNotFoundError struct {
    ID string
}

func (e *ProjectNotFoundError) Error() string {
    return fmt.Sprintf("project with id %s not found", e.ID)
}

// InvalidProjectStatusError is returned when an invalid status transition is attempted
type InvalidProjectStatusError struct {
    CurrentStatus string
    TargetStatus  string
}

func (e *InvalidProjectStatusError) Error() string {
    return fmt.Sprintf("cannot transition from %s to %s", e.CurrentStatus, e.TargetStatus)
}

// ValidationError is returned when project validation fails
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}
```

## Testing

### 9. Unit Tests

**File**: `application/services/project_service_test.go`

```go
package services_test

import (
    "context"
    "testing"
    "time"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/aruncs31s/esdc-backend/application/services"
    "github.com/aruncs31s/esdc-backend/domain/entities"
    "github.com/aruncs31s/esdc-backend/domain/repositories"
)

// MockProjectRepository is a mock implementation of ProjectRepository
type MockProjectRepository struct {
    mock.Mock
}

func (m *MockProjectRepository) Create(ctx context.Context, project *entities.Project) error {
    args := m.Called(ctx, project)
    return args.Error(0)
}

func (m *MockProjectRepository) FindByID(ctx context.Context, id string) (*entities.Project, error) {
    args := m.Called(ctx, id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*entities.Project), args.Error(1)
}

func (m *MockProjectRepository) FindAll(ctx context.Context, filters repositories.ProjectFilters) ([]entities.Project, error) {
    args := m.Called(ctx, filters)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).([]entities.Project), args.Error(1)
}

func (m *MockProjectRepository) Update(ctx context.Context, project *entities.Project) error {
    args := m.Called(ctx, project)
    return args.Error(0)
}

func (m *MockProjectRepository) Delete(ctx context.Context, id string) error {
    args := m.Called(ctx, id)
    return args.Error(0)
}

func (m *MockProjectRepository) FindByStatus(ctx context.Context, status entities.ProjectStatus) ([]entities.Project, error) {
    args := m.Called(ctx, status)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).([]entities.Project), args.Error(1)
}

func (m *MockProjectRepository) FindByCategory(ctx context.Context, category string) ([]entities.Project, error) {
    args := m.Called(ctx, category)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).([]entities.Project), args.Error(1)
}

func (m *MockProjectRepository) FindByUserID(ctx context.Context, userID string) ([]entities.Project, error) {
    args := m.Called(ctx, userID)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).([]entities.Project), args.Error(1)
}

// Tests

func TestCreateProject(t *testing.T) {
    mockRepo := new(MockProjectRepository)
    mockRepo.On("Create", mock.Anything, mock.Anything).Return(nil)

    service := services.NewProjectService(mockRepo)

    project, err := service.CreateProject(
        context.Background(),
        "Test Project",
        "A test project",
        "https://example.com/image.jpg",
        "embedded-systems",
        "user123",
        entities.ProjectStatusDraft,
    )

    assert.NoError(t, err)
    assert.NotNil(t, project)
    assert.Equal(t, "Test Project", project.Title)
    assert.Equal(t, entities.ProjectStatusDraft, project.Status)
    mockRepo.AssertCalled(t, "Create", mock.Anything, mock.Anything)
}

func TestStartProject(t *testing.T) {
    draftProject := &entities.Project{
        ID:        "test-id",
        Title:     "Test Project",
        Status:    entities.ProjectStatusDraft,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }

    mockRepo := new(MockProjectRepository)
    mockRepo.On("FindByID", mock.Anything, "test-id").Return(draftProject, nil)
    mockRepo.On("Update", mock.Anything, mock.Anything).Return(nil)

    service := services.NewProjectService(mockRepo)

    project, err := service.StartProject(context.Background(), "test-id")

    assert.NoError(t, err)
    assert.NotNil(t, project)
    assert.Equal(t, entities.ProjectStatusPlanning, project.Status)
    mockRepo.AssertCalled(t, "Update", mock.Anything, mock.Anything)
}

func TestGetProjectByID_IncrementViews(t *testing.T) {
    project := &entities.Project{
        ID:        "test-id",
        Title:     "Test Project",
        Views:     0,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }

    mockRepo := new(MockProjectRepository)
    mockRepo.On("FindByID", mock.Anything, "test-id").Return(project, nil)
    mockRepo.On("Update", mock.Anything, mock.Anything).Return(nil)

    service := services.NewProjectService(mockRepo)

    retrieved, err := service.GetProjectByID(context.Background(), "test-id")

    assert.NoError(t, err)
    assert.NotNil(t, retrieved)
    assert.Equal(t, 1, retrieved.Views)
    mockRepo.AssertCalled(t, "Update", mock.Anything, mock.Anything)
}
```

## Running the Backend

### 10. Main Application Setup

**File**: `main.go`

```go
package main

import (
    "fmt"
    "log"
    "os"
    "database/sql"
    "github.com/gorilla/mux"
    _ "github.com/lib/pq"
    "github.com/aruncs31s/esdc-backend/infrastructure/container"
    "net/http"
)

func main() {
    // Database connection
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        dbURL = "postgres://user:password@localhost:5432/esdc_db?sslmode=disable"
    }

    db, err := sql.Open("postgres", dbURL)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    // Test connection
    if err := db.Ping(); err != nil {
        log.Fatalf("Failed to ping database: %v", err)
    }

    fmt.Println("Connected to database successfully")

    // Initialize service container
    serviceContainer := container.NewServiceContainer(db)

    // Setup router
    router := mux.NewRouter()
    projectHandler := serviceContainer.GetProjectHandler()

    // Project routes
    router.HandleFunc("/api/projects", projectHandler.GetAllProjects).Methods("GET")
    router.HandleFunc("/api/projects", projectHandler.CreateProject).Methods("POST")
    router.HandleFunc("/api/projects/{id}", projectHandler.GetProjectByID).Methods("GET")
    router.HandleFunc("/api/projects/{id}", projectHandler.UpdateProject).Methods("PUT")
    router.HandleFunc("/api/projects/{id}", projectHandler.DeleteProject).Methods("DELETE")
    router.HandleFunc("/api/projects/{id}/start", projectHandler.StartProject).Methods("POST")
    router.HandleFunc("/api/projects/{id}/begin", projectHandler.BeginProject).Methods("POST")
    router.HandleFunc("/api/projects/{id}/complete", projectHandler.CompleteProject).Methods("POST")
    router.HandleFunc("/api/projects/{id}/archive", projectHandler.ArchiveProject).Methods("POST")
    router.HandleFunc("/api/projects/{id}/like", projectHandler.LikeProject).Methods("POST")

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    fmt.Printf("Server running on port %s\n", port)
    log.Fatal(http.ListenAndServe(":"+port, router))
}
```

## API Documentation Summary

| Method | Endpoint                     | Purpose                                        |
| ------ | ---------------------------- | ---------------------------------------------- |
| GET    | `/api/projects`              | Get all projects with filtering and pagination |
| POST   | `/api/projects`              | Create a new project                           |
| GET    | `/api/projects/:id`          | Get a specific project by ID                   |
| PUT    | `/api/projects/:id`          | Update a project                               |
| DELETE | `/api/projects/:id`          | Delete a project                               |
| POST   | `/api/projects/:id/start`    | Start a project (draft → planning)             |
| POST   | `/api/projects/:id/begin`    | Begin a project (planning → in_progress)       |
| POST   | `/api/projects/:id/complete` | Complete a project (in_progress → completed)   |
| POST   | `/api/projects/:id/archive`  | Archive a project                              |
| POST   | `/api/projects/:id/like`     | Like a project (increment likes)               |

## Environment Variables

```bash
# Database configuration
DATABASE_URL=postgres://user:password@localhost:5432/esdc_db?sslmode=disable

# Server configuration
PORT=8080
ENV=development
```

## Dependencies

Add these to your `go.mod`:

```go
require (
    github.com/gorilla/mux v1.8.0
    github.com/lib/pq v1.10.9
    github.com/google/uuid v1.3.0
    github.com/stretchr/testify v1.8.4
)
```

## Key Principles Followed

✅ **Domain-Driven Design**: Entities with business logic, repositories for persistence
✅ **Clean Architecture**: Clear separation of concerns across layers
✅ **Dependency Injection**: Services accept dependencies via constructor
✅ **Error Handling**: Custom error types for domain logic
✅ **Testing**: Mockable repositories for unit testing
✅ **Scalability**: Indexed database queries, pagination support
✅ **Type Safety**: Strongly typed entities and interfaces
✅ **JSON Serialization**: Proper JSON handling for complex types

This backend implementation mirrors your frontend architecture and provides a robust, maintainable solution for managing projects in Go.
