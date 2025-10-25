# API Requirements Documentation

Complete API endpoint specifications for the ESDC Frontend application.

## 📚 Documentation Structure

- **[Authentication APIs](./auth.md)** - User authentication and authorization
- **[User APIs](./user.md)** - User management and profile operations
- **[Admin APIs](./admin.md)** - Administrative operations
- **[Project APIs](./project.md)** - Project management
- **[Event APIs](./event.md)** - Event management
- **[Chatbot APIs](./chatbot.md)** - AI chatbot integration

## 🔗 Base URL

```
Development: http://localhost:9090
Production: https://esdc-backend.onrender.com
```

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📋 Response Format

All API responses follow this standard format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🚀 Quick Start

1. Review the specific API documentation for your feature
2. Implement the endpoint according to specifications
3. Test with the provided request/response examples
4. Handle all error cases documented

## 📝 Implementation Checklist

For each endpoint, ensure:

- [ ] Correct HTTP method (GET, POST, PUT, DELETE)
- [ ] Proper request body validation
- [ ] Authentication/authorization checks
- [ ] Error handling for all cases
- [ ] Consistent response format
- [ ] Database transactions where needed
- [ ] Logging for debugging
- [ ] Rate limiting (if applicable)

## 🔍 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
