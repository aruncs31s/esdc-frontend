# Leaderboard & Ranking System

## Overview
Competitive ranking system to gamify learning and encourage participation.

## Frontend Features
- Global leaderboard with rankings
- Timeframe filtering (all-time, monthly, weekly)
- User profile links
- Achievement badges display
- Points breakdown

## Backend Implementation

### Database Schema

```sql
-- Leaderboard rankings (materialized view for performance)
CREATE MATERIALIZED VIEW leaderboard_rankings AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.avatar_url,
    COALESCE(SUM(up.points_earned), 0) as total_points,
    COUNT(DISTINCT cs.challenge_id) FILTER (WHERE cs.status = 'accepted') as challenges_completed,
    COUNT(DISTINCT er.event_id) as events_attended,
    COUNT(DISTINCT ua.achievement_id) as achievements_count,
    RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as global_rank,
    u.created_at as member_since
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id
LEFT JOIN challenge_submissions cs ON u.id = cs.user_id
LEFT JOIN event_registrations er ON u.id = er.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email, u.avatar_url, u.created_at;

-- Monthly leaderboard
CREATE MATERIALIZED VIEW monthly_leaderboard AS
SELECT 
    u.id,
    u.username,
    u.avatar_url,
    COALESCE(SUM(up.points_earned), 0) as monthly_points,
    RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as monthly_rank,
    DATE_TRUNC('month', CURRENT_DATE) as month
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id 
    AND up.earned_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND up.earned_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
WHERE u.is_active = true
GROUP BY u.id, u.username, u.avatar_url;

-- Weekly leaderboard
CREATE MATERIALIZED VIEW weekly_leaderboard AS
SELECT 
    u.id,
    u.username,
    u.avatar_url,
    COALESCE(SUM(up.points_earned), 0) as weekly_points,
    RANK() OVER (ORDER BY COALESCE(SUM(up.points_earned), 0) DESC) as weekly_rank,
    DATE_TRUNC('week', CURRENT_DATE) as week
FROM users u
LEFT JOIN user_points up ON u.id = up.user_id 
    AND up.earned_at >= DATE_TRUNC('week', CURRENT_DATE)
    AND up.earned_at < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
WHERE u.is_active = true
GROUP BY u.id, u.username, u.avatar_url;

-- Leaderboard history for tracking changes
CREATE TABLE leaderboard_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    timeframe ENUM('global', 'monthly', 'weekly') NOT NULL,
    rank_position INTEGER NOT NULL,
    points INTEGER NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to refresh all leaderboard views
CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW leaderboard_rankings;
    REFRESH MATERIALIZED VIEW monthly_leaderboard;
    REFRESH MATERIALIZED VIEW weekly_leaderboard;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh leaderboards
CREATE TRIGGER refresh_leaderboards_on_points
    AFTER INSERT OR UPDATE OR DELETE ON user_points
    FOR EACH STATEMENT EXECUTE FUNCTION refresh_leaderboards();
```

### API Endpoints

