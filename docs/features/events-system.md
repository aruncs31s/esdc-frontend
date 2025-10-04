# Events Management System

## Overview
Complete event management system for club activities, workshops, and seminars.

## Frontend Features
- Event listing with filtering
- Event registration/unregistration
- Calendar view
- Event details and capacity tracking

## Backend Implementation

### Database Schema

```sql
-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255),
    capacity INTEGER DEFAULT 50,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);
```

### API Endpoints

```javascript
// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
    const { upcoming, limit } = req.query;
    let query = `
        SELECT e.*, 
               COUNT(er.user_id) as registered_count,
               CASE WHEN ur.user_id IS NOT NULL THEN true ELSE false END as user_registered
        FROM events e
        LEFT JOIN event_registrations er ON e.id = er.event_id
        LEFT JOIN event_registrations ur ON e.id = ur.event_id AND ur.user_id = $1
        GROUP BY e.id, ur.user_id
    `;
    
    if (upcoming === 'true') {
        query += ' WHERE e.event_date >= CURRENT_DATE';
    }
    
    query += ' ORDER BY e.event_date ASC';
    
    if (limit) {
        query += ` LIMIT ${parseInt(limit)}`;
    }
    
    const result = await db.query(query, [req.user?.id || null]);
    res.json({ events: result.rows });
});

// POST /api/events - Create new event (admin only)
app.post('/api/events', requireAuth, requireAdmin, async (req, res) => {
    const { title, description, event_date, event_time, location, capacity } = req.body;
    
    const result = await db.query(
        'INSERT INTO events (title, description, event_date, event_time, location, capacity, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, description, event_date, event_time, location, capacity, req.user.id]
    );
    
    res.json({ event: result.rows[0] });
});

// POST /api/events/:id/register - Register for event
app.post('/api/events/:id/register', requireAuth, async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    // Check capacity
    const event = await db.query(
        'SELECT capacity, (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1) as registered FROM events WHERE id = $1',
        [eventId]
    );
    
    if (event.rows[0].registered >= event.rows[0].capacity) {
        return res.status(400).json({ message: 'Event is full' });
    }
    
    try {
        await db.query(
            'INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)',
            [eventId, userId]
        );
        res.json({ message: 'Successfully registered for event' });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            res.status(400).json({ message: 'Already registered for this event' });
        } else {
            throw error;
        }
    }
});

// DELETE /api/events/:id/register - Unregister from event
app.delete('/api/events/:id/register', requireAuth, async (req, res) => {
    await db.query(
        'DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
    );
    res.json({ message: 'Successfully unregistered from event' });
});
```

### Middleware

```javascript
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};
```