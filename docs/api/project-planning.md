# Project Planning API Documentation

## Overview

A comprehensive project management system similar to GitHub Projects, Jira, and Trello. Supports kanban boards, task management, milestones, sprints, and team collaboration.

## Base URL

```
/api/planning
```

---

## 🎯 Core Features (30+ Features)

### 1. **Board Management**

- Create, read, update, delete boards
- Board templates (Kanban, Scrum, Bug Tracking)
- Board visibility (public, private, team)
- Board archiving and restoration
- Board duplication

### 2. **Task Management**

- CRUD operations for tasks
- Task status workflow (todo, in-progress, review, done)
- Task priority levels (low, medium, high, critical)
- Task assignments (single/multiple users)
- Task dependencies
- Subtasks and checklists
- Task templates
- Bulk task operations
- Task duplication
- Task archiving

### 3. **Columns & Workflow**

- Custom column creation
- Column reordering
- Column limits (WIP limits)
- Column automation rules
- Column templates

### 4. **Labels & Tags**

- Custom label creation
- Color-coded labels
- Label filtering
- Label statistics

### 5. **Milestones**

- Create project milestones
- Track milestone progress
- Milestone deadlines
- Milestone reports

### 6. **Sprints**

- Sprint planning
- Sprint backlog
- Sprint burndown charts
- Sprint velocity tracking
- Sprint retrospectives

### 7. **Time Tracking**

- Time estimates
- Time logging
- Time reports
- Burndown charts

### 8. **Comments & Activity**

- Task comments
- @mentions
- Activity feed
- Comment reactions
- Comment editing/deletion

### 9. **Attachments**

- File uploads
- Image previews
- Document linking
- Attachment versioning

### 10. **Notifications**

- Real-time notifications
- Email notifications
- Task assignments
- Due date reminders
- Comment mentions

### 11. **Search & Filters**

- Full-text search
- Advanced filtering
- Saved filters
- Quick filters

### 12. **Reports & Analytics**

- Task completion rates
- Team velocity
- Time tracking reports
- Burndown charts
- Custom reports

### 13. **Integrations**

- GitHub integration
- Slack notifications
- Calendar sync
- Webhook support

### 14. **Permissions**

- Role-based access
- Board permissions
- Task permissions
- Team permissions

### 15. **Automation**

- Auto-assignment rules
- Status change triggers
- Due date automation
- Custom workflows

---

## API Endpoints

### Boards

#### 1. Get All Boards

**GET** `/api/planning/boards`

**Query Parameters:**

- `page` (number): Page number
- `limit` (number): Items per page
- `visibility` (string): public, private, team
- `archived` (boolean): Include archived boards

**Response:**

```json
{
  "success": true,
  "data": {
    "boards": [
      {
        "id": "uuid",
        "name": "Arduino IoT Project",
        "description": "Smart home automation",
        "visibility": "team",
        "template": "kanban",
        "createdBy": "user-id",
        "createdAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z",
        "taskCount": 25,
        "memberCount": 5,
        "archived": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

#### 2. Create Board

**POST** `/api/planning/boards`

**Request Body:**

```json
{
  "name": "New Project Board",
  "description": "Project description",
  "visibility": "team",
  "template": "kanban",
  "columns": [
    { "name": "To Do", "color": "#3b82f6" },
    { "name": "In Progress", "color": "#f59e0b" },
    { "name": "Done", "color": "#10b981" }
  ]
}
```

#### 3. Update Board

**PUT** `/api/planning/boards/:id`

#### 4. Delete Board

**DELETE** `/api/planning/boards/:id`

#### 5. Archive Board

**POST** `/api/planning/boards/:id/archive`

#### 6. Duplicate Board

**POST** `/api/planning/boards/:id/duplicate`

---

### Tasks

#### 7. Get Tasks

**GET** `/api/planning/boards/:boardId/tasks`

**Query Parameters:**

- `status` (string): Filter by status
- `assignee` (string): Filter by assignee
- `priority` (string): Filter by priority
- `labels` (string[]): Filter by labels
- `search` (string): Search query
- `dueDate` (string): Filter by due date
- `sort` (string): Sort field
- `order` (string): asc/desc

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "boardId": "board-id",
        "columnId": "column-id",
        "title": "Setup Arduino IDE",
        "description": "Install and configure development environment",
        "status": "in-progress",
        "priority": "high",
        "assignees": [
          {
            "id": "user-id",
            "name": "John Doe",
            "avatar": "url"
          }
        ],
        "labels": [{ "id": "label-id", "name": "setup", "color": "#3b82f6" }],
        "dueDate": "2025-01-20T00:00:00Z",
        "estimatedTime": 120,
        "loggedTime": 60,
        "createdBy": "user-id",
        "createdAt": "2025-01-10T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z",
        "position": 0,
        "commentCount": 5,
        "attachmentCount": 2,
        "subtasks": [
          {
            "id": "subtask-id",
            "title": "Download IDE",
            "completed": true
          }
        ],
        "dependencies": ["task-id-2"],
        "blockedBy": [],
        "milestone": {
          "id": "milestone-id",
          "name": "Phase 1"
        }
      }
    ]
  }
}
```

