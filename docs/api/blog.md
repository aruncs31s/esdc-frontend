# Blog API Requirements

## Overview
The Blog API provides endpoints for managing blog posts, including creating, reading, updating, and deleting posts, as well as managing comments, likes, and categories.

## Base URL
```
/api/blog
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Posts
**GET** `/api/blog/posts`

Retrieve a paginated list of published blog posts.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Posts per page (default: 10, max: 50)
- `category` (string, optional): Filter by category
- `tag` (string, optional): Filter by tag
- `search` (string, optional): Search in title and content
- `author` (string, optional): Filter by author ID
- `sort` (string, optional): Sort by field (publishedAt, views, likes)
- `order` (string, optional): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "Getting Started with Arduino",
        "slug": "getting-started-arduino",
        "excerpt": "Learn the basics...",
        "content": "Full content...",
        "author": {
          "id": "uuid",
          "name": "John Doe",
          "avatar": "url"
        },
        "coverImage": "url",
        "tags": ["Arduino", "Tutorial"],
        "category": "Tutorial",
        "publishedAt": "2025-01-15T10:00:00Z",
        "updatedAt": "2025-01-15T10:00:00Z",
        "readTime": 5,
        "views": 120,
        "likes": 15,
        "commentsCount": 8
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

### 2. Get Single Post
**GET** `/api/blog/posts/:slug`

Retrieve a single blog post by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Getting Started with Arduino",
    "slug": "getting-started-arduino",
    "excerpt": "Learn the basics...",
    "content": "Full markdown content...",
    "author": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "url",
      "bio": "Electronics enthusiast"
    },
    "coverImage": "url",
    "tags": ["Arduino", "Tutorial"],
    "category": "Tutorial",
    "publishedAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z",
    "readTime": 5,
    "views": 121,
    "likes": 15,
    "isLiked": false,
    "comments": []
  }
}
```

---

### 3. Create Post
**POST** `/api/blog/posts`

Create a new blog post (requires authentication and author/admin role).

**Request Body:**
```json
{
  "title": "Getting Started with Arduino",
  "content": "Full markdown content...",
  "excerpt": "Learn the basics...",
  "coverImage": "url",
  "tags": ["Arduino", "Tutorial"],
  "category": "Tutorial",
  "status": "draft" // or "published"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "getting-started-arduino",
    "title": "Getting Started with Arduino",
    "status": "draft",
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### 4. Update Post
**PUT** `/api/blog/posts/:id`

Update an existing blog post (requires authentication and ownership/admin).

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt...",
  "coverImage": "url",
  "tags": ["Arduino", "Advanced"],
  "category": "Tutorial",
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "updated-title",
    "updatedAt": "2025-01-15T11:00:00Z"
  }
}
```

---

### 5. Delete Post
**DELETE** `/api/blog/posts/:id`

Delete a blog post (requires authentication and ownership/admin).

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### 6. Like/Unlike Post
**POST** `/api/blog/posts/:id/like`

Toggle like on a blog post (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likesCount": 16
  }
}
```

---

### 7. Get Comments
**GET** `/api/blog/posts/:id/comments`

Get all comments for a post.

**Query Parameters:**
- `page` (number, optional): Page number
- `limit` (number, optional): Comments per page

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "content": "Great tutorial!",
        "author": {
          "id": "uuid",
          "name": "Jane Smith",
          "avatar": "url"
        },
        "createdAt": "2025-01-15T12:00:00Z",
        "likes": 3,
        "replies": []
      }
    ],
    "pagination": {
      "page": 1,
      "total": 8
    }
  }
}
```

---

### 8. Add Comment
**POST** `/api/blog/posts/:id/comments`

Add a comment to a post (requires authentication).

**Request Body:**
```json
{
  "content": "Great tutorial!",
  "parentId": "uuid" // optional, for replies
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Great tutorial!",
    "createdAt": "2025-01-15T12:00:00Z"
  }
}
```

---

### 9. Get Categories
**GET** `/api/blog/categories`

Get all blog categories with post counts.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Tutorial",
      "slug": "tutorial",
      "count": 25
    },
    {
      "name": "News",
      "slug": "news",
      "count": 12
    }
  ]
}
```

---

### 10. Get Popular Tags
**GET** `/api/blog/tags`

Get popular tags with usage counts.

**Query Parameters:**
- `limit` (number, optional): Number of tags to return (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Arduino",
      "count": 15
    },
    {
      "name": "Raspberry Pi",
      "count": 12
    }
  ]
}
```

---

### 11. Increment View Count
**POST** `/api/blog/posts/:id/view`

Increment view count for a post (no authentication required).

**Response:**
```json
{
  "success": true,
  "data": {
    "views": 122
  }
}
```

---

## Data Models

### Post
```typescript
{
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown format
  authorId: string;
  coverImage?: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  readTime: number; // in minutes
  views: number;
  likes: number;
}
```

### Comment
```typescript
{
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentId?: string; // for nested replies
  createdAt: Date;
  updatedAt: Date;
  likes: number;
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `DUPLICATE_SLUG`: Slug already exists

---

## Implementation Notes

1. **Slug Generation**: Auto-generate URL-friendly slugs from titles
2. **Read Time**: Calculate based on word count (avg 200 words/min)
3. **Content Format**: Support Markdown with syntax highlighting
4. **Image Upload**: Implement separate endpoint for image uploads
5. **Caching**: Cache popular posts and categories
6. **Search**: Implement full-text search on title, excerpt, and content
7. **Rate Limiting**: Apply rate limits to prevent abuse
8. **Pagination**: Use cursor-based pagination for better performance
9. **SEO**: Include meta tags and Open Graph data in responses
10. **Notifications**: Notify authors of new comments on their posts

---

## Database Schema

### posts table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  cover_image VARCHAR(500),
  tags TEXT[],
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  read_time INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published_at);
```

### comments table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  likes INTEGER DEFAULT 0
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
```

### post_likes table
```sql
CREATE TABLE post_likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);
```
