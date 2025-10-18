# Search API - Go Implementation Guide

## Overview

Universal search system supporting multiple content types (users, products, blogs, projects) with advanced filtering, pagination, and relevance scoring.

---

## API Specification

### Base URL

```
/api/search
```

### Endpoint

**GET** `/api/search`

**Query Parameters:**

- `q` (string, required): Search query
- `category` (string, optional): all, users, products, blogs, projects
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Results per page (default: 20, max: 100)
- `sort` (string, optional): relevance, date, popularity
- `filters` (object, optional): Category-specific filters

**Response:**

```json
{
  "success": true,
  "query": "arduino",
  "category": "all",
  "data": {
    "users": {
      "total": 15,
      "results": [
        {
          "id": "uuid",
          "name": "John Doe",
          "username": "johndoe",
          "avatar": "url",
          "role": "Developer",
          "bio": "IoT enthusiast",
          "score": 0.95
        }
      ]
    },
    "products": {
      "total": 23,
      "results": [
        {
          "id": "uuid",
          "name": "Arduino Starter Kit",
          "price": 45.99,
          "image": "url",
          "category": "Hardware",
          "stock": 25,
          "rating": 4.5,
          "score": 0.92
        }
      ]
    },
    "blogs": {
      "total": 42,
      "results": [
        {
          "id": "uuid",
          "title": "Getting Started with Arduino",
          "excerpt": "Learn the basics...",
          "author": {
            "id": "uuid",
            "name": "John Doe"
          },
          "publishedAt": "2025-01-15T10:00:00Z",
          "tags": ["Arduino", "Tutorial"],
          "views": 1250,
          "score": 0.88
        }
      ]
    },
    "projects": {
      "total": 18,
      "results": [
        {
          "id": "uuid",
          "title": "Smart Home Automation",
          "description": "IoT-based system...",
          "author": {
            "id": "uuid",
            "name": "Jane Smith"
          },
          "technologies": ["Arduino", "IoT"],
          "stars": 45,
          "forks": 12,
          "score": 0.85
        }
      ]
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalResults": 98
  },
  "executionTime": "45ms"
}
```

---

## Go Implementation

### 1. Project Structure

```
search-service/
├── main.go
├── config/
│   └── config.go
├── models/
│   ├── search.go
│   └── results.go
├── handlers/
│   └── search_handler.go
├── services/
│   ├── search_service.go
│   ├── elasticsearch_service.go
│   └── cache_service.go
├── repositories/
│   ├── user_repository.go
│   ├── product_repository.go
│   ├── blog_repository.go
│   └── project_repository.go
└── utils/
    ├── scoring.go
    └── highlighter.go
```

### 2. Dependencies

```go
// go.mod
module github.com/esdc/search-service

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/elastic/go-elasticsearch/v8 v8.11.1
    github.com/go-redis/redis/v8 v8.11.5
    github.com/lib/pq v1.10.9
    github.com/joho/godotenv v1.5.1
)
```

### 3. Models

```go
// models/search.go
package models

import "time"

type SearchRequest struct {
    Query    string                 `json:"query" binding:"required"`
    Category string                 `json:"category"`
    Page     int                    `json:"page"`
    Limit    int                    `json:"limit"`
    Sort     string                 `json:"sort"`
    Filters  map[string]interface{} `json:"filters"`
}

type SearchResponse struct {
    Success       bool                   `json:"success"`
    Query         string                 `json:"query"`
    Category      string                 `json:"category"`
    Data          SearchData             `json:"data"`
    Pagination    Pagination             `json:"pagination"`
    ExecutionTime string                 `json:"executionTime"`
}

type SearchData struct {
    Users    *CategoryResults `json:"users,omitempty"`
    Products *CategoryResults `json:"products,omitempty"`
    Blogs    *CategoryResults `json:"blogs,omitempty"`
    Projects *CategoryResults `json:"projects,omitempty"`
}

type CategoryResults struct {
    Total   int           `json:"total"`
    Results []interface{} `json:"results"`
}

type UserResult struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Username string  `json:"username"`
    Avatar   string  `json:"avatar"`
    Role     string  `json:"role"`
    Bio      string  `json:"bio"`
    Score    float64 `json:"score"`
}

type ProductResult struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    Image    string  `json:"image"`
    Category string  `json:"category"`
    Stock    int     `json:"stock"`
    Rating   float64 `json:"rating"`
    Score    float64 `json:"score"`
}

type BlogResult struct {
    ID          string    `json:"id"`
    Title       string    `json:"title"`
    Excerpt     string    `json:"excerpt"`
    Author      Author    `json:"author"`
    PublishedAt time.Time `json:"publishedAt"`
    Tags        []string  `json:"tags"`
    Views       int       `json:"views"`
    Score       float64   `json:"score"`
}

type ProjectResult struct {
    ID           string   `json:"id"`
    Title        string   `json:"title"`
    Description  string   `json:"description"`
    Author       Author   `json:"author"`
    Technologies []string `json:"technologies"`
    Stars        int      `json:"stars"`
    Forks        int      `json:"forks"`
    Score        float64  `json:"score"`
}

type Author struct {
    ID   string `json:"id"`
    Name string `json:"name"`
}

type Pagination struct {
    Page         int `json:"page"`
    Limit        int `json:"limit"`
    TotalResults int `json:"totalResults"`
}
```

