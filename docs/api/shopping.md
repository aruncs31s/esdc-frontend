# Shopping API Documentation

## Database Schema

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cart Table
```sql
CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (optional): Filter by category
- `search` (optional): Search in name/description
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Arduino Starter Kit",
      "description": "Complete Arduino starter kit",
      "price": 45.99,
      "image": "https://example.com/image.jpg",
      "category": "Hardware",
      "stock": 25
    }
  ],
  "total": 100
}
```

#### Get Product by ID
```http
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Arduino Starter Kit",
    "description": "Complete Arduino starter kit",
    "price": 45.99,
    "image": "https://example.com/image.jpg",
    "category": "Hardware",
    "stock": 25
  }
}
```

### Cart

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "name": "Arduino Starter Kit",
      "price": 45.99,
      "image": "https://example.com/image.jpg",
      "quantity": 2,
      "subtotal": 91.98
    }
  ],
  "total": 91.98
}
```

#### Add to Cart
```http
POST /api/cart
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "id": 1,
    "product_id": 1,
    "quantity": 1
  }
}
```

#### Update Cart Item
```http
PUT /api/cart/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated",
  "data": {
    "id": 1,
    "quantity": 3
  }
}
```

#### Remove from Cart
```http
DELETE /api/cart/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

### Wishlist

#### Get User Wishlist
```http
GET /api/wishlist
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product_id": 2,
      "name": "Raspberry Pi 4",
      "price": 75.00,
      "image": "https://example.com/image.jpg",
      "category": "Hardware",
      "stock": 15
    }
  ]
}
```

#### Add to Wishlist
```http
POST /api/wishlist
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist",
  "data": {
    "id": 1,
    "product_id": 2
  }
}
```

#### Remove from Wishlist
```http
DELETE /api/wishlist/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from wishlist"
}
```

### Orders

#### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "total": 121.98,
      "status": "completed",
      "created_at": "2025-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "name": "Arduino Starter Kit",
          "quantity": 2,
          "price": 45.99
        }
      ]
    }
  ],
  "total": 5
}
```

#### Get Order by ID
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total": 121.98,
    "status": "completed",
    "created_at": "2025-01-15T10:30:00Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "name": "Arduino Starter Kit",
        "quantity": 2,
        "price": 45.99
      }
    ]
  }
}
```

#### Create Order (Checkout)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "total": 91.98,
    "status": "pending",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": "Product ID is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Not found",
  "details": "Product not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Conflict",
  "details": "Product already in wishlist"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```

## Notes

- All authenticated endpoints require a valid JWT token in the Authorization header
- Prices are stored and returned as decimal values with 2 decimal places
- Timestamps are in ISO 8601 format (UTC)
- Cart items are automatically removed when products are deleted
- Stock is validated before adding to cart or creating orders
