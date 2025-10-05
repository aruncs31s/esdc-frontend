# ESDC Backend API Implementation Requirements

**Project:** ESDC (Embedded Systems Design Club) React Application  
**Backend URL:** `https://esdc-backend.onrender.com`  
**Created:** October 5, 2025  
**Status:** Comprehensive Feature Requirements

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [User Management](#user-management)
5. [Admin Panel Features](#admin-panel-features)
6. [Challenges System](#challenges-system)
7. [Events Management](#events-management)
8. [Resources System](#resources-system)
9. [Projects Management](#projects-management)
10. [Leaderboard System](#leaderboard-system)
11. [Dashboard & Statistics](#dashboard--statistics)
12. [Chatbot Integration](#chatbot-integration)
13. [Games System](#games-system)
14. [Database Schema](#database-schema)
15. [API Endpoints Summary](#api-endpoints-summary)

---

## Overview

The ESDC application is a comprehensive platform for embedded systems enthusiasts featuring:
- User authentication and profile management
- Admin panel for content management
- Coding challenges and competitions
- Event registration and management
- Learning resources library
- Project showcase
- Leaderboard and gamification
- AI-powered chatbot assistant
- Classic arcade games

### Technology Stack (Frontend)
- **Framework:** React 19 with Vite
- **Routing:** React Router
- **HTTP Client:** Axios
- **Authentication:** JWT-based
- **State Management:** Context API

---

## Architecture

### Request Flow
```
Frontend (React) 
  ↓ HTTP/HTTPS
API Gateway/Backend (Go)
  ↓
Database (PostgreSQL recommended)
  ↓
File Storage (S3/Local)
```

### Security Requirements
- JWT token-based authentication
- Bearer token in Authorization header
- Token expiration and refresh mechanism
- Role-based access control (Admin, User, Moderator)
- CORS configuration for frontend origin
- Input validation and sanitization
- SQL injection prevention
- XSS protection

---

## Authentication & Authorization

### 1. User Registration

**Endpoint:** `POST /api/user/register`

**Request Body:**
```json
{
  "username": "string (required, min: 3, max: 50, unique)",
  "email": "string (required, valid email, unique)",
  "password": "string (required, min: 8, must contain: uppercase, lowercase, number)",
  "github_username": "string (optional)",
  "bio": "string (optional, max: 500)"
}
```

**Response (Success - 201):**
```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "user",
      "status": "active",
      "github_username": "string",
      "created_at": "timestamp"
    },
    "token": "jwt_token_here"
  }
}
```

**Error Responses:**
- `400`: Validation error (email already exists, weak password, etc.)
- `500`: Server error

**Implementation Notes:**
- Hash passwords using bcrypt (cost factor: 10-12)
- Generate JWT token with user ID, email, role
- Token should expire in 24 hours
- Send welcome email (optional)

---

### 2. User Login

**Endpoint:** `POST /api/user/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "user|admin|moderator",
      "status": "active",
      "avatar": "url",
      "points": 0,
      "completed_challenges": 0
    }
  }
}
```

**JWT Payload Structure:**
```json
{
  "sub": "user_email",
  "user": "username",
  "role": "user|admin|moderator",
  "exp": "expiration_timestamp",
  "iat": "issued_at_timestamp"
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account suspended/inactive
- `429`: Too many login attempts (rate limiting)

---

### 3. User Logout

**Endpoint:** `POST /api/user/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "Logout successful"
}
```

**Implementation Notes:**
- Add token to blacklist (Redis recommended)
- Clear server-side session if any
- Token should be invalidated

---

### 4. Get User Profile

**Endpoint:** `GET /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "string",
      "status": "active",
      "github_username": "string",
      "avatar": "url",
      "bio": "string",
      "points": 450,
      "completed_challenges": 12,
      "rank": 45,
      "streak": 7,
      "joined_date": "timestamp",
      "last_active": "timestamp",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
}
```

---

### 5. Update User Profile

**Endpoint:** `PUT /api/user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "string (optional)",
  "bio": "string (optional)",
  "avatar": "url (optional)",
  "github_username": "string (optional)"
}
```

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

## User Management

### User Model Structure

```javascript
{
  id: "uuid",
  username: "string (unique)",
  email: "string (unique)",
  password_hash: "string (hashed)",
  role: "user|admin|moderator",
  status: "active|inactive|suspended|pending",
  github_username: "string (nullable)",
  avatar: "url (nullable)",
  bio: "text (nullable)",
  points: "integer (default: 0)",
  completed_challenges: "integer (default: 0)",
  rank: "integer (calculated)",
  streak: "integer (default: 0)",
  last_active: "timestamp (nullable)",
  joined_date: "timestamp",
  created_at: "timestamp",
  updated_at: "timestamp"
}
```

### User Status Definitions
- **active**: Normal user, full access
- **inactive**: User hasn't verified email or inactive account
- **suspended**: Banned user, no access
- **pending**: Registration pending approval (if moderation enabled)

---

## Admin Panel Features

### 1. Admin Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": {
    "total_users": 150,
    "total_projects": 45,
    "total_challenges": 28,
    "active_users": 89,
    "pending_submissions": 12,
    "upcoming_events": 5,
    "total_resources": 67,
    "monthly_registrations": 23,
    "monthly_active_users": 78,
    "monthly_submissions": 156
  }
}
```

**Implementation Notes:**
- Cache results for 5-10 minutes
- Run queries optimized with indexes
- Calculate active users (last 30 days activity)

---

### 2. User Management (Admin)

#### Get All Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page`: integer (default: 1)
- `limit`: integer (default: 20, max: 100)
- `search`: string (search username/email)
- `role`: string (filter by role)
- `status`: string (filter by status)
- `sort`: string (created_at|username|points)
- `order`: string (asc|desc)

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "user",
      "status": "active",
      "github_username": "string",
      "points": 450,
      "completed_challenges": 12,
      "joined_date": "timestamp",
      "last_active": "timestamp",
      "created_at": "timestamp"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

#### Create User (Admin)

**Endpoint:** `POST /api/admin/users`

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "user|admin|moderator (default: user)",
  "status": "active|inactive (default: active)",
  "github_username": "string (optional)",
  "bio": "string (optional)"
}
```

**Response:** Same as registration

---

#### Update User (Admin)

**Endpoint:** `PUT /api/admin/users/:userId`

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "role": "string (optional)",
  "status": "string (optional)",
  "points": "integer (optional)",
  "bio": "string (optional)"
}
```

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "User updated successfully",
  "data": {
    "user": { /* updated user object */ }
  }
}
```

---

#### Delete User (Admin)

**Endpoint:** `DELETE /api/admin/users/:userId`

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "User deleted successfully"
}
```

**Implementation Notes:**
- Soft delete recommended (set deleted_at timestamp)
- Archive user data instead of permanent deletion
- Remove from leaderboards
- Cancel event registrations

---

### 3. Projects Management (Admin)

#### Get All Projects

**Endpoint:** `GET /api/admin/projects`

**Query Parameters:**
- `page`, `limit`, `search`, `status`, `sort`, `order`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "Smart Home Automation",
      "description": "IoT-based home automation system",
      "technologies": ["ESP32", "Arduino", "MQTT"],
      "github_url": "https://github.com/user/project",
      "live_url": "https://demo.com",
      "thumbnail": "url",
      "user_id": "uuid",
      "username": "creator_username",
      "status": "active|archived|draft",
      "views": 150,
      "stars": 24,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "pagination": { /* pagination object */ }
}
```

---

#### Create Project

**Endpoint:** `POST /api/admin/projects`

**Request Body:**
```json
{
  "title": "string (required, max: 200)",
  "description": "text (required)",
  "technologies": ["string"] (required),
  "github_url": "url (optional)",
  "live_url": "url (optional)",
  "thumbnail": "url (optional)",
  "user_id": "uuid (required)",
  "status": "active|draft (default: active)"
}
```

---

#### Update Project

**Endpoint:** `PUT /api/admin/projects/:projectId`

---

#### Delete Project

**Endpoint:** `DELETE /api/admin/projects/:projectId`

---

### 4. Challenges Management (Admin)

#### Get All Challenges

**Endpoint:** `GET /api/admin/challenges`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "LED Matrix Display",
      "description": "Create a scrolling text display",
      "difficulty": "beginner|intermediate|advanced",
      "points": 100,
      "deadline": "timestamp (nullable)",
      "status": "active|inactive|completed",
      "max_submissions": 3,
      "test_cases_count": 5,
      "submissions_count": 45,
      "success_rate": 78.5,
      "starter_kit_url": "url (nullable)",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

#### Create Challenge

**Endpoint:** `POST /api/admin/challenges`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "text (required)",
  "difficulty": "beginner|intermediate|advanced",
  "points": "integer (required, min: 1)",
  "deadline": "timestamp (optional)",
  "requirements": "text (optional)",
  "hints": ["string"] (optional),
  "test_cases": [
    {
      "input": "string",
      "expected_output": "string",
      "weight": 1
    }
  ],
  "starter_kit_url": "url (optional)",
  "max_submissions": "integer (default: 3)",
  "status": "active|inactive (default: active)"
}
```

---

#### Update Challenge

**Endpoint:** `PUT /api/admin/challenges/:challengeId`

---

#### Delete Challenge

**Endpoint:** `DELETE /api/admin/challenges/:challengeId`

---

## Challenges System

### 1. Get User Challenges

**Endpoint:** `GET /api/user/challenges`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `difficulty`: beginner|intermediate|advanced
- `status`: active|completed|attempted
- `sort`: points|deadline|difficulty

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "LED Matrix Display",
      "description": "Create a scrolling text display",
      "difficulty": "beginner",
      "points": 100,
      "deadline": "2025-03-01T00:00:00Z",
      "status": "active",
      "user_progress": {
        "attempted": true,
        "completed": false,
        "submissions": 1,
        "best_score": 60,
        "last_submission": "timestamp"
      },
      "starter_kit_url": "https://s3.../starter-kit.zip",
      "tags": ["Arduino", "LED", "Display"]
    }
  ]
}
```

---

### 2. Submit Challenge Solution

**Endpoint:** `POST /api/challenges/:challengeId/submit`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
solution_file: File (required, .zip or .ino or .cpp)
github_url: string (optional)
notes: text (optional)
```

**Response (Success - 201):**
```json
{
  "status": true,
  "message": "Solution submitted successfully",
  "data": {
    "submission_id": "uuid",
    "challenge_id": "uuid",
    "status": "pending|passed|failed",
    "score": 85,
    "test_results": [
      {
        "test_case": 1,
        "passed": true,
        "execution_time": 0.023
      }
    ],
    "points_earned": 85,
    "submitted_at": "timestamp"
  }
}
```

**Implementation Notes:**
- Validate file type and size (max 10MB)
- Store files in S3 or local storage
- Run automated tests asynchronously
- Update user points and challenges_completed
- Send notification on completion

---

### 3. Get Challenge Leaderboard

**Endpoint:** `GET /api/challenges/:challengeId/leaderboard`

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "techmaster",
      "avatar": "url",
      "score": 100,
      "submission_time": "timestamp",
      "execution_time": 0.015
    }
  ]
}
```

---

### 4. Download Challenge Starter Kit

**Endpoint:** `GET /api/challenges/:challengeId/starter-kit`

**Response:** File download (zip)

---

## Events Management

### 1. Get All Events

**Endpoint:** `GET /api/events`

**Query Parameters:**
- `status`: upcoming|ongoing|completed|all
- `page`, `limit`
- `date_from`, `date_to`
- `search`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "Arduino Workshop",
      "description": "Learn Arduino programming basics",
      "date": "2025-02-15",
      "time": "14:00:00",
      "end_time": "17:00:00",
      "location": "Lab 101",
      "event_type": "workshop|seminar|hackathon|competition",
      "capacity": 30,
      "registered_count": 15,
      "waitlist_count": 3,
      "status": "upcoming|ongoing|completed|cancelled",
      "banner_image": "url",
      "registration_deadline": "2025-02-10T23:59:59Z",
      "tags": ["Arduino", "Beginner", "Hardware"],
      "organizer": "ESDC Team",
      "prerequisites": ["Basic electronics knowledge"],
      "user_registered": false,
      "created_at": "timestamp"
    }
  ]
}
```

