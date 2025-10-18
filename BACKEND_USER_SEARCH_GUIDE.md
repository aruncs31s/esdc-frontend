# Backend User Search Implementation Guide (Go + Gin + GORM)

## 1. Create the User Search Handler

Add this to your user handler/controller:

```go
// handlers/user_handler.go
func (h *UserHandler) SearchUsers(c *gin.Context) {
    query := c.Query("q")

    if query == "" {
        c.JSON(http.StatusOK, gin.H{"users": []interface{}{}})
        return
    }

    var users []models.User

    // Search by name or email with LIKE query
    err := h.db.Where("name ILIKE ? OR email ILIKE ?",
        "%"+query+"%", "%"+query+"%").
        Limit(10).
        Find(&users).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search users"})
        return
    }

    // Return only necessary fields
    type UserResponse struct {
        ID    uint   `json:"id"`
        Name  string `json:"name"`
        Email string `json:"email"`
    }

    var response []UserResponse
    for _, user := range users {
        response = append(response, UserResponse{
            ID:    user.ID,
            Name:  user.Name,
            Email: user.Email,
        })
    }

    c.JSON(http.StatusOK, gin.H{"users": response})
}
```

## 2. Add the Route

In your router setup:

```go
// routes/routes.go
func SetupRoutes(router *gin.Engine, handlers *Handlers) {
    api := router.Group("/api")
    {
        users := api.Group("/users")
        {
            users.GET("/search", handlers.User.SearchUsers)
        }
    }
}
```

## 3. Optimize with Database Index (Optional but Recommended)

Add indexes to your User model for faster searches:

```go
// migrations/add_user_search_indexes.go
func AddUserSearchIndexes(db *gorm.DB) error {
    // Add GIN index for PostgreSQL (for ILIKE searches)
    db.Exec("CREATE INDEX IF NOT EXISTS idx_users_name_gin ON users USING gin(name gin_trgm_ops)")
    db.Exec("CREATE INDEX IF NOT EXISTS idx_users_email_gin ON users USING gin(email gin_trgm_ops)")

    // Enable pg_trgm extension if not already enabled
    db.Exec("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    return nil
}
```

Or for simple B-tree indexes:

```go
db.Exec("CREATE INDEX IF NOT EXISTS idx_users_name ON users(name)")
db.Exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
```

## 4. Alternative: Using GORM's Select for Better Performance

```go
func (h *UserHandler) SearchUsers(c *gin.Context) {
    query := c.Query("q")

    if query == "" {
        c.JSON(http.StatusOK, gin.H{"users": []interface{}{}})
        return
    }

    var users []struct {
        ID    uint   `json:"id"`
        Name  string `json:"name"`
        Email string `json:"email"`
    }

    err := h.db.Model(&models.User{}).
        Select("id, name, email").
        Where("name ILIKE ? OR email ILIKE ?", "%"+query+"%", "%"+query+"%").
        Limit(10).
        Find(&users).Error

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to search users"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"users": users})
}
```

## 5. Add Middleware for Authentication (Optional)

If you want to protect this endpoint:

```go
users.GET("/search", middleware.AuthRequired(), handlers.User.SearchUsers)
```

## 6. Testing the Endpoint

```bash
# Test the search endpoint
curl "http://localhost:8080/api/users/search?q=john"

# Expected response:
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 5,
      "name": "Johnny Smith",
      "email": "johnny@example.com"
    }
  ]
}
```

## Notes:

- **ILIKE** is case-insensitive (PostgreSQL). Use **LIKE** for MySQL/SQLite
- **Limit(10)** prevents returning too many results
- Consider adding pagination if needed
- Add rate limiting to prevent abuse
- The frontend debounces requests (300ms) to reduce server load
