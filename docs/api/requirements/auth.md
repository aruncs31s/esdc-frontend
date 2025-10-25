# Authentication API Requirements

## Overview

Authentication endpoints for user login, registration, and session management.

---

## 1. User Login

### Endpoint

```
POST /api/user/login
```

### Description

Authenticates a user and returns an access token.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Request Schema

| Field    | Type   | Required | Description                        |
| -------- | ------ | -------- | ---------------------------------- |
| email    | string | Yes      | User's email address               |
| password | string | Yes      | User's password (min 6 characters) |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Login successful"
}
```

### Error Responses

#### Invalid Credentials (401)

```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Email is required"
}
```

### Implementation Notes

- Hash password comparison using bcrypt
- Generate JWT token with 24h expiration
- Include user ID and role in token payload
- Log failed login attempts for security

---

## 2. User Registration

### Endpoint

```
POST /api/user/register
```

### Description

Creates a new user account.

### Request Body

```json
{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Request Schema

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| username | string | Yes      | Unique username (3-20 chars) |
| email    | string | Yes      | Valid email address          |
| password | string | Yes      | Password (min 6 characters)  |
| name     | string | Yes      | User's full name             |

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "message": "User registered successfully",
    "user_id": 1
  },
  "message": "Registration successful"
}
```

### Error Responses

#### Email Already Exists (400)

```json
{
  "success": false,
  "error": "Email already registered",
  "message": "An account with this email already exists"
}
```

#### Username Taken (400)

```json
{
  "success": false,
  "error": "Username unavailable",
  "message": "This username is already taken"
}
```

### Implementation Notes

- Validate email format
- Check username/email uniqueness before creation
- Hash password using bcrypt (10 rounds)
- Set default role as "user"
- Send welcome email (optional)

---

## 3. User Logout

### Endpoint

```
POST /user/logout
```

### Description

Invalidates the current user session.

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Implementation Notes

- Add token to blacklist (if using token blacklisting)
- Clear server-side session
- Return success even if token is invalid

---

## 4. Get User Profile

### Endpoint

```
GET /api/user/profile
```

### Description

Retrieves the authenticated user's profile information.

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "johndoe",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

### Error Responses

#### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### Implementation Notes

- Extract user ID from JWT token
- Return complete user profile
- Exclude sensitive data (password hash)

---

## Security Considerations

1. **Password Security**
   - Use bcrypt with salt rounds >= 10
   - Enforce minimum password length (6+ characters)
   - Consider password strength requirements

2. **Token Management**
   - Use JWT with secure secret key
   - Set appropriate expiration (24h recommended)
   - Include user ID and role in payload
   - Consider refresh token implementation

3. **Rate Limiting**
   - Implement rate limiting on login endpoint
   - Block after 5 failed attempts
   - Consider CAPTCHA for repeated failures

4. **Data Validation**
   - Validate all input fields
   - Sanitize user input
   - Use parameterized queries to prevent SQL injection

5. **HTTPS**
   - Always use HTTPS in production
   - Never send credentials over HTTP