```javascript
// GET /api/leaderboard - Get leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    const { timeframe = 'global', limit = 50, offset = 0 } = req.query;
    const currentUserId = req.user?.id;
    
    let query, countQuery;
    const params = [limit, offset];
    
    switch (timeframe) {
        case 'monthly':
            query = `
                SELECT *, 
                       CASE WHEN id = $3 THEN true ELSE false END as is_current_user
                FROM monthly_leaderboard
                ORDER BY monthly_rank ASC
                LIMIT $1 OFFSET $2
            `;
            countQuery = 'SELECT COUNT(*) FROM monthly_leaderboard';
            break;
            
        case 'weekly':
            query = `
                SELECT *, 
                       CASE WHEN id = $3 THEN true ELSE false END as is_current_user
                FROM weekly_leaderboard
                ORDER BY weekly_rank ASC
                LIMIT $1 OFFSET $2
            `;
            countQuery = 'SELECT COUNT(*) FROM weekly_leaderboard';
            break;
            
        default: // global
            query = `
                SELECT *, 
                       CASE WHEN id = $3 THEN true ELSE false END as is_current_user
                FROM leaderboard_rankings
                ORDER BY global_rank ASC
                LIMIT $1 OFFSET $2
            `;
            countQuery = 'SELECT COUNT(*) FROM leaderboard_rankings';
    }
    
    if (currentUserId) {
        params.push(currentUserId);
    } else {
        params.push(null);
    }
    
    const [leaderboardResult, countResult] = await Promise.all([
        db.query(query, params),
        db.query(countQuery)
    ]);
    
    // Get current user's rank if authenticated
    let currentUserRank = null;
    if (currentUserId) {
        let rankQuery;
        switch (timeframe) {
            case 'monthly':
                rankQuery = 'SELECT monthly_rank FROM monthly_leaderboard WHERE id = $1';
                break;
            case 'weekly':
                rankQuery = 'SELECT weekly_rank FROM weekly_leaderboard WHERE id = $1';
                break;
            default:
                rankQuery = 'SELECT global_rank FROM leaderboard_rankings WHERE id = $1';
        }
        
        const rankResult = await db.query(rankQuery, [currentUserId]);
        if (rankResult.rows.length > 0) {
            currentUserRank = rankResult.rows[0][`${timeframe === 'global' ? 'global' : timeframe}_rank`];
        }
    }
    
    res.json({
        leaderboard: leaderboardResult.rows,
        totalUsers: parseInt(countResult.rows[0].count),
        currentUserRank,
        timeframe
    });
});

// GET /api/leaderboard/top/:count - Get top N users
app.get('/api/leaderboard/top/:count', async (req, res) => {
    const count = Math.min(parseInt(req.params.count), 100); // Max 100
    const { timeframe = 'global' } = req.query;
    
    let query;
    switch (timeframe) {
        case 'monthly':
            query = `
                SELECT username, avatar_url, monthly_points as points, monthly_rank as rank
                FROM monthly_leaderboard
                ORDER BY monthly_rank ASC
                LIMIT $1
            `;
            break;
        case 'weekly':
            query = `
                SELECT username, avatar_url, weekly_points as points, weekly_rank as rank
                FROM weekly_leaderboard
                ORDER BY weekly_rank ASC
                LIMIT $1
            `;
            break;
        default:
            query = `
                SELECT username, avatar_url, total_points as points, global_rank as rank
                FROM leaderboard_rankings
                ORDER BY global_rank ASC
                LIMIT $1
            `;
    }
    
    const result = await db.query(query, [count]);
    res.json({ topUsers: result.rows });
});

// GET /api/leaderboard/user/:userId - Get specific user's ranking
app.get('/api/leaderboard/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    const result = await db.query(`
        SELECT 
            lr.username,
            lr.avatar_url,
            lr.total_points,
            lr.global_rank,
            lr.challenges_completed,
            lr.events_attended,
            lr.achievements_count,
            ml.monthly_points,
            ml.monthly_rank,
            wl.weekly_points,
            wl.weekly_rank
        FROM leaderboard_rankings lr
        LEFT JOIN monthly_leaderboard ml ON lr.id = ml.id
        LEFT JOIN weekly_leaderboard wl ON lr.id = wl.id
        WHERE lr.id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found in leaderboard' });
    }
    
    res.json({ userRanking: result.rows[0] });
});

// GET /api/leaderboard/history/:userId - Get user's ranking history
app.get('/api/leaderboard/history/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { timeframe = 'global', days = 30 } = req.query;
    
    const result = await db.query(`
        SELECT rank_position, points, recorded_at
        FROM leaderboard_history
        WHERE user_id = $1 AND timeframe = $2 AND recorded_at >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY recorded_at ASC
    `, [userId, timeframe]);
    
    res.json({ history: result.rows });
});