---

### 2. Get Event Details

**Endpoint:** `GET /api/events/:eventId`

**Response:** Full event object with additional details

---

### 3. Register for Event

**Endpoint:** `POST /api/events/:eventId/register`

**Headers:** `Authorization: Bearer <token>`

**Response (Success - 201):**
```json
{
  "status": true,
  "message": "Registration successful",
  "data": {
    "registration_id": "uuid",
    "event_id": "uuid",
    "user_id": "uuid",
    "status": "confirmed|waitlisted",
    "position": 16,
    "registered_at": "timestamp"
  }
}
```

**Error Responses:**
- `400`: Already registered
- `409`: Event full (add to waitlist)
- `410`: Registration closed

**Implementation Notes:**
- Check capacity before registering
- Add to waitlist if full
- Send confirmation email
- Create calendar event data

---

### 4. Unregister from Event

**Endpoint:** `DELETE /api/events/:eventId/register`

**Headers:** `Authorization: Bearer <token>`

**Response (Success - 200):**
```json
{
  "status": true,
  "message": "Unregistered successfully"
}
```

**Implementation Notes:**
- Promote waitlisted user if applicable
- Send cancellation confirmation
- Update event capacity

---

### 5. Get User's Registered Events

**Endpoint:** `GET /api/user/events`

