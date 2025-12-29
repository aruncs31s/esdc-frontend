# LMS (Learning Management System) Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Implementation Details](#implementation-details)
5. [API Integration](#api-integration)
6. [Adding New Courses](#adding-new-courses)
7. [Student Enrollment Flow](#student-enrollment-flow)
8. [Progress Tracking](#progress-tracking)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Overview

The ESDC Learning Management System (LMS) is a comprehensive course management platform built with React, TypeScript, and follows Domain-Driven Design (DDD) principles. It enables students to browse courses, enroll, track progress, and complete assessments.

### Key Features
- **Course Catalog**: Browse and search courses with filters
- **Enrollment Management**: Enroll/unenroll from courses
- **Progress Tracking**: Track lesson completion and quiz scores
- **Mock Data Support**: Development mode with mock data
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

---

## Architecture

The LMS follows a clean architecture with strict separation of concerns:

```
src/
├── domain/
│   └── entities/
│       ├── Course.ts          # Course entity with business logic
│       ├── Enrollment.ts      # Enrollment entity
│       └── CourseProgress.ts  # Progress tracking entity
│
├── infrastructure/
│   ├── api/
│   │   └── lmsApi.ts         # API client for LMS endpoints
│   └── repositories/
│       ├── CourseRepository.ts
│       ├── EnrollmentRepository.ts
│       └── CourseProgressRepository.ts
│
├── features/
│   └── lms/
│       ├── pages/
│       │   ├── LMS.tsx        # Main course catalog page
│       │   └── CourseDetail.tsx # Course detail page
│       └── index.ts
│
└── data/
    ├── mockCourses.ts         # Mock course data
    └── mockCourseDetails.ts   # Detailed course content
```

### Layer Responsibilities

1. **Domain Layer** (`domain/entities/`)
   - Pure business logic
   - No dependencies on infrastructure
   - Entities: Course, Enrollment, CourseProgress

2. **Infrastructure Layer** (`infrastructure/`)
   - API communication
   - Data persistence
   - External service integration

3. **Presentation Layer** (`features/lms/`)
   - React components
   - User interaction
   - State management

---

## Core Features

### 1. Course Catalog

**Location**: `src/features/lms/pages/LMS.tsx`

The course catalog provides:
- Grid/List view of all courses
- Search by course title or description
- Filter by category (Programming, Design, Business, etc.)
- Filter by difficulty level (Beginner, Intermediate, Advanced)
- Filter by price (Free/Paid)
- Sort options (popularity, rating, newest)

**Usage Example**:
```typescript
import { LMS } from '@/features/lms';

// In router
<Route path="/lms" element={<LMS />} />
```

### 2. Course Detail Page

**Location**: `src/features/lms/pages/CourseDetail.tsx`

Displays comprehensive course information:
- Course overview (title, instructor, duration, level)
- Course modules and lessons
- Enrollment button
- Progress indicator (if enrolled)
- Course reviews and ratings
- Related courses

**Route**: `/lms/:id`

### 3. Enrollment System

Students can:
- Enroll in courses (free or paid)
- Unenroll from courses
- View enrolled courses
- Check enrollment status

**API Methods**:
```typescript
// Enroll in a course
await lmsAPI.enrollInCourse(userId, courseId, paymentAmount);

// Check if enrolled
const isEnrolled = await lmsAPI.isEnrolled(userId, courseId);

// Get user enrollments
const enrollments = await lmsAPI.getUserEnrollments(userId);
```

### 4. Progress Tracking

Track student progress through:
- Lesson completion status
- Quiz scores
- Overall course progress percentage
- Time spent on lessons

**API Methods**:
```typescript
// Get course progress
const progress = await lmsAPI.getCourseProgress(userId, courseId);

// Update lesson progress
await lmsAPI.updateLessonProgress(userId, courseId, lessonId, completed);

// Record quiz result
await lmsAPI.recordQuizResult(userId, courseId, quizId, score, maxScore, passingScore);
```

---

## Implementation Details

### Domain Entities

#### 1. Course Entity

**File**: `src/domain/entities/Course.ts`

```typescript
interface CourseData {
  id: string | number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  enrolled: number;
  rating: number;
  image: string;
  price: number;
  isFree: boolean;
  lessons: number;
  category: string;
  modules: Module[];
  // ... additional fields
}

class Course {
  constructor(data: CourseData);
  
  // Business logic methods
  isPopular(): boolean;
  hasHighRating(): boolean;
  getDurationInHours(): number;
  // ...
}
```

**Key Features**:
- Validation in constructor
- Business logic methods
- Immutable data structure
- Type-safe API conversion

#### 2. Enrollment Entity

**File**: `src/domain/entities/Enrollment.ts`

```typescript
interface EnrollmentData {
  id: string;
  userId: string;
  courseId: string | number;
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: string;
  paymentStatus: 'free' | 'pending' | 'completed' | 'failed';
  paymentAmount: number;
}

class Enrollment {
  constructor(data: EnrollmentData);
  
  isActive(): boolean;
  isCompleted(): boolean;
  cancel(): void;
  // ...
}
```

#### 3. CourseProgress Entity

**File**: `src/domain/entities/CourseProgress.ts`

```typescript
interface CourseProgressData {
  id: string;
  userId: string;
  courseId: string | number;
  enrollmentId: string;
  completedLessons: number;
  totalLessons: number;
  completedModules: number;
  totalModules: number;
  status: 'not_started' | 'in_progress' | 'completed';
  // ...
}

class CourseProgress {
  constructor(data: CourseProgressData);
  
  start(): void;
  completeLesson(lessonId: string | number, timeSpent: number): void;
  recordQuizResult(quizId: string | number, score: number, maxScore: number, passingScore: number): void;
  getProgressPercentage(): number;
  // ...
}
```

---

## API Integration

### LMS API Client

**File**: `src/infrastructure/api/lmsApi.ts`

The LMS API provides a comprehensive interface for all LMS operations:

```typescript
export const lmsAPI = {
  // Course Operations
  getCourses(filters?: FilterOptions): Promise<Course[]>
  getCourseById(id: string | number): Promise<Course | null>
  getPopularCourses(limit?: number): Promise<Course[]>
  getCategories(): Promise<string[]>
  searchCourses(query: string): Promise<Course[]>
  
  // Enrollment Operations
  enrollInCourse(userId: string, courseId: string | number, paymentAmount?: number): Promise<Enrollment>
  unenrollFromCourse(userId: string, courseId: string | number): Promise<boolean>
  getUserEnrollments(userId: string): Promise<Enrollment[]>
  isEnrolled(userId: string, courseId: string | number): Promise<boolean>
  
  // Progress Operations
  getCourseProgress(userId: string, courseId: string | number): Promise<CourseProgress | null>
  getUserProgress(userId: string): Promise<CourseProgress[]>
  updateLessonProgress(userId: string, courseId: string | number, lessonId: string | number, completed: boolean, timeSpent?: number): Promise<CourseProgress>
  recordQuizResult(userId: string, courseId: string | number, quizId: string | number, score: number, maxScore: number, passingScore: number): Promise<CourseProgress>
  startCourse(userId: string, courseId: string | number): Promise<CourseProgress>
}
```

### Mock vs Real API

The LMS supports both mock data (for development) and real API integration:

```typescript
// In lmsApi.ts
const USE_MOCK_DATA = true; // Toggle between mock and real API

// When USE_MOCK_DATA is true:
// - Returns data from mockCourses
// - Simulates API delays
// - No backend required

// When USE_MOCK_DATA is false:
// - Makes real HTTP requests
// - Requires backend server
// - Uses ApiClient for requests
```

### API Endpoints

```typescript
const LMS_ENDPOINTS = {
  COURSES: '/api/lms/courses',
  COURSE_BY_ID: (id) => `/api/lms/courses/${id}`,
  ENROLLMENTS: '/api/lms/enrollments',
  ENROLL: (courseId) => `/api/lms/courses/${courseId}/enroll`,
  UNENROLL: (courseId) => `/api/lms/courses/${courseId}/unenroll`,
  PROGRESS: '/api/lms/progress',
  USER_PROGRESS: (userId) => `/api/lms/users/${userId}/progress`,
  UPDATE_LESSON_PROGRESS: (courseId, lessonId) => 
    `/api/lms/courses/${courseId}/lessons/${lessonId}/progress`,
  QUIZ_RESULT: (courseId, quizId) => 
    `/api/lms/courses/${courseId}/quizzes/${quizId}/result`
};
```

---

## Adding New Courses

### Method 1: Using Mock Data (Development)

1. **Edit Mock Courses File**: `src/data/mockCourses.ts`

```typescript
export const mockCourses = [
  {
    id: 1,
    title: "Your Course Title",
    description: "Course description here",
    instructor: "Instructor Name",
    duration: "8 weeks",
    level: "Beginner",
    enrolled: 0,
    rating: 0,
    image: "/images/course-image.jpg",
    price: 0,
    isFree: true,
    lessons: 24,
    category: "Programming",
    modules: [
      {
        id: "module-1",
        title: "Introduction",
        lessons: [
          { id: "lesson-1", title: "Getting Started", duration: "10 min", completed: false }
        ]
      }
    ],
    exams: [],
    tests: [],
    commentsData: []
  },
  // ... more courses
];
```

2. **Add Course Details**: `src/data/mockCourseDetails.ts`

```typescript
export const courseDetails: Record<number, CourseDetailData> = {
  1: {
    overview: "Detailed course overview",
    prerequisites: ["Basic knowledge required"],
    learningOutcomes: ["Outcome 1", "Outcome 2"],
    syllabus: [/* detailed syllabus */]
  }
};
```

### Method 2: Using Backend API

1. **Create Course via API**:

```typescript
const newCourse = await lmsAPI.createCourse({
  title: "New Course",
  description: "Description",
  instructor: "John Doe",
  duration: "8 weeks",
  level: "Beginner",
  price: 99.99,
  isFree: false,
  // ... other fields
});
```

2. **Backend Requirements**:
   - POST `/api/lms/courses` endpoint
   - Authentication/Authorization
   - Course validation
   - Image upload handling

---

## Student Enrollment Flow

### Complete Enrollment Process

1. **Browse Courses**
   ```typescript
   // Student visits /lms
   const courses = await lmsAPI.getCourses();
   ```

2. **View Course Details**
   ```typescript
   // Student clicks on a course (/lms/:id)
   const course = await lmsAPI.getCourseById(courseId);
   const isEnrolled = await lmsAPI.isEnrolled(userId, courseId);
   ```

3. **Enroll in Course**
   ```typescript
   // Student clicks "Enroll" button
   if (course.isFree) {
     await lmsAPI.enrollInCourse(userId, courseId);
   } else {
     // Process payment first, then enroll
     await processPayment(course.price);
     await lmsAPI.enrollInCourse(userId, courseId, course.price);
   }
   ```

4. **Start Learning**
   ```typescript
   // Initialize progress tracking
   await lmsAPI.startCourse(userId, courseId);
   ```

5. **Track Progress**
   ```typescript
   // When student completes a lesson
   await lmsAPI.updateLessonProgress(userId, courseId, lessonId, true, timeSpent);
   
   // When student completes a quiz
   await lmsAPI.recordQuizResult(userId, courseId, quizId, score, maxScore, passingScore);
   ```

6. **View Progress**
   ```typescript
   // Get current progress
   const progress = await lmsAPI.getCourseProgress(userId, courseId);
   console.log(`Progress: ${progress.getProgressPercentage()}%`);
   ```

---

## Progress Tracking

### Lesson Progress

```typescript
// Mark lesson as started
await lmsAPI.updateLessonProgress(userId, courseId, lessonId, false);

// Mark lesson as completed
await lmsAPI.updateLessonProgress(userId, courseId, lessonId, true, 600); // 600 seconds

// Get updated progress
const progress = await lmsAPI.getCourseProgress(userId, courseId);
```

### Quiz Progress

```typescript
// Student completes a quiz
const score = 85;
const maxScore = 100;
const passingScore = 70;

await lmsAPI.recordQuizResult(userId, courseId, quizId, score, maxScore, passingScore);

// Check if student passed
const progress = await lmsAPI.getCourseProgress(userId, courseId);
const quizResult = progress.quizResults.find(q => q.quizId === quizId);
console.log(`Passed: ${quizResult.score >= quizResult.passingScore}`);
```

### Overall Progress

```typescript
const progress = await lmsAPI.getCourseProgress(userId, courseId);

// Progress metrics
const percentage = progress.getProgressPercentage(); // 0-100
const lessonsCompleted = progress.completedLessons;
const totalLessons = progress.totalLessons;
const status = progress.status; // 'not_started', 'in_progress', 'completed'
const lastAccessed = progress.lastAccessedAt;
```

---

## Testing

### Unit Tests

Test domain entities:

```typescript
// Course.test.ts
describe('Course Entity', () => {
  it('should create a valid course', () => {
    const course = new Course({
      id: 1,
      title: "Test Course",
      // ... other fields
    });
    expect(course.title).toBe("Test Course");
  });
  
  it('should calculate if course is popular', () => {
    const course = new Course({ enrolled: 1500, /* ... */ });
    expect(course.isPopular()).toBe(true);
  });
});
```

### Integration Tests

Test API integration:

```typescript
// lmsApi.test.ts
describe('LMS API', () => {
  it('should fetch all courses', async () => {
    const courses = await lmsAPI.getCourses();
    expect(courses).toBeInstanceOf(Array);
    expect(courses.length).toBeGreaterThan(0);
  });
  
  it('should enroll user in course', async () => {
    const enrollment = await lmsAPI.enrollInCourse('user-1', 1);
    expect(enrollment.status).toBe('active');
  });
});
```

### E2E Tests

Test complete user flows:

```typescript
// lms.e2e.test.ts
describe('LMS User Flow', () => {
  it('should allow user to enroll and complete course', async () => {
    // 1. Browse courses
    // 2. Select course
    // 3. Enroll
    // 4. Complete lessons
    // 5. Take quizzes
    // 6. Verify completion
  });
});
```

---

## Deployment

### Environment Setup

1. **Environment Variables**

Create `.env` file:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_LMS_USE_MOCK=false
```

2. **API Configuration**

Update `src/config/api.config.ts`:
```typescript
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  lms: {
    useMock: import.meta.env.VITE_LMS_USE_MOCK === 'true',
    endpoints: {
      // ... endpoint configuration
    }
  }
};
```

### Build Process

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Requirements

The backend should implement these endpoints:

**Courses**:
- `GET /api/lms/courses` - List all courses
- `GET /api/lms/courses/:id` - Get course by ID
- `POST /api/lms/courses` - Create course (admin)
- `PUT /api/lms/courses/:id` - Update course (admin)
- `DELETE /api/lms/courses/:id` - Delete course (admin)

**Enrollments**:
- `POST /api/lms/courses/:courseId/enroll` - Enroll user
- `POST /api/lms/courses/:courseId/unenroll` - Unenroll user
- `GET /api/lms/users/:userId/enrollments` - Get user enrollments

**Progress**:
- `GET /api/lms/users/:userId/progress` - Get all user progress
- `GET /api/lms/users/:userId/progress/:courseId` - Get course progress
- `POST /api/lms/courses/:courseId/lessons/:lessonId/progress` - Update lesson
- `POST /api/lms/courses/:courseId/quizzes/:quizId/result` - Submit quiz

### Database Schema

```sql
-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor VARCHAR(255),
  duration VARCHAR(50),
  level VARCHAR(50),
  price DECIMAL(10,2),
  is_free BOOLEAN DEFAULT false,
  lessons_count INTEGER,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id INTEGER REFERENCES courses(id),
  status VARCHAR(50) DEFAULT 'active',
  enrolled_at TIMESTAMP DEFAULT NOW(),
  payment_status VARCHAR(50),
  payment_amount DECIMAL(10,2)
);

-- Course progress table
CREATE TABLE course_progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  course_id INTEGER REFERENCES courses(id),
  enrollment_id INTEGER REFERENCES enrollments(id),
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER,
  status VARCHAR(50) DEFAULT 'not_started',
  last_accessed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Best Practices

### 1. Always Use Entities

```typescript
// ✅ Good - Using entity
const course = await lmsAPI.getCourseById(id);
const isPopular = course.isPopular();

// ❌ Bad - Direct data manipulation
const courseData = await fetch(`/api/courses/${id}`);
const isPopular = courseData.enrolled > 1000;
```

### 2. Handle Errors Gracefully

```typescript
try {
  const course = await lmsAPI.getCourseById(id);
  if (!course) {
    // Show "course not found" message
    return;
  }
  // Process course
} catch (error) {
  // Show error message to user
  console.error('Failed to load course:', error);
}
```

### 3. Optimize API Calls

```typescript
// ✅ Good - Single API call
const courses = await lmsAPI.getCourses({ category: 'Programming' });

// ❌ Bad - Multiple API calls
const allCourses = await lmsAPI.getCourses();
const filtered = allCourses.filter(c => c.category === 'Programming');
```

### 4. Use TypeScript Properly

```typescript
// ✅ Good - Type-safe
const enrollment: Enrollment = await lmsAPI.enrollInCourse(userId, courseId);

// ❌ Bad - No type checking
const enrollment: any = await lmsAPI.enrollInCourse(userId, courseId);
```

---

## Troubleshooting

### Common Issues

**Issue**: Courses not loading
- Check `USE_MOCK_DATA` flag in `lmsApi.ts`
- Verify mock data exists in `mockCourses.ts`
- Check browser console for errors

**Issue**: Enrollment fails
- Verify user is authenticated
- Check payment status (for paid courses)
- Ensure course is not full (if max enrollment set)

**Issue**: Progress not updating
- Verify enrollment exists before updating progress
- Check that lessonId/quizId matches course data
- Ensure backend API is responding

---

## Additional Resources

- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/

---

## Support

For questions or issues:
1. Check existing documentation
2. Review code examples in this guide
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated**: 2025-12-29
**Version**: 1.0.0
