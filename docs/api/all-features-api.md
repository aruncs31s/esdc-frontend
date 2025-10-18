# Complete API Documentation - All Features

## Table of Contents

1. [Mentorship API](#mentorship-api)
2. [Hackathons API](#hackathons-api)
3. [Workshops API](#workshops-api)
4. [Certifications API](#certifications-api)
5. [Job Board API](#job-board-api)
6. [Forum API](#forum-api)
7. [Code Review API](#code-review-api)
8. [Analytics API](#analytics-api)
9. [Teams API](#teams-api)
10. [Integrations API](#integrations-api)

---

## Mentorship API

### Base URL: `/api/mentorship`

#### 1. Get All Mentors

**GET** `/api/mentorship/mentors`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "expertise": ["Arduino", "IoT", "Embedded Systems"],
      "bio": "10 years experience...",
      "rating": 4.8,
      "sessionsCompleted": 50,
      "availability": "available",
      "hourlyRate": 50
    }
  ]
}
```

#### 2. Book Session

**POST** `/api/mentorship/sessions`

```json
{
  "mentorId": "uuid",
  "date": "2025-01-20T15:00:00Z",
  "duration": 60,
  "topic": "Arduino basics"
}
```

#### 3. Get My Sessions

**GET** `/api/mentorship/sessions/me`

#### 4. Cancel Session

**DELETE** `/api/mentorship/sessions/:id`

#### 5. Rate Mentor

**POST** `/api/mentorship/sessions/:id/rate`

```json
{
  "rating": 5,
  "review": "Excellent session!"
}
```

---

## Hackathons API

### Base URL: `/api/hackathons`

#### 1. Get All Hackathons

**GET** `/api/hackathons`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "IoT Innovation Challenge",
      "description": "Build innovative IoT solutions",
      "startDate": "2025-02-15T00:00:00Z",
      "endDate": "2025-02-17T23:59:59Z",
      "prize": 5000,
      "maxTeamSize": 4,
      "registeredTeams": 50,
      "status": "upcoming"
    }
  ]
}
```

#### 2. Register Team

**POST** `/api/hackathons/:id/register`

```json
{
  "teamName": "Code Warriors",
  "members": ["user-id-1", "user-id-2"],
  "projectIdea": "Smart home automation"
}
```

#### 3. Submit Project

**POST** `/api/hackathons/:id/submit`

```json
{
  "projectTitle": "Smart Home Hub",
  "description": "...",
  "githubUrl": "https://github.com/...",
  "demoUrl": "https://demo.com",
  "videoUrl": "https://youtube.com/..."
}
```

#### 4. Get Leaderboard

**GET** `/api/hackathons/:id/leaderboard`

---

## Workshops API

### Base URL: `/api/workshops`

#### 1. Get All Workshops

**GET** `/api/workshops`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "PCB Design Fundamentals",
      "description": "Learn KiCad",
      "instructor": {
        "id": "uuid",
        "name": "Jane Smith"
      },
      "date": "2025-01-25T10:00:00Z",
      "duration": 180,
      "type": "online",
      "maxSeats": 20,
      "availableSeats": 5,
      "price": 50
    }
  ]
}
```

#### 2. Enroll in Workshop

**POST** `/api/workshops/:id/enroll`

#### 3. Get My Workshops

**GET** `/api/workshops/me`

#### 4. Download Materials

**GET** `/api/workshops/:id/materials`

#### 5. Submit Feedback

**POST** `/api/workshops/:id/feedback`

```json
{
  "rating": 5,
  "feedback": "Great workshop!",
  "suggestions": "More hands-on exercises"
}
```

---

## Certifications API

### Base URL: `/api/certifications`

#### 1. Get All Certifications

**GET** `/api/certifications`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Embedded Systems Professional",
      "description": "Master embedded systems",
      "modules": 12,
      "duration": 40,
      "difficulty": "intermediate",
      "prerequisites": ["Basic C programming"]
    }
  ]
}
```

#### 2. Enroll in Certification

**POST** `/api/certifications/:id/enroll`

#### 3. Get My Progress

**GET** `/api/certifications/:id/progress`

```json
{
  "success": true,
  "data": {
    "certificationId": "uuid",
    "progress": 60,
    "completedModules": 7,
    "totalModules": 12,
    "currentModule": {
      "id": "module-8",
      "title": "RTOS Basics"
    }
  }
}
```

#### 4. Complete Module

**POST** `/api/certifications/:id/modules/:moduleId/complete`

#### 5. Take Assessment

**POST** `/api/certifications/:id/assessments/:assessmentId/submit`

```json
{
  "answers": [
    { "questionId": "q1", "answer": "A" },
    { "questionId": "q2", "answer": "C" }
  ]
}
```

#### 6. Generate Certificate

**POST** `/api/certifications/:id/certificate`

---

## Job Board API

### Base URL: `/api/jobs`

#### 1. Get All Jobs

**GET** `/api/jobs`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Embedded Systems Engineer",
      "company": {
        "id": "company-id",
        "name": "Tech Corp",
        "logo": "url"
      },
      "location": "Remote",
      "type": "full-time",
      "salary": {
        "min": 80000,
        "max": 120000,
        "currency": "USD"
      },
      "description": "...",
      "requirements": ["C/C++", "RTOS", "ARM"],
      "postedAt": "2025-01-15T10:00:00Z",
      "applicants": 25
    }
  ]
}
```

#### 2. Apply for Job

**POST** `/api/jobs/:id/apply`

```json
{
  "resumeUrl": "url",
  "coverLetter": "...",
  "portfolioUrl": "url"
}
```

#### 3. Get My Applications

**GET** `/api/jobs/applications/me`

#### 4. Update Application Status

**PUT** `/api/jobs/applications/:id/status`

---

## Forum API

### Base URL: `/api/forum`

#### 1. Get All Discussions

**GET** `/api/forum/discussions`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "How to interface LCD with Arduino?",
      "content": "I'm trying to connect...",
      "author": {
        "id": "user-id",
        "name": "John Doe",
        "avatar": "url"
      },
      "category": "Hardware",
      "tags": ["Arduino", "LCD"],
      "replies": 12,
      "views": 145,
      "likes": 8,
      "createdAt": "2025-01-15T10:00:00Z",
      "lastActivity": "2025-01-15T12:00:00Z"
    }
  ]
}
```

#### 2. Create Discussion

**POST** `/api/forum/discussions`

```json
{
  "title": "Question title",
  "content": "Question content",
  "category": "Hardware",
  "tags": ["Arduino", "LCD"]
}
```

#### 3. Reply to Discussion

**POST** `/api/forum/discussions/:id/replies`

```json
{
  "content": "Here's the solution..."
}
```

#### 4. Like Discussion

**POST** `/api/forum/discussions/:id/like`

#### 5. Mark as Best Answer

**POST** `/api/forum/replies/:id/mark-best`

---

## Code Review API

### Base URL: `/api/code-review`

#### 1. Get Pull Requests

**GET** `/api/code-review/pull-requests`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Add authentication feature",
      "description": "Implements JWT-based auth",
      "author": {
        "id": "user-id",
        "name": "John Doe"
      },
      "status": "open",
      "branch": "feature/auth",
      "baseBranch": "main",
      "additions": 150,
      "deletions": 20,
      "files": 8,
      "reviewers": [],
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### 2. Create Review

**POST** `/api/code-review/pull-requests/:id/reviews`

```json
{
  "status": "approved",
  "comments": [
    {
      "file": "src/auth.ts",
      "line": 42,
      "content": "Consider using bcrypt here"
    }
  ],
  "summary": "Looks good overall"
}
```

#### 3. Approve PR

**POST** `/api/code-review/pull-requests/:id/approve`

#### 4. Request Changes

**POST** `/api/code-review/pull-requests/:id/request-changes`

---

## Analytics API

### Base URL: `/api/analytics`

#### 1. Get Dashboard Stats

**GET** `/api/analytics/dashboard`

```json
{
  "success": true,
  "data": {
    "userGrowth": {
      "current": 1234,
      "previous": 995,
      "change": 24
    },
    "engagement": {
      "rate": 87,
      "activeUsers": 856
    },
    "goals": {
      "completed": 45,
      "total": 50
    }
  }
}
```

#### 2. Get User Activity

**GET** `/api/analytics/activity`

#### 3. Get Custom Report

**POST** `/api/analytics/reports`

```json
{
  "metrics": ["users", "engagement", "revenue"],
  "dateRange": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  },
  "groupBy": "day"
}
```

---

## Teams API

### Base URL: `/api/teams`

#### 1. Get All Teams

**GET** `/api/teams`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Hardware Team",
      "description": "PCB design and prototyping",
      "members": [
        {
          "id": "user-id",
          "name": "John Doe",
          "role": "lead"
        }
      ],
      "projects": 5,
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ]
}
```

#### 2. Create Team

**POST** `/api/teams`

```json
{
  "name": "Software Team",
  "description": "Firmware development",
  "members": ["user-id-1", "user-id-2"]
}
```

#### 3. Add Member

**POST** `/api/teams/:id/members`

```json
{
  "userId": "user-id",
  "role": "member"
}
```

#### 4. Remove Member

**DELETE** `/api/teams/:id/members/:userId`

---

## Integrations API

### Base URL: `/api/integrations`

#### 1. Get Available Integrations

**GET** `/api/integrations`

#### 2. Connect Integration

**POST** `/api/integrations/:name/connect`

```json
{
  "credentials": {
    "apiKey": "key",
    "apiSecret": "secret"
  },
  "settings": {
    "notifications": true
  }
}
```

#### 3. Disconnect Integration

**DELETE** `/api/integrations/:name/disconnect`

#### 4. Get Integration Status

**GET** `/api/integrations/:name/status`

---

## Common Response Formats

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

### Pagination

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Authentication

All protected endpoints require JWT token:

```
Authorization: Bearer <token>
```

---

## Rate Limiting

- **Anonymous:** 100 requests/hour
- **Authenticated:** 1000 requests/hour
- **Premium:** 5000 requests/hour

---

## WebSocket Events

Real-time updates for:

- New notifications
- Chat messages
- Task updates
- Forum replies
- Code review comments

```javascript
socket.on('notification', (data) => {
  // Handle notification
});
```
