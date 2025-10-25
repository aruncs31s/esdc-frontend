# Project API Requirements

## Overview

Project management endpoints for creating, viewing, and managing user projects.

---

## 1. Get All Projects

### Endpoint

```
GET /api/projects
```

### Description

Retrieves all public projects.

### Query Parameters

| Parameter  | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| status     | string | No       | Filter by status (approved/pending) |
| technology | string | No       | Filter by technology                |
| page       | number | No       | Page number (default: 1)            |
| limit      | number | No       | Items per page (default: 20)        |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IoT Smart Home System",
      "description": "Complete home automation using Arduino and MQTT",
      "technologies": ["Arduino", "Python", "MQTT"],
      "github_url": "https://github.com/user/smart-home",
      "demo_url": "https://demo.example.com",
      "image_url": "https://example.com/project-image.jpg",
      "created_by": 5,
      "creator": {
        "id": 5,
        "username": "johndoe",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "status": "approved",
      "likes_count": 24,
      "views_count": 156,
      "created_at": "2024-01-10T00:00:00Z",
      "updated_at": "2024-01-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Implementation Notes

- Return only approved projects for public view
- Include creator information
- Support pagination
- Allow filtering by technology
- Include engagement metrics (likes, views)

---

## 2. Get Project by ID

### Endpoint

```
GET /api/projects/{id}
```

### Description

Retrieves detailed information for a specific project.

### URL Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | Project ID  |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "IoT Smart Home System",
    "description": "Complete home automation system with voice control and mobile app integration",
    "long_description": "Detailed project description...",
    "technologies": ["Arduino", "Python", "MQTT", "React Native"],
    "github_url": "https://github.com/user/smart-home",
    "demo_url": "https://demo.example.com",
    "documentation_url": "https://docs.example.com",
    "image_url": "https://example.com/project-image.jpg",
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "created_by": 5,
    "creator": {
      "id": 5,
      "username": "johndoe",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "status": "approved",
    "category": "IoT",
    "difficulty": "intermediate",
    "likes_count": 24,
    "views_count": 156,
    "comments_count": 8,
    "created_at": "2024-01-10T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

### Error Responses

#### Not Found (404)

```json
{
  "success": false,
  "error": "Project not found",
  "message": "No project exists with ID 999"
}
```

### Implementation Notes

- Increment view count on each request
- Return full project details
- Include creator profile
- Show engagement metrics

---

## 3. Create Project

### Endpoint

```
POST /api/projects
```

### Description

Creates a new project for the authenticated user.

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "New IoT Project",
  "description": "Short description",
  "long_description": "Detailed description with markdown support",
  "technologies": ["Arduino", "C++"],
  "github_url": "https://github.com/user/project",
  "demo_url": "https://demo.example.com",
  "documentation_url": "https://docs.example.com",
  "category": "IoT",
  "difficulty": "beginner",
  "image_url": "https://example.com/image.jpg"
}
```

### Request Schema

| Field             | Type     | Required | Description                       |
| ----------------- | -------- | -------- | --------------------------------- |
| title             | string   | Yes      | Project title (max 100 chars)     |
| description       | string   | Yes      | Short description (max 500 chars) |
| long_description  | string   | No       | Detailed description              |
| technologies      | string[] | Yes      | Array of technologies used        |
| github_url        | string   | No       | GitHub repository URL             |
| demo_url          | string   | No       | Live demo URL                     |
| documentation_url | string   | No       | Documentation URL                 |
| category          | string   | No       | Project category                  |
| difficulty        | string   | No       | beginner/intermediate/advanced    |
| image_url         | string   | No       | Project thumbnail URL             |

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": 46,
    "title": "New IoT Project",
    "status": "pending",
    "created_at": "2024-01-16T00:00:00Z"
  },
  "message": "Project created successfully and pending approval"
}
```

### Error Responses

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Title is required"
}
```

#### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### Implementation Notes

- Extract user ID from JWT token
- Set initial status as "pending"
- Validate all URLs
- Sanitize markdown content
- Notify admins of new submission

---

## 4. Update Project

### Endpoint

```
PUT /api/projects/{id}
```

### Description

Updates an existing project (owner only).

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "technologies": ["Arduino", "Python", "MQTT"],
  "github_url": "https://github.com/user/updated-project"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "updated_at": "2024-01-16T00:00:00Z"
  },
  "message": "Project updated successfully"
}
```

### Error Responses

#### Forbidden (403)

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You can only update your own projects"
}
```

### Implementation Notes

- Verify user owns the project
- Allow partial updates
- Reset status to "pending" if major changes
- Validate all fields

---

## 5. Delete Project

### Endpoint

```
DELETE /api/projects/{id}
```

### Description

Deletes a project (owner or admin only).

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Implementation Notes

- Verify user owns project or is admin
- Soft delete recommended
- Delete associated images/files
- Remove from search index

---

## 6. Get User's Projects

### Endpoint

```
GET /api/projects/user/{userId}
```

### Description

Retrieves all projects by a specific user.

### URL Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| userId    | number | User ID     |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IoT Smart Home",
      "description": "Home automation project",
      "status": "approved",
      "created_at": "2024-01-10T00:00:00Z"
    }
  ]
}
```

### Implementation Notes

- Return all projects for the user
- Include status for owner's view
- Support pagination

---

## 7. Like Project

### Endpoint

```
POST /api/projects/{id}/like
```

### Description

Likes or unlikes a project.

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 25
  },
  "message": "Project liked"
}
```

### Implementation Notes

- Toggle like status
- Prevent duplicate likes
- Update likes count
- Notify project owner

---

## 8. Get Project Comments

### Endpoint

```
GET /api/projects/{id}/comments
```

### Description

Retrieves comments for a project.

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": {
        "id": 3,
        "username": "commenter",
        "avatar": "https://example.com/avatar.jpg"
      },
      "content": "Great project!",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## Data Models

### Project

```typescript
{
  id: number;
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  documentation_url?: string;
  image_url?: string;
  images?: string[];
  created_by: number;
  creator?: UserProfile;
  status: 'pending' | 'approved' | 'rejected';
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  likes_count: number;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}
```

### ProjectCreateData

```typescript
{
  title: string;
  description: string;
  long_description?: string;
  technologies: string[];
  github_url?: string;
  demo_url?: string;
  documentation_url?: string;
  category?: string;
  difficulty?: string;
  image_url?: string;
}
```
