# User API Requirements

## Overview

User management endpoints for searching, viewing, and managing user data.

---

## 1. Search Users

### Endpoint

```
GET /api/users/search?q={query}
```

### Description

Searches for users by username, email, or name.

### Query Parameters

| Parameter | Type   | Required | Description                     |
| --------- | ------ | -------- | ------------------------------- |
| q         | string | Yes      | Search query (min 2 characters) |

### Example Request

```
GET /api/users/search?q=john
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      {
        "id": 2,
        "username": "johnsmith",
        "email": "smith@example.com",
        "name": "John Smith",
        "avatar": null
      }
    ]
  }
}
```

### Implementation Notes

- Search across username, email, and name fields
- Use LIKE or full-text search
- Limit results to 20 users
- Return only public profile data
- Case-insensitive search

---

## 2. Get All Users (Admin)

### Endpoint

```
GET /api/admin/users
```

### Description

Retrieves all users with optional filtering.

### Headers

```
Authorization: Bearer <admin_token>
```

### Query Parameters

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| email     | string | No       | Filter by email              |
| username  | string | No       | Filter by username           |
| role      | string | No       | Filter by role (user/admin)  |
| page      | number | No       | Page number (default: 1)     |
| limit     | number | No       | Items per page (default: 50) |

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
      "last_login": "2024-01-15T10:30:00Z"
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

### Error Responses

#### Forbidden (403)

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "Admin access required"
}
```

### Implementation Notes

- Require admin role
- Support pagination
- Allow filtering by multiple fields
- Return user statistics

---

## 3. Get User by ID (Admin)

### Endpoint

```
GET /api/admin/users/{id}
```

### Description

Retrieves detailed information for a specific user.

### Headers

```
Authorization: Bearer <admin_token>
```

### URL Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | User ID     |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z",
    "last_login": "2024-01-15T10:30:00Z",
    "projects_count": 5,
    "events_attended": 3
  }
}
```

### Error Responses

#### Not Found (404)

```json
{
  "success": false,
  "error": "User not found",
  "message": "No user exists with ID 999"
}
```

---

## 4. Update User (Admin)

### Endpoint

```
PUT /api/admin/users/{id}
```

### Description

Updates user information.

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "username": "johndoe_updated",
  "email": "newemail@example.com",
  "name": "John Doe Jr.",
  "role": "admin",
  "bio": "Updated bio"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe_updated",
    "email": "newemail@example.com",
    "name": "John Doe Jr.",
    "role": "admin",
    "updated_at": "2024-01-16T00:00:00Z"
  },
  "message": "User updated successfully"
}
```

### Implementation Notes

- Validate email uniqueness if changed
- Validate username uniqueness if changed
- Only allow admin to change roles
- Log role changes for audit

---

## 5. Delete User (Admin)

### Endpoint

```
DELETE /api/admin/users/{id}
```

### Description

Deletes a user account.

### Headers

```
Authorization: Bearer <admin_token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Implementation Notes

- Soft delete recommended (mark as deleted)
- Delete or reassign user's projects
- Delete user's sessions
- Cannot delete own admin account
- Log deletion for audit trail

---

## 6. Check Email Exists

### Endpoint

```
GET /api/users/check-email?email={email}
```

### Description

Checks if an email is already registered.

### Query Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| email     | string | Yes      | Email to check |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "exists": true
  }
}
```

### Implementation Notes

- Used for registration validation
- Return boolean only
- No authentication required

---

## 7. Check Username Exists

### Endpoint

```
GET /api/users/check-username?username={username}
```

### Description

Checks if a username is already taken.

### Query Parameters

| Parameter | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| username  | string | Yes      | Username to check |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "exists": false
  }
}
```

### Implementation Notes

- Used for registration validation
- Case-insensitive check
- Return boolean only
- No authentication required

---

## Data Models

### User Object

```typescript
{
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}
```

### UserSearchData Object

```typescript
{
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}
```