### 4. Search Handler

```go
// handlers/search_handler.go
package handlers

import (
    "net/http"
    "time"
    "github.com/gin-gonic/gin"
    "github.com/esdc/search-service/models"
    "github.com/esdc/search-service/services"
)

type SearchHandler struct {
    searchService *services.SearchService
}

func NewSearchHandler(searchService *services.SearchService) *SearchHandler {
    return &SearchHandler{searchService: searchService}
}

func (h *SearchHandler) Search(c *gin.Context) {
    startTime := time.Now()

    // Parse query parameters
    req := models.SearchRequest{
        Query:    c.Query("q"),
        Category: c.DefaultQuery("category", "all"),
        Page:     c.DefaultQuery("page", "1"),
        Limit:    c.DefaultQuery("limit", "20"),
        Sort:     c.DefaultQuery("sort", "relevance"),
    }

    // Validate
    if req.Query == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error":   "Query parameter 'q' is required",
        })
        return
    }

    // Perform search
    results, err := h.searchService.Search(c.Request.Context(), &req)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error":   err.Error(),
        })
        return
    }

    // Calculate execution time
    executionTime := time.Since(startTime)

    // Build response
    response := models.SearchResponse{
        Success:       true,
        Query:         req.Query,
        Category:      req.Category,
        Data:          results,
        ExecutionTime: executionTime.String(),
    }

    c.JSON(http.StatusOK, response)
}
```

### 5. Search Service

```go
// services/search_service.go
package services

import (
    "context"
    "sync"
    "github.com/esdc/search-service/models"
    "github.com/esdc/search-service/repositories"
)

type SearchService struct {
    userRepo    *repositories.UserRepository
    productRepo *repositories.ProductRepository
    blogRepo    *repositories.BlogRepository
    projectRepo *repositories.ProjectRepository
    esService   *ElasticsearchService
    cacheService *CacheService
}

func NewSearchService(
    userRepo *repositories.UserRepository,
    productRepo *repositories.ProductRepository,
    blogRepo *repositories.BlogRepository,
    projectRepo *repositories.ProjectRepository,
    esService *ElasticsearchService,
    cacheService *CacheService,
) *SearchService {
    return &SearchService{
        userRepo:     userRepo,
        productRepo:  productRepo,
        blogRepo:     blogRepo,
        projectRepo:  projectRepo,
        esService:    esService,
        cacheService: cacheService,
    }
}

func (s *SearchService) Search(ctx context.Context, req *models.SearchRequest) (models.SearchData, error) {
    // Check cache first
    cacheKey := s.cacheService.GenerateCacheKey(req)
    if cached, found := s.cacheService.Get(cacheKey); found {
        return cached.(models.SearchData), nil
    }

    var data models.SearchData
    var wg sync.WaitGroup
    errChan := make(chan error, 4)

    // Search in parallel
    if req.Category == "all" || req.Category == "users" {
        wg.Add(1)
        go func() {
            defer wg.Done()
            results, err := s.searchUsers(ctx, req)
            if err != nil {
                errChan <- err
                return
            }
            data.Users = results
        }()
    }

    if req.Category == "all" || req.Category == "products" {
        wg.Add(1)
        go func() {
            defer wg.Done()
            results, err := s.searchProducts(ctx, req)
            if err != nil {
                errChan <- err
                return
            }
            data.Products = results
        }()
    }

    if req.Category == "all" || req.Category == "blogs" {
        wg.Add(1)
        go func() {
            defer wg.Done()
            results, err := s.searchBlogs(ctx, req)
            if err != nil {
                errChan <- err
                return
            }
            data.Blogs = results
        }()
    }

    if req.Category == "all" || req.Category == "projects" {
        wg.Add(1)
        go func() {
            defer wg.Done()
            results, err := s.searchProjects(ctx, req)
            if err != nil {
                errChan <- err
                return
            }
            data.Projects = results
        }()
    }

    wg.Wait()
    close(errChan)

    // Check for errors
    if err := <-errChan; err != nil {
        return data, err
    }

    // Cache results
    s.cacheService.Set(cacheKey, data, 5*time.Minute)

    return data, nil
}

func (s *SearchService) searchUsers(ctx context.Context, req *models.SearchRequest) (*models.CategoryResults, error) {
    // Use Elasticsearch for full-text search
    hits, total, err := s.esService.SearchUsers(ctx, req.Query, req.Page, req.Limit)
    if err != nil {
        return nil, err
    }

    results := make([]interface{}, len(hits))
    for i, hit := range hits {
        results[i] = hit
    }

    return &models.CategoryResults{
        Total:   total,
        Results: results,
    }, nil
}

func (s *SearchService) searchProducts(ctx context.Context, req *models.SearchRequest) (*models.CategoryResults, error) {
    hits, total, err := s.esService.SearchProducts(ctx, req.Query, req.Page, req.Limit)
    if err != nil {
        return nil, err
    }

    results := make([]interface{}, len(hits))
    for i, hit := range hits {
        results[i] = hit
    }

    return &models.CategoryResults{
        Total:   total,
        Results: results,
    }, nil
}

func (s *SearchService) searchBlogs(ctx context.Context, req *models.SearchRequest) (*models.CategoryResults, error) {
    hits, total, err := s.esService.SearchBlogs(ctx, req.Query, req.Page, req.Limit)
    if err != nil {
        return nil, err
    }

    results := make([]interface{}, len(hits))
    for i, hit := range hits {
        results[i] = hit
    }

    return &models.CategoryResults{
        Total:   total,
        Results: results,
    }, nil
}

func (s *SearchService) searchProjects(ctx context.Context, req *models.SearchRequest) (*models.CategoryResults, error) {
    hits, total, err := s.esService.SearchProjects(ctx, req.Query, req.Page, req.Limit)
    if err != nil {
        return nil, err
    }

    results := make([]interface{}, len(hits))
    for i, hit := range hits {
        results[i] = hit
    }

    return &models.CategoryResults{
        Total:   total,
        Results: results,
    }, nil
}
```

