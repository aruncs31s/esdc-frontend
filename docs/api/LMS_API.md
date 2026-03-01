# LMS (Learning Management System) API Requirements

This document outlines the API requirements for the Learning Management System backend integration.

## Base URL

```
{API_BASE_URL}/api/lms
```

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

## Entities

### Course

```typescript
interface Course {
  id: number | string;
  title: string;
  description: string;
  instructor: string;
  instructor_id?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: number;
  rating: number;
  image: string;
  price: number;
  is_free: boolean;
  lessons: number;
  category: string;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'published' | 'archived';
  modules: CourseModule[];
  exams: CourseExam[];
  tests: CourseTest[];
  comments_data: CourseComment[];
  prerequisites: string[];
  learning_outcomes: string[];
  created_at: string;
  updated_at: string;
}

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  lessons: number;
  order?: number;
}

interface CourseExam {
  id: number;
  title: string;
  duration: string;
  questions: number;
  passing_score?: number;
}

interface CourseTest {
  id: number;
  title: string;
  duration: string;
  questions: number;
}

interface CourseComment {
  id?: string;
  user: string;
  user_id?: string;
  avatar: string;
  text: string;
  rating: number;
  created_at?: string;
}
```

### Enrollment

```typescript
interface Enrollment {
  id: string | number;
  user_id: string;
  course_id: string | number;
  status: 'active' | 'completed' | 'paused' | 'cancelled' | 'expired';
  enrolled_at: string;
  completed_at: string | null;
  expires_at: string | null;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'free';
  payment_amount: number;
  payment_id: string | null;
  certificate_id: string | null;
  certificate_url: string | null;
  created_at: string;
  updated_at: string;
}
```

### Course Progress

```typescript
interface CourseProgress {
  id: string | number;
  user_id: string;
  course_id: string | number;
  enrollment_id: string | number;
  overall_progress: number; // 0-100 percentage
  status: 'not_started' | 'in_progress' | 'completed';
  lessons_completed: number;
  total_lessons: number;
  modules_completed: number;
  total_modules: number;
  current_lesson_id: string | number | null;
  current_module_id: number | null;
  lesson_progress: LessonProgress[];
  module_progress: ModuleProgress[];
  quiz_results: QuizResult[];
  total_time_spent: number; // in seconds
  last_accessed_at: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LessonProgress {
  lesson_id: string | number;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  time_spent: number; // in seconds
  last_accessed_at: string;
}

interface ModuleProgress {
  module_id: number;
  lessons_completed: number;
  total_lessons: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface QuizResult {
  quiz_id: string | number;
  score: number;
  max_score: number;
  passed: boolean;
  completed_at: string;
  attempts: number;
}
```

### Lesson

```typescript
interface Lesson {
  id: string | number;
  course_id: string | number;
  module_id: string | number;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive';
  duration: number; // in minutes
  order: number;
  video_url?: string;
  status: 'draft' | 'published' | 'archived';
  resources: LessonResource[];
  created_at: string;
  updated_at: string;
}

interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'file';
  url: string;
  size?: number;
}
```

## API Endpoints

### Course Endpoints

#### Get All Courses