**Headers:** `Authorization: Bearer <token>`

**Response:** List of events user registered for

---

### 6. Admin: Create Event

**Endpoint:** `POST /api/admin/events`

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "text (required)",
  "date": "date (required)",
  "time": "time (required)",
  "end_time": "time (optional)",
  "location": "string (required)",
  "event_type": "workshop|seminar|hackathon|competition",
  "capacity": "integer (required)",
  "banner_image": "url (optional)",
  "registration_deadline": "timestamp (required)",
  "tags": ["string"],
  "organizer": "string (optional)",
  "prerequisites": ["string"]
}
```

---

### 7. Admin: Update Event

**Endpoint:** `PUT /api/admin/events/:eventId`

---

### 8. Admin: Delete Event

**Endpoint:** `DELETE /api/admin/events/:eventId`

**Implementation Notes:**
- Notify all registered users
- Handle refunds if applicable
- Archive event data

---

### 9. Admin: Get Event Registrations

**Endpoint:** `GET /api/admin/events/:eventId/registrations`

**Response:**
```json
{
  "status": true,
  "data": {
    "confirmed": [
      {
        "registration_id": "uuid",
        "user": { /* user object */ },
        "registered_at": "timestamp",
        "status": "confirmed"
      }
    ],
    "waitlisted": [
      {
        "registration_id": "uuid",
        "user": { /* user object */ },
        "position": 1,
        "registered_at": "timestamp"
      }
    ]
  }
}
```

---

## Resources System

### 1. Get All Resources

**Endpoint:** `GET /api/resources`

**Query Parameters:**
- `category`: arduino|raspberry-pi|pcb|iot|programming|all
- `type`: document|video|code|link
- `search`: string
- `page`, `limit`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "Arduino Programming Guide",
      "description": "Complete guide to Arduino programming",
      "type": "document|video|code|link",
      "category": "arduino",
      "url": "https://s3.../resource.pdf",
      "thumbnail": "url",
      "file_size": "5.2 MB",
      "duration": "45 min" (for videos),
      "author": "ESDC Team",
      "tags": ["Arduino", "Tutorial", "Beginner"],
      "downloads": 145,
      "rating": 4.5,
      "reviews_count": 23,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ],
  "pagination": { /* pagination */ }
}
```

