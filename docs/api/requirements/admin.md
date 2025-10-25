# Admin API Requirements

## Overview

Administrative endpoints for managing users, projects, and viewing statistics.

---

## 1. Get Admin Statistics

### Endpoint

```
GET /api/admin/stats
```

### Description

Retrieves dashboard statistics for admin panel.

### Headers

```
Authorization: Bearer <admin_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_projects": 45,
    "active_users": 89,
    "pending_projects": 12,
    "total_events": 8,
    "upcoming_events": 3
  }
}
```

### Implementation Notes

- Require admin role
- Cache results for 5 minutes
- Count only non-deleted records
- Active users = logged in last 30 days

---

## 2. Get All Projects (Admin)

### Endpoint

```
GET /api/admin/projects
```

### Description

Retrieves all projects with admin-level details.

### Headers

```
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| status    | string | No       | Filter by status (pending/approved/rejected) |
| user_id   | number | No       | Filter by user ID                            |
| page      | number | No       | Page number (default: 1)                     |
| limit     | number | No       | Items per page (default: 50)                 |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "IoT Smart Home System",
      "description": "Home automation project",
      "created_by": 5,
      "creator_name": "John Doe",
      "status": "pending",
      "created_at": "2024-01-10T00:00:00Z",
      "updated_at": "2024-01-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 45,
    "pages": 1
  }
}
```

### Implementation Notes

- Include creator information
- Support filtering and pagination
- Return projects from all users
- Include status for approval workflow

---

## 3. Get Project by ID (Admin)

### Endpoint

```
GET /api/admin/projects/{id}
```

### Description

Retrieves detailed project information.

### Headers

```
Authorization: Bearer <admin_token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "IoT Smart Home System",
    "description": "Complete home automation system",
    "technologies": ["Arduino", "Python", "MQTT"],
    "github_url": "https://github.com/user/project",
    "demo_url": "https://demo.example.com",
    "created_by": 5,
    "creator": {
      "id": 5,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "status": "pending",
    "created_at": "2024-01-10T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

---

## 4. Update Project (Admin)

### Endpoint

```
PUT /api/admin/projects/{id}
```

### Description

Updates project information or status.

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "approved",
  "technologies": ["Arduino", "Python"]
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "status": "approved",
    "updated_at": "2024-01-16T00:00:00Z"
  },
  "message": "Project updated successfully"
}
```

### Implementation Notes

- Allow status changes (pending/approved/rejected)
- Notify user on status change
- Log status changes for audit
- Validate all fields

---

## 5. Delete Project (Admin)

### Endpoint

```
DELETE /api/admin/projects/{id}
```

### Description

Deletes a project.

### Headers

```
Authorization: Bearer <admin_token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Implementation Notes

- Soft delete recommended
- Notify project owner
- Log deletion for audit
- Delete associated files/images

---

## 6. Create User (Admin)

### Endpoint

```
POST /api/admin/users
```

### Description

Creates a new user account (admin privilege).

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "temporaryPassword123",
  "name": "New User",
  "role": "user"
}
```

### Request Schema

| Field    | Type   | Required | Description                   |
| -------- | ------ | -------- | ----------------------------- |
| username | string | Yes      | Unique username               |
| email    | string | Yes      | Valid email                   |
| password | string | Yes      | Temporary password            |
| name     | string | Yes      | Full name                     |
| role     | string | No       | user or admin (default: user) |

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "message": "User created successfully",
    "user_id": 25
  }
}
```

### Implementation Notes

- Hash password before storing
- Send welcome email with credentials
- Require password change on first login
- Validate email/username uniqueness

---

## 7. Create Project (Admin)

### Endpoint

```
POST /api/admin/projects
```

### Description

Creates a project on behalf of a user.

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "user_id": 5,
  "title": "New Project",
  "description": "Project description",
  "technologies": ["Arduino", "C++"],
  "github_url": "https://github.com/user/project",
  "status": "approved"
}
```

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "message": "Project created successfully",
    "project_id": 46
  }
}
```

### Implementation Notes

- Validate user_id exists
- Set status (can be pre-approved)
- Notify user of project creation
- Validate all URLs

---

## 8. Get All Users (Admin)

### Endpoint

```
GET /api/admin/users
```

### Description

Retrieves all users with admin-level details.

### Headers

```
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type    | Required | Description             |
| --------- | ------- | -------- | ----------------------- |
| role      | string  | No       | Filter by role          |
| active    | boolean | No       | Filter by active status |
| page      | number  | No       | Page number             |
| limit     | number  | No       | Items per page          |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T10:30:00Z",
      "projects_count": 5,
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  }
}
```

### Implementation Notes

- Include user statistics
- Support filtering and sorting
- Show activity status
- Include project counts

---

## Authorization

All admin endpoints require:

1. Valid JWT token
2. User role = "admin"
3. Active admin account

### Authorization Check

```typescript
// Middleware example
if (user.role !== 'admin') {
  return res.status(403).json({
    success: false,
    error: 'Forbidden',
    message: 'Admin access required',
  });
}
```

---

## Data Models

### AdminStats

```typescript
{
  total_users: number;
  total_projects: number;
  active_users: number;
  pending_projects?: number;
  total_events?: number;
  upcoming_events?: number;
}
```

### ProjectDataForAdmin

```typescript
{
  id: number;
  title: string;
  description?: string;
  created_by: number;
  creator_name?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}
```

### UserDataForAdmin

```typescript
{
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  last_login?: string;
  projects_count?: number;
  is_active: boolean;
}
```
