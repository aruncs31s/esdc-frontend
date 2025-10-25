# Event API Requirements

## Overview

Event management endpoints for creating, viewing, and managing club events.

---

## 1. Get All Events

### Endpoint

```
GET /api/events
```

### Description

Retrieves all events with optional filtering.

### Query Parameters

| Parameter | Type    | Required | Description                                |
| --------- | ------- | -------- | ------------------------------------------ |
| status    | string  | No       | Filter by status (upcoming/past/cancelled) |
| upcoming  | boolean | No       | Get only upcoming events                   |
| page      | number  | No       | Page number (default: 1)                   |
| limit     | number  | No       | Items per page (default: 20)               |

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Arduino Workshop",
      "description": "Hands-on Arduino programming workshop",
      "long_description": "Learn Arduino basics and build your first project...",
      "event_type": "workshop",
      "start_date": "2024-02-15T10:00:00Z",
      "end_date": "2024-02-15T16:00:00Z",
      "location": "Lab 101, Engineering Building",
      "venue": "Engineering Building",
      "max_participants": 30,
      "registered_count": 18,
      "registration_deadline": "2024-02-10T23:59:59Z",
      "status": "upcoming",
      "image_url": "https://example.com/event-image.jpg",
      "organizer": {
        "id": 2,
        "name": "ESDC Team",
        "email": "esdc@example.com"
      },
      "tags": ["Arduino", "IoT", "Beginner"],
      "is_free": true,
      "registration_fee": 0,
      "created_at": "2024-01-10T00:00:00Z",
      "updated_at": "2024-01-10T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "pages": 1
  }
}
```

### Implementation Notes

- Return events sorted by start_date
- Include registration status
- Calculate available slots
- Filter past events by default

---

## 2. Get Event by ID

### Endpoint

```
GET /api/events/{id}
```

### Description

Retrieves detailed information for a specific event.

### URL Parameters

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| id        | number | Event ID    |

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Arduino Workshop",
    "description": "Hands-on Arduino programming workshop",
    "long_description": "Detailed event description with agenda...",
    "event_type": "workshop",
    "start_date": "2024-02-15T10:00:00Z",
    "end_date": "2024-02-15T16:00:00Z",
    "location": "Lab 101, Engineering Building",
    "venue": "Engineering Building",
    "address": "123 University Ave",
    "map_url": "https://maps.google.com/?q=...",
    "max_participants": 30,
    "registered_count": 18,
    "available_slots": 12,
    "registration_deadline": "2024-02-10T23:59:59Z",
    "status": "upcoming",
    "image_url": "https://example.com/event-image.jpg",
    "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
    "organizer": {
      "id": 2,
      "name": "ESDC Team",
      "email": "esdc@example.com",
      "phone": "+1234567890"
    },
    "speakers": [
      {
        "name": "John Doe",
        "title": "IoT Expert",
        "bio": "10 years experience...",
        "avatar": "https://example.com/speaker.jpg"
      }
    ],
    "agenda": [
      {
        "time": "10:00 AM",
        "title": "Introduction to Arduino",
        "duration": "1 hour"
      }
    ],
    "requirements": ["Laptop with Arduino IDE installed", "Basic programming knowledge"],
    "tags": ["Arduino", "IoT", "Beginner"],
    "is_free": true,
    "registration_fee": 0,
    "certificate_provided": true,
    "created_at": "2024-01-10T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

### Error Responses

#### Not Found (404)

```json
{
  "success": false,
  "error": "Event not found",
  "message": "No event exists with ID 999"
}
```

---

## 3. Create Event (Admin)

### Endpoint

```
POST /api/events
```

### Description

Creates a new event (admin only).

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "title": "Python Workshop",
  "description": "Learn Python basics",
  "long_description": "Comprehensive Python workshop...",
  "event_type": "workshop",
  "start_date": "2024-03-01T10:00:00Z",
  "end_date": "2024-03-01T16:00:00Z",
  "location": "Lab 102",
  "venue": "Engineering Building",
  "max_participants": 25,
  "registration_deadline": "2024-02-25T23:59:59Z",
  "is_free": true,
  "registration_fee": 0,
  "tags": ["Python", "Programming"],
  "image_url": "https://example.com/event.jpg"
}
```

### Request Schema