---

### 2. Get Resource Details

**Endpoint:** `GET /api/resources/:resourceId`

**Response:** Full resource object with reviews

---

### 3. Download Resource

**Endpoint:** `GET /api/resources/:resourceId/download`

**Headers:** `Authorization: Bearer <token>` (optional but tracks downloads)

**Response:** File download or redirect to external URL

**Implementation Notes:**
- Increment download counter
- Track user downloads (if authenticated)
- Generate pre-signed S3 URLs for private resources

---

### 4. Rate Resource

**Endpoint:** `POST /api/resources/:resourceId/rate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": "integer (1-5, required)",
  "review": "text (optional, max: 500)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Rating submitted successfully",
  "data": {
    "rating_id": "uuid",
    "rating": 5,
    "review": "Excellent resource!",
    "user": "username",
    "created_at": "timestamp"
  }
}
```

---

### 5. Admin: Create Resource

**Endpoint:** `POST /api/admin/resources`

**Headers:** `Content-Type: multipart/form-data`

**Request Body:**
```
title: string (required)
description: text (required)
type: document|video|code|link
category: string (required)
file: File (for document/code) or URL (for video/link)
thumbnail: File (optional)
author: string (optional)
tags: ["string"]
```

---

### 6. Admin: Update Resource

**Endpoint:** `PUT /api/admin/resources/:resourceId`

---

### 7. Admin: Delete Resource

**Endpoint:** `DELETE /api/admin/resources/:resourceId`

---

## Projects Management

### 1. Get All Projects

**Endpoint:** `GET /api/projects`

**Query Parameters:**
- `search`, `page`, `limit`
- `technologies`: filter by tech stack
- `sort`: stars|views|created_at

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "id": "uuid",
      "title": "Smart Home Automation",
      "description": "IoT-based home automation system",
      "technologies": ["ESP32", "Arduino", "MQTT"],
      "github_url": "https://github.com/user/project",
      "live_url": "https://demo.com",
      "thumbnail": "url",
      "images": ["url1", "url2"],
      "user": {
        "id": "uuid",
        "username": "creator",
        "avatar": "url"
      },
      "stars": 24,
      "views": 150,
      "collaborators_count": 3,
      "status": "active|archived",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

