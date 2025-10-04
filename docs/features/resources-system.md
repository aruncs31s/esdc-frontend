# Resources Management System

## Overview
Centralized learning resources including documents, videos, code repositories, and tutorials.

## Frontend Features
- Resource browsing with category filters
- Search functionality
- Resource ratings and reviews
- Download tracking

## Backend Implementation

### Database Schema

```sql
-- Resources table
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('document', 'video', 'code', 'link', 'tutorial') NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_path VARCHAR(500), -- For uploaded files
    file_size BIGINT, -- In bytes
    tags TEXT[], -- Array of tags
    difficulty_level ENUM('Beginner', 'Intermediate', 'Advanced'),
    created_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource ratings
CREATE TABLE resource_ratings (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource_id, user_id)
);

-- Resource access logs
CREATE TABLE resource_access_logs (
    id SERIAL PRIMARY KEY,
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    access_type ENUM('view', 'download') NOT NULL,
    ip_address INET,
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource categories
CREATE TABLE resource_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

```javascript
// GET /api/resources - Get all resources
app.get('/api/resources', async (req, res) => {
    const { category, type, difficulty, search, limit = 20, offset = 0 } = req.query;
    
    let query = `
        SELECT r.*, 
               u.username as created_by_username,
               COALESCE(AVG(rt.rating), 0) as average_rating,
               COUNT(rt.id) as rating_count
        FROM resources r
        LEFT JOIN users u ON r.created_by = u.id
        LEFT JOIN resource_ratings rt ON r.id = rt.resource_id
        WHERE r.is_public = true
    `;
    
    const params = [];
    let paramCount = 0;
    
    if (category) {
        query += ` AND r.category = $${++paramCount}`;
        params.push(category);
    }
    
    if (type) {
        query += ` AND r.type = $${++paramCount}`;
        params.push(type);
    }
    
    if (difficulty) {
        query += ` AND r.difficulty_level = $${++paramCount}`;
        params.push(difficulty);
    }
    
    if (search) {
        query += ` AND (r.title ILIKE $${++paramCount} OR r.description ILIKE $${paramCount} OR $${paramCount} = ANY(r.tags))`;
        params.push(`%${search}%`);
    }
    
    query += ` 
        GROUP BY r.id, u.username
        ORDER BY r.created_at DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    res.json({ resources: result.rows });
});

// GET /api/resources/:id - Get resource details
app.get('/api/resources/:id', async (req, res) => {
    const resourceId = req.params.id;
    
    // Get resource details
    const resourceResult = await db.query(`
        SELECT r.*, 
               u.username as created_by_username,
               COALESCE(AVG(rt.rating), 0) as average_rating,
               COUNT(rt.id) as rating_count
        FROM resources r
        LEFT JOIN users u ON r.created_by = u.id
        LEFT JOIN resource_ratings rt ON r.id = rt.resource_id
        WHERE r.id = $1 AND r.is_public = true
        GROUP BY r.id, u.username
    `, [resourceId]);
    
    if (resourceResult.rows.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Log view access
    if (req.user) {
        await db.query(`
            INSERT INTO resource_access_logs (resource_id, user_id, access_type, ip_address, user_agent)
            VALUES ($1, $2, 'view', $3, $4)
        `, [resourceId, req.user.id, req.ip, req.get('User-Agent')]);
    }
    
    // Increment view count
    await db.query('UPDATE resources SET view_count = view_count + 1 WHERE id = $1', [resourceId]);
    
    res.json({ resource: resourceResult.rows[0] });
});

// POST /api/resources - Create new resource (authenticated users)
app.post('/api/resources', requireAuth, upload.single('file'), async (req, res) => {
    const { title, description, type, category, url, tags, difficulty_level } = req.body;
    let file_path = null;
    let file_size = null;
    
    if (req.file) {
        file_path = req.file.path;
        file_size = req.file.size;
    }
    
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    const result = await db.query(`
        INSERT INTO resources (title, description, type, category, url, file_path, file_size, tags, difficulty_level, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `, [title, description, type, category, url, file_path, file_size, tagsArray, difficulty_level, req.user.id]);
    
    res.json({ resource: result.rows[0] });
});

// GET /api/resources/:id/download - Download resource
app.get('/api/resources/:id/download', async (req, res) => {
    const resourceId = req.params.id;
    
    const result = await db.query('SELECT * FROM resources WHERE id = $1 AND is_public = true', [resourceId]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
    }
    
    const resource = result.rows[0];
    
    // Log download access
    if (req.user) {
        await db.query(`
            INSERT INTO resource_access_logs (resource_id, user_id, access_type, ip_address, user_agent)
            VALUES ($1, $2, 'download', $3, $4)
        `, [resourceId, req.user.id, req.ip, req.get('User-Agent')]);
    }
    
    // Increment download count
    await db.query('UPDATE resources SET download_count = download_count + 1 WHERE id = $1', [resourceId]);
    
    if (resource.file_path) {
        // Serve local file
        res.download(resource.file_path, resource.title);
    } else {
        // Redirect to external URL
        res.redirect(resource.url);
    }
});

// POST /api/resources/:id/rate - Rate resource
app.post('/api/resources/:id/rate', requireAuth, async (req, res) => {
    const { rating, review } = req.body;
    const resourceId = req.params.id;
    const userId = req.user.id;
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const result = await db.query(`
        INSERT INTO resource_ratings (resource_id, user_id, rating, review)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (resource_id, user_id)
        DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review
        RETURNING *
    `, [resourceId, userId, rating, review]);
    
    res.json({ rating: result.rows[0] });
});

// GET /api/resources/categories - Get all categories
app.get('/api/resources/categories', async (req, res) => {
    const result = await db.query(`
        SELECT rc.*, COUNT(r.id) as resource_count
        FROM resource_categories rc
        LEFT JOIN resources r ON rc.name = r.category AND r.is_public = true
        GROUP BY rc.id
        ORDER BY rc.name
    `);
    
    res.json({ categories: result.rows });
});

// GET /api/resources/stats - Get resource statistics (admin)
app.get('/api/resources/stats', requireAuth, requireAdmin, async (req, res) => {
    const stats = await db.query(`
        SELECT 
            COUNT(*) as total_resources,
            COUNT(*) FILTER (WHERE type = 'document') as documents,
            COUNT(*) FILTER (WHERE type = 'video') as videos,
            COUNT(*) FILTER (WHERE type = 'code') as code_repos,
            SUM(download_count) as total_downloads,
            SUM(view_count) as total_views
        FROM resources
        WHERE is_public = true
    `);
    
    const topResources = await db.query(`
        SELECT title, download_count, view_count
        FROM resources
        WHERE is_public = true
        ORDER BY (download_count + view_count) DESC
        LIMIT 10
    `);
    
    res.json({
        stats: stats.rows[0],
        topResources: topResources.rows
    });
});
```

### File Upload Configuration

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = `uploads/resources/${new Date().getFullYear()}/${new Date().getMonth() + 1}/`;
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.rar', '.mp4', '.avi', '.mov'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```