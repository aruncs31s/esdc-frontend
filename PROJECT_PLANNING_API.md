# Project Planning API Requirements

## Overview

Backend API endpoints required for the Project Planning feature implementation.

---

## 1. Tasks Management

### 1.1 Get Project Tasks

**Endpoint:** `GET /api/projects/{project_id}/tasks`

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "Setup Development Environment",
    "description": "Install and configure all necessary tools",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": 5,
    "assigned_user": {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "due_date": "2025-12-15T00:00:00Z",
    "completed_at": null,
    "created_at": "2025-11-29T10:00:00Z",
    "updated_at": "2025-11-29T15:00:00Z"
  }
]
```

### 1.2 Create Task

**Endpoint:** `POST /api/projects/{project_id}/tasks`

**Request Body:**

```json
{
  "title": "Implement Authentication",
  "description": "Add JWT-based authentication",
  "status": "todo",
  "priority": "high",
  "assigned_to": 5,
  "due_date": "2025-12-20T00:00:00Z"
}
```

**Response:** Returns created task object

### 1.3 Update Task

**Endpoint:** `PUT /api/projects/{project_id}/tasks/{task_id}`

**Request Body:**

```json
{
  "status": "completed",
  "completed_at": "2025-11-29T16:00:00Z"
}
```

**Response:** Returns updated task object

### 1.4 Delete Task

**Endpoint:** `DELETE /api/projects/{project_id}/tasks/{task_id}`

**Response:** `204 No Content`

---

## 2. Milestones Management

### 2.1 Get Project Milestones

**Endpoint:** `GET /api/projects/{project_id}/milestones`

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "MVP Release",
    "description": "First working version with core features",
    "status": "in_progress",
    "target_date": "2025-12-31T00:00:00Z",
    "completed_at": null,
    "progress_percentage": 65,
    "tasks_count": 20,
    "completed_tasks_count": 13,
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-29T15:00:00Z"
  }
]
```

### 2.2 Create Milestone

**Endpoint:** `POST /api/projects/{project_id}/milestones`

**Request Body:**

```json
{
  "title": "Beta Release",
  "description": "Feature-complete version for testing",
  "target_date": "2026-01-31T00:00:00Z"
}
```

**Response:** Returns created milestone object

### 2.3 Update Milestone

**Endpoint:** `PUT /api/projects/{project_id}/milestones/{milestone_id}`

**Request Body:**

```json
{
  "status": "completed",
  "completed_at": "2025-12-30T18:00:00Z",
  "progress_percentage": 100
}
```

**Response:** Returns updated milestone object

### 2.4 Delete Milestone

**Endpoint:** `DELETE /api/projects/{project_id}/milestones/{milestone_id}`

**Response:** `204 No Content`

---

## 3. Project Timeline

### 3.1 Get Project Timeline

**Endpoint:** `GET /api/projects/{project_id}/timeline`

**Response:**

```json
{
  "project_id": 1,
  "start_date": "2025-11-01T00:00:00Z",
  "end_date": "2026-03-31T00:00:00Z",
  "total_duration_days": 150,
  "progress_percentage": 45,
  "milestones": [
    {
      "id": 1,
      "title": "MVP Release",
      "description": "First working version",
      "status": "in_progress",
      "target_date": "2025-12-31T00:00:00Z",
      "completed_at": null,
      "progress_percentage": 65,
      "tasks_count": 20,
      "completed_tasks_count": 13,
      "created_at": "2025-11-01T10:00:00Z",
      "updated_at": "2025-11-29T15:00:00Z"
    }
  ],
  "tasks": []
}
```

---

## 4. Team Management

### 4.1 Get Team Members

**Endpoint:** `GET /api/projects/{project_id}/team`

**Response:**

```json
[
  {
    "id": 1,
    "user_id": 5,
    "project_id": 1,
    "role": "Lead Developer",
    "permissions": ["read", "write", "delete", "manage_team"],
    "joined_at": "2025-11-01T10:00:00Z",
    "user_details": {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
]
```

### 4.2 Add Team Member