### 2. Get Project Details

**Endpoint:** `GET /api/projects/:projectId`

**Response:** Full project with collaborators and detailed stats

---

### 3. Create Project (User)

**Endpoint:** `POST /api/projects`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string (required, max: 200)",
  "description": "text (required)",
  "technologies": ["string"] (required),
  "github_url": "url (optional)",
  "live_url": "url (optional)",
  "thumbnail": "url (optional)",
  "images": ["url"],
  "status": "active|draft (default: active)"
}
```

---

### 4. Update Project

**Endpoint:** `PUT /api/projects/:projectId`

**Headers:** `Authorization: Bearer <token>`

**Authorization:** Only project owner or admin

---

### 5. Delete Project

**Endpoint:** `DELETE /api/projects/:projectId`

---

### 6. Star Project

**Endpoint:** `POST /api/projects/:projectId/star`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Project starred",
  "data": {
    "starred": true,
    "stars_count": 25
  }
}
```

---

### 7. Get User's Projects

**Endpoint:** `GET /api/user/projects`

**Headers:** `Authorization: Bearer <token>`

**Response:** List of user's projects

---

## Leaderboard System

### 1. Get Global Leaderboard

**Endpoint:** `GET /api/leaderboard`

**Query Parameters:**
- `timeframe`: all|monthly|weekly
- `limit`: integer (default: 100)
- `page`: integer

**Response (Success - 200):**
```json
{
  "status": true,
  "data": [
    {
      "rank": 1,
      "user_id": "uuid",
      "username": "techmaster",
      "avatar": "url",
      "points": 1250,
      "completed_challenges": 35,
      "streak": 15,
      "rank_change": "+2" (compared to previous period)
    }
  ],
  "current_user": {
    "rank": 45,
    "points": 450,
    "rank_change": "-3"
  }
}
```

**Implementation Notes:**
- Cache leaderboard for 5-10 minutes
- Update ranks in background job
- Calculate rank changes based on previous period
- Support pagination for large datasets

---

### 2. Get Challenge-specific Leaderboard

**Endpoint:** `GET /api/challenges/:challengeId/leaderboard`

(See Challenges System section)

---

## Dashboard & Statistics

### 1. Get User Dashboard

**Endpoint:** `GET /api/user/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response (Success - 200):**
```json
{
  "status": true,
  "data": {
    "stats": {
      "total_points": 450,
      "completed_challenges": 12,
      "upcoming_events": 2,
      "rank": 45,
      "streak": 7,
      "projects_count": 3,
      "resources_downloaded": 15
    },
    "recent_activity": [
      {
        "id": "uuid",
        "type": "challenge|event|achievement|project",
        "title": "LED Matrix Display completed",
        "description": "Earned 100 points",
        "date": "2025-01-20T10:30:00Z",
        "icon": "trophy",
        "points": 100
      }
    ],
    "upcoming_events": [
      {
        "id": "uuid",
        "title": "Arduino Workshop",
        "date": "2025-02-15",
        "time": "14:00"
      }
    ],
    "recommended_challenges": [
      {
        "id": "uuid",
        "title": "Sensor Integration",
        "difficulty": "intermediate",
        "points": 150
      }
    ]
  }
}
```

**Implementation Notes:**
- Cache dashboard data per user
- Calculate streak based on daily activity
- Recommend challenges based on completed ones

---

### 2. Get User Submissions

**Endpoint:** `GET /api/user/submissions`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "submission_id": "uuid",
      "challenge": {
        "id": "uuid",
        "title": "LED Blink Challenge"
      },
      "status": "passed|failed|pending",
      "score": 85,
      "points_earned": 85,
      "submitted_at": "timestamp",
      "evaluated_at": "timestamp"
    }
  ]
}
```

---

### 3. Sync GitHub Repository