| Field                 | Type     | Required | Description                         |
| --------------------- | -------- | -------- | ----------------------------------- |
| title                 | string   | Yes      | Event title (max 200 chars)         |
| description           | string   | Yes      | Short description (max 500 chars)   |
| long_description      | string   | No       | Detailed description                |
| event_type            | string   | Yes      | workshop/seminar/competition/meetup |
| start_date            | string   | Yes      | ISO 8601 datetime                   |
| end_date              | string   | Yes      | ISO 8601 datetime                   |
| location              | string   | Yes      | Event location                      |
| venue                 | string   | No       | Venue name                          |
| max_participants      | number   | No       | Maximum attendees                   |
| registration_deadline | string   | No       | Registration cutoff date            |
| is_free               | boolean  | No       | Free event (default: true)          |
| registration_fee      | number   | No       | Fee amount (default: 0)             |
| tags                  | string[] | No       | Event tags                          |
| image_url             | string   | No       | Event image URL                     |

### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": 9,
    "title": "Python Workshop",
    "start_date": "2024-03-01T10:00:00Z",
    "status": "upcoming"
  },
  "message": "Event created successfully"
}
```

### Implementation Notes

- Require admin role
- Validate dates (end_date > start_date)
- Set status based on dates
- Send notifications to subscribers

---

## 4. Update Event (Admin)

### Endpoint

```
PUT /api/events/{id}
```

### Description

Updates an existing event (admin only).

### Headers

```
Authorization: Bearer <admin_token>
```

### Request Body

```json
{
  "title": "Updated Title",
  "max_participants": 35,
  "registration_deadline": "2024-02-28T23:59:59Z"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Title",
    "updated_at": "2024-01-16T00:00:00Z"
  },
  "message": "Event updated successfully"
}
```

### Implementation Notes

- Allow partial updates
- Notify registered users of changes
- Validate date changes
- Update status if dates changed

---

## 5. Delete Event (Admin)

### Endpoint

```
DELETE /api/events/{id}
```

### Description

Deletes an event (admin only).

### Headers

```
Authorization: Bearer <admin_token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Implementation Notes

- Soft delete recommended
- Notify registered users
- Refund fees if applicable
- Archive event data

---

## 6. Register for Event

### Endpoint

```
POST /api/events/{id}/register
```

### Description

Registers the authenticated user for an event.

### Headers

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "additional_info": "Dietary restrictions: Vegetarian"
}
```

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "registration_id": 123,
    "event_id": 1,
    "user_id": 5,
    "status": "confirmed",
    "registered_at": "2024-01-16T00:00:00Z"
  },
  "message": "Successfully registered for event"
}
```

### Error Responses

#### Event Full (400)

```json
{
  "success": false,
  "error": "Event full",
  "message": "Maximum participants reached"
}
```

#### Already Registered (400)

```json
{
  "success": false,
  "error": "Already registered",
  "message": "You are already registered for this event"
}
```

#### Registration Closed (400)

```json
{
  "success": false,
  "error": "Registration closed",
  "message": "Registration deadline has passed"
}
```

### Implementation Notes

- Check available slots
- Verify registration deadline
- Prevent duplicate registrations
- Send confirmation email
- Generate QR code for check-in

---

## 7. Cancel Registration

### Endpoint

```
DELETE /api/events/{id}/register
```

### Description

Cancels user's event registration.

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

### Implementation Notes

- Allow cancellation before event
- Update available slots
- Send cancellation confirmation
- Process refund if applicable

---

## 8. Get Upcoming Events

### Endpoint

```
GET /api/events?upcoming=true
```

### Description

Retrieves only upcoming events.

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Arduino Workshop",
      "start_date": "2024-02-15T10:00:00Z",
      "available_slots": 12
    }
  ]
}
```

### Implementation Notes

- Filter events where start_date > now
- Sort by start_date ascending
- Include registration status

---

## 9. Get User's Registered Events

### Endpoint

```
GET /api/events/my-registrations
```

### Description

Retrieves events the user is registered for.

### Headers

```
Authorization: Bearer <token>
```

### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "event": {
        "id": 1,
        "title": "Arduino Workshop",
        "start_date": "2024-02-15T10:00:00Z"
      },
      "registration": {
        "id": 123,
        "status": "confirmed",
        "registered_at": "2024-01-16T00:00:00Z",
        "qr_code": "https://example.com/qr/123.png"
      }
    }
  ]
}
```

---

## Data Models

### Event

```typescript
{
  id: number;
  title: string;
  description: string;
  long_description?: string;
  event_type: 'workshop' | 'seminar' | 'competition' | 'meetup';
  start_date: string;
  end_date: string;
  location: string;
  venue?: string;
  max_participants?: number;
  registered_count: number;
  available_slots?: number;
  registration_deadline?: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'cancelled';
  image_url?: string;
  tags?: string[];
  is_free: boolean;
  registration_fee: number;
  certificate_provided?: boolean;
  created_at: string;
  updated_at: string;
}
```