// GET /api/leaderboard/stats - Get leaderboard statistics
app.get('/api/leaderboard/stats', async (req, res) => {
    const stats = await db.query(`
        SELECT 
            COUNT(*) as total_users,
            AVG(total_points) as average_points,
            MAX(total_points) as highest_points,
            MIN(total_points) FILTER (WHERE total_points > 0) as lowest_points,
            COUNT(*) FILTER (WHERE total_points > 0) as active_users
        FROM leaderboard_rankings
    `);
    
    const topCategories = await db.query(`
        SELECT 
            'challenges' as category,
            AVG(challenges_completed) as average,
            MAX(challenges_completed) as maximum
        FROM leaderboard_rankings
        UNION ALL
        SELECT 
            'events' as category,
            AVG(events_attended) as average,
            MAX(events_attended) as maximum
        FROM leaderboard_rankings
        UNION ALL
        SELECT 
            'achievements' as category,
            AVG(achievements_count) as average,
            MAX(achievements_count) as maximum
        FROM leaderboard_rankings
    `);
    
    res.json({
        stats: stats.rows[0],
        categories: topCategories.rows
    });
});

// POST /api/leaderboard/record-history - Record current rankings (scheduled job)
app.post('/api/leaderboard/record-history', requireAuth, requireAdmin, async (req, res) => {
    // Record global rankings
    await db.query(`
        INSERT INTO leaderboard_history (user_id, timeframe, rank_position, points)
        SELECT id, 'global', global_rank, total_points
        FROM leaderboard_rankings
        WHERE global_rank <= 100 -- Only record top 100
    `);
    
    // Record monthly rankings
    await db.query(`
        INSERT INTO leaderboard_history (user_id, timeframe, rank_position, points)
        SELECT id, 'monthly', monthly_rank, monthly_points
        FROM monthly_leaderboard
        WHERE monthly_rank <= 50 -- Only record top 50
    `);
    
    // Record weekly rankings
    await db.query(`
        INSERT INTO leaderboard_history (user_id, timeframe, rank_position, points)
        SELECT id, 'weekly', weekly_rank, weekly_points
        FROM weekly_leaderboard
        WHERE weekly_rank <= 50 -- Only record top 50
    `);
    
    res.json({ message: 'Leaderboard history recorded successfully' });
});
```

### Scheduled Jobs

```javascript
const cron = require('node-cron');

// Refresh leaderboards every hour
cron.schedule('0 * * * *', async () => {
    try {
        await db.query('REFRESH MATERIALIZED VIEW leaderboard_rankings');
        await db.query('REFRESH MATERIALIZED VIEW monthly_leaderboard');
        await db.query('REFRESH MATERIALIZED VIEW weekly_leaderboard');
        console.log('Leaderboards refreshed successfully');
    } catch (error) {
        console.error('Error refreshing leaderboards:', error);
    }
});

// Record leaderboard history daily at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        // Record top 100 global rankings
        await db.query(`
            INSERT INTO leaderboard_history (user_id, timeframe, rank_position, points)
            SELECT id, 'global', global_rank, total_points
            FROM leaderboard_rankings
            WHERE global_rank <= 100
        `);
        
        console.log('Daily leaderboard history recorded');
    } catch (error) {
        console.error('Error recording leaderboard history:', error);
    }
});

// Reset weekly leaderboard every Monday
cron.schedule('0 0 * * 1', async () => {
    try {
        await db.query('REFRESH MATERIALIZED VIEW weekly_leaderboard');
        console.log('Weekly leaderboard reset');
    } catch (error) {
        console.error('Error resetting weekly leaderboard:', error);
    }
});

// Reset monthly leaderboard on first day of month
cron.schedule('0 0 1 * *', async () => {
    try {
        await db.query('REFRESH MATERIALIZED VIEW monthly_leaderboard');
        console.log('Monthly leaderboard reset');
    } catch (error) {
        console.error('Error resetting monthly leaderboard:', error);
    }
});
```

### Performance Optimization

```javascript
// Index creation for better performance
const createIndexes = async () => {
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_points_user_earned ON user_points(user_id, earned_at)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_status ON challenge_submissions(user_id, status)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_leaderboard_history_user_timeframe ON leaderboard_history(user_id, timeframe, recorded_at)');
};
```