**Endpoint:** `POST /api/user/sync-repo`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "github_username": "string (optional, uses profile if not provided)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Repository synced successfully",
  "data": {
    "repositories_found": 15,
    "projects_created": 3,
    "projects_updated": 5
  }
}
```

**Implementation Notes:**
- Use GitHub API to fetch user repos
- Match repos by topics/tags (arduino, iot, embedded, etc.)
- Create/update projects automatically
- Run as background job (queue recommended)

---

## Chatbot Integration

### 1. Send Message to Chatbot

**Endpoint:** `POST /api/chatbot`

**Headers:** `Authorization: Bearer <token>` (optional)

**Request Body:**
```json
{
  "message": "string (required)",
  "conversation_id": "uuid (optional, for maintaining context)",
  "history": [
    {
      "sender": "user|bot",
      "message": "text",
      "timestamp": "timestamp"
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "status": true,
  "data": {
    "response": "I can help you with information about events, challenges...",
    "conversation_id": "uuid",
    "suggestions": [
      "Tell me about upcoming events",
      "How do I register?"
    ]
  }
}
```

**Implementation Notes:**
- Integrate with AI service (OpenAI, Google Gemini, etc.)
- Store conversation history in database
- Provide context about ESDC (events, challenges, resources)
- Handle common queries with predefined responses
- Rate limit: 20 requests per minute per user

---

### 2. Get Conversation History

**Endpoint:** `GET /api/chatbot/history/:conversationId`

**Headers:** `Authorization: Bearer <token>`

---

### 3. Clear Conversation

**Endpoint:** `DELETE /api/chatbot/history/:conversationId`

---

## Games System

### Note on Games
The games (Snake, Tetris, Pong, Breakout, Memory, Simon) are client-side only and don't require backend APIs. However, you can optionally implement:

### 1. Save High Score

**Endpoint:** `POST /api/games/:gameId/score`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "score": "integer (required)",
  "level": "integer (optional)",
  "duration": "integer (seconds, optional)"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Score saved",
  "data": {
    "score": 1500,
    "rank": 15,
    "personal_best": true
  }
}
```

---

### 2. Get Game Leaderboard

**Endpoint:** `GET /api/games/:gameId/leaderboard`

**Query Parameters:**
- `timeframe`: all|monthly|weekly
- `limit`: integer

**Response:**
```json
{
  "status": true,
  "data": [
    {
      "rank": 1,
      "username": "gamer123",
      "score": 5000,
      "level": 10,
      "achieved_at": "timestamp"
    }
  ]
}
```

---

## Database Schema

### Tables Overview

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    github_username VARCHAR(100),
    avatar TEXT,
    bio TEXT,
    points INTEGER DEFAULT 0,
    completed_challenges INTEGER DEFAULT 0,
    rank INTEGER,
    streak INTEGER DEFAULT 0,
    last_active TIMESTAMP,
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Challenges Table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    points INTEGER NOT NULL,
    deadline TIMESTAMP,
    requirements TEXT,
    hints JSONB,
    test_cases JSONB,
    starter_kit_url TEXT,
    max_submissions INTEGER DEFAULT 3,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge Submissions Table
CREATE TABLE challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    solution_file_url TEXT NOT NULL,
    github_url TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'reviewing')),
    score INTEGER,
    test_results JSONB,
    points_earned INTEGER,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evaluated_at TIMESTAMP,
    feedback TEXT
);

-- Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) CHECK (event_type IN ('workshop', 'seminar', 'hackathon', 'competition')),
    capacity INTEGER NOT NULL,
    banner_image TEXT,
    registration_deadline TIMESTAMP NOT NULL,
    tags JSONB,
    organizer VARCHAR(100),
    prerequisites JSONB,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Registrations Table
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled')),
    position INTEGER,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    technologies JSONB NOT NULL,
    github_url TEXT,
    live_url TEXT,
    thumbnail TEXT,
    images JSONB,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    views INTEGER DEFAULT 0,
    stars INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Stars Table
CREATE TABLE project_stars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- Resources Table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('document', 'video', 'code', 'link')),
    category VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT,
    file_size VARCHAR(20),
    duration VARCHAR(20),
    author VARCHAR(100),
    tags JSONB,
    downloads INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource Ratings Table
CREATE TABLE resource_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, user_id)
);

-- Activity Log Table
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chatbot Conversations Table
CREATE TABLE chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    messages JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game Scores Table (Optional)
CREATE TABLE game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    level INTEGER,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Challenge indexes
CREATE INDEX idx_challenges_status ON challenges(status);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_deadline ON challenges(deadline);

-- Submission indexes
CREATE INDEX idx_submissions_user_id ON challenge_submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON challenge_submissions(challenge_id);
CREATE INDEX idx_submissions_status ON challenge_submissions(status);

-- Event indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(event_type);

-- Registration indexes
CREATE INDEX idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_registrations_user_id ON event_registrations(user_id);