```
GET /api/lms/courses
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| level | string | Filter by level (Beginner, Intermediate, Advanced) |
| status | string | Filter by status (published, draft, archived) |
| search | string | Search in title and description |
| is_free | boolean | Filter by free courses |
| page | number | Page number for pagination |
| limit | number | Number of items per page |

**Response:**

```json
{
  "status": true,
  "data": [Course],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

#### Get Course by ID

```
GET /api/lms/courses/{id}
```

**Response:**

```json
{
  "status": true,
  "data": Course
}
```

#### Get Popular Courses

```
GET /api/lms/courses/popular
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of courses to return (default: 6) |

**Response:**

```json
{
  "status": true,
  "data": [Course]
}
```

#### Get Course Categories

```
GET /api/lms/courses/categories
```

**Response:**

```json
{
  "status": true,
  "data": ["Embedded Systems", "IoT", "Hardware Design", "Programming", "Robotics"]
}
```

#### Create Course (Admin)

```
POST /api/lms/courses
```

**Request Body:** Course object (without id, created_at, updated_at)

**Response:**

```json
{
  "status": true,
  "data": Course,
  "message": "Course created successfully"
}
```

#### Update Course (Admin)

```
PUT /api/lms/courses/{id}
```

**Request Body:** Partial Course object

**Response:**

```json
{
  "status": true,
  "data": Course,
  "message": "Course updated successfully"
}
```

#### Delete Course (Admin)

```
DELETE /api/lms/courses/{id}
```

**Response:**

```json
{
  "status": true,
  "message": "Course deleted successfully"
}
```

### Enrollment Endpoints

#### Enroll in Course

```
POST /api/lms/courses/{course_id}/enroll
```

**Request Body:**

```json
{
  "user_id": "string",
  "payment_amount": 0
}
```

**Response:**

```json
{
  "status": true,
  "data": Enrollment,
  "message": "Enrolled successfully"
}
```

#### Unenroll from Course

```
POST /api/lms/courses/{course_id}/unenroll
```

**Request Body:**

```json
{
  "user_id": "string"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Unenrolled successfully"
}
```

#### Get User Enrollments

```
GET /api/lms/users/{user_id}/enrollments
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (active, completed, paused, cancelled) |

**Response:**

```json
{
  "status": true,
  "data": [Enrollment]
}
```

#### Get Enrollment Details

```
GET /api/lms/enrollments/{id}
```

**Response:**

```json
{
  "status": true,
  "data": Enrollment
}
```

### Progress Endpoints

#### Start Course

```
POST /api/lms/courses/{course_id}/progress/start
```

**Request Body:**

```json
{
  "user_id": "string"
}
```

**Response:**

```json
{
  "status": true,
  "data": CourseProgress,
  "message": "Course started"
}
```

#### Get User Progress for Course

```
GET /api/lms/users/{user_id}/progress/{course_id}
```

**Response:**

```json
{
  "status": true,
  "data": CourseProgress
}
```

#### Get All User Progress

```
GET /api/lms/users/{user_id}/progress
```

**Response:**

```json
{
  "status": true,
  "data": [CourseProgress]
}
```

#### Update Lesson Progress

```
POST /api/lms/courses/{course_id}/lessons/{lesson_id}/progress
```

**Request Body:**

```json
{
  "user_id": "string",
  "completed": true,
  "time_spent": 300
}
```

**Response:**

```json
{
  "status": true,
  "data": CourseProgress,
  "message": "Progress updated"
}
```

#### Record Quiz Result

```
POST /api/lms/courses/{course_id}/quizzes/{quiz_id}/result
```

**Request Body:**

```json
{
  "user_id": "string",
  "score": 85,
  "max_score": 100,
  "passing_score": 70
}
```

**Response:**

```json
{
  "status": true,
  "data": CourseProgress,
  "message": "Quiz result recorded"
}
```

### Lesson Endpoints

#### Get Course Lessons

```
GET /api/lms/courses/{course_id}/lessons
```

**Response:**

```json
{
  "status": true,
  "data": [Lesson]
}
```

#### Get Lesson by ID

```
GET /api/lms/courses/{course_id}/lessons/{lesson_id}
```

**Response:**

```json
{
  "status": true,
  "data": Lesson
}
```

#### Get Module Lessons

```
GET /api/lms/courses/{course_id}/modules/{module_id}/lessons
```

**Response:**

```json
{
  "status": true,
  "data": [Lesson]
}
```

### Statistics Endpoints (Admin)

#### Get Course Statistics

```
GET /api/lms/courses/{course_id}/statistics
```

**Response:**

```json
{
  "status": true,
  "data": {
    "total_enrolled": 245,
    "average_progress": 65.5,
    "completion_rate": 42.3,
    "average_time_spent": 18000,
    "rating_distribution": {
      "5": 120,
      "4": 80,
      "3": 30,
      "2": 10,
      "1": 5
    }
  }
}
```

#### Get Course Leaderboard

```
GET /api/lms/courses/{course_id}/leaderboard
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of users to return (default: 10) |

**Response:**

```json
{
  "status": true,
  "data": [
    {
      "user_id": "123",
      "username": "john_doe",
      "avatar": "https://...",
      "progress": 95,
      "completed_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "status": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

### Common Error Codes

| Code                 | HTTP Status | Description                             |
| -------------------- | ----------- | --------------------------------------- |
| UNAUTHORIZED         | 401         | Invalid or missing authentication token |
| FORBIDDEN            | 403         | User doesn't have permission            |
| NOT_FOUND            | 404         | Resource not found                      |
| VALIDATION_ERROR     | 400         | Invalid request data                    |
| ALREADY_ENROLLED     | 400         | User is already enrolled in the course  |
| NOT_ENROLLED         | 400         | User is not enrolled in the course      |
| COURSE_NOT_PUBLISHED | 400         | Course is not available for enrollment  |
| PAYMENT_REQUIRED     | 402         | Payment is required for this course     |

## Webhooks (Optional)

The backend can send webhooks for the following events:

### Course Completed

```json
{
  "event": "course.completed",
  "data": {
    "user_id": "123",
    "course_id": "456",
    "completed_at": "2024-01-15T10:30:00Z",
    "certificate_url": "https://..."
  }
}
```

### Enrollment Created

```json
{
  "event": "enrollment.created",
  "data": {
    "enrollment_id": "789",
    "user_id": "123",
    "course_id": "456",
    "enrolled_at": "2024-01-15T10:30:00Z"
  }
}
```

## Implementation Notes

1. **Caching**: Course listings and categories should be cached for better performance.
2. **Rate Limiting**: Progress update endpoints should have rate limiting to prevent abuse.
3. **Pagination**: All list endpoints should support pagination.
4. **Search**: Full-text search should be implemented for course search.
5. **Video Streaming**: Video content should be served through a CDN with signed URLs.
6. **Certificates**: Certificates should be generated as PDFs and stored in object storage.

## Database Schema Recommendations

### Tables

1. **courses** - Course metadata
2. **course_modules** - Course modules/sections
3. **lessons** - Individual lessons
4. **enrollments** - User enrollments
5. **course_progress** - User progress tracking
6. **lesson_progress** - Detailed lesson-level progress
7. **quiz_results** - Quiz/test results
8. **course_reviews** - User reviews and ratings
9. **certificates** - Issued certificates

### Indexes

- `courses`: (category, level, status, is_free)
- `enrollments`: (user_id, course_id, status)
- `course_progress`: (user_id, course_id)
- `lesson_progress`: (user_id, lesson_id)

## Frontend Integration

The frontend uses the `ApplicationService` facade to interact with the LMS:

```typescript
import applicationService from '@/application/ApplicationService';

// Get all courses
const courses = await applicationService.getAllCourses({ category: 'IoT' });

// Enroll in a course
const enrollment = await applicationService.enrollInCourse(userId, courseId);

// Update lesson progress
const progress = await applicationService.completeLesson(userId, courseId, lessonId);
```

For more details, see the domain entities in `/src/domain/entities/` and the repository implementations in `/src/infrastructure/repositories/`.
