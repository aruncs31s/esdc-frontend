# Chatbot API Requirements

## Overview

AI chatbot integration endpoints for conversational assistance and support.

---

## 1. Ask Chatbot

### Endpoint

```
POST /api/chatbot/ask
```

### Description

Sends a message to the AI chatbot and receives a response.

### Headers

```
Authorization: Bearer <token> (Optional)
```

### Request Body

```json
{
  "query_message": "How do I register for an event?"
}
```

### Request Schema

| Field         | Type   | Required | Description                              |
| ------------- | ------ | -------- | ---------------------------------------- |
| query_message | string | Yes      | User's question/message (max 1000 chars) |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "response": "To register for an event, navigate to the Events page, select the event you're interested in, and click the 'Register' button. You'll need to be logged in to complete the registration.",
    "message_id": "msg_123456",
    "timestamp": "2024-01-16T10:30:00Z"
  }
}
```

### Error Responses

#### Invalid Input (400)

```json
{
  "success": false,
  "error": "Invalid input",
  "message": "Query message cannot be empty"
}
```

#### Rate Limit Exceeded (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again in 60 seconds"
}
```

#### Service Unavailable (503)

```json
{
  "success": false,
  "error": "Service unavailable",
  "message": "Chatbot service is temporarily unavailable"
}
```

### Implementation Notes

- Support both authenticated and anonymous users
- Implement rate limiting (10 requests/minute for anonymous, 30 for authenticated)
- Log conversations for improvement
- Handle context from previous messages
- Sanitize input to prevent injection
- Implement timeout (30 seconds max)
- Return fallback response on AI failure

---

## 2. Get Chat History

### Endpoint

```
GET /api/chatbot/history/{userId}
```

### Description

Retrieves chat history for a specific user.

### Headers

```
Authorization: Bearer <token>
```

### URL Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| userId    | string | User ID     |

### Query Parameters

| Parameter | Type   | Required | Description                                |
| --------- | ------ | -------- | ------------------------------------------ |
| limit     | number | No       | Number of messages (default: 50, max: 100) |
| before    | string | No       | Get messages before this timestamp         |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "msg_123456",
      "message": "How do I register for an event?",
      "response": "To register for an event, navigate to...",
      "timestamp": "2024-01-16T10:30:00Z",
      "user_id": "user_123"
    },
    {
      "id": "msg_123455",
      "message": "What events are upcoming?",
      "response": "Here are the upcoming events...",
      "timestamp": "2024-01-16T10:25:00Z",
      "user_id": "user_123"
    }
  ],
  "pagination": {
    "has_more": true,
    "next_cursor": "2024-01-16T10:20:00Z"
  }
}
```

### Error Responses

#### Unauthorized (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

#### Forbidden (403)

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "You can only access your own chat history"
}
```

### Implementation Notes

- Users can only access their own history
- Admins can access any user's history
- Return messages in reverse chronological order
- Implement cursor-based pagination
- Include message metadata
- Exclude deleted messages

---

## 3. Get Quick Action Suggestions

### Endpoint

```
GET /api/chatbot/suggestions
```

### Description

Retrieves quick action suggestions for common queries.

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "label": "Register for Event",
      "message": "How do I register for an event?",
      "icon": "calendar",
      "category": "events"
    },
    {
      "label": "Submit Project",
      "message": "How can I submit my project?",
      "icon": "folder",
      "category": "projects"
    },
    {
      "label": "Contact Support",
      "message": "How do I contact support?",
      "icon": "help",
      "category": "support"
    },
    {
      "label": "View Profile",
      "message": "How do I update my profile?",
      "icon": "user",
      "category": "account"
    }
  ]
}
```

### Implementation Notes

- Return context-aware suggestions
- Personalize based on user activity
- Update suggestions dynamically
- Cache for performance
- Include icon/category for UI

---

## 4. Clear Chat History

### Endpoint

```
DELETE /api/chatbot/history/{userId}
```

### Description

Clears chat history for a user.

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Chat history cleared successfully"
}
```

### Implementation Notes

- Soft delete recommended
- Users can only clear their own history
- Archive data before deletion
- Log deletion for audit

---

## 5. Rate Chatbot Response

### Endpoint

```
POST /api/chatbot/rate
```

### Description

Allows users to rate chatbot responses.

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "message_id": "msg_123456",
  "rating": 5,
  "feedback": "Very helpful response"
}
```

### Request Schema

| Field      | Type   | Required | Description            |
| ---------- | ------ | -------- | ---------------------- |
| message_id | string | Yes      | Message ID to rate     |
| rating     | number | Yes      | Rating (1-5)           |
| feedback   | string | No       | Optional feedback text |

### Success Response (200)

```json
{
  "success": true,
  "message": "Thank you for your feedback"
}
```

### Implementation Notes

- Store ratings for AI improvement
- Allow one rating per message
- Use feedback for training
- Track rating trends

---

## 6. Report Issue

### Endpoint

```
POST /api/chatbot/report
```

### Description

Reports inappropriate or incorrect chatbot responses.

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "message_id": "msg_123456",
  "issue_type": "incorrect_information",
  "description": "The response provided incorrect event dates"
}
```

### Request Schema

| Field       | Type   | Required | Description                               |
| ----------- | ------ | -------- | ----------------------------------------- |
| message_id  | string | Yes      | Message ID to report                      |
| issue_type  | string | Yes      | incorrect_information/inappropriate/other |
| description | string | Yes      | Issue description                         |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "report_id": "report_789",
    "status": "submitted"
  },
  "message": "Issue reported successfully"
}
```

### Implementation Notes

- Notify moderators immediately
- Flag message for review
- Track report patterns
- Take action on repeated issues

---

## Chatbot Features

### Context Management

- Maintain conversation context for 30 minutes
- Support multi-turn conversations
- Reference previous messages
- Clear context on user request

### Supported Topics

- Event registration and information
- Project submission guidelines
- User account management
- Club information and activities
- Technical support
- General FAQs

### Response Types

- Text responses
- Quick reply buttons
- Links to relevant pages
- Formatted lists
- Code snippets (for technical queries)

### Error Handling

- Graceful degradation on AI failure
- Fallback to predefined responses
- Escalation to human support
- Clear error messages

---

## Rate Limiting

### Anonymous Users

- 10 requests per minute
- 100 requests per hour
- 500 requests per day

### Authenticated Users

- 30 requests per minute
- 500 requests per hour
- 2000 requests per day

### Implementation

```typescript
// Rate limit headers
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1642348800
```

---

## Data Models

### ChatMessage

```typescript
{
  id: string;
  user_id?: string;
  message: string;
  response: string;
  timestamp: string;
  rating?: number;
  feedback?: string;
}
```

### Suggestion

```typescript
{
  label: string;
  message: string;
  icon?: string;
  category?: string;
}
```

### ChatbotResponse

```typescript
{
  response: string;
  message_id: string;
  timestamp: string;
  suggestions?: Suggestion[];
  quick_replies?: string[];
}
```

---

## Integration Notes

### AI Service

- Use OpenAI GPT or similar
- Implement retry logic
- Cache common responses
- Monitor API costs
- Set response length limits

### Training Data

- Use club-specific information
- Include FAQs and documentation
- Update regularly with new content
- Fine-tune on user interactions

### Privacy

- Don't store sensitive information
- Anonymize data for training
- Allow users to delete history
- Comply with data protection regulations