-- Project indexes
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_stars ON projects(stars DESC);
CREATE INDEX idx_projects_views ON projects(views DESC);

-- Resource indexes
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_rating ON resources(rating DESC);

-- Activity log indexes
CREATE INDEX idx_activity_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);
```

---

## API Endpoints Summary

### Authentication & User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/user/register` | Register new user | No |
| POST | `/api/user/login` | User login | No |
| POST | `/api/user/logout` | User logout | Yes |
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update user profile | Yes |
| GET | `/api/user/dashboard` | Get user dashboard | Yes |
| GET | `/api/user/submissions` | Get user submissions | Yes |
| POST | `/api/user/sync-repo` | Sync GitHub repos | Yes |

### Admin Panel
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/stats` | Get dashboard stats | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| POST | `/api/admin/users` | Create user | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| GET | `/api/admin/projects` | Get all projects | Admin |
| POST | `/api/admin/projects` | Create project | Admin |
| PUT | `/api/admin/projects/:id` | Update project | Admin |
| DELETE | `/api/admin/projects/:id` | Delete project | Admin |
| GET | `/api/admin/challenges` | Get all challenges | Admin |
| POST | `/api/admin/challenges` | Create challenge | Admin |
| PUT | `/api/admin/challenges/:id` | Update challenge | Admin |
| DELETE | `/api/admin/challenges/:id` | Delete challenge | Admin |
| GET | `/api/admin/events` | Get all events | Admin |
| POST | `/api/admin/events` | Create event | Admin |
| PUT | `/api/admin/events/:id` | Update event | Admin |
| DELETE | `/api/admin/events/:id` | Delete event | Admin |
| GET | `/api/admin/events/:id/registrations` | Get event registrations | Admin |
| GET | `/api/admin/resources` | Get all resources | Admin |
| POST | `/api/admin/resources` | Create resource | Admin |
| PUT | `/api/admin/resources/:id` | Update resource | Admin |
| DELETE | `/api/admin/resources/:id` | Delete resource | Admin |

### Challenges
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/challenges` | Get user challenges | Yes |
| POST | `/api/challenges/:id/submit` | Submit solution | Yes |
| GET | `/api/challenges/:id/leaderboard` | Get challenge leaderboard | No |
| GET | `/api/challenges/:id/starter-kit` | Download starter kit | Yes |

### Events
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events | No |
| GET | `/api/events/:id` | Get event details | No |
| POST | `/api/events/:id/register` | Register for event | Yes |
| DELETE | `/api/events/:id/register` | Unregister from event | Yes |
| GET | `/api/user/events` | Get user's events | Yes |

### Resources
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/resources` | Get all resources | No |
| GET | `/api/resources/:id` | Get resource details | No |
| GET | `/api/resources/:id/download` | Download resource | Optional |
| POST | `/api/resources/:id/rate` | Rate resource | Yes |

### Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/projects` | Get all projects | No |
| GET | `/api/projects/:id` | Get project details | No |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes (Owner) |
| DELETE | `/api/projects/:id` | Delete project | Yes (Owner) |
| POST | `/api/projects/:id/star` | Star project | Yes |
| GET | `/api/user/projects` | Get user's projects | Yes |

### Leaderboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leaderboard` | Get global leaderboard | No |

### Chatbot
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chatbot` | Send message | Optional |
| GET | `/api/chatbot/history/:id` | Get conversation history | Yes |
| DELETE | `/api/chatbot/history/:id` | Clear conversation | Yes |

### Games (Optional)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/games/:id/score` | Save game score | Yes |
| GET | `/api/games/:id/leaderboard` | Get game leaderboard | No |

---

## Implementation Priorities

### Phase 1: Core Features (Week 1-2)
1. ✅ Authentication (Register, Login, Logout, Profile)
2. ✅ User Management
3. Basic Admin Panel (Stats, User CRUD)
4. Database setup

### Phase 2: Content Management (Week 3-4)
1. Challenges System (CRUD, Submissions)
2. Events Management (CRUD, Registrations)
3. Resources System (CRUD, Downloads)
4. Projects Management

### Phase 3: Gamification (Week 5)
1. Leaderboard System
2. Points & Achievements
3. Activity Tracking
4. Dashboard Statistics

### Phase 4: Advanced Features (Week 6+)
1. Chatbot Integration
2. GitHub Sync
3. File Upload System
4. Email Notifications
5. Search & Filtering Optimization
6. Caching Layer (Redis)
7. Background Jobs (Queue)

---

## Performance & Scalability