#### 8. Create Task

**POST** `/api/planning/boards/:boardId/tasks`

**Request Body:**

```json
{
  "columnId": "column-id",
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "assignees": ["user-id-1", "user-id-2"],
  "labels": ["label-id-1"],
  "dueDate": "2025-01-25T00:00:00Z",
  "estimatedTime": 180,
  "milestoneId": "milestone-id"
}
```

#### 9. Update Task

**PUT** `/api/planning/tasks/:id`

#### 10. Move Task

**POST** `/api/planning/tasks/:id/move`

**Request Body:**

```json
{
  "columnId": "new-column-id",
  "position": 2
}
```

#### 11. Delete Task

**DELETE** `/api/planning/tasks/:id`

#### 12. Bulk Update Tasks

**POST** `/api/planning/tasks/bulk-update`

**Request Body:**

```json
{
  "taskIds": ["id1", "id2"],
  "updates": {
    "status": "done",
    "assignees": ["user-id"]
  }
}
```

---

### Columns

#### 13. Get Columns

**GET** `/api/planning/boards/:boardId/columns`

#### 14. Create Column

**POST** `/api/planning/boards/:boardId/columns`

**Request Body:**

```json
{
  "name": "In Review",
  "color": "#8b5cf6",
  "position": 2,
  "wipLimit": 5
}
```

#### 15. Update Column

**PUT** `/api/planning/columns/:id`

#### 16. Reorder Columns

**POST** `/api/planning/boards/:boardId/columns/reorder`

**Request Body:**

```json
{
  "columnOrder": ["col-1", "col-3", "col-2"]
}
```

#### 17. Delete Column

**DELETE** `/api/planning/columns/:id`

---

### Labels

#### 18. Get Labels

**GET** `/api/planning/boards/:boardId/labels`

#### 19. Create Label

**POST** `/api/planning/boards/:boardId/labels`

**Request Body:**

```json
{
  "name": "bug",
  "color": "#ef4444",
  "description": "Bug fixes"
}
```

#### 20. Update Label

**PUT** `/api/planning/labels/:id`

#### 21. Delete Label

**DELETE** `/api/planning/labels/:id`

---

### Milestones

#### 22. Get Milestones

**GET** `/api/planning/boards/:boardId/milestones`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "boardId": "board-id",
      "name": "Phase 1 - Setup",
      "description": "Initial setup and configuration",
      "dueDate": "2025-02-01T00:00:00Z",
      "status": "in-progress",
      "progress": 65,
      "taskCount": 20,
      "completedTasks": 13,
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

#### 23. Create Milestone

**POST** `/api/planning/boards/:boardId/milestones`

#### 24. Update Milestone

**PUT** `/api/planning/milestones/:id`

#### 25. Delete Milestone

**DELETE** `/api/planning/milestones/:id`

---

### Sprints

#### 26. Get Sprints

**GET** `/api/planning/boards/:boardId/sprints`

#### 27. Create Sprint

**POST** `/api/planning/boards/:boardId/sprints`

**Request Body:**

```json
{
  "name": "Sprint 1",
  "goal": "Complete user authentication",
  "startDate": "2025-01-20T00:00:00Z",
  "endDate": "2025-02-03T00:00:00Z",
  "taskIds": ["task-1", "task-2"]
}
```

#### 28. Start Sprint

**POST** `/api/planning/sprints/:id/start`

#### 29. Complete Sprint

**POST** `/api/planning/sprints/:id/complete`

#### 30. Get Sprint Report

**GET** `/api/planning/sprints/:id/report`

**Response:**

```json
{
  "success": true,
  "data": {
    "sprint": {
      "id": "sprint-id",
      "name": "Sprint 1",
      "status": "completed"
    },
    "metrics": {
      "plannedTasks": 15,
      "completedTasks": 13,
      "velocity": 87,
      "burndown": [
        { "date": "2025-01-20", "remaining": 15 },
        { "date": "2025-01-21", "remaining": 13 }
      ]
    }
  }
}
```

---

### Comments

#### 31. Get Comments

**GET** `/api/planning/tasks/:taskId/comments`

#### 32. Add Comment

**POST** `/api/planning/tasks/:taskId/comments`

**Request Body:**

```json
{
  "content": "This looks good! @john please review",
  "mentions": ["user-id"]
}
```

#### 33. Update Comment

**PUT** `/api/planning/comments/:id`

#### 34. Delete Comment

**DELETE** `/api/planning/comments/:id`

#### 35. Add Reaction