**Endpoint:** `POST /api/projects/{project_id}/team`

**Request Body:**

```json
{
  "user_id": 10,
  "role": "Frontend Developer",
  "permissions": ["read", "write"]
}
```

**Response:** Returns created team member object

### 4.3 Update Team Member

**Endpoint:** `PUT /api/projects/{project_id}/team/{member_id}`

**Request Body:**

```json
{
  "role": "Senior Developer",
  "permissions": ["read", "write", "delete"]
}
```

**Response:** Returns updated team member object

### 4.4 Remove Team Member

**Endpoint:** `DELETE /api/projects/{project_id}/team/{member_id}`

**Response:** `204 No Content`

---

## 5. Resources Management

### 5.1 Get Project Resources

**Endpoint:** `GET /api/projects/{project_id}/resources`

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "API Documentation",
    "type": "document",
    "url": "https://docs.example.com/api",
    "description": "Complete API reference",
    "created_at": "2025-11-15T10:00:00Z"
  }
]
```

### 5.2 Add Resource

**Endpoint:** `POST /api/projects/{project_id}/resources`

**Request Body:**

```json
{
  "name": "Design Mockups",
  "type": "file",
  "url": "https://figma.com/file/abc123",
  "description": "UI/UX design files"
}
```

**Response:** Returns created resource object

### 5.3 Delete Resource

**Endpoint:** `DELETE /api/projects/{project_id}/resources/{resource_id}`

**Response:** `204 No Content`

---

## 6. Activity Log

### 6.1 Get Project Activity

**Endpoint:** `GET /api/projects/{project_id}/activity?limit=50`

**Query Parameters:**

- `limit` (optional): Number of activities to return (default: 50)

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "user_id": 5,
    "action": "task_created",
    "description": "Created task: Implement Authentication",
    "metadata": {
      "task_id": 15,
      "task_title": "Implement Authentication"
    },
    "created_at": "2025-11-29T15:30:00Z",
    "user_details": {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

## Database Schema Requirements

### Tasks Table

```sql
CREATE TABLE project_tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'in_progress', 'review', 'completed') DEFAULT 'todo',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  assigned_to INT,
  due_date TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

### Milestones Table

```sql
CREATE TABLE project_milestones (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'delayed') DEFAULT 'pending',
  target_date TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NULL,
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Team Members Table

```sql
CREATE TABLE project_team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  project_id INT NOT NULL,
  role VARCHAR(100) NOT NULL,
  permissions JSON,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (user_id, project_id)
);
```

### Resources Table

```sql
CREATE TABLE project_resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('link', 'file', 'document', 'tool') NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### Activity Log Table

```sql
CREATE TABLE project_activity (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Authentication & Authorization

All endpoints require:

- **Authentication**: Bearer token in Authorization header
- **Authorization**: User must be project owner or team member with appropriate permissions

**Permissions:**

- `read`: View tasks, milestones, team
- `write`: Create/update tasks, milestones
- `delete`: Delete tasks, milestones, resources
- `manage_team`: Add/remove team members

---

## Error Responses

```json
{
  "error": "Unauthorized",
  "message": "You don't have permission to access this project",
  "status": 403
}
```

```json
{
  "error": "Not Found",
  "message": "Task not found",
  "status": 404
}
```

```json
{
  "error": "Validation Error",
  "message": "Invalid task status",
  "status": 400
}
```

---

## Implementation Notes

1. **Task Status Transitions**: Implement validation for valid status transitions
2. **Milestone Progress**: Auto-calculate based on completed tasks
3. **Activity Logging**: Auto-create activity entries for all actions
4. **Notifications**: Trigger notifications when tasks are assigned or completed
5. **Real-time Updates**: Consider WebSocket support for live collaboration
6. **Permissions**: Implement role-based access control
7. **Pagination**: Add pagination for large task/activity lists
8. **Filtering**: Support filtering tasks by status, priority, assignee
9. **Search**: Implement full-text search for tasks and milestones
10. **Bulk Operations**: Support bulk task updates/deletions