### Caching Strategy
- **Redis Cache:**
  - Leaderboards (10 min TTL)
  - Dashboard stats (5 min TTL)
  - Resource lists (15 min TTL)
  - User profiles (30 min TTL)

### Rate Limiting
- Authentication: 5 requests/minute
- API endpoints: 60 requests/minute
- File uploads: 10 requests/minute
- Chatbot: 20 requests/minute

### File Upload Limits
- Images: Max 5MB, formats: jpg, png, webp
- Documents: Max 10MB, formats: pdf, zip
- Solutions: Max 10MB, formats: zip, ino, cpp, py

### Database Optimization
- Implement connection pooling
- Use prepared statements
- Add proper indexes
- Implement query pagination
- Use database read replicas for scaling

---

## Security Best Practices

1. **Input Validation:**
   - Validate all inputs server-side
   - Sanitize user inputs
   - Use parameterized queries

2. **Authentication:**
   - Use bcrypt for password hashing
   - Implement JWT with expiration
   - Add token blacklist for logout
   - Rate limit authentication endpoints

3. **Authorization:**
   - Implement role-based access control
   - Verify ownership for resources
   - Check permissions on every request

4. **File Security:**
   - Validate file types and sizes
   - Scan for malware
   - Store files with random names
   - Use pre-signed URLs for S3

5. **API Security:**
   - Enable CORS with specific origins
   - Implement rate limiting
   - Use HTTPS only
   - Add request logging
   - Implement CSRF protection

---

## Error Handling

### Standard Error Response Format
```json
{
  "status": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (not authorized)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `422`: Unprocessable Entity
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

---

## Testing Requirements

### API Testing
- Unit tests for all endpoints
- Integration tests for workflows
- Load testing for performance
- Security testing (OWASP)

### Test Coverage Goals
- Business logic: 90%+
- API endpoints: 85%+
- Database queries: 80%+

---

## Documentation Requirements

1. **API Documentation:**
   - OpenAPI/Swagger documentation
   - Example requests/responses
   - Authentication guide
   - Error codes reference

2. **Developer Documentation:**
   - Setup instructions
   - Environment configuration
   - Database migrations
   - Deployment guide

3. **User Documentation:**
   - API usage examples
   - Integration guides
   - Troubleshooting

---

## Monitoring & Logging

### Logging Requirements
- Log all API requests (method, path, status, duration)
- Log authentication events
- Log errors with stack traces
- Log database queries (in development)

### Monitoring Metrics
- API response times
- Error rates
- Database query performance
- Cache hit rates
- Background job status
- User activity metrics

---

## Deployment Considerations

### Environment Variables
```env
# Server Configuration
PORT=9999
ENVIRONMENT=production
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=esdc_db
DB_USER=postgres
DB_PASSWORD=secure_password
DB_SSL_MODE=require

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# File Storage
STORAGE_TYPE=s3|local
AWS_REGION=us-east-1
AWS_BUCKET=esdc-files
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@esdc.com
SMTP_PASSWORD=

# GitHub API (for repo sync)
GITHUB_TOKEN=

# AI/Chatbot API (Optional)
OPENAI_API_KEY=
GEMINI_API_KEY=

# CORS
ALLOWED_ORIGINS=https://esdc-frontend.vercel.app,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=60s
RATE_LIMIT_MAX=60
```

### Infrastructure Requirements
- **Server:** Minimum 2GB RAM, 2 CPU cores
- **Database:** PostgreSQL 13+
- **Cache:** Redis 6+
- **Storage:** S3 or equivalent
- **CDN:** For static assets (optional)

---

## Next Steps for Backend Development

1. **Setup:**
   - Initialize Go project
   - Setup PostgreSQL database
   - Configure environment variables
   - Setup Redis cache

2. **Phase 1 Implementation:**
   - Create database schema
   - Implement authentication endpoints
   - Setup JWT middleware
   - Create user CRUD endpoints
   - Implement admin stats endpoint

3. **Testing:**
   - Write unit tests
   - Test with frontend
   - Load testing
   - Security audit

4. **Phase 2 & Beyond:**
   - Follow implementation priorities
   - Iterate based on frontend needs
   - Optimize performance
   - Add monitoring

---

## Contact & Support

For questions or clarifications about these requirements:
- Review the frontend code in `/src` directory
- Check existing documentation in `/docs`
- Test APIs with the React frontend
- Update this document as requirements evolve

---

**Document Version:** 1.0  
**Last Updated:** October 5, 2025  
**Maintained By:** ESDC Development Team