**POST** `/api/planning/comments/:id/reactions`

---

### Time Tracking

#### 36. Log Time

**POST** `/api/planning/tasks/:taskId/time-logs`

**Request Body:**

```json
{
  "duration": 120,
  "description": "Implemented feature X",
  "date": "2025-01-15T10:00:00Z"
}
```

#### 37. Get Time Logs

**GET** `/api/planning/tasks/:taskId/time-logs`

#### 38. Update Time Log

**PUT** `/api/planning/time-logs/:id`

#### 39. Delete Time Log

**DELETE** `/api/planning/time-logs/:id`

---

### Attachments

#### 40. Upload Attachment

**POST** `/api/planning/tasks/:taskId/attachments`

**Request:** Multipart form data

#### 41. Get Attachments

**GET** `/api/planning/tasks/:taskId/attachments`

#### 42. Delete Attachment

**DELETE** `/api/planning/attachments/:id`

---

### Activity & History

#### 43. Get Activity Feed

**GET** `/api/planning/boards/:boardId/activity`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "activity-id",
      "type": "task_created",
      "user": {
        "id": "user-id",
        "name": "John Doe"
      },
      "task": {
        "id": "task-id",
        "title": "Setup Arduino"
      },
      "timestamp": "2025-01-15T10:00:00Z",
      "changes": {}
    }
  ]
}
```

#### 44. Get Task History

**GET** `/api/planning/tasks/:taskId/history`

---

### Reports & Analytics

#### 45. Get Board Analytics

**GET** `/api/planning/boards/:boardId/analytics`

**Response:**

```json
{
  "success": true,
  "data": {
    "taskStats": {
      "total": 50,
      "completed": 30,
      "inProgress": 15,
      "todo": 5
    },
    "completionRate": 60,
    "averageCompletionTime": 3.5,
    "velocity": {
      "current": 12,
      "average": 10
    },
    "burndown": [],
    "memberContributions": []
  }
}
```

#### 46. Get Team Velocity

**GET** `/api/planning/boards/:boardId/velocity`

#### 47. Get Burndown Chart

**GET** `/api/planning/boards/:boardId/burndown`

---

### Automation

#### 48. Create Automation Rule

**POST** `/api/planning/boards/:boardId/automations`

**Request Body:**

```json
{
  "name": "Auto-assign to John",
  "trigger": "task_created",
  "conditions": [{ "field": "label", "operator": "contains", "value": "backend" }],
  "actions": [{ "type": "assign", "userId": "john-id" }]
}
```

#### 49. Get Automation Rules

**GET** `/api/planning/boards/:boardId/automations`

#### 50. Delete Automation Rule

**DELETE** `/api/planning/automations/:id`

---

## Database Schema

### boards

```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  visibility VARCHAR(20) DEFAULT 'team',
  template VARCHAR(50),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived BOOLEAN DEFAULT false
);
```

### columns

```sql
CREATE TABLE columns (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  position INTEGER,
  wip_limit INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### tasks

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  column_id UUID REFERENCES columns(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50),
  priority VARCHAR(20),
  due_date TIMESTAMP,
  estimated_time INTEGER,
  logged_time INTEGER DEFAULT 0,
  position INTEGER,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  milestone_id UUID REFERENCES milestones(id),
  archived BOOLEAN DEFAULT false
);
```

### task_assignees

```sql
CREATE TABLE task_assignees (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (task_id, user_id)
);
```

### labels

```sql
CREATE TABLE labels (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### task_labels

```sql
CREATE TABLE task_labels (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);
```

### milestones

```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### sprints

```sql
CREATE TABLE sprints (
  id UUID PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### comments

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### time_logs

```sql
CREATE TABLE time_logs (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  duration INTEGER NOT NULL,
  description TEXT,
  logged_at TIMESTAMP DEFAULT NOW()
);
```

### attachments

```sql
CREATE TABLE attachments (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  filename VARCHAR(255),
  file_url TEXT,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

---

## WebSocket Events

Real-time updates via WebSocket:

```javascript
// Subscribe to board updates
socket.emit('subscribe:board', { boardId: 'board-id' });

// Events
socket.on('task:created', (data) => {});
socket.on('task:updated', (data) => {});
socket.on('task:moved', (data) => {});
socket.on('task:deleted', (data) => {});
socket.on('comment:added', (data) => {});
```

---

## Implementation Notes

1. **Drag & Drop**: Implement optimistic UI updates
2. **Real-time**: Use WebSockets for live collaboration
3. **Caching**: Cache board data with Redis
4. **Search**: Use Elasticsearch for advanced search
5. **Permissions**: Implement granular RBAC
6. **Audit Log**: Track all changes for compliance
7. **Rate Limiting**: Prevent API abuse
8. **Webhooks**: Support external integrations
9. **Export**: Support CSV/JSON export
10. **Backup**: Regular automated backups