### 6. Elasticsearch Service

```go
// services/elasticsearch_service.go
package services

import (
    "context"
    "encoding/json"
    "github.com/elastic/go-elasticsearch/v8"
    "github.com/esdc/search-service/models"
)

type ElasticsearchService struct {
    client *elasticsearch.Client
}

func NewElasticsearchService(client *elasticsearch.Client) *ElasticsearchService {
    return &ElasticsearchService{client: client}
}

func (s *ElasticsearchService) SearchUsers(ctx context.Context, query string, page, limit int) ([]models.UserResult, int, error) {
    from := (page - 1) * limit

    searchQuery := map[string]interface{}{
        "query": map[string]interface{}{
            "multi_match": map[string]interface{}{
                "query":  query,
                "fields": []string{"name^3", "username^2", "bio", "role"},
                "fuzziness": "AUTO",
            },
        },
        "from": from,
        "size": limit,
        "sort": []map[string]interface{}{
            {"_score": map[string]string{"order": "desc"}},
        },
    }

    var buf bytes.Buffer
    if err := json.NewEncoder(&buf).Encode(searchQuery); err != nil {
        return nil, 0, err
    }

    res, err := s.client.Search(
        s.client.Search.WithContext(ctx),
        s.client.Search.WithIndex("users"),
        s.client.Search.WithBody(&buf),
    )
    if err != nil {
        return nil, 0, err
    }
    defer res.Body.Close()

    var result map[string]interface{}
    if err := json.NewDecoder(res.Body).Decode(&result); err != nil {
        return nil, 0, err
    }

    hits := result["hits"].(map[string]interface{})["hits"].([]interface{})
    total := int(result["hits"].(map[string]interface{})["total"].(map[string]interface{})["value"].(float64))

    users := make([]models.UserResult, len(hits))
    for i, hit := range hits {
        source := hit.(map[string]interface{})["_source"].(map[string]interface{})
        score := hit.(map[string]interface{})["_score"].(float64)

        users[i] = models.UserResult{
            ID:       source["id"].(string),
            Name:     source["name"].(string),
            Username: source["username"].(string),
            Avatar:   source["avatar"].(string),
            Role:     source["role"].(string),
            Bio:      source["bio"].(string),
            Score:    score,
        }
    }

    return users, total, nil
}

// Similar implementations for SearchProducts, SearchBlogs, SearchProjects
```

### 7. Cache Service

