# Issue Tracking & Agile Workflows API Requirements

This document specifies the API endpoints required for implementing GitHub-like issue tracking and agile workflow features.

## Table of Contents

1. [Issues API](#issues-api)
2. [Labels API](#labels-api)
3. [Milestones API](#milestones-api)
4. [Comments API](#comments-api)
5. [Sprints API](#sprints-api)
6. [Epics API](#epics-api)
7. [Kanban Boards API](#kanban-boards-api)
8. [Agile Metrics API](#agile-metrics-api)

---

## Base URL

```
/api/v1
```

## Authentication

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## Issues API

### List Issues

```
GET /projects/{project_id}/issues
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string[] | Filter by status: open, in_progress, closed |
| priority | string[] | Filter by priority: critical, high, medium, low |
| type | string[] | Filter by type: bug, feature, enhancement, task, question, documentation |
| assignee_id | number[] | Filter by assignee IDs |
| label_id | number[] | Filter by label IDs |
| milestone_id | number | Filter by milestone |
| epic_id | number | Filter by epic |
| sprint_id | number | Filter by sprint |
| created_by | number | Filter by creator |
| search | string | Full-text search in title and body |
| is_overdue | boolean | Filter overdue issues |
| has_due_date | boolean | Filter issues with/without due date |
| sort_by | string | Sort field: created_at, updated_at, priority, due_date |
| sort_order | string | asc or desc |
| page | number | Page number (default: 1) |
| per_page | number | Items per page (default: 20, max: 100) |

**Response:**

```json
{
  "issues": [
    {
      "id": 1,
      "project_id": 1,
      "number": 42,
      "title": "Issue title",
      "body": "Issue description with **markdown** support",
      "status": "open",
      "priority": "high",
      "issue_type": "bug",
      "created_by": {
        "id": 1,
        "name": "John Doe",
        "avatar": "https://..."
      },
      "assignees": [
        {
          "id": 2,
          "name": "Jane Smith",
          "avatar": "https://..."
        }
      ],
      "labels": [
        {
          "id": 1,
          "name": "bug",
          "color": "#d73a4a",
          "description": "Something isn't working"
        }
      ],
      "milestone": {
        "id": 1,
        "title": "v1.0",
        "due_date": "2024-03-01"
      },
      "epic_id": 1,
      "sprint_id": 3,
      "story_points": 5,
      "due_date": "2024-02-15",
      "closed_at": null,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-16T15:30:00Z",
      "comments_count": 5,
      "reactions": {
        "thumbs_up": 3,
        "thumbs_down": 0,
        "heart": 2
      }
    }
  ],
  "total": 150
}
```

### Get Single Issue

```
GET /issues/{issue_id}
```

### Get Issue by Number

```
GET /projects/{project_id}/issues/number/{issue_number}
```

### Create Issue

```
POST /projects/{project_id}/issues
```

**Request Body:**

```json
{
  "title": "Issue title",
  "body": "Issue description",
  "priority": "high",
  "issue_type": "bug",
  "assignee_ids": [1, 2],
  "label_ids": [1, 3],
  "milestone_id": 1,
  "epic_id": 1,
  "sprint_id": 3,
  "due_date": "2024-02-15",
  "story_points": 5
}
```

### Update Issue

```
PATCH /issues/{issue_id}
```

**Request Body:** (all fields optional)

```json
{
  "title": "Updated title",
  "body": "Updated description",
  "status": "in_progress",
  "priority": "medium",
  "issue_type": "feature",
  "milestone_id": 2,
  "epic_id": 1,
  "sprint_id": 4,
  "due_date": "2024-02-20",
  "story_points": 8
}
```

### Delete Issue

```
DELETE /issues/{issue_id}
```

### Close Issue

```
POST /issues/{issue_id}/close
```

### Reopen Issue

```
POST /issues/{issue_id}/reopen
```

### Add Assignee

```
POST /issues/{issue_id}/assignees
```

**Request Body:**

```json
{
  "user_id": 1
}
```

### Remove Assignee

```
DELETE /issues/{issue_id}/assignees/{user_id}
```

### Add Label to Issue

```
POST /issues/{issue_id}/labels
```

**Request Body:**

```json
{
  "label_id": 1
}
```

### Remove Label from Issue

```
DELETE /issues/{issue_id}/labels/{label_id}
```

### Get Issue Timeline

```
GET /issues/{issue_id}/timeline
```

**Response:**

```json
[
  {
    "id": 1,
    "event_type": "created",
    "created_at": "2024-01-15T10:00:00Z",
    "actor": {
      "id": 1,
      "name": "John Doe",
      "avatar": "https://..."
    }
  },
  {
    "id": 2,
    "event_type": "label_added",
    "created_at": "2024-01-15T10:05:00Z",
    "actor": {...},
    "data": {
      "label": {
        "id": 1,
        "name": "bug",
        "color": "#d73a4a"
      }
    }
  },
  {
    "id": 3,
    "event_type": "assigned",
    "created_at": "2024-01-15T10:10:00Z",
    "actor": {...},
    "data": {
      "assignee": {
        "id": 2,
        "name": "Jane Smith"
      }
    }
  }
]
```

### Search Issues

```
GET /projects/{project_id}/issues/search?q={query}
```

### Get Issue Statistics

```
GET /projects/{project_id}/issues/statistics
```

**Response:**

```json
{
  "total_issues": 150,
  "open_issues": 80,
  "in_progress_issues": 30,
  "closed_issues": 40,
  "issues_by_priority": {
    "critical": 5,
    "high": 25,
    "medium": 60,
    "low": 60
  },
  "issues_by_type": {
    "bug": 45,
    "feature": 50,
    "enhancement": 30,
    "task": 20,
    "question": 5
  },
  "overdue_issues": 8,
  "issues_closed_this_week": 12,
  "average_time_to_close_hours": 72.5
}
```

### Bulk Operations

#### Bulk Close Issues

```
POST /issues/bulk/close
```

**Request Body:**

```json
{
  "issue_ids": [1, 2, 3]
}
```

#### Bulk Add Label

```
POST /issues/bulk/labels
```

**Request Body:**

```json
{
  "issue_ids": [1, 2, 3],
  "label_id": 1
}
```

#### Bulk Assign

```
POST /issues/bulk/assign
```

**Request Body:**

```json
{
  "issue_ids": [1, 2, 3],
  "user_id": 1
}
```

---

## Labels API

### List Labels

```
GET /projects/{project_id}/labels
```

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "bug",
    "color": "#d73a4a",
    "description": "Something isn't working",
    "issue_count": 15,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Label

```
POST /projects/{project_id}/labels
```

**Request Body:**

```json
{
  "name": "enhancement",
  "color": "#a2eeef",
  "description": "New feature or request"
}
```

### Update Label

```
PATCH /labels/{label_id}
```

### Delete Label

```
DELETE /labels/{label_id}
```

---

## Milestones API

### List Milestones

```
GET /projects/{project_id}/milestones
```

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "v1.0",
    "description": "First stable release",
    "status": "open",
    "due_date": "2024-03-01",
    "total_issues": 20,
    "open_issues": 8,
    "closed_issues": 12,
    "progress_percentage": 60,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
]
```

### Get Milestone

```
GET /milestones/{milestone_id}
```

### Create Milestone

```
POST /projects/{project_id}/milestones
```

**Request Body:**

```json
{
  "title": "v1.0",
  "description": "First stable release",
  "due_date": "2024-03-01"
}
```

### Update Milestone

```
PATCH /milestones/{milestone_id}
```

### Delete Milestone

```
DELETE /milestones/{milestone_id}
```

### Close Milestone

```
POST /milestones/{milestone_id}/close
```

### Reopen Milestone

```
POST /milestones/{milestone_id}/reopen
```

---

## Comments API

### List Comments

```
GET /issues/{issue_id}/comments
```

**Response:**

```json
[
  {
    "id": 1,
    "issue_id": 1,
    "author": {
      "id": 1,
      "name": "John Doe",
      "avatar": "https://..."
    },
    "body": "Comment with **markdown** support",
    "created_at": "2024-01-15T12:00:00Z",
    "updated_at": "2024-01-15T12:00:00Z",
    "reactions": {
      "thumbs_up": 2,
      "heart": 1
    }
  }
]
```

### Add Comment

```
POST /issues/{issue_id}/comments
```

**Request Body:**

```json
{
  "body": "Comment content with markdown"
}
```

### Update Comment

```
PATCH /comments/{comment_id}
```

**Request Body:**

```json
{
  "body": "Updated comment"
}
```

### Delete Comment

```
DELETE /comments/{comment_id}
```

---

## Sprints API

### List Sprints

```
GET /projects/{project_id}/sprints
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string[] | Filter by status: planning, active, completed, cancelled |
| start_date_from | string | Filter by start date (ISO 8601) |
| start_date_to | string | Filter by start date (ISO 8601) |
| end_date_from | string | Filter by end date (ISO 8601) |
| end_date_to | string | Filter by end date (ISO 8601) |
| has_issues | boolean | Filter sprints with/without issues |

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "Sprint 1",
    "goal": "Complete user authentication",
    "status": "active",
    "start_date": "2024-01-15",
    "end_date": "2024-01-29",
    "planned_story_points": 40,
    "completed_story_points": 25,
    "total_issues": 8,
    "completed_issues": 5,
    "velocity": 35,
    "created_at": "2024-01-10T00:00:00Z",
    "updated_at": "2024-01-20T00:00:00Z",
    "completed_at": null
  }
]
```

### Get Active Sprint

```
GET /projects/{project_id}/sprints/active
```

### Get Sprint

```
GET /sprints/{sprint_id}
```

### Create Sprint

```
POST /projects/{project_id}/sprints
```

**Request Body:**

```json
{
  "name": "Sprint 1",
  "goal": "Complete user authentication",
  "start_date": "2024-01-15",
  "end_date": "2024-01-29"
}
```

### Update Sprint

```
PATCH /sprints/{sprint_id}
```

### Delete Sprint

```
DELETE /sprints/{sprint_id}
```

### Start Sprint

```
POST /sprints/{sprint_id}/start
```

### Complete Sprint

```
POST /sprints/{sprint_id}/complete
```

### Cancel Sprint

```
POST /sprints/{sprint_id}/cancel
```

### Add Issue to Sprint

```
POST /sprints/{sprint_id}/issues
```

**Request Body:**

```json
{
  "issue_id": 1
}
```

### Remove Issue from Sprint

```
DELETE /sprints/{sprint_id}/issues/{issue_id}
```

### Move Issue Between Sprints

```
POST /sprints/{sprint_id}/issues/{issue_id}/move
```

**Request Body:**

```json
{
  "target_sprint_id": 2
}
```

### Get Sprint Statistics

```
GET /sprints/{sprint_id}/statistics
```

**Response:**

```json
{
  "total_issues": 8,
  "completed_issues": 5,
  "in_progress_issues": 2,
  "todo_issues": 1,
  "blocked_issues": 0,
  "total_story_points": 40,
  "completed_story_points": 25,
  "in_progress_story_points": 10,
  "completion_rate": 62.5,
  "velocity": 35,
  "days_remaining": 5,
  "burndown_trend": "on_track"
}
```

### Get Burndown Chart

```
GET /sprints/{sprint_id}/burndown
```

**Response:**

```json
{
  "sprint_id": 1,
  "sprint_name": "Sprint 1",
  "start_date": "2024-01-15",
  "end_date": "2024-01-29",
  "total_story_points": 40,
  "data_points": [
    {
      "date": "2024-01-15",
      "ideal_remaining": 40,
      "actual_remaining": 40,
      "completed_today": 0
    },
    {
      "date": "2024-01-16",
      "ideal_remaining": 37,
      "actual_remaining": 35,
      "completed_today": 5
    }
  ]
}
```

### Sprint Retrospective

#### Get Retrospective

```
GET /sprints/{sprint_id}/retrospective
```

**Response:**

```json
{
  "id": 1,
  "sprint_id": 1,
  "what_went_well": ["Good team collaboration", "Clear requirements"],
  "what_went_wrong": ["Too many meetings", "Scope creep"],
  "action_items": [
    {
      "id": 1,
      "description": "Reduce meeting frequency",
      "assignee_id": 1,
      "completed": false,
      "created_at": "2024-01-30T10:00:00Z"
    }
  ],
  "team_morale": 4,
  "created_at": "2024-01-30T10:00:00Z",
  "updated_at": "2024-01-30T10:00:00Z"
}
```

#### Save Retrospective

```
POST /sprints/{sprint_id}/retrospective
```

#### Update Retrospective

```
PATCH /retrospectives/{retrospective_id}
```

### Get Velocity Data

```
GET /projects/{project_id}/velocity?sprint_count=5
```

**Response:**

```json
{
  "project_id": 1,
  "sprints": [
    {
      "sprint_id": 1,
      "sprint_name": "Sprint 1",
      "planned_points": 40,
      "completed_points": 35,
      "commitment_rate": 87.5
    },
    {
      "sprint_id": 2,
      "sprint_name": "Sprint 2",
      "planned_points": 38,
      "completed_points": 38,
      "commitment_rate": 100
    }
  ],
  "average_velocity": 36.5,
  "velocity_trend": "increasing",
  "predicted_next_velocity": 38
}
```

### Backlog Management

#### Get Backlog

```
GET /projects/{project_id}/backlog
```

**Response:**

```json
{
  "issues": [1, 5, 8, 12, 15],
  "totalPoints": 45
}
```

#### Prioritize Backlog

```
PUT /projects/{project_id}/backlog/prioritize
```

**Request Body:**

```json
{
  "issue_order": [15, 1, 8, 5, 12]
}
```

---

## Epics API

### List Epics

```
GET /projects/{project_id}/epics
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string[] | Filter by status: open, in_progress, completed |
| start_date_from | string | Filter by start date |
| start_date_to | string | Filter by start date |
| target_date_from | string | Filter by target date |
| target_date_to | string | Filter by target date |
| has_issues | boolean | Filter epics with/without issues |
| is_overdue | boolean | Filter overdue epics |

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "title": "User Authentication",
    "description": "Implement complete auth system",
    "color": "#4F46E5",
    "status": "in_progress",
    "start_date": "2024-01-01",
    "target_date": "2024-03-01",
    "total_issues": 15,
    "completed_issues": 8,
    "total_story_points": 60,
    "completed_story_points": 35,
    "progress_percentage": 53,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-20T00:00:00Z"
  }
]
```

### Get Epic

```
GET /epics/{epic_id}
```

### Create Epic

```
POST /projects/{project_id}/epics
```

**Request Body:**

```json
{
  "title": "User Authentication",
  "description": "Implement complete auth system",
  "color": "#4F46E5",
  "start_date": "2024-01-01",
  "target_date": "2024-03-01"
}
```

### Update Epic

```
PATCH /epics/{epic_id}
```

### Delete Epic

```
DELETE /epics/{epic_id}
```

### Start Epic

```
POST /epics/{epic_id}/start
```

### Complete Epic

```
POST /epics/{epic_id}/complete
```

### Reopen Epic

```
POST /epics/{epic_id}/reopen
```

### Add Issue to Epic

```
POST /epics/{epic_id}/issues
```

**Request Body:**

```json
{
  "issue_id": 1
}
```

### Remove Issue from Epic

```
DELETE /epics/{epic_id}/issues/{issue_id}
```

### Get Epic Issue IDs

```
GET /epics/{epic_id}/issue-ids
```

**Response:**

```json
[1, 5, 8, 12, 15]
```

### Get Epic Statistics

```
GET /projects/{project_id}/epics/statistics
```

**Response:**

```json
{
  "total_epics": 5,
  "open_epics": 1,
  "in_progress_epics": 3,
  "completed_epics": 1,
  "overdue_epics": 1,
  "total_issues_across_epics": 75,
  "completed_issues_across_epics": 45,
  "total_story_points_across_epics": 300,
  "completed_story_points_across_epics": 180
}
```

### Get Roadmap

```
GET /projects/{project_id}/roadmap
```

**Response:**

```json
[
  {
    "epic": {
      "id": 1,
      "title": "User Authentication",
      "color": "#4F46E5",
      "status": "in_progress",
      "progress_percentage": 53
    },
    "timeline": {
      "start": "2024-01-01",
      "end": "2024-03-01",
      "duration_days": 60
    }
  }
]
```

### Search Epics

```
GET /projects/{project_id}/epics/search?q={query}
```

---

## Kanban Boards API

### List Boards

```
GET /projects/{project_id}/boards
```

**Response:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "Development Board",
    "description": "Main development workflow",
    "is_default": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z",
    "columns": [
      {
        "id": 1,
        "board_id": 1,
        "name": "Backlog",
        "column_type": "backlog",
        "position": 0,
        "wip_limit": null,
        "color": "#6B7280",
        "cards": []
      },
      {
        "id": 2,
        "board_id": 1,
        "name": "To Do",
        "column_type": "todo",
        "position": 1,
        "wip_limit": 5,
        "color": "#3B82F6",
        "cards": []
      }
    ]
  }
]
```

### Get Board

```
GET /boards/{board_id}
```

### Get Default Board

```
GET /projects/{project_id}/boards/default
```

### Create Board

```
POST /projects/{project_id}/boards
```

**Request Body:**

```json
{
  "name": "Development Board",
  "description": "Main development workflow",
  "is_default": true
}
```

### Update Board

```
PATCH /boards/{board_id}
```

### Delete Board

```
DELETE /boards/{board_id}
```

### Set Default Board

```
POST /boards/{board_id}/set-default
```

### Column Operations

#### Get Columns

```
GET /boards/{board_id}/columns
```

#### Create Column

```
POST /boards/{board_id}/columns
```

**Request Body:**

```json
{
  "name": "In Review",
  "column_type": "in_review",
  "position": 3,
  "wip_limit": 3,
  "color": "#8B5CF6"
}
```

#### Update Column

```
PATCH /columns/{column_id}
```

#### Delete Column

```
DELETE /columns/{column_id}
```

#### Reorder Columns

```
PUT /boards/{board_id}/columns/reorder
```

**Request Body:**

```json
{
  "column_order": [1, 3, 2, 4, 5]
}
```

### Card Operations

#### Get Cards

```
GET /columns/{column_id}/cards
```

**Response:**

```json
[
  {
    "id": 1,
    "column_id": 2,
    "issue_id": 42,
    "position": 0,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-16T15:30:00Z",
    "issue": {
      "id": 42,
      "number": 42,
      "title": "Implement login page",
      "priority": "high",
      "issue_type": "feature",
      "story_points": 5,
      "assignees": [
        {
          "id": 1,
          "name": "John Doe",
          "avatar": "https://..."
        }
      ],
      "labels": [
        {
          "id": 1,
          "name": "frontend",
          "color": "#3B82F6"
        }
      ],
      "due_date": "2024-02-01",
      "epic_id": 1,
      "epic_color": "#4F46E5"
    }
  }
]
```

#### Add Card

```
POST /columns/{column_id}/cards
```

**Request Body:**

```json
{
  "issue_id": 42,
  "position": 0
}
```

#### Remove Card

```
DELETE /cards/{card_id}
```

#### Move Card

```
POST /cards/{card_id}/move
```

**Request Body:**

```json
{
  "target_column_id": 3,
  "target_position": 1
}
```

#### Reorder Cards

```
PUT /columns/{column_id}/cards/reorder
```

**Request Body:**

```json
{
  "card_order": [3, 1, 5, 2]
}
```

#### Bulk Move Cards

```
POST /cards/bulk/move
```

**Request Body:**

```json
{
  "card_ids": [1, 2, 3],
  "target_column_id": 4
}
```

#### Check WIP Limit

```
GET /columns/{column_id}/wip-limit
```

**Response:**

```json
{
  "isExceeded": false,
  "current": 3,
  "limit": 5
}
```

---

## Agile Metrics API

### Get Agile Metrics

```
GET /projects/{project_id}/agile/metrics
```

**Response:**

```json
{
  "project_id": 1,
  "current_sprint": {
    "id": 3,
    "name": "Sprint 3",
    "status": "active",
    "end_date": "2024-02-01"
  },
  "average_velocity": 36.5,
  "velocity_trend": 5.2,
  "average_cycle_time_days": 3.5,
  "cycle_time_trend": -0.3,
  "average_lead_time_days": 5.2,
  "lead_time_trend": -0.5,
  "issues_completed_this_week": 12,
  "story_points_completed_this_week": 28,
  "current_wip": 8,
  "wip_trend": 0,
  "sprint_burndown_status": "on_track",
  "sprint_completion_forecast": 95
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Issue not found",
    "details": {
      "issue_id": 999
    }
  }
}
```

### Common Error Codes

| Code             | HTTP Status | Description                         |
| ---------------- | ----------- | ----------------------------------- |
| VALIDATION_ERROR | 400         | Invalid request data                |
| UNAUTHORIZED     | 401         | Missing or invalid authentication   |
| FORBIDDEN        | 403         | User doesn't have permission        |
| NOT_FOUND        | 404         | Resource not found                  |
| CONFLICT         | 409         | Resource conflict (e.g., duplicate) |
| RATE_LIMITED     | 429         | Too many requests                   |
| INTERNAL_ERROR   | 500         | Server error                        |

---

## Pagination

List endpoints support pagination:

```
GET /projects/{project_id}/issues?page=2&per_page=25
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "per_page": 25,
    "total": 150,
    "total_pages": 6,
    "has_next": true,
    "has_prev": true
  }
}
```

---

## Rate Limiting

- Standard users: 1000 requests/hour
- Authenticated users: 5000 requests/hour

Rate limit headers:

```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1699876543
```

---

## Webhooks (Future Enhancement)

For real-time updates, consider implementing webhooks for:

- Issue created/updated/closed
- Sprint started/completed
- Card moved on board
- Comment added
- Label/milestone changes

Webhook payload format:

```json
{
  "event": "issue.closed",
  "timestamp": "2024-01-20T15:30:00Z",
  "data": {
    "issue": {...},
    "actor": {...}
  }
}
```