```go
// services/cache_service.go
package services

import (
    "context"
    "crypto/md5"
    "encoding/hex"
    "encoding/json"
    "time"
    "github.com/go-redis/redis/v8"
    "github.com/esdc/search-service/models"
)

type CacheService struct {
    client *redis.Client
}

func NewCacheService(client *redis.Client) *CacheService {
    return &CacheService{client: client}
}

func (s *CacheService) GenerateCacheKey(req *models.SearchRequest) string {
    data, _ := json.Marshal(req)
    hash := md5.Sum(data)
    return "search:" + hex.EncodeToString(hash[:])
}

func (s *CacheService) Get(key string) (interface{}, bool) {
    val, err := s.client.Get(context.Background(), key).Result()
    if err != nil {
        return nil, false
    }

    var data models.SearchData
    if err := json.Unmarshal([]byte(val), &data); err != nil {
        return nil, false
    }

    return data, true
}

func (s *CacheService) Set(key string, value interface{}, expiration time.Duration) error {
    data, err := json.Marshal(value)
    if err != nil {
        return err
    }

    return s.client.Set(context.Background(), key, data, expiration).Err()
}
```

### 8. Main Application

```go
// main.go
package main

import (
    "log"
    "github.com/gin-gonic/gin"
    "github.com/elastic/go-elasticsearch/v8"
    "github.com/go-redis/redis/v8"
    "github.com/esdc/search-service/handlers"
    "github.com/esdc/search-service/services"
    "github.com/esdc/search-service/repositories"
)

func main() {
    // Initialize Elasticsearch
    esClient, err := elasticsearch.NewDefaultClient()
    if err != nil {
        log.Fatal(err)
    }

    // Initialize Redis
    redisClient := redis.NewClient(&redis.Options{
        Addr: "localhost:6379",
    })

    // Initialize services
    esService := services.NewElasticsearchService(esClient)
    cacheService := services.NewCacheService(redisClient)

    // Initialize repositories (connect to PostgreSQL)
    userRepo := repositories.NewUserRepository(db)
    productRepo := repositories.NewProductRepository(db)
    blogRepo := repositories.NewBlogRepository(db)
    projectRepo := repositories.NewProjectRepository(db)

    // Initialize search service
    searchService := services.NewSearchService(
        userRepo,
        productRepo,
        blogRepo,
        projectRepo,
        esService,
        cacheService,
    )

    // Initialize handler
    searchHandler := handlers.NewSearchHandler(searchService)

    // Setup router
    r := gin.Default()
    r.Use(corsMiddleware())

    // Routes
    api := r.Group("/api")
    {
        api.GET("/search", searchHandler.Search)
    }

    // Start server
    log.Println("Server starting on :8080")
    r.Run(":8080")
}

func corsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

---

## Elasticsearch Index Mappings

```json
// Users Index
PUT /users
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { "type": "text", "boost": 3 },
      "username": { "type": "text", "boost": 2 },
      "bio": { "type": "text" },
      "role": { "type": "keyword" },
      "avatar": { "type": "keyword" }
    }
  }
}

// Products Index
PUT /products
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "name": { "type": "text", "boost": 3 },
      "description": { "type": "text" },
      "category": { "type": "keyword" },
      "price": { "type": "float" },
      "stock": { "type": "integer" },
      "rating": { "type": "float" }
    }
  }
}

// Blogs Index
PUT /blogs
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": { "type": "text", "boost": 3 },
      "content": { "type": "text" },
      "excerpt": { "type": "text" },
      "tags": { "type": "keyword" },
      "author_id": { "type": "keyword" },
      "published_at": { "type": "date" },
      "views": { "type": "integer" }
    }
  }
}

// Projects Index
PUT /projects
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": { "type": "text", "boost": 3 },
      "description": { "type": "text" },
      "technologies": { "type": "keyword" },
      "author_id": { "type": "keyword" },
      "stars": { "type": "integer" },
      "forks": { "type": "integer" }
    }
  }
}
```

---

## Deployment

### Docker Compose

```yaml
version: '3.8'

services:
  search-api:
    build: .
    ports:
      - '8080:8080'
    environment:
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - REDIS_URL=redis:6379
      - DATABASE_URL=postgres://user:pass@postgres:5432/esdc
    depends_on:
      - elasticsearch
      - redis
      - postgres

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.1
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - '9200:9200'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=esdc
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    ports:
      - '5432:5432'
```

---

## Performance Optimization

1. **Caching**: Redis cache with 5-minute TTL
2. **Parallel Search**: Concurrent goroutines for each category
3. **Connection Pooling**: Reuse database connections
4. **Index Optimization**: Proper field boosting and analyzers
5. **Pagination**: Limit results to prevent memory issues
6. **Rate Limiting**: Implement per-user rate limits

---

## Testing

```bash
# Search all categories
curl "http://localhost:8080/api/search?q=arduino"

# Search specific category
curl "http://localhost:8080/api/search?q=arduino&category=products"

# With pagination
curl "http://localhost:8080/api/search?q=arduino&page=2&limit=10"
```

---

## Monitoring

- Track search queries and response times
- Monitor Elasticsearch cluster health
- Cache hit/miss ratios
- Popular search terms analytics
